let editingPostId = null;

// When the page loads, fetch and display posts
document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();

  const form = document.getElementById('blog-form');
  const submitButton = document.getElementById('submit-button');
  const cancelButton = document.getElementById('cancel-edit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      let response;

      if (editingPostId) {
        // ✏️ Edit existing post
        response = await fetch(`/posts/${editingPostId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            title: formData.get('title'),
            content: formData.get('content')
          })
        });
        editingPostId = null;
      } else {
        // 🆕 New post
        response = await fetch('/submit', {
          method: 'POST',
          body: formData
        });
      }

      const text = await response.text();
      console.log("Server response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        document.getElementById('confirmation').innerText = '❌ Server error.';
        return;
      }

      if (result.success) {
        document.getElementById('confirmation').innerText = '✅ Post submitted!';
        form.reset();
        submitButton.innerText = 'Post';
        cancelButton.style.display = 'none';
        fetchPosts();
      } else {
        document.getElementById('confirmation').innerText = '❌ Something went wrong.';
      }

    } catch (err) {
      console.error("🚨 Submit error:", err);
      document.getElementById('confirmation').innerText = '❌ Server error.';
    }
  });

  // 🔁 Cancel edit button
  cancelButton.addEventListener('click', () => {
    editingPostId = null;
    form.reset();
    submitButton.innerText = 'Post';
    cancelButton.style.display = 'none';
    document.getElementById('confirmation').innerText = '';
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
// This part was added right before this commit. I had a loop that did not recognize the .mov file. 
// displayed as an image. So it would play as a video but without sound, stop, or pause menu. previous code is in this commit
// Commit 5378536 look at your changes in this commits. I will add all comments there. 
    
    const videoExtensions = ['.mp4', '.webm', '.mov'];
const isVideo = videoExtensions.some(ext => post.media.toLowerCase().endsWith(ext));

if (post.media) {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ts'];
  const isVideo = videoExtensions.some(ext =>
    post.media.toLowerCase().endsWith(ext)
  );

  if (isVideo) {
    mediaHtml = `
      <video controls width="300">
        <source src="${post.media}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  } else {
    mediaHtml = `<img src="${post.media}" width="300" />`;
  }
}


// !!!Attention!!! line 109 allows copy code, and 110 formats text content to be just as it was posted by user. Line 111 needs this: ${post.content}
    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <div class="code-wrapper">
      <button class="copy-code-button">📋 Copy</button>
      <pre class="blog-post-content">${post.content}</pre> 
      </div>
      ${mediaHtml}
     <div class="timestamp">${
        post.posted_at && !isNaN(Date.parse(post.posted_at))
          ? (() => {
              const date = new Date(post.posted_at);
              const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
              return local.toLocaleString(undefined, {
                dateStyle: 'short',
                timeStyle: 'short'
              });
            })()
          : "(no date)"
      }</div>
      <br>
      <button class="edit-post" data-id="${post.id}" data-title="${encodeURIComponent(post.title)}" data-content="${encodeURIComponent(post.content)}">✏️ Edit</button>
      <button class="delete-post" data-id="${post.id}">🗑️ Delete</button>
      <hr>
    `;

    container.appendChild(postEl);
// 📋 Enable copy button after rendering posts
document.querySelectorAll('.copy-code-button').forEach(button => {
  button.addEventListener('click', () => {
    const code = button.nextElementSibling.textContent;

    navigator.clipboard.writeText(code).then(() => {
      button.textContent = '✅ Copied!';
      setTimeout(() => {
        button.textContent = '📋 Copy';
      }, 1500);
    }).catch(err => {
      console.error('Copy failed:', err);
      button.textContent = '❌ Error';
    });
  });
});

    
  });

  // 🗑️ Handle delete buttons
  document.querySelectorAll('.delete-post').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      if (!confirm('Delete this post?')) return;

      const res = await fetch(`/posts/${id}`, {
        method: 'DELETE'
      });

      const result = await res.json();
      if (result.success) {
        fetchPosts();
      } else {
        alert('❌ Failed to delete post.');
      }
    });
  });

  // ✏️ Handle edit buttons
  document.querySelectorAll('.edit-post').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const title = decodeURIComponent(button.getAttribute('data-title'));
      const content = decodeURIComponent(button.getAttribute('data-content'));

      document.querySelector('input[name="title"]').value = title;
      document.querySelector('textarea[name="content"]').value = content;

      editingPostId = id;
      document.getElementById('confirmation').innerText = '✏️ Editing post...';
      document.getElementById('submit-button').innerText = 'Save Changes';
      document.getElementById('cancel-edit').style.display = 'inline-block';
    });
  });
}
