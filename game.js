'use strict';
(()=>{
const UW=216,ZM=1.64,WW=Math.round(UW/ZM);let W=WW,H=400,GY=282,UH=400,UGY=282,WH=244,WGY=172;
const cv=document.getElementById('c'),mcx=cv.getContext('2d',{alpha:false});let cx=mcx;
const wc=document.createElement('canvas'),wcx=wc.getContext('2d',{alpha:false});
const Q=new URLSearchParams(location.search);
let muted=Q.has('mute')||localStorage.getItem('lj-mute')==='1';
// ---------- pixel primitives (same approach as PEEK-A-SNIP!) ----------
function R(x,y,w,h,c){cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)}
function ellipse(x0,y0,rx,ry,c){cx.fillStyle=c;x0=Math.round(x0);y0=Math.round(y0);rx=Math.round(rx);ry=Math.round(ry);
 for(let dy=-ry;dy<=ry;dy++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(dy*dy)/((ry+.5)*(ry+.5)))));cx.fillRect(x0-w,y0+dy,w*2+1,1)}}
const disc=(x,y,r,c)=>ellipse(x,y,r,r,c);
function line(x0,y0,x1,y1,c){cx.fillStyle=c;x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
 const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
 for(let n=0;n<600;n++){cx.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
function geye(x,y,r,lx=0,ly=0){disc(x,y,r,'#fff');const ps=r>=4?3:r>=3?2:1,lim=r-ps*.5-.3;const L=Math.hypot(lx,ly);if(L>1){lx/=L;ly/=L}
 R(Math.round(x+lx*lim-ps/2+.01),Math.round(y+ly*lim-ps/2+.01),ps,ps,'#000')}
function box(x,y,w,h,fill,edge,shadow){x=Math.round(x);y=Math.round(y);if(shadow)R(x+1,y+3,w,h,shadow);
 if(edge){R(x+1,y,w-2,h,edge);R(x,y+1,w,h-2,edge);R(x+2,y+1,w-4,h-2,fill);R(x+1,y+2,w-2,h-4,fill)}else{R(x+1,y,w-2,h,fill);R(x,y+1,w,h-2,fill)}}
const FD = {
  A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
  D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
  G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '.###. ..#.. ..#.. ..#.. ..#.. ..#.. .###.',
  J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
  M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
  P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
  S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
  V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# #.#.# .#.#.', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
  Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
  0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
  3: '##### ...#. ..#.. ...#. ....# #...# .###.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
  6: '..##. .#... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
  9: '.###. #...# #...# .#### ....# ...#. .##..',
  '!': '..#.. ..#.. ..#.. ..#.. ..#.. ..... ..#..', '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', '.': '..... ..... ..... ..... ..... .##.. .##..',
  ',': '..... ..... ..... ..... .##.. ..#.. .#...', ':': '..... .##.. .##.. ..... .##.. .##.. .....', '-': '..... ..... ..... ##### ..... ..... .....',
  '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', "'": '..#.. ..#.. .#... ..... ..... ..... .....', '/': '....# ....# ...#. ..#.. .#... #.... #....',
  '(': '...#. ..#.. .#... .#... .#... ..#.. ...#.', ')': '.#... ..#.. ...#. ...#. ...#. ..#.. .#...', '=': '..... ..... ##### ..... ##### ..... .....',
  '*': '..... #.#.# .###. ##### .###. #.#.# .....', '@': '..... .#.#. ##### ##### .###. ..#.. .....', '<': '...#. ..#.. .#... #.... .#... ..#.. ...#.',
  '>': '.#... ..#.. ...#. ....# ...#. ..#.. .#...', '^': '..... ..#.. .###. ##### ..... ..... .....', '~': '..... ..... ##### .###. ..#.. ..... .....',
  '_': '..... ..... ..... ..... ..... ..... #####', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#', '#': '.#.#. ##### .#.#. .#.#. .#.#. ##### .#.#.',
  '%': '##..# ##..# ...#. ..#.. .#... #..## #..##', '★': '..#.. ..#.. ##### .###. .###. ##.## #...#', '¤': '.###. #...# #...# ##### ##.## ##.## #####',
  '|': '.#.#. .#.#. .#.#. .#.#. .#.#. .#.#. .#.#.', '"': '.#.#. .#.#. ..... ..... ..... ..... .....', '►': '.#... .##.. .###. .####. .###. .##.. .#...',
  '♪': '..##. ..#.# ..#.. ..#.. ###.. ###.. .....', 'x': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
};

const FONT={};for(const k in FD){FONT[k]=FD[k].split(' ').map(r=>(r+'.....').slice(0,5)).join('')}
const ACC={'Č':['C','v'],'Ć':['C',"'"],'Š':['S','v'],'Ž':['Z','v'],'Đ':['D','-']};
function text(s,x,y,col,sc=1,al=0){s=String(s).toUpperCase();const cw=6*sc;if(al===1)x-=Math.round((s.length*cw-sc)/2);else if(al===2)x-=s.length*cw-sc;x=Math.round(x);y=Math.round(y);
 for(let i=0;i<s.length;i++){let ch=s[i],acc=null;if(ACC[ch]){acc=ACC[ch][1];ch=ACC[ch][0]}const g=FONT[ch];if(!g)continue;
  cx.fillStyle=typeof col==='function'?col(i):col;const ox=x+i*cw;
  for(let j=0;j<35;j++)if(g.charCodeAt(j)===35)cx.fillRect(ox+(j%5)*sc,y+((j/5)|0)*sc,sc,sc);
  if(acc==='v'){cx.fillRect(ox+sc,y-2*sc,sc,sc);cx.fillRect(ox+3*sc,y-2*sc,sc,sc);cx.fillRect(ox+2*sc,y-sc,sc,sc)}
  else if(acc==="'"){cx.fillRect(ox+3*sc,y-2*sc,sc,sc);cx.fillRect(ox+2*sc,y-sc,sc,sc)}
  else if(acc==='-'){cx.fillRect(ox-sc,y+3*sc,sc,sc);cx.fillRect(ox+sc,y+3*sc,sc,sc)}}}
function textO(s,x,y,col,sc=1,al=0,oc='#000'){const o=Math.max(1,sc>>1);for(const d of [[-o,0],[o,0],[0,-o],[0,o],[o,o]])text(s,x+d[0],y+d[1],oc,sc,al);text(s,x,y,col,sc,al)}
const rainbow=i=>`hsl(${(i*40+T*200)%360},100%,62%)`;
let T=0;
// ---------- fit ----------
let BTN={};
function fit(){UH=Math.round(Math.max(360,Math.min(480,UW*innerHeight/innerWidth)));UGY=UH-112;cv.width=UW;cv.height=UH;
 WH=Math.ceil(UH/ZM);WGY=Math.round(UGY/ZM);wc.width=WW;wc.height=WH;W=WW;H=WH;GY=WGY;
 const s=Math.min(innerWidth/UW,innerHeight/UH);cv.style.width=Math.floor(UW*s)+'px';cv.style.height=Math.floor(UH*s)+'px';cv.style.marginTop=Math.max(0,(innerHeight-UH*s)/2)+'px';
 BTN={a:{x:6,y:UH-92,w:98,h:80},b:{x:UW-104,y:UH-92,w:98,h:80},mute:{x:UW-26,y:4,w:22,h:20},
  go:{x:UW/2-62,y:UH-150,w:124,h:56},home:{x:12,y:UH-60,w:40,h:40},
  p1:{x:UW/2-50,y:UH-200,w:100,h:76},p2:{x:UW/2-28,y:UH-108,w:56,h:50}}}
addEventListener('resize',fit);fit();
// ---------- sound ----------
let ac=null,nbuf=null;
function A(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();return ac}
function tone(f1,f2,len,type='sine',vol=0.3,delay=0){const a=A();if(!a||muted)return;const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();
 o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+len);
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+len);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+len+0.02)}
function noise(len,f1,f2,vol=.3){const a=A();if(!a||muted)return;if(!nbuf){nbuf=a.createBuffer(1,a.sampleRate,a.sampleRate);const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 const t=a.currentTime,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=nbuf;f.type='bandpass';f.Q.value=2;
 f.frequency.setValueAtTime(f1,t);f.frequency.exponentialRampToValueAtTime(f2,t+len);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+len);
 s.connect(f);f.connect(g);g.connect(a.destination);s.start(t);s.stop(t+len+.02)}
