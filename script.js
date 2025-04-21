/* splash */
<style>
    /* TEMPORARY: Inline to ensure splash works instantly */
    .main-content {
      display: none;
    }
  </style>

    /* Splash Fade Logic */
  <script>
    setTimeout(() => {
      document.querySelector('.splash').style.display = 'none';
      document.querySelector('.main-content').style.display = 'block';
    }, 2000);
  </script>

  <script>
  fetch('http://mywebserver.local:3000/api/hello')
    .then(res => res.json())
    .then(data => {
      document.body.innerHTML += `<p>${data.message}</p>`;
    });
</script>



/* Form for blog*/
<form id="contact-form">
  <input type="text" name="name" placeholder="Your name" required>
  <textarea name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>

<script>
  document.getElementById('contact-form').addEventListener('submit', async function (e) {
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
</script>
