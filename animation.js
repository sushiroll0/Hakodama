// Splash fade logic
const splash = document.querySelector('.splash');
const mainContent = document.querySelector('.main-content');

if (splash && mainContent) {
  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.style.display = 'block';
  }, 2000);
}
  
  // Test fetch (optional)
 fetch('/api/hello')
  .then(res => res.json())
  .then(data => {
    document.body.innerHTML += `<p>${data.message}</p>`;
  })
  .catch(error => console.error('Fetch failed:', error));