const sJump=()=>tone(300,750,0.2,'square',0.12),
 sSwish=()=>{noise(.18,600,3500,.5);tone(900,300,.12,'triangle',.08)},
 sBonk=()=>{tone(180,60,.2,'square',.25);noise(.1,400,200,.3)},
 sPoof=()=>{noise(.3,2000,500,.25);[784,988,1319,1568].forEach((f,i)=>tone(f,f,0.09,'square',0.08,i*0.05))},
 sCoin=p=>{tone(990*p,990*p,0.06,'square',0.08);tone(1320*p,1320*p,0.12,'square',0.08,0.06)},
 sHurt=()=>{tone(400,90,.35,'sawtooth',.22);noise(.2,1200,300,.2)},
 sWarn=()=>tone(880,880,.08,'square',.09),
 sZap=()=>{tone(1600,120,.35,'sawtooth',.14);noise(.3,4000,800,.12)},
 sHum=()=>tone(110,90,.25,'sawtooth',.05),
 sStar=i=>tone(660*Math.pow(1.26,i),660*Math.pow(1.26,i),.18,'square',.12),
 sWin=()=>[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,f,0.14,'square',0.12,i*0.11)),
 sLose=()=>[392,370,349,294].forEach((f,i)=>tone(f,f*.97,0.28,'triangle',0.2,i*0.25)),
 sGo=()=>[523,784,1047].forEach((f,i)=>tone(f,f,0.1,'square',0.1,i*0.07));
// ---------- state ----------
const PX=46,LEAD0=120,LEADMAX=130,L1SPD=72,L2LEN=2300,L2SPD=48;
const L1EV=[[160,'kamen'],[330,'zlato'],[520,'kutija'],[760,'majmun'],[1000,'kamen'],[1150,'zlato'],[1320,'majmun'],[1560,'kutija'],[1720,'zlato'],[1880,'majmun'],[2100,'kamen'],[2260,'zlato'],[2420,'majmun'],[2640,'kutija'],[2800,'zlato'],[3000,'kornjaca']];
const L1END=3000;
let st='menu',LV=1,S,runScore=0;
let best=+localStorage.getItem('lj-best')||0,unlocked=+localStorage.getItem('lj-lv')||1;
function reset(){S={t:0,coins:0,score:0,pt:[],pop:[],shake:0,flash:0,banner:'',bannerT:0,endT:0,hits:0,run:0,inv:0,stun:0,done:0,
 // L1
 scroll:0,y:0,vy:0,lead:LEAD0,sw:0,swCd:0,ob:[],ev:0,blocked:false,boss:null,humT:0,zapT:1,
 // L2
 climb:0,side:0,from:0,hop:0,hearts:3,las:null,nextL:2.6,cs:[],nextC:60,nL:0,hint:0,starsShown:0,conf:0}}
reset();
function pop(s,x,y,c='#fff',sc=1,life=1){S.pop.push({s,x:Math.max(s.length*3*sc+2,Math.min(W-s.length*3*sc-2,x)),y,c,sc,t:life})}
function burst(x,y,n,cols,spd=80,gr=220,life=.7){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.3+Math.random()*.7)*spd;
 S.pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-spd*.3,t:(.5+Math.random()*.5)*life,c:cols[Math.random()*cols.length|0],g:gr,sz:Math.random()<.35?2:1})}
 if(S.pt.length>500)S.pt.splice(0,S.pt.length-500)}
function poof(x,y,big){burst(x,y,big?50:26,['#ffe14d','#fff','#ff5ad1','#5af7ff'],big?150:110,120,1);for(let i=0;i<(big?6:3);i++)pop('★',x-16+Math.random()*32,y-8-Math.random()*16,['#ffe14d','#fff','#5af7ff'][i%3],big?2:1,.9);sPoof()}
function banner(s,t=1.6){S.banner=s;S.bannerT=t}
function start(l){A();reset();LV=l;if(l===1)runScore=0;st='play';sGo();banner(l===1?'BJEŽI!':'PENJI SE!',1.8);if(l===2)S.hint=4}
function lose(){if(st!=='play')return;st='over';S.endT=0;S.shake=.5;sLose();const sc=runScore+S.score;if(sc>best){best=sc;S.newBest=true;localStorage.setItem('lj-best',best)}}
function win(){if(st!=='play')return;st='win';S.endT=0;S.starsShown=0;
 S.stars=S.hits<=1?3:S.hits<=3?2:1;S.score+=300+S.stars*100;runScore+=S.score;
 if(runScore>best){best=runScore;S.newBest=true;localStorage.setItem('lj-best',best)}
 if(LV===1&&unlocked<2){unlocked=2;localStorage.setItem('lj-lv','2')}sWin()}
// ---------- input ----------
const inB=(b,x,y)=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h;
let tS=null;
function ptr(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*UW/r.width,(e.clientY-r.top)*UH/r.height]}
function jump(){if(st!=='play'||LV!==1||S.done)return;if(S.y===0&&S.stun<=0){S.vy=-390;sJump();burst(PX,GY,6,['#fff','#ddd'],40,100,.4)}}
function sword(){if(st!=='play'||LV!==1||S.done||S.swCd>0)return;S.sw=.28;S.swCd=.22;sSwish();
 for(const o of S.ob){if(o.dead||!(o.k==='majmun'||o.k==='kornjaca'||o.k==='kutija'))continue;const d=o.x-PX;
  if(d>-8&&d<50&&(o.k!=='kutija'||S.y>-30)&&(o.k!=='kornjaca'||o.stun<=0.35))hitEnemy(o)}}
