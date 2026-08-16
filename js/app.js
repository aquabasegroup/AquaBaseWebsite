/* ==========================================================================
   AQUA BASE GROUP & ASIAN AQUA PRODUCTS - CLIENT APPLICATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarHighlighter();
  initMobileDrawer();
  initProductExplorer();
  initBeforeAfterSlider();
  initDosageCalculator();
  initFAQAccordion();
  initFormHandlers();
  initReviewsMarquee();
});

// 1. Multi-Page Active Nav Link & Header Scroll Engine
function initNavbarHighlighter() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// 2. Mobile Drawer Navigation
function initMobileDrawer() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.close-nav');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => mobileNav.classList.add('active'));
  }
  if (closeBtn && mobileNav) {
    closeBtn.addEventListener('click', () => mobileNav.classList.remove('active'));
  }
}

// 3. Interactive Product Catalogue & Modal Engine
function initProductExplorer() {
  const container = document.getElementById('products-grid-container');
  if (!container) return;

  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('product-search-input');

  let currentCategory = 'all';
  let searchQuery = '';

  // Check URL params for preselected filter (e.g. products.html?filter=plankton)
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
    currentCategory = filterParam;
    filterBtns.forEach(b => {
      if (b.getAttribute('data-filter') === filterParam) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  function renderProducts() {
    if (typeof productsData === 'undefined') return;

    const filtered = productsData.filter(p => {
      const matchCat = currentCategory === 'all' || p.category === currentCategory || (p.tags && p.tags.includes(currentCategory));
      const matchSearch = p.name.toLowerCase().includes(searchQuery) ||
                          (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery)) ||
                          (p.shortDesc && p.shortDesc.toLowerCase().includes(searchQuery)) ||
                          (p.description && p.description.toLowerCase().includes(searchQuery)) ||
                          (p.benefits && p.benefits.some(b => b.toLowerCase().includes(searchQuery)));
      return matchCat && matchSearch;
    });

    // Remove existing toggle button container if present
    let existingWrapper = document.getElementById('mobile-more-products-wrapper');
    if (existingWrapper) {
      existingWrapper.remove();
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem;" class="glass-card">
          <i class="fas fa-search" style="font-size: 2.5rem; color: var(--brand-blue); margin-bottom: 1rem;"></i>
          <h3>No products match your search</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">Try selecting another category filter or resetting your search query.</p>
        </div>
      `;
      return;
    }

    // Default to mobile-collapsed state (shows only 3 on mobile)
    container.classList.add('mobile-collapsed');

    container.innerHTML = filtered.map(p => {
      const badge = p.badge || p.badgeText || 'Certified';
      const categoryLabel = p.categoryLabel || p.category;
      const desc = p.shortDesc || p.subtitle || p.description;
      const dosage = p.dosage || p.dosageSummary || 'Consult Aqua Expert';
      const waLink = `https://wa.me/919114222777?text=Hi%20Asian%20Aqua%20Products%2C%20I%20want%20to%20order%20${encodeURIComponent(p.name)}`;

      return `
        <div class="glass-card product-card" data-id="${p.id}">
          <div class="product-card-top">
            <div class="product-card-header-bar">
              <span class="product-category-label">${categoryLabel}</span>
              <span class="product-badge-tag">${badge}</span>
            </div>

            <div class="product-card-img-wrapper">
              <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy">
            </div>

            <h3 class="product-card-title">${p.name}</h3>
            <p class="product-card-desc">${desc}</p>
          </div>

          <div class="product-card-bottom">
            <div class="product-dosage-box">
              <i class="fas fa-prescription-bottle-alt"></i>
              <span><strong>Dosage:</strong> ${dosage}</span>
            </div>

            <div class="product-card-actions">
              <button class="btn btn-outline view-specs-btn" onclick="openProductModal('${p.id}')">
                <i class="fas fa-info-circle"></i> Specs
              </button>
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                <i class="fab fa-whatsapp"></i> Buy
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Append Mobile More Products Button if > 3 items
    if (filtered.length > 3) {
      const moreBtnWrapper = document.createElement('div');
      moreBtnWrapper.id = 'mobile-more-products-wrapper';
      moreBtnWrapper.className = 'mobile-more-products-wrapper';
      moreBtnWrapper.innerHTML = `
        <button id="mobile-toggle-products-btn" class="btn btn-outline">
          <i class="fas fa-chevron-down"></i> View More Products (+${filtered.length - 3} More)
        </button>
      `;
      container.parentNode.insertBefore(moreBtnWrapper, container.nextSibling);

      const toggleBtn = document.getElementById('mobile-toggle-products-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          container.classList.toggle('mobile-collapsed');
          const isCollapsed = container.classList.contains('mobile-collapsed');
          toggleBtn.innerHTML = isCollapsed
            ? `<i class="fas fa-chevron-down"></i> View More Products (+${filtered.length - 3} More)`
            : `<i class="fas fa-chevron-up"></i> Show Fewer Products`;
        });
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  renderProducts();
}

// 4. Modal Specs Popup Engine (Accurate Brochure Verified Specifications)
function openProductModal(productId) {
  if (typeof productsData === 'undefined') return;

  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const modalContent = document.getElementById('modal-product-content');
  if (!modal || !modalContent) return;

  const name = product.name || 'Product Specifications';
  const badge = product.badge || product.badgeText || 'Certified Quality';
  const categoryLabel = product.categoryLabel || product.category || 'Aquaculture Supplement';
  const tagline = product.tagline || product.subtitle || product.shortDesc || '';
  const composition = product.composition || 'Scientific aquaculture formulation';
  const targetIssues = product.targetIssues || product.targetSymptoms || 'Pond health & disease prevention';
  const dosage = product.dosage || product.dosageSummary || 'Consult Aqua Consultant';
  const packaging = product.packaging || product.packSizes || 'Standard Packaging';
  const quality = product.qualityAssurance || 'ISO 9001:2015 & cGMP Assured | 100% Antibiotic-Free';
  const benefits = Array.isArray(product.benefits) && product.benefits.length > 0
    ? product.benefits
    : ['Scientifically tested formulation', 'Maximizes crop survival and pond yield'];
  const waLink = product.whatsappLink || `https://wa.me/919114222777?text=Hi%20Asian%20Aqua%20Products%2C%20I%20want%20to%20order%20${encodeURIComponent(name)}`;

  modalContent.innerHTML = `
    <div class="modal-product-layout">
      <div class="modal-product-img-box">
        <img src="${product.image}" alt="${name}" loading="lazy">
        <span class="badge-chip badge-chip-green" style="margin-top: 1rem; display: inline-block;">${badge}</span>
      </div>

      <div class="modal-product-details">
        <span class="product-category-label">${categoryLabel}</span>
        <h2 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-heading);">${name}</h2>
        <p style="color: var(--text-muted); font-size: 1.02rem; margin-bottom: 1.4rem; line-height: 1.55;">${tagline}</p>

        <table class="modal-specs-table">
          <tr><th>Active Composition:</th><td>${composition}</td></tr>
          <tr><th>Target Symptoms:</th><td>${targetIssues}</td></tr>
          <tr><th>Standard Dosage:</th><td><strong>${dosage}</strong></td></tr>
          <tr><th>Available Packaging:</th><td>${packaging}</td></tr>
          <tr><th>Quality Assurance:</th><td><span style="color: var(--brand-green); font-weight: 700;">${quality}</span></td></tr>
        </table>

        <h4 style="margin: 1.2rem 0 0.6rem 0; font-size: 1.05rem; color: var(--brand-blue);">Key Benefits & Efficacy:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.8rem;">
          ${benefits.map(b => `<li style="font-size: 0.93rem; line-height: 1.5;"><i class="fas fa-check-circle" style="color: var(--brand-green); margin-right: 0.5rem;"></i> ${b}</li>`).join('')}
        </ul>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1; min-width: 200px;">
            <i class="fab fa-whatsapp"></i> Order on WhatsApp
          </a>
          <button class="btn btn-outline" onclick="closeProductModal()">Close</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (modal && e.target === modal) {
    closeProductModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
  }
});

// 5. Interactive Before & After Visual Slider
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-slider-container');
  if (!container) return;

  const beforeImg = container.querySelector('.ba-before');
  const handle = container.querySelector('.ba-handle');
  let isDragging = false;

  function updateSlider(x) {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;
    const percentage = (posX / rect.width) * 100;

    beforeImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// 6. Interactive Pond Dosage Calculator
function initDosageCalculator() {
  const acresInput = document.getElementById('calc-pond-area');
  const issueSelect = document.getElementById('calc-issue');

  const nameVal = document.getElementById('calc-rec-product-name');
  const dosageVal = document.getElementById('calc-rec-dosage-val');
  const qtyVal = document.getElementById('calc-rec-qty-val');
  const actionBtn = document.getElementById('calc-rec-action-btn');

  if (!acresInput || !issueSelect) return;

  const issueData = {
    'white-gut': { name: 'G-8 Gut N Grow & AS-4 Plus', dosage: '100g per 1 lakh seed', baseQty: 100, unit: 'g' },
    'ammonia': { name: 'AMMONEX 40% & OXYBASE', dosage: '5 Kg per Acre', baseQty: 5, unit: 'Kg' },
    'soft-shell': { name: 'G-8 Gut N Grow + ASIAN MIN', dosage: '100g per 1 lakh seed', baseQty: 100, unit: 'g' },
    'plankton': { name: 'PLANKTON FOOD 1 & 2 System', dosage: '2 Kg per Acre', baseQty: 2, unit: 'Kg' },
    'black-gill': { name: 'SAFE - 40 Silver Nano', dosage: '1 Litre per Acre', baseQty: 1, unit: 'Litre' },
    'mortality': { name: 'HERBOSOL Tobacco Disinfectant', dosage: '1 Litre per Acre', baseQty: 1, unit: 'Litre' },
    'mineral': { name: 'ASIAN MIN Bio-Minerals', dosage: '10 Kg per Acre', baseQty: 10, unit: 'Kg' }
  };

  function updateCalculator() {
    const acres = parseFloat(acresInput.value) || 1;
    const issueKey = issueSelect.value;
    const data = issueData[issueKey] || issueData['white-gut'];

    const totalQty = (data.baseQty * acres).toFixed(1).replace(/\.0$/, '');

    if (nameVal) nameVal.innerText = data.name;
    if (dosageVal) dosageVal.innerText = data.dosage;
    if (qtyVal) qtyVal.innerText = `${totalQty} ${data.unit}`;

    if (actionBtn) {
      const msg = encodeURIComponent(`Hi Asian Aqua Products, I calculated my pond dosage for ${acres} Acre(s) using ${data.name}. Required Quantity: ${totalQty} ${data.unit}. Please assist me with ordering.`);
      actionBtn.setAttribute('href', `https://wa.me/919114222777?text=${msg}`);
    }
  }

  acresInput.addEventListener('input', updateCalculator);
  issueSelect.addEventListener('change', updateCalculator);
  updateCalculator();
}

// 7. FAQ Accordion Engine
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

// 8. Contact Form Handling
function initFormHandlers() {
  const contactForm = document.getElementById('main-contact-form');
  const dealerForm = document.getElementById('dealer-application-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const phone = document.getElementById('contact-phone').value;
      const message = document.getElementById('contact-message').value;

      const msg = encodeURIComponent(`Hi Asian Aqua Products, my name is ${name} (${phone}). Requirement: ${message}`);
      window.open(`https://wa.me/919114222777?text=${msg}`, '_blank');
    });
  }

  if (dealerForm) {
    dealerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firm = document.getElementById('dealer-name').value;
      const person = document.getElementById('dealer-contact-name').value;
      const phone = document.getElementById('dealer-phone').value;

      const msg = encodeURIComponent(`Hi Asian Aqua Products, I want to apply for a Dealership. Firm Name: ${firm}, Contact Person: ${person}, Phone: ${phone}.`);
      window.open(`https://wa.me/919114222777?text=${msg}`, '_blank');
    });
  }
}

// 9. Auto-Scrolling Review Marquee & Manual Drag Engine
function initReviewsMarquee() {
  const track = document.getElementById('reviews-marquee-track');
  const prevBtn = document.getElementById('review-prev-btn');
  const nextBtn = document.getElementById('review-next-btn');

  if (!track) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // Auto-scroll logic
  let scrollAmount = 1.5;
  let scrollInterval = setInterval(() => {
    if (track.scrollLeft >= (track.scrollWidth - track.clientWidth - 10)) {
      track.scrollLeft = 0; // loop back
    } else {
      track.scrollLeft += scrollAmount;
    }
  }, 20);

  track.addEventListener('mouseenter', () => clearInterval(scrollInterval));
  track.addEventListener('mouseleave', () => {
    scrollInterval = setInterval(() => {
      if (track.scrollLeft >= (track.scrollWidth - track.clientWidth - 10)) {
        track.scrollLeft = 0;
      } else {
        track.scrollLeft += scrollAmount;
      }
    }, 20);
  });

}
