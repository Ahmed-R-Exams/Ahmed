import { getExamById, saveExams } from "../services/examService.js";
import { manageExamsPage } from "./manageExams.js";
import { manageExamsEvents } from "./manageExamsEvents.js";

let editEventsInitialized = false;

export function editExamEvents(examId) {
  if (editEventsInitialized) return;
  editEventsInitialized = true;

  document.addEventListener("click", (e) => {
    if (e.target.closest("#saveExamEdit")) {
      const exam = getExamById(Number(examId));
      if (!exam) return;

      const titleInput = document.getElementById("editExamTitle");
      if (titleInput) exam.title = titleInput.value.trim();

      const questionCards = document.querySelectorAll(".edit-question-card");
      questionCards.forEach((card, index) => {
        const qText = card.querySelector(".editQText")?.value.trim();
        if (qText) exam.questions[index].question = qText;

        const optInputs = card.querySelectorAll(".editOptText");
        optInputs.forEach((optInput, optIdx) => {
          if (exam.questions[index].options[optIdx] !== undefined) {
            exam.questions[index].options[optIdx] = optInput.value.trim();
          }
        });

        const correctSelect = card.querySelector(".editCorrectSelect");
        if (correctSelect) {
          const selectedIdx = Number(correctSelect.value);
          exam.questions[index].correctIndex = selectedIdx;
          exam.questions[index].answer = exam.questions[index].options[selectedIdx];
        }
      });

      saveExams();
      alert("Exam Saved Successfully ✅");

      document.querySelector("#app").innerHTML = manageExamsPage();
      manageExamsEvents();
    }
  });
}