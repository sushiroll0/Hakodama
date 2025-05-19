// ===============================
// 🌊 SPLASH FADE LOGIC
// ===============================
const splash = document.querySelector('.splash');
const mainContent = document.querySelector('.main-content');

if (splash && mainContent) {
  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.style.display = 'block';
  }, 2000);
}
  
