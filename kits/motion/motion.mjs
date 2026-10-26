// Original deterministic motion primitives. Time is supplied by the composition.
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const mix=(a,b,t)=>a+(b-a)*t;
export const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
export function progress(frame,start,end){if(!(end>start))throw new Error('Motion interval must have positive duration');return clamp((frame-start)/(end-start));}
export function keyframes(frame,keys){
 if(!keys.length||keys.some((k,i)=>!Number.isFinite(k.frame)||!Number.isFinite(k.value)||(i&&k.frame<=keys[i-1].frame)))throw new Error('Keyframes need increasing finite frames and values');
 if(frame<=keys[0].frame)return keys[0].value;
 for(let i=1;i<keys.length;i++)if(frame<=keys[i].frame){const a=keys[i-1],b=keys[i];if(frame===b.frame)return b.value;return mix(a.value,b.value,b.hold?0:ease(progress(frame,a.frame,b.frame)));}
 return keys.at(-1).value;
}
export function solveTwoBone(root,target,upper,lower,bend=1){
 if(!(upper>0&&lower>0)||![...root,...target,upper,lower,bend].every(Number.isFinite))throw new Error('Invalid two-bone rig');
 const dx=target[0]-root[0],dy=target[1]-root[1],angle=Math.atan2(dy,dx),d=clamp(Math.hypot(dx,dy),Math.max(Math.abs(upper-lower)+1e-6,1e-6),upper+lower-1e-6);
 const shoulder=angle+Math.sign(bend||1)*Math.acos(clamp((upper*upper+d*d-lower*lower)/(2*upper*d),-1,1));
 return {root:[...root],joint:[root[0]+upper*Math.cos(shoulder),root[1]+upper*Math.sin(shoulder)],end:[root[0]+d*Math.cos(angle),root[1]+d*Math.sin(angle)]};
}
export function bezierPoint(points,t){
 if(points.length!==4)throw new Error('Cubic path needs four points');
 t=clamp(t);const q=1-t;
 const position=[0,1].map(i=>q*q*q*points[0][i]+3*q*q*t*points[1][i]+3*q*t*t*points[2][i]+t*t*t*points[3][i]);
 const tangent=[0,1].map(i=>3*q*q*(points[1][i]-points[0][i])+6*q*t*(points[2][i]-points[1][i])+3*t*t*(points[3][i]-points[2][i]));
 return {position,angle:Math.atan2(tangent[1],tangent[0])*180/Math.PI};
}
export function morphPoints(a,b,t){if(a.length!==b.length||!a.length)throw new Error('Morph contours need equal nonzero point counts');return a.map((p,i)=>p.map((v,j)=>mix(v,b[i][j],clamp(t))));}
export function closedPath(points){
 if(points.length<3)throw new Error('Closed contour needs at least three points');
 const n=points.length,p=i=>points[(i+n)%n];let d=`M${p(0).join(' ')}`;
 for(let i=0;i<n;i++){const [a,b,c,e]=[p(i-1),p(i),p(i+1),p(i+2)];d+=` C${b.map((v,j)=>v+(c[j]-a[j])/6).join(' ')} ${c.map((v,j)=>v-(e[j]-b[j])/6).join(' ')} ${c.join(' ')}`;}return d+' Z';
}
export function blobPoints(cx,cy,radius,{phase=0,amplitude=.04,squash=1,count=20}={}){
 if(!(radius>0&&squash>0)||!Number.isInteger(count)||count<3)throw new Error('Invalid organic contour');
 return Array.from({length:count},(_,i)=>{const a=i/count*Math.PI*2,r=radius*(1+amplitude*Math.sin(a*3+phase)+amplitude*.4*Math.cos(a*5-phase*.7));return [cx+Math.cos(a)*r/squash,cy+Math.sin(a)*r*squash];});
}
export const cameraTransform=({x=0,y=0,zoom=1,rotation=0},width,height)=>`translate(${width/2} ${height/2}) rotate(${-rotation}) scale(${zoom}) translate(${-x} ${-y})`;
export function worldToScreen(point,camera,width,height){const a=-(camera.rotation||0)*Math.PI/180,dx=point[0]-(camera.x||0),dy=point[1]-(camera.y||0),z=camera.zoom??1;return [width/2+z*(dx*Math.cos(a)-dy*Math.sin(a)),height/2+z*(dx*Math.sin(a)+dy*Math.cos(a))];}
export const eventProgress=(frame,event)=>progress(frame,event.frame,event.frame+event.durationInFrames);
export const impact=(frame,at,decay=12)=>frame<at?0:Math.exp(-(frame-at)/decay)*Math.sin((frame-at)*.5);
