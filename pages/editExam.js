import {
  getExamById
} from "../services/examService.js";



export function editExamPage(id){


  const exam =
    getExamById(id);



  if(!exam){

    return `

      <div style="
      padding:30px;
      text-align:center;
      direction:rtl;
      ">

      ⬅ Back

      </div>

    `;

  }



  return `


<div style="
direction:rtl;
padding:30px;
font-family:Cairo,sans-serif;
">



<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
">


<h2 style="
color:white;
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
">

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
"

>


</div>





<div id="editQuestionsList">


${

exam.questions.map(
(q,index)=>`

<div
class="edit-question-card"

data-index="${index}"

style="
background:#1e293b;
padding:20px;
border-radius:15px;
margin-bottom:20px;
">


<h3 style="
color:#818cf8;
">

السؤال ${index+1}

</h3>




<textarea

class="editQText"

style="
width:100%;
height:90px;
padding:10px;
border-radius:10px;
"

>${q.text || q.question || ""}</textarea>





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

value="${q.image || q.questionImage || ""}"

>


${
q.image || q.questionImage

?

`

<img

src="${
(q.image || q.questionImage).startsWith("data:")

?

(q.image || q.questionImage)

:

"/images/" +
(q.image || q.questionImage)

}"

class="question-image"

style="
max-width:250px;
margin-top:15px;
border-radius:10px;
"

>

`

:

""

}

${

  (q.options || ["","","",""])
  .map(
  (opt,i)=>`
  
  <input
  
  class="editOptText"
  
  data-index="${index}"
  
  data-option="${i}"
  
  value="${opt || ""}"
  
  placeholder="الإجابة ${String.fromCharCode(65+i)}"
  
  style="
  width:100%;
  padding:10px;
  margin-top:10px;
  border-radius:8px;
  "
  
  >
  
  `
  
  )
  .join("")
  
  }
  
  
  
  
  
  <div style="
  margin-top:15px;
  ">
  
  
  <label>
  الإجابة الصحيحة
  </label>
  
  
  
  <select
  
  class="editCorrectSelect"
  
  data-index="${index}"
  
  style="
  padding:10px;
  border-radius:8px;
  margin-top:10px;
  "
  
  >
  
  
  <option value="0"
  ${Number(q.correctIndex ?? q.correctAnswerIndex)===0?"selected":""}
  >
  
  Option A
  
  </option>
  
  
  <option value="1"
  ${Number(q.correctIndex ?? q.correctAnswerIndex)===1?"selected":""}
  >
  
  Option B
  
  </option>
  
  
  <option value="2"
  ${Number(q.correctIndex ?? q.correctAnswerIndex)===2?"selected":""}
  >
  
  Option C
  
  </option>
  
  
  <option value="3"
  ${Number(q.correctIndex ?? q.correctAnswerIndex)===3?"selected":""}
  >
  
  Option D
  
  </option>
  
  
  
  </select>
  
  
  </div>
  
  
  
  
  
  
  <button
  
  class="deleteQuestion"
  
  data-index="${index}"
  
  style="
  background:#ef4444;
  color:white;
  border:none;
  padding:10px 15px;
  border-radius:8px;
  cursor:pointer;
  margin-top:15px;
  "
  
  >
  
  🗑 حذف السؤال
  
  </button>
  
  
  
  
  
  <button
  
  class="duplicateQuestion"
  
  data-index="${index}"
  
  style="
  background:#6366f1;
  color:white;
  border:none;
  padding:10px 15px;
  border-radius:8px;
  cursor:pointer;
  margin-top:15px;
  margin-right:10px;
  "
  
  >
  
  📄 نسخ السؤال
  
  </button>
  
  
  
  
  
  </div>
  
  
  `
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
  
  data-exam="${exam.id}"
  
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
  // نهاية الملف