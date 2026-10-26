import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {projectFile} from './lib/project-files.mjs';
import {profiles,hasCreativePlan,validateCreative,designReport} from './lib/creative.mjs';
import {workflowFor,reviewLevelFor} from './lib/routing.mjs';
import {visualModes,validateVisualPolicy} from './lib/visual-policy.mjs';
export {projectFile} from './lib/project-files.mjs';
export {workflowFor,reviewLevelFor} from './lib/routing.mjs';
export {profileFor,previewModeFor,designRevision,designReport,validateCreative} from './lib/creative.mjs';

export function loadPlan(project){return JSON.parse(fs.readFileSync(path.join(project,'video-plan.json'),'utf8'));}
function hash(){return crypto.createHash('sha256');}
function addFile(h,project,file){h.update(file);try{h.update(fs.readFileSync(projectFile(project,file)));}catch{h.update('missing-file');}}
function addTree(h,project,relative){
 const folder=projectFile(project,relative);if(!fs.existsSync(folder))return;
 for(const e of fs.readdirSync(folder,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  const file=path.join(relative,e.name).replaceAll('\\','/');if(e.isSymbolicLink())throw new Error('Declare real source files for review tracking');
  if(e.isDirectory())addTree(h,project,file);else if(e.isFile())addFile(h,project,file);
 }
}
export function revision(project,plan=loadPlan(project)){
 const h=hash();h.update(JSON.stringify({fps:plan.fps,framework:plan.framework,workflow:plan.workflow,reviewLevel:plan.reviewLevel,taskKind:plan.taskKind,needsCustomArt:plan.needsCustomArt,purpose:plan.purpose,design:plan.design,characters:plan.characters,references:plan.references,dataSources:plan.dataSources,metrics:plan.metrics,shots:plan.shots,sharedDependencies:plan.sharedDependencies,...(hasCreativePlan(plan)?{creative:plan.creative}: {})}));
 for(const a of [...(plan.references||[]),...(plan.dataSources||[])])if(a.file)addFile(h,project,a.file);
 for(const file of new Set([...(plan.sharedDependencies||[]),...(plan.shots||[]).flatMap(s=>s.dependencies||[])]))addFile(h,project,file);
 for(const file of plan.creative?.dependencies||[])addFile(h,project,file);
 for(const file of new Set((plan.shots||[]).flatMap(s=>s.assetFiles||[])))addFile(h,project,file);
 addTree(h,project,'src');addTree(h,project,'public');return h.digest('hex');
}
function coreShotRevision(project,plan,s){
 const h=hash();h.update(JSON.stringify({fps:plan.fps,design:plan.design,characters:plan.characters,workflow:workflowFor(plan),shot:s}));
 for(const file of plan.sharedDependencies||[])addFile(h,project,file);
 if(s.dependencies?.length)for(const file of s.dependencies)addFile(h,project,file);else{addTree(h,project,'src');addTree(h,project,'public');}
 for(const id of s.referenceIds||[]){const r=(plan.references||[]).find(r=>r.id===id);h.update(JSON.stringify(r)||'missing-ref');if(r?.file)addFile(h,project,r.file);}
 for(const file of s.assetFiles||[])addFile(h,project,file);
 const metrics=new Map((plan.metrics||[]).map(m=>[m.id,m])),visited=new Set();
 function addMetric(id){if(visited.has(id))return;visited.add(id);const m=metrics.get(id);h.update(JSON.stringify(m)||'missing-metric');if(!m)return;
  const source=(plan.dataSources||[]).find(d=>d.id===m.sourceId);h.update(JSON.stringify(source)||'');if(source?.file)addFile(h,project,source.file);
  for(const parent of [m.formula?.current,m.formula?.previous].filter(Boolean))addMetric(parent);
 }
 for(const id of s.metricIds||[])addMetric(id);return h.digest('hex');
}
export function shotRevision(project,plan,id){
 if((plan.version||1)<2)return revision(project,plan);
 const i=(plan.shots||[]).findIndex(s=>s.id===id);if(i<0)throw new Error('Unknown shot: '+id);
 const h=hash();for(const s of plan.shots.slice(Math.max(0,i-1),i+2))h.update(coreShotRevision(project,plan,s));return h.digest('hex');
}
export function validateData(project,plan){
 const issues=[],sources=plan.dataSources||[],metrics=plan.metrics||[],bySource=new Map(),byMetric=new Map();
 if(plan.taskKind==='data'&&(!sources.length||!metrics.length))issues.push('Data videos need sources and metrics');
 for(const d of sources){
  if(!d.id||bySource.has(d.id))issues.push('Missing or duplicate data source id');bySource.set(d.id,d);
  if(!d.period||!d.unit)issues.push(`Source ${d.id}: period and unit required`);
  if(d.kind==='example'){if(plan.purpose!=='example')issues.push('Example data belongs in an example project');}
  else if(!d.url&&!d.file)issues.push(`Source ${d.id}: URL or snapshot file required`);
  if(d.file){try{if(!fs.statSync(projectFile(project,d.file)).isFile())throw new Error();}catch{issues.push(`Source ${d.id}: snapshot missing`);}}
 }
 for(const m of metrics){if(!m.id||byMetric.has(m.id))issues.push('Missing or duplicate metric id');byMetric.set(m.id,m);if(typeof m.value!=='number'||!Number.isFinite(m.value))issues.push(`Metric ${m.id}: finite numeric value required`);if(!m.formula&&!bySource.has(m.sourceId))issues.push(`Metric ${m.id}: source missing`);}
 const dimensions=new Map(),activeMetrics=new Set();
 function dimension(id){
  if(dimensions.has(id))return dimensions.get(id);
  if(activeMetrics.has(id)){issues.push(`Metric ${id}: cyclic formula`);return null;}
  const m=byMetric.get(id);if(!m)return null;activeMetrics.add(id);
  let result;
  if(m.formula){const a=dimension(m.formula.current),b=dimension(m.formula.previous);if(a&&b&&(a.unit!==b.unit||a.currency!==b.currency))issues.push(`Metric ${id}: incompatible units or currencies`);result=m.formula.kind==='pctChange'?{unit:'%',currency:''}:a;}
  else{const s=bySource.get(m.sourceId);result=s?{unit:s.unit,currency:s.currency||''}:null;}
  activeMetrics.delete(id);dimensions.set(id,result);return result;
 }
 for(const m of metrics)dimension(m.id);
 for(const m of metrics){if(!m.formula)continue;const a=byMetric.get(m.formula.current),b=byMetric.get(m.formula.previous);
  if(!a||!b){issues.push(`Metric ${m.id}: formula inputs missing`);continue;}
  let expected;
  if(m.formula.kind==='difference')expected=a.value-b.value;
  else if(m.formula.kind==='pctChange'){if(b.value<=0){issues.push(`Metric ${m.id}: growth baseline must be positive`);continue;}expected=(a.value-b.value)/b.value*100;}
  else{issues.push(`Metric ${m.id}: unknown formula`);continue;}
  if(!Number.isFinite(expected)||Math.abs(expected-m.value)>1e-6)issues.push(`Metric ${m.id}: formula result differs from value`);
 }
 return issues;
}
export function validatePlan(project,plan,{final=false}={}){
 const issues=[],validFile=(file,label)=>{try{const p=projectFile(project,file);if(!fs.statSync(p).isFile()||!fs.statSync(p).size)throw new Error('missing or empty file');}catch(e){issues.push(`${label}: ${e.message}`);}};
 if(!Number.isInteger(plan.fps)||plan.fps<1||plan.fps>120)issues.push('fps must be an integer from 1 to 120');
 if(!plan.framework?.trim())issues.push('Framework is empty');
 if(plan.workflow&&!['auto','direct','designed'].includes(plan.workflow))issues.push('Unknown workflow');
 if(plan.reviewLevel&&!['auto','light','segments'].includes(plan.reviewLevel))issues.push('Unknown review level');
 issues.push(...validateCreative(project,plan,{review:final}));
 const refs=plan.references||[],ids=new Set();
 for(const r of refs){if(!r.id||ids.has(r.id))issues.push('Missing or duplicate reference id');ids.add(r.id);validFile(r.file,`Reference ${r.id}`);}
 if(workflowFor(plan)==='designed'&&!refs.length)issues.push('Designed videos need chosen visual references');
 const active=new Set(),done=new Set(),byId=new Map(refs.map(r=>[r.id,r]));
 function walk(id){if(active.has(id)){issues.push('Cyclic reference chain: '+id);return;}if(done.has(id)||!byId.has(id))return;active.add(id);for(const parent of byId.get(id).basedOn||[])walk(parent);active.delete(id);done.add(id);}
 for(const r of refs){if(!['built-in-imagegen','existing','user'].includes(r.generatedWith))issues.push(`Reference ${r.id}: missing provenance`);for(const parent of r.basedOn||[])if(!ids.has(parent)||parent===r.id)issues.push(`Reference ${r.id}: invalid parent`);walk(r.id);}
 issues.push(...validateData(project,plan));
 const shots=plan.shots||[],shotIds=new Set(),metricIds=new Set((plan.metrics||[]).map(m=>m.id));let end=0;
 if(!shots.length)issues.push('No shots recorded');
 const rev=revision(project,plan),staleShots=[];
 for(const s of shots){
  if(!s.id||shotIds.has(s.id))issues.push('Missing or duplicate shot id');shotIds.add(s.id);
  if(!Number.isInteger(s.from)||s.from<end||!Number.isInteger(s.durationInFrames)||s.durationInFrames<1)issues.push(`Shot ${s.id}: invalid or overlapping timing`);end=Math.max(end,(s.from||0)+(s.durationInFrames||0));
  for(const key of ['intent','entryState','action','exitState','transitionOut'])if(!s[key]?.trim())issues.push(`Shot ${s.id}: ${key} missing`);
  if(workflowFor(plan)==='designed'&&!s.referenceIds?.length)issues.push(`Shot ${s.id}: no visual reference selected`);
  for(const id of s.referenceIds||[])if(!ids.has(id))issues.push(`Shot ${s.id}: unknown reference ${id}`);
  for(const id of s.metricIds||[])if(!metricIds.has(id))issues.push(`Shot ${s.id}: unknown metric ${id}`);
  if(s.engine&&!['remotion','manim'].includes(s.engine))issues.push(`Shot ${s.id}: unknown engine`);
  for(const file of [...(plan.sharedDependencies||[]),...(s.dependencies||[])])validFile(file,`Shot ${s.id} dependency`);
  for(const file of s.assetFiles||[])validFile(file,`Shot ${s.id} artwork asset`);
  if(reviewLevelFor(plan)==='segments'){
   const r=plan.reviews?.segments?.find(r=>r.shotId===s.id);
   if(!r||r.status!=='pass')issues.push(`Shot ${s.id}: visual review not passed`);
   else{
    const current=r.shotRevision?shotRevision(project,plan,s.id):rev;
    if((r.shotRevision||r.sourceRevision)!==current){issues.push(`Shot ${s.id}: stale review`);staleShots.push(s.id);}
    if(!r.checkedAt||!r.findings?.length)issues.push(`Shot ${s.id}: review needs dated findings`);
    if(!r.frames?.length)issues.push(`Shot ${s.id}: review frames missing`);for(const p of r.frames||[])validFile(p,`Shot ${s.id} review frame`);validFile(r.preview,`Shot ${s.id} motion preview`);
   }
  }
  if(/(拟人化科普动画|非真实显微影像|可爱外表\s*[×x]\s*真实原理|AI-generated illustration)/i.test([s.narration,...(s.screenText||[])].filter(Boolean).join('\n')))issues.push(`Shot ${s.id}: remove production boilerplate from audience copy`);
 }
 if(final){const r=plan.reviews?.final;
  issues.push(...validateVisualPolicy(project,plan,{final:true}).filter(i=>!issues.includes(i)));
  if(hasCreativePlan(plan)&&r?.engagement!=='pass')issues.push('Complete engagement review missing');
  if(!r||r.status!=='pass'||r.text!=='pass'||r.narration!=='pass'||r.visualContinuity!=='pass')issues.push('Complete text/narration/visual-continuity pass missing');
  else{if(r.sourceRevision!==rev)issues.push('Final review is stale');if(!r.checkedAt||!r.findings?.length)issues.push('Final review needs dated findings');validFile(r.preview,'Final preview');if((plan.version||1)>=2){if(!r.frames?.length)issues.push('Final review frames missing');for(const p of r.frames||[])validFile(p,'Final review frame');}}
 }
 return {ok:issues.length===0,workflow:workflowFor(plan),reviewLevel:reviewLevelFor(plan),sourceRevision:rev,staleShots,issues};
}
function main(){
 const args=process.argv.slice(2),mode=args.shift(),get=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];},project=get('--project');
 if(!project||!path.isAbsolute(project))throw new Error('Use --project <absolute-directory>');const file=path.join(project,'video-plan.json');
 if(mode==='init'){
  if(fs.existsSync(file))throw new Error('video-plan.json exists; edit it in place');
  const taskKind=get('--kind','general'),workflow=get('--workflow','auto'),reviewLevel=get('--review','auto'),profile=get('--profile','auto'),previewMode=get('--preview','auto');
  const visualMode=get('--visual',({data:'data',diagram:'schematic'}[taskKind]||'illustrated'));
  const artwork=get('--artwork',visualMode==='illustrated'?'built-in-imagegen':'none');
  if(!visualModes.includes(visualMode)||!['built-in-imagegen','existing','none'].includes(artwork))throw new Error('Invalid visual mode or artwork route');
  if(args.includes('--require-imagegen')&&artwork!=='built-in-imagegen')throw new Error('--require-imagegen needs --artwork built-in-imagegen');
  if(visualMode==='illustrated'&&(workflow==='direct'||reviewLevel==='light'||previewMode==='compact'||artwork==='none'))throw new Error('Illustrated videos need artwork, designed workflow, segment reviews and an animatic');
  if(!['general','data','diagram','illustration','product'].includes(taskKind)||!['auto','direct','designed'].includes(workflow)||!['auto','light','segments'].includes(reviewLevel))throw new Error('Invalid task kind, workflow or review level');
  if(!profiles.includes(profile)||!['auto','compact','animatic'].includes(previewMode))throw new Error('Invalid creative profile or preview mode');
  for(const d of ['src','assets','reviews','renders'])fs.mkdirSync(path.join(project,d),{recursive:true});
  fs.writeFileSync(file,JSON.stringify({version:4,fps:30,taskKind,workflow,reviewLevel,framework:'',creative:{profile,previewMode,visualMode,visualReason:'',artwork,imageGenerationRequired:args.includes('--require-imagegen'),audience:'',promise:'',opening:'',progression:'',payoff:'',dependencies:[]},design:{palette:{},colorDirection:{intent:'',contrast:'',sequence:'',material:''},typography:{},spacing:{},outlines:{}},sharedDependencies:[],characters:[],references:[],dataSources:[],metrics:[],shots:[],reviews:{design:null,segments:[],final:null}},null,2)+'\n');console.log(file);
 }else if(mode==='revision'){const plan=loadPlan(project);console.log(get('--shot')?shotRevision(project,plan,get('--shot')):revision(project,plan));}
 else if(['design','check-design'].includes(mode)){
  const plan=loadPlan(project);if(!hasCreativePlan(plan))throw new Error('Add a creative plan to enable design review; existing version 1/2 production checks remain available');
  const report=designReport(project,plan);if(mode==='check-design')report.issues=validateCreative(project,plan,{review:true});console.log(JSON.stringify({...report,ok:report.issues.length===0},null,2));if(report.issues.length)process.exitCode=1;
 }else if(['check','check-final','affected'].includes(mode)){const r=validatePlan(project,loadPlan(project),{final:mode==='check-final'});console.log(JSON.stringify(mode==='affected'?{staleShots:r.staleShots}:r,null,2));if(mode!=='affected'&&!r.ok)process.exitCode=1;}
 else throw new Error('Use init, revision, design, check-design, affected, check or check-final');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main();}catch(e){console.error(e.message);process.exitCode=1;}}