function hitEnemy(o){S.shake=.15;
 if(o.k==='kornjaca'){o.hp--;o.stun=.8;o.x+=34;o.fl=.3;sBonk();burst(o.x,GY-16,14,['#fff','#ffe14d'],90);pop(o.hp>0?'BUM!':'BRAVO!',o.x,GY-50,'#ffe14d',2);
  if(o.hp<=0){o.dead=true;poof(o.x,GY-14,true);S.score+=200;S.done=1;S.flash=.15;banner('BRAVO!',2)}return}
 o.dead=true;poof(o.x,GY-(o.k==='kutija'?8:12),false);S.score+=o.k==='majmun'?50:20;pop(o.k==='majmun'?'+50':'+20',o.x,GY-40,'#ffe14d',1);
 if(o.k==='majmun')for(let i=0;i<3;i++)S.ob.push({k:'zl',x:o.x+i*10,y:GY-30-i*6,vx:20+i*15,vy:-120})}
function side(s){if(st!=='play'||LV!==2||S.done)return;if(s===undefined)s=1-S.side;if(s===S.side&&S.hop<=0)return;if(S.hop>0&&s===S.side)return;
 S.from=S.side;S.side=s;S.hop=.26;sJump();S.hint=0}
cv.addEventListener('pointerdown',e=>{e.preventDefault();const[x,y]=ptr(e);A();
 if(inB(BTN.mute,x,y)){muted=!muted;localStorage.setItem('lj-mute',muted?'1':'0');return}
 if(st==='menu'){if(inB(BTN.p2,x,y)){if(unlocked>=2)start(2);else{S.shake=.2;sBonk()}return}start(1);return}
 if(st==='over'||st==='win'){if(S.endT<1)return;if(inB(BTN.home,x,y)){st='menu';reset();return}
  if(inB(BTN.go,x,y)){if(st==='over')start(LV);else if(LV===1)start(2);else start(1)}return}
 if(LV===1){if(inB(BTN.a,x,y)){jump();return}if(inB(BTN.b,x,y)){sword();return}tS={x,y,done:false};return}
 if(inB(BTN.a,x,y)){side(0);return}if(inB(BTN.b,x,y)){side(1);return}tS={x,y,done:false}});
cv.addEventListener('pointermove',e=>{if(!tS||tS.done)return;const[x,y]=ptr(e);const dx=x-tS.x,dy=y-tS.y;
 if(LV===1&&dy<-16){jump();tS.done=true}else if(LV===2&&Math.abs(dx)>16){side(dx<0?0:1);tS.done=true}});
cv.addEventListener('pointerup',()=>{if(tS&&!tS.done){if(LV===1)sword();else side(tS.x<UW/2?0:1)}tS=null});
addEventListener('keydown',e=>{A();if(['Space','ArrowUp','ArrowLeft','ArrowRight','Enter','KeyX'].includes(e.code))e.preventDefault();
 if(st==='menu'){if(e.code==='Space'||e.code==='Enter')start(1);return}
 if(st!=='play'){if((e.code==='Space'||e.code==='Enter')&&S.endT>1){if(st==='over')start(LV);else start(LV===1?2:1)}return}
 if(LV===1){if(e.code==='Space'||e.code==='ArrowUp')jump();if(e.code==='KeyX'||e.code==='ArrowRight'||e.code==='Enter')sword()}
 else{if(e.code==='ArrowLeft')side(0);if(e.code==='ArrowRight')side(1);if(e.code==='Space')side()}});
// ---------- update ----------
function update(dt){T+=dt;S.t+=dt;
 for(const q of S.pt){q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.t-=dt}S.pt=S.pt.filter(q=>q.t>0);
 for(const q of S.pop){q.y-=16*dt;q.t-=dt}S.pop=S.pop.filter(q=>q.t>0);
 S.shake=Math.max(0,S.shake-dt);S.flash=Math.max(0,S.flash-dt);S.bannerT-=dt;
 if(st==='win'){S.endT+=dt;const n=Math.min(S.stars,Math.floor((S.endT-.4)/.35)+1);if(S.endT>.4&&n>S.starsShown){S.starsShown=n;sStar(n)}
  S.conf-=dt;if(S.conf<=0){S.conf=.04;S.pt.push({x:Math.random()*W,y:-4,vx:(Math.random()-.5)*30,vy:20+Math.random()*30,t:6,c:['#ff5ad1','#ffe14d','#5af7ff','#7dff5a','#ff8c42'][Math.random()*5|0],g:25,sz:2})}return}
 if(st==='over'){S.endT+=dt;return}
 if(st!=='play'){S.run+=dt*8;S.scroll+=30*dt;S.climb+=20*dt;return}
 if(S.inv>0)S.inv-=dt;
 if(LV===1)up1(dt);else up2(dt)}
function up1(dt){S.sw-=dt;S.swCd-=dt;
 if(S.done){S.done+=dt;S.run+=dt*6;if(S.done>2.2)win();S.lead=Math.min(LEADMAX,S.lead+60*dt);return}
 // events
 while(S.ev<L1EV.length&&S.scroll>=L1EV[S.ev][0]){const k=L1EV[S.ev][1];S.ev++;
  if(k==='zlato')for(let i=0;i<5;i++)S.ob.push({k:'zl',x:W+10+i*13,y:GY-14-Math.round(Math.sin(i/4*Math.PI)*30)});
  else if(k==='kamen')S.ob.push({k,x:W+10,w:14,h:12});
  else if(k==='kutija')S.ob.push({k,x:W+10,w:14,h:14});
  else if(k==='majmun'){S.ob.push({k,x:W+14,hp:1,stun:0});}
  else if(k==='kornjaca'){const o={k,x:W+20,hp:3,stun:0,fl:0};S.ob.push(o);S.boss=o;banner('PAZI!',1.4);tone(200,100,.5,'square',.15)}}
 // blocking
 S.blocked=false;for(const o of S.ob)if(!o.dead&&(o.k==='majmun'||o.k==='kornjaca')&&o.x-PX<=(o.k==='kornjaca'?20:16)+.5)S.blocked=true;
 const v=S.blocked?0:L1SPD*(S.stun>0?.5:1);S.scroll+=v*dt;S.run+=dt*(S.blocked?10:v/12);
 if(S.stun>0)S.stun-=dt;
 for(const o of S.ob){
  if(o.k==='zl'){o.x-=v*dt;if(o.vx!==undefined){o.x+=o.vx*dt;o.vy+=400*dt;o.y+=o.vy*dt;if(o.y>GY-8){o.y=GY-8;o.vy=-o.vy*.4;o.vx*=.5}}
   if(!o.dead&&Math.abs(o.x-PX)<12&&o.y>GY-34+S.y&&o.y<GY+6+S.y){o.dead=true;S.coins++;S.score+=10;sCoin(1+(S.coins%8)*.06);burst(o.x,o.y,5,['#ffe14d','#fff'],50,120,.4)}continue}
  if(o.k==='majmun'||o.k==='kornjaca'){if(o.dead)continue;o.stun=Math.max(0,o.stun-dt);o.fl=Math.max(0,(o.fl||0)-dt);
   const reach=o.k==='kornjaca'?20:16;const walk=o.stun>0?0:(o.k==='kornjaca'?16:14);
   o.x-=v*dt+walk*dt;if(o.x-PX<reach)o.x=PX+reach;continue}
  o.x-=v*dt;
  if(!o.hit&&!o.dead&&S.inv<=0){const hx=PX-5,hy=GY-26+S.y;if(hx<o.x+o.w-3&&hx+10>o.x+3&&hy<GY&&hy+26>GY-o.h+3){o.hit=true;hurt1()}}}
 S.ob=S.ob.filter(o=>o.x>-40&&!(o.dead&&o.k!=='kornjaca'));
 // lasers chase
 if(S.blocked)S.lead-=24*dt;else if(S.stun<=0)S.lead=Math.min(LEADMAX,S.lead+9*dt);
 S.humT-=dt;if(S.humT<=0){S.humT=.6;sHum()}
 S.zapT-=dt;if(S.zapT<=0){S.zapT=1.2+Math.random();S.zap=.25;if(S.lead<60)sZap()}S.zap=(S.zap||0)-dt;
 if(S.y<0||S.vy<0){S.vy+=1000*dt;S.y+=S.vy*dt;if(S.y>=0){S.y=0;S.vy=0}}
 if(S.lead<=0){S.lead=0;poof(PX,GY-14,false);lose()}}
