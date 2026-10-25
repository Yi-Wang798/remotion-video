import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {runtimeRequire,browserExecutable} from './lib/runtime.mjs';
import {loadPlan,revision,shotRevision,reviewLevelFor,designRevision,previewModeFor,validateCreative} from './project.mjs';
import {hasCreativePlan} from './lib/creative.mjs';

const args=process.argv.slice(2),option=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
try{
 const project=option('--project'),id=option('--shot'),compositionId=option('--composition'),design=args.includes('--design');
 if(!project||!path.isAbsolute(project)||!compositionId)throw new Error('Use --project <absolute-directory> --composition <id> and --design, --shot <id> or --all');
 const plan=loadPlan(project),all=design||args.includes('--all')||(!id&&reviewLevelFor(plan)==='light'),shot=all?null:plan.shots.find(s=>s.id===id);
 if(design){if(id)throw new Error('Choose --design or --shot');if(!hasCreativePlan(plan))throw new Error('Add a creative plan before design preview');const issues=validateCreative(project,plan);if(issues.length)throw new Error(issues.join('\n'));}
 if(!all&&(!shot||!Number.isInteger(shot.from)||!Number.isInteger(shot.durationInFrames)||shot.durationInFrames<1))throw new Error('Select a shot with valid timing, or use --all');
 const req=runtimeRequire();
 const {bundle}=await import(pathToFileURL(req.resolve('@remotion/bundler')).href);
 const {openBrowser,selectComposition,renderStill,renderMedia}=await import(pathToFileURL(req.resolve('@remotion/renderer')).href);
 const sourceRevision=revision(project,plan);
 const selectedRevision=design?designRevision(project,plan):all?sourceRevision:shotRevision(project,plan,id);
 const publicDir=path.join(project,'public');
 const executable=browserExecutable(),serveUrl=await bundle({entryPoint:path.join(project,option('--entry','src/index.tsx')),rootDir:project,publicDir:fs.existsSync(publicDir)?publicDir:null});
 const browser=await openBrowser('chrome',{browserExecutable:executable});
 try{
  const composition=await selectComposition({serveUrl,id:compositionId,puppeteerInstance:browser,browserExecutable:executable});
  if(composition.fps!==plan.fps)throw new Error('Plan and composition frame rates differ');
  if(all&&plan.shots.some(s=>!Number.isInteger(s.from)||s.from<0||!Number.isInteger(s.durationInFrames)||s.durationInFrames<1||s.from+s.durationInFrames>composition.durationInFrames))throw new Error('Planned shot lies outside the complete preview');
  const start=all?0:shot.from,end=all?composition.durationInFrames-1:start+shot.durationInFrames-1;
  if(start<0||end>=composition.durationInFrames)throw new Error('Shot lies outside the composition');
  const indexes=new Set([start,... [.2,.5,.8].map(t=>start+Math.round((end-start)*t)),end]);
  if(all){for(const s of plan.shots){indexes.add(Math.min(end,s.from+Math.floor(s.durationInFrames/2)));for(const f of [s.from-1,s.from])if(f>=0&&f<=end)indexes.add(f);}}
  else for(const boundary of [start,end+1])for(const d of [-3,-1,0,1,3]){const f=boundary+d;if(f>=0&&f<composition.durationInFrames)indexes.add(f);}
  for(const value of (option('--samples','').split(',').filter(Boolean))){const f=Number(value);if(!Number.isInteger(f)||f<0||f>=composition.durationInFrames)throw new Error('Invalid extra sample frame');indexes.add(f);}
  const folder=path.join(project,'reviews',design?'design':all?'final':encodeURIComponent(id)),relative=p=>path.relative(project,p).replaceAll('\\','/');
  fs.mkdirSync(folder,{recursive:true});const frames=[];
  for(const frame of [...indexes].sort((a,b)=>a-b)){
   const output=path.join(folder,`frame-${frame}.png`);
   await renderStill({serveUrl,composition,frame,output,puppeteerInstance:browser,browserExecutable:executable,scale:.5});frames.push(relative(output));
  }
  const preview=design&&previewModeFor(plan)==='compact'?null:path.join(folder,'motion.mp4');
  if(preview)await renderMedia({serveUrl,composition,codec:'h264',outputLocation:preview,frameRange:[start,end],puppeteerInstance:browser,browserExecutable:executable,concurrency:2,scale:.5});
  const currentPlan=loadPlan(project),current=design?designRevision(project,currentPlan):all?revision(project,currentPlan):shotRevision(project,currentPlan,id);
  if(design&&revision(project,currentPlan)!==sourceRevision)throw new Error('Source changed during design preview rendering; rerun the preview');
  if(current!==selectedRevision)throw new Error('Selected source changed during review rendering; rerun the interval');
  const evidence={...(design?{scope:'design',designRevision:selectedRevision,previewMode:previewModeFor(plan)}:all?{scope:'final',text:'pending',narration:'pending',visualContinuity:'pending',...(hasCreativePlan(plan)?{engagement:'pending'}:{})}:{shotId:id,shotRevision:selectedRevision}),status:'pending',sourceRevision,frames,...(preview?{preview:relative(preview)}:{}),findings:[],checkedAt:null};
  fs.writeFileSync(path.join(folder,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify(evidence,null,2));
 }finally{await browser.close({silent:true});}
}catch(e){console.error(e.message);process.exitCode=1;}
