import React, { useState } from 'react';

export default function TeacherLogin({ onLoggedIn }) {
  const [name, setName] = useState('');
  const [cls, setCls] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name || !cls) return;
    onLoggedIn({ name, className: cls });
  };

  return (
    <main className="role">
      <div className="roleBG" aria-hidden="true" />
      <section className="loginCard" aria-labelledby="tlogin-title">
        <h2 id="tlogin-title" className="appTitle">Öğretmen Girişi</h2>

        <form onSubmit={submit} className="formCol">
          <label className="formRow">
            <span>Ad Soyad</span>
            <input
              className="textInput"
              placeholder="Örn: Melek Hanım"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="formRow">
            <span>Sınıf (kilitlenir)</span>
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
