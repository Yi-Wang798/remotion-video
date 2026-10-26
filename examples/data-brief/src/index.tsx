import React from 'react';
import {AbsoluteFill,Composition,Easing,interpolate,registerRoot,useCurrentFrame} from 'remotion';
import plan from '../video-plan.json';
const values=Object.fromEntries(plan.metrics.map(m=>[m.id,m.value]));
const source=(id:string)=>plan.dataSources.find(s=>s.id===plan.metrics.find(m=>m.id===id)?.sourceId)!;
const previous=source('previous'),current=source('current');
const unitLabel=current.currency==='CNY'&&current.unit==='million'?'人民币百万元':`${current.currency || ''} ${current.unit}`.trim();
const {ink,paper,teal,orange}=plan.design.palette;
const p=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.out(Easing.cubic)});
const DataBrief=()=>{
 const f=useCurrentFrame(),enter=p(f,0,20),growth=p(f,95,125);
 return <AbsoluteFill style={{background:paper,color:ink,fontFamily:'Arial, Microsoft YaHei, sans-serif'}}><svg width="100%" height="100%" viewBox="0 0 1280 720">
 <g opacity={enter} transform={`translate(0 ${20*(1-enter)})`}>
 <text x="80" y="160" fill={ink} fontSize="48" fontWeight="700">收入同比增长 {values.growth}%</text>
 <text x="84" y="204" fill="#546076" fontSize="23">{current.period} · {unitLabel}</text>
 </g>
 {[0,40,80,120].map(v=><g key={v}><line x1="150" x2="800" y1={570-v*2.2} y2={570-v*2.2} stroke="#DCE0E3" strokeWidth="2"/><text x="124" y={577-v*2.2} textAnchor="end" fill="#546076" fontSize="19">{v}</text></g>)}
 {[{id:'previous',label:previous.period,x:255,color:orange,delay:20},{id:'current',label:current.period,x:555,color:teal,delay:35}].map(b=>{
 const value=values[b.id],t=p(f,b.delay,b.delay+65),height=value*2.2*t;
 return <g key={b.id}><rect x={b.x} y={570-height} width="160" height={height} rx="8" fill={b.color}/><text x={b.x+80} y={548-height} textAnchor="middle" fill={ink} fontSize="32" fontWeight="700">{Math.round(value*t)}</text><text x={b.x+80} y="614" textAnchor="middle" fill={ink} fontSize="24">{b.label}</text></g>;
 })}
 <g opacity={growth} transform={`translate(${25*(1-growth)} 0)`}><line x1="872" y1="295" x2="872" y2="560" stroke="#DCE0E3" strokeWidth="2"/><text x="930" y="365" fill={teal} fontSize="70" fontWeight="700">+{values.growth}%</text><text x="935" y="410" fill={ink} fontSize="26">同比增长</text><text x="935" y="454" fill="#546076" fontSize="22">{values.previous} → {values.current}</text></g>
 </svg></AbsoluteFill>;
};
registerRoot(()=> <Composition id="DataBrief" component={DataBrief} width={1280} height={720} fps={30} durationInFrames={240}/>);
