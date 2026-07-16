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

  // --- 8. Profile Photo Upload & Persistence ---
  const avatarEditBtn   = document.getElementById('avatar-edit-btn');
  const avatarRemoveBtn  = document.getElementById('avatar-remove-btn');
  const avatarFileInput  = document.getElementById('avatar-file-input');
  const avatarCameraInput = document.getElementById('avatar-camera-input');
  const avatarSourceMenu = document.getElementById('avatar-source-menu');
  const avatarFromFile   = document.getElementById('avatar-from-file');
  const avatarFromCamera = document.getElementById('avatar-from-camera');
  const defaultSvg       = document.getElementById('default-avatar-svg');
  const uploadedImg      = document.getElementById('uploaded-avatar-img');

  const AVATAR_KEY = 'portfolio-avatar';

  /** Show the dropdown menu */
  function openAvatarMenu() {
    if (!avatarSourceMenu) return;
    avatarSourceMenu.hidden = false;
    if (avatarEditBtn) avatarEditBtn.setAttribute('aria-expanded', 'true');
  }

  /** Hide the dropdown menu */
  function closeAvatarMenu() {
    if (!avatarSourceMenu) return;
    avatarSourceMenu.hidden = true;
    if (avatarEditBtn) avatarEditBtn.setAttribute('aria-expanded', 'false');
  }

  /** Apply a base64 image string to the avatar display and localStorage. */
  function applyAvatar(base64) {
    try {
      localStorage.setItem(AVATAR_KEY, base64);
    } catch (err) {
      showToast('Storage full — could not save photo. Try a smaller image.', 'error');
      return;
    }
    if (uploadedImg && defaultSvg) {
      uploadedImg.src = base64;
      uploadedImg.style.display = 'block';
      defaultSvg.style.display = 'none';
    }
    if (avatarRemoveBtn) avatarRemoveBtn.style.display = 'flex';
    showToast('Profile photo updated successfully!', 'success');
  }

  /** Read a File object and pass its base64 result to applyAvatar(). */
  function processImageFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP, etc.)', 'error');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast('Image is too large. Please choose a file under 4 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => applyAvatar(evt.target.result);
    reader.readAsDataURL(file);
  }

  /** Restore a previously saved avatar from localStorage on page load. */
  function loadSavedAvatar() {
    const saved = localStorage.getItem(AVATAR_KEY);
    if (saved && uploadedImg && defaultSvg) {
      uploadedImg.src = saved;
      uploadedImg.style.display = 'block';
      defaultSvg.style.display = 'none';
      if (avatarRemoveBtn) avatarRemoveBtn.style.display = 'flex';
    }
  }
  loadSavedAvatar();

  // Toggle dropdown on camera icon click
  if (avatarEditBtn) {
    avatarEditBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = avatarSourceMenu && !avatarSourceMenu.hidden;
      if (isOpen) {
        closeAvatarMenu();
      } else {
        openAvatarMenu();
      }
    });
  }

  // "Browse Files" option → standard file picker
  if (avatarFromFile) {
    avatarFromFile.addEventListener('click', () => {
      closeAvatarMenu();
      if (avatarFileInput) avatarFileInput.click();
    });
  }

  // Camera Modal elements
  const cameraModal = document.getElementById('camera-modal');
  const cameraVideo = document.getElementById('camera-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  const cameraCaptureBtn = document.getElementById('camera-capture-btn');
  const cameraCloseBtn = document.getElementById('camera-close-btn');
  let localStream = null;

  function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(s => {
        localStream = s;
        if (cameraVideo) {
          cameraVideo.srcObject = localStream;
          cameraVideo.play();
        }
        if (cameraModal) cameraModal.removeAttribute('hidden');
      })
      .catch(err => {
        console.warn('WebRTC webcam permission error or not supported:', err);
        showToast('Webcam not accessible. Opening system camera instead.', 'error');
        // Fallback: trigger standard mobile capture input
        if (avatarCameraInput) avatarCameraInput.click();
      });
  }

  function stopWebcam() {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }
    if (cameraVideo) {
      cameraVideo.srcObject = null;
    }
    if (cameraModal) cameraModal.setAttribute('hidden', '');
  }

  // "Take a Photo" option → starts Webcam and opens modal, or triggers camera fallback
  if (avatarFromCamera) {
    avatarFromCamera.addEventListener('click', () => {
      closeAvatarMenu();
      startWebcam();
    });
  }

  // Handle capture button click
  if (cameraCaptureBtn) {
    cameraCaptureBtn.addEventListener('click', () => {
      if (cameraVideo && cameraCanvas) {
        const width = cameraVideo.videoWidth || 640;
        const height = cameraVideo.videoHeight || 480;
        cameraCanvas.width = width;
        cameraCanvas.height = height;
        const ctx = cameraCanvas.getContext('2d');
        
        // Mirror the image for selfie preview logic
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(cameraVideo, 0, 0, width, height);

        const dataUrl = cameraCanvas.toDataURL('image/jpeg', 0.85);
        applyAvatar(dataUrl);
        stopWebcam();
      }
    });
  }

  // Handle cancel button click in modal
  if (cameraCloseBtn) {
    cameraCloseBtn.addEventListener('click', () => {
      stopWebcam();
    });
  }

  // Handle file chosen from file browser
  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', (e) => {
      processImageFile(e.target.files[0]);
      avatarFileInput.value = '';
    });
  }

  // Handle camera capture fallback (native device dialog)
  if (avatarCameraInput) {
    avatarCameraInput.addEventListener('change', (e) => {
      processImageFile(e.target.files[0]);
      avatarCameraInput.value = '';
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (avatarSourceMenu && !avatarSourceMenu.hidden) {
      if (!avatarSourceMenu.contains(e.target) && e.target !== avatarEditBtn) {
        closeAvatarMenu();
      }
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && avatarSourceMenu && !avatarSourceMenu.hidden) {
      closeAvatarMenu();
      if (avatarEditBtn) avatarEditBtn.focus();
    }
  });

  // Remove photo button
  if (avatarRemoveBtn) {
    avatarRemoveBtn.addEventListener('click', () => {
      localStorage.removeItem(AVATAR_KEY);
      if (uploadedImg && defaultSvg) {
        uploadedImg.src = '';
        uploadedImg.style.display = 'none';
        defaultSvg.style.display = 'block';
      }
      avatarRemoveBtn.style.display = 'none';
      showToast('Profile photo removed.', 'success');
    });
  }

  // --- 9. CV / Resume Upload & Persistence ---
  const uploadCvBtn   = document.getElementById('upload-cv-btn');
  const removeCvBtn   = document.getElementById('remove-cv-btn');
  const cvFileInput   = document.getElementById('cv-file-input');
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const footerCvBtn   = document.getElementById('footer-cv-btn');

  const CV_KEY         = 'portfolio-cv';
  const CV_DEFAULT_URL = 'assets/resume.pdf';
  const CV_DEFAULT_DL  = 'Fsha_Mekonen_Resume.pdf';

  /**
   * Update all CV download anchors to point to the given href / filename.
   */
  function setCvLinks(href, filename) {
    [downloadCvBtn, footerCvBtn].forEach(el => {
      if (!el) return;
      el.href = href;
      el.setAttribute('download', filename);
    });
  }

  /**
   * Render the "custom CV active" badge next to the upload button.
   */
  function renderCvBadge(show) {
    let badge = document.getElementById('cv-uploaded-badge');
    if (show) {
      if (!badge && uploadCvBtn) {
        badge = document.createElement('span');
        badge.id = 'cv-uploaded-badge';
        badge.className = 'cv-uploaded-badge';
        badge.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="3"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Custom CV`;
        // Insert after the upload button's parent wrapper
        uploadCvBtn.parentElement.appendChild(badge);
      }
      if (removeCvBtn) removeCvBtn.style.display = 'flex';
    } else {
      if (badge) badge.remove();
      if (removeCvBtn) removeCvBtn.style.display = 'none';
    }
  }

  /**
   * Restore a previously saved CV from localStorage on page load.
   */
  function loadSavedCv() {
    const saved = localStorage.getItem(CV_KEY);
    if (saved) {
      setCvLinks(saved, 'Fsha_Mekonen_Resume.pdf');
      renderCvBadge(true);
    }
  }
  loadSavedCv();

  if (uploadCvBtn) {
    uploadCvBtn.addEventListener('click', () => {
      if (cvFileInput) cvFileInput.click();
    });
  }

  if (cvFileInput) {
    cvFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        showToast('Please select a valid PDF file.', 'error');
        return;
      }

      // PDFs in localStorage: warn if > 3 MB
      if (file.size > 3 * 1024 * 1024) {
        showToast('PDF is too large. Please choose a file under 3 MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target.result;
        try {
          localStorage.setItem(CV_KEY, base64);
        } catch (err) {
          showToast('Storage full — could not save CV. Try a smaller PDF.', 'error');
          return;
        }

        setCvLinks(base64, 'Fsha_Mekonen_Resume.pdf');
        renderCvBadge(true);
        showToast('CV uploaded! "Download CV" now serves your file.', 'success');
      };
      reader.readAsDataURL(file);

      // Reset input so same file can be re-selected
      cvFileInput.value = '';
    });
  }

  if (removeCvBtn) {
    removeCvBtn.addEventListener('click', () => {
      localStorage.removeItem(CV_KEY);
      setCvLinks(CV_DEFAULT_URL, CV_DEFAULT_DL);
      renderCvBadge(false);
      showToast('CV reset to the default resume.', 'success');
    });
  }
});
