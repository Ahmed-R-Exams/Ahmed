// services/excelService.js

import * as XLSX from "xlsx";


// ======================================================
// HELPERS
// ======================================================

function getValue(row, names = []) {

  for (const name of names) {

    if (
      row &&
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {

      return row[name];

    }

  }

  return "";

}


function toBoolean(value, defaultValue = true) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {

    return defaultValue;

  }


  const text =
    String(value)
      .trim()
      .toLowerCase();


  if (
    [
      "true",
      "1",
      "yes",
      "published",
      "نعم",
      "منشور"
    ].includes(text)
  ) {

    return true;

  }


  if (
    [
      "false",
      "0",
      "no",
      "unpublished",
      "لا",
      "غير منشور"
    ].includes(text)
  ) {

    return false;

  }


  return defaultValue;

}


// ======================================================
// READ EXCEL FILE
// ======================================================

export function readExcelFile(file) {

  return new Promise(
    (resolve, reject) => {

      if (!file) {

        reject(
          new Error(
            "لم يتم اختيار ملف Excel."
          )
        );

        return;

      }


      const reader =
        new FileReader();


      reader.onload = event => {

        try {

          const data =
            new Uint8Array(
              event.target.result
            );


          const workbook =
            XLSX.read(
              data,
              {
                type: "array"
              }
            );


          if (
            !workbook.SheetNames.length
          ) {

            throw new Error(
              "ملف Excel لا يحتوي على Sheets."
            );

          }


          // ==================================================
          // QUESTIONS SHEET
          // ==================================================

          const questionsSheetName =
            workbook.SheetNames.find(
              name =>
                String(name)
                  .trim()
                  .toLowerCase() ===
                "questions"
            );


          // ==================================================
          // EXAM SHEET
          // ==================================================

          const examSheetName =
            workbook.SheetNames.find(
              name =>
                String(name)
                  .trim()
                  .toLowerCase() ===
                "exam"
            );


          // ==================================================
          // FALLBACK:
          // first sheet = questions
          // ==================================================

          const questionsSheet =
            questionsSheetName
              ? workbook.Sheets[
                  questionsSheetName
                ]
              : workbook.Sheets[
                  workbook.SheetNames[0]
                ];


          const questionRows =
            XLSX.utils.sheet_to_json(
              questionsSheet,
              {
                defval: ""
              }
            );


          // ==================================================
          // EXAM DATA
          // ==================================================

          let examRows = [];


          if (examSheetName) {

            examRows =
              XLSX.utils.sheet_to_json(
                workbook.Sheets[
                  examSheetName
                ],
                {
                  defval: ""
                }
              );

          }


          resolve({

            questions:
              questionRows,

            exam:
              examRows[0] || {},

            sheetNames:
              workbook.SheetNames

          });

        }

        catch (error) {

          reject(error);

        }

      };


      reader.onerror =
        () =>
          reject(
            new Error(
              "فشل قراءة ملف Excel."
            )
          );


      reader.readAsArrayBuffer(
        file
      );

    }
  );

}


// ======================================================
// CONVERT QUESTIONS
// ======================================================

