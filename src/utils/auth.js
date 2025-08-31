// src/utils/auth.js
const STUDENT_KEY = 'hz:student';
const TEACHER_KEY = 'hz:teacher';

function safeGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
}
function safeSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function safeClear(key) { localStorage.removeItem(key); }

/** ---- Öğrenci ---- */
export function saveStudent({ schoolId, code, name, className }) {
  if (!schoolId || !code || !name || !className) throw new Error('Eksik alan');
  safeSet(STUDENT_KEY, { schoolId, code, name, className });
}
export function getStudent() {
  return safeGet(STUDENT_KEY);
}
export function clearStudent() { safeClear(STUDENT_KEY); }

/** ---- Öğretmen ---- */
export function saveTeacher({ schoolId, name, className }) {
  if (!schoolId || !name || !className) throw new Error('Eksik alan');
  safeSet(TEACHER_KEY, { schoolId, name, className });
}
export function getTeacher() {
  return safeGet(TEACHER_KEY);
}
export function clearTeacher() { safeClear(TEACHER_KEY); }
