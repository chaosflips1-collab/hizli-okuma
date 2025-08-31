// src/utils/auth.js

/** Sabit sınıf listesi */
export const CLASSES = [
  '5/A','5/B','5/C','5/D','5/E',
  '6/A','6/B','6/C','6/D','6/E',
  '7/A','7/B','7/C','7/D','7/E',
];

/** Basit anahtar üretici: her okul ayrı namespace */
const k = (schoolCode, bucket) =>
  `school:${String(schoolCode || '').trim().toLowerCase()}:${bucket}`;

/** JSON load/save */
const load = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

/* -------------------- ÖĞRENCİ -------------------- */

export const getStudentByCode = (schoolCode, code) => {
  const students = load(k(schoolCode, 'students'));
  const c = String(code || '').trim().toLowerCase();
  return students.find(s => s.code === c) || null;
};

export const verifyOrRegisterStudent = ({ schoolCode, code, name, classroom }) => {
  const school = String(schoolCode || '').trim().toLowerCase();
  const codeNorm = String(code || '').trim().toLowerCase();
  const nameNorm = String(name || '').trim();
  const classNorm = String(classroom || '').trim();

  if (!school) return { ok:false, error:'Lütfen okul kodunu girin.' };
  if (!codeNorm || !nameNorm || !classNorm) {
    return { ok:false, error:'Kod, ad soyad ve sınıf zorunludur.' };
  }
  if (!CLASSES.includes(classNorm)) {
    return { ok:false, error:'Geçerli bir sınıf seçin.' };
  }

  const key = k(school, 'students');
  const students = load(key);
  const existing = students.find(s => s.code === codeNorm);

  if (!existing) {
    const rec = { school, code: codeNorm, name: nameNorm, classroom: classNorm, createdAt: Date.now() };
    students.push(rec);
    save(key, students);
    return { ok:true, student: rec, created:true };
  }

  // Kod okul içinde kilitli → ad ve sınıf aynı olmalı
  if (existing.name !== nameNorm || existing.classroom !== classNorm) {
    return { ok:false, error:'Bu kod bu okulda farklı ad/sınıf ile kilitli.' };
  }
  return { ok:true, student: existing, created:false };
};

/* -------------------- ÖĞRETMEN -------------------- */

export const getTeacherByCode = (schoolCode, code) => {
  const teachers = load(k(schoolCode, 'teachers'));
  const c = String(code || '').trim().toLowerCase();
  return teachers.find(t => t.code === c) || null;
};

export const verifyOrRegisterTeacher = ({ schoolCode, code, name, classroom }) => {
  const school = String(schoolCode || '').trim().toLowerCase();
  const codeNorm = String(code || '').trim().toLowerCase();
  const nameNorm = String(name || '').trim();
  const classNorm = String(classroom || '').trim();

  if (!school) return { ok:false, error:'Lütfen okul kodunu girin.' };
  if (!codeNorm || !nameNorm || !classNorm) {
    return { ok:false, error:'Kod, ad soyad ve sınıf zorunludur.' };
  }
  if (!CLASSES.includes(classNorm)) {
    return { ok:false, error:'Geçerli bir sınıf seçin.' };
  }

  const key = k(school, 'teachers');
  const teachers = load(key);
  const existing = teachers.find(t => t.code === codeNorm);

  if (!existing) {
    const rec = { school, code: codeNorm, name: nameNorm, classroom: classNorm, createdAt: Date.now() };
    teachers.push(rec);
    save(key, teachers);
    return { ok:true, teacher: rec, created:true };
  }

  if (existing.name !== nameNorm || existing.classroom !== classNorm) {
    return { ok:false, error:'Bu kod bu okulda farklı ad/sınıf ile kilitli.' };
  }
  return { ok:true, teacher: existing, created:false };
};

/* -------------------- Listeleme / Panel -------------------- */

/** Öğretmen paneli: sadece kendi okulundaki, kendi sınıfındaki öğrenciler */
export const listStudentsByClass = (schoolCode, classroom) => {
  const students = load(k(schoolCode, 'students'));
  return students.filter(s => s.classroom === classroom);
};
