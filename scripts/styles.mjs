import path from 'node:path';
import {catalog,selectedStyle,verifyBundles,runtimeDoctor,createNativeProject,renderNative} from './lib/style-backends.mjs';
try{
 const args=process.argv.slice(2),command=args.shift(),option=(key,fallback)=>{const i=args.indexOf(key);return i>=0?args[i+1]:fallback;};
 if(command==='list'){const c=catalog(),backend=option('--backend'),styles=c.styles.filter(s=>!backend||s.backend===backend);console.log(JSON.stringify({backends:c.backends,styles:args.includes('--detail')?styles:styles.map(({id,name,upstreamStatus,availability,verification})=>({id,name,upstreamStatus,availability,verification}))},null,2));}
 else if(command==='show'){console.log(JSON.stringify(selectedStyle(args[0]),null,2));}
 else if(command==='doctor'){const report={...runtimeDoctor(),...(args.includes('--verify')?{bundles:verifyBundles()}:{})};console.log(JSON.stringify(report,null,2));if(!report.ready)process.exitCode=1;}
 else if(command==='create'){console.log(JSON.stringify(createNativeProject(option('--style'),option('--project')),null,2));}
 else if(command==='preview'||command==='render'){
  const size=option('--size','960x540').split('x').map(Number);if(size.length!==2)throw new Error('Use --size WIDTHxHEIGHT');
  const project=option('--project');if(command==='render'&&(!project||!path.isAbsolute(project)))throw new Error('Use render --project <absolute-project>');
  console.log(JSON.stringify(await renderNative({id:command==='preview'?args[0]:undefined,project:command==='render'?project:undefined,output:option('--out'),seconds:Number(option('--seconds','4')),start:Number(option('--at','0')),fps:Number(option('--fps','24')),width:size[0],height:size[1],still:args.includes('--still')}),null,2));
 }else throw new Error('Use list, show <style-id>, doctor [--verify], create --style <id> --project <new-dir>, preview <id> --out <file>, render --project <dir> --out <file>');
}catch(e){console.error(e.message);process.exitCode=1;}
