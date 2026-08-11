/**
 * ==========================================================================
 * GROCERY GALLERY — ADMIN LOGIN LOGIC (admin_login.js)
 * Frontend Authentication Validation with LocalStorage Admin Credentials
 * ==========================================================================
 */

const ADMIN_CREDS_KEY = 'groceryGalleryAdmin';

// Retrieve or Initialize Admin Credentials in LocalStorage
function getAdminCredentials() {
  const stored = localStorage.getItem(ADMIN_CREDS_KEY);
  if (!stored) {
    const defaultCreds = { username: 'HAROON', password: '123' };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaultCreds));
    return defaultCreds;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed && parsed.username && parsed.password) {
      return parsed;
    }
  } catch (e) {
    console.error('Error parsing admin credentials, resetting to default.', e);
  }
  const defaultCreds = { username: 'HAROON', password: '123' };
  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaultCreds));
  return defaultCreds;
}

document.addEventListener('DOMContentLoaded', () => {
  // Ensure default credentials exist
  getAdminCredentials();

  // If already logged in, redirect directly to admin dashboard
  if (localStorage.getItem('groceryGalleryAdminAuth') === 'true') {
    window.location.href = 'admin_dashboard.html';
    return;
  }

  const loginForm = document.getElementById('admin-login-form');
  const errorAlert = document.getElementById('login-error');

  // Password Toggle Eye
  const togglePassBtn = document.getElementById('toggle-login-pass');
  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      const passInput = document.getElementById('admin-password');
      if (passInput) {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePassBtn.innerText = isPass ? '👁️' : '🙈';
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('admin-username');
      const passwordInput = document.getElementById('admin-password');

      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      const currentCreds = getAdminCredentials();

      // Check entered username and password against LocalStorage stored credentials
      if (username === currentCreds.username && password === currentCreds.password) {
        // Set local storage auth flag
        localStorage.setItem('groceryGalleryAdminAuth', 'true');
        
        if (errorAlert) errorAlert.classList.add('hidden');

        // Show feedback & redirect
        const btn = document.getElementById('login-submit-btn');
        if (btn) {
          btn.innerHTML = '<span>Authenticating...</span>';
          btn.disabled = true;
        }

        setTimeout(() => {
          window.location.href = 'admin_dashboard.html';
        }, 500);
      } else {
        // Show professional error
        if (errorAlert) {
          errorAlert.innerText = 'Invalid username or password.';
          errorAlert.classList.remove('hidden');
        }
        if (passwordInput) passwordInput.value = '';
      }
    });
  }
});
