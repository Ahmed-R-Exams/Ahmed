import "./style.css";

import { homePage } from "./pages/home.js";
import { classesPage } from "./pages/classes.js";
import { subjectPage } from "./pages/subject.js";
import { physicsPage } from "./pages/physics.js";
import { boardsPage } from "./pages/boards.js";
import { filesPage } from "./pages/files.js";

import { examsPage } from "./pages/exams.js";
import { showExam } from "./pages/exam.js";

import { teacherBoardsPage } from "./pages/TeacherBoards.js";
import { adminPage } from "./pages/admin.js";

import {
  teacherLoginPage,
  teacherLoginEvents
} from "./pages/teacherLoginModal.js";

import { teacherSettingsPage } from "./pages/teacherSettings.js";
import { teacherSettingsEvents } from "./pages/teacherSettingsEvents.js";
import { resultsEvents } from "./pages/resultsEvents.js";

import { manageExamsPage } from "./pages/manageExams.js";
import { manageExamsEvents } from "./pages/manageExamsEvents.js";

import { createExamPage } from "./pages/createExam.js";
import { createExamEvents } from "./pages/createExamEvents.js";

import { examsListPage } from "./pages/examsList.js";
import { resultsPage } from "./pages/results.js";

const app = document.querySelector("#app");


// ================= START =================

if (
  localStorage.getItem("teacherLogin") === "true"
) {

  app.innerHTML = adminPage();

} else {

  app.innerHTML = homePage();

}



// ================= EVENTS =================

document.addEventListener("click", (e) => {


// HOME

if(
  e.target.closest("#startBtn") ||
  e.target.closest("#studentLogin")
){

  app.innerHTML = classesPage();

  return;

}



// TEACHER LOGIN

if(
  e.target.closest("#teacherLogin") ||
  e.target.closest("#adminBtn")
){

  if(
    localStorage.getItem("teacherLogin") === "true"
  ){

    app.innerHTML = adminPage();

  }else{

    app.innerHTML = teacherLoginPage();

    teacherLoginEvents();

  }

  return;

}



// PHYSICS

if(
  e.target.closest("#physicsBtn")
){

  app.innerHTML = physicsPage();

  return;

}



// EXAMS

if(
  e.target.closest("#openExams") ||
  e.target.closest("#examBtn") ||
  e.target.closest("#btnExams")
){

  app.innerHTML = examsPage();

  return;

}



// DIRECT OPEN EXAM

if(
  e.target.closest("#startExam")
){

  app.innerHTML = showExam();

  return;

}



// BOARDS

if(
  e.target.closest("#boardsBtn")
){

  app.innerHTML = boardsPage();

  return;

}



// FILES

if(
  e.target.closest("#filesBtn")
){

  app.innerHTML = filesPage();

  return;

}



// MANAGE EXAMS

if(
  e.target.closest("#manageExamsBtn")
){

  app.innerHTML = manageExamsPage();

  manageExamsEvents();

  return;

}



// CREATE EXAM

if(
  e.target.closest("#btnCreateExam")
){

  app.innerHTML = createExamPage();

  createExamEvents();

  return;

}



// EXAMS LIST

if(
  e.target.closest("#btnExamsList")
){

  app.innerHTML = examsListPage();

  return;

}



// TEACHER BOARDS

if(
  e.target.closest("#manageBoardsBtn")
){

  app.innerHTML = teacherBoardsPage();

  return;

}



// SETTINGS

if(
  e.target.closest("#teacherSettingsBtn")
){

  app.innerHTML = teacherSettingsPage();

  teacherSettingsEvents();

  return;

}



// RESULTS

if(
  e.target.closest("#resultsBtn")
){

  app.innerHTML = resultsPage();

  resultsEvents();

  return;

}



// BACK ADMIN

if(
  e.target.closest("#btnBackToAdmin")
){

  app.innerHTML = adminPage();

  return;

}



// BACK

if(
  e.target.closest("#backBtn") ||
  e.target.closest("#btnBack")
){

  app.innerHTML = classesPage();

  return;

}


});