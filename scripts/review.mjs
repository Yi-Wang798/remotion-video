import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {runtimeRequire,browserExecutable} from './lib/runtime.mjs';
import {loadPlan,revision} from './project.mjs';

const args=process.argv.slice(2),option=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
try{
 const project=option('--project'),id=option('--shot'),compositionId=option('--composition');
 if(!project||!path.isAbsolute(project)||!id||!compositionId)throw new Error('Use --project <absolute-directory> --shot <id> --composition <id>');
 const plan=loadPlan(project),shot=plan.shots.find(s=>s.id===id);
 if(!shot||!Number.isInteger(shot.from)||!Number.isInteger(shot.durationInFrames)||shot.durationInFrames<1)throw new Error('Shot has invalid timing');
 const req=runtimeRequire();
 const {bundle}=await import(pathToFileURL(req.resolve('@remotion/bundler')).href);
 const {openBrowser,selectComposition,renderStill,renderMedia}=await import(pathToFileURL(req.resolve('@remotion/renderer')).href);
 const sourceRevision=revision(project,plan);
 const executable=browserExecutable(),serveUrl=await bundle({entryPoint:path.join(project,option('--entry','src/index.tsx'))});
 const browser=await openBrowser('chrome',{browserExecutable:executable});
 try{
  const composition=await selectComposition({serveUrl,id:compositionId,puppeteerInstance:browser,browserExecutable:executable});
  const start=shot.from,end=start+shot.durationInFrames-1;
  if(start<0||end>=composition.durationInFrames)throw new Error('Shot lies outside the composition');
  const indexes=new Set([start,Math.min(end,start+3),... [.2,.5,.8].map(t=>start+Math.round((end-start)*t)),end]);
  for(const boundary of [start,end+1])for(const d of [-3,-1,0,1,3]){const f=boundary+d;if(f>=0&&f<composition.durationInFrames)indexes.add(f);}
  const folder=path.join(project,'reviews',encodeURIComponent(id)),relative=p=>path.relative(project,p).replaceAll('\\','/');
  fs.mkdirSync(folder,{recursive:true});const frames=[];
  for(const frame of [...indexes].sort((a,b)=>a-b)){
   const output=path.join(folder,`frame-${frame}.png`);
   await renderStill({serveUrl,composition,frame,output,puppeteerInstance:browser,browserExecutable:executable,scale:.5});frames.push(relative(output));
  }
  const preview=path.join(folder,'motion.mp4');
  await renderMedia({serveUrl,composition,codec:'h264',outputLocation:preview,frameRange:[start,end],puppeteerInstance:browser,browserExecutable:executable,concurrency:2,scale:.5});
  if(revision(project,loadPlan(project))!==sourceRevision)throw new Error('Source changed during review rendering; rerun the changed interval');
  const evidence={shotId:id,status:'pending',sourceRevision,frames,preview:relative(preview),findings:[],checkedAt:null};
  fs.writeFileSync(path.join(folder,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify(evidence,null,2));
 }finally{await browser.close({silent:true});}
}catch(e){console.error(e.message);process.exitCode=1;}
