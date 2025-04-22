// Splash fade logic
setTimeout(() => {
    const splash = document.querySelector('.splash');
    const content = document.querySelector('.main-content');
    if (splash && content) {
      splash.style.display = 'none';
      content.style.display = 'block';
    }
  }, 2000);
  
  // Test fetch (optional)
  fetch('http://mywebserver.local:3000/api/hello')
    .then(res => res.json())
    .then(data => {
      document.body.innerHTML += `<p>${data.message}</p>`;
    });
  