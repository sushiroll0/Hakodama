// Splash fade logic
setTimeout(() => {
  document.querySelector('.splash').style.display = 'none';
  document.querySelector('.main-content').style.display = 'block';
}, 2000);

// Backend GET test
fetch('http://mywebserver.local:3000/api/hello')
  .then(res => res.json())
  .then(data => {
    document.body.innerHTML += `<p>${data.message}</p>`;
  });

// Contact form submission handler
document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    message: form.message.value
  };

  const res = await fetch('http://mywebserver.local:3000/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.success ? 'Message sent!' : 'Failed to send.');
});