function hurt1(){S.hits++;S.stun=.5;S.inv=1.3;S.lead-=18;S.shake=.3;S.flash=.08;sHurt();pop('AU!',PX,GY-48,'#ff5a5a',2);burst(PX,GY-16,12,['#ffe14d','#fff','#ff9b3b'],90)}
function L2HY(){return Math.round(WH*.56)}
function up2(dt){const HY=L2HY();
 if(S.hop>0)S.hop-=dt;if(S.hint>0)S.hint-=dt;
 if(S.done){S.done+=dt;S.climb=Math.min(L2LEN+HY-40,S.climb+30*dt);S.run+=dt*6;if(S.done>2)win();return}
 S.climb+=L2SPD*dt*(S.stun>0?.4:1);S.run+=dt*7;if(S.stun>0)S.stun-=dt;
 if(S.climb>=L2LEN){S.done=1;S.las=null;banner('BRAVO!',2);sGo();burst(W/2,HY-30,40,['#ffe14d','#ff5ad1','#5af7ff'],140);return}
 const p=Math.min(1,S.climb/L2LEN);
 // lasers, one at a time
 if(!S.las){S.nextL-=dt;if(S.nextL<=0&&S.climb<L2LEN-80){const s=Math.random()<.72?S.side:1-S.side;S.las={side:s,ph:0,t:1.6-.5*p,b:0};S.nL++}}
 else{const L=S.las;L.t-=dt;L.b-=dt;
  if(L.ph===0){if(L.b<=0){L.b=.25;sWarn()}if(L.t<=0){L.ph=1;L.t=.5;sZap();S.shake=.12}}
  else{const onSide=S.hop>0.13?S.from:S.side;
   if(onSide===L.side&&S.inv<=0&&S.hop<=0.02){L.hit=1;S.hearts--;S.hits++;S.inv=1.6;S.stun=.5;S.shake=.35;S.flash=.1;sHurt();pop('AU!',hx2(),HY-40,'#ff5a5a',2);burst(hx2(),HY-14,16,['#ffe14d','#fff','#ff3a3a'],100);
    if(S.hearts<=0){lose();return}}
   if(L.t<=0){if(!L.hit){S.score+=20;S.dodged=(S.dodged||0)+1;pop(['SUPER!','BRAVO!','JUHU!','IDEMO!'][S.dodged%4],hx2(),HY-50,rainbow,1,1);burst(hx2(),HY-30,10,['#ffe14d','#5af7ff'],80)}S.las=null;S.nextL=Math.max(.7,1.3-.6*p)+Math.random()*.5;}}}
 // coins on the wall
 while(S.nextC<S.climb+HY+20){const s=Math.random()<.5?0:1;for(let i=0;i<3;i++)S.cs.push({side:s,h:S.nextC+i*14});S.nextC+=110+Math.random()*60}
 for(const c of S.cs){const sy=HY-(c.h-S.climb);if(!c.got&&c.side===S.side&&S.hop<=.1&&Math.abs(sy-(HY-14))<15){c.got=true;S.coins++;S.score+=10;sCoin(1+(S.coins%8)*.06);burst(cx2(c.side),sy,5,['#ffe14d','#fff'],50,120,.4)}}
 S.cs=S.cs.filter(c=>!c.got&&HY-(c.h-S.climb)<H+20)}
const WC=()=>Math.round(W/2),WALLW=16;
function cx2(s){return s===0?WC()-WALLW-7:WC()+WALLW+7}
function hx2(){if(S.hop>0){const k=1-S.hop/.26;return cx2(S.from)+(cx2(S.side)-cx2(S.from))*k}return cx2(S.side)}
// ---------- sprites ----------
const SUIT='#2d6cdf',SUIT2='#1d4aa8',CAPE='#ff3a5a',CAPE2='#c0203f',SKIN='#ffcc99',GOLD='#ffe14d';
function heroBody(f,airborne,stunned){ // facing right, feet at 0
 const fl=Math.floor(T*10)%2;
 // cape
 R(-9,-23,4,14+fl,CAPE2);R(-11-fl,-20,4,12,CAPE);R(-13-fl*2,-15,3,8+fl,CAPE);R(-6,-24,3,10,CAPE);
 if(airborne){R(-4,-11,3,6,SUIT);R(1,-11,3,6,SUIT);R(-5,-6,4,3,CAPE);R(1,-6,4,3,CAPE)}
 else{const a=[-3,-1,2,1][f],b=-a;R(-2+a,-11,3,9,SUIT);R(-2+b,-11,3,9,SUIT);R(-3+a,-3,5,3,CAPE);R(-3+b,-3,5,3,CAPE)}
 R(-5,-12,10,2,GOLD);R(-5,-21,10,9,SUIT);R(-3,-20,7,6,GOLD);R(-2,-19,1,4,CAPE);R(2,-19,1,4,CAPE);R(-1,-18,1,1,CAPE);R(1,-18,1,1,CAPE);R(0,-17,1,1,CAPE);
 // head
 R(-5,-30,10,9,SKIN);R(-5,-31,10,3,'#2a1a10');R(-6,-30,2,5,'#2a1a10');R(-5,-27,11,3,SUIT2);R(2,-27,3,2,'#fff');R(3,-27,1,2,'#000');
 R(1,-23,3,1,stunned?'#000':'#c33');if(stunned){R(2,-24,1,2,'#000')}}
function swordAt(ang,len=16){const c=Math.cos(ang),s=Math.sin(ang);const bx=4,by=-18;
 for(let i=4;i<len;i++){R(bx+c*i,by+s*i,2,2,i>len-3?'#fff':'#d8e4ff')}R(bx+c*3-1,by+s*3-1,3,3,GOLD);R(bx+c*1,by+s*1,2,2,'#7a4a1f')}
