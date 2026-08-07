import {
  examsListPage
} from "./examsList.js";

import {
  addExam,
  updateExam
} from "../services/examService.js";


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




      if(
        e.target.closest(".removeQuestion")
      ){

        const card =
          e.target.closest(
            ".question-card"
          );


        if(card)
          card.remove();


        return;
      }





      if(
        e.target.closest("#btnSaveExam")
      ){

        saveExam();

        return;
      }





      if(
        e.target.closest("#btnBackToList")
      ){

        editingExam = null;

        document.querySelector("#app")
          .innerHTML =
          examsListPage();

        return;
      }


    }
  );





  document.addEventListener(
    "change",
    (e)=>{


      if(
        e.target.classList.contains(
          "q-type-select"
        )
      ){

        const card =
          e.target.closest(
            ".question-card"
          );


        if(!card)
          return;



        const mcq =
          card.querySelector(
            ".mcq-options-wrapper"
          );


        const essay =
          card.querySelector(
            ".essay-space-wrapper"
          );



        if(
          e.target.value === "essay"
        ){

          if(mcq)
            mcq.style.display =
              "none";


          if(essay)
            essay.style.display =
              "block";


        }else{


          if(mcq)
            mcq.style.display =
              "block";


          if(essay)
            essay.style.display =
              "none";

        }

      }






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


            if(!card)
              return;



            const hidden =
              card.querySelector(
                ".q-image"
              );


            if(hidden)
              hidden.value =
                event.target.result;



            const preview =
              card.querySelector(
                ".image-preview-container"
              );



            if(preview){

              preview.style.display =
                "block";


              const img =
                preview.querySelector(
                  "img"
                );


              if(img)
                img.src =
                  event.target.result;

            }

          };



        reader.readAsDataURL(file);

      }


    }
  );


}
async function saveExam(){

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
    ?.value
    ||
    "physics";





  const className =
    document
    .querySelector("#examClass")
    ?.value
    ||
    "الصف الأول الثانوي";





  const duration =
    Number(
      document
      .querySelector("#examDuration")
      ?.value
    )
    ||
    60;





  const passingScore =
    Number(
      document
      .querySelector("#examPassingScore")
      ?.value
    )
    ||
    50;





  const startDate =
    document
    .querySelector("#examStartDate")
    ?.value
    ||
    "";





  const endDate =
    document
    .querySelector("#examEndDate")
    ?.value
    ||
    "";





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
  cards.map(
    (card)=>{


      const type =
        card.querySelector(
          ".q-type-select"
        )
        ?.value
        ||
        "mcq";



      const text =
        card.querySelector(
          ".q-text"
        )
        ?.value
        .trim()
        ||
        "";



      const score =
        Number(
          card.querySelector(
            ".q-score"
          )
          ?.value
        )
        ||
        1;




      const image =
        card.querySelector(
          ".q-image"
        )
        ?.value
        ||
        "";





      let options = [];

      let correctAnswerIndex = 0;





      if(type === "mcq"){


        options =
        [
          ...card.querySelectorAll(
            ".opt-text"
          )
        ]
        .map(
          input =>
          input.value.trim()
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

        question:
          text,

        text,

        type,

        score,


        image,

        questionImage:
          image,


        options,


        correctAnswerIndex,


        correctIndex:
          correctAnswerIndex,


        answer:
          correctAnswerIndex

      };


    }
  );







  const examData = {


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



    isPublished:
      true,



    questions


  };







  try{


    if(editingExam){


      await updateExam(
        editingExam.firestoreId,
        examData
      );


    }else{


      await addExam(
        examData
      );


    }





    alert(
      "✅ تم حفظ الامتحان بنجاح"
    );



    editingExam = null;



    document.querySelector("#app")
      .innerHTML =
      examsListPage();





  }catch(error){


    console.error(
      error
    );


    alert(
      "❌ حدث خطأ أثناء الحفظ"
    );


  }


}







function createQuestionTemplate(index){


return `

<div class="question-card">


<textarea
class="q-text"
placeholder="اكتب السؤال"
></textarea>



<input
type="file"
accept="image/*"
class="q-file-input"
/>



<input
type="hidden"
class="q-image"
/>



<div class="image-preview-container"
style="display:none">

<img
style="max-width:200px"
/>

</div>





<div>

<input
type="radio"
class="q-correct-radio"
name="correct_${index}"
value="0"
checked
>

<input
class="opt-text"
placeholder="A"
/>


</div>



<div>

<input
type="radio"
class="q-correct-radio"
name="correct_${index}"
value="1"
>

<input
class="opt-text"
placeholder="B"
/>


</div>




<div>

<input
type="radio"
class="q-correct-radio"
name="correct_${index}"
value="2"
>

<input
class="opt-text"
placeholder="C"
/>


</div>




<div>

<input
type="radio"
class="q-correct-radio"
name="correct_${index}"
value="3"
>

<input
class="opt-text"
placeholder="D"
/>


</div>





<input
type="number"
class="q-score"
value="1"
/>




<button
class="removeQuestion"
>
🗑 حذف السؤال
</button>



</div>


`;

}