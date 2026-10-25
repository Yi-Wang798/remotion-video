import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export function runtimeConfig(){
 let config={};
 for(const name of ['runtime.local.json','runtime.json']){const p=path.join(root,name);if(fs.existsSync(p)){config=JSON.parse(fs.readFileSync(p,'utf8'));break;}}
 const runtime=process.env.REMOTION_VIDEO_RUNTIME||config.path||path.join(os.homedir(),'.local','share','remotion-video','runtime');
 if(!path.isAbsolute(runtime))throw new Error('Runtime path must be absolute');
 return {...config,path:runtime};
}
export function packageDirectory(name){return path.join(runtimeConfig().path,'node_modules',...name.split('/'));}
export function packageInfo(name){return JSON.parse(fs.readFileSync(path.join(packageDirectory(name),'package.json'),'utf8'));}
export function packageBin(name,key){const info=packageInfo(name),p=typeof info.bin==='string'?info.bin:info.bin?.[key];if(!p)throw new Error(`Executable ${key} missing; run setup.mjs`);return path.resolve(packageDirectory(name),p);}
export function runtimeRequire(){return createRequire(path.join(runtimeConfig().path,'package.json'));}
export function browserExecutable(){
 const configured=process.env.REMOTION_VIDEO_BROWSER||runtimeConfig().browserExecutable;
 if(configured){if(!fs.existsSync(configured))throw new Error('Configured browser is missing');return configured;}
 const candidates=process.platform==='win32'?[path.join(process.env.ProgramFiles||'C:/Program Files','Google/Chrome/Application/chrome.exe'),path.join(process.env['ProgramFiles(x86)']||'C:/Program Files (x86)','Microsoft/Edge/Application/msedge.exe')]:process.platform==='darwin'?['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']:['/usr/bin/google-chrome','/usr/bin/chromium'];
 return candidates.find(p=>fs.existsSync(p));
}
