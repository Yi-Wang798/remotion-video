import React from 'react';
import {Img} from 'remotion';
import {cameraTransform,closedPath,solveTwoBone} from './motion.mjs';

// Coordinates for attachments, effects and subjects share the same world.
export const World=({camera,width,height,children}:{camera:any,width:number,height:number,children:React.ReactNode})=><g transform={cameraTransform(camera,width,height)}>{children}</g>;
export const OrganicShape=({points,fill,stroke='none',strokeWidth=2}:{points:number[][],fill:string,stroke?:string,strokeWidth?:number})=><path d={closedPath(points)} fill={fill} stroke={stroke} strokeWidth={strokeWidth}/>;
export function Limb({root,target,upper,lower,bend=1,color,width=12}:{root:number[],target:number[],upper:number,lower:number,bend?:number,color:string,width?:number}){
 const rig=solveTwoBone(root,target,upper,lower,bend);return <path d={`M${rig.root.join(' ')} L${rig.joint.join(' ')} L${rig.end.join(' ')}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"/>;
}
// A cutout part rotates at its attachment; pivot coordinates are in image pixels.
export function SpritePart({src,x,y,width,height,pivot=[0,0],rotation=0,scale=1}:{src:string,x:number,y:number,width:number,height:number,pivot?:number[],rotation?:number,scale?:number}){
 return <div style={{position:'absolute',left:x-pivot[0],top:y-pivot[1],width,height,transformOrigin:`${pivot[0]}px ${pivot[1]}px`,transform:`rotate(${rotation}deg) scale(${scale})`}}><Img src={src} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>;
}
