import {
  getFiles,
  addFile,
  deleteFile
} from "../services/fileService.js";


let filesEventsInitialized = false;



export async function manageFilesPage() {


const files =
await getFiles();



return `


<div class="card">

<label>
اسم المحتوى
</label>

<input
id="fileName"
placeholder="مثال: الوحدة الأولى - الحركة"
/>



<label>
المادة
</label>

<select id="fileSubject">

<option value="physics">
فيزياء
</option>

<option value="chemistry">
كيمياء
</option>

</select>



<label>
الصف
</label>

<select id="fileClass">

<option value="grade2">
الثاني الثانوي
</option>

<option value="grade3">
الثالث الثانوي
</option>

</select>



<label>
نوع المحتوى
</label>

<select id="fileType">

<option value="board">
📚 سبورة
</option>

<option value="file">
📂 ملف PDF
</option>

</select>



<label>
اختيار الملف
</label>

<input
type="file"
id="uploadFile"
/>



<button id="saveFile">

💾 حفظ ونشر

</button>


</div>



<h2>
المحتويات المضافة
</h2>



<div class="cards">


${
files.length

?

files.map(file=>`

<div class="menu-card">


<h3>
${file.name || "ملف"}
</h3>


<p>
المادة:
${file.subject==="chemistry" ? "كيمياء" : "فيزياء"}
</p>


<p>
الصف:
${file.className || ""}
</p>


<p>
النوع:
${file.type==="board" ? "📚 سبورة" : "📂 ملف"}
</p>



<a
href="${file.url}"
target="_blank"
>

⬇ فتح الملف

</a>



<br>


<button
class="deleteFile"
data-id="${file.firestoreId || file.id}"
>

🗑 حذف

</button>


</div>

`).join("")

:

`

<div class="menu-card">

<h3>
لا توجد ملفات
</h3>

</div>

`

}


</div>



<button id="backAdmin">

⬅ رجوع

</button>


`;

}








export function manageFilesEvents(){


if(filesEventsInitialized)
return;


filesEventsInitialized = true;



document.addEventListener(
"click",
async(e)=>{



const save =
e.target.closest("#saveFile");



if(save){



const input =
document.getElementById("uploadFile");



if(
!input ||
!input.files[0]
){

alert(
"الرجاء اختيار ملف أولاً"
);

return;

}



const file =
input.files[0];



const data = {


name:

document.getElementById(
"fileName"
)
.value
.trim()
||
file.name,


subject:

document.getElementById(
"fileSubject"
)
.value,


className:

document.getElementById(
"fileClass"
)
.value,


type:

document.getElementById(
"fileType"
)
.value


};




try{


save.disabled = true;


save.innerHTML =
"⏳ جاري الرفع...";



await addFile(
data,
file
);



alert(
"✅ تم رفع الملف بنجاح"
);



document.querySelector("#app")
.innerHTML =
await manageFilesPage();



}

catch(err){


console.error(
"UPLOAD ERROR:",
err
);



alert(
err.message
);


}



return;


}






const del =
e.target.closest(".deleteFile");



if(del){


try{


await deleteFile({

id:
del.dataset.id

});



document.querySelector("#app")
.innerHTML =
await manageFilesPage();



}

catch(err){


console.error(
"DELETE ERROR:",
err
);


}



}



});


}