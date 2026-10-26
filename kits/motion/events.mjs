// Shared picture/sound event model; all event times are frame indices.
export function validateEvents(spec){
 if(!Number.isInteger(spec.fps)||spec.fps<1||!Number.isInteger(spec.durationInFrames)||spec.durationInFrames<1||!Array.isArray(spec.events))throw new Error('Event timeline needs fps, durationInFrames and events');
 const ids=new Set();
 for(const e of spec.events){
  if(!e.id||ids.has(e.id)||!Number.isInteger(e.frame)||e.frame<0||e.frame>=spec.durationInFrames||!Number.isInteger(e.durationInFrames)||e.durationInFrames<1||e.frame+e.durationInFrames>spec.durationInFrames||!['tap','pop','whoosh','pulse'].includes(e.type)||!Number.isFinite(e.gain)||e.gain<0||e.gain>1||!Number.isFinite(e.pan??0)||Math.abs(e.pan??0)>1)throw new Error('Invalid sound event: '+e.id);
  ids.add(e.id);
 }return spec;
}
export const eventById=(timeline,id)=>{const event=timeline.events.find(e=>e.id===id);if(!event)throw new Error('Unknown event: '+id);return event;};
export function synthesize(timeline,sampleRate=24000){
 validateEvents(timeline);if(!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>96000)throw new Error('Invalid sample rate');
 const count=Math.ceil(timeline.durationInFrames/timeline.fps*sampleRate),samples=new Float32Array(count*2);
 for(const e of timeline.events){
  let seed=[...e.id].reduce((s,c)=>(Math.imul(s,31)+c.charCodeAt(0))>>>0,173),last=0;
  const start=Math.round(e.frame/timeline.fps*sampleRate),n=Math.round(e.durationInFrames/timeline.fps*sampleRate),pan=e.pan??0;
  for(let i=0;i<n&&i+start<count;i++){
   const t=i/sampleRate,p=i/n,env=Math.sin(Math.PI*Math.min(1,p*12))*Math.pow(1-p,2);
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296*2-1;last=last*.84+noise*.16;
   let v=e.type==='tap'?Math.sin(2*Math.PI*180*t)*Math.exp(-t*42):e.type==='pop'?Math.sin(2*Math.PI*(460*t-450*t*t))*Math.exp(-t*20):e.type==='whoosh'?last*Math.sin(Math.PI*p)*2:Math.sin(2*Math.PI*740*t)*Math.exp(-t*12)+.25*Math.sin(2*Math.PI*1110*t)*Math.exp(-t*20);
   v*=env*e.gain*.6;samples[(start+i)*2]+=v*Math.sqrt((1-pan)/2);samples[(start+i)*2+1]+=v*Math.sqrt((1+pan)/2);
  }
 }
 // One common gain preserves event balance and prevents hard clipping.
 let peak=0;for(const v of samples)peak=Math.max(peak,Math.abs(v));const gain=peak>.92?.92/peak:1;
 return {samples,sampleRate,normalizationGain:gain};
}
