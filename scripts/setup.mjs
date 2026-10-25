import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {root,runtimeConfig} from './lib/runtime.mjs';

const args=process.argv.slice(2),i=args.indexOf('--runtime'),runtime=i<0?runtimeConfig().path:args[i+1];
function run(cmd,argv,cwd){const r=spawnSync(cmd,argv,{cwd,stdio:'inherit',windowsHide:true});if(r.error)throw r.error;if(r.status!==0)throw new Error(`${path.basename(cmd)} failed (${r.status})`);}
try{
 if(!runtime||!path.isAbsolute(runtime))throw new Error('--runtime requires an absolute directory');
 const wanted=JSON.parse(fs.readFileSync(path.join(root,'runtime/package.json'),'utf8'));
 const ready=Object.entries(wanted.dependencies).every(([name,version])=>{
  try{return JSON.parse(fs.readFileSync(path.join(runtime,'node_modules',name,'package.json'),'utf8')).version===version;}catch{return false;}
 });
 if(!ready){
  if(args.includes('--reuse'))throw new Error('Runtime dependencies do not match pinned versions');
  fs.mkdirSync(runtime,{recursive:true});
  for(const name of ['package.json','package-lock.json'])fs.copyFileSync(path.join(root,'runtime',name),path.join(runtime,name));
  const nodeDir=path.dirname(process.execPath);
  const npm=[process.env.npm_execpath,path.join(nodeDir,'node_modules/npm/bin/npm-cli.js'),path.join(nodeDir,'../lib/node_modules/npm/bin/npm-cli.js')].find(p=>p&&fs.existsSync(p));
  if(!npm)throw new Error('npm CLI not found; install dependencies with npm ci in the runtime directory, then rerun setup');
  run(process.execPath,[npm,'ci','--cache',path.join(runtime,'.npm-cache'),'--no-fund','--no-audit'],runtime);
 }
 const upstream=JSON.parse(fs.readFileSync(path.join(root,'UPSTREAM.json'),'utf8'));
 for(const source of upstream.sources){
  const target=path.join(root,'vendor',source.localSkill);
  if(fs.existsSync(path.join(target,'SKILL.md')))continue;
  const checkout=path.join(runtime,'.upstream',source.commit);
  fs.mkdirSync(checkout,{recursive:true});
  if(!fs.existsSync(path.join(checkout,'.git')))run('git',['init',checkout]);
  run('git',['-C',checkout,'fetch','--depth','1',source.url+'.git',source.commit]);
  run('git',['-C',checkout,'checkout','--detach','FETCH_HEAD']);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.cpSync(path.join(checkout,source.skillPath),target,{recursive:true});
 }
 const previous=runtimeConfig();
 fs.writeFileSync(path.join(root,'runtime.local.json'),JSON.stringify({...previous,path:runtime},null,2)+'\n');
 console.log(JSON.stringify({runtime,dependencies:ready?'reused':'installed',guides:'ready'},null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
