/* ==========================================================================
   AQUA BASE GROUP & ASIAN AQUA PRODUCTS - SITE-WIDE ANIMATIONS ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientLightCanvas();
  initSafeGSAPScrollAnimations();
  initMagneticButtons();
});

// 1. Ambient Light Water Bubble Canvas
function initAmbientLightCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const bubbles = [];
  const bubbleCount = window.innerWidth < 768 ? 18 : 35;

  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: Math.sin(Math.random() * Math.PI) * 0.3,
      opacity: Math.random() * 0.2 + 0.05
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    bubbles.forEach(b => {
      b.y -= b.speedY;
      b.x += Math.sin(b.y * 0.008) * 0.3;

      if (b.y < -10) {
        b.y = height + 10;
        b.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(2, 132, 199, ${b.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(2, 132, 199, 0.15)';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// 2. Safe GSAP Site-Wide Animations (Guarantees ALL elements are visible by default)
function initSafeGSAPScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // A. Hero Section Staggered Entrance
  const heroContent = document.querySelectorAll('.hero-badge-strip, .hero-title, .hero-description, .hero-cta-group');
  if (heroContent.length > 0) {
    gsap.from(heroContent, {
      y: 25,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }

  const heroMainCard = document.querySelector('.hero-main-card');
  if (heroMainCard) {
    gsap.from(heroMainCard, {
      y: 30,
      scale: 0.96,
      duration: 0.9,
      delay: 0.2,
      ease: 'power2.out'
    });
  }

  // B. Section Headers Entrance Reveal
  const sectionHeaders = document.querySelectorAll('.section-header, .page-header-banner .container');
  sectionHeaders.forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 25,
      duration: 0.7,
      ease: 'power2.out'
    });
  });

  // C. Trust Items Staggered Reveal (Non-destructive transform)
  const trustItems = document.querySelectorAll('.trust-item');
  if (trustItems.length > 0) {
    gsap.from(trustItems, {
      scrollTrigger: {
        trigger: '.trust-bar-section',
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 25,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }

  // D. General Cards Staggered Reveal across ALL pages
  const cardSelectGroups = [
    '.product-card',
    '.roadmap-step-item',
    '.why-card',
    '.dealer-card',
    '.solution-card',
    '.blog-card',
    '.cert-card',
    '.pipeline-card',
    '.process-step-card',
    '.marquee-card'
  ];

  cardSelectGroups.forEach(selector => {
    const items = document.querySelectorAll(selector);
    if (items.length > 0) {
      items.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            toggleActions: 'play none none none'
          },
          y: 25,
          duration: 0.65,
          ease: 'power2.out'
        });
      });
    }
  });

  // E. Animated Numbers Counter for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const rawTarget = stat.getAttribute('data-count') || '0';
    const target = parseInt(rawTarget.replace(/[^0-9]/g, '')) || 0;
    const suffix = stat.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 88%',
      onEnter: () => {
        let obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            const formatted = Math.floor(obj.val).toLocaleString();
            stat.innerText = formatted + suffix;
          }
        });
      }
    });
  });
}

// 3. Magnetic Button Effect (Desktop Only)
function initMagneticButtons() {
  if (window.innerWidth < 768) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-whatsapp');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
}
