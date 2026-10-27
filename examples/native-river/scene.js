// Original river encounter; uses Huashu's PAINT sampling, flow strokes and seeded texture.
// Copy to a project created with styles create --style huashu/09_postimp.
SCENES.project_scene=(()=>{
 const P=PAINT,W=1920,H=1080,TAU=Math.PI*2;
 const water=P.swatch(['#0b65ad','#1689cf','#29b6dc','#36d2cf','#486cdf','#90eee1'],.32);
 const gold=P.swatch(['#ff6b31','#ff9b24','#ffca54','#fff1b5','#f34f3a'],.26);
 const clamp=x=>Math.max(0,Math.min(1,x));
 const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
 function ellipse(c,x,y,rx,ry,color,rot=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,rot,0,TAU);c.fill();}
 function pond(g,t){
  const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#163da3');bg.addColorStop(.5,'#167fb7');bg.addColorStop(1,'#31c6c1');g.fillStyle=bg;g.fillRect(0,0,W,H);
  for(let k=0;k<17;k++){g.strokeStyle=k%3?'#32bad1':'#a0f6d8';g.globalAlpha=.16;g.lineWidth=12+k%4*6;g.beginPath();for(let x=-100;x<2020;x+=16){const y=70+k*65+30*Math.sin(x*.006+k*.8+t*.4);x===-100?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();}g.globalAlpha=1;
 }
 function lily(c,x,y,r,t,flower=false){
  c.save();c.translate(x,y+Math.sin(t*.8+x)*5);c.rotate(Math.sin(t*.4+x)*.035);
  ellipse(c,9,18,r*1.06,r*.63,'#075b8290');
  const grad=c.createLinearGradient(-r,-r*.5,r,r*.5);grad.addColorStop(0,'#c0e84f');grad.addColorStop(.5,'#5cc96c');grad.addColorStop(1,'#15936d');
  c.fillStyle=grad;c.beginPath();c.moveTo(0,0);c.ellipse(0,0,r,r*.63,0,.2,TAU-.2);c.closePath();c.fill();
  c.strokeStyle='#e8f99988';c.lineWidth=3;for(let i=1;i<9;i++){const a=.3+i*.64;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*r*.88,Math.sin(a)*r*.55);c.stroke();}
  if(flower){c.translate(-12,-18);for(let i=0;i<9;i++){const a=i/9*TAU;ellipse(c,Math.cos(a)*25,Math.sin(a)*16,35,14,i%2?'#ff81c7':'#ffb9dd',a);}ellipse(c,0,0,19,13,'#ffe775');}c.restore();
 }
 function fish(c,t){
  const p=ease(t/8),x=280+1280*p,y=690-230*Math.sin(p*Math.PI),a=-.28*Math.cos(p*Math.PI),tail=Math.sin(t*5.5)*.25;
  c.save();c.translate(x+14,y+30);c.rotate(a);ellipse(c,0,0,175,63,'#064a7f55');c.restore();
  const tile=P.scratch('river-fish'),g=tile.getContext('2d');g.clearRect(0,0,W,H);g.save();g.translate(480,300);
  // The tail shares its root with the body; its hinge moves before the wide fin tips.
  g.save();g.translate(-148,0);g.rotate(tail);g.fillStyle='#ff7b3b';g.beginPath();g.moveTo(8,0);g.bezierCurveTo(-55,-10,-86,-65,-112,-70);g.quadraticCurveTo(-78,0,-112,70);g.bezierCurveTo(-70,68,-42,18,8,0);g.fill();g.restore();
  const body=g.createLinearGradient(0,-70,0,70);body.addColorStop(0,'#ffe3a2');body.addColorStop(.3,'#ffad37');body.addColorStop(1,'#f45b31');g.fillStyle=body;g.beginPath();g.moveTo(-170,0);g.bezierCurveTo(-80,-100,112,-92,176,0);g.bezierCurveTo(105,98,-80,82,-170,0);g.fill();
  ellipse(g,20,30,62,18,'#fff0c6aa',.15);g.restore();
  g.save();g.globalCompositeOperation='source-atop';P.strokes(g,tile,{cell:8,len:24,width:5,seed:73,t,boil:0,outline:.3,palette:(x,y,col,r)=>gold(col,r),alphaMask:true,angle:(x,y)=>.1+Math.sin((x+y)*.01)*.16});g.restore();
  c.save();c.translate(x,y);c.rotate(a);c.drawImage(tile,200,170,500,260,-280,-130,500,260);
  c.save();c.translate(-10,36);c.rotate(.3+Math.sin(t*5.5-1)*.22);ellipse(c,-20,12,48,16,'#ffd273',-.4);c.strokeStyle='#fff1ac';c.lineWidth=3;c.beginPath();c.moveTo(8,1);c.lineTo(-50,21);c.stroke();c.restore();
  ellipse(c,112,-25,14,14,'#fff9e2');ellipse(c,116,-25,7,8,'#193f65');ellipse(c,119,-28,2.8,3,'white');
  c.strokeStyle='#b54037';c.lineWidth=4;c.beginPath();c.arc(152,6,12,.4,1.6);c.stroke();c.restore();
  // A breath becomes a rising bubble, then expands into a ripple beside the lotus.
  if(t>3){const q=clamp((t-3)/2.6),bx=x+170+65*q,by=y-180*q;const r=9+q*20;c.strokeStyle='#bafaff';c.lineWidth=4;c.globalAlpha=1-ease((q-.85)/.15);c.beginPath();c.arc(bx,by,r,0,TAU);c.stroke();ellipse(c,bx-r*.32,by-r*.38,r*.16,r*.25,'#ffffffaa');c.globalAlpha=1;}
 }
 return {draw(c,lt,t){
  const b=P.scratch('river-water'),g=b.getContext('2d');pond(g,t);c.drawImage(b,0,0);
  P.strokes(c,b,{cell:16,len:49,width:7,seed:38,t,boil:0,outline:.2,palette:(x,y,col,r)=>water(col,r),angle:(x,y)=>.12+.23*Math.sin(y*.009+x*.003-t*.4)});
  lily(c,170,160,170,t);lily(c,440,40,140,t);lily(c,1530,200,205,t,true);lily(c,1830,395,120,t);
  fish(c,t);
  lily(c,1510,1040,210,t);lily(c,180,1020,145,t,true);
  for(let k=0;k<3;k++){const q=((t*.3+k/3)%1);c.strokeStyle=`rgba(203,255,231,${(1-q)*.23})`;c.lineWidth=4;c.beginPath();c.ellipse(1530,200,160+120*q,90+65*q,0,0,TAU);c.stroke();}
 }};
})();
