type GradeMap = {
  [key: string]: string;
};

const GRADE_TO_NUMBER: GradeMap = {
  'Tte. 1°': 'G7',
  'Capitán': 'G8',
  'Teniente': 'G6'
};

export const getGradeNumber = (grade: string): string => {
  return GRADE_TO_NUMBER[grade] || grade;
};

export const formatOfficerName = (grade: string, nombre: string, apellido: string): string => {
  const gradeNumber = getGradeNumber(grade);
  const firstInitial = nombre.charAt(0).toUpperCase();
  return `${gradeNumber} ${firstInitial}. ${apellido}`;
};
