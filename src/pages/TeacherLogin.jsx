// src/pages/TeacherLogin.jsx
import React, { useState } from "react";
import { CLASS_OPTIONS } from "../utils/classes.js";

const TeacherIcon = (props) => (
  <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM3 20.25C3 17.35 8.03 16 12 16s9 1.35 9 4.25V22H3v-1.75zM18 8h3v2h-3V8zM18 5h3v2h-3V5z"/>
  </svg>
);

export default function TeacherLogin({ onLoggedIn }) {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");

  const classes = Array.isArray(CLASS_OPTIONS) && CLASS_OPTIONS.length
    ? CLASS_OPTIONS
    : ["1/A", "1/B", "2/A", "2/B", "3/A", "3/B", "4/A", "4/B", "5/A", "5/B"];

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Lütfen ad soyad gir.");
    if (!className) return setError("Lütfen sınıf seç (kilitlenecek).");

    setError("");
    onLoggedIn({
      name: name.trim(),
      className,
    });
  };

  return (
    <main className="page loginShell">
      {/* baloncuklar */}
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="blob b4" />

      <section className="loginCard" aria-labelledby="teacherTitle">
        <div className="loginCard__head teacher">
          <div className="loginCard__icon">
            <TeacherIcon />
          </div>
          <h1 id="teacherTitle" className="loginCard__title">
            Öğretmen Girişi
          </h1>
          <p className="loginCard__subtitle">Sınıfını seç ve yönetmeye başla</p>
        </div>

        <form className="loginForm" onSubmit={submit}>
          <label className="loginField">
            <span className="loginLabel">Ad Soyad</span>
            <input
              className="loginInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Melek Hanım"
            />
          </label>

          <label className="loginField">
            <span className="loginLabel">Sınıf (kilitlenir)</span>
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

          {error && <div className="loginError">{error}</div>}

          <button className="loginBtn teacher" type="submit">
            Giriş
          </button>
        </form>

        <footer className="loginFoot">
          <small>Öğrenci/Öğretmen login • Kod & sınıf kilitleme • Takistaskop, Köşeli ve Açılı aktif</small>
        </footer>
      </section>
    </main>
  );
}
