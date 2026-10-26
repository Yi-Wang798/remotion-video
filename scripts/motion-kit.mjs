import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),project=args[args.indexOf('--project')+1];
try{
 if(args[0]!=='install'||!args.includes('--project')||!project||!path.isAbsolute(project)||!fs.statSync(project).isDirectory())throw new Error('Use install --project <existing-absolute-directory>');
 const target=path.join(project,'src','motion-kit'),source=path.join(root,'kits','motion');
 for(const dir of [path.join(project,'src'),target])if(fs.existsSync(dir)&&fs.lstatSync(dir).isSymbolicLink())throw new Error('Motion kit destination cannot be a symbolic link');
 const files=fs.readdirSync(source).map(name=>({name,bytes:fs.readFileSync(path.join(source,name))}));
 for(const f of files){const p=path.join(target,f.name);if(fs.existsSync(p)&&(fs.lstatSync(p).isSymbolicLink()||!fs.readFileSync(p).equals(f.bytes)))throw new Error('Existing motion kit edited: '+f.name+'; preserve it and migrate explicitly');}
 fs.mkdirSync(target,{recursive:true});for(const f of files)if(!fs.existsSync(path.join(target,f.name)))fs.writeFileSync(path.join(target,f.name),f.bytes,{flag:'wx'});
 console.log(JSON.stringify({installed:files.map(f=>'src/motion-kit/'+f.name),project}));
}catch(e){console.error(e.message);process.exitCode=1;}
