// Sticky header behavior
// Shows a compact header bar once the user scrolls beyond the first fold.
// Requirement: sticky header must appear ABOVE the nav bar.
(function () {
  const stickyHeader = document.querySelector('.sticky-header');
  if (!stickyHeader) return;

  const threshold = window.innerHeight * 0.65;
  let lastScrollY = window.scrollY;

  const setVisible = (visible) => {
    stickyHeader.classList.toggle('sticky-header--visible', visible);
    document.body.classList.toggle('has-sticky-bar', visible);
  };

  const updateHeader = () => {
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastScrollY;

    if (currentY > threshold && scrollingDown) {
      setVisible(true);
    } else if (currentY < threshold || !scrollingDown) {
      setVisible(false);
    }

    lastScrollY = currentY;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
  });
})();

// Header dropdown (Products)
(function () {
  const dropdown = document.querySelector('.nav-dropdown');
  const trigger = document.querySelector('.nav-dropdown__trigger');
  if (!dropdown || !trigger) return;

  const close = () => {
    dropdown.classList.remove('nav-dropdown--open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    dropdown.classList.add('nav-dropdown--open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('nav-dropdown--open');
    if (isOpen) close();
    else open();
  });

  document.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

// Hero carousel (left image in the hero fold)
(function () {
  const img = document.querySelector('.hero-carousel__img');
  const prev = document.querySelector('[data-hero-prev]');
  const next = document.querySelector('[data-hero-next]');
  const thumbs = Array.from(document.querySelectorAll('[data-hero-index]'));
  if (!img || !prev || !next || thumbs.length === 0) return;

  const sources = [
    'https://images.pexels.com/photos/257700/pexels-photo-257700.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ];

  let index = 0;
  const set = (i) => {
    if (i < 0) i = sources.length - 1;
    if (i >= sources.length) i = 0;
    index = i;
    img.src = sources[index];

    thumbs.forEach((t) => {
      const idx = Number(t.getAttribute('data-hero-index'));
      t.classList.toggle('hero-thumb--active', idx === index);
    });
  };

  prev.addEventListener('click', () => set(index - 1));
  next.addEventListener('click', () => set(index + 1));
  thumbs.forEach((t) => {
    t.addEventListener('click', () => {
      const idx = Number(t.getAttribute('data-hero-index'));
      if (!Number.isNaN(idx)) set(idx);
    });
  });
  set(0);
})();

// Carousel & zoom functionality
// Handles image switching and hover-based zoom preview
(function () {
  const mainImage = document.querySelector('.carousel__image');
  const zoomPanel = document.querySelector('.carousel__zoom');
  const lens = document.querySelector('.zoom-lens');
  const thumbnails = Array.from(document.querySelectorAll('.thumb'));
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');

  if (!mainImage || !zoomPanel || thumbnails.length === 0) return;

  const sources = thumbnails.map((thumb) => {
    const img = thumb.querySelector('img');
    return img ? img.src.replace('w=400', 'w=1200') : '';
  });

  let activeIndex = 0;

  const setActiveSlide = (index) => {
    if (index < 0) index = sources.length - 1;
    if (index >= sources.length) index = 0;
    activeIndex = index;

    mainImage.src = sources[activeIndex];

    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('thumb--active', i === activeIndex);
    });

    zoomPanel.style.backgroundImage = `url("${sources[activeIndex]}")`;
    if (lens) {
      lens.style.backgroundImage = `url("${sources[activeIndex]}")`;
    }
  };

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => setActiveSlide(index));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => setActiveSlide(activeIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => setActiveSlide(activeIndex + 1));
  }

  const handleZoomMove = (event) => {
    const rect = mainImage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    zoomPanel.style.backgroundPosition = `${x}% ${y}%`;

    if (lens) {
      const lensRect = lens.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - lensRect.width / 2;
      const offsetY = event.clientY - rect.top - lensRect.height / 2;

      lens.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      lens.style.backgroundPosition = `${x}% ${y}%`;
    }
  };

  const activateZoom = () => {
    zoomPanel.classList.add('carousel__zoom--active');
    if (lens) {
      lens.classList.add('zoom-lens--visible');
    }
  };

  const deactivateZoom = () => {
    zoomPanel.classList.remove('carousel__zoom--active');
    if (lens) {
      lens.classList.remove('zoom-lens--visible');
    }
  };

  mainImage.addEventListener('mouseenter', activateZoom);
  mainImage.addEventListener('mouseleave', deactivateZoom);
  mainImage.addEventListener('mousemove', handleZoomMove);

  setActiveSlide(0);
})();

// Footer year helper
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
})();

// FAQ accordion (single-open)
(function () {
  const root = document.querySelector('[data-accordion]');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.faq-item'));
  const closeItem = (item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'false');
    a.hidden = true;
  };

  const openItem = (item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'true');
    a.hidden = false;
  };

  items.forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    // Ensure initial state matches markup
    const expanded = q.getAttribute('aria-expanded') === 'true';
    a.hidden = !expanded;

    q.addEventListener('click', () => {
      const isExpanded = q.getAttribute('aria-expanded') === 'true';
      items.forEach(closeItem);
      if (!isExpanded) openItem(item);
    });
  });
})();

// Quote form (prevent navigation / console errors)
(function () {
  const form = document.querySelector('[data-quote-form]');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    // Lightweight success feedback without alerts/modals
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const prev = btn.textContent;
    btn.textContent = 'Submitted';
    btn.disabled = true;
    window.setTimeout(() => {
      btn.textContent = prev;
      btn.disabled = false;
    }, 1400);
  });
})();

