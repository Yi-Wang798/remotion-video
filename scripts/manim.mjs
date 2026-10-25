import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {root,runtimeConfig} from './lib/runtime.mjs';
import {projectFile} from './project.mjs';

const args=process.argv.slice(2),mode=args.shift(),get=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
const runtime=runtimeConfig().path,venv=path.join(runtime,'manim-venv'),python=path.join(venv,process.platform==='win32'?'Scripts/python.exe':'bin/python');
const wanted=JSON.parse(fs.readFileSync(path.join(root,'runtime/manim.json'),'utf8')).version;
function run(command,argv,options={}){const r=spawnSync(command,argv,{stdio:'inherit',windowsHide:true,...options});if(r.error)throw r.error;if(r.status!==0)throw new Error(`${path.basename(command)} failed (${r.status})`);}
try{
 if(mode==='setup'){
  if(!fs.existsSync(python))run(process.env.REMOTION_VIDEO_PYTHON||'python',['-m','venv',venv]);
  const version=spawnSync(python,['-c','import manim; print(manim.__version__)'],{encoding:'utf8',windowsHide:true});
  if(version.status!==0||version.stdout.trim()!==wanted){if(args.includes('--reuse'))throw new Error('Manim runtime does not match '+wanted);run(python,['-m','pip','install','manim=='+wanted,'--cache-dir',path.join(runtime,'.pip-cache'),'--disable-pip-version-check']);}
  run(python,['-m','manim','--version']);
 }else if(mode==='doctor'){
  if(!fs.existsSync(python))throw new Error('Run: node scripts/manim.mjs setup');run(python,['-m','manim','--version']);
 }else if(mode==='render'){
  const project=get('--project'),entry=get('--entry','scene.py'),scene=get('--scene'),quality=get('--quality','l'),fps=Number(get('--fps','30'));
  if(!project||!path.isAbsolute(project)||!scene||!['l','m','h','k'].includes(quality)||!Number.isInteger(fps)||fps<1)throw new Error('Use render --project <absolute-directory> --entry scene.py --scene SceneName [--quality l|m|h|k]');
  if(!fs.existsSync(python))throw new Error('Run: node scripts/manim.mjs setup');
  const media=path.join(project,'renders/manim'),output=projectFile(project,get('--output',`renders/${scene}.mp4`)),stem=path.parse(output).name,started=Date.now();
  if(path.extname(output).toLowerCase()!=='.mp4')throw new Error('The default H.264 output requires an .mp4 path');
  fs.mkdirSync(path.dirname(output),{recursive:true});
  run(python,['-m','manim','-q'+quality,'--fps',String(fps),'--media_dir',media,'-o',stem,projectFile(project,entry),scene],{cwd:project});
  const candidates=[];function scan(dir){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else if(e.name===stem+'.mp4')candidates.push(p);}}scan(media);
  candidates.sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs);if(!candidates.length||fs.statSync(candidates[0]).mtimeMs<started-2000)throw new Error('A current rendered clip was not produced');
  if(path.resolve(candidates[0])!==path.resolve(output))fs.copyFileSync(candidates[0],output);console.log(JSON.stringify({engine:'manim',version:wanted,output},null,2));
 }else throw new Error('Use setup, doctor or render');
}catch(e){console.error(e.message);process.exitCode=1;}
