// ===============================
// 📝 SUBMIT NEW BLOG POST
// ===============================
const blogForm = document.getElementById('blog-form');
const confirmation = document.getElementById('confirmation');
const postContainer = document.getElementById('blog-posts');

if (blogForm) {
  blogForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(blogForm);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error:', res.status, errorText);
        confirmation.textContent = `Error ${res.status}: ${errorText}`;
        confirmation.style.color = 'red';
        return;
      }

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
    } catch (err) {
      console.error('Fetch failed:', err);
      confirmation.textContent = 'Submission failed.';
      confirmation.style.color = 'red';
    }
  });
}
// ===============================
// 👻 REVEAL MAIN CONTENT AFTER SPLASH
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const splash = document.querySelector('.splash');
  const mainContent = document.querySelector('.main-content');

  // Reveal main content after splash fade (matches 5s animation)
  setTimeout(() => {
    if (mainContent) {
      mainContent.style.display = 'block';
    }
  }, 5000); // adjust if your splash duration is different
});

// ===============================
// 🧰 ADMIN TOOLS
// ===============================
const ADMIN_PASS = "$Sushi12345"; // Match this with server.js

async function deletePost(id) {
  const confirmed = confirm("Are you sure you want to delete this post?");
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-pass': ADMIN_PASS
      }
    });

    if (!res.ok) throw new Error('Server error');

    const result = await res.json();
    if (result.success) {
      alert('Post deleted.');
      loadPosts();
    } else {
      alert('Failed to delete post.');
    }
  } catch (err) {
    alert('Error deleting post.');
    console.error(err);
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

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pass': ADMIN_PASS
        },
        body: JSON.stringify(updatedPost)
      });

      if (!res.ok) throw new Error('Server error');

      const result = await res.json();
      if (result.success) {
        alert('Post updated.');
        loadPosts();
      } else {
        alert('Failed to update post.');
      }
    } catch (err) {
      alert('Error updating post.');
      console.error(err);
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
  try {
    const res = await fetch('/api/posts');

    if (!res.ok) throw new Error('Failed to load posts');

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
  } catch (err) {
    console.error('Error loading posts:', err);
    if (postContainer) {
      postContainer.innerHTML = '<p style="color:red;">Failed to load posts.</p>';
    }
  }
}

// ===============================
// 🔍 SEARCH BAR LISTENER
// ===============================
const searchInput = document.getElementById('search-bar');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    loadPosts(null, searchValue);
  });
}




/* ✅ script.js: Add this at the bottom */
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const overlay = document.getElementById("overlay");

  if (hamburger && navMenu && overlay) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("show");
      overlay.classList.toggle("show");
    });

    overlay.addEventListener("click", () => {
      navMenu.classList.remove("show");
      overlay.classList.remove("show");
    });
  }
});

