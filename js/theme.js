/**
 * theme.js
 * Manages light/dark mode and theme persistence.
 */

(function () {
  const THEME_STORAGE_KEY = 'portfolio-theme';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  // Get saved theme or check system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Default to dark theme as required, check system pref for light
    const userPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return userPrefersLight ? LIGHT_THEME : DARK_THEME;
  }

  // Apply theme to document element
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Update theme toggle buttons if they exist
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        if (theme === LIGHT_THEME) {
          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
          btn.setAttribute('aria-label', 'Switch to dark mode');
        } else {
          icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
          btn.setAttribute('aria-label', 'Switch to light mode');
        }
      }
    });
  }

  // Toggle theme callback
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DARK_THEME;
    const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    applyTheme(newTheme);
  }

  // Initialize theme early to prevent flash of light/dark theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Expose toggle globally and register listeners on DOMContentLoaded
  window.toggleTheme = toggleTheme;

  document.addEventListener('DOMContentLoaded', () => {
    // Re-apply correct theme and setup toggle listener
    applyTheme(getPreferredTheme());
    
    document.body.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.theme-toggle-btn');
      if (toggleBtn) {
        toggleTheme();
      }
    });
  });
})();
