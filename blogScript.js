// When the page loads, fetch and display posts
document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();

  const form = document.getElementById('blog-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const response = await fetch('/submit', {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();
console.error("Server response:", text);
try {
  const result = JSON.parse(text);
  if (result.success) {
    document.getElementById('confirmation').innerText = '✅ Post submitted!';
    form.reset();
    fetchPosts();
  } else {
    document.getElementById('confirmation').innerText = '❌ Something went wrong.';
  }
} catch (err) {
  console.error("JSON parse error:", err);
  document.getElementById('confirmation').innerText = '❌ Server error.';
}


    if (result.success) {
      document.getElementById('confirmation').innerText = '✅ Post submitted!';
      form.reset();
      fetchPosts(); // Reload posts
    } else {
      document.getElementById('confirmation').innerText = '❌ Something went wrong.';
    }
  });

  // Optional: Add search filter
  const searchInput = document.getElementById('search-bar');
  searchInput.addEventListener('input', () => {
    const search = searchInput.value.toLowerCase();
    const posts = document.querySelectorAll('.blog-post');
    posts.forEach(post => {
      post.style.display = post.innerText.toLowerCase().includes(search) ? 'block' : 'none';
    });
  });
});

// Fetch and display posts
async function fetchPosts() {
  const res = await fetch('/posts');
  const posts = await res.json();

  const container = document.getElementById('blog-posts');
  container.innerHTML = '';

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('blog-post');

    let mediaHtml = '';
    if (post.media) {
      if (post.media.endsWith('.mp4') || post.media.endsWith('.webm')) {
        mediaHtml = `<video controls width="300" src="${post.media}"></video>`;
      } else {
        mediaHtml = `<img src="${post.media}" width="300" />`;
      }
    }

    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      ${mediaHtml}
      <small>${
  post.posted_at && !isNaN(Date.parse(post.posted_at))
    ? new Date(post.posted_at).toLocaleString()
    : "(no date)"
  }   </small>

      <hr>
    `;

    container.appendChild(postEl);
  });
}
