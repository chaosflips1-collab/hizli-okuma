import React, { useState } from 'react';

export default function StudentLogin({ onLoggedIn }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [cls, setCls] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!code || !name || !cls) return;
    onLoggedIn({ code, name, className: cls });
  };

  return (
    <main className="role">
      <div className="roleBG" aria-hidden="true" />
      <section className="loginCard" aria-labelledby="slogin-title">
        <h2 id="slogin-title" className="appTitle">Öğrenci Girişi</h2>

        <form onSubmit={submit} className="formCol">
          <label className="formRow">
            <span>Kod</span>
            <input
              className="textInput"
              placeholder="Örn: ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>

          <label className="formRow">
            <span>Ad Soyad</span>
            <input
              className="textInput"
              placeholder="Örn: Ayşe Yılmaz"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="formRow">
            <span>Sınıf</span>
            <select
              className="select"
              value={cls}
              onChange={(e) => setCls(e.target.value)}
            >
              <option value="">Sınıf seçin</option>
              <option value="5/A">5/A</option>
              <option value="5/B">5/B</option>
              <option value="5/C">5/C</option>
            </select>
          </label>

          <div className="actionRow" style={{ marginTop: 8 }}>
            <button className="primaryBtn" type="submit">Giriş</button>
          </div>
        </form>
      </section>
    </main>
  );
}
