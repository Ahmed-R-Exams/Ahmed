import {
  getExamById,
  saveExams
} from "../services/examService.js";

import {
  manageExamsPage
} from "./manageExams.js";

import {
  manageExamsEvents
} from "./manageExamsEvents.js";


let editEventsInitialized = false;



export function editExamEvents(examId){


  if(editEventsInitialized)
    return;


  editEventsInitialized = true;



  document.addEventListener(
    "click",
    (e)=>{



      // حفظ التعديلات

      if(
        e.target.closest("#saveExamEdit")
      ){


        const exam =
          getExamById(
            Number(examId)
          );



        if(!exam)
          return;



        const titleInput =
          document.getElementById(
            "editExamTitle"
          );



        if(titleInput){

          exam.title =
            titleInput.value.trim();

        }



        const questionCards =
          document.querySelectorAll(
            ".edit-question-card"
          );



        questionCards.forEach(
          (card,index)=>{


            if(!exam.questions[index])
              return;



            const qText =
              card.querySelector(
                ".editQText"
              )
              ?.value
              .trim();



            if(qText){

              exam.questions[index].question =
                qText;


              exam.questions[index].text =
                qText;

            }



            const image =
              card.querySelector(
                ".editImage"
              )
              ?.value
              .trim();



            if(image){

              exam.questions[index].image =
                image;


              exam.questions[index].questionImage =
                image;

            }



            const optInputs =
              card.querySelectorAll(
                ".editOptText"
              );



            if(!Array.isArray(
              exam.questions[index].options
            )){

              exam.questions[index].options =
                [];

            }



            optInputs.forEach(
              (input,optIndex)=>{

                exam.questions[index]
                .options[optIndex] =
                  input.value.trim();

              }
            );
            const correctSelect =
            card.querySelector(
              ".editCorrectSelect"
            );



          if(correctSelect){


            const selectedIndex =
              Number(
                correctSelect.value
              );



            exam.questions[index]
            .correctIndex =
              selectedIndex;



            exam.questions[index]
            .correctAnswerIndex =
              selectedIndex;



            exam.questions[index]
            .answer =
              selectedIndex;



          }



        }
      );



      saveExams();



      alert(
        "✅ تم حفظ التعديلات"
      );



      const app =
        document.querySelector(
          "#app"
        );



      if(app){

        app.innerHTML =
          manageExamsPage();


        manageExamsEvents();

      }



      return;


    }





    // حذف سؤال

    if(
      e.target.closest(
        ".deleteQuestion"
      )
    ){



      const index =
        Number(
          e.target
          .closest(
            ".deleteQuestion"
          )
          .dataset
          .index
        );



      const exam =
        getExamById(
          Number(examId)
        );



      if(
        exam &&
        exam.questions[index]
      ){


        exam.questions.splice(
          index,
          1
        );


        saveExams();


        location.reload();

      }



      return;


    }






    // نسخ سؤال

    if(
      e.target.closest(
        ".duplicateQuestion"
      )
    ){


      const index =
        Number(
          e.target
          .closest(
            ".duplicateQuestion"
          )
          .dataset
          .index
        );



      const exam =
        getExamById(
          Number(examId)
        );



      if(
        exam &&
        exam.questions[index]
      ){


        const copy =
          JSON.parse(
            JSON.stringify(
              exam.questions[index]
            )
          );



        exam.questions.splice(
          index + 1,
          0,
          copy
        );



        saveExams();


        location.reload();


      }



      return;


    }
          // إضافة صورة للسؤال

          if(
            e.target.classList.contains(
              "editImageFile"
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
    
    
                const index =
                  Number(
                    e.target.dataset.index
                  );
    
    
    
                const card =
                  e.target.closest(
                    ".edit-question-card"
                  );
    
    
    
                const hidden =
                  card.querySelector(
                    ".editImage"
                  );
    
    
    
                if(hidden){
    
                  hidden.value =
                    event.target.result;
    
                }
    
    
    
                const oldImg =
                  card.querySelector(
                    ".question-image"
                  );
    
    
    
                if(oldImg){
    
                  oldImg.src =
                    event.target.result;
    
                }else{
    
    
                  const img =
                    document.createElement(
                      "img"
                    );
    
    
                  img.src =
                    event.target.result;
    
    
                  img.className =
                    "question-image";
    
    
                  img.style.maxWidth =
                    "250px";
    
    
                  img.style.marginTop =
                    "15px";
    
    
                  img.style.borderRadius =
                    "10px";
    
    
    
                  card.appendChild(img);
    
                }
    
    
    
              };
    
    
    
            reader.readAsDataURL(file);
    
    
          }
    
    
    
          // رجوع للإدارة
    
          if(
            e.target.closest(
              "#backToManageExams"
            )
          ){
    
    
            const app =
              document.querySelector(
                "#app"
              );
    
    
    
            if(app){
    
              app.innerHTML =
                manageExamsPage();
    
    
              manageExamsEvents();
    
            }
    
    
            return;
    
          }
    
    
    
        }
      );
    
    }