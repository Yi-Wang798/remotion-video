import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {profileFor,previewModeFor,designRevision,designReport,validateCreative,validatePlan,revision} from '../scripts/project.mjs';

const projectScript=fileURLToPath(new URL('../scripts/project.mjs',import.meta.url));
function fixture(profile='explanation'){
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'video-creative-'));
 fs.mkdirSync(path.join(project,'src'));fs.mkdirSync(path.join(project,'reviews'));
 fs.writeFileSync(path.join(project,'src/index.tsx'),'rough composition');
 for(const file of ['frame.png','preview.mp4'])fs.writeFileSync(path.join(project,'reviews',file),'evidence existence fixture, not a visual pass');
 const plan={version:3,taskKind:'diagram',workflow:'direct',reviewLevel:'light',fps:30,framework:'Show how an input changes the outcome',creative:{profile,previewMode:'compact',audience:'Interested viewers',promise:'See the relationship',opening:'Show a visible result',progression:'Change the input and compare outcomes',payoff:'Hold the result',dependencies:[]},design:{palette:['blue']},references:[],shots:[{id:'result',from:0,durationInFrames:240,intent:'Explain the comparison',entryState:'Initial state',action:'Change the input',exitState:'Comparison visible',transitionOut:'Hold the result',visual:{setup:'one-chart',view:'front',scale:'full-chart',focus:'The comparison',reveal:'The result changes with the input',role:'Answer the opening question'},dependencies:['src/index.tsx']}],reviews:{segments:[],design:null,final:null}};
 const evidence={status:'pass',checkedAt:'2026-10-25',findings:['Unit fixture checks records only'],frames:['reviews/frame.png']};
 plan.reviews.design={...evidence,designRevision:designRevision(project,plan)};
 plan.reviews.final={...evidence,sourceRevision:revision(project,plan),preview:'reviews/preview.mp4',text:'pass',narration:'pass',visualContinuity:'pass',engagement:'pass'};
 return {project,plan};
}
test('expression profile and preview effort are independent of rendering path',()=>{
 for(const profile of ['briefing','explanation','story','demonstration','atmosphere','custom']){
  const {project,plan}=fixture(profile);assert.equal(profileFor(plan),profile);assert.equal(previewModeFor(plan),'compact');assert.equal(validatePlan(project,plan,{final:true}).ok,true);
 }
 assert.equal(profileFor({taskKind:'data',creative:{profile:'auto'}}),'briefing');
 assert.equal(previewModeFor({version:3,workflow:'designed',creative:{previewMode:'auto'}}),'animatic');
 assert.equal(previewModeFor({version:3,workflow:'direct',reviewLevel:'segments'}),'animatic');
 assert.equal(previewModeFor({version:1,creative:{previewMode:'auto'}}),'animatic');
});
test('a single-chart compact preview can pass with frames and no generated art or motion movie',()=>{
 const {project,plan}=fixture('briefing');assert.deepEqual(validateCreative(project,plan,{review:true}),[]);assert.equal(plan.reviews.design.preview,undefined);assert.deepEqual(designReport(project,plan).warnings,[]);
});
test('animatics require a real preview file; pending and incomplete records do not pass',()=>{
 const {project,plan}=fixture('story');plan.creative.previewMode='animatic';plan.reviews.design.designRevision=designRevision(project,plan);
 assert.ok(validateCreative(project,plan,{review:true}).some(s=>s.includes('Animatic preview')));
 plan.reviews.design.preview='reviews/preview.mp4';assert.deepEqual(validateCreative(project,plan,{review:true}),[]);
 plan.reviews.design.status='pending';assert.ok(validateCreative(project,plan,{review:true}).includes('Design review not passed'));
 plan.reviews.design.status='pass';plan.reviews.design.frames=[];assert.ok(validateCreative(project,plan,{review:true}).includes('Design review frames missing'));
});
test('story/timing changes invalidate design review while implementation polish preserves it',()=>{
 const {project,plan}=fixture(),before=designRevision(project,plan),full=revision(project,plan);
 fs.writeFileSync(path.join(project,'src/index.tsx'),'polished rendering');assert.equal(designRevision(project,plan),before);assert.notEqual(revision(project,plan),full);
 plan.shots[0].durationInFrames=270;assert.notEqual(designRevision(project,plan),before);assert.ok(validateCreative(project,plan,{review:true}).includes('Design review is stale'));
});
test('selected art and declared design sources are tracked without including review notes',()=>{
 const {project,plan}=fixture();fs.writeFileSync(path.join(project,'board.svg'),'first board');plan.creative.dependencies=['board.svg'];const before=designRevision(project,plan);
 plan.reviews.design.findings.push('A longer reading hold works');assert.equal(designRevision(project,plan),before);
 fs.writeFileSync(path.join(project,'board.svg'),'new framing');assert.notEqual(designRevision(project,plan),before);
 fs.writeFileSync(path.join(project,'art.png'),'art');plan.references=[{id:'art',file:'art.png',generatedWith:'existing'}];const art=designRevision(project,plan);fs.writeFileSync(path.join(project,'art.png'),'revised');assert.notEqual(designRevision(project,plan),art);
});
test('repetition warnings are advisory and a quiet repeated setup can still pass with actual review',()=>{
 const {project,plan}=fixture('atmosphere'),first=plan.shots[0];
 plan.shots=[0,1,2].map(i=>({...first,id:'beat'+i,from:i*240,visual:{...first.visual,reveal:'Light gradually moves across the room'}}));
 plan.reviews.design.designRevision=designRevision(project,plan);plan.reviews.final.sourceRevision=revision(project,plan);
 const report=designReport(project,plan);assert.equal(report.dominantCompositionPercent,100);assert.ok(report.warnings.some(w=>w.code==='repeated-composition'));assert.ok(report.warnings.some(w=>w.code==='repeated-reveal'));assert.equal(validatePlan(project,plan,{final:true}).ok,true);
});
test('viewpoint changes count as different compositions even when the setting is shared',()=>{
 const {project,plan}=fixture();plan.shots=[0,1,2].map(i=>({...plan.shots[0],id:'view'+i,from:i*240,visual:{...plan.shots[0].visual,view:['front','overhead','detail'][i],reveal:'Discovery '+i}}));
 const report=designReport(project,plan);assert.ok(!report.warnings.some(w=>w.code==='repeated-composition'||w.code==='dominant-composition'));
});
test('new exports need a design pass and a final engagement pass even when geometry records pass',()=>{
 const {project,plan}=fixture();plan.reviews.design=null;assert.ok(validatePlan(project,plan,{final:true}).issues.includes('Design review not passed'));
 const g=fixture();delete g.plan.reviews.final.engagement;assert.ok(validatePlan(g.project,g.plan,{final:true}).issues.includes('Complete engagement review missing'));
});
test('missing visual decisions, unsupported profiles and escaping evidence paths are rejected',()=>{
 const {project,plan}=fixture();delete plan.shots[0].visual.reveal;plan.creative.profile='automatic-viral';plan.reviews.design.frames=['../outside.png'];
 const issues=validateCreative(project,plan,{review:true});assert.ok(issues.includes('Unknown creative profile'));assert.ok(issues.some(s=>s.includes('visual.reveal')));assert.ok(issues.some(s=>s.includes('file missing or invalid')));
});
test('init creates version 3 with explicit profile/preview overrides and keeps legacy validation available',()=>{
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'video-creative-init-'));
 const r=spawnSync(process.execPath,[projectScript,'init','--project',project,'--kind','diagram','--profile','atmosphere','--preview','compact'],{encoding:'utf8'});assert.equal(r.status,0);
 const plan=JSON.parse(fs.readFileSync(path.join(project,'video-plan.json'),'utf8'));assert.equal(plan.version,3);assert.equal(plan.creative.profile,'atmosphere');assert.equal(plan.creative.previewMode,'compact');
 assert.deepEqual(validateCreative(project,{version:2}),[]);
});
test('report CLI keeps warnings nonblocking; check-design checks current evidence',()=>{
 const {project,plan}=fixture();plan.shots=[0,1,2].map(i=>({...plan.shots[0],id:'repeat'+i,from:i*240}));fs.writeFileSync(path.join(project,'video-plan.json'),JSON.stringify(plan));
 const report=spawnSync(process.execPath,[projectScript,'design','--project',project],{encoding:'utf8'});assert.equal(report.status,0);assert.ok(JSON.parse(report.stdout).warnings.length);
 const check=spawnSync(process.execPath,[projectScript,'check-design','--project',project],{encoding:'utf8'});assert.equal(check.status,1);assert.match(check.stdout,/Design review is stale/);
});
