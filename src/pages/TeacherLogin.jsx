import React, { useEffect, useMemo, useState } from "react";
import { CLASSES, getTeacherByCode, verifyOrRegisterTeacher } from "../utils/auth";

export default function TeacherLogin({ onLoggedIn }) {
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

  useEffect(() => {
    setError("");
    const school = schoolCode.trim().toLowerCase();
    const c = code.trim().toLowerCase();
    if (!school || !c) { setLocked(false); setName(""); setClassroom(""); return; }
    const exists = getTeacherByCode(school, c);
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
    const resp = verifyOrRegisterTeacher({ schoolCode, code, name, classroom });
    if (!resp.ok) { setError(resp.error); return; }
    if (typeof onLoggedIn === "function") onLoggedIn(resp.teacher);
  };

  return (
    <main className="login">
      <section className="loginCard" aria-label="Öğretmen girişi">
        <div className="loginAvatar" aria-hidden="true">
          <div className="avatarCircle teacher" />
        </div>

        <h2 className="loginTitle">Öğretmen Girişi</h2>
        <p className="loginDesc">Okul + Kod + Ad Soyad + sınıfınız eşleştirilir ve kilitlenir.</p>

        <form onSubmit={handleSubmit} className="loginForm">
          <div className="formRow">
            <label htmlFor="t-school">Okul Kodu</label>
            <input
              id="t-school"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              placeholder="Örn: OKUL2025"
              autoFocus
            />
          </div>

          <div className="formRow">
            <label htmlFor="t-code">Kod</label>
            <input
              id="t-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Örn: ABC123"
            />
          </div>

          <div className="formRow">
            <label htmlFor="t-name">Ad Soyad</label>
            <input
              id="t-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ali Demir"
              disabled={locked}
            />
          </div>

          <div className="formRow">
            <label htmlFor="t-class">Sorumlu Sınıf</label>
            <select
              id="t-class"
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
