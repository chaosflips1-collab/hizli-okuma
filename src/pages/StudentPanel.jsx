import React, { useMemo } from 'react'
import Header from '../components/Header.jsx'
import UnitCard from '../components/UnitCard.jsx'
import { UNITS } from '../utils/exercises.js'

export default function StudentPanel({ student, onOpenExercise, onLogout }){
  const UNIT1 = UNITS[0]               // Temel Egzersizler
  const UNIT2 = UNITS[1]               // Hız & Geniş Görüş

  // (Şimdilik ilerleme yok; sadece gösterim. Sonra burada yüzde veririz.)
  const progress = useMemo(() => ({
    takistoskop: 0,
    koseli: 0,
    acili: 0,
  }), [])

  const icons = {
    takistoskop: '⚡',
    koseli: '📐',
    acili: '📏',
    satir: '↩️',
    sutun: '🧱',
  }

  return (
    <>
      <Header
        title={`Merhaba, ${student.name} — ${student.cls} — Kod: ${student.code}`}
        right={<button className="btn" onClick={onLogout}>Çıkış</button>}
      />

      {/* === 1. ÜNİTE === */}
      <section className="unitHero" aria-labelledby="u1-title">
        <div className="unitHeader">
          <h2 id="u1-title">1. Ünite</h2>
          <div className="topicHeader">Göz Algılama Çalışmaları</div>
          <p className="unitDesc">Temel egzersizler: göz ve dikkat ısınma çalışmaları. Hazırsan birini seçip başla!</p>
        </div>

        <div className="exerciseGrid">
          {UNIT1.items.map(item => {
            const val = progress[item.key] ?? 0
            return (
              <button key={item.key} className="exerciseTile" onClick={() => onOpenExercise(item)}>
                <div className="exerciseIcon" aria-hidden="true">{icons[item.key] || '⭐'}</div>
                <div className="exerciseName">{item.name}</div>

                <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={val}>
                  <div className="meterFill" style={{'--val': `${val}%`}} />
                </div>
                <div className="tileFooter">Yakında</div>
              </button>
            )
          })}
        </div>
      </section>

      {/* === 2. ÜNİTE: Şimdilik küçük kart === */}
      <div className="unitGrid">
        <UnitCard badge="2. Ünite" title={UNIT2.title} kpi="Şimdilik kilitli / isimler hazır">
          {UNIT2.items.map(it => (
            <button key={it.key} className="btn" disabled title="Yakında">{it.name}</button>
          ))}
        </UnitCard>
      </div>
    </>
  )
}
