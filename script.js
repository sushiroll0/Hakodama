// Splash fade logic
setTimeout(() => {
  document.querySelector('.splash').style.display = 'none';
  document.querySelector('.main-content').style.display = 'block';
}, 2000);

// Backend GET test
fetch('http://173.174.240.60:3000/api/hello')
  .then(res => res.json())
  .then(data => {
    document.body.innerHTML += `<p>${data.message}</p>`;
  });

// Submit new blog post
const blogForm = document.getElementById('blog-form');
const confirmation = document.getElementById('confirmation');
const postContainer = document.getElementById('blog-posts');

if (blogForm) {
  blogForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(blogForm);

    const res = await fetch('http://173.174.240.60:3000/api/blog', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();

    if (result.success) {
      confirmation.textContent = 'Post submitted!';
      confirmation.style.color = 'green';
      blogForm.reset();
      loadPosts(); // reload posts after new one added
    } else {
      confirmation.textContent = 'Failed to post.';
      confirmation.style.color = 'red';
    }
  });
}

// ===============================
// 🧰 ADMIN TOOLS (Step 3)
// ===============================
const ADMIN_PASS = "$Sushi12345"; // CHANGE THIS to match server.js

async function deletePost(id) {
  const confirmed = confirm("Are you sure you want to delete this post?");
  if (!confirmed) return;

  const res = await fetch(`http://173.174.240.60:3000/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'x-admin-pass': ADMIN_PASS
    }
  });

  const result = await res.json();
  if (result.success) {
    alert('Post deleted.');
    loadPosts();
  } else {
    alert('Failed to delete post.');
  }
}

async function editPost(button, id) {
  const postDiv = button.closest('.blog-post');
  const titleEl = postDiv.querySelector('h3');
  const contentEl = postDiv.querySelector('p');

  if (button.textContent === "✏️ Edit") {
    titleEl.contentEditable = true;
    contentEl.contentEditable = true;
    button.textContent = "💾 Save";
  } else {
    titleEl.contentEditable = false;
    contentEl.contentEditable = false;
    button.textContent = "✏️ Edit";

    const updatedPost = {
      title: titleEl.textContent.trim(),
      content: contentEl.textContent.trim()
    };

    const res = await fetch(`http://173.174.240.60:3000/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pass': ADMIN_PASS
      },
      body: JSON.stringify(updatedPost)
    });

    const result = await res.json();
    if (result.success) {
      alert('Post updated.');
      loadPosts();
    } else {
      alert('Failed to update post.');
    }
  }
}

// ===============================
// 📬 DISPLAY BLOG POSTS
// ===============================
function renderHashtags(text) {
  return text.replace(/#(\w+)/g, `<span class="hashtag" data-tag="$1">#$1</span>`);
}

async function loadPosts(filterTag = null, searchQuery = "") {
  const res = await fetch('http://173.174.240.60:3000/api/posts');
  const posts = await res.json();

  if (!postContainer) return;

  postContainer.innerHTML = '';

  posts.forEach(post => {
    const matchesTag = !filterTag || post.title.includes(`#${filterTag}`) || post.content.includes(`#${filterTag}`);
    const matchesSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery) || post.content.toLowerCase().includes(searchQuery);

    if (!matchesTag || !matchesSearch) return;

    const postEl = document.createElement('div');
    postEl.className = 'blog-post';

    postEl.innerHTML = `
      <h3 contenteditable="false">${renderHashtags(post.title)}</h3>
      <p contenteditable="false">${renderHashtags(post.content)}</p>
      ${post.image_filename ? `<img src="/uploads/${post.image_filename}" width="300">` : ''}
      <small>Posted at: ${new Date(post.posted_at).toLocaleString()}</small>
      <div class="admin-controls">
        <button onclick="deletePost(${post.id})">🗑️ Delete</button>
        <button onclick="editPost(this, ${post.id})">✏️ Edit</button>
      </div>
      <hr>
    `;

    postContainer.appendChild(postEl);
  });

  // Make hashtags clickable
  document.querySelectorAll('.hashtag').forEach(tag => {
    tag.addEventListener('click', () => {
      const tagText = tag.getAttribute('data-tag');
      const searchVal = document.getElementById('search-bar')?.value.trim().toLowerCase();
      loadPosts(tagText, searchVal);
    });
  });
}

// Add search listener
const searchInput = document.getElementById('search-bar');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    loadPosts(null, searchValue);
  });
}
