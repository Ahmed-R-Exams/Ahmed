export function homePage(){
  return `
  <style>
    .arp-page{
      min-height:100vh;
      background:
        linear-gradient(rgba(8,11,20,0.95), rgba(8,11,20,0.95)),
        repeating-linear-gradient(0deg, rgba(94,164,255,0.06) 0px, transparent 1px, transparent 38px),
        repeating-linear-gradient(90deg, rgba(94,164,255,0.06) 0px, transparent 1px, transparent 38px),
        #080B14;
      font-family:'Tajawal','Cairo',sans-serif;
      direction:rtl;
      display:grid;
      grid-template-columns:1fr 1fr;
    }
    @media (max-width:860px){ .arp-page{ grid-template-columns:1fr; } .arp-visual{ display:none; } }

    /* ===== LEFT: login panel ===== */
    .arp-panel{ display:flex; align-items:center; justify-content:center; padding:40px 24px; }
    .arp-card{ max-width:420px; width:100%; }

    .arp-brand{ display:flex; align-items:center; gap:12px; margin-bottom:44px; }
    .arp-mono{
      width:46px; height:46px; border-radius:12px;
      background:#121A2C; border:1px solid rgba(94,164,255,0.4);
      display:flex; align-items:center; justify-content:center;
      color:#79B8FF; box-shadow:0 0 24px rgba(94,164,255,0.2);
    }
    .arp-brand .name{ color:#FFFFFF; font-weight:800; font-size:16px; }
    .arp-brand .role{ color:#8A96AD; font-size:12.5px; letter-spacing:0.3px; }

    .arp-card h1{ color:#FFFFFF; font-size:32px; font-weight:900; margin:0 0 10px; line-height:1.35; }
    .arp-card h1 em{ color:#79B8FF; font-style:normal; }
    .arp-card .sub{ color:#B3BDD1; font-size:15.5px; margin:0 0 36px; font-weight:400; }

    .arp-roles{ display:flex; flex-direction:column; gap:14px; }
    .arp-btn{
      font-family:inherit; cursor:pointer; border-radius:16px;
      padding:20px 22px; display:flex; align-items:center; gap:16px;
      transition:transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease;
      text-align:right; width:100%; position:relative;
    }
    .arp-btn:focus-visible{ outline:2px solid #79B8FF; outline-offset:3px; }
    .arp-btn .arp-ico{
      width:46px; height:46px; border-radius:11px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
    }
    .arp-btn .arp-txt{ flex:1; }
    .arp-btn strong{ display:block; font-size:17px; font-weight:800; }
    .arp-btn span.arp-caption{ font-size:13px; font-weight:500; display:block; margin-top:3px; }
    .arp-btn .arp-arrow{ opacity:0; transform:translateX(6px); transition:opacity .2s, transform .2s; }
    .arp-btn:hover .arp-arrow{ opacity:1; transform:translateX(0); }
    [dir="rtl"] .arp-arrow svg{ transform:scaleX(-1); }

    #studentLogin{ background:#131E33; border:1.5px solid rgba(94,164,255,0.4); color:#FFFFFF; }
    #studentLogin:hover{ transform:translateY(-3px); border-color:#79B8FF; background:#182645; box-shadow:0 14px 34px -10px rgba(94,164,255,0.35); }
    #studentLogin .arp-ico{ background:rgba(94,164,255,0.18); color:#79B8FF; }
    #studentLogin .arp-caption{ color:#A9B4C8; }
    #studentLogin .arp-arrow{ color:#79B8FF; }

    #teacherLogin{ background:#161B26; border:1.5px solid rgba(255,143,84,0.35); color:#FFFFFF; }
    #teacherLogin:hover{ transform:translateY(-3px); border-color:#FF8F54; background:#1D2130; box-shadow:0 14px 34px -10px rgba(255,143,84,0.3); }
    #teacherLogin .arp-ico{ background:rgba(255,143,84,0.16); color:#FF8F54; }
    #teacherLogin .arp-caption{ color:#A9B4C8; }
    #teacherLogin .arp-arrow{ color:#FF8F54; }

    .arp-footer{ margin-top:34px; font-size:12.5px; color:#5C6B85; display:flex; align-items:center; gap:6px; }

    /* ===== RIGHT: visual side ===== */
    .arp-visual{
      position:relative; overflow:hidden;
      display:flex; align-items:center; justify-content:center;
      background:radial-gradient(circle at 50% 45%, rgba(94,164,255,0.10), transparent 60%);
      padding:40px;
    }
    .lab-grid{
      display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%; max-width:440px;
    }
    .lab-card{
      background:#111A2C; border:1px solid rgba(94,164,255,0.2);
      border-radius:18px; padding:22px 18px; text-align:center;
      display:flex; flex-direction:column; align-items:center; gap:12px;
    }
    .lab-card.wide{ grid-column:1 / -1; flex-direction:row; text-align:right; justify-content:flex-start; padding:24px; }
    .lab-card .cap{ color:#D6DCE8; font-size:13.5px; font-weight:700; }
    .lab-card .cap-sub{ color:#7A87A0; font-size:11.5px; }

    .arp-badge{
      position:absolute; top:8%; right:8%;
      background:#111A2C; border:1px solid rgba(94,164,255,0.4);
      color:#79B8FF; font-size:12.5px; font-weight:700;
      padding:9px 16px; border-radius:10px;
      display:flex; align-items:center; gap:6px;
    }

    /* bubble animation for flask */
    .bubble{ animation:rise linear infinite; transform-origin:center; }
    .b1{ animation-duration:2.4s; }
    .b2{ animation-duration:3.1s; animation-delay:0.6s; }
    .b3{ animation-duration:2.7s; animation-delay:1.2s; }
    @keyframes rise{ 0%{ transform:translateY(0); opacity:0; } 15%{opacity:1;} 100%{ transform:translateY(-22px); opacity:0; } }

    .prism-ray{ stroke-dasharray:6 4; animation:dash 1.6s linear infinite; }
    @keyframes dash{ to{ stroke-dashoffset:-20; } }

    .pendulum{ animation:swing 2.2s ease-in-out infinite; transform-origin:100px 20px; }
    @keyframes swing{ 0%,100%{ transform:rotate(18deg);} 50%{ transform:rotate(-18deg);} }

    @media (prefers-reduced-motion: reduce){ .bubble,.prism-ray,.pendulum{ animation:none !important; } }
  </style>

  <div class="arp-page">

    <div class="arp-panel">
      <div class="arp-card">

        <div class="arp-brand">
          <div class="arp-mono">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></svg>
          </div>
          <div>
            <div class="name">منصة أ. أحمد رضا</div>
            <div class="role">فيزياء · كيمياء</div>
          </div>
        </div>

        <h1>ادخل عالم <em>الفيزياء والكيمياء</em></h1>
        <p class="sub">امتحانات، تجارب محلولة، ومتابعة درجاتك أول بأول</p>

        <div class="arp-roles">
          <button id="studentLogin" class="arp-btn">
            <div class="arp-ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 6.5 3 4v13l9 2.5 9-2.5V4l-9 2.5Z"/><path d="M12 6.5v13"/></svg></div>
            <div class="arp-txt">
              <strong>دخول الطلاب</strong>
              <span class="arp-caption">الامتحانات ومتابعة الدرجات</span>
            </div>
            <div class="arp-arrow"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>
          </button>

          <button id="teacherLogin" class="arp-btn">
            <div class="arp-ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>
            <div class="arp-txt">
              <strong>لوحة المعلم</strong>
              <span class="arp-caption">إدارة الأسئلة والنتائج</span>
            </div>
            <div class="arp-arrow"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>
          </button>
        </div>

        <div class="arp-footer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
          بوابة آمنة لمتابعة الأداء الأكاديمي
        </div>

      </div>
    </div>

    <div class="arp-visual">
      <div class="arp-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/></svg>
        تجارب وحلول تفاعلية
      </div>

      <div class="lab-grid">

        <!-- flask with bubbling reaction -->
        <div class="lab-card">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M26 10h12v14l10 22a4 4 0 0 1-3.6 5.7H19.6A4 4 0 0 1 16 46l10-22V10Z" stroke="#79B8FF" stroke-width="2" fill="rgba(94,164,255,0.08)"/>
            <path d="M23 10h18" stroke="#79B8FF" stroke-width="2" stroke-linecap="round"/>
            <path d="M19.5 40h25" stroke="#79B8FF" stroke-width="1.5" opacity="0.5"/>
            <circle class="bubble b1" cx="27" cy="44" r="2.4" fill="#FF8F54"/>
            <circle class="bubble b2" cx="34" cy="47" r="1.8" fill="#79B8FF"/>
            <circle class="bubble b3" cx="30" cy="42" r="1.4" fill="#FF8F54"/>
          </svg>
          <div class="cap">تفاعلات كيميائية</div>
          <div class="cap-sub">تجارب محلولة خطوة بخطوة</div>
        </div>

        <!-- prism splitting light -->
        <div class="lab-card">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M14 44 32 14l18 30H14Z" stroke="#79B8FF" stroke-width="2" fill="rgba(94,164,255,0.08)"/>
            <line class="prism-ray" x1="4" y1="30" x2="24" y2="30" stroke="#B3BDD1" stroke-width="2"/>
            <line x1="40" y1="30" x2="52" y2="20" stroke="#FF8F54" stroke-width="2"/>
            <line x1="40" y1="30" x2="54" y2="30" stroke="#79B8FF" stroke-width="2"/>
            <line x1="40" y1="30" x2="52" y2="40" stroke="#F2D14E" stroke-width="2"/>
          </svg>
          <div class="cap">تحليل الضوء</div>
          <div class="cap-sub">مفاهيم الفيزياء بالرسم</div>
        </div>

        <!-- pendulum + progress, wide card -->
        <div class="lab-card wide">
          <svg width="80" height="60" viewBox="0 0 200 60" fill="none">
            <line x1="100" y1="6" x2="100" y2="20" stroke="#5C6B85" stroke-width="2"/>
            <g class="pendulum">
              <line x1="100" y1="20" x2="100" y2="50" stroke="#B3BDD1" stroke-width="2"/>
              <circle cx="100" cy="52" r="7" fill="#FF8F54"/>
            </g>
          </svg>
          <div>
            <div class="cap">حركة وقوانين نيوتن</div>
            <div class="cap-sub">محاكاة تفاعلية لكل قانون فيزيائي</div>
          </div>
        </div>

      </div>
    </div>

  </div>
  `;
}