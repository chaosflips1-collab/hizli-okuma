import React, { useEffect, useMemo, useState } from "react";
import { CLASSES, getStudentByCode, verifyOrRegisterStudent } from "../utils/auth";

export default function StudentLogin({ onLoggedIn }) {
  const [schoolCode, setSchoolCode] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [classroom, setClassroom] = useState("");
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    const okSchool = schoolCode.trim().length >= 2;
    const okCode = code.trim().length >= 3;
    const okName = name.trim().length >= 2;
    const okClass = CLASSES.includes(classroom);
    return okSchool && okCode && okName && okClass;
  }, [schoolCode, code, name, classroom]);

  // Kod veya okul değişince, kilit kontrolü
  useEffect(() => {
    setError("");
    const school = schoolCode.trim().toLowerCase();
    const c = code.trim().toLowerCase();
    if (!school || !c) { setLocked(false); setName(""); setClassroom(""); return; }
    const exists = getStudentByCode(school, c);
    if (exists) {
      setLocked(true);
      setName(exists.name);
      setClassroom(exists.classroom);
    } else {
      if (locked) setLocked(false);
    }
  }, [schoolCode, code]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const resp = verifyOrRegisterStudent({ schoolCode, code, name, classroom });
    if (!resp.ok) { setError(resp.error); return; }
    if (typeof onLoggedIn === "function") onLoggedIn(resp.student);
  };

  return (
    <main className="login">
      <section className="loginCard" aria-label="Öğrenci girişi">
        <div className="loginAvatar" aria-hidden="true">
          <div className="avatarCircle" />
        </div>

        <h2 className="loginTitle">Öğrenci Girişi</h2>
        <p className="loginDesc">Okul + Kod + Ad Soyad + Sınıf bilgilerin eşleştirilir ve kilitlenir.</p>

        <form onSubmit={handleSubmit} className="loginForm">
          <div className="formRow">
            <label htmlFor="s-school">Okul Kodu</label>
            <input
              id="s-school"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              placeholder="Örn: OKUL2025"
              autoFocus
            />
          </div>

          <div className="formRow">
            <label htmlFor="s-code">Kod</label>
            <input
              id="s-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Örn: ABC123"
            />
          </div>

          <div className="formRow">
            <label htmlFor="s-name">Ad Soyad</label>
            <input
              id="s-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ayşe Yılmaz"
              disabled={locked}
            />
          </div>

          <div className="formRow">
            <label htmlFor="s-class">Sınıf</label>
            <select
              id="s-class"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              disabled={locked}
            >
              <option value="">Sınıf seçin</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {locked && (
            <div className="infoNote" role="status">
              Bu kod <strong>{schoolCode.toUpperCase()}</strong> okulunda
              {" "} <strong>{name}</strong> / <strong>{classroom}</strong> bilgilerine kilitli.
            </div>
          )}
          {error && <div className="errorNote" role="alert">{error}</div>}

          <div className="btnRow">
            <button type="button" className="btnGhost" onClick={() => window.history.back()}>
              ← Geri
            </button>
            <button type="submit" className="btnPrimary" disabled={!canSubmit}>
              Devam
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
