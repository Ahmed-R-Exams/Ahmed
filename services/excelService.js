// services/excelService.js

import * as XLSX from "xlsx";


// ================= READ EXCEL FILE =================

export function readExcelFile(file){

  return new Promise((resolve,reject)=>{


    const reader = new FileReader();


    reader.onload = (e)=>{


      try{


        const data =
        new Uint8Array(
          e.target.result
        );


        const workbook =
        XLSX.read(
          data,
          {
            type:"array"
          }
        );


        const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];


        const rows =
        XLSX.utils.sheet_to_json(
          sheet,
          {
            defval:""
          }
        );


        resolve(rows);


      }
      catch(error){

        reject(error);

      }


    };


    reader.onerror =
    reject;


    reader.readAsArrayBuffer(file);


  });

}



// ================= CONVERT TO QUESTIONS =================

export function convertExcelQuestions(rows){


  return rows

  .filter(
    row =>
    row.Question ||
    row.question
  )


  .map((row,index)=>{


    const options = [

      row.A || row.a || "",

      row.B || row.b || "",

      row.C || row.c || "",

      row.D || row.d || ""

    ];



    let answer =

    String(
      row.Answer ||
      row.answer ||
      "A"
    )
    .trim()
    .toUpperCase();



    let correctIndex = 0;



    if(
      ["A","B","C","D"]
      .includes(answer)
    ){

      correctIndex =
      answer.charCodeAt(0)-65;

    }

    else{


      const found =
      options.indexOf(answer);


      if(found >= 0){

        correctIndex =
        found;

      }

    }



    return {


      id:
      Date.now()+index,


      text:
      row.Question ||
      row.question ||
      "",



      title:
      row.Question ||
      row.question ||
      "",



      image:
      row.Image ||
      row.image ||
      "",



      options,



      correctAnswerIndex:
      correctIndex,



      correctIndex,



      answer:
      options[correctIndex] || "",



      type:
      "mcq"


    };


  });


}