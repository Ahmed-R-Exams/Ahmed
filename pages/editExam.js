import {
    getExamById
  } from "../services/examService.js";
  
  
  
  export function editExamPage(id){
  
  
  const exam =
  getExamById(id);
  
  
  
  if(!exam){
  
  
  return `
  
  <div class="container">
  
  <div class="card">
  
  
  <h2>
  Exam Not Found
  </h2>
  
  
  <button id="backAdmin">
  
  ⬅ Back
  
  </button>
  
  
  </div>
  
  </div>
  
  `;
  
  }
  
  
  
  return `
  
  
  <div class="container">
  
  
  <h1>
  ✏ Edit Exam
  </h1>
  
  
  <p class="subtitle">
  ${exam.title}
  </p>
  
  
  
  
  <div class="card">
  
  
  <div class="exam-info">
  
  
  <p>
  <b>ID:</b> ${exam.id}
  </p>
  
  
  <p>
  <b>Questions:</b> ${exam.questions.length}
  </p>
  
  
  <p>
  <b>Time:</b> ${exam.examTime || 30} min
  </p>
  
  
  </div>
  
  
  
  
  <div id="editQuestionsContainer">
  
  
  ${
  
  exam.questions.map((q,index)=>`
  
  
  <div class="question-box">
  
  
  <div class="question-head">
  
  
  <h3>
  Question ${index+1}
  </h3>
  
  
  <div>
  
  
  <button
  
  class="duplicateQuestion"
  
  data-index="${index}">
  
  📄 Duplicate
  
  </button>
  
  
  
  <button
  
  class="deleteQuestion"
  
  data-index="${index}">
  
  🗑 Delete
  
  </button>
  
  
  </div>
  
  
  </div>
  
  
  
  
  <textarea
  
  class="editQuestion"
  
  data-index="${index}"
  
  rows="4"
  
  >${q.question || ""}</textarea>
  
  
  
  
  
  <label>
  📷 Question Image
  </label>
  
  
  <input
  
  type="file"
  
  class="editImageFile"
  
  data-index="${index}"
  
  accept="image/*"
  
  >
  
  
  <input
  
  type="hidden"
  
  class="editImage"
  
  data-index="${index}"
  
  value="${q.image || ""}"
  
  >
  
  
  
  
  ${
  q.image
  
  ?
  
  `
  
  <img
  
  src="${
  q.image.startsWith("data:")
  
  ?
  
  q.image
  
  :
  
  "/images/"+q.image
  
  }"
  
  class="question-image"
  
  >
  
  `
  
  :
  
  ""
  
  }
  
  
  
  
  <div class="options-grid">
  
  
  <input
  
  class="editOptionA"
  
  data-index="${index}"
  
  value="${q.options?.[0] || ""}"
  
  placeholder="Option A"
  
  >
  
  
  <input
  
  class="editOptionB"
  
  data-index="${index}"
  
  value="${q.options?.[1] || ""}"
  
  placeholder="Option B"
  
  >
  
  
  <input
  
  class="editOptionC"
  
  data-index="${index}"
  
  value="${q.options?.[2] || ""}"
  
  placeholder="Option C"
  
  >
  
  
  <input
  
  class="editOptionD"
  
  data-index="${index}"
  
  value="${q.options?.[3] || ""}"
  
  placeholder="Option D"
  
  >
  
  
  </div>
  
  
  
  
  <select
  
  class="editAnswer"
  
  data-index="${index}"
  
  >
  
  
  <option value="0"
  ${q.correctIndex===0?"selected":""}>
  
  Option A
  
  </option>
  
  
  <option value="1"
  ${q.correctIndex===1?"selected":""}>
  
  Option B
  
  </option>
  
  
  <option value="2"
  ${q.correctIndex===2?"selected":""}>
  
  Option C
  
  </option>
  
  
  <option value="3"
  ${q.correctIndex===3?"selected":""}>
  
  Option D
  
  </option>
  
  
  </select>
  
  
  
  
  </div>
  
  
  `).join("")
  
  }
  
  
  </div>
  
  
  
  
  
  <div class="page-buttons">
  
  
  <button id="addQuestion">
  
  ➕ Add Question
  
  </button>
  
  
  
  <button
  
  id="saveExamEdit"
  
  data-exam="${exam.id}">
  
  💾 Save Changes
  
  </button>
  
  
  
  <button id="backAdmin">
  
  ⬅ Back
  
  </button>
  
  
  </div>
  
  
  
  </div>
  
  
  
  </div>
  
  
  `;
  
  }