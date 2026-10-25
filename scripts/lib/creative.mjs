import fs from 'node:fs';
import crypto from 'node:crypto';
import {projectFile} from './project-files.mjs';
import {workflowFor,reviewLevelFor} from './routing.mjs';

export const profiles=['auto','briefing','explanation','story','demonstration','atmosphere','custom'];
export const hasCreativePlan=plan=>(plan.version||1)>=3||Boolean(plan.creative);
export function profileFor(plan){
 const explicit=plan.creative?.profile;
 if(explicit&&explicit!=='auto')return explicit;
 return {data:'briefing',diagram:'explanation',illustration:'story',product:'demonstration'}[plan.taskKind]||'explanation';
}
export function previewModeFor(plan){
 const selected=plan.creative?.previewMode;
 if(['compact','animatic'].includes(selected))return selected;
 return reviewLevelFor(plan)==='segments'||workflowFor(plan)==='designed'?'animatic':'compact';
}
export function designRevision(project,plan){
 const h=crypto.createHash('sha256');
 // Layout implementation and final polish can evolve after the rough preview.
 // Story, shot timing, selected artwork and data determine this revision.
 const {dependencies=[],...creative}=plan.creative||{};
 h.update(JSON.stringify({framework:plan.framework,fps:plan.fps,creative,profile:profileFor(plan),previewMode:previewModeFor(plan),workflow:workflowFor(plan),design:plan.design,characters:plan.characters,references:plan.references,dataSources:plan.dataSources,metrics:plan.metrics,shots:(plan.shots||[]).map(({dependencies,...shot})=>shot)}));
 const files=new Set([...dependencies,...(plan.references||[]).map(r=>r.file),...(plan.dataSources||[]).map(s=>s.file)].filter(Boolean));
 for(const file of [...files].sort()){h.update(file);try{h.update(fs.readFileSync(projectFile(project,file)));}catch{h.update('missing-file');}}
 return h.digest('hex');
}
const nonempty=x=>typeof x==='string'&&Boolean(x.trim());
export function validateCreative(project,plan,{review=false}={}){
 if(!hasCreativePlan(plan))return [];
 const issues=[],c=plan.creative||{};
 const file=(name,label)=>{try{const s=fs.statSync(projectFile(project,name));if(!s.isFile()||!s.size)throw new Error();}catch{issues.push(label+': file missing or invalid');}};
 if(c.profile&&!profiles.includes(c.profile))issues.push('Unknown creative profile');
 if(c.previewMode&&!['auto','compact','animatic'].includes(c.previewMode))issues.push('Unknown creative preview mode');
 if(!plan.shots?.length)issues.push('Creative plan has no shots');
 for(const key of ['audience','promise','opening','progression','payoff'])if(!nonempty(c[key]))issues.push('Creative plan: '+key+' missing');
 for(const s of plan.shots||[])for(const key of ['setup','view','scale','focus','reveal','role'])if(!nonempty(s.visual?.[key]))issues.push(`Shot ${s.id}: visual.${key} missing`);
 for(const dependency of c.dependencies||[])file(dependency,'Creative dependency');
 if(review){
  const r=plan.reviews?.design;
  if(!r||r.status!=='pass')issues.push('Design review not passed');
  else{
   if(r.designRevision!==designRevision(project,plan))issues.push('Design review is stale');
   if(!r.checkedAt||!r.findings?.length)issues.push('Design review needs dated findings');
   if(!r.frames?.length)issues.push('Design review frames missing');
   for(const f of r.frames||[])file(f,'Design review frame');
   if(previewModeFor(plan)==='animatic')file(r.preview,'Animatic preview');
   else if(r.preview)file(r.preview,'Design preview');
  }
 }
 return issues;
}
export function designReport(project,plan){
 const shots=plan.shots||[],fps=plan.fps||30,warnings=[],durations=new Map();
 const key=s=>s.visual?.setup&&s.visual?.view&&s.visual?.scale?JSON.stringify([s.visual.setup,s.visual.view,s.visual.scale]):null;
 let total=0,longest=0,run=[],last=null;
 function closeRun(){
  const seconds=run.reduce((sum,s)=>sum+(s.durationInFrames||0)/fps,0);longest=Math.max(longest,seconds);
  if(run.length>=3)warnings.push({code:'repeated-composition',shotIds:run.map(s=>s.id),seconds:Math.round(seconds*100)/100,message:'Consecutive shots share a setup, view and scale. Review whether the visible event keeps developing.'});
 }
 for(const s of shots){
  const k=key(s),d=(s.durationInFrames||0)/fps;total+=d;
  if(k)durations.set(k,(durations.get(k)||0)+d);
  if(k&&k===last)run.push(s);else{closeRun();run=k?[s]:[];last=k;}
 }
 closeRun();
 const dominant=Math.max(0,...durations.values()),share=total?dominant/total:0;
 if(shots.length>=3&&share>=.6)warnings.push({code:'dominant-composition',share:Math.round(share*100),message:'One setup/view/scale occupies much of the film. Check progression, demonstration value or intentional continuity.'});
 for(let i=1;i<shots.length;i++){
  const a=shots[i-1],b=shots[i];
  if(nonempty(a.visual?.reveal)&&a.visual.reveal.trim()===b.visual?.reveal?.trim())warnings.push({code:'repeated-reveal',shotIds:[a.id,b.id],message:'Adjacent shots declare the same reveal. Check whether one can be shortened or developed.'});
 }
 return {profile:profileFor(plan),previewMode:previewModeFor(plan),designRevision:designRevision(project,plan),seconds:Math.round(total*100)/100,longestRepeatedCompositionSeconds:Math.round(longest*100)/100,dominantCompositionPercent:Math.round(share*100),warnings,issues:validateCreative(project,plan)};
}
