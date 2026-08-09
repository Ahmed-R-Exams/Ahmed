import {
  readExcelFile,
  convertExcelData
} from "../services/excelService.js";

import {
  createExamFromExcel
} from "../services/examService.js";

import {
  manageExamsPage
} from "./manageExams.js";

import {
  manageExamsEvents
} from "./manageExamsEvents.js";


// ================= IMPORT EXCEL =================

export function importExamEvents() {

  const input =
    document.getElementById("excelFile");

  if (!input) {
    console.error(
      "Excel input #excelFile not found"
    );
    return;
  }


  input.onchange = async () => {

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }


    try {

      // ============================================
      // READ EXCEL
      // ============================================

      const rawData =
        await readExcelFile(file);




      // ============================================
      // CONVERT EXCEL
      // ============================================

      const excelData =
        convertExcelData(rawData);




      // ============================================
      // CHECK QUESTIONS
      // ============================================

      if (
        !excelData ||
        !Array.isArray(
          excelData.questions
        ) ||
        !excelData.questions.length
      ) {

        alert(
          "No Questions Found In Excel ❌"
        );

        return;
      }


      // ============================================
      // USE FILE NAME IF TITLE IS EMPTY
      // ============================================

      if (
        !excelData.exam.title
      ) {

        excelData.exam.title =
          file.name.replace(
            /\.(xlsx|xls)$/i,
            ""
          );

      }


      // ============================================
      // CREATE ONE EXAM
      // ============================================

      const savedExam =
        await createExamFromExcel(
          excelData
        );




      // ============================================
      // SUCCESS
      // ============================================

      alert(
        `تم استيراد الامتحان بنجاح ✅\n\n` +
        `الامتحان: ${savedExam.title}\n` +
        `عدد الأسئلة: ${savedExam.questions.length}`
      );


      // ============================================
      // REFRESH MANAGE EXAMS
      // ============================================

      const app =
        document.querySelector(
          "#app"
        );


      if (app) {

        app.innerHTML =
          manageExamsPage();

        manageExamsEvents();

      }


      // Reset input
      input.value = "";

    }

    catch (error) {

      console.error(
        "Excel Import Error:",
        error
      );


      alert(
        "Excel Import Error ❌\n\n" +
        (
          error?.message ||
          "حدث خطأ أثناء استيراد الملف"
        )
      );

    }

  };

}