import React, { useEffect, useMemo, useRef, useState } from "react"
import { getProgress, setProgress } from "../utils/storage.js"

/* KÖŞELİ (yanıtsız/algılama) — sade & stabil döngü */
const LETTERS = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("")
const DIGITS  = "0123456789".split("")
const WORDS   = [
  "OKUL","KİTAP","ELMA","KUŞ","DENİZ","ARABA","RENK","YOL","ZAMAN","GÜNEŞ","AY","YILDIZ",
  "BULUT","ORMAN","KALEM","KAĞIT","MASA","SANDALYE","TAŞ","SU","YEL","RÜZGAR","DUR","KOŞ",
  "BİL","GÖR","BAK","SAYI","OYUN","ÖYKÜ","DOST","MAVİ","SARI","YEŞİL"
]
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n))
const pad2  = (n)=>String(n).padStart(2,"0")

export default function Koseli({ student, onExit, onComplete }){
  // Ayarlar
  const [material, setMaterial]   = useState("harf") // harf | kelime | rakam
  const [autoSpeed, setAutoSpeed] = useState(true)
  const [speedMs, setSpeedMs]     = useState(700)
  const [level, setLevel]         = useState(1)
  const [autoOffset, setAutoOffset] = useState(false)
  const [offset, setOffset]       = useState(120)
  const [fontSize, setFontSize]   = useState(64)
  const [bgColor, setBgColor]     = useState("#0f2353")
  const [fgColor, setFgColor]     = useState("#ffffff")
  const [scrollY, setScrollY]     = useState(true)

  // Durum
  const [running, setRunning] = useState(false)
  const [visible, setVisible] = useState(false)
  const [leftTxt, setLeftTxt]   = useState("")
  const [rightTxt, setRightTxt] = useState("")
  const [yPos, setYPos] = useState("50%")

  // Sayaç & istatistik
  const [shown, setShown] = useState(0)
  const [leftSec, setLeftSec] = useState(5*60)
  const [bestShown, setBestShown] = useState(() => {
    try { return Number(localStorage.getItem(`ho_koseli_bestShown_${student.code}`) || 0) } catch { return 0 }
  })

  // Referanslar
  const areaRef = useRef(null)
  const tickRef = useRef(null) // süre sayacı

  // Havuz ve parametreler
  const pool = useMemo(() => (material==="kelime"?WORDS : material==="rakam"?DIGITS : LETTERS), [material])
  const exposure = useMemo(() => (autoSpeed ? Math.max(250, 800 - (level-1)*55) : speedMs), [autoSpeed, speedMs, level])
  const effOffset = useMemo(() => (autoOffset ? 80 + (level-1)*10 : offset), [autoOffset, offset, level])

  // Çalışma süresi sayacı
  useEffect(() => {
    if (!running) return
    if (tickRef.current) return
    tickRef.current = setInterval(() => {
      setLeftSec(s => {
        if (s <= 1) {
          clearInterval(tickRef.current); tickRef.current = null
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => { clearInterval(tickRef.current); tickRef.current = null }
  }, [running])

  // GÖSTERİM DÖNGÜSÜ — running true olduğunda başlar, false olduğunda temizlenir
  useEffect(() => {
    if (!running) { setVisible(false); return }
    let cancelled = false
    const pick = () => pool[Math.floor(Math.random()*pool.length)]

    const loop = () => {
      if (cancelled) return
      // Y konumu
      if (scrollY) {
        const el = areaRef.current
        const p = 30 + Math.random() * ((el?.clientHeight ?? 260) - 60)
        setYPos(p + "px")
      } else setYPos("50%")

      // İçerik
      setLeftTxt(pick())
      setRightTxt(pick())
      setVisible(true)

      // Kısa süre göster → gizle → say ve devam et
      const t1 = setTimeout(() => {
        if (cancelled) return
        setVisible(false)
        setShown(n => {
          const nn = n + 1
          if (nn % 25 === 0) setLevel(l => clamp(l+1, 1, 10))
          return nn
        })
        const t2 = setTimeout(() => { if (!cancelled) loop() }, 420) // aralık
        // Temizlikte t2 de iptal olsun diye kayıt gerekmez; cancelled check yeterli
        return () => clearTimeout(t2)
      }, exposure)

      // cleanup bu timeout’u da iptal etsin
      return () => clearTimeout(t1)
    }

    // başlat
    const cleanup1 = loop()
    return () => { cancelled = true; if (typeof cleanup1 === 'function') cleanup1() }
  }, [running, pool, exposure, scrollY])

  // Bileşen unmount
  useEffect(() => () => { clearInterval(tickRef.current) }, [])

  const start = () => {
    if (running || leftSec === 0) return
    setRunning(true)
  }
  const stop = () => { setRunning(false); setVisible(false) }

  const complete = () => {
    stop()
    try{
      const p = getProgress(student.code)
      const np = {
        ...p,
        unit1: {
          ...(p?.unit1 || {}),
          koseli_done: true,
          koseli_shown: shown,
          koseli_level: level,
          lastFinished: new Date().toISOString()
        }
      }
      setProgress(student.code, np)
    }catch{}
    setBestShown(b => {
      const nb = Math.max(b, shown)
      try { localStorage.setItem(`ho_koseli_bestShown_${student.code}`, String(nb)) } catch {}
      return nb
    })
    onComplete?.()
  }

  const Desc = () => (
    <p style={{textAlign:'left', margin:'8px 0 14px', color:'#1b315f'}}>
      <strong>Köşesel Egzersiz Çalışması:</strong> İki katmanlı panelde eşzamanlı kısa gösterimlerle
      <em> aynı anda</em> algılamayı güçlendirir. Yanıt girişi yoktur; gösterimler otomatik akar.
    </p>
  )

  return (
    <div className="exerciseWrap">
      <h2 style={{marginBottom:6}}>Köşeli</h2>
      <Desc/>

      {/* Ayarlar */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:12, margin:'8px 0 10px'}}>
        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Materyal</div>
          <div className="row" style={{gap:8}}>
            <label><input type="radio" name="m" checked={material==='harf'}   onChange={()=>setMaterial('harf')} /> Harf</label>
            <label><input type="radio" name="m" checked={material==='kelime'} onChange={()=>setMaterial('kelime')} /> Kelime</label>
            <label><input type="radio" name="m" checked={material==='rakam'}  onChange={()=>setMaterial('rakam')} /> Rakam</label>
          </div>
        </div>

        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Hız (ms)</div>
          <div className="row" style={{gap:8}}>
            <input type="range" min="200" max="1200" step="10"
              value={exposure} onChange={e=>setSpeedMs(Number(e.target.value))}
              disabled={autoSpeed} style={{width:160}} />
            <span>{exposure} ms</span>
          </div>
          <label style={{display:'block', marginTop:6}}>
            <input type="checkbox" checked={autoSpeed} onChange={()=>setAutoSpeed(v=>!v)} /> Oto hız (seviyeye göre)
          </label>
        </div>

        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Uzaklık (px)</div>
          <div className="row" style={{gap:8}}>
            <input type="range" min="60" max="250" step="1"
              value={effOffset} onChange={e=>setOffset(Number(e.target.value))}
              disabled={autoOffset} style={{width:160}} />
            <span>{effOffset}px</span>
          </div>
          <label style={{display:'block', marginTop:6}}>
            <input type="checkbox" checked={autoOffset} onChange={()=>setAutoOffset(v=>!v)} /> Oto uzaklık (seviyeye göre)
          </label>
        </div>

        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Yazı Boyutu</div>
          <div className="row" style={{gap:8}}>
            <input type="range" min="36" max="120" step="2" value={fontSize}
              onChange={e=>setFontSize(Number(e.target.value))} style={{width:160}} />
            <span>{fontSize}px</span>
          </div>
          <label style={{display:'block', marginTop:6}}>
            <input type="checkbox" checked={scrollY} onChange={()=>setScrollY(v=>!v)} /> Kaydır (rastgele satır)
          </label>
        </div>

        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Renkler</div>
          <div className="row" style={{gap:8}}>
            <label> Zemin <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)}/></label>
            <label> Yazı <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)}/></label>
          </div>
          <div className="row" style={{gap:8, marginTop:6}}>
            <strong>Seviye:</strong> {level} <span style={{fontSize:12, opacity:.8}}>(her 25 gösterim → +1)</span>
          </div>
        </div>
      </div>

      {/* Çift panel */}
      <div ref={areaRef} style={{position:'relative', height:260, borderRadius:14, overflow:'hidden', background:bgColor}}>
        <div style={{position:'absolute', left:'50%', top:0, bottom:0, width:2, background:'rgba(255,255,255,.25)'}}/>
        {visible && (
          <div style={{
            position:'absolute', left:`calc(50% - ${effOffset}px)`,
            top:yPos, transform:'translate(-50%,-50%)', color:fgColor, fontWeight:900, fontSize:fontSize, letterSpacing:2
          }}>{leftTxt}</div>
        )}
        {visible && (
          <div style={{
            position:'absolute', left:`calc(50% + ${effOffset}px)`,
            top:yPos, transform:'translate(-50%,-50%)', color:fgColor, fontWeight:900, fontSize:fontSize, letterSpacing:2
          }}>{rightTxt}</div>
        )}
      </div>

      {/* Kontroller */}
      <div className="exRow" style={{justifyContent:"center", marginTop:12, gap:10, flexWrap:'wrap'}}>
        {!running && leftSec>0 && <button className="btn" onClick={start}>Başla</button>}
        {running && <button className="btn" onClick={stop}>Durdur</button>}
        {(leftSec > 0) && <button className="btn" onClick={onExit}>Panele Dön</button>}
        {(leftSec === 0) && <button className="btn" onClick={complete}>Tamamla ve Panele Dön</button>}
      </div>

      {/* İstatistikler */}
      <div className="exRow" style={{justifyContent:'center', gap:12, marginTop:8, flexWrap:'wrap'}}>
        <div className="stat">Gösterim: {shown}</div>
        <div className="stat">Seviye: {level}</div>
        <div className="stat">Hız: {exposure} ms</div>
        <div className="stat">Rekor (gösterim): {bestShown}</div>
        <div className="stat">Süre: {pad2(Math.floor(leftSec/60))}:{pad2(leftSec%60)}</div>
      </div>
    </div>
  )
}
