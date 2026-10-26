import React from 'react';
import {AbsoluteFill,Composition,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {World,OrganicShape,Limb} from './motion-kit/components';
import {bezierPoint,blobPoints,ease,impact,mix,progress} from './motion-kit/motion.mjs';
import {eventById} from './motion-kit/events.mjs';
import timeline from '../timeline.json';

const W=1280,H=720;
const Frame=({material}:{material:'soft'|'paper'})=>{
 const f=useCurrentFrame(),contact=eventById(timeline,'contact').frame,release=eventById(timeline,'release').frame,arrive=eventById(timeline,'arrival').frame;
 const move=ease(progress(f,8,75)),open=ease(progress(f,contact+12,126)),sent=ease(progress(f,release,arrive));
 const [x,y]=bezierPoint([[210,420],[330,310],[455,340],[540,360]],move).position;
 const squash=1+.07*impact(f,contact),camera={x:mix(615,675,ease(progress(f,45,100))),y:360,zoom:mix(1.02,1.12,ease(progress(f,45,100)))-.13*ease(progress(f,205,239))};
 const paper=material==='paper',ink='#24415B',cell=blobPoints(1040,365,350,{phase:0,amplitude:.025,count:40});
 const deformed=cell.map(([px,py])=>[px+22*Math.exp(-Math.pow((py-365)/72,2))*Math.max(0,(1040-px)/350)*Math.max(0,impact(f,contact,18)),py]);
 const warm=progress(f,arrive,arrive+22),handT=ease(progress(f,42,contact));
 return <AbsoluteFill style={{background:paper?'#FFF0CD':'#E1F8F4'}}><svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
  <defs>
   <radialGradient id="field"><stop stopColor="#FCFFE9"/><stop offset="1" stopColor="#BAE9E5"/></radialGradient>
   <radialGradient id="cell" cx=".3" cy=".28"><stop stopColor="#B8F6DB"/><stop offset=".7" stopColor="#56CDBF" stopOpacity=".68"/><stop offset="1" stopColor="#1A9BA5" stopOpacity=".9"/></radialGradient>
   <radialGradient id="parcel" cx=".28" cy=".2"><stop stopColor="#FFE68A"/><stop offset=".55" stopColor="#FFAC4A"/><stop offset="1" stopColor="#EA5B49"/></radialGradient>
   <linearGradient id="gate" x2="1" y2="1"><stop stopColor="#B6F8E7"/><stop offset=".5" stopColor="#25AEB1"/><stop offset="1" stopColor="#257E9B"/></linearGradient>
   <filter id="shade" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx={paper?7:0} dy={paper?9:10} stdDeviation={paper?0:12} floodColor="#275C6E" floodOpacity=".18"/></filter>
   <mask id="edge"><rect width="1600" height="1000" fill="white"/><rect x="644" y={365-open*43} width="83" height={open*86} rx="20" fill="black"/></mask>
  </defs>
  <rect width={W} height={H} fill={paper?'#FFF0CD':'url(#field)'}/>
  <World camera={camera} width={W} height={H}>
   <path d="M-80 620 Q520 690 1510 600" stroke={paper?'#E8CC9B':'#AFDBD4'} strokeWidth="2" fill="none"/>
   <g filter="url(#shade)"><OrganicShape points={deformed} fill={paper?'#8AD9CA':'url(#cell)'}/></g>
   <g mask="url(#edge)"><OrganicShape points={deformed} fill="none" stroke={paper?ink:'#187F93'} strokeWidth={paper?4:7}/></g>
   {[0,1,2].map(i=><ellipse key={i} cx={940+i*95} cy={255+(i%2)*205} rx="38" ry="24" fill={paper?'#57BCAE':'#C6F9D9'} opacity=".48" transform={`rotate(${i*28} ${940+i*95} ${255+(i%2)*205})`}/>)}
   <ellipse cx="515" cy="550" rx={72+move*14} ry="12" fill={ink} opacity=".08"/>
   <Limb root={[x+22,y+26]} target={[mix(x+55,680,handT),mix(y+75,410-open*3,handT)]} upper={68} lower={58} bend={1} color={ink} width={paper?13:15}/>
   <g transform={`translate(${x} ${y}) rotate(${mix(-14,0,move)}) scale(${1/squash} ${squash})`} filter="url(#shade)">
    <OrganicShape points={blobPoints(0,0,68,{phase:0,amplitude:.025})} fill={paper?'#FFAE48':'url(#parcel)'} stroke={paper?ink:'#E67E42'} strokeWidth={paper?4:2}/>
    <path d="M-37 -37 Q-5 -61 30 -35" stroke="#FFF0AF" strokeWidth="9" fill="none" strokeLinecap="round" opacity={paper?.6:.85}/>
    {[0,1,2].map(i=><circle key={i} cx={-20+i*19} cy={12-(i%2)*12} r="10" fill="#FFF2AD" opacity={1-sent}/>)}
   </g>
   <Limb root={[x-34,y+35]} target={[x-55,y+95-22*ease(progress(f,74,95))]} upper={40} lower={38} bend={-1} color={ink} width={paper?12:14}/>
   {[0,1].map(i=><g key={i} filter="url(#shade)"><ellipse cx="685" cy={365+(i?1:-1)*(29+open*43)} rx="29" ry="48" fill={paper?'#278FAA':'url(#gate)'} stroke={paper?ink:'#1A7E92'} strokeWidth="3"/><ellipse cx="675" cy={354+(i?1:-1)*(29+open*43)} rx="7" ry="21" fill="#D2FFDE" opacity=".65"/></g>)}
   {Array.from({length:7},(_,i)=>{const p=ease(progress(f,release+i*3,arrive+i*3)),visible=f>=release+i*3;const position=bezierPoint([[600,365],[720,300+(i-3)*18],[810,465-(i-3)*18],[980,365+(i-3)*13]],p).position;return visible?<circle key={i} cx={position[0]} cy={position[1]} r={8+(i%2)*3} fill={i%2?'#FFF0A0':'#FFBD45'} stroke="#E5A23B" strokeWidth="1.5"/>:null;})}
   <circle cx="1000" cy="365" r={40+warm*68} stroke="#FFF5B1" strokeWidth={5*(1-warm)} fill="none" opacity={warm?1-warm:0}/>
   {f>contact&&f<contact+18&&<path d="M625 303 l-10 -16 M646 293 l3 -19 M608 321 l-18 -3" stroke="#FF9E42" strokeWidth="5" strokeLinecap="round" opacity={1-progress(f,contact,contact+18)}/>}
  </World>
 </svg></AbsoluteFill>;
};
const Film=({material}:{material:'soft'|'paper'})=><AbsoluteFill><Frame material={material}/><Audio src={staticFile('cues.wav')}/></AbsoluteFill>;
registerRoot(()=> <><Composition id="SoftMechanism" component={Film} defaultProps={{material:'soft' as const}} width={W} height={H} fps={timeline.fps} durationInFrames={timeline.durationInFrames}/><Composition id="PaperMechanism" component={Film} defaultProps={{material:'paper' as const}} width={W} height={H} fps={timeline.fps} durationInFrames={timeline.durationInFrames}/></>);
