export function teacherPage() {
  return `
  <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    
    <!-- Top Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
      <h1 style="font-size: 24px; color: #1e293b; margin: 0;">👨‍🏫 Teacher Dashboard</h1>
      
      <button id="backHomeBtn" style="
        background: #0f172a; 
        color: white; 
        border: none; 
        padding: 10px 18px; 
        border-radius: 10px; 
        cursor: pointer; 
        font-weight: 600;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      ">
        ⬅ Back To Home
      </button>
    </div>

    <!-- Dashboard Content -->
    <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
      <h3 style="margin-top: 0; color: #1e293b; font-size: 18px;">Welcome, Teacher</h3>
      <p style="color: #64748b; margin-bottom: 0;">Manage your students and exams from here.</p>
    </div>

  </div>
  `;
}