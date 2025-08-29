import React, {useEffect, useMemo, useState} from "react";

function readJSON(k, fb){ try{ const v = localStorage.getItem(k); return v?JSON.parse(v):fb; }
catch{ return fb; } }
function writeJSON(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }

export default function GodMode(){
  // URL ?god=1 ise aç; yoksa localStorage bayrağına bak
  const qs = new URLSearchParams(location.search);
  const active = qs.get("god")==="1" || localStorage.DEV_GOD_MODE==="1";
  const [open, setOpen] = useState(active);

  useEffect(()=>{ if(qs.get("god")==="1") localStorage.DEV_GOD_MODE="1"; }, []);
  if(!open) return null;

  const keys = useMemo(()=>Object.keys(localStorage).sort(), []);

  const clearAll = () => {
    if(confirm("Tüm localStorage ve cache temizlensin mi?")){
      localStorage.clear();
      caches?.keys?.().then(ks=>ks.forEach(k=>caches.delete(k)));
      location.reload();
    }
  };

  const dump = () => {
    const data = {};
    keys.forEach(k => { data[k] = readJSON(k, localStorage.getItem(k)); });
    console.log("📦 STORAGE DUMP", data);
    alert("Konsola STORAGE DUMP yazıldı.");
  };

  return (
    <div style={{
      position:"fixed", right:14, bottom:14, zIndex:99999,
      fontFamily:"system-ui"
    }}>
      <div style={{
        background:"#0b1e2f", color:"#fff", padding:12, borderRadius:12,
        boxShadow:"0 8px 30px rgba(0,0,0,.35)", minWidth:280
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <b>🛡️ God Mode</b>
          <button onClick={()=>{setOpen(false);}}
                  style={{background:"transparent",color:"#fff",border:"none",
                          fontSize:18,cursor:"pointer"}}>×</button>
        </div>

        <div style={{fontSize:12,opacity:.8,margin:"8px 0 10px"}}>
          Hızlı kurtarma araçları • <code>?god=1</code> ile otomatik açılır
        </div>

        <button onClick={clearAll}
                style={{width:"100%",padding:"8px 10px",borderRadius:8,marginBottom:8}}>
          🧹 LocalStorage + Cache Temizle & Yenile
        </button>
        <button onClick={dump}
                style={{width:"100%",padding:"8px 10px",borderRadius:8,marginBottom:8}}>
          📤 Storage Dump (konsola yaz)
        </button>

        <details style={{marginTop:6}}>
          <summary style={{cursor:"pointer"}}>🔑 Anahtarlar</summary>
          <div style={{maxHeight:180,overflow:"auto",fontSize:12,marginTop:6}}>
            {keys.length===0 ? <i>localStorage boş</i> :
              keys.map(k=>(
                <div key={k} style={{margin:"4px 0"}}>
                  <code>{k}</code>
                </div>
              ))
            }
          </div>
        </details>
      </div>
    </div>
  );
}
