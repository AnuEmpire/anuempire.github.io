document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. STICKY NAVBAR & MOBILE MENU
     ======================================================================== */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 36) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ========================================================================
     2. SCROLL-REVEAL INTERSECTION OBSERVER
     ======================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ========================================================================
     3. 3D TILT & RADIAL GLOW ON FEATURE CARDS
     ======================================================================== */
  const tiltCards = document.querySelectorAll('.tilt-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  /* ========================================================================
     4. CELESTIAL GOLDEN PARTICLE & STARFIELD CANVAS IN HERO
     ======================================================================== */
  const canvas = document.getElementById('celestialCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];

    const resizeCanvas = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      const count = Math.min(65, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.7 + 0.5,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -Math.random() * 0.28 - 0.06,
        alpha: Math.random() * 0.65 + 0.2
      }));
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 198, 95, ${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(animateParticles);
    };

    resizeCanvas();
    createParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    }, { passive: true });
  }

  /* ========================================================================
     5. GALLERY MODAL LIGHTBOX VIEWER
     ======================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const openLightbox = (src, title, meta) => {
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxMeta.textContent = meta;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      openLightbox(
        item.dataset.src,
        item.dataset.title,
        item.dataset.meta
      );
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* ========================================================================
     6. DISCORD CLIPBOARD COPY + EXTERNAL PROFILE LAUNCH + TOAST
     ======================================================================== */
  const discordBtn = document.getElementById('discordBtn');
  const toast = document.getElementById('toast');
  let toastTimeout;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3400);
  };

  if (discordBtn) {
    discordBtn.addEventListener('click', async () => {
      const handle = '.nasturtium';
      try {
        await navigator.clipboard.writeText(handle);
        showToast('Copied Discord ID: .nasturtium');
      } catch (err) {
        const tempInput = document.createElement('input');
        tempInput.value = handle;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Copied Discord ID: .nasturtium');
      }
      window.open('https://discord.com/users/.nasturtium', '_blank', 'noopener,noreferrer');
    });
  }
});