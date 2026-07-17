/**
 * main.js
 * Controls core interaction, mobile navigation, filtering systems, and contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Page Preloader ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
    // Fallback: remove preloader after 3 seconds in case window load takes too long
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.style.display = 'none', 500);
      }
    }, 3000);
  }

  // --- 2. Navbar Scroll Effects & Mobile Toggle ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change nav style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  });

  // Mobile Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // --- 3. Smooth Scrolling with Offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 4. Filtering System (Projects and Skills) ---
  const initFilter = (filterNavSelector, itemsSelector) => {
    const filterNav = document.querySelector(filterNavSelector);
    const items = document.querySelectorAll(itemsSelector);

    if (filterNav) {
      filterNav.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.filter-btn');
        if (!targetBtn) return;

        // Toggle Active Button
        filterNav.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        targetBtn.classList.add('active');

        const filterValue = targetBtn.getAttribute('data-filter');

        items.forEach(item => {
          // Reset elements animation delay
          item.style.animationDelay = '0s';
          
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300); // match standard transitions duration
          }
        });
      });
    }
  };

  // Run filters
  initFilter('.project-filters', '.project-card-wrapper');
  initFilter('.skills-filters', '.skill-card-wrapper');

  // --- 5. Contact Form Validation & Submission ---
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      
      let isValid = true;

      // 5.1 Real-time validation clear
      const inputs = [nameInput, emailInput, subjectInput, messageInput];
      inputs.forEach(input => {
        const group = input.closest('.form-group');
        group.classList.remove('error');
        const errSpan = group.querySelector('.error-msg');
        if (errSpan) errSpan.textContent = '';
      });

      // 5.2 Validate Name
      if (nameInput.value.trim().length < 2) {
        setError(nameInput, 'Name must be at least 2 characters long.');
        isValid = false;
      }

      // 5.3 Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      // 5.4 Validate Subject
      if (subjectInput.value.trim().length < 4) {
        setError(subjectInput, 'Subject must be at least 4 characters long.');
        isValid = false;
      }

      // 5.5 Validate Message
      if (messageInput.value.trim().length < 10) {
        setError(messageInput, 'Message must be at least 10 characters long.');
        isValid = false;
      }

      if (isValid) {
        // Mock Form Submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="loader-spinner"></span> Sending...`;

        // Simulate network latency
        setTimeout(() => {
          showToast('Message sent successfully! I will get back to you shortly.', 'success');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 1500);
      } else {
        showToast('Please fix the errors in the form.', 'error');
      }
    });
  }

  function setError(input, message) {
    const group = input.closest('.form-group');
    group.classList.add('error');
    const errSpan = group.querySelector('.error-msg');
    if (errSpan) {
      errSpan.textContent = message;
    }
  }

  // --- 6. Custom Toast Notification Service ---
  function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close-btn" aria-label="Close message">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Auto Remove after 4 seconds
    const autoRemove = setTimeout(() => {
      removeToast(toast);
    }, 4000);

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      clearTimeout(autoRemove);
      removeToast(toast);
    });
  }

  function removeToast(toast) {
    toast.classList.add('toast-exit');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }

  // --- 7. Back To Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
