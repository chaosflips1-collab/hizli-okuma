// src/pages/StudentLogin.jsx
import React, { useState } from 'react';
import { saveStudent } from '../utils/auth.js';

export default function StudentLogin({ onLoggedIn }) {
  const [schoolId, setSchoolId]   = useState('');
  const [code, setCode]           = useState('');
  const [name, setName]           = useState('');
  const [className, setClassName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    try {
      saveStudent({ schoolId: schoolId.trim(), code: code.trim(), name: name.trim(), className });
      if (typeof onLoggedIn === 'function') onLoggedIn({ schoolId, code, name, className });
    } catch (err) {
      alert(err.message || 'Giriş hatası');
    }
  };

  return (
    <form className="loginCard" onSubmit={submit}>
      <h2>Öğrenci Girişi</h2>
      <label>Okul Kodu</label>
      <input value={schoolId} onChange={e=>setSchoolId(e.target.value)} placeholder="örn: AOKULU" />

      <label>Öğrenci Kodu</label>
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder="örn: ABC123" />

      <label>Ad Soyad</label>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="örn: Ayşe Yılmaz" />

      <label>Sınıf</label>
      <select value={className} onChange={e=>setClassName(e.target.value)}>
        <option value="">Sınıf seçin</option>
        <option>5/A</option><option>5/B</option><option>6/A</option>
      </select>

      <button type="submit">Giriş</button>
    </form>
  );
}
