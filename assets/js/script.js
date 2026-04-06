/* ========================================
   TERCERO TABLADA - SCRIPTS
   ======================================== */

(function () {
  'use strict';

  // ---------- DOM ELEMENTS ----------
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const langToggle = document.getElementById('langToggle');
  const contactForm = document.getElementById('contactForm');

  let currentLang = 'en';

  // ---------- HEADER SCROLL ----------
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ---------- HAMBURGER MENU ----------
  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---------- LANGUAGE TOGGLE ----------
  function setLanguage(lang) {
    currentLang = lang;
    var elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Update toggle button display
    var activeSpan = langToggle.querySelector('.lang-active');
    var inactiveSpan = langToggle.querySelector('.lang-inactive');
    if (lang === 'en') {
      activeSpan.textContent = 'EN';
      inactiveSpan.textContent = 'ES';
    } else {
      activeSpan.textContent = 'ES';
      inactiveSpan.textContent = 'EN';
    }

    // Update html lang attribute
    document.documentElement.lang = lang;
  }

  langToggle.addEventListener('click', function () {
    var newLang = currentLang === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  });

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- SCROLL ANIMATIONS (Simple AOS replacement) ----------
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('[data-aos]');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      animatedElements.forEach(function (el) {
        el.classList.add('aos-animate');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-aos-delay');
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
      rootMargin: '0px 0px 0px 0px'
    });

    animatedElements.forEach(function (el) {
      // If element is already in viewport on load, animate immediately
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('aos-animate');
      } else {
        observer.observe(el);
      }
    });
  }

  // ---------- COUNTER ANIMATION ----------
  function animateCounters() {
    var counters = document.querySelectorAll('.stat__number[data-count]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.getAttribute('data-count'));
          var duration = 2000;
          var start = 0;
          var startTime = null;

          function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

  // ---------- FILE UPLOAD DISPLAY (all forms) ----------
  function setupFileUpload(inputId, listId) {
    var input = document.getElementById(inputId);
    var list = document.getElementById(listId);
    if (!input || !list) return;

    input.addEventListener('change', function () {
      list.innerHTML = '';
      var maxSize = 25 * 1024 * 1024; // 25MB
      Array.from(this.files).forEach(function (file, i) {
        var item = document.createElement('div');
        item.className = 'file-list__item';
        var name = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;
        var size = (file.size / 1024 / 1024).toFixed(1) + 'MB';
        if (file.size > maxSize) {
          item.style.borderColor = '#e74c3c';
          item.innerHTML = '<span style="color:#e74c3c">' + name + ' (' + size + ') — Too large!</span>';
        } else {
          item.innerHTML = '<span>' + name + ' (' + size + ')</span>';
        }
        list.appendChild(item);
      });
    });
  }
  setupFileUpload('files', 'fileList');
  setupFileUpload('files-home', 'fileListHome');

  // ---------- PROJECT FILTERS ----------
  var filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.getAttribute('data-filter');
        var cards = document.querySelectorAll('.project-card[data-category]');
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
      var btn = this.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = currentLang === 'en' ? 'Sending...' : 'Enviando...';
      btn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
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

  // ---------- PARALLAX EFFECT ON HERO (homepage only) ----------
  var heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    function handleParallax() {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
        heroContent.style.opacity = 1 - (scrollY / window.innerHeight);
      }
    }
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ---------- ACTIVE NAV LINK (homepage only, skip on subpages) ----------
  var isHomepage = !document.querySelector('.page-hero');
  if (isHomepage) {
    function updateActiveNav() {
      var sections = document.querySelectorAll('section[id]');
      var navLinks = document.querySelectorAll('.header__nav a');
      var scrollY = window.scrollY + 200;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = '#c9a84c';
            }
          });
      }
    });
  }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }

  // ---------- INIT ----------
  document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    animateCounters();
    handleHeaderScroll();
  });

  // If DOM already loaded
  if (document.readyState !== 'loading') {
    initScrollAnimations();
    animateCounters();
    handleHeaderScroll();
  }

})();
