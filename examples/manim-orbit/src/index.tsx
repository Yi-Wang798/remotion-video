import React from 'react';
import {AbsoluteFill,Composition,OffthreadVideo,registerRoot,staticFile} from 'remotion';
const OrbitFilm=()=> <AbsoluteFill style={{background:'#FAF7F0'}}>
 <OffthreadVideo src={staticFile('clips/orbit.mp4')} style={{width:'100%',height:'100%'}}/>
 <div style={{position:'absolute',left:84,top:60,fontFamily:'Arial, Microsoft YaHei, sans-serif',color:'#101E38'}}>
 <div style={{fontSize:20,letterSpacing:3,color:'#2B877F'}}>GEOMETRY IN MOTION</div>
 <div style={{fontSize:42,fontWeight:700,marginTop:14}}>半径不变，轨迹成圆</div>
 </div>
 </AbsoluteFill>;
registerRoot(()=> <Composition id="OrbitFilm" component={OrbitFilm} width={1280} height={720} fps={30} durationInFrames={180}/>);
