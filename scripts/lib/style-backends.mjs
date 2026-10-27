import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {spawn,spawnSync} from 'node:child_process';
import {root,runtimeConfig,browserExecutable} from './runtime.mjs';

export const catalog=()=>JSON.parse(fs.readFileSync(path.join(root,'engines/catalog.json'),'utf8'));
export const styleRuntime=()=>path.join(runtimeConfig().path,'style-tools');
export function selectedStyle(id){const s=catalog().styles.find(s=>s.id===id);if(!s)throw new Error('Unknown local style: '+id);return s;}
export function inside(base,relative){
 if(typeof relative!=='string'||!relative||path.isAbsolute(relative))throw new Error('Use a relative package path');
 const p=path.resolve(base,relative),rel=path.relative(base,p);if(rel==='..'||rel.startsWith('..'+path.sep))throw new Error('Path leaves its package');return p;
}
export function verifyBundles(){
 const results=[];
 for(const [id,b] of Object.entries(catalog().backends)){
  const folder=inside(root,b.root),m=JSON.parse(fs.readFileSync(path.join(folder,'BUNDLE.json'),'utf8'));let count=0;
  if(m.commit!==b.commit)throw new Error('Bundle commit differs: '+id);
  for(const [p,info] of Object.entries(m.files)){const bytes=fs.readFileSync(inside(folder,p));if(bytes.length!==info.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==info.sha256)throw new Error('Bundled source differs: '+id+'/'+p);count++;}
  const supplement=path.join(folder,'SUPPLEMENTAL.json');if(fs.existsSync(supplement))for(const [p,info] of Object.entries(JSON.parse(fs.readFileSync(supplement,'utf8')).files)){const bytes=fs.readFileSync(inside(folder,p));if(bytes.length!==info.bytes||crypto.createHash('sha256').update(bytes).digest('hex')!==info.sha256)throw new Error('Supplemental asset differs: '+id+'/'+p);count++;}
  results.push({backend:id,commit:m.commit,files:count});
 }return results;
}
export function runtimeDoctor(){
 const tools=styleRuntime(),lock=JSON.parse(fs.readFileSync(path.join(root,'runtime/styles/package-lock.json'),'utf8')),packages={};
 for(const name of ['playwright-core','three']){let current;try{current=JSON.parse(fs.readFileSync(path.join(tools,'node_modules',name,'package.json'),'utf8')).version;}catch{}const wanted=lock.packages['node_modules/'+name].version;packages[name]={wanted,current:current||null,ready:current===wanted};}
 const browser=browserExecutable(),ffmpeg=spawnSync('ffmpeg',['-version'],{encoding:'utf8',windowsHide:true});
 return {ready:Object.values(packages).every(p=>p.ready)&&Boolean(browser)&&ffmpeg.status===0,runtime:tools,browser:browser||null,ffmpeg:ffmpeg.status===0,packages};
}
export function createNativeProject(id,project){
 const style=selectedStyle(id),c=catalog(),backend=c.backends[style.backend];if(!path.isAbsolute(project))throw new Error('Project must be absolute');
 if(!style.preview||style.preview.kind==='huashu-svg')throw new Error('Use the dedicated source workflow in this style guide; generic project creation is unavailable');
 if(fs.existsSync(project)&&fs.readdirSync(project).length)throw new Error('Choose a new or empty project directory; existing work is preserved');
 const source=inside(root,backend.root);fs.mkdirSync(path.join(project,'src'),{recursive:true});fs.mkdirSync(path.join(project,'reference'),{recursive:true});
 let library,entry;
 if(style.backend==='huashu'){
  library='src/native';entry='index.html';fs.cpSync(path.join(source,'scripts/engine'),path.join(project,library),{recursive:true});
  fs.writeFileSync(path.join(project,library,'eras.js'),"window.ERAS=[{id:'project_scene',dur:8}];\n");
  fs.writeFileSync(path.join(project,library,'scenes/project_scene.js'),"SCENES.project_scene={draw(){throw new Error('Implement the new subject using the selected local style source before rendering');}};\n");
  if(style.source)fs.copyFileSync(inside(root,style.source),path.join(project,'reference/selected-scene.js'));
 }else{
  library='src/library';entry='src/index.html';fs.mkdirSync(path.join(project,library),{recursive:true});fs.cpSync(path.join(source,'core'),path.join(project,library,'core'),{recursive:true});
  fs.cpSync(inside(root,style.source),path.join(project,'reference/demo'),{recursive:true});
  fs.writeFileSync(path.join(project,'src/index.html'),'<!doctype html><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}canvas{display:block}</style><canvas id="c"></canvas><script type="module" src="main.js"></script>\n');
  fs.writeFileSync(path.join(project,'src/main.js'),"import * as U from '/core/lib.js';\nwindow.DUR=8;window.READY=true;window.render=t=>{throw new Error('Implement the new subject with the selected local style modules before rendering');};\n");
 }
 fs.copyFileSync(inside(root,style.guide),path.join(project,'reference/STYLE.md'));fs.copyFileSync(path.join(source,'LICENSE'),path.join(project,'reference/UPSTREAM-LICENSE'));
 if(fs.existsSync(path.join(source,'licenses')))fs.cpSync(path.join(source,'licenses'),path.join(project,'reference/licenses'),{recursive:true});
 for(const name of ['BUNDLE.json','SUPPLEMENTAL.json'])if(fs.existsSync(path.join(source,name)))fs.copyFileSync(path.join(source,name),path.join(project,'reference',name));
 fs.writeFileSync(path.join(project,'reference/SOURCE.json'),JSON.stringify({style:id,url:backend.url,commit:backend.commit,source:style.source,assets:'Source and font/data notices are retained. Original demo media/voices and persona image frames are excluded.'},null,2)+'\n');
 const descriptor={schema:1,style:id,backend:style.backend,upstreamCommit:backend.commit,library,entry,stage:{width:1920,height:1080}};
 fs.writeFileSync(path.join(project,'native-style.json'),JSON.stringify(descriptor,null,2)+'\n');
 fs.writeFileSync(path.join(project,'reference/BRIEF.md'),'Write the new subject, audience, visual action and ending here. Read STYLE.md and the selected source. Preserve the rendering technique; replace the demo cast, story and composition. The starter deliberately refuses to render until implemented.\n');
 return descriptor;
}

