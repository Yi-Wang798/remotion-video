import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {root} from './lib/runtime.mjs';
import {styleRuntime,runtimeDoctor} from './lib/style-backends.mjs';
try{
 const runtime=styleRuntime(),ready=Object.values(runtimeDoctor().packages).every(p=>p.ready);
 if(!ready){
  fs.mkdirSync(runtime,{recursive:true});for(const name of ['package.json','package-lock.json'])fs.copyFileSync(path.join(root,'runtime/styles',name),path.join(runtime,name));
  const dir=path.dirname(process.execPath),npm=[process.env.npm_execpath,path.join(dir,'node_modules/npm/bin/npm-cli.js'),path.join(dir,'../lib/node_modules/npm/bin/npm-cli.js')].find(p=>p&&fs.existsSync(p));
  if(!npm)throw new Error('npm CLI unavailable; run npm ci --ignore-scripts in '+runtime);
  const result=spawnSync(process.execPath,[npm,'ci','--ignore-scripts','--no-fund','--no-audit','--cache',path.join(runtime,'.npm-cache')],{cwd:runtime,stdio:'inherit',windowsHide:true});if(result.status!==0)throw new Error('Style runtime setup failed');
 }
 const report=runtimeDoctor();console.log(JSON.stringify({...report,dependencies:ready?'reused':'installed'},null,2));if(!report.ready)process.exitCode=1;
}catch(e){console.error(e.message);process.exitCode=1;}
