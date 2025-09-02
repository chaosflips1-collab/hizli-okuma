// Basit localStorage katmanı + kod/sınıf kilitleme + İLERLEME KAYDI
import { CLASS_OPTIONS } from './classes.js'

const STUDENT_KEY   = 'ho_student'        // aktif öğrenci (cihazdaki oturum)
const TEACHER_KEY   = 'ho_teacher'        // aktif öğretmen (cihazdaki oturum)
const STUDENTS_LIST = 'ho_students'       // bu cihazda görülen öğrenciler listesi [{code,name,cls}]
const CODES_KEY     = 'ho_codes'          // { CODE: { name, cls, lockedAt } }
const PROG_PREFIX   = 'ho_progress_'      // ilerleme anahtarı (öğrenci bazlı)

const read = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k) ?? d) } catch { return JSON.parse(d) }
}
const write = (k,v) => localStorage.setItem(k, JSON.stringify(v))
const normCode = (c) => (c || '').trim().toUpperCase()

// ---- Öğrenci oturumu
export const getStudent = () => read(STUDENT_KEY, 'null')
export const setStudent = (s) => write(STUDENT_KEY, s)
export const clearStudent = () => localStorage.removeItem(STUDENT_KEY)

// ---- Öğretmen oturumu
export const getTeacher = () => read(TEACHER_KEY, 'null')
export const setTeacher = (t) => write(TEACHER_KEY, t)
export const clearTeacher = () => localStorage.removeItem(TEACHER_KEY)

// ---- Öğrenci listesi (öğrt. paneli için; bu cihazda giriş yapanlar)
export function addStudentToList(s){
  const arr = read(STUDENTS_LIST, '[]')
  const i = arr.findIndex(x => x.code === s.code)
  if(i === -1) arr.push({ code:s.code, name:s.name, cls:s.cls })
  else arr[i] = { ...arr[i], name:s.name, cls:s.cls }
  write(STUDENTS_LIST, arr)
}
export const listStudents = () => read(STUDENTS_LIST, '[]')

// ---- Kod/sınıf kilitleme
function getCodes(){ return read(CODES_KEY, '{}') }
function setCodes(o){ write(CODES_KEY, o) }
export function getLockedInfo(code){
  const c = getCodes()
  const k = normCode(code)
  return c[k] || null
}
export function lockCodeToStudent({ code, name, cls }){
  const k = normCode(code)
  if(!k) throw new Error('Kod gerekli.')
  if(!CLASS_OPTIONS.includes(cls)) throw new Error('Geçersiz sınıf.')
  const c = getCodes()
  const ex = c[k]
  if(!ex){
    c[k] = { name, cls, lockedAt: new Date().toISOString() }
    setCodes(c)
    return c[k]
  }
  if(ex.cls !== cls) throw new Error(`Bu kod "${ex.cls}" sınıfına kilitli.`)
  // ismi güncellemek serbest
  if(ex.name !== name){ c[k] = { ...ex, name }; setCodes(c) }
  return c[k]
}

// ---- İLERLEME KAYDI (Takistoskop vb.)  <<< BUNLAR GEREKİYOR
export function getProgress(code){
  return read(PROG_PREFIX + normCode(code), '{}')
}
export function setProgress(code, obj){
  write(PROG_PREFIX + normCode(code), obj)
}
