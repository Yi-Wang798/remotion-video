import fs from 'node:fs';
import path from 'node:path';
import {synthesize} from '../kits/motion/events.mjs';
try{
 const args=process.argv.slice(2),at=args.indexOf('--out'),source=args[0],output=args[at+1];
 if(!source||at<0||!output)throw new Error('Use sound-cues.mjs <timeline.json> --out <sound.wav>');
 const timeline=JSON.parse(fs.readFileSync(source,'utf8')),{samples,sampleRate,normalizationGain}=synthesize(timeline),data=Buffer.alloc(44+samples.length*2);
 data.write('RIFF');data.writeUInt32LE(data.length-8,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(2,22);data.writeUInt32LE(sampleRate,24);data.writeUInt32LE(sampleRate*4,28);data.writeUInt16LE(4,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(samples.length*2,40);
 samples.forEach((v,i)=>data.writeInt16LE(Math.round(v*normalizationGain*32767),44+i*2));fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,data);
 console.log(JSON.stringify({output,seconds:timeline.durationInFrames/timeline.fps,events:timeline.events.map(e=>({id:e.id,seconds:e.frame/timeline.fps})),normalizationGain}));
}catch(e){console.error(e.message);process.exitCode=1;}
