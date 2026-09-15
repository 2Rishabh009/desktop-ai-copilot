import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import './style.css';

type Msg = { role: 'user' | 'assistant'; content: string };
const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function App() {
  const [q,setQ] = useState(''); const [messages,setMessages] = useState<Msg[]>([]); const [busy,setBusy] = useState(false); const [recording,setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder|null>(null); const [sources,setSources] = useState<any[]>([]); const [shot,setShot] = useState<string|null>(null); const [shotName,setShotName] = useState('');
  const [settings,setSettings] = useState<any>({opacity:.88,alwaysOnTop:true,contentProtection:true,clickThrough:false});
  useEffect(() => { window.desktopAPI.getSettings().then(setSettings); return window.desktopAPI.onCaptureResult(payload => { setShot(payload.dataUrl); setShotName(payload.name); }); }, []);
  async function patch(key:string,value:any){ const next=await window.desktopAPI.setSettings({[key]:value}); setSettings(next); }
  async function ask(){
    if(!q.trim() || busy) return; const text=q.trim(); setQ(''); setBusy(true); setMessages(m=>[...m,{role:'user',content:text},{role:'assistant',content:''}]);
    try { const r=await fetch(`${API}/api/chat/stream`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,conversation_id:null,image_data_url:shot,include_screenshot:!!shot})}); if(!r.ok) throw new Error(await r.text());
      const reader=r.body!.getReader(); const dec=new TextDecoder(); let buf=''; while(true){ const {value,done}=await reader.read(); if(done) break; buf+=dec.decode(value,{stream:true}); const lines=buf.split('\n'); buf=lines.pop()||''; for(const line of lines){ if(!line.startsWith('data: ')) continue; const data=line.slice(6); if(data==='[DONE]') continue; const chunk=JSON.parse(data).delta||''; setMessages(m=>{const n=[...m]; const last=n.length-1; n[last]={...n[last],content:n[last].content+chunk}; return n;}); } }
    } catch(e) { setMessages(m=>{const n=[...m]; n[n.length-1]={role:'assistant',content:`Unable to complete request: ${String(e)}`}; return n;}); } finally { setBusy(false); }
  }
  async function loadSources(){ setSources(await window.desktopAPI.getSources()); }
  async function capture(id:string){ const x=await window.desktopAPI.capture(id); setShot(x.dataUrl); setShotName(x.name); setSources([]); }
  async function region(){ const displays=await window.desktopAPI.getDisplays(); const primary=displays.find((d:any)=>d.primary) || displays[0]; if(primary) await window.desktopAPI.pickRegion(primary.id); }
  async function toggleMic(){
    if(recording){ recorderRef.current?.stop(); return; } const stream=await navigator.mediaDevices.getUserMedia({audio:true}); const r=new MediaRecorder(stream); const chunks:BlobPart[]=[]; r.ondataavailable=e=>chunks.push(e.data);
    r.onstop=async()=>{ stream.getTracks().forEach(t=>t.stop()); setRecording(false); recorderRef.current=null; try{ const fd=new FormData(); fd.append('file',new Blob(chunks,{type:r.mimeType||'audio/webm'}),'speech.webm'); const res=await fetch(`${API}/api/speech/transcribe`,{method:'POST',body:fd}); const j=await res.json(); setQ(v=>(v?v+' ':'')+(j.text||'')); }catch(e){} };
    recorderRef.current=r; r.start(); setRecording(true);
  }
  return <div className="shell">
    <header><div className="drag"><span className="dot"/> AI Copilot <span className="status">Windows</span></div><button onClick={()=>window.desktopAPI.minimize()}>—</button><button onClick={()=>window.desktopAPI.close()}>×</button></header>
    <div className="toolbar"><button onClick={loadSources}>Capture window/display</button><button onClick={region}>Select region</button><button onClick={toggleMic}>{recording?'Stop mic':'🎙 Mic'}</button><label>Opacity <input type="range" min=".25" max="1" step=".01" value={settings.opacity} onChange={e=>patch('opacity',+e.target.value)}/></label><label><input type="checkbox" checked={!!settings.alwaysOnTop} onChange={e=>patch('alwaysOnTop',e.target.checked)}/> Always on top</label><label><input type="checkbox" checked={!!settings.contentProtection} onChange={e=>patch('contentProtection',e.target.checked)}/> Capture protection</label><label><input type="checkbox" checked={!!settings.clickThrough} onChange={e=>patch('clickThrough',e.target.checked)}/> Click-through</label></div>
    {sources.length>0 && <div className="sources">{sources.map(s=><button key={s.id} className="source" onClick={()=>capture(s.id)}><img src={s.thumbnail}/><span>{s.name}</span></button>)}</div>}
    {shot && <div className="shot"><div><img src={shot}/><span>Explicit capture: {shotName}</span></div><button onClick={()=>{setShot(null);setShotName('')}}>Clear</button></div>}
    <main>{messages.length===0 && <div className="welcome"><h2>How can I help?</h2><p>Ask a question, select a screen region, or capture a window/display and ask me to explain it.</p></div>}{messages.map((m,i)=><div key={i} className={`msg ${m.role}`}><div className="bubble">{m.role==='assistant'?<ReactMarkdown>{m.content||'Thinking…'}</ReactMarkdown>:m.content}</div></div>)}</main>
    <footer><textarea value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask()}}} placeholder={shot?'Ask about the captured content…':'Ask anything…'}/><button className="send" onClick={ask} disabled={busy||!q.trim()}>{busy?'…':'Send'}</button></footer>
    <div className="hint">Ctrl + Shift + Space · capture is user initiated · protection depends on Windows/capture path</div>
  </div>
}
createRoot(document.getElementById('root')!).render(<App/>);
