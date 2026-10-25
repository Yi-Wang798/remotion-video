import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export function loadPlan(project){return JSON.parse(fs.readFileSync(path.join(project,'video-plan.json'),'utf8'));}
export function projectFile(project,relative){
 if(typeof relative!=='string'||!relative||path.isAbsolute(relative))throw new Error('Evidence and asset paths must be project-relative');
 const p=path.resolve(project,relative),r=path.relative(project,p);
 if(r==='..'||r.startsWith('..'+path.sep))throw new Error('Path leaves the project');
 return p;
}
export function revision(project,plan=loadPlan(project)){
 const hash=crypto.createHash('sha256');
 hash.update(JSON.stringify({framework:plan.framework,characters:plan.characters,references:plan.references,shots:plan.shots}));
 for(const ref of plan.references||[]){try{hash.update(ref.file);hash.update(fs.readFileSync(projectFile(project,ref.file)));}catch{hash.update('missing-reference');}}
 function visit(dir){if(!fs.existsSync(dir))return;for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  const p=path.join(dir,item.name);if(item.isSymbolicLink())throw new Error('Source symlinks are not supported for revision checks');
  if(item.isDirectory())visit(p);else if(item.isFile()){hash.update(path.relative(project,p).replaceAll('\\','/'));hash.update(fs.readFileSync(p));}
 }}
 visit(path.join(project,'src'));visit(path.join(project,'public'));return hash.digest('hex');
}
export function validatePlan(project,plan,{final=false}={}){
 const issues=[],validFile=(relative,label)=>{
  try{const p=projectFile(project,relative);if(!fs.statSync(p).isFile()||fs.statSync(p).size===0)throw new Error('missing or empty file');}
  catch(e){issues.push(`${label}: ${e.message}`);}
 };
 if(!Number.isInteger(plan.fps)||plan.fps<1||plan.fps>120)issues.push('fps must be an integer from 1 to 120');
 if(!plan.framework?.trim())issues.push('Framework is empty');
 const refs=plan.references||[],ids=new Set();
 for(const r of refs){if(!r.id||ids.has(r.id))issues.push('Missing or duplicate reference id');ids.add(r.id);validFile(r.file,`Reference ${r.id}`);}
 if(!refs.length)issues.push('No visual references recorded');
 for(const r of refs){
  if(!['built-in-imagegen','existing','user'].includes(r.generatedWith))issues.push(`Reference ${r.id}: missing provenance`);
  for(const id of r.basedOn||[])if(!ids.has(id)||id===r.id)issues.push(`Reference ${r.id}: invalid parent ${id}`);
 }
 // A reference chain must be acyclic; relationships are not a substitute for viewing the images.
 const active=new Set(),done=new Set(),byId=new Map(refs.map(r=>[r.id,r]));
 function walk(id){if(active.has(id)){issues.push(`Cyclic reference chain at ${id}`);return;}if(done.has(id)||!byId.has(id))return;active.add(id);for(const parent of byId.get(id).basedOn||[])walk(parent);active.delete(id);done.add(id);}
 for(const r of refs)walk(r.id);
 const shots=plan.shots||[],shotIds=new Set();let end=0;
 if(!shots.length)issues.push('No shots recorded');
 const rev=revision(project,plan);
 for(const s of shots){
  if(!s.id||shotIds.has(s.id))issues.push('Missing or duplicate shot id');shotIds.add(s.id);
  if(!Number.isInteger(s.from)||s.from<end||!Number.isInteger(s.durationInFrames)||s.durationInFrames<1)issues.push(`Shot ${s.id}: invalid or overlapping timing`);
  end=Math.max(end,(s.from||0)+(s.durationInFrames||0));
  for(const key of ['intent','entryState','action','exitState','transitionOut'])if(!s[key]?.trim())issues.push(`Shot ${s.id}: ${key} missing`);
  if(!s.referenceIds?.length)issues.push(`Shot ${s.id}: no reference selected`);
  for(const id of s.referenceIds||[])if(!ids.has(id))issues.push(`Shot ${s.id}: unknown reference ${id}`);
  const review=plan.reviews?.segments?.find(r=>r.shotId===s.id);
  if(!review||review.status!=='pass')issues.push(`Shot ${s.id}: visual review not passed`);
  else{
   if(review.sourceRevision!==rev)issues.push(`Shot ${s.id}: stale review`);
   if(!review.checkedAt||!Array.isArray(review.findings)||review.findings.length===0)issues.push(`Shot ${s.id}: review needs dated findings`);
   if(!review.frames?.length)issues.push(`Shot ${s.id}: review frames missing`);
   for(const p of review.frames||[])validFile(p,`Shot ${s.id} review frame`);
   validFile(review.preview,`Shot ${s.id} motion preview`);
  }
  const text=[s.narration,...(s.screenText||[])].filter(Boolean).join('\n');
  const boilerplate=/(拟人化科普动画|非真实显微影像|可爱外表\s*[×x]\s*真实原理|AI-generated illustration)/i;
  if(boilerplate.test(text))issues.push(`Shot ${s.id}: remove production boilerplate from audience copy`);
 }
 if(final){const r=plan.reviews?.final;
  if(!r||r.status!=='pass'||r.text!=='pass'||r.narration!=='pass'||r.visualContinuity!=='pass')issues.push('Complete text/narration/visual-continuity pass missing');
  else{if(r.sourceRevision!==rev)issues.push('Final review is stale');if(!r.checkedAt||!r.findings?.length)issues.push('Final review needs dated findings');validFile(r.preview,'Final preview');}
 }
 return {ok:issues.length===0,sourceRevision:rev,issues};
}
function main(){
 const args=process.argv.slice(2),mode=args.shift(),i=args.indexOf('--project'),project=i>=0?args[i+1]:null;
 if(!project||!path.isAbsolute(project))throw new Error('Use --project <absolute-directory>');
 const planPath=path.join(project,'video-plan.json');
 if(mode==='init'){
  if(fs.existsSync(planPath))throw new Error('video-plan.json exists; edit it in place');
  for(const d of ['src','assets/references','storyboard','reviews','renders'])fs.mkdirSync(path.join(project,d),{recursive:true});
  const plan={version:1,fps:30,framework:'',characters:[],references:[],shots:[],reviews:{segments:[],final:null}};
  fs.writeFileSync(planPath,JSON.stringify(plan,null,2)+'\n');console.log(planPath);
 }else if(mode==='revision')console.log(revision(project));
 else if(mode==='check'||mode==='check-final'){const result=validatePlan(project,loadPlan(project),{final:mode==='check-final'});console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;}
 else throw new Error('Usage: project.mjs init|revision|check|check-final --project <absolute-directory>');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main();}catch(e){console.error(e.message);process.exitCode=1;}}
