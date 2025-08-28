import React, { useEffect, useMemo, useRef, useState } from "react"
import { getProgress, setProgress } from "../utils/storage.js"

/* AÇILI (yanıtsız) – sıralı mod her tur farklı, 6. seviyeden sonra karmaşık */
const LETTERS="ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("")
const DIGITS ="0123456789".split("")
const WORDS=[
  "OKUL","KİTAP","ELMA","KUŞ","DENİZ","ARABA","RENK","YOL","ZAMAN","GÜNEŞ","AY","YILDIZ",
  "BULUT","ORMAN","KALEM","KAĞIT","MASA","SANDALYE","TAŞ","SU","RÜZGAR","OYUN","DOST",
  "MAVİ","SARI","YEŞİL","HIZ","GÖR","BAK","SAYI"
]
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
const pad2=(n)=>String(n).padStart(2,"0")
const rand=(a,b)=>a+Math.random()*(b-a)

export default function Acili({student,onExit,onComplete}){
  const [material,setMaterial]=useState("harf")
  const [autoSpeed,setAutoSpeed]=useState(true)
  const [speedMs,setSpeedMs]=useState(900)
  const [level,setLevel]=useState(1)
  const [fontSize,setFontSize]=useState(46)
  const [bgColor,setBgColor]=useState("#0f2353")
  const [fgColor,setFgColor]=useState("#ffffff")
  const [showGrid,setShowGrid]=useState(true)

  const [running,setRunning]=useState(false)
  const [items,setItems]=useState([])
  const [mode,setMode]=useState("sıralı")

  const [shown,setShown]=useState(0)
  const [leftSec,setLeftSec]=useState(5*60)
  const [bestShown,setBestShown]=useState(()=> {
    try { return Number(localStorage.getItem(`ho_acili_bestShown_${student.code}`)||0) } catch { return 0 }
  })

  const boardRef=useRef(null)
  const tickRef=useRef(null)

  const pool=useMemo(()=>material==="kelime"?WORDS:material==="rakam"?DIGITS:LETTERS,[material])
  const exposure=useMemo(()=>autoSpeed?Math.max(300,900-(level-1)*50):speedMs,[autoSpeed,speedMs,level])

  useEffect(()=>{ setMode(level>=6?"karmaşık":"sıralı") },[level])

  // Süre sayacı
  useEffect(()=>{
    if(!running) return
    if(tickRef.current) return
    tickRef.current=setInterval(()=>{
      setLeftSec(s=>{
        if(s<=1){ clearInterval(tickRef.current); tickRef.current=null; setRunning(false); return 0 }
        return s-1
      })
    },1000)
    return ()=>{ clearInterval(tickRef.current); tickRef.current=null }
  },[running])

  // Yeni frame oluştur
  function nextFrame(){
    const el=boardRef.current
    const W=el?.clientWidth??900
    const H=el?.clientHeight??360
    let count
    if(material==="kelime") count=6+Math.floor((level-1)*0.8)   // 6–13
    else count=10+(level-1)*2                                  // 10–28
    count=clamp(count,6,28)

    const padX=24, padY=24
    const arr=[]

    if(mode==="sıralı"){
      // — her tur farklı parametreler —
      const dir = Math.random()<.5 ? 1 : -1              // L->R veya R->L
      const base = H*rand(0.15,0.3)                      // hatın yüksekliği
      const A = H*rand(0.08,0.18) * (Math.random()<.5?-1:1) // kemer yukarı/aşağı
      const slope = H*rand(-0.22,0.22)                   // genel eğim (px)
      const phase = rand(0,Math.PI)                      // sin fazı
      const freq = rand(0.9,1.3)                         // sin frekansı (π ile çarpılıyor)
      const jitter = 0.28                                 // aralık rastgeleliği (0..0.5)

      for(let i=0;i<count;i++){
        let t = count===1?0.5 : i/(count-1)
        // aralık jitter; clamp 0..1
        t = clamp(t + rand(-jitter,jitter)/(count), 0, 1)
        // yön
        const s = dir===1? t : (1-t)

        const x = padX + s*(W - 2*padX)
        let y = base + A*Math.sin(phase + freq*Math.PI*s) + slope*(s-.5)
        y += rand(-6,6)                                   // hafif dikey jitter
        y = clamp(y, padY, H-padY)

        arr.push({x,y})
      }
    } else {
      // karmaşık: Poisson benzeri uzaklık kısıtı
      const minDist = 46
      let tries=0
      while(arr.length<count && tries<count*80){
        tries++
        const x = padX + Math.random()*(W-2*padX)
        const y = padY + Math.random()*(H-2*padY)
        if(arr.every(p => ((p.x-x)**2+(p.y-y)**2) > minDist*minDist)) arr.push({x,y})
      }
    }

    const pick = ()=> pool[Math.floor(Math.random()*pool.length)]
    const withText = arr.map((p,idx)=>({ ...p, text:String(pick()), id: idx+"_"+Math.random().toString(36).slice(2,7) }))
    setItems(withText)
  }

  // Döngü
  useEffect(()=>{
    if(!running){ setItems([]); return }
    let cancelled=false
    const step=()=>{
      if(cancelled) return
      nextFrame()
      const t1=setTimeout(()=>{
        if(cancelled) return
        setItems([])
        setShown(n=>{
          const nn=n+1
          if(nn%25===0) setLevel(l=>clamp(l+1,1,10))
          return nn
        })
        const t2=setTimeout(step,420)
        return ()=>clearTimeout(t2)
      },exposure)
      return ()=>clearTimeout(t1)
    }
    const c1=step()
    return ()=>{ cancelled=true; if(typeof c1==="function") c1() }
  },[running,exposure,material,level,mode])

  useEffect(()=>()=>{ clearInterval(tickRef.current) },[])

  const start=()=>{ if(!running && leftSec>0) setRunning(true) }
  const stop =()=>{ setRunning(false); setItems([]) }

  const complete=()=>{
    stop()
    try{
      const p=getProgress(student.code)
      const np={...p, unit1:{...(p?.unit1||{}), acili_done:true, acili_shown:shown, acili_level:level, lastFinished:new Date().toISOString()}}
      setProgress(student.code,np)
    }catch{}
    setBestShown(b=>{
      const nb=Math.max(b,shown)
      try{ localStorage.setItem(`ho_acili_bestShown_${student.code}`,String(nb)) }catch{}
      return nb
    })
    onComplete?.()
  }

  const Desc=()=>(
    <p style={{textAlign:'left',margin:'8px 0 14px',color:'#1b315f'}}>
      <strong>Açılı Egzersiz Çalışması:</strong> Görme açısını genişletmek için paneldeki harf/kelime/rakam
      gruplarını <em>eşzamanlı</em> algılamayı çalıştırır. İlk seviyelerde açılı/kemerli bir hatta
      dizilir, üst seviyelerde karmaşık olarak dağılır. Yanıt girişi yoktur; gösterimler otomatik akar.
    </p>
  )

  const gridBg = showGrid
    ? `repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 32px),
       repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 32px),
       ${bgColor}` : bgColor

  return (
    <div className="exerciseWrap">
      <h2 style={{marginBottom:6}}>Açılı</h2>
      <Desc/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))',gap:12,margin:'8px 0 10px'}}>
        <div style={{background:'#f3f6ff',borderRadius:12,padding:10}}>
          <div style={{fontWeight:800,marginBottom:6}}>Materyal</div>
          <div className="row" style={{gap:8}}>
            <label><input type="radio" name="m" checked={material==='harf'} onChange={()=>setMaterial('harf')}/> Harf</label>
            <label><input type="radio" name="m" checked={material==='kelime'} onChange={()=>setMaterial('kelime')}/> Kelime</label>
            <label><input type="radio" name="m" checked={material==='rakam'} onChange={()=>setMaterial('rakam')}/> Rakam</label>
          </div>
        </div>

        <div style={{background:'#f3f6ff',borderRadius:12,padding:10}}>
          <div style={{fontWeight:800,marginBottom:6}}>Hız (ms)</div>
          <div className="row" style={{gap:8}}>
            <input type="range" min="300" max="1200" step="10"
              value={autoSpeed?Math.max(300,900-(level-1)*50):speedMs}
              onChange={e=>setSpeedMs(Number(e.target.value))}
              disabled={autoSpeed} style={{width:160}} />
            <span>{autoSpeed?Math.max(300,900-(level-1)*50):speedMs} ms</span>
          </div>
          <label style={{display:'block',marginTop:6}}>
            <input type="checkbox" checked={autoSpeed} onChange={()=>setAutoSpeed(v=>!v)} /> Oto hız (seviyeye göre)
          </label>
        </div>

        <div style={{background:'#f3f6ff',borderRadius:12,padding:10}}>
          <div style={{fontWeight:800,marginBottom:6}}>Yazı Boyutu</div>
          <div className="row" style={{gap:8}}>
            <input type="range" min="28" max="80" step="2" value={fontSize}
              onChange={e=>setFontSize(Number(e.target.value))} style={{width:160}}/>
            <span>{fontSize}px</span>
          </div>
          <label style={{display:'block',marginTop:6}}>
            <input type="checkbox" checked={showGrid} onChange={()=>setShowGrid(v=>!v)} /> Izgara
          </label>
        </div>

        <div style={{background:'#f3f6ff',borderRadius:12,padding:10}}>
          <div style={{fontWeight:800,marginBottom:6}}>Renkler</div>
          <div className="row" style={{gap:8}}>
            <label> Zemin <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)}/></label>
            <label> Yazı <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)}/></label>
          </div>
          <div className="row" style={{gap:8,marginTop:6}}>
            <strong>Seviye:</strong> {level}
            <span style={{fontSize:12,opacity:.8}}>(her 25 gösterim → +1)</span>
            <span className="stat" style={{marginLeft:8}}>Mod: {mode}</span>
          </div>
        </div>
      </div>

      <div ref={boardRef} style={{position:'relative',height:360,borderRadius:14,overflow:'hidden',background:gridBg}}>
        {items.map(it=>(
          <div key={it.id} style={{
            position:'absolute',left:it.x,top:it.y,transform:'translate(-50%,-50%)',
            color:fgColor,fontWeight:900,fontSize:fontSize,letterSpacing:1.5,
            textShadow:'0 2px 0 rgba(0,0,0,.15)'
          }}>{it.text}</div>
        ))}
      </div>

      <div className="exRow" style={{justifyContent:"center",marginTop:12,gap:10,flexWrap:'wrap'}}>
        {!running && leftSec>0 && <button className="btn" onClick={start}>Başla</button>}
        {running && <button className="btn" onClick={stop}>Durdur</button>}
        {(leftSec>0) && <button className="btn" onClick={onExit}>Panele Dön</button>}
        {(leftSec===0) && <button className="btn" onClick={complete}>Tamamla ve Panele Dön</button>}
      </div>

      <div className="exRow" style={{justifyContent:'center',gap:12,marginTop:8,flexWrap:'wrap'}}>
        <div className="stat">Gösterim: {shown}</div>
        <div className="stat">Seviye: {level}</div>
        <div className="stat">Hız: {autoSpeed?Math.max(300,900-(level-1)*50):speedMs} ms</div>
        <div className="stat">Rekor (gösterim): {bestShown}</div>
        <div className="stat">Süre: {pad2(Math.floor(leftSec/60))}:{pad2(leftSec%60)}</div>
      </div>
    </div>
  )
}
