import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {openNative,createNativeProject} from '../scripts/lib/style-backends.mjs';
const enabled=process.env.REMOTION_VIDEO_NATIVE_TESTS==='1';
for(const id of ['huashu/09_postimp','lemo/scifi-toon'])test('real offline deterministic native frames: '+id,{skip:!enabled},async()=>{
 const session=await openNative({id});try{
  const hash=async t=>{await session.draw(t);return crypto.createHash('sha256').update(await session.page.screenshot({type:'png'})).digest('hex');};
  const a=await hash(12),b=await hash(13),c=await hash(12);assert.equal(a,c);assert.notEqual(a,b);assert.deepEqual(session.blocked,[]);assert.deepEqual(session.warnings,[]);
 }finally{await session.close();}
});
test('unimplemented native starter fails instead of exporting an upstream demo',{skip:!enabled},async()=>{
 const project=fs.mkdtempSync(path.join(os.tmpdir(),'native-unimplemented-'));createNativeProject('huashu/09_postimp',project);await assert.rejects(openNative({project}),/Implement the new subject/);
});
