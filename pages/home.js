export function homePage(){
  return `
  <style>
    .lp{ background:#0B1614; font-family:'Tajawal','Cairo',sans-serif; direction:rtl; color:#E8F0EE; overflow-x:hidden; }
    .lp *{ box-sizing:border-box; }
    .lp-wrap{ max-width:1120px; margin:0 auto; padding:0 24px; }

    /* NAV */
    .lp-nav{ position:sticky; top:0; z-index:50; background:rgba(11,22,20,0.92); backdrop-filter:blur(10px); border-bottom:2px dashed rgba(232,240,238,0.18); }
    .lp-nav-inner{ display:flex; align-items:center; justify-content:space-between; padding:16px 24px; max-width:1120px; margin:0 auto; }
    .lp-logo{ display:flex; align-items:center; gap:10px; font-weight:900; font-size:1.2rem; font-family:'Cairo',sans-serif; }
    .lp-logo-mark{ width:36px; height:36px; border-radius:6px; background:#FF6B5B; display:flex; align-items:center; justify-content:center; color:#0B1614; font-weight:900; transform:rotate(-3deg); }
    .lp-nav-btn{ background:transparent; color:#E8F0EE; padding:9px 20px; border-radius:6px; font-weight:800; font-size:0.9rem; cursor:pointer; border:2px solid #FF6B5B; font-family:inherit; transition:background .15s ease, color .15s ease; }
    .lp-nav-btn:hover{ background:#FF6B5B; color:#0B1614; }

    /* HERO */
    .lp-hero{ position:relative; padding:80px 0 64px; text-align:center; overflow:hidden;
      background-image:
        repeating-linear-gradient(0deg, rgba(232,240,238,0.035) 0px, rgba(232,240,238,0.035) 1px, transparent 1px, transparent 40px),
        repeating-linear-gradient(90deg, rgba(232,240,238,0.035) 0px, rgba(232,240,238,0.035) 1px, transparent 1px, transparent 40px);
    }

    /* ===== ATOM (chalk-drawn) ===== */
    .lp-atom{ position:absolute; top:50%; left:50%; width:520px; height:520px; transform:translate(-50%,-50%); pointer-events:none; z-index:0; opacity:.5; }
    .lp-nucleus{ position:absolute; top:50%; left:50%; width:12px; height:12px; margin:-6px 0 0 -6px; border-radius:50%; background:#FF6B5B; }
    .lp-orbit{ position:absolute; top:50%; left:50%; border:2px dashed rgba(79,209,197,0.5); border-radius:50%; transform-origin:center; }
    .lp-orbit .lp-electron{ position:absolute; width:7px; height:7px; border-radius:50%; background:#4FD1C5; top:-3.5px; left:50%; margin-left:-3.5px; }
    .lp-orbit-1{ width:210px; height:210px; margin:-105px 0 0 -105px; animation:lp-spin 9s linear infinite; }
    .lp-orbit-2{ width:330px; height:330px; margin:-165px 0 0 -165px; transform:translate(-50%,-50%) rotate(60deg); animation:lp-spin 13s linear infinite reverse; }
    .lp-orbit-3{ width:450px; height:450px; margin:-225px 0 0 -225px; transform:translate(-50%,-50%) rotate(-45deg); animation:lp-spin 18s linear infinite; }
    @keyframes lp-spin{ from{ transform:translate(-50%,-50%) rotate(0deg); } to{ transform:translate(-50%,-50%) rotate(360deg); } }

    /* ===== FORMULAS (handwritten chalk feel) ===== */
    .lp-formula{ position:absolute; font-family:'JetBrains Mono',monospace; font-size:1rem; font-weight:600; pointer-events:none; z-index:0; padding-bottom:3px; border-bottom:2px dashed; animation:lp-float 7s ease-in-out infinite; }
    .lp-formula.blue{ color:rgba(79,209,197,.6); border-color:rgba(79,209,197,.3); transform:rotate(-4deg); }
    .lp-formula.orange{ color:rgba(255,107,91,.6); border-color:rgba(255,107,91,.3); transform:rotate(3deg); }
    .f1{ top:14%; left:8%; animation-delay:0s; }
    .f2{ top:22%; right:9%; animation-delay:1.2s; }
    .f3{ bottom:20%; left:12%; animation-delay:2.1s; }
    .f4{ bottom:14%; right:13%; animation-delay:.6s; }
    @keyframes lp-float{ 0%,100%{ transform:translateY(0) rotate(var(--r,0deg)); } 50%{ transform:translateY(-10px) rotate(var(--r,0deg)); } }

    .lp-hero-content{ position:relative; z-index:1; }
    .lp-eyebrow{ display:inline-flex; align-items:center; gap:8px; background:transparent; color:#4FD1C5; border:2px dashed rgba(79,209,197,0.5); padding:6px 16px; border-radius:999px; font-size:0.85rem; font-weight:700; margin-bottom:22px; font-family:'JetBrains Mono',monospace; }
    .lp-hero h1{ font-family:'Cairo',sans-serif; font-size:clamp(2rem,5vw,3.2rem); font-weight:900; line-height:1.3; max-width:780px; margin:0 auto 20px; }
    .lp-hero h1 span{ color:#FF6B5B; text-decoration:underline; text-decoration-style:wavy; text-decoration-color:rgba(255,107,91,.5); text-underline-offset:8px; }
    .lp-hero p{ color:#9DB0AC; font-size:1.1rem; max-width:560px; margin:0 auto 34px; font-weight:400; }
    .lp-hero-actions{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }

    .lp-btn-primary{ background:#FF6B5B; color:#0B1614; padding:15px 32px; border-radius:6px; font-weight:800; font-size:1rem; border:2px solid #FF6B5B; cursor:pointer; font-family:inherit; transition:transform .15s ease; }
    .lp-btn-primary:hover{ transform:rotate(-1deg) scale(1.02); }
    .lp-btn-ghost{ background:transparent; color:#E8F0EE; padding:15px 28px; border-radius:6px; font-weight:700; font-size:1rem; border:2px dashed rgba(232,240,238,0.4); cursor:pointer; font-family:inherit; transition:border-color .2s; }
    .lp-btn-ghost:hover{ border-color:#4FD1C5; border-style:solid; }

    /* SUBJECTS STRIP */
    .lp-stats{ border-top:2px dashed rgba(232,240,238,0.15); border-bottom:2px dashed rgba(232,240,238,0.15); background:rgba(232,240,238,0.02); }
    .lp-stats-grid{ display:flex; flex-wrap:wrap; justify-content:center; gap:12px; padding:26px 0; }
    .lp-badge{ display:inline-flex; align-items:center; gap:8px; background:transparent; border:2px solid rgba(232,240,238,0.2); color:#9DB0AC; padding:9px 18px; border-radius:6px; font-size:0.86rem; font-weight:700; font-family:'JetBrains Mono',monospace; }

    /* SECTION */
    .lp-section{ padding:90px 0; }
    .lp-section-head{ text-align:center; max-width:600px; margin:0 auto 50px; }
    .lp-section-head h2{ font-family:'Cairo',sans-serif; font-size:2rem; font-weight:900; margin:14px 0 0; }

    /* FEATURES — sticky notes on the board */
    .lp-features{ display:grid; grid-template-columns:repeat(3,1fr); gap:26px; }
    .lp-feature{ background:#FBEEE0; color:#2B1B12; border-radius:3px; padding:30px 24px; box-shadow:0 8px 18px rgba(0,0,0,0.35); transition:transform .2s ease; }
    .lp-feature:nth-child(odd){ transform:rotate(-1.4deg); }
    .lp-feature:nth-child(even){ transform:rotate(1.2deg); }
    .lp-feature:hover{ transform:rotate(0deg) translateY(-4px); }
    .lp-feature .ico{ width:42px; height:42px; border-radius:50%; background:#0B1614; color:#FF6B5B; display:flex; align-items:center; justify-content:center; font-size:1.15rem; margin-bottom:18px; }
    .lp-feature h3{ font-family:'Cairo',sans-serif; font-size:1.08rem; margin:0 0 8px; color:#0B1614; }
    .lp-feature p{ color:#7A5C47; font-size:0.92rem; margin:0; line-height:1.7; }

    /* ROADMAP — ruled notebook strip */
    .lp-road{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; border-top:2px dashed rgba(232,240,238,0.2); }
    .lp-step{ background:transparent; border-left:2px dashed rgba(232,240,238,0.2); padding:26px 20px; position:relative; }
    .lp-step:last-child{ border-left:none; }
    .lp-step .n{ font-size:0.8rem; font-weight:900; color:#0B1614; background:#4FD1C5; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:18px; font-family:'JetBrains Mono',monospace; }
    .lp-step h4{ font-family:'Cairo',sans-serif; font-size:1rem; margin:0 0 8px; }
    .lp-step p{ color:#7FA39A; font-size:0.88rem; margin:0; line-height:1.7; }

    /* LOGIN — textbook cover */
    .lp-login{ background:#12211E; border:2px dashed rgba(255,107,91,0.4); border-radius:8px; padding:54px 40px; text-align:center; }
    .lp-login h2{ font-family:'Cairo',sans-serif; font-size:1.7rem; font-weight:900; margin:0 0 10px; }
    .lp-login p{ color:#7FA39A; margin:0 0 34px; }
    .lp-roles{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; max-width:520px; margin:0 auto; }
    .lp-role-btn{ flex:1; min-width:220px; font-family:inherit; cursor:pointer; border-radius:6px; padding:24px 20px; display:flex; flex-direction:column; align-items:center; gap:10px; transition:transform .2s, border-color .2s; text-align:center; background:transparent; }
    .lp-role-btn:hover{ transform:translateY(-3px); }
    #studentLogin{ border:2px solid #4FD1C5; color:#E8F0EE; }
    #studentLogin:hover{ background:rgba(79,209,197,0.1); }
    #teacherLoginCard{ border:2px solid #FF6B5B; color:#E8F0EE; }
    #teacherLoginCard:hover{ background:rgba(255,107,91,0.1); }
    .lp-role-btn strong{ font-size:1rem; font-family:'Cairo',sans-serif; }
    .lp-role-btn span{ font-size:0.8rem; color:#7FA39A; }

    /* FOOTER */
    .lp-footer{ border-top:2px dashed rgba(232,240,238,0.15); padding:32px 0; text-align:center; color:#5A7B76; font-size:0.85rem; font-family:'JetBrains Mono',monospace; }

    /* KEYBOARD FOCUS */
    .lp-nav-btn:focus-visible,
    .lp-btn-primary:focus-visible,
    .lp-btn-ghost:focus-visible,
    .lp-role-btn:focus-visible{
      outline:2px solid #4FD1C5;
      outline-offset:3px;
    }

    @media (prefers-reduced-motion: reduce){
      .lp-orbit, .lp-formula{ animation:none; }
    }

    @media (max-width:860px){
      .lp-features{ grid-template-columns:1fr 1fr; }
      .lp-road{ grid-template-columns:1fr 1fr; }
      .lp-step:nth-child(2){ border-left:none; }
      .lp-atom{ width:380px; height:380px; opacity:.35; }
    }
    @media (max-width:560px){
      .lp-features, .lp-road{ grid-template-columns:1fr; }
      .lp-step{ border-left:none; border-top:2px dashed rgba(232,240,238,0.2); }
      .lp-step:first-child{ border-top:none; }
      .lp-formula{ display:none; }
      .lp-atom{ width:260px; height:260px; opacity:.25; }
      .lp-nav-inner .lp-nav-btn{ font-size:0; padding:9px 13px; }
      .lp-nav-inner .lp-nav-btn::before{ content:"⚙️"; font-size:1rem; }
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

      <div class="lp-atom" aria-hidden="true">
        <div class="lp-orbit lp-orbit-1"><span class="lp-electron"></span></div>
        <div class="lp-orbit lp-orbit-2"><span class="lp-electron"></span></div>
        <div class="lp-orbit lp-orbit-3"><span class="lp-electron"></span></div>
        <div class="lp-nucleus"></div>
      </div>

      <span class="lp-formula blue f1" aria-hidden="true">E = mc²</span>
      <span class="lp-formula orange f2" aria-hidden="true">H₂O</span>
      <span class="lp-formula blue f3" aria-hidden="true">F = ma</span>
      <span class="lp-formula orange f4" aria-hidden="true">PV = nRT</span>

      <div class="lp-wrap lp-hero-content">
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
        <span class="lp-badge">⚛️ فيزياء</span>
        <span class="lp-badge">🧪 كيمياء</span>
        <span class="lp-badge">📗 الصف الثاني الثانوي</span>
        <span class="lp-badge">📕 الصف الثالث الثانوي</span>
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

    <section class="lp-section" style="background:rgba(232,240,238,0.02); padding-top:80px; padding-bottom:80px;">
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