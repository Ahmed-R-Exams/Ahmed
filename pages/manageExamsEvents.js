import {
    getExamById,
    getExams,
    deleteExam,
    saveExams
  } from "../services/examService.js";
  
  
  import {
    manageExamsPage
  } from "./manageExams.js";
  
  
  import {
    editExamPage
  } from "./editExam.js";
  
  
  import {
    editExamEvents
  } from "./editExamEvents.js";
  
  
  
  let initialized = false;
  
  
  
  export function manageExamsEvents(){
  
  
  if(initialized) return;
  
  initialized = true;
  
  
  
  document.addEventListener(
  "input",
  (e)=>{
  
  
  if(e.target.id==="searchExam"){
  
  
  const value =
  e.target.value
  .toLowerCase()
  .trim();
  
  
  
  document
  .querySelectorAll(".examItem")
  .forEach(card=>{
  
  
  const title =
  (card.dataset.title || "")
  .toLowerCase();
  
  
  
  const id =
  String(
  card.dataset.id || ""
  );
  
  
  
  card.style.display =
  
  title.includes(value) ||
  id.includes(value)
  
  ?
  
  ""
  
  :
  
  "none";
  
  
  });
  
  
  }
  
  
  });
  
  
  
  
  
  document.addEventListener(
  "click",
  (e)=>{
  
  
  
  // DELETE
  
  const del =
  e.target.closest(".deleteExam");
  
  
  
  if(del){
  
  
  const id =
  Number(
  del.dataset.id
  );
  
  
  
  const exam =
  getExamById(id);
  
  
  
  if(!exam)
  return;
  
  
  
  if(
  confirm(
  `Delete "${exam.title}" ?`
  )
  ){
  
  
  deleteExam(id);
  
  
  
  document.querySelector("#app")
  .innerHTML =
  manageExamsPage();
  
  
  }
  
  
  return;
  
  
  }
  
  
  
  
  // PUBLISH / HIDE
  
  const toggle =
  e.target.closest(".toggleExam");
  
  
  
  if(toggle){
  
  
  const id =
  Number(
  toggle.dataset.id
  );
  
  
  
  const exam =
  getExamById(id);
  
  
  
  if(!exam)
  return;
  
  
  
  exam.published =
  !exam.published;
  
  
  
  saveExams();
  
  
  
  document.querySelector("#app")
  .innerHTML =
  manageExamsPage();
  
  
  
  return;
  
  
  }
  
  
  
  
  
  // EDIT
  
  const edit =
  e.target.closest(".editExam");
  
  
  
  if(edit){
  
  
  const id =
  Number(
  edit.dataset.id
  );
  
  
  
  document.querySelector("#app")
  .innerHTML =
  editExamPage(id);
  
  
  
  editExamEvents(id);
  
  
  
  return;
  
  
  }
  
  
  
  
  // SAVE SETTINGS
  
  const save =
  e.target.closest(".saveExamSchedule");
  
  
  
  if(save){
  
  
  const id =
  Number(
  save.dataset.id
  );
  
  
  
  const exam =
  getExamById(id);
  
  
  
  if(!exam)
  return;
  
  
  
  
  const timeInput =
  document.querySelector(
  `.examTime[data-id="${id}"]`
  );
  
  
  
  const startInput =
  document.querySelector(
  `.examStartDate[data-id="${id}"]`
  );
  
  
  
  const endInput =
  document.querySelector(
  `.examEndDate[data-id="${id}"]`
  );
  
  
  
  exam.examTime =
  
  Math.max(
  1,
  Number(timeInput?.value) || 30
  );
  
  
  
  exam.startDate =
  
  startInput?.value || "";
  
  
  
  exam.endDate =
  
  endInput?.value || "";
  
  
  
  saveExams();
  
  
  
  save.textContent =
  "✅ Saved";
  
  
  
  setTimeout(()=>{
  
  save.textContent =
  "💾 Save";
  
  },1200);
  
  
  
  return;
  
  
  }
  
  
  
  
  
  // SORT TITLE
  
  if(
  e.target.closest("#sortExamAZ")
  ){
  
  
  
  getExams()
  .sort(
  (a,b)=>
  a.title.localeCompare(
  b.title
  )
  );
  
  
  
  saveExams();
  
  
  
  document.querySelector("#app")
  .innerHTML =
  manageExamsPage();
  
  
  
  return;
  
  
  }
  
  
  
  
  
  // SORT QUESTIONS
  
  if(
  e.target.closest("#sortExamQuestions")
  ){
  
  
  
  getExams()
  .sort(
  (a,b)=>
  (b.questions?.length || 0)
  -
  (a.questions?.length || 0)
  );
  
  
  
  saveExams();
  
  
  
  document.querySelector("#app")
  .innerHTML =
  manageExamsPage();
  
  
  }
  
  
  });
  
  }