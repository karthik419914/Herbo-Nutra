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

  // Carousel logic for Events & Exhibitions section
  const initCarousel = () => {
    const carousel = document.querySelector('.events-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let intervalId = null;

    const showSlide = (index) => {
      // Remove active class from current slide & dot
      slides[currentIndex].classList.remove('active');
      if (dots.length > currentIndex) dots[currentIndex].classList.remove('active');

      currentIndex = (index + slides.length) % slides.length;

      // Add active class to new slide & dot
      slides[currentIndex].classList.add('active');
      if (dots.length > currentIndex) dots[currentIndex].classList.add('active');
    };

    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlide = () => showSlide(currentIndex - 1);

    const startAutoPlay = () => {
      stopAutoPlay();
      intervalId = setInterval(nextSlide, 2500); // Cross-fade every 3.5 seconds
    };

    const stopAutoPlay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // Restart timer
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay(); // Restart timer
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoPlay(); // Restart timer
      });
    });

    startAutoPlay();

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  };

  initStatsObserver();
  initAboutTypingObserver();
  initCarousel();
});
