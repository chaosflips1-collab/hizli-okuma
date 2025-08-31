// src/pages/TeacherLogin.jsx
import React, { useState } from 'react';
import { saveTeacher } from '../utils/auth.js';

export default function TeacherLogin({ onLoggedIn }) {
  const [schoolId, setSchoolId]   = useState('');
  const [name, setName]           = useState('');
  const [className, setClassName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    try {
      saveTeacher({ schoolId: schoolId.trim(), name: name.trim(), className });
      if (typeof onLoggedIn === 'function') onLoggedIn({ schoolId, name, className });
    } catch (err) {
      alert(err.message || 'Giriş hatası');
    }
  };

  return (
    <form className="loginCard" onSubmit={submit}>
      <h2>Öğretmen Girişi</h2>
      <label>Okul Kodu</label>
      <input value={schoolId} onChange={e=>setSchoolId(e.target.value)} placeholder="örn: AOKULU" />

      <label>Ad Soyad</label>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="örn: Melek Hanım" />

      <label>Sınıf (kilitlenecek)</label>
      <select value={className} onChange={e=>setClassName(e.target.value)}>
        <option value="">Sınıf seçin</option>
        <option>5/A</option><option>5/B</option><option>6/A</option>
      </select>

      <button type="submit">Giriş</button>
    </form>
  );
}
