/**
 * animation.js
 * Handles scroll reveals, animated statistics counters, and skill progress fills.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep layout performant
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Statistics Counters ---
  const counterElements = document.querySelectorAll('.stat-number');
  
  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const isFloat = element.getAttribute('data-target').includes('.');
    const duration = 2000; // 2 seconds animation
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = isFloat ? target.toFixed(1) + '+' : Math.floor(target) + '+';
        clearInterval(timer);
      } else {
        element.textContent = isFloat ? current.toFixed(1) + '+' : Math.floor(current) + '+';
      }
    }, stepTime);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(counter => counterObserver.observe(counter));

  // --- Skill Progress Animations ---
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  const skillCircles = document.querySelectorAll('.skill-progress-circle');

  const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-progress');
        
        // Check if linear progress bar
        if (entry.target.classList.contains('skill-progress-bar')) {
          entry.target.style.width = targetWidth;
        } 
        
        // Check if circular progress ring
        if (entry.target.classList.contains('skill-progress-circle')) {
          const circle = entry.target.querySelector('circle.progress-ring-value');
          if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const percent = parseInt(targetWidth.replace('%', ''), 10);
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
          }
        }
        
        observer.unobserve(entry.target);
      }
    });
  };

  const skillObserver = new IntersectionObserver(animateSkills, { threshold: 0.2 });
  
  skillBars.forEach(bar => skillObserver.observe(bar));
  skillCircles.forEach(circle => {
    // Setup initial circumference values
    const ringValue = circle.querySelector('circle.progress-ring-value');
    if (ringValue) {
      const radius = ringValue.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      ringValue.style.strokeDasharray = `${circumference} ${circumference}`;
      ringValue.style.strokeDashoffset = circumference;
    }
    skillObserver.observe(circle);
  });
});
