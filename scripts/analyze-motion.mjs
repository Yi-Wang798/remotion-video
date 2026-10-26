import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {analyzeFrames} from './lib/motion-analysis.mjs';
try{
 const args=process.argv.slice(2),i=args.indexOf('--out'),input=args[0],output=args[i+1];if(!input||i<0||!output)throw new Error('Use analyze-motion.mjs <actual-video.mp4> --out <report.json>');
 const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',input],{encoding:'utf8',windowsHide:true});if(probe.status!==0)throw new Error(probe.stderr||'ffprobe unavailable');
 const stream=JSON.parse(probe.stdout).streams?.[0];if(!stream)throw new Error('Video stream missing');const width=96,height=Math.max(16,Math.round(96*stream.height/stream.width)),fps=6;
 const decoded=spawnSync('ffmpeg',['-v','error','-i',input,'-an','-vf',`fps=${fps},scale=${width}:${height},format=gray`,'-f','rawvideo','-'],{maxBuffer:256*1024*1024,windowsHide:true});if(decoded.error||decoded.status!==0)throw new Error(decoded.error?.message||decoded.stderr.toString());
 const size=width*height,frames=[];for(let n=0;n+size<=decoded.stdout.length;n+=size)frames.push(decoded.stdout.subarray(n,n+size));
 const report={input:path.resolve(input),inputSha256:crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex'),checkedAt:new Date().toISOString(),status:'inspect',...analyzeFrames(frames,width,height,fps),interpretation:'Advisory pixel changes with coarse translation/scale compensation; captions in the bottom 18% are excluded. Check listed intervals at playback speed. This does not identify meaningful action, certify quality or block a deliberate hold.'};
 fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({...report,measurements:undefined}));
}catch(e){console.error(e.message);process.exitCode=1;}
