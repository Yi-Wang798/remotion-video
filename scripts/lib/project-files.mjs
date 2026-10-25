import path from 'node:path';

export function projectFile(project,relative){
 if(typeof relative!=='string'||!relative||path.isAbsolute(relative))throw new Error('Use a project-relative file path');
 const p=path.resolve(project,relative),r=path.relative(project,p);
 if(r==='..'||r.startsWith('..'+path.sep))throw new Error('Path leaves the project');
 return p;
}
