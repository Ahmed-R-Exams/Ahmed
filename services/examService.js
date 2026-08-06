// services/examService.js

const STORAGE_KEY = "app_exams";

export function getExams() {
  try {
    const exams = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("exams") ||
      "[]"
    );

    return Array.isArray(exams) ? exams : [];
  } catch {
    return [];
  }
}

export function saveExams(examsArray = []) {
  const exams = Array.isArray(examsArray) ? examsArray : [];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  localStorage.setItem("exams", JSON.stringify(exams));
}

export function addExam(newExam) {
  const exams = getExams();

  const exam = {
    ...newExam,
    id: newExam.id || Date.now(),

    title: newExam.title || "",

    subject: newExam.subject || "physics",

    className:
      newExam.className ||
      newExam.grade ||
      "الصف الأول الثانوي",

    grade:
      newExam.grade ||
      newExam.className ||
      "الصف الأول الثانوي",

    examTime:
      Number(newExam.examTime) ||
      Number(newExam.duration) ||
      30,

    duration:
      Number(newExam.duration) ||
      Number(newExam.examTime) ||
      30,

    questions: Array.isArray(newExam.questions)
      ? newExam.questions.map((q) => ({
          question:
            q.question ||
            q.text ||
            "",

          text:
            q.text ||
            q.question ||
            "",

          image:
            q.image ||
            q.questionImage ||
            "",

          questionImage:
            q.questionImage ||
            q.image ||
            "",

          options: Array.isArray(q.options)
            ? q.options
            : [],

          correctIndex:
            q.correctIndex ??
            q.correctAnswerIndex ??
            q.rightIndex ??
            q.correctAnswer ??
            0,

          correctAnswerIndex:
            q.correctAnswerIndex ??
            q.correctIndex ??
            q.rightIndex ??
            q.correctAnswer ??
            0,

          type: q.type || "mcq",

          score:
            Number(q.score) ||
            1,

          maxScore:
            Number(q.maxScore) ||
            Number(q.points) ||
            Number(q.grade) ||
            1
        }))
      : [],

    manualClose:
      newExam.manualClose || false
  };

  const oldIndex = exams.findIndex(
    (e) => e.id == exam.id
  );

  if (oldIndex === -1) {
    exams.push(exam);
  } else {
    exams[oldIndex] = exam;
  }

  saveExams(exams);

  return exam;
}

export function saveExam(exam) {
  return addExam(exam);
}

export function createExamFromExcel(excelData) {
  const exams = getExams();

  const imported = Array.isArray(excelData)
    ? excelData
    : [excelData];

  imported.forEach((exam) => {
    addExam(exam);
  });

  return getExams();
}

export function getExamById(idOrTitle) {
  return (
    getExams().find(
      (e) =>
        e.id == idOrTitle ||
        e.title === idOrTitle
    ) || null
  );
}

export function updateExam(
  idOrTitle,
  updatedExamData
) {
  const exams = getExams();

  const index = exams.findIndex(
    (e) =>
      e.id == idOrTitle ||
      e.title === idOrTitle
  );

  if (index === -1) return null;

  const oldExam = exams[index];

  exams[index] = {
    ...oldExam,
    ...updatedExamData,
    id: oldExam.id,

    className:
      updatedExamData.className ||
      updatedExamData.grade ||
      oldExam.className,

    grade:
      updatedExamData.grade ||
      updatedExamData.className ||
      oldExam.grade,

    duration:
      Number(updatedExamData.duration) ||
      Number(updatedExamData.examTime) ||
      oldExam.duration,

    examTime:
      Number(updatedExamData.examTime) ||
      Number(updatedExamData.duration) ||
      oldExam.examTime
  };

  saveExams(exams);

  return exams[index];
}

export function deleteExam(idOrTitle) {
  const exams = getExams().filter(
    (e) =>
      e.id != idOrTitle &&
      e.title !== idOrTitle
  );

  saveExams(exams);
}