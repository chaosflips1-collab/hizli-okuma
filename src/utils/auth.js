// src/utils/auth.js
// Projene uygun, TypeScript'siz sade JS sürümüdür.

const NAMES_KEY = 'hz:names';

// Örnek demo kodları (gerçek sistemde API'dan gelecektir)
const studentCodes = {
  'OGR-001': { id: 's1', type: 'student' },
  'OGR-002': { id: 's2', type: 'student' },
  'OGR-003': { id: 's3', type: 'student' },
  'OGR-004': { id: 's4', type: 'student' },
  'OGR-005': { id: 's5', type: 'student' },
};

const teacherCodes = {
  'OGT-001': { id: 't1', type: 'teacher' },
  'OGT-002': { id: 't2', type: 'teacher' },
  'OGT-003': { id: 't3', type: 'teacher' },
};

// ---- localStorage yardımcıları ----
function loadNames() {
  try {
    return JSON.parse(localStorage.getItem(NAMES_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveNames(names) {
  localStorage.setItem(NAMES_KEY, JSON.stringify(names));
}

// Dışa açık: isim set/get
export function setUserName(code, name) {
  const names = loadNames();
  names[code] = name;
  saveNames(names);
}

export function getUserName(code) {
  const names = loadNames();
  return names[code] || '';
}

/**
 * Kod doğrulama
 * @param {string} code - "OGR-XXXX" veya "OGT-XXXX"
 * @param {'student'|'teacher'} type
 * @returns {Promise<null|{id:string, type:'student'|'teacher', code:string, name?:string}>}
 */
export async function validateCode(code, type) {
  // Demo gecikmesi
  await new Promise((r) => setTimeout(r, 500));

  const upper = String(code || '').trim().toUpperCase();

  if (type === 'student' && studentCodes[upper]) {
    const base = studentCodes[upper];
    const name = getUserName(upper);
    return { ...base, code: upper, name };
  }

  if (type === 'teacher' && teacherCodes[upper]) {
    const base = teacherCodes[upper];
    const name = getUserName(upper);
    return { ...base, code: upper, name };
  }

  return null;
}
