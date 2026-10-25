import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {workflowFor,reviewLevelFor,revision,shotRevision,validateData,validatePlan} from '../scripts/project.mjs';

function fixture(){
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'adaptive-video-'));
 fs.mkdirSync(path.join(project,'src'));fs.mkdirSync(path.join(project,'assets'));
 fs.writeFileSync(path.join(project,'src/tokens.ts'),'palette');
 for(const id of ['a','b','c','d'])fs.writeFileSync(path.join(project,`src/${id}.tsx`),id);
 fs.writeFileSync(path.join(project,'assets/evidence.png'),'fixture');fs.writeFileSync(path.join(project,'assets/preview.mp4'),'fixture');
 const plan={version:2,taskKind:'diagram',workflow:'auto',reviewLevel:'segments',fps:30,framework:'Four connected diagram states',design:{palette:['blue']},references:[],sharedDependencies:['src/tokens.ts'],shots:['a','b','c','d'].map((id,i)=>({id,from:i*60,durationInFrames:60,intent:id,entryState:'start',action:'move',exitState:'end',transitionOut:'match',dependencies:[`src/${id}.tsx`],screenText:[]})),reviews:{segments:[]}};
 const evidence={status:'pass',frames:['assets/evidence.png'],preview:'assets/preview.mp4',findings:['Fixture checks records, not visual quality'],checkedAt:'2026-10-25'};
 plan.reviews.segments=plan.shots.map(s=>({...evidence,shotId:s.id,shotRevision:shotRevision(project,plan,s.id)}));
 plan.reviews.final={...evidence,sourceRevision:revision(project,plan),text:'pass',narration:'pass',visualContinuity:'pass'};
 return {project,plan};
}
test('routing supports direct data and diagrams, designed art, and legacy plans',()=>{
 assert.equal(workflowFor({version:2,taskKind:'data'}),'direct');assert.equal(reviewLevelFor({version:2,taskKind:'data'}),'light');
 assert.equal(workflowFor({version:2,taskKind:'illustration'}),'designed');assert.equal(reviewLevelFor({version:2,needsCustomArt:true}),'segments');
 assert.equal(workflowFor({}),'designed');assert.equal(workflowFor({version:2,taskKind:'illustration',workflow:'direct'}),'direct');
});
test('direct projects can pass without images; light review still requires final evidence',()=>{
 const {project,plan}=fixture();plan.reviewLevel='light';plan.reviews={};assert.equal(validatePlan(project,plan).ok,true);assert.equal(validatePlan(project,plan,{final:true}).ok,false);
});
test('explicit dependencies invalidate a changed shot and its neighbors, preserving distant shots',()=>{
 const {project,plan}=fixture();assert.equal(validatePlan(project,plan,{final:true}).ok,true);
 fs.writeFileSync(path.join(project,'src/b.tsx'),'changed');const r=validatePlan(project,plan,{final:true});assert.deepEqual(r.staleShots,['a','b','c']);assert.ok(r.issues.includes('Final review is stale'));
});
test('common tokens invalidate every shot; undeclared dependencies fall back conservatively',()=>{
 const {project,plan}=fixture();fs.writeFileSync(path.join(project,'src/tokens.ts'),'red');assert.deepEqual(validatePlan(project,plan).staleShots,['a','b','c','d']);
 const before=shotRevision(project,{...plan,shots:plan.shots.map(s=>({...s,dependencies:[]}))},'d');fs.writeFileSync(path.join(project,'src/a.tsx'),'new');assert.notEqual(shotRevision(project,{...plan,shots:plan.shots.map(s=>({...s,dependencies:[]}))},'d'),before);
});
test('external assets and metric-source changes affect dependent shots and final review',()=>{
 const {project,plan}=fixture();fs.writeFileSync(path.join(project,'assets/voice.wav'),'voice');plan.shots[0].dependencies.push('assets/voice.wav');
 const global=revision(project,plan),local=shotRevision(project,plan,'a'),distant=shotRevision(project,plan,'d');fs.writeFileSync(path.join(project,'assets/voice.wav'),'revised');assert.notEqual(revision(project,plan),global);assert.notEqual(shotRevision(project,plan,'a'),local);assert.equal(shotRevision(project,plan,'d'),distant);
});
function data(){return {taskKind:'data',dataSources:[{id:'old',url:'https://example.org/annual',period:'2024',unit:'million',currency:'CNY'},{id:'new',url:'https://example.org/annual',period:'2025',unit:'million',currency:'CNY'}],metrics:[{id:'a',value:100,sourceId:'old'},{id:'b',value:120,sourceId:'new'},{id:'growth',value:20,formula:{kind:'pctChange',current:'b',previous:'a'}}]};}
test('data checks valid arithmetic, mismatched units/currencies, and nonpositive baselines',()=>{
 const p=data();assert.deepEqual(validateData('.',p),[]);p.metrics[2].value=21;assert.ok(validateData('.',p).some(s=>s.includes('result differs')));p.metrics[2].value=20;p.dataSources[1].currency='USD';assert.ok(validateData('.',p).some(s=>s.includes('incompatible')));p.dataSources[1].currency='CNY';p.metrics[0].value=0;assert.ok(validateData('.',p).some(s=>s.includes('baseline')));
});
test('data requires sources, periods, finite values, and deliberate example provenance',()=>{
 assert.ok(validateData('.',{taskKind:'data'}).length);const p=data();p.dataSources[0].period='';p.metrics[0].value=Infinity;assert.ok(validateData('.',p).length>=2);
 const ex={purpose:'example',taskKind:'data',dataSources:[{id:'demo',kind:'example',period:'Q1',unit:'million'}],metrics:[{id:'v',value:1,sourceId:'demo'}]};assert.deepEqual(validateData('.',ex),[]);delete ex.purpose;assert.ok(validateData('.',ex).length);
});
test('derived metrics retain dimensions and reject formula cycles',()=>{
 const p=data();p.metrics.push({id:'mixed',value:-80,formula:{kind:'difference',current:'growth',previous:'a'}});assert.ok(validateData('.',p).some(s=>s.includes('incompatible')));
 p.metrics[2].formula.current='growth';assert.ok(validateData('.',p).some(s=>s.includes('cyclic formula')));
});
test('selected metrics and their source snapshots are tracked by shot',()=>{
 const {project,plan}=fixture(),p=data();Object.assign(plan,p);plan.taskKind='diagram';fs.writeFileSync(path.join(project,'assets/source.json'),'120');plan.dataSources[1].file='assets/source.json';plan.shots[0].metricIds=['growth'];const before=shotRevision(project,plan,'a'),distant=shotRevision(project,plan,'d');fs.writeFileSync(path.join(project,'assets/source.json'),'121');assert.notEqual(shotRevision(project,plan,'a'),before);assert.equal(shotRevision(project,plan,'d'),distant);
});
test('export refuses missing or stale final review before invoking the renderer',()=>{
 const {project,plan}=fixture();plan.reviewLevel='light';plan.reviews.final=null;fs.writeFileSync(path.join(project,'video-plan.json'),JSON.stringify(plan));
 const script=fileURLToPath(new URL('../scripts/video.mjs',import.meta.url));
 const result=spawnSync(process.execPath,[script,'export','--project',project,'src/index.tsx','Film','renders/final.mp4'],{encoding:'utf8'});
 assert.equal(result.status,1);assert.match(result.stderr,/Complete text\/narration\/visual-continuity pass missing/);
});