function hero(x,y){x=Math.round(x);y=Math.round(y);if(S.inv>0&&Math.floor(T*16)%2)return;const f=Math.floor(S.run)%4;
 cx.save();cx.translate(x,y+(S.y===0&&f%2?1:0));heroBody(f,S.y<0,S.stun>0);
 if(S.sw>0){const k=1-S.sw/.28,a=-1.9+k*2.6;
  cx.globalAlpha=.6;for(let i=0;i<6;i++){const aa=-1.9+k*2.6*i/5;R(4+Math.cos(aa)*20,-18+Math.sin(aa)*20,3,3,'#fff')}cx.globalAlpha=1;
  swordAt(a,20);R(4,-20,4,4,SKIN)}
 else{const sw=S.y<0?-3:[-1,0,1,0][f];swordAt(-1.2,15);R(3,-20+sw,3,6,SKIN)}
 R(-7,-20,3,6,SKIN);cx.restore()}
function heroClimb(x,y,face){x=Math.round(x);y=Math.round(y);if(S.inv>0&&Math.floor(T*16)%2)return;const f=Math.floor(S.run)%2;
 cx.save();cx.translate(x,y);cx.scale(face,1);const fl=Math.floor(T*10)%2;
 R(-8,-23,4,15+fl,CAPE2);R(-10-fl,-20,4,13,CAPE);R(-5,-24,3,11,CAPE);
 R(-3,-11+(f?2:0),3,8,SUIT);R(0,-11+(f?0:2),3,8,SUIT);R(1,-4+(f?0:2),4,3,CAPE);R(-2,-4+(f?2:0),4,3,CAPE);
 R(-5,-12,10,2,GOLD);R(-5,-21,10,9,SUIT);R(-2,-19,5,5,GOLD);R(0,-18,1,3,CAPE);
 R(2,-27+(f?-3:0),3,8,SKIN);R(3,-30+(f?-3:0),3,3,SKIN);R(0,-25+(f?0:-3),3,7,SKIN);R(1,-28+(f?0:-3),3,3,SKIN);
 R(-5,-31,9,9,SKIN);R(-5,-32,9,3,'#2a1a10');R(-6,-31,2,5,'#2a1a10');R(-5,-28,10,3,SUIT2);R(1,-28,3,2,'#fff');R(2,-28,1,2,'#000');R(0,-24,3,1,S.stun>0?'#000':'#c33');
 cx.restore()}
function monkey(o){const x=Math.round(o.x),y=GY,b=Math.floor(T*8)%2;
 // tail
 R(x+8,y-12,2,6,'#7a4a1f');R(x+9,y-15,4,2,'#7a4a1f');R(x+12,y-17,2,3,'#7a4a1f');
 R(x-4,y-4+b,3,4,'#5a3412');R(x+2,y-4-b+1,3,4,'#5a3412');ellipse(x,y-9,7,6,'#8a5426');ellipse(x,y-8,4,4,'#d9a066');
 disc(x,y-20,7,'#8a5426');disc(x-7,y-21,3,'#8a5426');disc(x+7,y-21,3,'#8a5426');disc(x-7,y-21,1,'#d9a066');
 ellipse(x-1,y-18,5,4,'#d9a066');geye(x-3,y-21,2,-1,0);geye(x+2,y-21,2,-1,0);R(x-4,y-24,3,1,'#000');R(x+1,y-24,3,1,'#000');R(x-3,y-16,4,1,'#5a3412');
 // nunchucks spinning
 const a=T*14,hx=x-8,hy=y-12;R(hx-1,hy-1,3,3,'#8a5426');const ex=hx+Math.cos(a)*7,ey=hy+Math.sin(a)*7;line(hx,hy,ex,ey,'#bbb');
 line(ex,ey,ex+Math.cos(a+.6)*7,ey+Math.sin(a+.6)*7,'#ffb84d');R(ex+Math.cos(a+.6)*7-1,ey+Math.sin(a+.6)*7-1,2,2,'#c06010');
 line(hx,hy,hx-2,hy+7,'#ffb84d')}
function turtle(o){const x=Math.round(o.x),y=GY,b=Math.floor(T*6)%2,fl=o.fl>0&&Math.floor(T*30)%2;
 const G=fl?'#fff':'#3fbf3f',G2=fl?'#ddd':'#2a8a2a';
 R(x-8,y-6,5,6,G2);R(x+3,y-6,5,6,G2);
 ellipse(x+4,y-15,10,11,'#8a5a2b');ellipse(x+5,y-15,8,9,'#a8743a');R(x+1,y-20,7,1,'#6a3a1a');R(x+1,y-14,8,1,'#6a3a1a');
 ellipse(x-2,y-14,7,9,G);ellipse(x-3,y-13,4,7,'#ffd27a');for(let i=0;i<3;i++)R(x-6,y-17+i*4,6,1,'#e0a040');
 disc(x-4,y-27,7,G);R(x-11,y-29,15,3,'#e02020');R(x+3,y-30-b,5,2,'#e02020');R(x+6,y-28+b,4,2,'#e02020');
 R(x-10,y-29,3,2,'#fff');R(x-6,y-29,3,2,'#fff');R(x-10,y-28,1,1,'#000');R(x-6,y-28,1,1,'#000');
 R(x-11,y-31,4,1,'#000');R(x-7,y-31,4,1,'#000');R(x-9,y-24,5,1,'#000');R(x-8,y-23,3,1,'#fff');
 // arm + bo staff
 const sa=o.stun>0?.5:Math.sin(T*5)*.5-.3;R(x-10,y-18,5,3,G);const sx=x-11,sy=y-17;line(sx-Math.cos(sa)*12,sy-Math.sin(sa)*12+6,sx+Math.cos(sa)*10,sy+Math.sin(sa)*10-14,'#7a4a1f');
 if(o.stun>0)for(let i=0;i<3;i++){const a=T*6+i*2.1;R(x-4+Math.cos(a)*8,y-38+Math.sin(a)*2,2,2,GOLD)}
 for(let i=0;i<3;i++){const hx=x-10+i*8,hy=y-46;if(i<o.hp){R(hx,hy,2,2,'#ff3a5a');R(hx+3,hy,2,2,'#ff3a5a');R(hx,hy+1,5,2,'#ff3a5a');R(hx+1,hy+3,3,1,'#ff3a5a');R(hx+2,hy+4,1,1,'#ff3a5a')}else{R(hx+1,hy+1,3,2,'#555')}}}