const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.glb':'model/gltf-binary','.bin':'application/octet-stream'};
export async function openNative({id,project,width=1920,height=1080}){
 let style,library,entry,kind,upstreamCommit;
 if(project){const job=JSON.parse(fs.readFileSync(path.join(project,'native-style.json'),'utf8'));style=selectedStyle(job.style);if(job.backend!==style.backend)throw new Error('Project backend differs from style');if(!/^[a-f0-9]{40}$/.test(job.upstreamCommit))throw new Error('Project upstream commit is missing');upstreamCommit=job.upstreamCommit;library=inside(project,job.library);entry=job.entry;kind=job.backend;}
 else {style=selectedStyle(id);if(!style.preview)throw new Error('This local style needs its dedicated source/asset workflow; inspect its guide');kind=style.backend;library=inside(root,catalog().backends[kind].root+(kind==='huashu'?'/scripts/engine':''));entry=style.preview.kind==='huashu-svg'?style.preview.entry:kind==='huashu'?'index.html?film='+style.preview.film:style.preview.directory+'/index.html';}
 upstreamCommit ||= catalog().backends[kind].commit;
 const tools=styleRuntime(),require=createRequire(path.join(tools,'package.json'));
 const {chromium}=require('playwright-core'),errors=[],warnings=[],blocked=[];
 const server=http.createServer((req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let base=library,relative=pathname.slice(1);
   if(pathname.includes('/node_modules/')){base=path.join(tools,'node_modules');relative=pathname.split('/node_modules/').at(-1);}
   else if(pathname.startsWith('/@project/')){if(!project)throw new Error('No project');base=project;relative=pathname.slice('/@project/'.length);}
   const file=inside(base,relative||'index.html');if(!fs.statSync(file).isFile())throw new Error('Not a file');res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
  }catch{res.statusCode=404;res.end('Local file unavailable');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const port=server.address().port;
 let browser;
 try{
  browser=await chromium.launch({executablePath:browserExecutable(),headless:true,args:['--force-color-profile=srgb','--font-render-hinting=none','--disable-accelerated-2d-canvas']});
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  let rejectFatal;const fatal=new Promise((_,reject)=>{rejectFatal=reject;});fatal.catch(()=>{});
  const fail=message=>{errors.push(message);rejectFatal(new Error(message));};
  await page.route('**/*',route=>{const url=new URL(route.request().url());if(['data:','blob:'].includes(url.protocol)||(url.hostname==='127.0.0.1'&&url.port===String(port)))return route.continue();blocked.push(route.request().url());fail('External resource must be prepared locally: '+route.request().url());return route.abort();});
  page.on('pageerror',e=>fail(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico')){const message=r.status()+' '+new URL(r.url()).pathname;warnings.push(message);if(['script','document','image','font','stylesheet'].includes(r.request().resourceType()))fail(message);}});
  let url=`http://127.0.0.1:${port}/`+(project&&kind==='lemo'?'@project/':'')+entry;
  if(project&&kind==='huashu')url+=`?w=${width}&h=${height}`;
  await page.goto(url);await page.evaluate(()=>document.body.classList.add('render'));
  try{await Promise.race([fatal,page.waitForFunction(kind==='huashu'?()=>window.__ready||window.__bootFailed:()=>window.READY===true,null,{timeout:45000})]);}catch(e){throw new Error('Native readiness failed: '+[...errors,...warnings,...blocked].join('; ')+'; '+e.message);}
  await page.evaluate(()=>document.fonts.ready);if(kind==='huashu'){const failed=await page.evaluate(()=>window.__bootFailed);if(failed)throw new Error(failed);}
  if(errors.length)throw new Error(errors.join('\n'));
  return {page,style,upstreamCommit,errors,warnings,blocked,draw:async time=>{
   if(!project&&style.preview.kind==='huashu-svg')await page.evaluate(t=>window.seek(t),time);else if(kind==='huashu')await page.evaluate(({id,time,benchmark})=>benchmark?window.renderSolo(id,time,{counter:false}):window.renderFrame(time),{id:style.preview?.scene,time,benchmark:!project});else await page.evaluate(t=>window.render(t),time);
   if(errors.length)throw new Error(errors.join('\n'));
  },close:async()=>{await browser.close();await new Promise(resolve=>server.close(resolve));}};
 }catch(e){if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));throw e;}
}
export async function renderNative(options){
 const {output,seconds=4,start=0,fps=24,still=false,width=960,height=540}=options;
 if(!path.isAbsolute(output)||fs.existsSync(output))throw new Error('Choose a new absolute output path');
 if(!Number.isFinite(seconds)||seconds<=0||!Number.isFinite(start)||start<0||!Number.isInteger(fps)||fps<1||fps>60||![width,height].every(n=>Number.isInteger(n)&&n>=16&&n<=4096&&n%2===0))throw new Error('Invalid render time, fps or even dimensions');
 if(!options.project&&width*9!==height*16)throw new Error('Upstream benchmark layouts use 16:9. Redesign a project before vertical rendering.');
 const stage=options.project?JSON.parse(fs.readFileSync(path.join(options.project,'native-style.json'),'utf8')).stage||{width,height}:{width:1920,height:1080};
 if(![stage.width,stage.height].every(n=>Number.isInteger(n)&&n>=16&&n<=4096)||stage.width*height!==stage.height*width)throw new Error('Output aspect ratio must match the native project stage; redesign the stage for a new aspect ratio');
 fs.mkdirSync(path.dirname(output),{recursive:true});const lock=output+'.lock',handle=fs.openSync(lock,'wx');fs.closeSync(handle);
 let session,ff,exitPromise;const partial=output+'.'+crypto.randomUUID()+'.partial.mp4';
 try{
  session=await openNative({...options,width:stage.width,height:stage.height});
  if(still){await session.draw(start);await session.page.screenshot({path:output,type:'png'});}
  else{
   ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-vf',`scale=${width}:${height}`,'-c:v','libx264','-crf','18','-pix_fmt','yuv420p',partial],{stdio:['pipe','ignore','pipe'],windowsHide:true});let failure='',pipeError;
   ff.stderr.on('data',b=>failure+=b.toString());ff.stdin.on('error',e=>{pipeError=e;});exitPromise=new Promise((resolve,reject)=>{ff.on('error',reject);ff.on('close',code=>code===0?resolve():reject(new Error(failure||'ffmpeg failed')));});exitPromise.catch(()=>{});
   for(let frame=0;frame<Math.round(seconds*fps);frame++){if(pipeError)throw pipeError;await session.draw(start+frame/fps);const buffer=await session.page.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buffer))await Promise.race([new Promise(resolve=>ff.stdin.once('drain',resolve)),exitPromise]);}
   ff.stdin.end();await exitPromise;fs.renameSync(partial,output);
  }
  const report={scope:options.project?'native-project-render':'upstream-benchmark',style:session.style.id,upstreamCommit:session.upstreamCommit,output,start,width:still?stage.width:width,height:still?stage.height:height,seconds:still?null:seconds,fps:still?null:fps,sha256:crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex'),externalRequestsBlocked:session.blocked,warnings:session.warnings,status:'pending-inspection'};
  fs.writeFileSync(output+'.json',JSON.stringify(report,null,2)+'\n');return report;
 }finally{if(ff&&ff.exitCode===null)ff.kill();if(exitPromise)await exitPromise.catch(()=>{});if(session)await session.close();if(fs.existsSync(partial))fs.unlinkSync(partial);fs.unlinkSync(lock);}
}
