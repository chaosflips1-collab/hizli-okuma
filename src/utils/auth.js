// src/utils/auth.js

/* Yardımcı: metni normalize et (Türkçe küçük harf, tek boşluk, trim) */
export function normalizeText(t = '') {
  return t
    .toString()
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('tr');
}

/* Okul / sınıf / kişi anahtarları: ileride depolama/filtrelemede kullanacağız */
export function buildSchoolKey(school = 'demo') {
  return `school:${normalizeText(school)}`;
}

export function buildClassKey(school, klass) {
  return `${buildSchoolKey(school)}|class:${normalizeText(klass)}`;
}

export function buildTeacherKey(school, klass, teacherName) {
  return `${buildClassKey(school, klass)}|teacher:${normalizeText(teacherName)}`;
}

export function buildStudentKey(school, klass, studentName, code) {
  return `${buildClassKey(school, klass)}|student:${normalizeText(studentName)}|code:${normalizeText(code)}`;
}

/* Varsayılan export da verelim; bazı importlar default bekliyorsa kırılmasın */
export default {
  normalizeText,
  buildSchoolKey,
  buildClassKey,
  buildTeacherKey,
  buildStudentKey,
};
