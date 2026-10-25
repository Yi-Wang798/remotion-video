import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {revision,validatePlan,projectFile} from '../scripts/project.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
function fixture(){
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'remotion-plan-test-'));
 fs.mkdirSync(path.join(project,'src'));fs.mkdirSync(path.join(project,'public'));
 fs.writeFileSync(path.join(project,'src/index.tsx'),'export const Scene=()=>null;');
 for(const name of ['reference.png','frame.png','motion.mp4'])fs.writeFileSync(path.join(project,name),'evidence-existence-fixture');
 const plan={fps:30,framework:'A character presses a button.',characters:[],references:[{id:'robot',file:'reference.png',generatedWith:'built-in-imagegen',basedOn:[]}],shots:[{id:'press',intent:'Show a press',narration:'按一下按钮。',screenText:[],referenceIds:['robot'],from:0,durationInFrames:60,entryState:'Hand above button',action:'Hand moves down',exitState:'Button depressed',transitionOut:'Hold the pressed pose'}],reviews:{segments:[],final:null}};
 const rev=revision(project,plan);
 plan.reviews.segments=[{shotId:'press',status:'pass',sourceRevision:rev,frames:['frame.png'],preview:'motion.mp4',findings:['Test fixture for record checks only'],checkedAt:'2026-10-25T00:00:00Z'}];
 return {project,plan};
}
test('a current reviewed segment passes record checks',()=>{const {project,plan}=fixture();assert.equal(validatePlan(project,plan).ok,true);});
test('pending reviews cannot pass and complete-pass records are required',()=>{const {project,plan}=fixture();plan.reviews.segments[0].status='pending';assert.equal(validatePlan(project,plan).ok,false);plan.reviews.segments[0].status='pass';assert.equal(validatePlan(project,plan,{final:true}).ok,false);});
test('changing source, audio or reference pixels makes reviews stale',()=>{
 for(const kind of ['source','audio','reference']){const {project,plan}=fixture(),before=revision(project,plan);
  const file=kind==='source'?'src/index.tsx':kind==='audio'?'public/voice.wav':'reference.png';fs.writeFileSync(path.join(project,file),'changed-'+kind);
  assert.notEqual(revision(project,plan),before);assert.ok(validatePlan(project,plan).issues.some(s=>s.includes('stale')));
 }
});
test('review findings do not invalidate the source revision',()=>{const {project,plan}=fixture(),before=revision(project,plan);plan.reviews.segments[0].findings.push('Spacing checked.');assert.equal(revision(project,plan),before);});
test('missing evidence, a cyclic reference chain and overlapping shots are rejected',()=>{
 const {project,plan}=fixture();fs.unlinkSync(path.join(project,'frame.png'));plan.references[0].basedOn=['robot'];plan.shots.push({...plan.shots[0],id:'next',from:20});const r=validatePlan(project,plan);assert.equal(r.ok,false);assert.ok(r.issues.some(s=>s.includes('overlapping')));assert.ok(r.issues.some(s=>s.includes('reference chain')||s.includes('invalid parent')));
});
test('project-relative evidence paths cannot escape the project',()=>{const {project}=fixture();assert.throws(()=>projectFile(project,'../outside.png'));assert.throws(()=>projectFile(project,path.resolve(project,'frame.png')));});
test('production boilerplate fails while meaningful scientific content remains acceptable',()=>{
 const {project,plan}=fixture();plan.shots[0].narration='有些噬菌体可以先进入溶原状态。';plan.reviews.segments[0].sourceRevision=revision(project,plan);assert.equal(validatePlan(project,plan).ok,true);
 plan.shots[0].screenText=['拟人化科普动画'];assert.ok(validatePlan(project,plan).issues.some(s=>s.includes('boilerplate')));
});
test('init preserves an existing plan instead of overwriting it',()=>{
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'remotion-init-test-')),script=path.join(base,'../scripts/project.mjs');
 let r=spawnSync(process.execPath,[script,'init','--project',project],{encoding:'utf8'});assert.equal(r.status,0);
 fs.writeFileSync(path.join(project,'video-plan.json'),'keep this');r=spawnSync(process.execPath,[script,'init','--project',project],{encoding:'utf8'});assert.equal(r.status,1);assert.equal(fs.readFileSync(path.join(project,'video-plan.json'),'utf8'),'keep this');
});
