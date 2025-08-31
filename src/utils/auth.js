// Sahte kimlik doğrulama (çok-okul). Kod backend gelene kadar işimizi görür.
// - Öğrenci: (schoolId + code) tekil. Aynı koda farklı isim/sınıf verilemez.
// - Öğretmen: (schoolId + nameLower) tekil. Bir sınıfa kilitlenir.

import { listSchools, listClasses } from './fakeData.js';

const DB_KEY = 'hz:db';

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    studentsBySchool: {}, // { [schoolId]: { [code]: { name, className } } }
    teachersBySchool: {}, // { [schoolId]: { [nameLower]: { name, className } } }
  };
}
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function ensureSchoolExists(schoolId) {
  const ids = listSchools().map(s => s.id);
  if (!ids.includes(schoolId)) throw new Error('Okul bulunamadı.');
}

export function getSchools() {
  return listSchools();
}
export function getClasses(schoolId) {
  return listClasses(schoolId);
}

// ----- Öğrenci -----
export function validateStudentLogin({ schoolId, code, name, className }) {
  ensureSchoolExists(schoolId);
  if (!code || !name || !className) throw new Error('Zorunlu alanlar eksik.');
  if (!listClasses(schoolId).includes(className))
    throw new Error('Sınıf bu okulda yok.');

  const db = loadDB();
  db.studentsBySchool[schoolId] ||= {};
  const rec = db.studentsBySchool[schoolId][code];

  if (!rec) {
    db.studentsBySchool[schoolId][code] = { name, className }; // yeni kayıt
    saveDB(db);
    return { schoolId, code, name, className };
  }

  if (rec.name !== name || rec.className !== className) {
    throw new Error('Bu kod farklı bir öğrenci/sınıf ile kayıtlı.');
  }
  return { schoolId, code, name, className };
}

// ----- Öğretmen -----
export function validateTeacherLogin({ schoolId, name, className }) {
  ensureSchoolExists(schoolId);
  if (!name || !className) throw new Error('Zorunlu alanlar eksik.');
  if (!listClasses(schoolId).includes(className))
    throw new Error('Sınıf bu okulda yok.');

  const db = loadDB();
  db.teachersBySchool[schoolId] ||= {};
  const key = name.trim().toLowerCase();
  const rec = db.teachersBySchool[schoolId][key];

  if (!rec) {
    db.teachersBySchool[schoolId][key] = { name, className }; // yeni
    saveDB(db);
    return { schoolId, name, className };
  }

  if (rec.className !== className) {
    throw new Error(`Öğretmen ${rec.className} sınıfına kilitli görünüyor.`);
  }
  return { schoolId, name, className };
}