function rock(o){const x=Math.round(o.x),y=GY;ellipse(x+7,y-6,7,6,'#8a8aa0');ellipse(x+6,y-7,5,3,'#b0b0c8');geye(x+4,y-6,2,-1,0);geye(x+9,y-6,2,-1,0)}
function crate(o){const x=Math.round(o.x),y=GY-14;R(x,y,14,14,'#a8743a');R(x+1,y+1,12,12,'#c98f4a');line(x+1,y+1,x+12,y+12,'#8a5426');line(x+12,y+1,x+1,y+12,'#8a5426');R(x,y,14,1,'#6a3a1a');R(x,y+13,14,1,'#6a3a1a')}
function coin(x,y){const s=Math.abs(Math.cos(T*5+x/30)),w=Math.max(1,Math.round(5*s));ellipse(x,y,w,5,'#c08000');ellipse(x,y,Math.max(0,w-1),4,'#ffcc00');if(w>2)R(x-1,y-3,1,4,'#fff6a0')}
function laserWall(wx){const fl=Math.floor(T*20)%2;
 cx.globalAlpha=.25;R(0,0,wx+4,GY,'#ff2a4a');cx.globalAlpha=.5;R(wx-6,0,8,GY,'#ff2a4a');cx.globalAlpha=1;
 R(wx-2,0,3,GY,fl?'#fff':'#ffb0c0');R(wx-3,0,1,GY,'#ff3a5a');R(wx+1,0,1,GY,'#ff3a5a');
 for(let i=0;i<5;i++){const yy=(i*47+T*90)%GY;R(wx-8,yy,10,2,'#ff7a8a')}
 // drone
 const dy=26+Math.sin(T*3)*3;ellipse(wx,dy,10,5,'#6b7088');ellipse(wx,dy-2,8,3,'#9aa0b4');R(wx-14,dy-6,8,1,'#ccc');R(wx+6,dy-6,8,1,'#ccc');R(wx-11,dy-5,1,2,'#666');R(wx+10,dy-5,1,2,'#666');
 disc(wx+2,dy,3,'#ff3a3a');R(wx+2,dy-1,1,1,'#fff');R(wx-4,dy+4,9,2,'#ff3a5a');
 if(S.zap>0&&st==='play'){for(let i=0;i<3;i++){const yy=GY-12-i*16;R(wx,yy,Math.min(PX-wx-10,30+i*6)*(S.zap/.25),2,'#ff5a7a')}}}
// ---------- backgrounds ----------
const hsh=n=>{n=(n*374761393+668265263)|0;n=(n^(n>>>13))*1274126177|0;return((n^(n>>>16))>>>0)/4294967296};
function layer(off,seg,fn){const i0=Math.floor(off/seg);for(let i=i0;i<i0+Math.ceil(W/seg)+2;i++)fn(i*seg-off,i,hsh(i*7+seg))}
function bg1(){const sk=['#1a1040','#2b1470','#4a1f8a','#7a2a9a'],bh=GY/4;sk.forEach((c,i)=>R(0,i*bh,W,Math.ceil(bh)+1,c));
 layer(S.scroll*.02,30,(x,i,r)=>{R(x+r*30,r*90,1,1,(T*3+i)%3<1?'#fff':'#8a7fd6')});
 disc(100-S.scroll*.01%40,34,11,'#fff6c0');disc(104-S.scroll*.01%40,31,9,'#2b1470');
 layer(S.scroll*.15,34,(x,i,r)=>{const h=40+r*60;R(x,GY-h,30,h,'#3a1a6a');for(let a=0;a<3;a++)for(let b=0;b<Math.floor(h/12);b++)if(hsh(i*31+a*7+b)>.55)R(x+5+a*8,GY-h+5+b*12,3,5,'#ff5ad1')});
 layer(S.scroll*.45,48,(x,i,r)=>{const h=30+r*36;R(x,GY-h,40,h,'#24124a');R(x,GY-h,40,2,'#5af7ff');for(let b=0;b<Math.floor(h/10);b++)R(x+5,GY-h+5+b*10,30,3,hsh(i+b)>.5?'#ffe27a':'#3a2470')});
 R(0,GY,W,H-GY,'#2a2440');R(0,GY,W,4,'#6a5aa0');R(0,GY+4,W,2,'#4a3a80');const o=Math.floor(S.scroll)%20;for(let x=-o;x<W;x+=20)R(x,GY+12,10,2,GOLD);R(0,GY+20,W,1,'rgba(0,0,0,.3)')}
