// src/pages/StudentLogin.jsx
import React, { useState } from "react";
import { CLASS_OPTIONS } from "../utils/classes.js";

const StudentIcon = (props) => (
  <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2c-3.037 0-9 1.523-9 4.5V21h18v-2.5c0-2.977-5.963-4.5-9-4.5z"/>
  </svg>
);

export default function StudentLogin({ onLoggedIn }) {
  const [code, setCode] = useState("OGR-001");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const classes = Array.isArray(CLASS_OPTIONS) && CLASS_OPTIONS.length
    ? CLASS_OPTIONS
    : ["1/A", "1/B", "2/A", "2/B", "3/A", "3/B", "4/A", "4/B", "5/A", "5/B"];

  const submit = (e) => {
    e.preventDefault();
    if (!code.trim()) return setError("Öğrenci kodu gerekli.");
    if (!name.trim()) return setError("Lütfen ad soyad gir.");
    if (!className) return setError("Lütfen sınıf seç.");

    setError("");
    // App.jsx içindeki akışı bozmayalım: öğrenci objesi gönderiyoruz
    onLoggedIn({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      className,
      remember,
    });
  };

  return (
    <main className="page loginShell">
      {/* yumuşak baloncuklar */}
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="blob b4" />

      <section className="loginCard" aria-labelledby="studentTitle">
        <div className="loginCard__head student">
          <div className="loginCard__icon">
            <StudentIcon />
          </div>
          <h1 id="studentTitle" className="loginCard__title">
            Öğrenci Girişi
          </h1>
          <p className="loginCard__subtitle">Öğrenmeye başlamaya hazır mısın?</p>
        </div>

        <form className="loginForm" onSubmit={submit}>
          <label className="loginField">
            <span className="loginLabel">Öğrenci Kodu</span>
            <input
              className="loginInput"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Örn: OGR-001"
              maxLength={8}
            />
          </label>

          <label className="loginField">
            <span className="loginLabel">Ad Soyad</span>
            <input
              className="loginInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ayşe Yılmaz"
            />
          </label>

          <label className="loginField">
            <span className="loginLabel">Sınıf</span>
            <select
              className="loginInput"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              <option value="">Sınıf seç</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="rememberRow">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Beni hatırla</span>
          </label>

          {error && <div className="loginError">{error}</div>}

          <button className="loginBtn student" type="submit">
            Devam Et
          </button>
        </form>

        <footer className="loginFoot">
          <small>Öğrenci/Öğretmen login • Kod & sınıf kilitleme • Takistaskop, Köşeli ve Açılı aktif</small>
        </footer>
      </section>
    </main>
  );
}
