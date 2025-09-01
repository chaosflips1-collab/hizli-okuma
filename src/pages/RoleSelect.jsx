// src/pages/RoleSelect.jsx
import React from "react";

// Küçük, bağımsız SVG ikonları (paket eklemiyoruz)
const BookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M6 2h9a3 3 0 013 3v13a3 3 0 00-3-3H7a3 3 0 00-3 3V5a3 3 0 013-3zm3 4h5a1 1 0 011 1v2.5a.5.5 0 01-.8.4L12.5 8l-1.7 1.9a.5.5 0 01-.8-.4V7a1 1 0 011-1z"
    />
  </svg>
);
const StudentIcon = (props) => (
  <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 12a4 4 0 10-4-4 4 4 0 004 4zm0 2c-3.314 0-9 1.657-9 5v1h18v-1c0-3.343-5.686-5-9-5z"/>
  </svg>
);
const TeacherIcon = (props) => (
  <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 12a4.5 4.5 0 10-4.5-4.5A4.5 4.5 0 0012 12zM3 21v-1.5C3 16 8 14.5 12 14.5S21 16 21 19.5V21zM18 7h3v2h-3zM18 4h3v2h-3z"/>
  </svg>
);

export default function RoleSelect({ goStudent, goTeacher }) {
  const handleStudent = () => {
    if (typeof goStudent === "function") return goStudent();
  };
  const handleTeacher = () => {
    if (typeof goTeacher === "function") return goTeacher();
  };

  return (
    <main className="roleShell">
      {/* arka plan baloncukları */}
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="blob b4" />

      {/* HERO */}
      <section className="hero" aria-labelledby="appTitle">
        <div className="heroBadge">
          <BookIcon />
          <span className="twinkle t1">★</span>
          <span className="twinkle t2">★</span>
          <span className="twinkle t3">★</span>
        </div>

        <h1 id="appTitle" className="heroTitle">
          <span className="gradText">Hızlı Okuma</span>
        </h1>
        <p className="heroSub">Daha hızlı ve daha iyi okumayı öğren!</p>

        <div className="starRow" aria-hidden="true">
          <span className="star">⭐</span>
          <span className="star delay1">⭐</span>
          <span className="star delay2">⭐</span>
        </div>

        <h2 className="heroQuestion">Sen kimsin?</h2>
      </section>

      {/* SEÇİM KARTLARI */}
      <section className="roleGrid" aria-label="Rol seçimi">
        <button className="roleCard student" onClick={handleStudent}>
          <span className="roleIcon">
            <StudentIcon />
          </span>
          <div className="roleText">
            <strong>Ben Öğrenciyim</strong>
            <small>Öğrenmeye ve gelişmeye başla!</small>
          </div>
          <span className="cta">Devam</span>
          <span className="confetti c1">✨</span>
          <span className="confetti c2">💫</span>
        </button>

        <button className="roleCard teacher" onClick={handleTeacher}>
          <span className="roleIcon">
            <TeacherIcon />
          </span>
          <div className="roleText">
            <strong>Ben Öğretmenim</strong>
            <small>Öğrenci ilerlemesini takip et</small>
          </div>
          <span className="cta">Giriş</span>
          <span className="confetti c1">✨</span>
          <span className="confetti c2">💫</span>
        </button>
      </section>

      <footer className="roleFoot">
        <small>Öğrenci/Öğretmen login • Kod & sınıf kilitleme • Takistaskop, Köşeli ve Açılı aktif</small>
      </footer>
    </main>
  );
}