function mix(a,b,k){return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*Math.max(0,Math.min(1,k)))).join(',')})`}
function bg2(){const HY=L2HY(),p=Math.min(1,S.climb/L2LEN);
 for(let i=0;i<4;i++)R(0,i*H/4,W,Math.ceil(H/4)+1,mix([79+i*20,195+i*12,255],[26+i*12,16+i*8,64+i*20],p*1.3-.15));
 if(p>.35){cx.globalAlpha=Math.min(1,(p-.35)*2.5);layer(0,24,(x,i,r)=>{R(x+r*20,(r*H*1.7+S.climb*.05)%H,1,1,(T*3+i)%3<1?'#fff':'#bfb0ff')});cx.globalAlpha=1}
 if(p>.6)disc(24,40,9,'#fff6c0');
 layer(0,70,(x,i,r)=>{const yy=((i*97+S.climb*.35)%(H+60))-30;cx.globalAlpha=.7;ellipse(x+30,yy,16,5,'#fff');ellipse(x+38,yy-3,9,4,'#fff');cx.globalAlpha=1});
 const gy=HY+30+S.climb;if(gy<H+80){layer(0,26,(x,i,r)=>{const h=30+r*40;R(x,gy-h,22,h,'#3a2a6a');for(let b=0;b<3;b++)R(x+4,gy-h+5+b*9,14,3,'#ffe27a')});R(0,gy,W,200,'#2a8a3a');R(0,gy,W,3,'#5fd35f')}
 const wx=WC()-WALLW,ww=WALLW*2,topY=Math.round(HY-(L2LEN+40-S.climb)),y0=Math.max(-2,topY),c=Math.floor(S.climb);
 R(wx-2,y0,ww+4,H-y0,'#5a2a1a');R(wx,y0,ww,H-y0,'#c0603a');
 for(let yy=y0+(((HY+c-y0)%8)+8)%8;yy<H;yy+=8){const n=Math.round((HY+c-yy)/8);R(wx,yy,ww,1,'#8a3a22');for(let k=0;k<4;k++)R(wx+((k*8+(n&1)*4)%ww),yy+1,1,7,'#8a3a22')}
 R(wx,y0,2,H-y0,'#e08050');R(wx+ww-2,y0,2,H-y0,'#a04a2a');
 if(topY>-40){R(wx-6,topY-4,ww+12,6,'#7a3a22');R(wx-6,topY-4,ww+12,2,'#e08050');const fx=WC();R(fx,topY-34,2,30,'#ddd');const fw=Math.floor(T*8)%2;R(fx+2,topY-34,14,9,'#ff3a5a');R(fx+14,topY-34+fw,4,9,'#ff3a5a');text('M',fx+9,topY-33,GOLD,1,1)}}
// ---------- UI ----------
function btnBase(b,col,pulse){const p=pulse&&(T*6|0)%2;box(b.x-(p?2:0),b.y-(p?2:0),b.w+(p?4:0),b.h+(p?4:0),p?'#fff':col,'#000','rgba(0,0,0,.4)');if(!(p))R(b.x+3,b.y+3,b.w-6,3,'rgba(255,255,255,.45)')}
function arrowUp(mx,my,c='#fff'){for(let i=0;i<14;i++)R(mx-i,my-10+i,i*2+1,1,c);R(mx-5,my+4,11,10,c)}
function arrowSide(mx,my,d,c='#fff'){for(let i=0;i<14;i++)R(d<0?mx-10+i:mx+10-i,my-i,1,i*2+1,c);R(d<0?mx+4:mx-14,my-5,10,11,c)}
function swordIcon(mx,my){for(let i=0;i<16;i++)R(mx-8+i,my+8-i,3,3,i>12?'#fff':'#d8e4ff');R(mx-10,my+3,8,3,GOLD);R(mx-7,my,3,9,GOLD);R(mx-13,my+10,4,4,'#7a4a1f')}
function heart(x,y,on){const c=on?'#ff3a5a':'#3a2a4a';R(x,y,4,3,c);R(x+5,y,4,3,c);R(x-1,y+1,11,4,c);R(x,y+5,9,2,c);R(x+2,y+7,5,2,c);R(x+4,y+9,1,1,c);if(on)R(x+1,y+1,2,1,'#fff')}
function muteBtn(){const b=BTN.mute;box(b.x,b.y,b.w,b.h,'#fff','#000');const x=b.x+5,y=b.y+10;R(x,y-2,3,5,'#222');for(let i=0;i<5;i++)R(x+3+i,y-2-i,1,5+i*2,'#222');
 if(muted){line(x+10,y-4,x+15,y+4,'#e33');line(x+15,y-4,x+10,y+4,'#e33')}else{R(x+10,y-2,1,5,'#222');R(x+12,y-4,1,9,'#222')}}
function bigStar(x,y,r,c){for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5,a2=a+Math.PI/5;poly([[x,y],[x+Math.cos(a)*r,y+Math.sin(a)*r],[x+Math.cos(a2)*r*.45,y+Math.sin(a2)*r*.45]],c);poly([[x,y],[x+Math.cos(a2)*r*.45,y+Math.sin(a2)*r*.45],[x+Math.cos(a+2*Math.PI/5)*r,y+Math.sin(a+2*Math.PI/5)*r]],c)}}
function poly(pts,c){cx.fillStyle=c;cx.beginPath();cx.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))cx.lineTo(p[0],p[1]);cx.closePath();cx.fill()}
function hud(){box(4,4,50,18,'#1a1040','#000');ellipse(14,13,4,4,'#ffcc00');textO(S.coins,22,10,GOLD,1);
 if(LV===1){const p=Math.min(1,S.scroll/L1END);box(58,4,128,18,'#1a1040','#000');R(70,12,104,2,'#5a4a8a');R(70,12,104*p,2,GOLD);
  R(66+104*p,8,5,8,SUIT);R(66+104*p,7,5,2,SKIN);R(176,8,7,8,'#3fbf3f');R(176,8,7,2,'#e02020');
  const d=Math.max(0,S.lead)/LEADMAX;box(4,25,182,10,'#1a1040','#000');R(6,27,178,6,'#3a2a4a');R(6,27,Math.max(3,178*(1-d)),6,d<.4?((T*8|0)%2?'#ff3a3a':'#fff'):'#ff3a5a')}
 else{for(let i=0;i<3;i++)heart(62+i*14,8,i<S.hearts);const p=Math.min(1,S.climb/L2LEN);box(UW-18,30,12,120,'#1a1040','#000');R(UW-14,34+112*(1-p),4,112*p,GOLD);R(UW-15,32,6,3,'#ff3a5a')}}
function drawWorld(){
 if(st==='menu'){bg1();return}
 if(LV===1){bg1();for(const o of S.ob){if(o.k==='kamen')rock(o);else if(o.k==='kutija'&&!o.dead)crate(o);else if(o.k==='zl'&&!o.dead)coin(o.x,o.y);else if(o.k==='majmun'&&!o.dead)monkey(o);else if(o.k==='kornjaca'&&!o.dead)turtle(o)}
  if(st!=='win'||true){hero(PX,GY+S.y);const wx=Math.round(PX-10-Math.max(0,Math.min(LEADMAX,S.lead))*.27);if(!S.done||S.done<1.6)laserWall(wx-(S.done?(S.done-1)*80:0))}}
 else{bg2();const HY=L2HY();
  for(const c of S.cs){const sy=HY-(c.h-S.climb);coin(cx2(c.side)+(c.side?3:-3),sy)}
  const L=S.las;if(L){const ty=HY-14,ex=L.side===0?WC()-WALLW:WC()+WALLW,tx=L.side===0?0:W;const on=(T*8|0)%2;
   if(L.ph===0){cx.globalAlpha=on?.25:.1;R(L.side===0?0:ex,0,L.side===0?ex:W-ex,H,'#ff2a4a');cx.globalAlpha=1;
    for(let x=Math.min(tx,ex);x<Math.max(tx,ex);x+=6)if(on)R(x,ty,3,1,'#ff5a7a');}
   else{const k=L.t/.5;R(Math.min(tx,ex),ty-5,Math.abs(ex-tx),10,'#ff2a4a');R(Math.min(tx,ex),ty-3,Math.abs(ex-tx),6,'#ff8a9a');R(Math.min(tx,ex),ty-1,Math.abs(ex-tx),2,'#fff');
    burst(ex,ty,2,['#fff','#ffe14d','#ff5a7a'],60,100,.3)}
   // turret
   const tX=L.side===0?0:W-12;R(tX,ty-8,12,16,'#6b7088');R(tX+1,ty-7,10,14,'#9aa0b4');disc(L.side===0?tX+10:tX+2,ty,3,L.ph===1||on?'#ff3a3a':'#7a1a1a');
   if(L.ph===0&&on)textO('!',L.side===0?tX+18:tX-8,ty-30,GOLD,2,1)}
  const hx=hx2(),hy=HY-(S.hop>0?Math.round(Math.sin((1-S.hop/.26)*Math.PI)*10):0);heroClimb(hx,hy,S.hop>0?(S.side===0?-1:1)*-1:(S.side===0?1:-1));
  if(st==='play'&&!S.done&&((L&&L.ph===0&&L.side===S.side&&S.hop<=0)||S.hint>0)){const d=S.hint>0?((T*1.5|0)%2?1:-1):(S.side===0?1:-1),ax=WC()+d*(WALLW+30),ay=HY-50;
   if((T*6|0)%2){for(let i=0;i<8;i++)R(d<0?ax-6+i:ax+6-i,ay-i,1,i*2+1,GOLD);R(d<0?ax+2:ax-10,ay-3,8,7,GOLD)}}}
 for(const q of S.pt)R(q.x,q.y,q.sz,q.sz,q.c);
 for(const q of S.pop){if(q.t<.25&&((T*20)|0)%2)continue;textO(q.s,q.x,q.y,q.c,q.sc,1)}}
function draw(){const sx=S.shake>0?Math.round((Math.random()-.5)*6):0,sy=S.shake>0?Math.round((Math.random()-.5)*6):0;
 cx=wcx;W=WW;H=WH;GY=WGY;cx.setTransform(1,0,0,1,sx,sy);cx.imageSmoothingEnabled=false;drawWorld();cx.setTransform(1,0,0,1,0,0);
 cx=mcx;W=UW;H=UH;GY=UGY;cx.imageSmoothingEnabled=false;cx.drawImage(wc,0,0,WW,WH,0,0,WW*ZM,WH*ZM);
 if(S.flash>0){cx.globalAlpha=S.flash*4;R(0,0,W,H,'#fff');cx.globalAlpha=1}
 if(st==='play'&&S.bannerT>0){const k=Math.min(1,(1.8-S.bannerT)*6);textO(S.banner,W/2,90,rainbow,k<1?4:3,1)}
 if(st==='menu')menu();
 if(st==='play'||st==='over'){hud();if(st==='play'){
  if(LV===1){btnBase(BTN.a,'#ffb627');arrowUp(BTN.a.x+49,BTN.a.y+30);textO('SKOK',BTN.a.x+49,BTN.a.y+58,'#fff',2,1);
   const near=S.ob.some(o=>!o.dead&&(o.k==='majmun'||o.k==='kornjaca')&&o.x-PX<56);btnBase(BTN.b,'#ff5ad1',near);swordIcon(BTN.b.x+49,BTN.b.y+30);textO('MAČ',BTN.b.x+49,BTN.b.y+58,'#fff',2,1)}
  else{cx.globalAlpha=.85;btnBase(BTN.a,'#4fc3f7');arrowSide(BTN.a.x+49,BTN.a.y+38,-1);btnBase(BTN.b,'#4fc3f7');arrowSide(BTN.b.x+49,BTN.b.y+38,1);cx.globalAlpha=1}}}
 if(st==='over')overScreen();if(st==='win')winScreen();
 muteBtn();W=WW;H=WH;GY=WGY;cx=wcx}
function playBtn(b,label,c){btnBase(b,c);const mx=b.x+b.w/2|0,my=b.y+b.h/2|0;for(let i=0;i<14;i++)R(mx-26+i,my-14+i,1,29-i*2,'#fff');textO(label,mx+12,my-10,'#fff',3,1)}
function menu(){cx.globalAlpha=.3;R(0,0,W,H,'#1a1040');cx.globalAlpha=1;
 textO('LASER',W/2,26,'#ff3a5a',4,1);textO('JUNAK',W/2,62,rainbow,4,1);
 // decorative beams
 for(let i=0;i<3;i++){const yy=120+i*30+Math.sin(T*2+i)*10;cx.globalAlpha=.6;R(0,yy,W,3,'#ff2a4a');R(0,yy+1,W,1,'#fff');cx.globalAlpha=1}
 const sv=S.y,ss=S.sw;S.y=0;S.sw=(T%1.6)<.28?.28-(T%1.6):0;cx.save();cx.translate(W/2,205);cx.scale(3,3);hero(0,0);cx.restore();S.y=sv;S.sw=ss;
 playBtn(BTN.p1,'1','#ffb627');
 const b=BTN.p2;btnBase(b,unlocked>=2?'#4fc3f7':'#5a5a7a');if(unlocked>=2){for(let i=0;i<8;i++)R(b.x+10+i,b.y+17+i,1,17-i*2,'#fff');textO('2',b.x+36,b.y+18,'#fff',3,1)}
 else{R(b.x+20,b.y+22,16,14,GOLD);R(b.x+23,b.y+14,10,2,GOLD);R(b.x+23,b.y+14,2,8,GOLD);R(b.x+31,b.y+14,2,8,GOLD);R(b.x+27,b.y+27,2,5,'#000')}
 if(best)textO('★ '+best,W/2,H-46,GOLD,2,1)}
function homeBtn(){const b=BTN.home;box(b.x,b.y,b.w,b.h,'#fff','#000','rgba(0,0,0,.4)');const mx=b.x+20,my=b.y+20;for(let i=0;i<12;i++)R(mx-i,my-10+i,i*2+1,1,'#2d6cdf');R(mx-8,my+2,17,11,'#2d6cdf');R(mx-2,my+6,5,7,'#fff')}
function goBtn(label){const b=BTN.go;btnBase(b,'#7dff5a');textO(label,b.x+b.w/2+12,b.y+b.h/2-10,'#fff',3,1);for(let i=0;i<10;i++)R(b.x+16+i,b.y+b.h/2-9+i,1,19-i*2,'#fff')}
function overScreen(){const k=Math.min(1,S.endT*2);cx.globalAlpha=.75*k;R(0,0,W,H,'#1a1040');cx.globalAlpha=1;
 textO('UPS!',W/2,50,'#ff5a7a',Math.max(1,Math.round(6*k)),1);
 if(k>=1){cx.save();cx.translate(W/2,210);cx.scale(3,3);const si=S.inv,sst=S.stun,sy=S.y;S.inv=0;S.stun=1;S.y=0;heroBody(0,false,true);S.inv=si;S.stun=sst;S.y=sy;
  for(let i=0;i<4;i++)R(-6+i*4,-34-((T*12+i*3)%8),2,2,'#aaa');cx.restore();
  textO(LV===1?'LASER TE STIGAO!':'BEZ SRCA!',W/2,226,'#fff',1,1);
  ellipse(W/2-20,250,5,5,'#ffcc00');textO(S.coins,W/2-10,244,GOLD,2,0)}
 if(S.endT>1){goBtn('OPET!');homeBtn()}}
function winScreen(){const k=Math.min(1,S.endT*2);cx.globalAlpha=.6*k;R(0,0,W,H,'#1a1040');cx.globalAlpha=1;
 const fin=LV===2;textO(fin?'POBJEDA!':'BRAVO!',W/2,40,rainbow,Math.max(1,Math.round((fin?4:5)*k)),1);
 textO('NIVO '+LV,W/2,84,'#fff',2,1);
 for(let i=0;i<3;i++){const x=W/2-60+i*60,y=140,on=i<S.starsShown;const s=on?1+Math.max(0,.3-(S.endT-.4-i*.35))*2:1;bigStar(x,y,22*s,'#000');bigStar(x,y,19*s,on?GOLD:'#3a2a5a');if(on)bigStar(x-2,y-2,7,'#fff8b0')}
 ellipse(W/2-24,192,6,6,'#ffcc00');textO(S.coins,W/2-14,186,GOLD,2,0);textO('★ '+(runScore),W/2,212,'#5af7ff',2,1);if(S.newBest)textO('NOVI REKORD!',W/2,234,rainbow,1,1);
 if(S.endT>1){goBtn(fin?'OPET!':'DALJE');homeBtn()}}
let last=performance.now();
function loop(n){const dt=Math.min(0.05,(n-last)/1000);last=n;update(dt);try{draw()}catch(e){console.error(e)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window.__lj={get S(){return S},get st(){return st},get LV(){return LV},start,jump,sword,side,PX,get GY(){return WGY},L2HY};
})();
