function error(a,b,width,height,dx=0,dy=0,scale=1){
 let sum=0,count=0;const bottom=Math.floor(height*.82),cx=width/2,cy=height/2;
 for(let y=4;y<bottom-4;y+=3)for(let x=4;x<width-4;x+=3){const xx=Math.round((x-cx)/scale+cx+dx),yy=Math.round((y-cy)/scale+cy+dy);if(xx>=0&&xx<width&&yy>=0&&yy<bottom){sum+=Math.abs(a[yy*width+xx]-b[y*width+x]);count++;}}
 return sum/Math.max(1,count)/255;
}
export function analyzeFrames(frames,width,height,fps=6){
 if(frames.length<2||width<16||height<16||!(fps>0)||frames.some(f=>f.length!==width*height))throw new Error('Need matching grayscale frames, dimensions >=16 and a positive sample rate');
 const samples=[];
 for(let i=1;i<frames.length;i++){
  const a=frames[i-1],b=frames[i],difference=error(a,b,width,height);let residual=difference,changed=0,total=0;
  for(let y=4;y<Math.floor(height*.82)-4;y++)for(let x=4;x<width-4;x++){if(Math.abs(a[y*width+x]-b[y*width+x])>16)changed++;total++;}
  const changedFraction=changed/Math.max(1,total);
  if(difference>.006&&difference<.25)for(const scale of [.96,1,1.04])for(const dx of [-2,0,2])for(const dy of [-2,0,2])residual=Math.min(residual,error(a,b,width,height,dx,dy,scale));
  const transition=difference>=.25,classification=transition?'transition':difference<.006&&changedFraction<.002?'near-still':residual/difference<.32?'global-motion-dominant':'local-change';
  samples.push({at:i/fps,difference,residual,changedFraction,classification});
 }
 const intervals=[];let run=null;
 for(const s of samples){if(['near-still','global-motion-dominant'].includes(s.classification)){if(run?.kind===s.classification)run.to=s.at;else{if(run)intervals.push(run);run={kind:s.classification,from:s.at-1/fps,to:s.at};}}else{if(run)intervals.push(run);run=null;}}if(run)intervals.push(run);
 return {sampleFps:fps,samples:frames.length,seconds:(frames.length-1)/fps,intervals:intervals.filter(r=>r.to-r.from>=1).map(r=>({...r,from:+r.from.toFixed(2),to:+r.to.toFixed(2)})),counts:Object.fromEntries(['near-still','global-motion-dominant','local-change','transition'].map(k=>[k,samples.filter(s=>s.classification===k).length])),measurements:samples};
}
