/**
 * Herbo Nutra - Main JS Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year dynamically
  const copyrightYearEl = document.getElementById('copyright-year');
  if (copyrightYearEl) {
    const currentYear = new Date().getFullYear();
    copyrightYearEl.textContent = currentYear;
  }

  // Count-up animation logic for stats
  const animateCountUp = (element, targetValue, duration = 1500) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * targetValue);
      element.textContent = `${currentValue}+`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = `${targetValue}+`;
      }
    };
    window.requestAnimationFrame(step);
  };

  const initStatsObserver = () => {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statValues = document.querySelectorAll('.stat-value');
          statValues.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (target) {
              animateCountUp(el, target);
            }
          });
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(statsSection);
  };

  // Typing animation logic for About title
  const typeText = (element, text, delay, callback) => {
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (callback) callback();
      }
    }, delay);
  };

  const initAboutTypingObserver = () => {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    const line1El = aboutSection.querySelector('.line-1');
    const line2El = aboutSection.querySelector('.line-2');
    const line3El = aboutSection.querySelector('.line-3');

    if (!line1El || !line2El || !line3El) return;

    // Read initial texts from DOM to prevent copy duplication
    const text1 = line1El.textContent.trim();
    const text2 = line2El.textContent.trim();
    const text3 = line3El.textContent.trim();

    // Clear content immediately
    line1El.textContent = '';
    line2El.textContent = '';
    line3El.textContent = '';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger typing sequence
          typeText(line1El, text1, 40, () => {
            typeText(line2El, text2, 40, () => {
              typeText(line3El, text3, 30);
            });
          });
          observer.unobserve(aboutSection);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(aboutSection);
  };

  initStatsObserver();
  initAboutTypingObserver();
});