export function convertExcelQuestions(
  rows
) {

  if (!Array.isArray(rows)) {

    return [];

  }


  return rows

    .filter(
      row =>
        getValue(
          row,
          [
            "Question",
            "question",
            "السؤال"
          ]
        )
    )

    .map(
      (row, index) => {

        const text =
          String(
            getValue(
              row,
              [
                "Question",
                "question",
                "السؤال"
              ]
            )
          ).trim();


        const options = [

          getValue(
            row,
            ["A", "a", "اختيار A"]
          ),

          getValue(
            row,
            ["B", "b", "اختيار B"]
          ),

          getValue(
            row,
            ["C", "c", "اختيار C"]
          ),

          getValue(
            row,
            ["D", "d", "اختيار D"]
          )

        ].map(
          value =>
            String(value).trim()
        );


        let answer =
          String(
            getValue(
              row,
              [
                "Answer",
                "answer",
                "الإجابة"
              ]
            )
          )
            .trim()
            .toUpperCase();


        let correctIndex = 0;


        // -----------------------------------------------
        // Answer = A/B/C/D
        // -----------------------------------------------

        if (
          ["A", "B", "C", "D"]
            .includes(answer)
        ) {

          correctIndex =
            answer.charCodeAt(0) -
            65;

        }


        // -----------------------------------------------
        // Answer = actual option text
        // -----------------------------------------------

        else {

          const found =
            options.findIndex(
              option =>
                String(option)
                  .trim()
                  .toUpperCase() ===
                answer
            );


          if (found >= 0) {

            correctIndex =
              found;

          }

        }


        const image =
          String(
            getValue(
              row,
              [
                "Image",
                "image",
                "QuestionImage",
                "questionImage",
                "صورة"
              ]
            )
          ).trim();


        const points =
          Number(
            getValue(
              row,
              [
                "Points",
                "points",
                "الدرجة"
              ]
            )
          ) || 1;


        return {

          id:
            getValue(
              row,
              [
                "id",
                "ID"
              ]
            ) ||
            `${Date.now()}-${index}`,

          text,

          title:
            text,

          image,

          questionImage:
            image,

          options,

          correctAnswerIndex:
            correctIndex,

          correctIndex,

          answer:
            options[correctIndex] ||
            "",

          type:
            "mcq",

          points

        };

      }
    );

}


// ======================================================
// CONVERT COMPLETE EXCEL FILE
// ======================================================

export function convertExcelData(
  data
) {

  if (!data) {

    return {
      exam: {},
      questions: []
    };

  }


  // ----------------------------------------------------
  // New readExcelFile result
  // ----------------------------------------------------

  if (
    !Array.isArray(data) &&
    typeof data === "object" &&
    Array.isArray(data.questions)
  ) {

    return {

      exam:
        normalizeExamData(
          data.exam || {}
        ),

      questions:
        convertExcelQuestions(
          data.questions
        )

    };

  }


  // ----------------------------------------------------
  // Backward compatibility
  // ----------------------------------------------------

  if (Array.isArray(data)) {

    return {

      exam: {},

      questions:
        convertExcelQuestions(
          data
        )

    };

  }


  return {

    exam: {},

    questions: []

  };

}


// ======================================================
// NORMALIZE EXAM SHEET
// ======================================================

function normalizeExamData(row = {}) {

  return {

    id:
      getValue(
        row,
        [
          "examId",
          "ExamId",
          "examID",
          "id",
          "ID"
        ]
      ),

    title:
      getValue(
        row,
        [
          "title",
          "Title",
          "examTitle",
          "ExamTitle",
          "اسم الامتحان"
        ]
      ),

    subject:
      getValue(
        row,
        [
          "subject",
          "Subject",
          "المادة"
        ]
      ) ||
      "physics",

    className:
      getValue(
        row,
        [
          "className",
          "ClassName",
          "grade",
          "Grade",
          "الصف"
        ]
      ) ||
      "الصف الأول الثانوي",

    grade:
      getValue(
        row,
        [
          "grade",
          "Grade",
          "className",
          "ClassName",
          "الصف"
        ]
      ) ||
      "الصف الأول الثانوي",

    duration:
      Number(
        getValue(
          row,
          [
            "duration",
            "Duration",
            "time",
            "Time",
            "المدة"
          ]
        )
      ) || 60,

    passingScore:
      Number(
        getValue(
          row,
          [
            "passingScore",
            "PassingScore",
            "passScore",
            "درجة النجاح"
          ]
        )
      ) || 50,

    startDate:
      getValue(
        row,
        [
          "startDate",
          "StartDate",
          "تاريخ البداية"
        ]
      ),

    endDate:
      getValue(
        row,
        [
          "endDate",
          "EndDate",
          "تاريخ النهاية"
        ]
      ),

    isPublished:
      toBoolean(
        getValue(
          row,
          [
            "isPublished",
            "IsPublished",
            "published",
            "Published",
            "منشور"
          ]
        ),
        true
      ),

    manualClose:
      toBoolean(
        getValue(
          row,
          [
            "manualClose",
            "ManualClose"
          ]
        ),
        false
      )

  };

}