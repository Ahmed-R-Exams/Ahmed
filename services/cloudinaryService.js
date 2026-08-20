// services/cloudinaryService.js

// =====================================================
// CLOUDINARY CONFIG
// =====================================================

const CLOUD_NAME = "l9r2r2a8";

const UPLOAD_PRESET = "ahmed_exam_images";


// =====================================================
// UPLOAD IMAGE
// =====================================================

export async function uploadQuestionImage(
  file,
  examId,
  questionId,
  questionIndex = 0
) {

  if (!file) {

    throw new Error(
      "لم يتم اختيار صورة."
    );

  }


  if (
    !file.type ||
    !file.type.startsWith("image/")
  ) {

    throw new Error(
      "الملف المختار ليس صورة."
    );

  }


  const safeExamId =
    String(
      examId || "exam"
    )
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );


  const safeQuestionId =
    String(
      questionId ||
      `question-${questionIndex}`
    )
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );


  const timestamp =
    Date.now();


  const publicId =
    `question_${safeQuestionId}_${timestamp}`;


  const folder =
    `ahmed-r-exams/${safeExamId}`;


  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  formData.append(
    "upload_preset",
    UPLOAD_PRESET
  );


  formData.append(
    "folder",
    folder
  );


  formData.append(
    "public_id",
    publicId
  );


  const uploadURL =
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;


  const response =
    await fetch(
      uploadURL,
      {
        method: "POST",
        body: formData
      }
    );


  let data = null;


  try {

    data =
      await response.json();

  } catch {

    data = null;

  }


  if (!response.ok) {

    console.error(
      "CLOUDINARY UPLOAD ERROR:",
      data
    );


    throw new Error(
      data?.error?.message ||
      "فشل رفع الصورة إلى Cloudinary."
    );

  }


  if (!data?.secure_url) {

    console.error(
      "CLOUDINARY INVALID RESPONSE:",
      data
    );


    throw new Error(
      "تم رفع الصورة ولكن لم يتم الحصول على رابط الصورة."
    );

  }


  return data.secure_url;
}