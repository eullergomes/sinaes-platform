export const mapGrade = (grade: string | null) => {
  if (grade === null) return null;
  if (grade === 'NSA') return null;
  if (grade.startsWith('G')) {
    const n = Number(grade.slice(1));
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(grade);
  return Number.isFinite(n) ? n : null;
}