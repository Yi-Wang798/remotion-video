import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,interpolate,Easing} from 'remotion';
const ink='#372158',purple='#AD8BE8',mint='#A6E5C2',cream='#FFF7EB';
const progress=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
const Story=()=>{
 const f=useCurrentFrame(),walk=progress(f,10,105),press=progress(f,135,195),x=340+walk*290,d=6*progress(f,192,205);
 const hand={x:x+125+(870-x-125)*press,y:505-50*press+d};
 const shoulder={x:x+53,y:458},elbow={x:(shoulder.x+hand.x)/2,y:(shoulder.y+hand.y)/2-15};
 const arm=`M${shoulder.x} ${shoulder.y}L${elbow.x} ${elbow.y}L${hand.x} ${hand.y}`;
 return <AbsoluteFill><svg width="100%" height="100%" viewBox="0 0 1280 720">
 <defs><linearGradient id="body" x2="0" y2="1"><stop stopColor="#C9AFF5"/><stop offset="1" stopColor={purple}/></linearGradient></defs>
 <rect width={1280} height={720} fill={cream}/><path d="M0 620H1280" stroke={ink} strokeWidth={3}/>
 <ellipse cx={x} cy={632} rx={120} ry={13} fill="#DFD1C4"/><ellipse cx={870} cy={632} rx={150} ry={13} fill="#DFD1C4"/>
 <rect x={745} y={500} width={250} height={120} rx={26} fill={mint} stroke={ink} strokeWidth={5}/><ellipse cx={870} cy={500} rx={125} ry={28} fill="#B9F2D3" stroke={ink} strokeWidth={5}/>
 <ellipse cx={870} cy={489+d} rx={81} ry={21} fill={press>.9?'#FFD66F':'#8160B3'} stroke={ink} strokeWidth={4}/>
 <rect x={800} y={448+d} width={140} height={38} rx={13} fill="#F97F66" stroke={ink} strokeWidth={4}/><ellipse cx={870} cy={448+d} rx={70} ry={18} fill="#FFA28B" stroke={ink} strokeWidth={4}/>
 {press>.9&&<ellipse cx={870} cy={490+d} rx={85+Math.sin(f/8)*3} ry={24} fill="none" stroke="#FFD66F" strokeWidth={4} opacity={.5}/ >}
 <path d={arm} stroke={ink} strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d={arm} stroke={purple} strokeWidth={23} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
 <ellipse cx={x} cy={500} rx={70} ry={90} fill="url(#body)" stroke={ink} strokeWidth={5}/><circle cx={x+24} cy={505} r={19} fill="#9572CC" stroke={ink} strokeWidth={3}/>
 <path d={`M${x-54} 462L${x-89} 501L${x-105} 546`} stroke={ink} strokeWidth={31} fill="none" strokeLinecap="round"/><path d={`M${x-54} 462L${x-89} 501L${x-105} 546`} stroke={purple} strokeWidth={22} fill="none" strokeLinecap="round"/>
 {[-1,1].map(side=><g key={side} transform={`translate(${x+side*45} 586)`}><ellipse rx={35} ry={43} fill="#503078" stroke={ink} strokeWidth={5}/><ellipse rx={19} ry={27} fill="#A17BDD"/><path d="M0-19V19M-13 0H13" transform={`rotate(${walk*300})`} stroke="#73549E" strokeWidth={3}/></g>)}
 <path d={`M${x} 235V196`} stroke={ink} strokeWidth={11}/><circle cx={x} cy={184} r={20} fill="#FFD66F" stroke={ink} strokeWidth={5}/>
 <ellipse cx={x} cy={334} rx={112} ry={101} fill="url(#body)" stroke={ink} strokeWidth={5}/><ellipse cx={x-106} cy={337} rx={22} ry={31} fill="#9771CE" stroke={ink} strokeWidth={5}/>
 <rect x={x-61} y={278} width={156} height={118} rx={49} fill={cream} stroke={ink} strokeWidth={4}/>
 {[x-11,x+59].map(ex=><ellipse key={ex} cx={ex} cy={334} rx={10} ry={16} fill={ink}/>)}<path d={`M${x+14} 355Q${x+25} 371 ${x+36} 355`} stroke={ink} strokeWidth={7} fill="none" strokeLinecap="round"/>
 <circle cx={elbow.x} cy={elbow.y} r={15} fill="#6E4C9A" stroke={ink} strokeWidth={4}/><path d={`M${hand.x-10} ${hand.y+7}Q${hand.x-20} ${hand.y-16} ${hand.x} ${hand.y-18}Q${hand.x+20} ${hand.y-16} ${hand.x+10} ${hand.y+7}`} fill="#6E4C9A" stroke={ink} strokeWidth={5} strokeLinecap="round"/>
 </svg></AbsoluteFill>;
};
registerRoot(()=> <Composition id="ButtonStory" component={Story} width={1280} height={720} fps={30} durationInFrames={240}/>);
