export function readJSON(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return fallback;
    const val = JSON.parse(raw);
    return val ?? fallback;
  }catch(e){
    console.warn("[safeStorage] parse error for", key, e);
    return fallback;
  }
}
export function writeJSON(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }
  catch(e){ console.warn("[safeStorage] write error for", key, e); }
}
export function ensure(key, fallback){
  const v = readJSON(key, undefined);
  if(v===undefined){ writeJSON(key, fallback); return fallback; }
  return v;
}
