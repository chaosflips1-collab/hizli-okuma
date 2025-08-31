// Çok-okullu örnek veri: gerçek backend gelene kadar okul/sınıf seçenekleri
export const schools = [
  { id: 'okul-a', name: 'Anka İlkokulu',   classes: ['5/A', '5/B', '5/C'] },
  { id: 'okul-b', name: 'Poyraz Ortaokulu', classes: ['5/A', '5/B'] },
  { id: 'okul-c', name: 'Güneş Ortaokulu',  classes: ['6/A', '6/B', '6/C'] },
];

export function listSchools() {
  return schools.map(({ id, name }) => ({ id, name }));
}
export function listClasses(schoolId) {
  const s = schools.find(x => x.id === schoolId);
  return s ? [...s.classes] : [];
}
