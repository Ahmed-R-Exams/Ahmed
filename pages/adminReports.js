export function adminReportsPage() {

    const results =
      JSON.parse(localStorage.getItem("examResults") || "[]");
  
  
    return `
    <div style="
      min-height:100vh;
      background:#0f172a;
      color:#fff;
      padding:40px 20px;
      direction:rtl;
      font-family:'Cairo',sans-serif;
    ">
  
      <div style="
        max-width:1000px;
        margin:auto;
      ">
  
        <div style="
          background:rgba(30,41,59,.85);
          padding:30px;
          border-radius:25px;
          border:1px solid rgba(255,255,255,.1);
          margin-bottom:25px;
        ">
  
          <h1 style="
            margin:0 0 15px;
            font-size:26px;
          ">
          📊 تقارير الطلاب
          </h1>
  
  
          <input 
            id="studentReportSearch"
            placeholder="ابحث باسم الطالب..."
            style="
            width:100%;
            padding:15px;
            border-radius:12px;
            background:#0f172a;
            color:#fff;
            border:1px solid rgba(255,255,255,.15);
            font-size:16px;
            "
          >
  
        </div>
  
  
        <div id="reportsContainer">
  
          ${
            results.length === 0
  
            ?
  
            `
            <div style="
            text-align:center;
            padding:40px;
            background:rgba(30,41,59,.6);
            border-radius:20px;
            color:#94a3b8;
            ">
            لا توجد نتائج امتحانات حتى الآن
            </div>
            `
  
            :
  
            results.map(r=>`
  
            <div class="report-card"
            data-name="${r.studentName}"
            style="
            background:rgba(30,41,59,.8);
            padding:20px;
            border-radius:18px;
            margin-bottom:15px;
            border:1px solid rgba(255,255,255,.08);
            ">
  
  
            <h3 style="
            margin:0 0 10px;
            color:#818cf8;
            ">
            ${r.studentName}
            </h3>
  
  
            <p>
            📝 الامتحان:
            <b>${r.examTitle}</b>
            </p>
  
  
            <p>
            📚 المادة:
            <b>${r.subject || "غير محدد"}</b>
            </p>
  
  
            <p>
            🎓 الصف:
            <b>${r.className || "غير محدد"}</b>
            </p>
  
  
            <p>
            ⭐ الدرجة:
            <b>${r.score}/${r.total}</b>
            </p>
  
  
            <p style="color:#94a3b8">
            📅 ${r.date}
            </p>
  
  
            </div>
  
  
            `).join("")
  
          }
  
        </div>
  
  
      </div>
  
    </div>
    `;
  }
  
  
  
  document.addEventListener("input",(e)=>{
  
    if(e.target.id==="studentReportSearch"){
  
      const value =
      e.target.value.trim();
  
  
      document
      .querySelectorAll(".report-card")
      .forEach(card=>{
  
        const name =
        card.dataset.name;
  
  
        if(
          name.includes(value)
        ){
          card.style.display="block";
        }
        else{
          card.style.display="none";
        }
  
      });
  
    }
  
  });