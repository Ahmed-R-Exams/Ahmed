import {
  addExam
} from "../services/examService.js";


let editingExamData = null;



export function setExamToEdit(exam){

  editingExamData = exam;

}




export function createExamPage(){

const isEdit =
!!editingExamData;



return `


<div style="
direction:rtl;
font-family:Cairo;
max-width:1000px;
margin:auto;
padding:30px;
">



<h2 style="
color:white;
margin-bottom:25px;
">

${isEdit ? "✏️ تعديل الامتحان" : "➕ إنشاء امتحان جديد"}

</h2>




<div style="
background:#1e293b;
padding:25px;
border-radius:20px;
">





<label>
عنوان الامتحان
</label>



<input

id="examTitle"

value="${
isEdit
?
editingExamData.title || ""
:
""
}"

placeholder="عنوان الامتحان"

style="
width:100%;
padding:12px;
border-radius:10px;
margin:10px 0 20px;
"

>






<label>
المادة
</label>



<select

id="examSubject"

style="
width:100%;
padding:12px;
border-radius:10px;
margin:10px 0 20px;
"

>


<option value="physics"
${
isEdit &&
editingExamData.subject==="physics"
?
"selected"
:
""
}
>

فيزياء

</option>



<option value="chemistry"

${
isEdit &&
editingExamData.subject==="chemistry"
?
"selected"
:
""
}

>

كيمياء

</option>


</select>







<label>
الصف
</label>



<select

id="examClass"

style="
width:100%;
padding:12px;
border-radius:10px;
margin:10px 0 20px;
"

>



<option value="الصف الأول الثانوي">

الصف الأول الثانوي

</option>



<option value="الصف الثاني الثانوي">

الصف الثاني الثانوي

</option>



<option value="الصف الثالث الثانوي">

الصف الثالث الثانوي

</option>



</select>







<label>
مدة الامتحان بالدقائق
</label>



<input

type="number"

id="examDuration"

value="${
isEdit
?
editingExamData.duration || 60
:
60
}"

style="
width:100%;
padding:12px;
border-radius:10px;
margin:10px 0 20px;
"

>





<label>
درجة النجاح
</label>



<input

type="number"

id="examPassingScore"

value="${
isEdit
?
editingExamData.passingScore || 50
:
50
}"

style="
width:100%;
padding:12px;
border-radius:10px;
"

>


<br><br>


<label>
تاريخ بداية الامتحان
</label>



<input

type="datetime-local"

id="examStartDate"

value="${
isEdit
?
editingExamData.startDate || ""
:
""
}"

style="
width:100%;
padding:12px;
border-radius:10px;
margin:10px 0 20px;
"

>





<label>
تاريخ نهاية الامتحان
</label>



<input

type="datetime-local"

id="examEndDate"

value="${
isEdit
?
editingExamData.endDate || ""
:
""
}"

style="
width:100%;
padding:12px;
border-radius:10px;
margin:10px 0 20px;
"

>






<h3 style="
color:#818cf8;
margin-top:30px;
">

الأسئلة

</h3>




<div id="questionsList">



${
isEdit && editingExamData.questions

?

editingExamData.questions
.map(
(q,i)=>

createQuestionTemplate(
i+1,
q
)

)
.join("")


:

`

<div style="
color:#94a3b8;
text-align:center;
padding:20px;
border:1px dashed #475569;
border-radius:15px;
">

لا توجد أسئلة - أضف سؤال جديد

</div>

`

}



</div>







<button

id="btnAddQuestion"

type="button"

style="
margin-top:20px;
background:#6366f1;
color:white;
border:none;
padding:12px 25px;
border-radius:10px;
cursor:pointer;
"

>

➕ إضافة سؤال

</button>







<br><br>





<button

id="btnSaveExam"

style="
width:100%;
padding:15px;
background:#10b981;
color:white;
border:none;
border-radius:12px;
font-size:18px;
font-weight:bold;
cursor:pointer;
"

>

💾 حفظ الامتحان

</button>






<button

id="btnBackToList"

type="button"

style="
width:100%;
margin-top:15px;
padding:12px;
background:#334155;
color:white;
border:none;
border-radius:10px;
cursor:pointer;
"

>

⬅ رجوع

</button>






</div>


</div>


`;

}







function createQuestionTemplate(
index,
question={}
){

return `


<div class="question-card"

style="
background:#0f172a;
padding:20px;
border-radius:15px;
margin-top:15px;
border:1px solid rgba(255,255,255,.1);
"

>



<h3 style="
color:#818cf8;
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
"

>

🗑 حذف السؤال

</button>




<textarea

class="q-text"

placeholder="نص السؤال"

style="
width:100%;
height:90px;
margin-top:15px;
padding:12px;
border-radius:10px;
"

>${question.text || question.question || ""}</textarea>





<input

type="file"

class="q-file-input"

accept="image/*"

>



<input

type="hidden"

class="q-image"

value="${
question.image || ""
}"

>


<div class="image-preview-container"

style="
display:${
question.image
?
"block"
:
"none"
};
margin-top:10px;
"

>


<img

src="${
question.image || ""
}"

style="
max-width:250px;
border-radius:10px;
"

>


</div>





<br>





<select

class="q-type-select"

style="
padding:10px;
border-radius:8px;
"

>


<option value="mcq"

${
question.type==="mcq"
?
"selected"
:
""
}

>

اختيار من متعدد

</option>



<option value="essay"

${
question.type==="essay"
?
"selected"
:
""
}

>

سؤال مقالي

</option>



</select>








<div class="mcq-options-wrapper"

style="
margin-top:15px;
display:${
question.type==="essay"
?
"none"
:
"block"
};
"

>



${
["A","B","C","D"]
.map((x,i)=>`


<div style="
display:flex;
gap:10px;
margin-bottom:10px;
align-items:center;
">


<input

type="radio"

class="q-correct-radio"

name="correct_${index}"

value="${i}"

${
Number(
question.correctIndex ??
question.correctAnswerIndex ??
0
)
=== i
?
"checked"
:
""
}

>



<input

class="opt-text"

value="${
question.options?.[i] || ""
}"

placeholder="الإجابة ${x}"

style="
flex:1;
padding:10px;
border-radius:8px;
"

>



</div>


`).join("")

}



</div>







<div class="essay-space-wrapper"

style="
display:${
question.type==="essay"
?
"block"
:
"none"
};
margin-top:15px;
"

>



<textarea

class="student-essay-answer"

placeholder="نموذج الإجابة المقالية"

style="
width:100%;
height:120px;
padding:12px;
border-radius:10px;
"

>${question.modelAnswer || ""}</textarea>



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

value="${
question.score || 1
}"

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





export function clearEditingExam(){

editingExamData = null;

}