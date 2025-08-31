// Öğrenci/Öğretmen oturumlarını localStorage'ta tutar.
// Anahtarlar:
//  - hz:student -> { schoolId, code, name, className }
//  - hz:teacher -> { schoolId, name, className }

const STUDENT_KEY = 'hz:student';
const TEACHER_KEY = 'hz:teacher';

export function saveStudent(obj) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(obj));
}
export function getStudent() {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function clearStudent() {
  localStorage.removeItem(STUDENT_KEY);
}

export function saveTeacher(obj) {
  localStorage.setItem(TEACHER_KEY, JSON.stringify(obj));
}
export function getTeacher() {
  try {
    const raw = localStorage.getItem(TEACHER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function clearTeacher() {
  localStorage.removeItem(TEACHER_KEY);
}
