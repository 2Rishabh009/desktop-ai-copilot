import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './region-picker.css';
function App() {
 const [start,setStart]=useState<{x:number;y:number}|null>(null); const [rect,setRect]=useState({x:0,y:0,width:0,height:0}); const dragging=useRef(false);
 useEffect(()=>{const down=(e:MouseEvent)=>{dragging.current=true;setStart({x:e.clientX,y:e.clientY});setRect({x:e.clientX,y:e.clientY,width:0,height:0})};const move=(e:MouseEvent)=>{if(!dragging.current||!start)return;setRect({x:Math.min(start.x,e.clientX),y:Math.min(start.y,e.clientY),width:Math.abs(e.clientX-start.x),height:Math.abs(e.clientY-start.y)})};const up=()=>{if(!dragging.current)return;dragging.current=false;if(rect.width>4&&rect.height>4)window.desktopAPI.regionResult(rect)};window.addEventListener('mousedown',down);window.addEventListener('mousemove',move);window.addEventListener('mouseup',up);return()=>{window.removeEventListener('mousedown',down);window.removeEventListener('mousemove',move);window.removeEventListener('mouseup',up)}},[start,rect.width,rect.height]);
 return <div className="picker"><div className="instruction">Drag to select a screen region · Esc to cancel</div>{rect.width>0&&<div className="selection" style={{left:rect.x,top:rect.y,width:rect.width,height:rect.height}}/>}</div>;
}
window.addEventListener('keydown',e=>{if(e.key==='Escape')window.desktopAPI.regionCancel()});
createRoot(document.getElementById('root')!).render(<App/>);
