// src/utils/progress.js
// Ünitelere özel günlük ilerleme takibi (yalnızca 1. Ünite için)

const KEY_U1 = "u1.daily.v1"; // anahtar — tek obje: { "2025-08-29": { t:1, k:1, a:1 }, ... }

/** YYYY-MM-DD döner (kullanıcı saatine göre) */
export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadObj() {
  try {
    const raw = localStorage.getItem(KEY_U1);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveObj(obj) {
  try {
    localStorage.setItem(KEY_U1, JSON.stringify(obj));
  } catch {}
}

/** Bugünü işaretle (t=takistoskop, k=köşeli, a=açılı) */
export function markU1Done(exKey /* "t" | "k" | "a" */) {
  const data = loadObj();
  const k = todayKey();
  if (!data[k]) data[k] = { t: 0, k: 0, a: 0 };
  data[k][exKey] = 1; // o gün o egzersiz yapılmış say
  saveObj(data);
}

/** Kaç farklı gün en az 1 egzersiz yapılmış? */
export function countU1Days() {
  const data = loadObj();
  return Object.keys(data).length;
}

/** Bir günde üç egzersizin tamamı yapılmış mı? */
export function isU1DayFull(dateKey = todayKey()) {
  const d = loadObj()[dateKey];
  if (!d) return false;
  return (d.t ? 1 : 0) + (d.k ? 1 : 0) + (d.a ? 1 : 0) === 3;
}

/** 2. Ünite kilidi kalktı mı? (21 farklı gün koşulu) */
export function isUnit2Unlocked() {
  return countU1Days() >= 21;
}

/** Gerekirse sıfırlama (debug için) */
export function resetU1Progress() {
  localStorage.removeItem(KEY_U1);
}
