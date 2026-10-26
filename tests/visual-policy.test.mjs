import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {validateVisualPolicy} from '../scripts/lib/visual-policy.mjs';
import {workflowFor,reviewLevelFor,previewModeFor,designRevision,revision,shotRevision,designReport,validatePlan} from '../scripts/project.mjs';

function fixture(visualMode='schematic'){
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'video-visual-policy-'));
 for(const dir of ['src','public','assets'])fs.mkdirSync(path.join(project,dir));
 fs.writeFileSync(path.join(project,'src/index.tsx'),'fixture source');
 const shot={id:'a',from:0,durationInFrames:240,overlays:[],visual:{setup:'stage',view:'front',scale:'full',beats:[{frame:0,kind:'reveal',event:'A result appears'}]},dependencies:['src/index.tsx']};
 const plan={version:4,taskKind:'diagram',fps:30,creative:{visualMode,visualReason:'A comparison on stable axes',artwork:'none',imageGenerationRequired:false},design:{palette:{background:'#171047',subject:'#FF647C',accent:'#FFD34F'},colorDirection:{intent:'Playful and bright',contrast:'Warm focal subject on violet',sequence:'Coral becomes amber at the result',material:'Translucent depth with a single key light'}},references:[],shots:[shot],reviews:{final:{shotChecks:[{shotId:'a',development:'Result builds before a reading hold',artwork:'Code geometry fits the chart',color:'Coral focal point remains legible',overlays:'No non-caption text is present'}]}}};
 return {project,plan};
}
function artFixture(){
 const f=fixture('illustrated');f.plan.creative.artwork='built-in-imagegen';
 for(const name of ['assets/master.png','public/subject.png'])fs.writeFileSync(path.join(f.project,name),'file existence fixture only');
 f.plan.references=[{id:'master',file:'assets/master.png',generatedWith:'built-in-imagegen',basedOn:[]}];
 f.plan.shots[0].referenceIds=['master'];f.plan.shots[0].assetFiles=['public/subject.png'];return f;
}
test('an illustration cannot opt out through direct, light or compact overrides',()=>{
 const {project,plan}=artFixture();Object.assign(plan,{workflow:'direct',reviewLevel:'light'});plan.creative.previewMode='compact';
 assert.equal(workflowFor(plan),'designed');assert.equal(reviewLevelFor(plan),'segments');assert.equal(previewModeFor(plan),'animatic');
 const issues=validateVisualPolicy(project,plan);for(const word of ['designed workflow','segment reviews','timed animatic'])assert.ok(issues.some(i=>i.includes(word)));
});
test('image generation requested in the brief cannot be replaced by a diagram classification',()=>{
 const {project,plan}=fixture();plan.creative.imageGenerationRequired=true;
 assert.equal(workflowFor(plan),'designed');assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('do not downgrade')));
 plan.creative.artwork='built-in-imagegen';assert.ok(validateVisualPolicy(project,plan).includes('Built-in ImageGen references missing'));
});
test('generated artwork and actual shot asset declarations are required',()=>{
 const {project,plan}=artFixture();assert.deepEqual(validateVisualPolicy(project,plan,{final:true}),[]);
 plan.shots[0].assetFiles=[];assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('rendered shot')));
 plan.shots[0].assetFiles=['public/missing.png'];assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('artwork asset')));
});
test('later generated frames connect to references; existing art remains usable',()=>{
 const {project,plan}=artFixture();plan.references.push({...plan.references[0],id:'next'});
 assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('connect later')));
 plan.references[1].basedOn=['master'];assert.deepEqual(validateVisualPolicy(project,plan),[]);
 plan.creative.artwork='existing';plan.references=plan.references.map(r=>({...r,generatedWith:'existing'}));assert.deepEqual(validateVisualPolicy(project,plan),[]);
});
test('simple data, geometry and diagrams stay compact and do not need artwork',()=>{
 for(const mode of ['data','geometry','schematic','typography','footage']){
  const {project,plan}=fixture(mode);plan.taskKind='general';assert.equal(workflowFor(plan),'direct');assert.equal(previewModeFor(plan),'compact');assert.deepEqual(validateVisualPolicy(project,plan,{final:true}),[]);
 }
});
test('color decisions and every actual overlay need a declared role',()=>{
 const {project,plan}=fixture();delete plan.design.colorDirection.material;assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('material')));
 plan.shots[0].overlays=[{text:'01 / 08',purpose:'chapter'}];assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('unrequested')));
 plan.shots[0].overlays[0].requested=true;assert.ok(!validateVisualPolicy(project,plan).some(i=>i.includes('unrequested')));
 plan.shots[0].overlays=[{text:'decorative footer',purpose:'decoration'}];assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('useful purpose')));
});
test('looping decoration needs a reason and long intervals prompt actual review',()=>{
 const {project,plan}=artFixture();plan.shots[0].visual.beats=[{frame:0,kind:'loop',event:'Wings oscillate'}];
 assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('hold or loop')));
 assert.ok(designReport(project,plan).warnings.some(w=>w.code==='long-visual-interval'));
 plan.shots[0].visual.beats[0].reason='Hold a quiet pause while the character listens';assert.deepEqual(validateVisualPolicy(project,plan),[]);
 plan.shots[0].visual.beats.push({frame:240,kind:'action',event:'Too late'});assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('invalid visual beat')));
});
test('artwork asset edits invalidate design, final and local production reviews',()=>{
 const {project,plan}=artFixture(),before=[designRevision(project,plan),revision(project,plan),shotRevision(project,plan,'a')];
 fs.writeFileSync(path.join(project,'public/subject.png'),'revised');const after=[designRevision(project,plan),revision(project,plan),shotRevision(project,plan,'a')];
 after.forEach((hash,i)=>assert.notEqual(hash,before[i]));
});
test('final observations cover development, art, color and overlays for every shot',()=>{
 const {project,plan}=fixture();plan.reviews.final.shotChecks=[];assert.equal(validateVisualPolicy(project,plan,{final:true}).length,4);
 assert.deepEqual(validateVisualPolicy(project,plan),[]);assert.deepEqual(validateVisualPolicy(project,{version:3}),[]);
});
test('final plan validation enforces observations even when old pass fields are all filled',()=>{
 const {project,plan}=fixture();Object.assign(plan,{framework:'Compare initial and final values',workflow:'direct',reviewLevel:'light'});
 Object.assign(plan.creative,{profile:'explanation',previewMode:'compact',audience:'Viewers',promise:'See a comparison',opening:'Initial state',progression:'A value changes',payoff:'Final comparison'});
 Object.assign(plan.shots[0],{intent:'Compare',entryState:'Initial',action:'Change',exitState:'Final',transitionOut:'Hold'});
 Object.assign(plan.shots[0].visual,{focus:'Value',reveal:'Comparison',role:'Explain'});
 fs.mkdirSync(path.join(project,'reviews'));for(const file of ['frame.png','preview.mp4'])fs.writeFileSync(path.join(project,'reviews',file),'Unit evidence fixture only');
 const evidence={status:'pass',checkedAt:'2026-10-26',frames:['reviews/frame.png'],findings:['Unit fixture checks validation only']};
 plan.reviews.design={...evidence,designRevision:designRevision(project,plan)};
 Object.assign(plan.reviews.final,evidence,{preview:'reviews/preview.mp4',text:'pass',narration:'pass',visualContinuity:'pass',engagement:'pass',sourceRevision:revision(project,plan)});
 assert.equal(validatePlan(project,plan,{final:true}).ok,true);
 plan.reviews.final.shotChecks=[];assert.ok(validatePlan(project,plan,{final:true}).issues.some(i=>i.includes('final observation')));
});
test('visual mode rather than subject kind controls new routing',()=>{
 const {plan}=fixture('geometry');plan.taskKind='illustration';assert.equal(workflowFor(plan),'direct');
 plan.creative.visualMode='illustrated';plan.taskKind='diagram';assert.equal(workflowFor(plan),'designed');
});
test('init defaults general films to generated illustration while data stays direct',()=>{
 const script=fileURLToPath(new URL('../scripts/project.mjs',import.meta.url));
 for(const kind of ['general','data']){
  const project=fs.mkdtempSync(path.join(os.tmpdir(),'video-visual-init-'));
  const r=spawnSync(process.execPath,[script,'init','--project',project,'--kind',kind],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  const p=JSON.parse(fs.readFileSync(path.join(project,'video-plan.json')));assert.equal(p.version,4);
  assert.equal(p.creative.visualMode,kind==='general'?'illustrated':'data');assert.equal(p.creative.artwork,kind==='general'?'built-in-imagegen':'none');
 }
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'video-conflict-init-'));
 const r=spawnSync(process.execPath,[script,'init','--project',project,'--workflow','direct'],{encoding:'utf8'});assert.equal(r.status,1);assert.ok(!fs.existsSync(path.join(project,'video-plan.json')));
});
