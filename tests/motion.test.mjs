import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {solveTwoBone,keyframes,bezierPoint,worldToScreen,blobPoints,closedPath,morphPoints,impact} from '../kits/motion/motion.mjs';
import {synthesize,validateEvents} from '../kits/motion/events.mjs';
import {analyzeFrames} from '../scripts/lib/motion-analysis.mjs';
import {validateVisualPolicy} from '../scripts/lib/visual-policy.mjs';

test('two-bone rig preserves both lengths and reaches or clamps the target without detached joints',()=>{
 for(const target of [[60,30],[500,0],[0,0],[-40,20]])for(const bend of [-1,1]){
  const r=solveTwoBone([0,0],target,55,45,bend),distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  assert.ok(Math.abs(distance(r.root,r.joint)-55)<1e-6);assert.ok(Math.abs(distance(r.joint,r.end)-45)<1e-6);assert.ok([...r.joint,...r.end].every(Number.isFinite));
  if(distance([0,0],target)>=10&&distance([0,0],target)<100)assert.ok(distance(r.end,target)<1e-6);
 }assert.throws(()=>solveTwoBone([0,0],[1,1],0,2));
});
test('pose interpolation is continuous at keys, bounded and independent of render order',()=>{
 const keys=[{frame:0,value:0},{frame:20,value:60},{frame:40,value:-20}];const values=[40,5,0,20,19.999,20.001].map(f=>keyframes(f,keys));assert.equal(values[0],-20);assert.equal(values[3],60);assert.ok(Math.abs(values[4]-values[5])<.001);assert.equal(keyframes(5,keys),values[1]);assert.throws(()=>keyframes(4,[keys[0],keys[0]]));
});
test('intentional pose holds switch exactly at their declared frame',()=>{
 const keys=[{frame:0,value:3},{frame:10,value:8,hold:true}];assert.equal(keyframes(9.99,keys),3);assert.equal(keyframes(10,keys),8);
});
test('motion paths, morphs and world coordinates share deterministic geometry',()=>{
 const p=[[0,0],[0,10],[10,10],[10,0]];assert.deepEqual(bezierPoint(p,0).position,[0,0]);assert.deepEqual(bezierPoint(p,1).position,[10,0]);
 assert.deepEqual(worldToScreen([10,20],{x:10,y:20,zoom:2,rotation:20},1280,720),[640,360]);
 const a=blobPoints(0,0,20),b=blobPoints(10,0,30);assert.deepEqual(morphPoints(a,b,0),a);assert.deepEqual(morphPoints(a,b,1),b);assert.equal(closedPath(a),closedPath(blobPoints(0,0,20)));assert.equal(impact(9,10),0);assert.throws(()=>morphPoints(a,[],.5));
});
test('sound uses frame events, exact duration, silence before the event and deterministic synthesis',()=>{
 const timeline={fps:30,durationInFrames:60,events:[{id:'contact',frame:30,durationInFrames:12,type:'pop',gain:.6,pan:.5}]};
 const a=synthesize(timeline),b=synthesize(timeline);assert.equal(a.samples.length,2*24000*2);assert.deepEqual(a.samples,b.samples);assert.ok(a.samples.slice(0,24000*2).every(x=>x===0));assert.ok(a.samples.some(x=>x!==0));assert.ok(a.samples.every(x=>Number.isFinite(x)&&Math.abs(x*a.normalizationGain)<=.920001));
 assert.throws(()=>validateEvents({...timeline,events:[timeline.events[0],timeline.events[0]]}));assert.throws(()=>validateEvents({...timeline,events:[{...timeline.events[0],frame:59}]}));
});
test('overlapping foley is limited with one common gain, preserving channel balance',()=>{
 const timeline={fps:30,durationInFrames:30,events:Array.from({length:100},(_,i)=>({id:'hit'+i,frame:0,durationInFrames:20,type:'pulse',gain:1,pan:0}))};
 const audio=synthesize(timeline);assert.ok(audio.normalizationGain<1);assert.ok(audio.samples.every((v,i)=>Math.abs(v*audio.normalizationGain)<=.920001&&(i%2||v===audio.samples[i+1])));
});
test('motion analysis distinguishes static, camera translation and local object changes on known frames',()=>{
 const w=96,h=60,n=w*h,a=Uint8Array.from({length:n},(_,i)=>70+((i*73+i*i)%89));
 const staticReport=analyzeFrames(Array.from({length:10},()=>a),w,h);assert.ok(staticReport.intervals.some(r=>r.kind==='near-still'));
 const b=Uint8Array.from({length:n},(_,i)=>a[Math.floor(i/w)*w+Math.min(w-1,i%w+2)]);assert.equal(analyzeFrames([a,b],w,h).counts['global-motion-dominant'],1);
 const c=new Uint8Array(a);for(let y=10;y<35;y++)for(let x=30;x<60;x++)c[y*w+x]=230;assert.equal(analyzeFrames([a,c],w,h).counts['local-change'],1);
 assert.throws(()=>analyzeFrames([a],w,h));
});
test('caption-band changes do not impersonate subject animation',()=>{
 const w=96,h=60,a=new Uint8Array(w*h).fill(90),b=new Uint8Array(a);for(let y=50;y<h;y++)for(let x=0;x<w;x++)b[y*w+x]=230;
 assert.equal(analyzeFrames([a,b],w,h).counts['near-still'],1);
});
test('small strong local changes are not lost in the whole-frame mean',()=>{
 const w=96,h=60,a=new Uint8Array(w*h).fill(90),b=new Uint8Array(a);for(let y=15;y<20;y++)for(let x=20;x<25;x++)b[y*w+x]=180;
 assert.equal(analyzeFrames([a,b],w,h).counts['local-change'],1);
});
test('motion kit installation is repeatable and refuses to overwrite project edits',()=>{
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'motion-install-')),script=fileURLToPath(new URL('../scripts/motion-kit.mjs',import.meta.url)),run=()=>spawnSync(process.execPath,[script,'install','--project',project],{encoding:'utf8'});
 assert.equal(run().status,0);assert.equal(run().status,0);const file=path.join(project,'src/motion-kit/motion.mjs');fs.writeFileSync(file,'user edit');assert.equal(run().status,1);assert.equal(fs.readFileSync(file,'utf8'),'user edit');
});
test('procedural illustrated work is allowed without raster assets but preserves required ImageGen',()=>{
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'procedural-plan-')),plan={version:4,creative:{visualMode:'illustrated',artwork:'procedural',visualReason:'Animate deforming vector geometry',imageGenerationRequired:false},design:{palette:{base:'a',subject:'b',accent:'c'},colorDirection:{intent:'a',contrast:'b',sequence:'c',material:'d'}},references:[],shots:[{id:'a',from:0,durationInFrames:60,overlays:[],visual:{beats:[{frame:0,kind:'action',event:'Contact changes shape'}]}}]};
 assert.deepEqual(validateVisualPolicy(project,plan),[]);plan.creative.imageGenerationRequired=true;assert.ok(validateVisualPolicy(project,plan).some(i=>i.includes('do not downgrade')));
});
test('motion-study mode refuses to overwrite a whole-film review scope',()=>{
 const script=fileURLToPath(new URL('../scripts/review.mjs',import.meta.url));const r=spawnSync(process.execPath,[script,'--study','--all','--shot','x'],{encoding:'utf8'});assert.equal(r.status,1);assert.match(r.stderr,/--study with --shot/);
});
