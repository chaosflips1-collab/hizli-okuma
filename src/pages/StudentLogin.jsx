import React, { useMemo, useState } from 'react';
import { getSchools, getClasses, validateStudentLogin } from '../utils/auth.js';

export default function StudentLogin({ onLoggedIn }) {
  const schools = useMemo(() => getSchools(), []);
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? '');
  const classes = useMemo(() => getClasses(schoolId), [schoolId]);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState(classes[0] ?? '');
  const [err, setErr] = useState('');

  // school değişince sınıfı sıfırla
  React.useEffect(() => {
    setClassName(getClasses(schoolId)[0] ?? '');
  }, [schoolId]);

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    try {
      const payload = validateStudentLogin({ schoolId, code: code.trim(), name: name.trim(), className });
      if (typeof onLoggedIn === 'function') onLoggedIn(payload); // App.jsx kaydeder
    } catch (ex) {
      setErr(ex.message || 'Giriş başarısız.');
    }
  };

  return (
    <form onSubmit={submit} className="loginBox">
      <h2>Öğrenci Girişi</h2>

      <label>Okul</label>
      <select value={schoolId} onChange={(e)=>setSchoolId(e.target.value)}>
        {schools.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <label>Sınıf</label>
      <select value={className} onChange={(e)=>setClassName(e.target.value)}>
        {classes.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <label>Öğrenci Kodu</label>
      <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Örn: ABC123" />

      <label>Ad Soyad</label>
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Örn: Ayşe Yılmaz" />

      {err && <div className="error">{err}</div>}
      <button type="submit">Giriş</button>
    </form>
  );
}
