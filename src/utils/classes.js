// 5/6/7. sınıflar, A..E şubeleri
const mk = (g) => ['A','B','C','D','E'].map(s => `${g}/${s}`)
export const CLASS_OPTIONS = [
  ...mk(5), ...mk(6), ...mk(7)
]
