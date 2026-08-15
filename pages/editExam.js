import {
  getExamById
} from "../services/examService.js";

import {
  questionHTML
} from "./editExamEvents.js";



export async function editExamPage(id) {

  const exam =
    await getExamById(id);



  if (!exam) {

    return `

      <div style="
        padding:30px;
        text-align:center;
        direction:rtl;
      ">

        <h3>الامتحان غير موجود</h3>

        <button
          id="backToManageExams"
          style="
            padding:10px 20px;
            border:none;
            border-radius:10px;
            cursor:pointer;
          "
        >
          ⬅ رجوع
        </button>

      </div>

    `;

  }



  const questions =
    Array.isArray(exam.questions)
      ? exam.questions
      : [];



  return `

<div
  id="editExamContainer"
  data-exam-id="${exam.firestoreId || exam.id}"
  style="
    direction:rtl;
    padding:30px;
    font-family:Cairo,sans-serif;
  "
>



<div style="
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:25px;
">

  <h2 style="
    color:white;
    margin:0;
  ">
    تعديل الامتحان
  </h2>



  <button
    id="backToManageExams"
    style="
      padding:10px 20px;
      border:none;
      border-radius:10px;
      cursor:pointer;
    "
  >
    ⬅ رجوع
  </button>

</div>





<div style="
  background:#1e293b;
  padding:20px;
  border-radius:15px;
  margin-bottom:20px;
">

  <label>
    عنوان الامتحان
  </label>



  <input
    id="editExamTitle"
    value="${exam.title || ""}"
    style="
      width:100%;
      padding:12px;
      border-radius:10px;
      margin-top:10px;
      box-sizing:border-box;
    "
  >

</div>





<div id="editQuestionsList">

${
  questions
    .map(
      (q, index) =>
        questionHTML(q, index)
    )
    .join("")
}

</div>





<button
  id="addEditQuestion"
  style="
    width:100%;
    padding:15px;
    background:#0ea5e9;
    color:white;
    border:none;
    border-radius:12px;
    cursor:pointer;
    font-size:16px;
    font-weight:bold;
  "
>
  ➕ إضافة سؤال
</button>





<button
  id="saveExamEdit"
  data-exam="${exam.firestoreId || exam.id}"
  style="
    width:100%;
    padding:15px;
    background:#10b981;
    color:white;
    border:none;
    border-radius:12px;
    cursor:pointer;
    font-size:18px;
    font-weight:bold;
    margin-top:20px;
  "
>
  💾 حفظ التعديلات
</button>





</div>

`;

}