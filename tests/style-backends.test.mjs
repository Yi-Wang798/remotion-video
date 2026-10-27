import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {catalog,selectedStyle,inside,verifyBundles,createNativeProject,renderNative} from '../scripts/lib/style-backends.mjs';
import {validatePlan} from '../scripts/project.mjs';

test('both upstream engines and actual style source are bundled locally',()=>{
 const c=catalog();assert.equal(c.styles.filter(s=>s.backend==='lemo').length,59);assert.equal(c.styles.filter(s=>s.backend==='huashu'&&s.upstreamStatus==='implemented').length,36);
 for(const s of c.styles){assert.ok(fs.statSync(fileURLToPath(new URL('../'+s.guide,import.meta.url))).size>0);if(s.source)assert.ok(fs.existsSync(fileURLToPath(new URL('../'+s.source,import.meta.url))));}
 assert.ok(c.styles.some(s=>s.upstreamStatus==='research'));assert.ok(c.styles.some(s=>s.backend==='lemo'&&s.omittedDemoAssets.length));
});
test('all redistributed source and fonts match the pinned package inventory',()=>{
 const reports=verifyBundles();assert.equal(reports.length,2);assert.ok(reports.every(r=>r.files>300&&/^[a-f0-9]{40}$/.test(r.commit)));
 const base=fileURLToPath(new URL('../engines/lemo/',import.meta.url)),supplement=JSON.parse(fs.readFileSync(path.join(base,'SUPPLEMENTAL.json'),'utf8'));
 for(const file of Object.keys(supplement.files).filter(f=>f.endsWith('.woff2')))assert.equal(fs.readFileSync(path.join(base,file)).subarray(0,4).toString(),'wOF2');
});
test('package paths cannot escape and unknown styles fail before creating a project',()=>{
 assert.throws(()=>inside(os.tmpdir(),'../private'));assert.throws(()=>selectedStyle('invented/oil'));const project=path.join(os.tmpdir(),'style-missing-'+Date.now());assert.throws(()=>createNativeProject('invented/oil',project));assert.equal(fs.existsSync(project),false);
});
test('native projects receive real selected source and an explicit unimplemented starter',()=>{
 for(const id of ['huashu/09_postimp','lemo/scifi-toon']){
  const project=fs.mkdtempSync(path.join(os.tmpdir(),'native-style-')),job=createNativeProject(id,project);
  assert.equal(job.style,id);assert.ok(fs.readFileSync(path.join(project,'reference/STYLE.md')).equals(fs.readFileSync(fileURLToPath(new URL('../'+selectedStyle(id).guide,import.meta.url)))));assert.ok(fs.existsSync(path.join(project,'reference/UPSTREAM-LICENSE')));
  if(job.backend==='huashu'){assert.ok(fs.readFileSync(path.join(project,'reference/selected-scene.js'),'utf8').includes('P.strokes'));assert.match(fs.readFileSync(path.join(project,'src/native/scenes/project_scene.js'),'utf8'),/Implement the new subject/);}
  else{assert.ok(fs.existsSync(path.join(project,'reference/demo/toon.js')));assert.match(fs.readFileSync(path.join(project,'src/main.js'),'utf8'),/Implement the new subject/);}
  assert.throws(()=>createNativeProject(id,project),/existing work/);
 }
});
test('render argument errors do not overwrite an existing output',async()=>{
 const output=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'native-output-')),'existing.mp4');fs.writeFileSync(output,'keep');await assert.rejects(renderNative({id:'lemo/scifi-toon',output}),/new absolute output/);assert.equal(fs.readFileSync(output,'utf8'),'keep');
 await assert.rejects(renderNative({id:'lemo/scifi-toon',output:output+'2',width:1080,height:1920}),/benchmark layouts/);
});
test('offline style lookup works with network proxy settings made unusable',()=>{
 const script=fileURLToPath(new URL('../scripts/styles.mjs',import.meta.url));const r=spawnSync(process.execPath,[script,'show','huashu/09_postimp'],{encoding:'utf8',env:{...process.env,HTTP_PROXY:'http://127.0.0.1:1',HTTPS_PROXY:'http://127.0.0.1:1'}});assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).backend,'huashu');
});

test('native engines require matching provenance without changing direct data routing',()=>{
 const project=fileURLToPath(new URL('../examples/data-brief/',import.meta.url));const plan=JSON.parse(fs.readFileSync(path.join(project,'video-plan.json'),'utf8'));
 const shot=plan.shots[0];shot.engine='lemo';shot.styleId='lemo/scifi-toon';let report=validatePlan(project,plan);assert.equal(report.workflow,'direct');assert.ok(!report.issues.some(i=>i.includes('engine')||i.includes('styleId')));
 shot.styleId='huashu/09_postimp';assert.ok(validatePlan(project,plan).issues.some(i=>i.includes('matching styleId')));
});

test('native stage mismatch is rejected before output is created',async()=>{
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'native-stage-')),output=path.join(project,'bad.mp4');fs.writeFileSync(path.join(project,'native-style.json'),JSON.stringify({stage:{width:1920,height:1080}}));
 await assert.rejects(renderNative({project,output,width:1080,height:1920}),/aspect ratio/);assert.equal(fs.existsSync(output+'.lock'),false);
});
