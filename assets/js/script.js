/* ========================================
   TERCERO TABLADA — v2 EPIC SCRIPTS
   ======================================== */

(function () {
  'use strict';

  // ---------- DOM ELEMENTS ----------
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const langToggle = document.getElementById('langToggle');
  const contactForm = document.getElementById('contactForm');
  const scrollProgress = document.getElementById('scrollProgress');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let currentLang = 'en';

  // ---------- SCROLL PROGRESS BAR ----------
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ---------- HEADER SCROLL ----------
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', function () {
    handleHeaderScroll();
    updateScrollProgress();
  }, { passive: true });

  // ---------- CUSTOM CURSOR ----------
  function initCustomCursor() {
    if (!cursorDot || !cursorRing) return;
    // Only on devices with hover capability (desktop)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
      return;
    }

    document.body.classList.add('cursor-active');

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      dotX = targetX;
      dotY = targetY;
      cursorDot.style.transform = 'translate(' + (dotX - 3) + 'px, ' + (dotY - 3) + 'px)';
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      cursorRing.style.transform = 'translate(' + (ringX - 18) + 'px, ' + (ringY - 18) + 'px)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverables = document.querySelectorAll('a, button, .project-card, .service-card, input, textarea, select, [data-magnetic]');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorRing.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        cursorRing.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cursorDot.style.opacity = '';
      cursorRing.style.opacity = '';
    });
  }

  // ---------- MAGNETIC BUTTONS ----------
  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const magnetics = document.querySelectorAll('[data-magnetic]');
    magnetics.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.4) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  // ---------- TILT EFFECT ON CARDS ----------
  function initTiltEffect() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const tiltables = document.querySelectorAll('[data-tilt]');
    tiltables.forEach(function (el) {
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'transform 0.3s var(--ease-out)';

      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = y * -8;
        const rotateY = x * 8;
        el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  // ---------- HAMBURGER MENU ----------
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // ---------- LANGUAGE TOGGLE ----------
  function setLanguage(lang) {
    currentLang = lang;
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(function (el) {
      const text = el.getAttribute('data-' + lang);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Update toggle button display
    if (langToggle) {
      const activeSpan = langToggle.querySelector('.lang-active');
      const inactiveSpan = langToggle.querySelector('.lang-inactive');
      if (activeSpan && inactiveSpan) {
        if (lang === 'en') {
          activeSpan.textContent = 'EN';
          inactiveSpan.textContent = 'ES';
        } else {
          activeSpan.textContent = 'ES';
          inactiveSpan.textContent = 'EN';
        }
      }
    }

    document.documentElement.lang = lang;
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const newLang = currentLang === 'en' ? 'es' : 'en';
      setLanguage(newLang);
    });
  }

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- SCROLL ANIMATIONS ----------
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(function (el) {
        el.classList.add('aos-animate');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay');
          if (delay) {
            setTimeout(function () {
              entry.target.classList.add('aos-animate');
            }, parseInt(delay));
          } else {
            entry.target.classList.add('aos-animate');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('aos-animate');
      } else {
        observer.observe(el);
      }
    });
  }

  // ---------- COUNTER ANIMATION ----------
  function animateCounters() {
    const counters = document.querySelectorAll('.stat__number[data-count]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'));
          const duration = 2200;
          let startTime = null;

          function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            entry.target.textContent = Math.floor(eased * target);
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              entry.target.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  // ---------- FILE UPLOAD DISPLAY ----------
  function setupFileUpload(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    if (!input || !list) return;

    input.addEventListener('change', function () {
      list.innerHTML = '';
      const maxSize = 25 * 1024 * 1024;
      Array.from(this.files).forEach(function (file) {
        const item = document.createElement('div');
        item.className = 'file-list__item';
        const name = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;
        const size = (file.size / 1024 / 1024).toFixed(1) + 'MB';
        if (file.size > maxSize) {
          item.style.borderColor = '#e74c3c';
          item.innerHTML = '<span style="color:#e74c3c">' + name + ' (' + size + ') — Too large!</span>';
        } else {
          item.innerHTML = '<i class="fa-solid fa-file" style="color:var(--color-accent);font-size:0.7rem"></i><span>' + name + ' (' + size + ')</span>';
        }
        list.appendChild(item);
      });
    });
  }
  setupFileUpload('files', 'fileList');
  setupFileUpload('files-home', 'fileListHome');

  // ---------- PROJECT FILTERS ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        const cards = document.querySelectorAll('.project-card[data-category]');
        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------- CONTACT FORM ----------
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = currentLang === 'en' ? 'Sending...' : 'Enviando...';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = currentLang === 'en' ? 'Message Sent!' : 'Mensaje Enviado!';
        btn.style.background = '#2d8a4e';
        contactForm.reset();

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ---------- PARALLAX ON HERO ----------
  const heroContent = document.querySelector('.hero__content');
  const heroWatermark = document.querySelector('.hero__watermark');
  if (heroContent) {
    function handleParallax() {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
        heroContent.style.opacity = 1 - (scrollY / window.innerHeight);
        if (heroWatermark) {
          heroWatermark.style.transform = 'translate(-50%, calc(-50% + ' + (scrollY * 0.15) + 'px))';
        }
      }
    }
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ---------- ACTIVE NAV LINK (homepage only) ----------
  const isHomepage = !document.querySelector('.page-hero');
  if (isHomepage) {
    function updateActiveNav() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.header__nav a');
      const scrollY = window.scrollY + 200;

      sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === '#' + id || link.getAttribute('href') === id + '.html') {
              link.classList.add('nav-active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }

  // ---------- INIT ----------
  function init() {
    initScrollAnimations();
    animateCounters();
    handleHeaderScroll();
    updateScrollProgress();
    initCustomCursor();
    initMagneticButtons();
    initTiltEffect();
  }

  document.addEventListener('DOMContentLoaded', init);

  if (document.readyState !== 'loading') {
    init();
  }

})();
