export function homePage(){
  return `
  <style>
    .lp{
      --bg:#EEF3FA;
      --bg-soft:#F5F8FC;
      --surface:#FFFFFF;
      --surface-glass:rgba(255,255,255,0.78);

      --ink:#172554;
      --ink-strong:#0F172A;
      --muted:#64748B;

      --line:rgba(15,23,42,0.10);
      --line-strong:rgba(15,23,42,0.17);

      --c1:#1D4ED8;
      --c2:#6D28D9;
      --c3:#DB2777;
      --c4:#EA580C;
      --c5:#0891B2;

      background:
        radial-gradient(
          circle at 85% 5%,
          rgba(96,165,250,.18),
          transparent 30%
        ),
        radial-gradient(
          circle at 10% 85%,
          rgba(167,139,250,.15),
          transparent 32%
        ),
        linear-gradient(
          180deg,
          #EEF3FA 0%,
          #F8FAFD 48%,
          #EEF3FA 100%
        );

      font-family:'Tajawal','Cairo',sans-serif;
      direction:rtl;
      color:var(--ink);
      overflow-x:hidden;
      position:relative;
      min-height:100vh;
    }

    .lp *{
      box-sizing:border-box;
    }

    .lp-wrap{
      max-width:1180px;
      margin:0 auto;
      padding:0 24px;
      position:relative;
      z-index:2;
    }

    /* =========================================
       AURORA BACKGROUND
    ========================================= */

    .lp-aurora{
      position:fixed;
      inset:0;
      z-index:0;
      overflow:hidden;
      pointer-events:none;
    }

    .lp-blob{
      position:absolute;
      border-radius:50%;
      filter:blur(90px);
      opacity:.25;
    }

    .lp-blob.b1{
      width:540px;
      height:540px;
      background:#60A5FA;
      top:-190px;
      right:-130px;
      animation:lp-drift-a 16s ease-in-out infinite;
    }

    .lp-blob.b2{
      width:450px;
      height:450px;
      background:#C084FC;
      bottom:-150px;
      left:-120px;
      animation:lp-drift-b 20s ease-in-out infinite;
    }

    .lp-blob.b3{
      width:390px;
      height:390px;
      background:#93C5FD;
      top:34%;
      left:38%;
      animation:lp-drift-c 24s ease-in-out infinite;
    }

    .lp-blob.b4{
      width:320px;
      height:320px;
      background:#67E8F9;
      top:62%;
      right:7%;
      animation:lp-drift-a 18s ease-in-out infinite reverse;
    }

    @keyframes lp-drift-a{
      0%,100%{
        transform:translate(0,0) scale(1);
      }

      50%{
        transform:translate(-60px,50px) scale(1.15);
      }
    }

    @keyframes lp-drift-b{
      0%,100%{
        transform:translate(0,0) scale(1);
      }

      50%{
        transform:translate(60px,-40px) scale(1.1);
      }
    }

    @keyframes lp-drift-c{
      0%,100%{
        transform:translate(0,0) scale(1);
      }

      50%{
        transform:translate(-40px,-60px) scale(.9);
      }
    }

    /* =========================================
       NAV
    ========================================= */

    .lp-nav{
      position:sticky;
      top:0;
      z-index:50;

      background:
        rgba(238,243,250,.82);

      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);

      border-bottom:
        1px solid var(--line);

      box-shadow:
        0 5px 25px rgba(15,23,42,.06);
    }

    .lp-nav-inner{
      display:flex;
      align-items:center;
      justify-content:space-between;

      padding:14px 24px;

      max-width:1180px;
      margin:0 auto;

      position:relative;
      z-index:2;
    }

    .lp-logo{
      display:flex;
      align-items:center;
      gap:11px;

      font-weight:800;
      font-size:1.02rem;

      font-family:'Cairo',sans-serif;
    }

    .lp-logo-mark{
      width:41px;
      height:41px;

      border-radius:12px;

      background:
        linear-gradient(
          135deg,
          #1D4ED8,
          #6D28D9 52%,
          #DB2777
        );

      background-size:200% 200%;

      animation:
        lp-gradient-shift 5s ease infinite;

      display:flex;
      align-items:center;
      justify-content:center;

      font-weight:900;
      color:#fff;
      font-size:1.1rem;

      flex-shrink:0;

      box-shadow:
        0 9px 22px rgba(29,78,216,.25);
    }

    @keyframes lp-gradient-shift{
      0%,100%{
        background-position:0% 50%;
      }

      50%{
        background-position:100% 50%;
      }
    }

    .lp-logo small{
      display:block;

      font-weight:500;

      font-size:.7rem;

      color:#64748B;

      margin-top:1px;
    }

    .lp-nav-btn{
      background:
        rgba(255,255,255,.9);

      border:
        1px solid rgba(29,78,216,.18);

      color:#1E3A8A;

      padding:10px 22px;

      border-radius:11px;

      font-weight:800;
      font-size:.88rem;

      cursor:pointer;

      font-family:inherit;

      transition:
        background .2s ease,
        border-color .2s ease,
        transform .2s ease,
        box-shadow .2s ease;
    }

    .lp-nav-btn:hover{
      background:#E8F0FF;

      border-color:#3B82F6;

      transform:translateY(-2px);

      box-shadow:
        0 9px 22px rgba(29,78,216,.12);
    }

    /* =========================================
       HERO
    ========================================= */

    .lp-hero{
      padding:90px 0 52px;
      position:relative;
    }

    .lp-hero-grid{
      display:grid;

      grid-template-columns:
        1.05fr
        .95fr;

      gap:54px;

      align-items:center;
    }

    .lp-kicker{
      display:inline-flex;
      align-items:center;
      gap:8px;

      color:#047857;

      font-size:.9rem;
      font-weight:800;

      margin-bottom:20px;

      animation:
        lp-fade-up .7s ease .1s backwards;
    }

    .lp-kicker i{
      width:8px;
      height:8px;

      border-radius:50%;

      background:#10B981;

      box-shadow:
        0 0 12px rgba(16,185,129,.45);

      animation:
        lp-pulse 1.8s ease infinite;
    }

    @keyframes lp-pulse{
      0%,100%{
        opacity:1;
      }

      50%{
        opacity:.35;
      }
    }

    .lp-hero h1{
      font-family:'Cairo',sans-serif;

      font-size:
        clamp(
          2.1rem,
          4.6vw,
          3.35rem
        );

      font-weight:900;

      line-height:1.3;

      margin:
        0 0 22px;

      max-width:620px;

      background:
        linear-gradient(
          90deg,
          #172554 8%,
          #1D4ED8 52%,
          #6D28D9 90%
        );

      -webkit-background-clip:text;
      background-clip:text;

      color:transparent;

      animation:
        lp-fade-up .7s ease .2s backwards;
    }

    .lp-hero p{
      color:#64748B;

      font-size:1.1rem;

      line-height:1.9;

      max-width:520px;

      margin:
        0 0 34px;

      animation:
        lp-fade-up .7s ease .32s backwards;
    }

    .lp-hero-actions{
      display:flex;

      gap:14px;

      flex-wrap:wrap;

      animation:
        lp-fade-up .7s ease .44s backwards;
    }

    @keyframes lp-fade-up{
      from{
        opacity:0;
        transform:translateY(16px);
      }

      to{
        opacity:1;
        transform:translateY(0);
      }
    }

    /* =========================================
       BUTTONS
    ========================================= */

    .lp-btn-primary{
      position:relative;

      background:
        linear-gradient(
          90deg,
          #1D4ED8,
          #6D28D9,
          #DB2777,
          #1D4ED8
        );

      background-size:300% 100%;

      color:#fff;

      padding:16px 32px;

      border-radius:12px;

      font-weight:800;
      font-size:1rem;

      border:none;

      cursor:pointer;

      font-family:inherit;

      animation:
        lp-gradient-flow 6s linear infinite;

      box-shadow:
        0 13px 30px rgba(79,70,229,.25);

      transition:
        transform .18s ease,
        box-shadow .18s ease;
    }

    .lp-btn-primary:hover{
      transform:
        translateY(-3px)
        scale(1.02);

      box-shadow:
        0 18px 38px rgba(79,70,229,.30);
    }

    @keyframes lp-gradient-flow{
      to{
        background-position:300% 0;
      }
    }

    .lp-btn-ghost{
      background:
        rgba(255,255,255,.82);

      color:#334155;

      padding:16px 28px;

      border-radius:12px;

      font-weight:700;
      font-size:1rem;

      border:
        1px solid rgba(15,23,42,.13);

      cursor:pointer;

      font-family:inherit;

      transition:
        border-color .2s,
        background .2s,
        transform .2s,
        box-shadow .2s;
    }

    .lp-btn-ghost:hover{
      border-color:#06B6D4;

      background:#ECFEFF;

      transform:
        translateY(-2px);

      box-shadow:
        0 10px 25px rgba(8,145,178,.10);
    }

    /* =========================================
       FLOATING CARDS
    ========================================= */

    .lp-stack{
      position:relative;

      height:380px;

      animation:
        lp-fade-up .8s ease .3s backwards;
    }

    .lp-float{
      position:absolute;

      background:
        rgba(255,255,255,.84);

      border:
        1px solid rgba(15,23,42,.10);

      backdrop-filter:blur(18px);
      -webkit-backdrop-filter:blur(18px);

      border-radius:18px;

      padding:16px 18px;

      display:flex;
      align-items:center;

      gap:12px;

      box-shadow:
        0 20px 45px rgba(15,23,42,.11);

      min-width:195px;
    }

    .lp-float .ic{
      width:40px;
      height:40px;

      border-radius:11px;

      display:flex;
      align-items:center;
      justify-content:center;

      font-size:1.1rem;

      flex-shrink:0;
    }

    .lp-float strong{
      display:block;

      font-family:'Cairo',sans-serif;

      font-size:.98rem;

      font-weight:800;

      color:#172033;
    }

    .lp-float span{
      font-size:.76rem;

      color:#64748B;
    }

    .lp-f1{
      top:6%;
      right:8%;

      animation:
        lp-float-a 6s ease-in-out infinite;
    }

    .lp-f1 .ic{
      background:#DBEAFE;
    }

    .lp-f2{
      top:42%;
      left:2%;

      animation:
        lp-float-b 7s ease-in-out infinite;
    }

    .lp-f2 .ic{
      background:#FCE7F3;
    }

    .lp-f3{
      bottom:10%;
      right:20%;

      animation:
        lp-float-a 8s ease-in-out infinite reverse;
    }

    .lp-f3 .ic{
      background:#CFFAFE;
    }

    .lp-f4{
      top:14%;
      left:26%;

      animation:
        lp-float-b 9s ease-in-out infinite;
    }

    .lp-f4 .ic{
      background:#FFEDD5;
    }

    @keyframes lp-float-a{
      0%,100%{
        transform:
          translateY(0)
          rotate(0deg);
      }

      50%{
        transform:
          translateY(-16px)
          rotate(-1.5deg);
      }
    }

    @keyframes lp-float-b{
      0%,100%{
        transform:
          translateY(0)
          rotate(0deg);
      }

      50%{
        transform:
          translateY(14px)
          rotate(1.5deg);
      }
    }

    /* =========================================
       STRIP
    ========================================= */

    .lp-strip{
      border-top:
        1px solid rgba(15,23,42,.08);

      border-bottom:
        1px solid rgba(15,23,42,.08);

      background:
        rgba(255,255,255,.48);

      overflow:hidden;
    }

    .lp-strip-track{
      display:flex;

      gap:14px;

      padding:20px 0;

      width:max-content;

      animation:
        lp-scroll 22s linear infinite;
    }

    @keyframes lp-scroll{
      from{
        transform:translateX(0);
      }

      to{
        transform:translateX(-50%);
      }
    }

    .lp-chip{
      display:inline-flex;

      align-items:center;

      gap:8px;

      background:
        rgba(255,255,255,.86);

      border:
        1px solid rgba(15,23,42,.09);

      color:#64748B;

      padding:9px 20px;

      border-radius:100px;

      font-size:.86rem;

      font-weight:700;

      white-space:nowrap;

      box-shadow:
        0 5px 15px rgba(15,23,42,.04);
    }

    /* =========================================
       SECTIONS
    ========================================= */

    .lp-section{
      padding:100px 0;

      position:relative;
    }

    .lp-section-head{
      max-width:600px;

      margin:
        0 0 50px;
    }

    .lp-section-head h2{
      font-family:'Cairo',sans-serif;

      font-size:1.95rem;

      font-weight:800;

      margin:
        0 0 10px;

      color:#172554;
    }

    .lp-section-head p{
      color:#64748B;

      font-size:1rem;

      margin:0;

      line-height:1.8;
    }

    /* =========================================
       FEATURES
    ========================================= */

    .lp-features{
      display:grid;

      grid-template-columns:
        repeat(3,1fr);

      gap:20px;
    }

    .lp-card{
      position:relative;

      background:
        rgba(255,255,255,.82);

      border:
        1px solid rgba(15,23,42,.09);

      border-radius:20px;

      padding:30px 24px;

      overflow:hidden;

      transition:
        transform .3s ease,
        border-color .3s ease,
        box-shadow .3s ease;
    }

    .lp-card::before{
      content:"";

      position:absolute;

      inset:0;

      opacity:0;

      transition:
        opacity .3s ease;

      border-radius:20px;

      padding:1px;

      background:
        linear-gradient(
          135deg,
          #1D4ED8,
          #6D28D9,
          #DB2777
        );

      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);

      -webkit-mask-composite:xor;

      mask-composite:exclude;

      pointer-events:none;
    }

    .lp-card:hover{
      transform:
        translateY(-8px);

      border-color:
        rgba(29,78,216,.18);

      box-shadow:
        0 20px 42px rgba(29,78,216,.10);
    }

    .lp-card:hover::before{
      opacity:1;
    }

    .lp-card-ico{
      width:50px;
      height:50px;

      border-radius:14px;

      display:flex;

      align-items:center;
      justify-content:center;

      font-size:1.35rem;

      margin-bottom:20px;
    }

    .lp-card:nth-child(1) .lp-card-ico{
      background:
        linear-gradient(
          135deg,
          #DBEAFE,
          #EFF6FF
        );
    }

    .lp-card:nth-child(2) .lp-card-ico{
      background:
        linear-gradient(
          135deg,
          #EDE9FE,
          #F5F3FF
        );
    }

    .lp-card:nth-child(3) .lp-card-ico{
      background:
        linear-gradient(
          135deg,
          #FCE7F3,
          #FDF2F8
        );
    }

    .lp-card h3{
      font-family:'Cairo',sans-serif;

      font-size:1.08rem;

      margin:
        0 0 9px;

      font-weight:700;

      color:#172033;
    }

    .lp-card p{
      color:#64748B;

      font-size:.93rem;

      margin:0;

      line-height:1.75;
    }

    /* =========================================
       ROADMAP
    ========================================= */

    .lp-timeline{
      position:relative;
    }

    .lp-timeline-line{
      position:absolute;

      top:19px;

      right:0;
      left:0;

      height:3px;

      border-radius:3px;

      background:
        linear-gradient(
          90deg,
          #2563EB,
          #7C3AED,
          #DB2777,
          #EA580C
        );

      background-size:200% 100%;

      animation:
        lp-gradient-flow 5s linear infinite;

      opacity:.8;
    }

    .lp-tl-grid{
      position:relative;

      display:grid;

      grid-template-columns:
        repeat(4,1fr);

      gap:20px;
    }

    .lp-tl-step{
      padding-top:0;
    }

    .lp-tl-dot{
      width:40px;
      height:40px;

      border-radius:50%;

      display:flex;

      align-items:center;
      justify-content:center;

      font-family:'JetBrains Mono',monospace;

      font-weight:800;

      font-size:.85rem;

      position:relative;

      z-index:1;

      margin-bottom:22px;

      color:#fff;

      box-shadow:
        0 0 0 5px #EEF3FA,
        0 5px 16px rgba(15,23,42,.15);
    }

    .lp-tl-step:nth-child(1) .lp-tl-dot{
      background:#2563EB;
    }

    .lp-tl-step:nth-child(2) .lp-tl-dot{
      background:#7C3AED;
    }

    .lp-tl-step:nth-child(3) .lp-tl-dot{
      background:#DB2777;
    }

    .lp-tl-step:nth-child(4) .lp-tl-dot{
      background:#EA580C;
    }

    .lp-tl-step h4{
      font-family:'Cairo',sans-serif;

      font-size:1rem;

      margin:
        0 0 8px;

      font-weight:700;

      color:#172033;
    }

    .lp-tl-step p{
      color:#64748B;

      font-size:.88rem;

      margin:0;

      line-height:1.75;
    }

    /* =========================================
       LOGIN
    ========================================= */

    .lp-access-head{
      text-align:center;

      max-width:520px;

      margin:
        0 auto 44px;
    }

    .lp-access-head h2{
      font-family:'Cairo',sans-serif;

      font-size:1.85rem;

      font-weight:800;

      margin:
        0 0 10px;

      color:#172554;
    }

    .lp-access-head p{
      color:#64748B;

      margin:0;
    }

    .lp-roles{
      display:grid;

      grid-template-columns:
        1fr 1fr;

      gap:20px;

      max-width:660px;

      margin:0 auto;
    }

    .lp-role-btn{
      position:relative;

      border-radius:20px;

      padding:36px 26px;

      display:flex;

      flex-direction:column;

      align-items:center;

      gap:12px;

      text-align:center;

      cursor:pointer;

      font-family:inherit;

      color:#fff;

      border:none;

      overflow:hidden;

      transition:
        transform .25s ease,
        box-shadow .25s ease;

      background-size:220% 220%;
    }

    #studentLogin{
      background-image:
        linear-gradient(
          135deg,
          #1D4ED8,
          #0891B2
        );

      animation:
        lp-gradient-shift 6s ease infinite;

      box-shadow:
        0 15px 32px rgba(29,78,216,.22);
    }

    #teacherLoginCard{
      background-image:
        linear-gradient(
          135deg,
          #6D28D9,
          #DB2777
        );

      animation:
        lp-gradient-shift 6s ease infinite;

      box-shadow:
        0 15px 32px rgba(109,40,217,.22);
    }

    .lp-role-btn:hover{
      transform:
        translateY(-6px);

      box-shadow:
        0 23px 45px rgba(15,23,42,.18);
    }

    .lp-role-ico{
      width:56px;
      height:56px;

      border-radius:50%;

      background:
        rgba(255,255,255,.22);

      display:flex;

      align-items:center;
      justify-content:center;

      font-size:1.5rem;

      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.18);
    }

    .lp-role-btn strong{
      font-size:1.05rem;

      font-family:'Cairo',sans-serif;

      font-weight:800;
    }

    .lp-role-btn span{
      font-size:.84rem;

      opacity:.9;
    }

    /* =========================================
       FOOTER
    ========================================= */

    .lp-footer{
      border-top:
        1px solid rgba(15,23,42,.08);

      padding:32px 0;

      text-align:center;

      color:#64748B;

      font-size:.85rem;

      position:relative;

      z-index:2;

      background:
        rgba(255,255,255,.38);
    }

    /* =========================================
       FOCUS
    ========================================= */

    .lp-nav-btn:focus-visible,
    .lp-btn-primary:focus-visible,
    .lp-btn-ghost:focus-visible,
    .lp-role-btn:focus-visible{
      outline:
        2px solid #0891B2;

      outline-offset:3px;
    }

    /* =========================================
       REDUCED MOTION
    ========================================= */

    @media (prefers-reduced-motion:reduce){

      .lp-blob,
      .lp-logo-mark,
      .lp-btn-primary,
      .lp-strip-track,
      .lp-float,
      .lp-kicker i,
      .lp-timeline-line,
      #studentLogin,
      #teacherLoginCard,
      .lp-hero h1,
      .lp-hero p,
      .lp-hero-actions,
      .lp-stack{
        animation:none !important;
      }
    }

    /* =========================================
       TABLET
    ========================================= */

    @media (max-width:900px){

      .lp-hero-grid{
        grid-template-columns:1fr;
      }

      .lp-hero p{
        max-width:none;
      }

      .lp-stack{
        display:none;
      }

      .lp-features{
        grid-template-columns:
          1fr 1fr;
      }
    }

    /* =========================================
       MOBILE
    ========================================= */

    @media (max-width:640px){

      .lp-wrap{
        padding:
          0 18px;
      }

      .lp-hero{
        padding:
          65px 0 40px;
      }

      .lp-hero h1{
        font-size:
          clamp(
            1.85rem,
            9vw,
            2.5rem
          );
      }

      .lp-hero p{
        font-size:1rem;
      }

      .lp-hero-actions{
        flex-direction:column;
      }

      .lp-btn-primary,
      .lp-btn-ghost{
        width:100%;
      }

      .lp-features{
        grid-template-columns:1fr;
      }

      .lp-tl-grid{
        grid-template-columns:1fr;

        gap:26px;
      }

      .lp-timeline-line{
        display:none;
      }

      .lp-roles{
        grid-template-columns:1fr;
      }

      .lp-nav-inner .lp-nav-btn{
        font-size:0;

        padding:
          10px 14px;
      }

      .lp-nav-inner .lp-nav-btn::before{
        content:"دخول";

        font-size:.85rem;
      }

      .lp-logo{
        font-size:.9rem;
      }

      .lp-logo small{
        font-size:.62rem;
      }
    }
  </style>

  <div class="lp">

    <!-- AURORA BACKGROUND -->

    <div class="lp-aurora" aria-hidden="true">
      <div class="lp-blob b1"></div>
      <div class="lp-blob b2"></div>
      <div class="lp-blob b3"></div>
      <div class="lp-blob b4"></div>
    </div>

    <!-- NAV -->

    <nav class="lp-nav">

      <div class="lp-nav-inner">

        <div class="lp-logo">

          <span class="lp-logo-mark">
            أ
          </span>

          <span>
            أ. أحمد رضا

            <small>
              فيزياء وكيمياء الثانوية العامة
            </small>

          </span>

        </div>

        <button
          class="lp-nav-btn"
          id="teacherLogin"
        >
          دخول المعلم
        </button>

      </div>

    </nav>

    <!-- HERO -->

    <section class="lp-hero">

      <div class="lp-wrap lp-hero-grid">

        <div>

          <div class="lp-kicker">
            <i></i>
            فيزياء وكيمياء — الصف الثاني والثالث الثانوي
          </div>

          <h1>
            معاك خطوة بخطوة من أول الدرس لحد آخر تجربة في الامتحان
          </h1>

          <p>
            شرح مبسط ومنظم، بنك أسئلة بنفس أسلوب امتحانات الوزارة،
            ومتابعة دقيقة لدرجاتك بعد كل اختبار.
          </p>

          <div class="lp-hero-actions">

            <button
              class="lp-btn-primary"
              id="startBtn"
            >
              ابدأ رحلتك دلوقتي
            </button>

            <button
              class="lp-btn-ghost"
              onclick="document.querySelector('.lp-access').scrollIntoView({behavior:'smooth'})"
            >
              تسجيل الدخول
            </button>

          </div>

        </div>

        <!-- FLOATING CARDS -->

        <div
          class="lp-stack"
          aria-hidden="true"
        >

          <div class="lp-float lp-f1">

            <span class="ic">
              📈
            </span>

            <span>

              <strong>
                +300 سؤال
              </strong>

              <span>
                بنك أسئلة شامل
              </span>

            </span>

          </div>

          <div class="lp-float lp-f2">

            <span class="ic">
              ⚛️
            </span>

            <span>

              <strong>
                شرح تفاعلي
              </strong>

              <span>
                فيزياء وكيمياء
              </span>

            </span>

          </div>

          <div class="lp-float lp-f3">

            <span class="ic">
              🎯
            </span>

            <span>

              <strong>
                تصحيح فوري
              </strong>

              <span>
                بعد كل امتحان
              </span>

            </span>

          </div>

          <div class="lp-float lp-f4">

            <span class="ic">
              🧪
            </span>

            <span>

              <strong>
                مسائل محلولة
              </strong>

              <span>
                خطوة بخطوة
              </span>

            </span>

          </div>

        </div>

      </div>

    </section>

    <!-- STRIP -->

    <div class="lp-strip">

      <div class="lp-strip-track">

        <span class="lp-chip">
          ⚛️ فيزياء
        </span>

        <span class="lp-chip">
          🧪 كيمياء
        </span>

        <span class="lp-chip">
          📗 الصف الثاني الثانوي
        </span>

        <span class="lp-chip">
          📕 الصف الثالث الثانوي
        </span>

        <span class="lp-chip">
          📊 امتحانات دورية
        </span>

        <span class="lp-chip">
          📄 ملازم وبنوك أسئلة
        </span>

        <span class="lp-chip">
          ⚛️ فيزياء
        </span>

        <span class="lp-chip">
          🧪 كيمياء
        </span>

        <span class="lp-chip">
          📗 الصف الثاني الثانوي
        </span>

        <span class="lp-chip">
          📕 الصف الثالث الثانوي
        </span>

        <span class="lp-chip">
          📊 امتحانات دورية
        </span>

        <span class="lp-chip">
          📄 ملازم وبنوك أسئلة
        </span>

      </div>

    </div>

    <!-- FEATURES -->

    <section class="lp-section">

      <div class="lp-wrap">

        <div class="lp-section-head">

          <h2>
            إزاي تستفيد من المنصة
          </h2>

          <p>
            كل اللي محتاجه عشان تقفل المادة في مكان واحد،
            من الشرح لحد الامتحان.
          </p>

        </div>

        <div class="lp-features">

          <div class="lp-card">

            <div class="lp-card-ico">
              🎬
            </div>

            <h3>
              سبورات الشرح
            </h3>

            <p>
              دروس الفيزياء والكيمياء متجمعة ومرتبة،
              تراجع بيها أي جزء وقتما تحتاج.
            </p>

          </div>

          <div class="lp-card">

            <div class="lp-card-ico">
              📄
            </div>

            <h3>
              ملازم وبنك أسئلة
            </h3>

            <p>
              ملازم منظمة وبنك أسئلة شامل بنفس أسلوب
              امتحانات الثانوية العامة.
            </p>

          </div>

          <div class="lp-card">

            <div class="lp-card-ico">
              📊
            </div>

            <h3>
              امتحانات ودرجات فورية
            </h3>

            <p>
              امتحانات إلكترونية دورية على نفس نظام الامتحان النهائي،
              مع درجتك أول ما تخلص.
            </p>

          </div>

        </div>

      </div>

    </section>

    <!-- ROADMAP -->

    <section
      class="lp-section"
      style="padding-top:20px;"
    >

      <div class="lp-wrap">

        <div class="lp-section-head">

          <h2>
            خطوات وصولك للدرجة النهائية
          </h2>

          <p>
            رحلتك معانا من أول يوم لحد ما تدخل الامتحان وانت مطمئن.
          </p>

        </div>

        <div class="lp-timeline">

          <div
            class="lp-timeline-line"
            aria-hidden="true"
          ></div>

          <div class="lp-tl-grid">

            <div class="lp-tl-step">

              <div class="lp-tl-dot">
                ١
              </div>

              <h4>
                استعن بالله
              </h4>

              <p>
                ولا تعجز، فإن الجزاء من جنس العمل.
              </p>

            </div>

            <div class="lp-tl-step">

              <div class="lp-tl-dot">
                ٢
              </div>

              <h4>
                تابع الشرح
              </h4>

              <p>
                شوف سبورات الفيزياء والكيمياء مرتبة في مكان واحد.
              </p>

            </div>

            <div class="lp-tl-step">

              <div class="lp-tl-dot">
                ٣
              </div>

              <h4>
                اختبر نفسك
              </h4>

              <p>
                امتحانات دورية لقياس مدى فهمك أول بأول.
              </p>

            </div>

            <div class="lp-tl-step">

              <div class="lp-tl-dot">
                ٤
              </div>

              <h4>
                قفّل المادة
              </h4>

              <p>
                بالمتابعة المستمرة هتوصل لأعلى درجة.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

    <!-- LOGIN -->

    <section class="lp-section lp-access">

      <div class="lp-wrap">

        <div class="lp-access-head">

          <h2>
            ادخل عالم الفيزياء والكيمياء
          </h2>

          <p>
            اختر حسابك للمتابعة
          </p>

        </div>

        <div class="lp-roles">

          <button
            id="studentLogin"
            class="lp-role-btn"
          >

            <div class="lp-role-ico">
              🎓
            </div>

            <strong>
              دخول الطلاب
            </strong>

            <span>
              الامتحانات ومتابعة الدرجات
            </span>

          </button>

          <button
            id="teacherLoginCard"
            class="lp-role-btn"
            onclick="document.getElementById('teacherLogin').click()"
          >

            <div class="lp-role-ico">
              ⚙️
            </div>

            <strong>
              لوحة المعلم
            </strong>

            <span>
              إدارة الأسئلة والنتائج
            </span>

          </button>

        </div>

      </div>

    </section>

    <!-- FOOTER -->

    <footer class="lp-footer">

      منصة أ. أحمد رضا للفيزياء والكيمياء
      © ٢٠٢٦ — جميع الحقوق محفوظة

    </footer>

  </div>
  `;
}