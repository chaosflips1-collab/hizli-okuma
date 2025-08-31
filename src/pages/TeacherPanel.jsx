// src/pages/TeacherPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { listStudentsByClass } from "../utils/auth";

export default function TeacherPanel({ teacher, onLogout }) {
  // Güvenlik: öğretmen yoksa uyarı göster
  if (!teacher) {
    return (
      <main className="panel">
        <section className="panelCard">
          <h2>Öğretmen bilgisi bulunamadı</h2>
          <p>Lütfen giriş yapın.</p>
          {onLogout && (
            <button className="btnPrimary" onClick={onLogout}>Girişe Dön</button>
          )}
        </section>
      </main>
    );
  }

  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [refreshedAt, setRefreshedAt] = useState(Date.now());

  const load = () => {
    const arr = listStudentsByClass(teacher.school, teacher.classroom);
    // Ad soyada göre sıralayalım (Türkçe locale ile)
    arr.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    setStudents(arr);
    setRefreshedAt(Date.now());
  };

  useEffect(() => {
    load();
    // teacher.school veya teacher.classroom güncellenirse tekrar çek
  }, [teacher.school, teacher.classroom]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return students;
    return students.filter(
      st =>
        st.name.toLowerCase().includes(s) ||
        st.code.toLowerCase().includes(s)
    );
  }, [students, q]);

  return (
    <main className="panel">
      {/* Üst şerit */}
      <section className="panelHead">
        <div className="panelTitle">
          <h2>Öğretmen Paneli</h2>
          <div className="meta">
            <span className="pill">{(teacher.school || "").toUpperCase()}</span>
            <span className="pill">{teacher.classroom}</span>
            <span className="pill">👤 {teacher.name}</span>
          </div>
        </div>

        <div className="panelActions">
          <input
            className="search"
            placeholder="İsim veya kod ara…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btnGhost" onClick={load} title="Yenile">↻ Yenile</button>
          {onLogout && (
            <button className="btnPrimary" onClick={onLogout}>Çıkış</button>
          )}
        </div>
      </section>

      {/* Liste kartı */}
      <section className="panelCard">
        <p className="hint">
          Aşağıda sadece <b>{(teacher.school || "").toUpperCase()}</b> okulundaki{" "}
          <b>{teacher.classroom}</b> sınıfının öğrencileri listelenir.
        </p>

        {filtered.length === 0 ? (
          <div className="empty">Henüz öğrenci kaydı bulunmuyor.</div>
        ) : (
          <div className="tblWrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: "48px" }}>#</th>
                  <th>Ad Soyad</th>
                  <th>Kod</th>
                  <th>Sınıf</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={`${s.code}-${i}`}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td><code>{s.code.toUpperCase()}</code></td>
                    <td>{s.classroom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="footNote">
          Son güncelleme: {new Date(refreshedAt).toLocaleString()}
        </div>
      </section>
    </main>
  );
}
