import {
  examsListPage
} from "./examsList.js";


let initialized = false;
let editingExam = null;


export function setEditingExam(exam){
  editingExam = exam;
}



export function createExamEvents(){

if(initialized)
return;

initialized = true;



document.addEventListener(
"click",
(e)=>{


// إضافة سؤال

if(
e.target.closest("#btnAddQuestion")
){

const list =
document.querySelector(
"#questionsList"
);


if(list){

const empty =
list.querySelector(
"div[style*='dashed']"
);


if(empty)
empty.remove();



list.insertAdjacentHTML(
"beforeend",
createQuestionTemplate(
list.children.length + 1
)
);

}


return;

}





// حذف سؤال

if(
e.target.closest(".removeQuestion")
){

e.target
.closest(".question-card")
.remove();

return;

}




// حفظ الامتحان

if(
e.target.closest("#btnSaveExam")
){

saveExam();

return;

}





// رجوع

if(
e.target.closest("#btnBackToList")
){

editingExam=null;

document.querySelector("#app").innerHTML =
examsListPage();

return;

}



});






document.addEventListener(
"change",
(e)=>{


// تغيير نوع السؤال

if(
e.target.classList.contains(
"q-type-select"
)
){


const card =
e.target.closest(
".question-card"
);



const mcq =
card.querySelector(
".mcq-options-wrapper"
);



const essay =
card.querySelector(
".essay-space-wrapper"
);



if(
e.target.value==="essay"
){

mcq.style.display="none";

essay.style.display="block";

}else{

mcq.style.display="block";

essay.style.display="none";

}


}





// صورة السؤال

if(
e.target.classList.contains(
"q-file-input"
)
){


const file =
e.target.files[0];


if(!file)
return;



const reader =
new FileReader();



reader.onload =
(event)=>{


const card =
e.target.closest(
".question-card"
);



card.querySelector(
".q-image"
).value =
event.target.result;



const preview =
card.querySelector(
".image-preview-container"
);



preview.style.display =
"block";



preview.querySelector(
"img"
).src =
event.target.result;



};



reader.readAsDataURL(file);



}



});


}
function saveExam(){


  const title =
  document
  .querySelector("#examTitle")
  .value
  .trim();
  
  
  
  if(!title){
  
  alert("اكتب عنوان الامتحان");
  
  return;
  
  }
  
  
  
  const subject =
  document
  .querySelector("#examSubject")
  .value
  ||
  "physics";
  
  
  
  const className =
  document
  .querySelector("#examClass")
  .value
  ||
  "الصف الثاني الثانوي";
  
  
  
  const duration =
  Number(
  document
  .querySelector("#examDuration")
  .value
  )
  ||
  60;
  
  
  
  const passingScore =
  Number(
  document
  .querySelector("#examPassingScore")
  .value
  )
  ||
  50;
  
  
  
  const startDate =
  document
  .querySelector("#examStartDate")
  .value;
  
  
  
  const endDate =
  document
  .querySelector("#examEndDate")
  .value;
  
  
  
  const manualBtn =
  document.querySelector(
  "#toggleManualCloseBtn"
  );
  
  
  
  const manualClose =
  manualBtn
  ?
  manualBtn.getAttribute("data-closed")==="true"
  :
  false;
  
  
  
  
  
  const cards =
  [
  ...document.querySelectorAll(
  ".question-card"
  )
  ];
  
  
  
  if(!cards.length){
  
  alert(
  "أضف سؤال واحد على الأقل"
  );
  
  return;
  
  }
  
  
  
  
  
  
  const questions =
  cards.map(card=>{
  
  
  const type =
  card.querySelector(
  ".q-type-select"
  )
  .value;
  
  
  
  const text =
  card.querySelector(
  ".q-text"
  )
  .value
  .trim();
  
  
  
  const score =
  Number(
  card.querySelector(
  ".q-score"
  )
  .value
  )
  ||
  1;
  
  
  
  const image =
  card.querySelector(
  ".q-image"
  )
  .value
  .trim();
  
  
  
  let options=[];
  
  let correctAnswerIndex=0;
  
  
  
  if(type==="mcq"){
  
  
  
  options =
  [
  ...card.querySelectorAll(
  ".opt-text"
  )
  ]
  .map(
  x=>x.value.trim()
  );
  
  
  
  
  const checked =
  card.querySelector(
  ".q-correct-radio:checked"
  );
  
  
  
  if(checked){
  
  correctAnswerIndex =
  Number(
  checked.value
  );
  
  }
  
  
  
  }
  
  
  
  
  
  return {
  
  
  text,
  
  question:text,
  
  
  type,
  
  
  score,
  
  
  questionImage:image,
  
  
  image:image,
  
  
  options,
  
  
  
  /*
  نحفظ الإجابة الصحيحة بثلاث أسماء
  حتى تتوافق مع ملفات النتيجة والتصحيح
  */
  
  correctAnswerIndex,
  
  
  correctIndex:
  correctAnswerIndex,
  
  
  answer:
  correctAnswerIndex
  
  
  
  };
  
  
  
  });
  
  
  
  
  
  
  
  const examData = {
  
  
  id:
  editingExam?.id
  ||
  Date.now(),
  
  
  
  title,
  
  
  
  subject,
  
  
  
  className,
  
  
  
  grade:
  className,
  
  
  
  duration,
  
  
  
  examTime:
  duration,
  
  
  
  passingScore,
  
  
  
  startDate,
  
  
  
  endDate,
  
  
  
  manualClose,
  
  
  
  isPublished:true,
  
  
  
  questions
  
  
  
  };
  
  
  
  
  
  
  let exams=[];
  
  
  
  try{
  
  
  exams =
  JSON.parse(
  localStorage.getItem(
  "app_exams"
  )
  )
  ||
  [];
  
  
  
  }catch{
  
  
  exams=[];
  
  
  }
  
  
  
  
  
  
  if(editingExam){
  
  
  exams =
  exams.map(
  e =>
  e.id===editingExam.id
  ?
  examData
  :
  e
  );
  
  
  
  }else{
  
  
  exams.unshift(
  examData
  );
  
  
  }
  
  
  
  
  
  
  localStorage.setItem(
  "app_exams",
  JSON.stringify(exams)
  );
  
  
  
  
  
  localStorage.removeItem(
  "filtered_exams"
  );
  
  
  
  
  
  alert(
  "✅ تم حفظ الامتحان بنجاح"
  );
  
  
  
  
  
  editingExam=null;
  
  
  
  
  document.querySelector("#app").innerHTML =
  examsListPage();
  
  
  
  
  }
  function createQuestionTemplate(index){

    return `
    
    <div class="question-card"
    style="
    background:linear-gradient(135deg,rgba(30,41,59,.8),rgba(15,23,42,.9));
    padding:25px;
    border-radius:20px;
    border:1px solid rgba(255,255,255,.1);
    margin-top:15px;
    ">
    
    
    <h3 style="
    color:#818cf8;
    margin-bottom:15px;
    ">
    السؤال رقم ${index}
    </h3>
    
    
    
    <button
    type="button"
    class="removeQuestion"
    style="
    background:#ef4444;
    color:white;
    border:none;
    padding:8px 15px;
    border-radius:8px;
    cursor:pointer;
    margin-bottom:15px;
    ">
    
    🗑 حذف السؤال
    
    </button>
    
    
    
    
    <textarea
    class="q-text"
    placeholder="اكتب نص السؤال هنا..."
    style="
    width:100%;
    height:90px;
    padding:12px;
    border-radius:10px;
    font-family:inherit;
    margin-bottom:15px;
    ">
    </textarea>
    
    
    
    
    <div>
    
    <input
    type="file"
    accept="image/*"
    class="q-file-input"
    >
    
    
    <input
    type="hidden"
    class="q-image"
    >
    
    
    
    <div
    class="image-preview-container"
    style="
    display:none;
    margin-top:10px;
    ">
    
    <img
    style="
    max-width:250px;
    border-radius:10px;
    ">
    
    </div>
    
    
    </div>
    
    
    
    
    
    <div style="
    margin-top:15px;
    ">
    
    
    <select
    class="q-type-select"
    style="
    padding:10px;
    border-radius:8px;
    ">
    
    <option value="mcq">
    اختيار من متعدد
    </option>
    
    <option value="essay">
    سؤال مقالي
    </option>
    
    
    </select>
    
    
    </div>
    
    
    
    
    
    <div
    class="mcq-options-wrapper"
    style="
    margin-top:15px;
    ">
    
    
    ${["A","B","C","D"].map((x,i)=>`
    
    <div style="
    display:flex;
    gap:10px;
    align-items:center;
    margin-bottom:10px;
    ">
    
    
    <input
    type="radio"
    class="q-correct-radio"
    name="correct_${index}"
    value="${i}"
    ${i===0?"checked":""}
    >
    
    
    <input
    class="opt-text"
    placeholder="الإجابة ${x}"
    style="
    flex:1;
    padding:10px;
    border-radius:8px;
    font-family:inherit;
    "
    >
    
    
    </div>
    
    `).join("")}
    
    
    </div>
    
    
    
    
    
    
    <div
    class="essay-space-wrapper"
    style="
    display:none;
    margin-top:15px;
    ">
    
    
    <textarea
    class="student-essay-answer"
    placeholder="نموذج الإجابة المقالية"
    style="
    width:100%;
    height:120px;
    padding:12px;
    border-radius:10px;
    font-family:inherit;
    ">
    </textarea>
    
    
    </div>
    
    
    
    
    
    
    <div style="
    margin-top:15px;
    ">
    
    
    <label>
    درجة السؤال
    </label>
    
    
    <input
    type="number"
    class="q-score"
    value="1"
    min="1"
    style="
    width:80px;
    padding:8px;
    border-radius:8px;
    "
    >
    
    
    </div>
    
    
    
    
    </div>
    
    `;
    
    }