import React, { useMemo } from 'react';
import Header from '../components/Header.jsx';
import UnitCard from '../components/UnitCard.jsx';
import { UNITS } from '../utils/exercises.js';
import { countU1Days, todayKey, isUnit2Unlocked } from '../utils/progress.js';


export default function StudentPanel({ student, onOpenExercise, onLogout }) {
  const UNIT1 = UNITS[0];
  const UNIT2 = UNITS[1];

  // --- 1. ÜNİTE İLERLEME HESAPLARI ---
  const u1DaysCount = countU1Days();
  const todayStr    = todayKey();
  const unit2IsOpen = isUnit2Unlocked();

  // (devamında progress vs…)




  // (Şimdilik ilerleme yok; sadece gösterim. Sonra burada yüzde veririz.)
  const progress = useMemo(() => ({
    takistoskop: 0,
    koseli: 0,
    acili: 0,
  }), [])

  // --- 1. ÜNİTE ikonları: emoji yerine SVG çizen küçük yardımcı ---
const renderIcon = (k) => {
  switch (k) {
    case 'takistoskop':
      // Basit şimşek
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M13 2L6 14h5l-1 8 8-14h-6l1-6z" />
        </svg>
      );
    case 'koseli':
      // Köşeli/çerçeve
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" opacity="0.18" />
          <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
        </svg>
      );
    case 'acili':
      // Açılı okuma / işaret
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M6 4h12a2 2 0 0 1 2 2v14l-6-4-6 4V6a2 2 0 0 1 2-2z" />
        </svg>
      );
    default:
      // Emniyet: minik nokta
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      );
  }
};


  const icons = {
    takistoskop: '⚡',
    koseli: '📐',
    acili: '📏',
    satir: '↩️',
    sutun: '🧱',
  }
  const u1Days = countU1Days();
const today = todayKey();
const unit2Open = isUnit2Unlocked();


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
          <p className="u1-mini-info" style={{ margin: "6px 0 12px", fontSize: 14, opacity: .9 }}>
  Tam Gün: <b className="chip">{u1DaysCount}</b>/21 &nbsp;&nbsp;
  Bugün: <b className="chip">{todayStr}</b>
</p>



     



          <div className="topicHeader">Göz Algılama Çalışmaları</div>
          <p className="unitDesc">Temel egzersizler: göz ve dikkat ısınma çalışmaları. Hazırsan birini seçip başla!</p>
        </div>

        <div className="exerciseGrid">
          {UNIT1.items.map(item => {
            const val = progress[item.key] ?? 0
            return (
              <button key={item.key} className="exerciseTile" onClick={() => onOpenExercise(item)}>
                <span className="icon" aria-hidden="true">
  {renderIcon(item.key)}
</span>
<div className="exerciseName">
  {item.name}
  <small>Yakında</small>
</div>

              </button>
            )
          })}
        </div>
      </section>

      {/* ——— 2. ÜNİTE ——— */}
<section className="unitHero" aria-labelledby="u2-title" style={{ marginTop: 32 }}>
  <div className="unitHeader">
    <h2 id="u2-title">2. Ünite</h2>
    {!unit2IsOpen && (
  <div className="u2-lock">
    🔒 2. Ünite kilitli. 1. Ünite’de <b>21 farklı gün</b> boyunca üç egzersizi de tamamla; kilit otomatik kalksın. (Durum: {u1DaysCount}/21)
  </div>
)}

    <div className="topicHeader">Hız &amp; Geniş Görüş</div>
    <p className="unitDesc">İleri egzersizler: satır atlama ve sütun okuma.</p>
  </div>

  {/* Kilit / Açıldı durumu */}
{!unit2IsOpen && (
  <div
    className="u2-locked"
    style={{
      marginTop: 8,
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(0,0,0,.04)",
      border: "1px solid rgba(0,0,0,.08)",
    }}
  >
    🔒 2. Ünite kilitli. 1. Ünite’de <b>21 farklı gün</b> boyunca üç egzersizi de
    tamamla; kilit otomatik kalksın.{" "}
    <span style={{ opacity: 0.7 }}>(Durum: {u1DaysCount}/21)</span>
  </div>
)}


<div className="exerciseGrid" style={{ marginTop: 12 }}>
  {/* 2. ünite egzersiz düğmeleri – şimdilik örnek/placeholder */}
  <button className="exerciseIcon" disabled aria-label="Satır Atlama">
    Satır Atlama
  </button>
  <button className="exerciseIcon" disabled aria-label="Sütun Okuma">
    Sütun Okuma
  </button>
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
