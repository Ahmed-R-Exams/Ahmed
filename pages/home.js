export function homePage(){
  return `
  <style>
    .lp{ background:#080B14; font-family:'Tajawal','Cairo',sans-serif; direction:rtl; color:#F3EFE4; overflow-x:hidden; }
    .lp *{ box-sizing:border-box; }
    .lp-wrap{ max-width:1120px; margin:0 auto; padding:0 24px; }

    /* NAV */
    .lp-nav{ position:sticky; top:0; z-index:50; background:rgba(8,11,20,0.85); backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.06); }
    .lp-nav-inner{ display:flex; align-items:center; justify-content:space-between; padding:16px 24px; max-width:1120px; margin:0 auto; }
    .lp-logo{ display:flex; align-items:center; gap:10px; font-weight:900; font-size:1.2rem; }
    .lp-logo-mark{ width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#5EA4FF,#FF8F54); display:flex; align-items:center; justify-content:center; color:#080B14; font-weight:900; }
    .lp-nav-btn{ background:#5EA4FF; color:#080B14; padding:10px 22px; border-radius:10px; font-weight:800; font-size:0.92rem; cursor:pointer; border:none; font-family:inherit; }

    /* HERO */
    .lp-hero{ position:relative; padding:90px 0 70px; text-align:center; background:
      radial-gradient(circle at 20% 10%, rgba(94,164,255,0.14), transparent 45%),
      radial-gradient(circle at 85% 30%, rgba(255,143,84,0.10), transparent 45%); }
    .lp-eyebrow{ display:inline-flex; align-items:center; gap:8px; background:rgba(94,164,255,0.12); color:#79B8FF; border:1px solid rgba(94,164,255,0.3); padding:7px 16px; border-radius:999px; font-size:0.85rem; font-weight:700; margin-bottom:22px; }
    .lp-hero h1{ font-size:clamp(2rem,5vw,3.2rem); font-weight:900; line-height:1.3; max-width:780px; margin:0 auto 20px; }
    .lp-hero h1 span{ background:linear-gradient(90deg,#5EA4FF,#79B8FF); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .lp-hero p{ color:#B3BDD1; font-size:1.1rem; max-width:560px; margin:0 auto 34px; font-weight:400; }
    .lp-hero-actions{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
    .lp-btn-primary{ background:#5EA4FF; color:#080B14; padding:16px 34px; border-radius:12px; font-weight:800; font-size:1rem; border:none; cursor:pointer; font-family:inherit; transition:transform .2s; }
    .lp-btn-primary:hover{ transform:translateY(-3px); }
    .lp-btn-ghost{ background:transparent; color:#F3EFE4; padding:16px 30px; border-radius:12px; font-weight:700; font-size:1rem; border:1.5px solid rgba(255,255,255,0.2); cursor:pointer; font-family:inherit; transition:border-color .2s; }
    .lp-btn-ghost:hover{ border-color:#F3EFE4; }

    /* STATS */
    .lp-stats{ border-top:1px solid rgba(255,255,255,0.07); border-bottom:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.015); }
    .lp-stats-grid{ display:grid; grid-template-columns:repeat(3,1fr); padding:36px 0; text-align:center; }
    .lp-stat b{ display:block; font-size:2rem; font-weight:900; color:#79B8FF; }
    .lp-stat span{ font-size:0.85rem; color:#8A96AD; }

    /* SECTION */
    .lp-section{ padding:90px 0; }
    .lp-section-head{ text-align:center; max-width:600px; margin:0 auto 50px; }
    .lp-section-head h2{ font-size:2rem; font-weight:900; margin:14px 0 0; }

    /* FEATURES */
    .lp-features{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
    .lp-feature{ background:#111A2C; border:1px solid rgba(94,164,255,0.18); border-radius:18px; padding:32px 26px; }
    .lp-feature .ico{ width:46px; height:46px; border-radius:12px; background:rgba(94,164,255,0.14); color:#5EA4FF; display:flex; align-items:center; justify-content:center; font-size:1.3rem; margin-bottom:20px; }
    .lp-feature h3{ font-size:1.1rem; margin:0 0 8px; }
    .lp-feature p{ color:#8A96AD; font-size:0.92rem; margin:0; line-height:1.7; }

    /* ROADMAP */
    .lp-road{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .lp-step{ background:#111A2C; border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:26px 22px; position:relative; }
    .lp-step .n{ font-size:0.8rem; font-weight:900; color:#FF8F54; background:rgba(255,143,84,0.14); width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
    .lp-step h4{ font-size:1rem; margin:0 0 8px; }
    .lp-step p{ color:#8A96AD; font-size:0.88rem; margin:0; line-height:1.7; }

    /* LOGIN */
    .lp-login{ background:linear-gradient(135deg,#111A2C,#0D1420); border:1px solid rgba(94,164,255,0.2); border-radius:26px; padding:56px 40px; text-align:center; }
    .lp-login h2{ font-size:1.7rem; font-weight:900; margin:0 0 10px; }
    .lp-login p{ color:#8A96AD; margin:0 0 34px; }
    .lp-roles{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; max-width:520px; margin:0 auto; }
    .lp-role-btn{ flex:1; min-width:220px; font-family:inherit; cursor:pointer; border-radius:16px; padding:24px 20px; display:flex; flex-direction:column; align-items:center; gap:10px; transition:transform .2s, border-color .2s; text-align:center; }
    .lp-role-btn:hover{ transform:translateY(-4px); }
    #studentLogin{ background:#131E33; border:1.5px solid rgba(94,164,255,0.4); color:#fff; }
    #studentLogin:hover{ border-color:#5EA4FF; }
    #teacherLogin{ background:#161B26; border:1.5px solid rgba(255,143,84,0.35); color:#fff; }
    #teacherLogin:hover{ border-color:#FF8F54; }
    .lp-role-btn strong{ font-size:1rem; }
    .lp-role-btn span{ font-size:0.8rem; color:#8A96AD; }

    /* FOOTER */
    .lp-footer{ border-top:1px solid rgba(255,255,255,0.07); padding:34px 0; text-align:center; color:#5C6B85; font-size:0.85rem; }

    @media (max-width:860px){
      .lp-features, .lp-road{ grid-template-columns:1fr 1fr; }
      .lp-stats-grid{ grid-template-columns:1fr; gap:20px; }
    }
    @media (max-width:560px){
      .lp-features, .lp-road{ grid-template-columns:1fr; }
      .lp-nav-inner .lp-nav-btn{ display:none; }
    }
  </style>

  <div class="lp">

    <nav class="lp-nav">
      <div class="lp-nav-inner">
        <div class="lp-logo"><span class="lp-logo-mark">أ</span> منصة أ. أحمد رضا</div>
        <button class="lp-nav-btn" id="teacherLogin">دخول المعلم</button>
      </div>
    </nav>

    <section class="lp-hero">
      <div class="lp-wrap">
        <div class="lp-eyebrow">🧪 فيزياء وكيمياء الثانوية العامة</div>
        <h1>معاك خطوة بخطوة لحد ما <span>تقفل المادة</span></h1>
        <p>شرح مبسط، امتحانات زي الثانوية بالظبط، ومتابعة درجاتك أول بأول. الفيزياء والكيمياء في أمان معانا.</p>
        <div class="lp-hero-actions">
          <button class="lp-btn-primary" id="startBtn">ابدأ رحلتك دلوقتي</button>
          <button class="lp-btn-ghost" onclick="document.querySelector('.lp-login').scrollIntoView({behavior:'smooth'})">تسجيل الدخول</button>
        </div>
      </div>
    </section>

    <div class="lp-stats">
      <div class="lp-wrap lp-stats-grid">
      </div>
    </div>

    <section class="lp-section">
      <div class="lp-wrap">
        <div class="lp-section-head">
          <h2>إزاي تستفيد من المنصة </h2>
        </div>
        <div class="lp-features">
          <div class="lp-feature">
            <div class="ico">🎬</div>
            <h3>سبورات الشرح</h3>
            <p>متجمعة  فى الفيزياء والكيمياء .</p>
          </div>
          <div class="lp-feature">
            <div class="ico">📄</div>
            <h3>ملازم وبنك أسئلة</h3>
            <p>ملازم منظمة وبنك أسئلة شامل بنفس أسلوب امتحانات الثانوية العامة.</p>
          </div>
          <div class="lp-feature">
            <div class="ico">📊</div>
            <h3>امتحانات دورية ودرجات فورية</h3>
            <p>امتحانات إلكترونية للتدريب على نظام الامتحانات النهائية.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="lp-section" style="background:rgba(255,255,255,0.015); padding-top:80px; padding-bottom:80px;">
      <div class="lp-wrap">
        <div class="lp-section-head">
          <div class="lp-eyebrow">رحلتك معانا</div>
          <h2>خطوات وصولك للدرجة النهائية</h2>
        </div>
        <div class="lp-road">
          <div class="lp-step"><div class="n">01</div><h4>استعن بالله</h4><p> ولاتعجز فان الجزاء من جنس العمل.</p></div>
          <div class="lp-step"><div class="n">02</div><h4>تابع الشرح</h4><p>شوف سبورات الفيزياء والكيمياء متجمعة فى مكان واحد.</p></div>
          <div class="lp-step"><div class="n">03</div><h4>اختبر نفسك</h4><p>امتحانات دورىة لقياس مدى فهمك.</p></div>
          <div class="lp-step"><div class="n">04</div><h4>قفّل المادة</h4><p>بالمتابعة المستمرة هتوصل لأعلى درجة.</p></div>
        </div>
      </div>
    </section>

    <section class="lp-section" style="padding-top:20px;">
      <div class="lp-wrap">
        <div class="lp-login">
          <h2>ادخل عالم الفيزياء والكيمياء</h2>
          <p>اختر حسابك للمتابعة</p>
          <div class="lp-roles">
            <button id="studentLogin" class="lp-role-btn">
              <strong>🎓 دخول الطلاب</strong>
              <span>الامتحانات ومتابعة الدرجات</span>
            </button>
            <button id="teacherLoginCard" class="lp-role-btn" onclick="document.getElementById('teacherLogin').click()">
              <strong>⚙️ لوحة المعلم</strong>
              <span>إدارة الأسئلة والنتائج</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <footer class="lp-footer">
      منصة أ. أحمد رضا للفيزياء والكيمياء © ٢٠٢٦ — جميع الحقوق محفوظة
    </footer>

  </div>
  `;
}