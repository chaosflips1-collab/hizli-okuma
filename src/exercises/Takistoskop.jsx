import React, { useEffect, useMemo, useRef, useState } from "react"
import { getProgress, setProgress } from "../utils/storage.js"

const LETTERS = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("")
const DIGITS  = "0123456789".split("")
const clamp = (n, a, b) => Math.max(a, Math.min(b, n))

export default function Takistoskop({ student, onExit, onComplete }) {
  const [material, setMaterial] = useState("harf")
  const [randomPos, setRandomPos] = useState(true)
  const [autoSpeed, setAutoSpeed] = useState(true)
  const [speedMs, setSpeedMs] = useState(600)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)

  const [phase, setPhase] = useState("idle") // idle | showing | asking | graded | finished
  const [current, setCurrent] = useState("")
  const [answer, setAnswer]   = useState("")
  const [feedback, setFeedback] = useState("")

  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem(`ho_taki_best_${student.code}`) || 0) } catch { return 0 }
  })

  const [leftSec, setLeftSec] = useState(5 * 60)
  const tickTimerRef = useRef(null)
  const shownTimerRef = useRef(null)
  const aliveRef = useRef(true)
  const areaRef = useRef(null)
  const inputRef = useRef(null)

  const pool = useMemo(() => (material === "harf" ? LETTERS : DIGITS), [material])
  useEffect(() => () => { aliveRef.current=false; clearInterval(tickTimerRef.current); clearTimeout(shownTimerRef.current) }, [])

  const exposure = autoSpeed ? Math.max(250, 700 - (level - 1) * 50) : speedMs
  const ensureTimer = () => {
    if (tickTimerRef.current) return
    tickTimerRef.current = setInterval(() => {
      setLeftSec((s) => {
        if (s <= 1) { clearInterval(tickTimerRef.current); tickTimerRef.current=null; setPhase("finished"); return 0 }
        return s - 1
      })
    }, 1000)
  }
  const pick = () => pool[Math.floor(Math.random() * pool.length)]

  const showThenAsk = () => {
    const ch = pick()
    setCurrent(ch); setAnswer(""); setFeedback(""); setPhase("showing")
    clearTimeout(shownTimerRef.current)
    shownTimerRef.current = setTimeout(() => {
      setPhase("asking"); setCurrent(""); setTimeout(() => inputRef.current?.focus(), 10)
    }, exposure)
  }

  const start = () => { if (phase === "finished") return; ensureTimer(); showThenAsk() }

  const lastShownRef = useRef("")
  useEffect(() => { if (phase === "showing") lastShownRef.current = current }, [phase, current])

  const check = () => {
    if (phase !== "asking") return
    const norm = (s) => s.trim().toUpperCase()
    const ok = norm(answer) === norm(lastShownRef.current)
    if (ok) {
      setCorrect(c=>c+1); setScore(s=>s+10); setFeedback("DOĞRU")
      setStreak(t=>{ const ns=t+1; if(ns>=5){ setLevel(l=>clamp(l+1,1,10)); return 0 } return ns })
    } else {
      setWrong(w=>w+1); setScore(s=>s-5); setFeedback(`YANLIŞ — Doğru: ${lastShownRef.current}`); setStreak(0)
    }
    setPhase("graded")
    setTimeout(()=>{ setBest(b=>{ const nb=Math.max(b, ok?score+10:score-5); try{localStorage.setItem(`ho_taki_best_${student.code}`,String(nb))}catch{}; return nb }) },0)
    setTimeout(()=>{ if(leftSec>0) showThenAsk() },700)
  }

  const complete = () => {
    clearInterval(tickTimerRef.current); tickTimerRef.current=null
    try {
      const p = getProgress(student.code)
      const np = { ...p, unit1: { ...(p?.unit1 || {}), takistoskop_done:true, takistoskop_score:score, takistoskop_best:Math.max(best,score), takistoskop_level:level, lastFinished:new Date().toISOString() } }
      setProgress(student.code, np)
    } catch {}
    onComplete?.()
  }

  const [pos, setPos] = useState({x:50, y:50})
  useEffect(() => {
    if (phase !== "showing" || !randomPos) return
    const el = areaRef.current; if(!el) return
    const pad = 20
    const x = pad + Math.random() * (el.clientWidth - pad * 2)
    const y = pad + Math.random() * (el.clientHeight - pad * 2)
    setPos({ x, y })
  }, [phase, randomPos, current])

  return (
    <div className="exerciseWrap">
      <h2 style={{marginBottom:6}}>Takistoskop</h2>
      <p style={{textAlign:'left', margin:'8px 0 14px', color:'#1b315f'}}>
        <strong>Takistoskop Çalışması:</strong> Takistoskop bölümündeki egzersizlerle gözün çevikliği artar ve göz gördüğü şekli
        daha hızlı olarak beyne yollamaya başlar. Saniyenin belirli sürelerinde orta noktada ya da rastgele panelin
        değişik yerlerinde gözüküp kaybolan <em>harf</em> ya da <em>rakamları</em> hızlı bir şekilde algılayarak
        <strong> yanıtınız</strong> bölümünü doldurmanız gerekir. Doğru yanıtlarınız sizi her seferinde bir üst seviyeye yükseltecektir.
      </p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:12, margin:'8px 0 10px'}}>
        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Materyal</div>
          <div className="row" style={{gap:8}}>
            <label><input type="radio" name="m" checked={material==='harf'} onChange={()=>setMaterial('harf')} /> Harf</label>
            <label><input type="radio" name="m" checked={material==='rakam'} onChange={()=>setMaterial('rakam')} /> Rakam</label>
          </div>
        </div>
        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Konum</div>
          <div className="row" style={{gap:8}}>
            <label><input type="radio" name="p" checked={!randomPos} onChange={()=>setRandomPos(false)} /> Merkez</label>
            <label><input type="radio" name="p" checked={randomPos}  onChange={()=>setRandomPos(true)}  /> Rastgele</label>
          </div>
        </div>
        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Hız (ms)</div>
          <div className="row" style={{gap:8}}>
            <input type="range" min="200" max="1000" step="10"
              value={autoSpeed ? Math.max(250, 700 - (level-1)*50) : speedMs}
              onChange={(e)=> setSpeedMs(Number(e.target.value))} disabled={autoSpeed} style={{width:160}} />
            <span>{autoSpeed ? Math.max(250, 700 - (level-1)*50) : speedMs} ms</span>
          </div>
          <label style={{display:'block', marginTop:6}}>
            <input type="checkbox" checked={autoSpeed} onChange={()=>setAutoSpeed(v=>!v)} /> Oto hız (seviyeye göre)
          </label>
        </div>
        <div style={{background:'#f3f6ff', borderRadius:12, padding:10}}>
          <div style={{fontWeight:800, marginBottom:6}}>Seviye</div>
          <div className="row" style={{gap:8}}>
            <strong>{level}</strong>
            <span style={{fontSize:12, opacity:.8}}>5 doğru üst üste → +1</span>
          </div>
        </div>
      </div>

      <div ref={areaRef} style={{position:'relative', height:260, borderRadius:14, background:'#0f2353', marginTop:4, overflow:'hidden'}}>
        {(phase === "showing") && (
          <div style={{position:'absolute', left: randomPos ? pos.x : '50%', top:  randomPos ? pos.y : '50%', transform:'translate(-50%, -50%)', color:'#fff', fontWeight:900, fontSize:96, letterSpacing:2}}>
            {current}
          </div>
        )}
      </div>

      <div className="exRow" style={{justifyContent:"center", marginTop:12, gap:10, flexWrap:'wrap'}}>
        {(phase === "idle" || phase === "graded") && <button className="btn" onClick={start}>Başla</button>}
        {phase === "asking" && (
          <>
            <input ref={inputRef} className="input" style={{width:140, textTransform:'uppercase'}} placeholder="Yanıtınız"
              value={answer} onChange={(e)=>setAnswer(e.target.value)} onKeyDown={(e)=> e.key === 'Enter' && check()} maxLength={1} />
            <button className="btn" onClick={check}>Kontrol Et</button>
          </>
        )}
        {(phase !== "finished") && <button className="btn" onClick={onExit}>Panele Dön</button>}
        {(phase === "finished") && <button className="btn" onClick={complete}>Tamamla ve Panele Dön</button>}
      </div>

      <div className="exRow" style={{justifyContent:'center', gap:12, marginTop:8, flexWrap:'wrap'}}>
        <div className="stat">Doğru: {correct}</div>
        <div className="stat">Yanlış: {wrong}</div>
        <div className="stat">Net: {correct - wrong}</div>
        <div className="stat">Skor: {score}</div>
        <div className="stat">Rekor: {best}</div>
        <div className="stat">Süre: {String(Math.floor(leftSec/60)).padStart(2,'0')}:{String(leftSec%60).padStart(2,'0')}</div>
      </div>
      {feedback && (
        <div className="exRow" style={{justifyContent:'center', marginTop:6}}>
          <div className="stat" style={{background: feedback.startsWith('DOĞRU') ? '#eaffea' : '#ffecec', fontWeight:800}}>
            {feedback}
          </div>
        </div>
      )}
      <div style={{marginTop:10, textAlign:'center'}}>
        {[1,2,3,4,5,6,7,8,9,10].map(n=>(
          <span key={n} style={{display:'inline-block', minWidth:28, padding:'6px 8px', margin:'0 4px 6px',
            borderRadius:10, background:n<=level?'#cfe0ff':'#eef2ff', color:'#0f2f7a', fontWeight:900,
            boxShadow:'inset 0 0 0 1px rgba(0,0,0,.06)'}}>{n}</span>
        ))}
      </div>
      {phase === "finished" && <p className="kpi" style={{textAlign:'center', marginTop:8}}>Süre doldu. Çalışmanı tamamlayabilirsin.</p>}
    </div>
  )
}
