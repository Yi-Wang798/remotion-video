import fs from 'node:fs';
import path from 'node:path';
import {spawnSync, spawn} from 'node:child_process';
import {root,runtimeConfig,packageBin,browserExecutable} from './lib/runtime.mjs';
import {loadPlan,validatePlan} from './project.mjs';

const config = runtimeConfig();
const runtime = config.path;
const args = process.argv.slice(2);
const mode = args.shift();
const packageDir = (name) => path.join(runtime, 'node_modules', ...name.split('/'));
const bin=packageBin;
try {
  if (mode === 'manim') {
    const result=spawnSync(process.execPath,[path.join(root,'scripts/manim.mjs'),...args],{stdio:'inherit',windowsHide:true});
    if(result.error)throw result.error;process.exitCode=result.status??1;
  } else if (mode === 'doctor') {
    const versions = {};
    for (const name of ['remotion', '@remotion/cli', '@remotion/renderer', 'remotion-bits', 'react']) {
      versions[name] = JSON.parse(fs.readFileSync(path.join(packageDir(name), 'package.json'), 'utf8')).version;
    }
    console.log(JSON.stringify({root, runtime, node:process.version, versions,
      bitsExecutable:bin('remotion-bits', 'remotion-bits'), remotionExecutable:bin('@remotion/cli', 'remotion')}, null, 2));
  } else if (['bits', 'render', 'export', 'studio', 'still'].includes(mode)) {
    let cwd = runtime;
    if (mode !== 'bits') {
      const index = args.indexOf('--project');
      if (index < 0 || !args[index+1] || !path.isAbsolute(args[index+1])) throw new Error('--project requires an absolute project path');
      cwd = args[index+1];
      args.splice(index, 2);
      if (!fs.statSync(cwd).isDirectory()) throw new Error('Project must be a directory');
      if(mode==='export'){const check=validatePlan(cwd,loadPlan(cwd),{final:true});if(!check.ok)throw new Error(check.issues.join('\n'));}
    }
    if (['render','export','still'].includes(mode) && !args.some(arg => arg === '--browser-executable' || arg.startsWith('--browser-executable='))) {
      const browser=browserExecutable();
      if(browser)args.push('--browser-executable='+browser);
    }
    const executable = mode === 'bits' ? bin('remotion-bits','remotion-bits') : bin('@remotion/cli','remotion');
    const childArgs = mode === 'bits' ? args : [mode==='export'?'render':mode, ...args];
    if (mode === 'studio' || (mode === 'bits' && args[0] === 'mcp')) {
      const child = spawn(process.execPath, [executable, ...childArgs], {cwd, stdio:'inherit', windowsHide:true});
      child.on('error', error => {console.error(error.message); process.exitCode=1;});
      child.on('exit', code => {process.exitCode=code ?? 1;});
      for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => child.kill(signal));
    } else {
      const result = spawnSync(process.execPath, [executable, ...childArgs], {cwd, stdio:'inherit', windowsHide:true});
      if (result.error) throw result.error;
      process.exitCode=result.status ?? 1;
    }
  } else {
    throw new Error('Usage: video.mjs doctor | bits <args> | manim setup/doctor/render <args> | render/export/studio/still --project <absolute-directory> <args>');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode=1;
}
