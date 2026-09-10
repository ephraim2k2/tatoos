/* ==========================================================================
   DANIEL SILVA TATTOOS - INTERACTIVE APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Components
  initNavbar();
  initHeroSlider();
  initFramerMotion();
  initPortfolioFilter();
  initLightbox();
  initEstimatorCalculator();
  initBookingWizard();
  initFlashBooking();
  initAftercareTabs();
  initFaqAccordion();
});

/* -------------------------------------------------------------------------- */
/* FRAMER MOTION INTERSECTION OBSERVER ANIMATION ENGINE                      */
/* -------------------------------------------------------------------------- */
function initFramerMotion() {
  // Auto-tag structural section elements for Framer Motion entrance animations
  const autoTargets = [
    '.portfolio-header', '.portfolio-card', '.calc-wrapper',
    '.booking-form-card', '.flash-card', '.artist-image-container',
    '.artist-grid > div:last-child', '.aftercare-tabs', '.aftercare-card',
    '.faq-item', '.footer-grid > div', '.hero-content > *'
  ];

  autoTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      if (!el.classList.contains('motion-fade-up') && !el.classList.contains('motion-fade-left') && !el.classList.contains('motion-fade-right')) {
        el.classList.add('motion-fade-up');
        const delayClass = `delay-${(idx % 4) + 1}`;
        el.classList.add(delayClass);
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const motionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const motionElements = document.querySelectorAll('.motion-fade-up, .motion-fade-left, .motion-fade-right, .motion-scale-up');
  motionElements.forEach(el => motionObserver.observe(el));
}

/* -------------------------------------------------------------------------- */
/* HERO IMAGE SLIDER (3 IMAGES IN INFINITE LOOP)                              */
/* -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dots .dot');
  if (slides.length === 0) return;

  let currentIndex = 0;
  const intervalTime = 4500; // 4.5 seconds per slide

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  let autoSlider = setInterval(nextSlide, intervalTime);

  // Manual dot clicking
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(autoSlider);
      goToSlide(index);
      autoSlider = setInterval(nextSlide, intervalTime);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 1. NAVBAR & MOBILE SCROLL BEHAVIOR                                         */
/* -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const mobileFloatingCta = document.getElementById('mobileFloatingCta');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Top Scroll Progress Bar Update
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    if (scrollProgressBar) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
      scrollProgressBar.style.width = `${progressPercent}%`;
    }

    // Hero Background Parallax Depth Effect
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
    }

    // Navbar scrolled glass background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Show floating quick booking CTA on mobile when scrolled past 300px
    if (mobileFloatingCta) {
      if (scrollY > 300 && window.innerWidth <= 768) {
        mobileFloatingCta.classList.add('visible');
      } else {
        mobileFloatingCta.classList.remove('visible');
      }
    }
  });

  // Scroll Spy Active Link Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-25% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(sec => scrollSpyObserver.observe(sec));

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on click nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    // Close menu when tapping outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== mobileToggle) {
        navMenu.classList.remove('active');
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. PORTFOLIO FILTER & GALLERY DATA                                         */
/* -------------------------------------------------------------------------- */
const PORTFOLIO_ITEMS = [
  {
    id: 'p1',
    title: 'Lion of Judah & Chronos',
    category: 'realism',
    categoryLabel: 'Black & Grey Realism',
    img: './assets/images/portfolio_realism.png',
    sessionTime: '7 Hours (1 Full Session)',
    placement: 'Forearm / Outer Arm',
    desc: 'Hyper-realistic micro-detailed lion portrait integrated with an antique pocket watch and skeleton movement.'
  },
  {
    id: 'p2',
    title: 'Sacred Botanical Mandalas',
    category: 'fineline',
    categoryLabel: 'Fine Line Botanical',
    img: './assets/images/portfolio_fineline.png',
    sessionTime: '4.5 Hours',
    placement: 'Forearm & Wrist',
    desc: 'Single needle precision line work featuring delicate peonies, geometric diamonds, and subtle stippled shading.'
  },
  {
    id: 'p3',
    title: 'Ryu Irezumi Dragon Sleeve',
    category: 'japanese',
    categoryLabel: 'Japanese Irezumi',
    img: './assets/images/portfolio_japanese.png',
    sessionTime: '18 Hours (3 Sessions)',
    placement: 'Full Arm & Chest Plate',
    desc: 'Traditional Japanese dragon sleeve with fiery aura, sakuras, and dynamic dark wave backgrounds.'
  },
  {
    id: 'p4',
    title: 'Master Craftsman at Work',
    category: 'realism',
    categoryLabel: 'Studio Process',
    img: './assets/images/hero_tattoo_art.png',
    sessionTime: 'In Progress',
    placement: 'Custom Arm Piece',
    desc: 'Demonstration of smooth tonal blending using custom pigment shades and rotary needle accuracy.'
  }
];

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolioGrid');

  if (!portfolioGrid) return;

  function renderGrid(filter = 'all') {
    portfolioGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? PORTFOLIO_ITEMS 
      : PORTFOLIO_ITEMS.filter(item => item.category === filter);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'portfolio-card';
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="portfolio-img-wrapper">
          <img src="${item.img}" alt="${item.title}" loading="lazy" />
          <div class="portfolio-overlay">
            <span class="portfolio-category">${item.categoryLabel}</span>
            <h3 class="portfolio-title">${item.title}</h3>
            <div class="portfolio-meta">
              <span>⏱️ ${item.sessionTime}</span>
              <span>📍 ${item.placement}</span>
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(item));
      portfolioGrid.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(btn.dataset.filter);
    });
  });

  renderGrid('all');
}

/* -------------------------------------------------------------------------- */
/* 3. LIGHTBOX MODAL                                                          */
/* -------------------------------------------------------------------------- */
function initLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxClose');

  if (closeBtn && lightboxModal) {
    closeBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }
}

function openLightbox(item) {
  const lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) return;

  document.getElementById('lightboxImg').src = item.img;
  document.getElementById('lightboxTitle').textContent = item.title;
  document.getElementById('lightboxCategory').textContent = item.categoryLabel;
  document.getElementById('lightboxTime').textContent = item.sessionTime;
  document.getElementById('lightboxPlacement').textContent = item.placement;
  document.getElementById('lightboxDesc').textContent = item.desc;

  const bookSimilarBtn = document.getElementById('lightboxBookBtn');
  if (bookSimilarBtn) {
    bookSimilarBtn.onclick = () => {
      lightboxModal.classList.remove('active');
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      // Pre-fill idea style if applicable
      const styleSelect = document.getElementById('bookingStyle');
      if (styleSelect) {
        if (item.category === 'realism') styleSelect.value = 'Black & Grey Realism';
        else if (item.category === 'fineline') styleSelect.value = 'Fine Line / Micro';
        else if (item.category === 'japanese') styleSelect.value = 'Japanese Irezumi';
      }
    };
  }

  lightboxModal.classList.add('active');
}

/* -------------------------------------------------------------------------- */
/* 4. INSTANT TATTOO QUOTE & SESSION ESTIMATOR                                 */
/* -------------------------------------------------------------------------- */
function initEstimatorCalculator() {
  const sizeSlider = document.getElementById('estSize');
  const sizeDisplay = document.getElementById('sizeValue');
  const styleOptions = document.querySelectorAll('#estStyleGroup .option-card');
  const placementSelect = document.getElementById('estPlacement');
  
  const estHours = document.getElementById('estHours');
  const estPrice = document.getElementById('estPrice');
  const estDeposit = document.getElementById('estDeposit');

  if (!sizeSlider) return;

  let currentStyleMultiplier = 1.2; // default Black & Grey Realism

  sizeSlider.addEventListener('input', (e) => {
    sizeDisplay.textContent = `${e.target.value}" (${Math.round(e.target.value * 2.54)} cm)`;
    calculateEstimate();
  });

  styleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      styleOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      currentStyleMultiplier = parseFloat(opt.dataset.multiplier || 1.0);
      calculateEstimate();
    });
  });

  if (placementSelect) {
    placementSelect.addEventListener('change', calculateEstimate);
  }

  function calculateEstimate() {
    const sizeInches = parseFloat(sizeSlider.value);
    const placementDiff = parseFloat(placementSelect ? placementSelect.value : 1.0);

    // Base calculation formula
    let rawHours = (sizeInches * 0.45) * currentStyleMultiplier * placementDiff;
    rawHours = Math.max(1.5, Math.min(16, rawHours)); // Clamp between 1.5h and 16h

    const formattedHours = rawHours.toFixed(1);

    // Hourly rate average for Daniel Silva ($220/hr)
    const minPrice = Math.round(rawHours * 190);
    const maxPrice = Math.round(rawHours * 240);

    // Deposit calculation
    const deposit = minPrice > 600 ? 250 : 150;

    estHours.textContent = `${formattedHours} Hours (${rawHours > 6 ? 'Full Day' : 'Half Day'})`;
    estPrice.textContent = `$${minPrice} - $${maxPrice}`;
    estDeposit.textContent = `$${deposit}`;
  }

  calculateEstimate();

  // "Proceed to Book" button integration
  const applyCalcBtn = document.getElementById('applyCalcToBooking');
  if (applyCalcBtn) {
    applyCalcBtn.addEventListener('click', () => {
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      showToast('Calculated estimate applied to booking session!');
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 5. MULTI-STEP BOOKING WIZARD & CALENDAR                                     */
/* -------------------------------------------------------------------------- */
let bookingState = {
  step: 1,
  style: 'Black & Grey Realism',
  placement: 'Forearm',
  description: '',
  colorMode: 'Black & Grey',
  selectedDate: null,
  selectedTime: null,
  fullName: '',
  email: '',
  phone: '',
  depositAmount: 150,
  paymentMethod: 'venmo',
  receiptUploaded: false
};

function initBookingWizard() {
  const wizardSteps = document.querySelectorAll('.step-indicator');
  const stepContents = document.querySelectorAll('.wizard-step-content');
  const nextBtn = document.getElementById('btnWizardNext');
  const prevBtn = document.getElementById('btnWizardPrev');
  const submitBtn = document.getElementById('btnWizardSubmit');

  if (!nextBtn) return;

  // Payment Method Selection Toggle
  const payCards = document.querySelectorAll('#paymentMethodGrid .option-card');
  const appForm = document.getElementById('appPaymentForm');
  const appPayTitle = document.getElementById('appPayTitle');

  payCards.forEach(card => {
    card.addEventListener('click', () => {
      payCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.paymentMethod = card.dataset.method;

      if (appForm) appForm.style.display = 'block';
      const appPayName = document.getElementById('appPayName');

      if (bookingState.paymentMethod === 'venmo') {
        if (appPayTitle) appPayTitle.textContent = 'Contact Support for Venmo Payment Tag';
        if (appPayName) appPayName.textContent = 'Venmo';
      } else if (bookingState.paymentMethod === 'chime') {
        if (appPayTitle) appPayTitle.textContent = 'Contact Support for Chime Payment Tag';
        if (appPayName) appPayName.textContent = 'Chime';
      } else if (bookingState.paymentMethod === 'applepay') {
        if (appPayTitle) appPayTitle.textContent = 'Contact Support for Apple Pay / GPay Tag';
        if (appPayName) appPayName.textContent = 'Apple Pay / GPay';
      } else if (bookingState.paymentMethod === 'paypal') {
        if (appPayTitle) appPayTitle.textContent = 'Contact Support for PayPal Payment Tag';
        if (appPayName) appPayName.textContent = 'PayPal Express';
      }
    });
  });

  // Screenshot Upload Handler
  const uploadZone = document.getElementById('receiptUploadZone');
  const fileInput = document.getElementById('receiptFileInput');
  const previewBox = document.getElementById('receiptPreviewBox');
  const previewImg = document.getElementById('receiptPreviewImg');

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleReceiptFile(file);
    });

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--gold-primary)';
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = 'var(--border-color)';
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--border-color)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleReceiptFile(e.dataTransfer.files[0]);
      }
    });
  }

  function handleReceiptFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, HEIC).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg) previewImg.src = e.target.result;
      if (previewBox) previewBox.style.display = 'block';
      bookingState.receiptUploaded = true;
      showToast('📸 Payment receipt screenshot attached!');
    };
    reader.readAsDataURL(file);
  }

  // Live Virtual Card Visualizer Synchronizer
  const cardHolderInput = document.getElementById('cardHolder');
  const cardNumInput = document.getElementById('cardNum');
  const cardExpInput = document.getElementById('cardExp');

  const cardHolderDisplay = document.getElementById('cardHolderDisplay');
  const cardNumDisplay = document.getElementById('cardNumDisplay');
  const cardExpDisplay = document.getElementById('cardExpDisplay');
  const cardBrandText = document.getElementById('cardBrandText');

  if (cardHolderInput && cardHolderDisplay) {
    cardHolderInput.addEventListener('input', (e) => {
      cardHolderDisplay.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
    });
  }

  if (cardNumInput && cardNumDisplay) {
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += val[i];
      }
      e.target.value = formatted;
      cardNumDisplay.textContent = formatted || '•••• •••• •••• ••••';

      // Detect Brand
      if (val.startsWith('4')) {
        if (cardBrandText) cardBrandText.textContent = 'VISA';
      } else if (val.startsWith('5')) {
        if (cardBrandText) cardBrandText.textContent = 'MASTERCARD';
      } else if (val.startsWith('3')) {
        if (cardBrandText) cardBrandText.textContent = 'AMEX';
      } else {
        if (cardBrandText) cardBrandText.textContent = 'CARD';
      }
    });
  }

  if (cardExpInput && cardExpDisplay) {
    cardExpInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val;
      cardExpDisplay.textContent = val || 'MM/YY';
    });
  }

  function updateStepUI() {
    wizardSteps.forEach((step, idx) => {
      const stepNum = idx + 1;
      step.classList.remove('active', 'completed');
      if (stepNum === bookingState.step) {
        step.classList.add('active');
      } else if (stepNum < bookingState.step) {
        step.classList.add('completed');
      }
    });

    stepContents.forEach((content, idx) => {
      content.classList.toggle('active', (idx + 1) === bookingState.step);
    });

    // Control buttons visibility
    prevBtn.style.display = bookingState.step === 1 ? 'none' : 'inline-flex';
    if (bookingState.step === 3) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
      submitBtn.innerHTML = `💳 Confirm Deposit Payment ($150.00)`;
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
  }

  nextBtn.addEventListener('click', () => {
    if (validateStep(bookingState.step)) {
      bookingState.step++;
      updateStepUI();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (bookingState.step > 1) {
      bookingState.step--;
      updateStepUI();
    }
  });

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⚡ Verifying $150 Payment...';
      
      setTimeout(() => {
        submitBtn.disabled = false;
        completeBooking();
      }, 1200);
    }
  });

  // Init Calendar inside Step 2
  initCalendar();
}

function validateStep(step) {
  if (step === 1) {
    const desc = document.getElementById('bookingDesc').value.trim();
    if (desc.length < 10) {
      showToast('Please provide a short description of your tattoo idea (min 10 characters).', 'error');
      return false;
    }
    bookingState.style = document.getElementById('bookingStyle').value;
    bookingState.placement = document.getElementById('bookingPlacement').value;
    bookingState.description = desc;
    bookingState.colorMode = document.querySelector('input[name="colorMode"]:checked')?.value || 'Black & Grey';
    return true;
  }

  if (step === 2) {
    if (!bookingState.selectedDate || !bookingState.selectedTime) {
      showToast('Please select an available date and time slot.', 'error');
      return false;
    }
    return true;
  }

  if (step === 3) {
    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const ageCheck = document.getElementById('ageConfirm').checked;

    if (!name || !email || !phone) {
      showToast('Please fill out all required contact fields.', 'error');
      return false;
    }

    if (!bookingState.receiptUploaded) {
      const methodLabel = bookingState.paymentMethod ? bookingState.paymentMethod.toUpperCase() : 'PAYMENT';
      showToast(`Please contact support or upload a screenshot of your successful ${methodLabel} payment.`, 'error');
      return false;
    }

    if (!ageCheck) {
      showToast('You must authorize the $150 deposit payment and confirm you are 18+.', 'error');
      return false;
    }

    bookingState.fullName = name;
    bookingState.email = email;
    bookingState.phone = phone;
    return true;
  }

  return true;
}

/* Calendar Generator */
let currentCalDate = new Date();

function initCalendar() {
  const monthTitle = document.getElementById('calMonthTitle');
  const calGrid = document.getElementById('calGrid');
  const prevMonthBtn = document.getElementById('calPrevMonth');
  const nextMonthBtn = document.getElementById('calNextMonth');
  const timeBtns = document.querySelectorAll('.time-btn');

  if (!calGrid) return;

  function renderCalendar() {
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthTitle.textContent = `${monthNames[month]} ${year}`;

    calGrid.innerHTML = `
      <div class="cal-day-label">Sun</div>
      <div class="cal-day-label">Mon</div>
      <div class="cal-day-label">Tue</div>
      <div class="cal-day-label">Wed</div>
      <div class="cal-day-label">Thu</div>
      <div class="cal-day-label">Fri</div>
      <div class="cal-day-label">Sat</div>
    `;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Blank cells before first day
    for (let i = 0; i < firstDayIndex; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-date disabled';
      calGrid.appendChild(blank);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateElem = document.createElement('div');
      dateElem.className = 'cal-date';
      dateElem.textContent = day;

      const thisDate = new Date(year, month, day);
      // Disable past dates or Sundays/Mondays (Studio closed)
      if (thisDate < today || thisDate.getDay() === 0 || thisDate.getDay() === 1) {
        dateElem.classList.add('disabled');
      } else {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (bookingState.selectedDate === dateStr) {
          dateElem.classList.add('selected');
        }

        dateElem.addEventListener('click', () => {
          document.querySelectorAll('.cal-date').forEach(d => d.classList.remove('selected'));
          dateElem.classList.add('selected');
          bookingState.selectedDate = dateStr;
          showToast(`Selected Date: ${monthNames[month]} ${day}, ${year}`);
        });
      }

      calGrid.appendChild(dateElem);
    }
  }

  prevMonthBtn.addEventListener('click', () => {
    currentCalDate.setMonth(currentCalDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
    renderCalendar();
  });

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.selectedTime = btn.dataset.time;
      showToast(`Selected Time Slot: ${btn.dataset.time}`);
    });
  });

  renderCalendar();
}

function completeBooking() {
  const modal = document.getElementById('confirmationModal');
  const bookingRef = `DS-${Math.floor(1000 + Math.random() * 9000)}`;
  const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

  document.getElementById('confirmRef').textContent = bookingRef;
  document.getElementById('confirmName').textContent = bookingState.fullName;
  document.getElementById('confirmDate').textContent = `${bookingState.selectedDate} at ${bookingState.selectedTime}`;
  document.getElementById('confirmDetails').textContent = `${bookingState.style} (${bookingState.placement})`;
  
  const txnElem = document.getElementById('confirmTxn');
  if (txnElem) txnElem.textContent = txnId;

  modal.classList.add('active');
  showToast(`✅ Payment Successful! $150 Deposit Received.`, 'info');

  // Snapshot details for official receipt download
  const receiptSnapshot = {
    ref: bookingRef,
    txnId: txnId,
    fullName: bookingState.fullName || 'Client',
    email: bookingState.email || 'N/A',
    phone: bookingState.phone || 'N/A',
    style: bookingState.style || 'Custom Tattoo',
    placement: bookingState.placement || 'Body Art',
    colorMode: bookingState.colorMode || 'Black & Grey',
    date: bookingState.selectedDate || 'Scheduled Session',
    time: bookingState.selectedTime || 'TBD',
    paymentMethod: bookingState.paymentMethod || 'venmo',
    depositAmount: bookingState.depositAmount || 150,
    issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  };

  // Calendar sync handler
  document.getElementById('btnCalSync').onclick = () => {
    showToast('📅 Added session to your digital calendar!');
  };

  // Printable receipt handler
  const printBtn = document.getElementById('btnPrintReceipt');
  if (printBtn) {
    printBtn.onclick = () => {
      downloadOfficialReceipt(receiptSnapshot);
    };
  }

  // Reset booking state
  bookingState.step = 1;
  bookingState.selectedDate = null;
  bookingState.selectedTime = null;
}

function downloadOfficialReceipt(data) {
  const safeRef = escapeHtml(data.ref);
  const safeTxnId = escapeHtml(data.txnId);
  const safeName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone);
  const safeStyle = escapeHtml(data.style);
  const safePlacement = escapeHtml(data.placement);
  const safeColor = escapeHtml(data.colorMode);
  const safeDate = escapeHtml(data.date);
  const safeTime = escapeHtml(data.time);
  const safeMethod = escapeHtml((data.paymentMethod || 'Venmo').toUpperCase());
  const safeIssueDate = escapeHtml(data.issueDate);

  const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Daniel Silva Tattoos - Receipt ${safeRef}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0d0e12; color: #e2e8f0; padding: 40px 20px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .receipt-container { background: #161822; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; max-width: 600px; width: 100%; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); position: relative; }
    .header { text-align: center; border-bottom: 1px dashed rgba(255,255,255,0.15); padding-bottom: 24px; margin-bottom: 24px; }
    .logo-title { font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #d4af37; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; }
    .status-badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-top: 14px; letter-spacing: 1px; }
    .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 16px; border-radius: 10px; }
    .info-box label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block; margin-bottom: 4px; letter-spacing: 0.5px; }
    .info-box span { font-size: 13px; font-weight: 600; color: #f8fafc; word-break: break-all; }
    .section-heading { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #d4af37; letter-spacing: 1px; margin-bottom: 12px; border-left: 3px solid #d4af37; padding-left: 8px; }
    .detail-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .detail-table td { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }
    .detail-table td.label { color: #94a3b8; width: 40%; }
    .detail-table td.val { color: #f8fafc; font-weight: 600; text-align: right; }
    .total-card { background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 10px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .total-title { font-size: 14px; font-weight: 700; color: #f8fafc; }
    .total-amount { font-size: 22px; font-weight: 800; color: #d4af37; }
    .policy-box { font-size: 11px; color: #94a3b8; line-height: 1.6; background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px; }
    .footer { text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
    .action-bar { display: flex; gap: 12px; justify-content: center; margin-top: 24px; }
    .btn { background: #d4af37; color: #000; font-weight: 700; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn:hover { background: #f3cf65; transform: translateY(-1px); }
    @media print {
      body { background: #fff !important; color: #000 !important; padding: 0 !important; }
      .receipt-container { background: #fff !important; color: #000 !important; border: 1px solid #ccc !important; box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; padding: 20px !important; }
      .logo-title { color: #000 !important; }
      .status-badge { background: #e6fffa !important; color: #047857 !important; border-color: #047857 !important; }
      .grid-info { background: #f8fafc !important; border-color: #e2e8f0 !important; }
      .info-box label { color: #64748b !important; }
      .info-box span { color: #000 !important; }
      .section-heading { color: #000 !important; border-left-color: #000 !important; }
      .detail-table td { border-bottom-color: #e2e8f0 !important; }
      .detail-table td.label { color: #64748b !important; }
      .detail-table td.val { color: #000 !important; }
      .total-card { background: #fefce8 !important; border-color: #ca8a04 !important; }
      .total-title { color: #000 !important; }
      .total-amount { color: #854d0e !important; }
      .policy-box { background: #f8fafc !important; border-color: #e2e8f0 !important; color: #475569 !important; }
      .footer { border-top-color: #e2e8f0 !important; color: #64748b !important; }
      .action-bar, .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="logo-title">Daniel Silva Tattoos</div>
      <div class="subtitle">Official Session Deposit Receipt</div>
      <div><span class="status-badge">✓ Deposit Confirmed & Paid</span></div>
    </div>

    <div class="grid-info">
      <div class="info-box">
        <label>Booking Reference</label>
        <span>${safeRef}</span>
      </div>
      <div class="info-box">
        <label>Transaction ID</label>
        <span>${safeTxnId}</span>
      </div>
      <div class="info-box">
        <label>Issue Date & Time</label>
        <span>${safeIssueDate}</span>
      </div>
      <div class="info-box">
        <label>Payment Method</label>
        <span>${safeMethod}</span>
      </div>
    </div>

    <div class="section-heading">Client Information</div>
    <table class="detail-table">
      <tr>
        <td class="label">Full Name</td>
        <td class="val">${safeName}</td>
      </tr>
      <tr>
        <td class="label">Email Address</td>
        <td class="val">${safeEmail}</td>
      </tr>
      <tr>
        <td class="label">Phone Number</td>
        <td class="val">${safePhone}</td>
      </tr>
    </table>

    <div class="section-heading">Appointment Details</div>
    <table class="detail-table">
      <tr>
        <td class="label">Scheduled Date</td>
        <td class="val">${safeDate}</td>
      </tr>
      <tr>
        <td class="label">Scheduled Time</td>
        <td class="val">${safeTime}</td>
      </tr>
      <tr>
        <td class="label">Tattoo Style</td>
        <td class="val">${safeStyle}</td>
      </tr>
      <tr>
        <td class="label">Placement</td>
        <td class="val">${safePlacement}</td>
      </tr>
      <tr>
        <td class="label">Color Palette</td>
        <td class="val">${safeColor}</td>
      </tr>
    </table>

    <div class="total-card">
      <div class="total-title">Deposit Amount Paid</div>
      <div class="total-amount">$150.00 USD</div>
    </div>

    <div class="policy-box">
      <strong>📌 Studio Policy & Terms:</strong><br>
      • Deposit is non-refundable and will be credited toward the final cost of your tattoo on your session date.<br>
      • Rescheduling requires a minimum of 48 hours notice to preserve your deposit.<br>
      • Please bring valid photo identification (18+ only) to your appointment.
    </div>

    <div class="footer">
      <p><strong>Daniel Silva Tattoos Studio</strong> • Los Angeles, CA</p>
      <p>Instagram: @danielsilvatattoo • Support: support@danielsilvatattoo.com</p>
    </div>

    <div class="action-bar no-print">
      <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => { window.print(); }, 400);
    });
  </script>
</body>
</html>`;

  // Open official receipt view & trigger PDF print preview window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    showToast('🧾 Official receipt opened! Use the dialog to Save as PDF or Print.', 'info');
  } else {
    showToast('⚠️ Pop-up blocked! Please allow pop-ups to view & save your PDF receipt.', 'error');
  }
}

/* -------------------------------------------------------------------------- */
/* 6. FLASH TATTOO QUICK CLAIM                                               */
/* -------------------------------------------------------------------------- */
function initFlashBooking() {
  const flashBtns = document.querySelectorAll('.flash-claim-btn');
  flashBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.flash-card');
      const title = card.querySelector('.flash-title').textContent;
      const price = card.querySelector('.flash-price').textContent;

      document.getElementById('bookingStyle').value = 'Custom Japanese';
      document.getElementById('bookingDesc').value = `CLAIM FLASH PIECE: ${title} (${price})`;
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      showToast(`Claiming Flash "${title}" - Proceed with selecting date & time!`);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 7. AFTERCARE TABS                                                          */
/* -------------------------------------------------------------------------- */
function initAftercareTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.aftercare-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');

      tab.classList.add('active');
      const targetContent = document.getElementById(`aftercare-${tab.dataset.tab}`);
      if (targetContent) targetContent.style.display = 'block';
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 8. FAQ ACCORDION                                                           */
/* -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* -------------------------------------------------------------------------- */
/* TOAST NOTIFICATION UTILITY                                                */
/* -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${type === 'error' ? '#e63946' : '#12141a'};
    border: 1px solid ${type === 'error' ? '#ff4d5a' : '#d4af37'};
    color: #fff;
    padding: 0.8rem 1.4rem;
    border-radius: 8px;
    font-size: 0.9rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    animation: slideIn 0.3s ease forwards;
  `;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* Studio Support Modal & Chat Widget Handler */
document.addEventListener('DOMContentLoaded', () => {
  const supportModal = document.getElementById('supportModal');
  const supportTriggers = document.querySelectorAll('.trigger-support-modal');
  const supportClose = document.getElementById('supportModalClose');

  if (supportModal) {
    supportTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        supportModal.classList.add('active');
      });
    });

    if (supportClose) {
      supportClose.addEventListener('click', () => {
        supportModal.classList.remove('active');
      });
    }

    supportModal.addEventListener('click', (e) => {
      if (e.target === supportModal) {
        supportModal.classList.remove('active');
      }
    });
  }

  /* Live Support Chat Widget */
  const chatWidget = document.getElementById('supportChatWidget');
  const chatLauncher = document.getElementById('floatingChatLauncher');
  const chatClose = document.getElementById('chatCloseBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatTyping = document.getElementById('chatTyping');
  const unreadBadge = document.getElementById('chatUnreadBadge');
  const chatChips = document.querySelectorAll('.chat-chip');
  const chatFileInput = document.getElementById('chatFileInput');
  const chatAttachBtn = document.getElementById('chatAttachBtn');
  const chatAttachTrigger = document.getElementById('chatAttachTrigger');

  let chatUserName = '';

  if (chatLauncher && chatWidget) {
    chatLauncher.addEventListener('click', () => {
      chatWidget.classList.toggle('active');
      if (unreadBadge) unreadBadge.style.display = 'none';
      if (chatWidget.classList.contains('active') && chatInput) {
        setTimeout(() => chatInput.focus(), 200);
      }
    });

    if (chatClose) {
      chatClose.addEventListener('click', () => {
        chatWidget.classList.remove('active');
      });
    }

    if (chatAttachBtn && chatFileInput) {
      chatAttachBtn.addEventListener('click', () => chatFileInput.click());
    }
    if (chatAttachTrigger && chatFileInput) {
      chatAttachTrigger.addEventListener('click', () => chatFileInput.click());
    }

    if (chatFileInput) {
      chatFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            showToast('Please attach a valid image file (PNG, JPG, HEIC).', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            appendImageMessage(event.target.result, 'outgoing', file.name);
            simulateSarahImageResponse(file.name);
            
            const tgMsg = `📷 <b>WEBSITE ATTACHMENT UPLOADED</b>\n----------------------------------\n👤 <b>Visitor:</b> ${chatUserName || 'Website Client'}\n🖼️ <b>File:</b> ${escapeHtml(file.name)}\n📅 <b>Time:</b> ${new Date().toLocaleTimeString()}`;
            postToTelegramBot(tgMsg);
          };
          reader.readAsDataURL(file);
          chatFileInput.value = '';
        }
      });
    }

    chatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        if (query) sendChatMessage(query);
      });
    });

    const tagTriggers = document.querySelectorAll('.trigger-support-chat-tag');
    tagTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (chatWidget) {
          chatWidget.classList.add('active');
          const method = bookingState.paymentMethod ? bookingState.paymentMethod.toUpperCase() : 'DEPOSIT';
          sendChatMessage(`Hi Sarah, please send me the active ${method} payment tag / handle to pay my $150 deposit.`);
        }
      });
    });

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text) {
          sendChatMessage(text);
          chatInput.value = '';
        }
      });
    }
  }

  /* Visitor Multi-Session Tagging System */
  const visitorSessionId = (function() {
    let id = sessionStorage.getItem('DS_VISITOR_SESSION_ID');
    if (!id) {
      id = Math.floor(1000 + Math.random() * 9000).toString();
      sessionStorage.setItem('DS_VISITOR_SESSION_ID', id);
    }
    return id;
  })();

  function sendChatMessage(text) {
    appendMessage(text, 'outgoing');

    const nameMatch = text.match(/(?:my name is|i am|i'm|call me)\s+([A-Za-z]+)/i);
    if (nameMatch && nameMatch[1]) {
      chatUserName = nameMatch[1];
    }

    const isTelegramActive = !!(telegramState.botToken && telegramState.chatId);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const clientTag = `#${visitorSessionId}`;
    const clientDisplayName = chatUserName ? `${chatUserName} (${clientTag})` : `Client ${clientTag}`;

    const tgPayload = `💬 <b>NEW LIVE CHAT MESSAGE</b>\n----------------------------------\n👤 <b>Client:</b> ${escapeHtml(clientDisplayName)}\n🏷️ <b>Session Tag:</b> <code>${clientTag}</code>\n⏰ <b>Time:</b> ${timeStr}\n💬 <b>Message:</b> ${escapeHtml(text)}\n----------------------------------\n<i>💡 To reply to this client, reply directly to this message OR start your reply with <b>${clientTag}</b> (e.g. <code>${clientTag} hello!</code>)</i>`;
    
    if (isTelegramActive) {
      postToTelegramBot(tgPayload);
    } else {
      if (chatTyping) chatTyping.style.display = 'flex';
      if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;

      const delay = Math.floor(Math.random() * 600) + 900;
      setTimeout(() => {
        if (chatTyping) chatTyping.style.display = 'none';
        const reply = generateSarahConciergeReply(text);
        appendMessage(reply, 'incoming');
      }, delay);
    }
  }

  function appendMessage(text, type) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}`;
    msgDiv.innerHTML = `
      <div class="message-bubble">${formatChatMessage(text)}</div>
      <div class="message-time">${timeStr} ${type === 'outgoing' ? '<span style="color: var(--gold-primary);">✓✓</span>' : ''}</div>
    `;
    if (chatMessages) {
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  // Expose globally so Telegram polling (global scope) can inject replies
  window.appendMessage = appendMessage;

  function appendImageMessage(imgDataUrl, type, fileName) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}`;
    msgDiv.innerHTML = `
      <div class="message-bubble" style="padding: 0.5rem; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color);">
        <img src="${imgDataUrl}" alt="${escapeHtml(fileName)}" style="max-width: 100%; border-radius: 8px; display: block; max-height: 180px; object-fit: cover; margin-bottom: 0.3rem;" />
        <div style="font-size: 0.75rem; color: var(--text-muted);">📷 ${escapeHtml(fileName)}</div>
      </div>
      <div class="message-time">${timeStr} ${type === 'outgoing' ? '<span style="color: var(--gold-primary);">✓✓</span>' : ''}</div>
    `;
    if (chatMessages) {
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function simulateSarahImageResponse(fileName) {
    if (chatTyping) chatTyping.style.display = 'flex';
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      if (chatTyping) chatTyping.style.display = 'none';
      const isReceipt = fileName.toLowerCase().includes('receipt') || fileName.toLowerCase().includes('payment') || fileName.toLowerCase().includes('venmo') || fileName.toLowerCase().includes('chime');
      
      let reply = '';
      if (isReceipt) {
        reply = `Awesome! I've received your payment screenshot (<strong>${escapeHtml(fileName)}</strong>). 💳 Your $150 deposit is verified! You can complete your booking details in the calendar form above.`;
      } else {
        reply = `Thanks for sending that photo! 🎨 I've attached <strong>${escapeHtml(fileName)}</strong> to your studio consultation notes so Daniel can review your design inspiration before your appointment.`;
      }
      appendMessage(reply, 'incoming');
    }, 1200);
  }

  function generateSarahConciergeReply(text) {
    const lower = text.toLowerCase();
    const namePrefix = chatUserName ? `${chatUserName}, ` : '';

    if (lower.includes('telegram') || lower.includes('tg') || lower.includes('t.me')) {
      setTimeout(() => {
        window.open('https://t.me/DanielSilvaTattoos', '_blank');
      }, 1000);
      return `✈️ You can chat directly with our studio support on Telegram at <strong>@DanielSilvaTattoos</strong>! Opening Telegram now...`;
    } else if (lower.includes('deposit') || lower.includes('venmo') || lower.includes('chime') || lower.includes('pay') || lower.includes('$150')) {
      return `${namePrefix}to lock in your session date with Daniel, a $150 deposit is required. You can pay via Credit/Debit Card, or message us on <strong>Telegram (@DanielSilvaTattoos)</strong> or right here to get the active Venmo/Chime payment tag!`;
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('greetings')) {
      return `Hello ${namePrefix}! 👋 It's great to connect with you 1-on-1. Are you looking to book a new tattoo session, check Daniel's schedule, or get our Telegram support handle?`;
    } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('date') || lower.includes('time') || lower.includes('availability') || lower.includes('schedule')) {
      return `${namePrefix}Daniel's calendar is currently open for upcoming sessions! You can select your tattoo placement, date, and time slot right on the website booking section, or message us on Telegram (@DanielSilvaTattoos)!`;
    } else if (lower.includes('location') || lower.includes('address') || lower.includes('where') || lower.includes('hours') || lower.includes('studio')) {
      return '📍 Our private studio is located in the Arts District at <strong>742 Santa Fe Ave, Los Angeles, CA 90021</strong>. We operate Tuesday through Saturday, 11:00 AM – 7:00 PM (By Appointment Only).';
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('how much')) {
      return `${namePrefix}Daniel's session rates depend on size, detail complexity, and placement. Full half-day and full-day rates apply, and your $150 deposit goes 100% directly toward your final session total!`;
    } else if (lower.includes('sms') || lower.includes('text') || lower.includes('phone') || lower.includes('call') || lower.includes('number')) {
      return `📲 You can text our direct studio mobile line anytime at <strong>+1 (555) 019-2834</strong> or message us on Telegram at <strong>@DanielSilvaTattoos</strong>!`;
    } else {
      return `Got it ${namePrefix}! I've logged your note in our support queue. If you have any reference photos, feel free to send them to me using the 📎 clip icon below, or message us on Telegram (@DanielSilvaTattoos)!`;
    }
  }

  function formatChatMessage(str) {
    if (!str) return '';
    const withBreaks = str.replace(/\n/g, '<br>');
    return escapeHtml(withBreaks)
      .replace(/&lt;strong&gt;/g, '<strong>')
      .replace(/&lt;\/strong&gt;/g, '</strong>')
      .replace(/&lt;em&gt;/g, '<em>')
      .replace(/&lt;\/em&gt;/g, '</em>')
      .replace(/&lt;br\s*\/?&gt;/g, '<br>');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Telegram Config Modal UI wiring
  const tgModal = document.getElementById('telegramConfigModal');
  const btnOpenTgConfig = document.getElementById('btnOpenTgConfig');
  const tgConfigClose = document.getElementById('tgConfigClose');
  const tgConfigForm = document.getElementById('tgConfigForm');
  const tgBotTokenInput = document.getElementById('tgBotTokenInput');
  const tgChatIdInput = document.getElementById('tgChatIdInput');
  const btnTestTgBot = document.getElementById('btnTestTgBot');

  if (tgBotTokenInput) tgBotTokenInput.value = telegramState.botToken;
  if (tgChatIdInput) tgChatIdInput.value = telegramState.chatId;

  if (btnOpenTgConfig && tgModal) {
    btnOpenTgConfig.addEventListener('click', () => tgModal.classList.add('active'));
    if (tgConfigClose) tgConfigClose.addEventListener('click', () => tgModal.classList.remove('active'));
  }

  if (tgConfigForm) {
    tgConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const token = tgBotTokenInput?.value.trim() || OFFICIAL_BOT_TOKEN;
      const chatId = tgChatIdInput?.value.trim() || OFFICIAL_CHAT_ID;
      telegramState.botToken = token;
      telegramState.chatId = chatId;
      showToast('✓ Telegram Bot @tatoo6ixbot activated!', 'success');
      if (tgModal) tgModal.classList.remove('active');
      startTelegramPolling();
    });
  }

  if (btnTestTgBot) {
    btnTestTgBot.addEventListener('click', async () => {
      const token = tgBotTokenInput?.value.trim() || telegramState.botToken;
      const chatId = tgChatIdInput?.value.trim() || telegramState.chatId;
      showToast('Testing connection...', 'info');
      const ok = await postToTelegramBot('🧪 <b>Test Connection</b>\n\nBot is connected!', token, chatId);
      showToast(ok ? '🎉 Test message sent!' : 'Failed — check Token & Chat ID.', ok ? 'success' : 'error');
    });
  }

  // Start Telegram polling now that DOM & handlers are ready
  startTelegramPolling();
});

/* ==========================================================================
   TELEGRAM BOT ENGINE — GLOBAL SCOPE
   ========================================================================== */
const OFFICIAL_BOT_TOKEN = '8767968656:AAHq0nXlNaZsclpeBVG1KOuWhsUZUtg1Kmo';
const OFFICIAL_CHAT_ID = '1732181111'; // Studio owner Chat ID (@EphraimLeee)

/* Visitor Multi-Session Tagging System */
const visitorSessionId = (function() {
  let id = sessionStorage.getItem('DS_VISITOR_SESSION_ID');
  if (!id) {
    id = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem('DS_VISITOR_SESSION_ID', id);
  }
  return id;
})();

const telegramState = {
  botToken: OFFICIAL_BOT_TOKEN,
  botUsername: 'tatoo6ixbot',
  chatId: OFFICIAL_CHAT_ID,
  lastUpdateId: 0,
  isPolling: false,
  processedMessageIds: new Set()
};

async function postToTelegramBot(messageText, overrideToken = null, overrideChatId = null) {
  const token = overrideToken || telegramState.botToken;
  const chatId = overrideChatId || telegramState.chatId;
  if (!token || !chatId) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: messageText, parse_mode: 'HTML' })
    });
    const data = await res.json();
    console.log('[Telegram] sendMessage result:', data.ok);
    return data.ok;
  } catch (err) {
    console.warn('[Telegram Bot API Error]', err);
    return false;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

function processIncomingTelegramUpdate(update) {
  if (!update) return;
  const msg = update.message || update.edited_message;
  if (!msg) return;

  // Skip messages sent by bots
  if (msg.from && msg.from.is_bot) return;

  // Extract text or photo caption
  let text = msg.text || msg.caption || '';
  if (!text && msg.photo) {
    text = '📷 [Photo Received]';
  }

  // Skip empty text or bot commands like /start
  if (!text || text.startsWith('/')) return;

  // Multi-Visitor Session Tag Routing
  const tagMatch = text.match(/#?(\d{4})\b/);
  let targetTag = tagMatch ? tagMatch[1] : null;

  // If replied to a specific message in Telegram, extract the tag from the original message
  if (!targetTag && msg.reply_to_message) {
    const origText = msg.reply_to_message.text || msg.reply_to_message.caption || '';
    const origMatch = origText.match(/#?(\d{4})\b/);
    if (origMatch) targetTag = origMatch[1];
  }

  // If this reply is targeted to a specific client tag (e.g. #4092) and it doesn't match this client, skip
  if (targetTag && String(targetTag) !== String(visitorSessionId)) {
    console.log(`[Telegram Polling] Skipping message for tag #${targetTag} (current session is #${visitorSessionId})`);
    return;
  }

  // Strip out #4092 or 4092 tag from text shown to visitor
  let displayText = text.replace(/#?\b\d{4}\b[:\s-]*/g, '').trim();
  if (!displayText) displayText = text;

  // Verify DOM is ready — if chatMessages container is not in DOM yet, defer processing until ready
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) {
    setTimeout(() => processIncomingTelegramUpdate(update), 250);
    return;
  }

  // Deduplicate by message ID (only mark as processed AFTER confirming DOM container exists)
  if (msg.message_id && telegramState.processedMessageIds.has(msg.message_id)) return;
  if (msg.message_id) telegramState.processedMessageIds.add(msg.message_id);

  console.log('[Telegram Polling] Live response received from Telegram:', displayText);

  const textFormatted = escapeHtml(displayText).replace(/\n/g, '<br>');

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-message incoming';
  msgDiv.innerHTML = `
    <div class="message-bubble">${textFormatted}</div>
    <div class="message-time">${timeStr}</div>
  `;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Auto-open chat widget when Telegram reply arrives
  const cw = document.getElementById('supportChatWidget');
  if (cw) {
    cw.classList.add('active');
  }
}

async function startTelegramPolling() {
  if (telegramState.isPolling) return;
  telegramState.isPolling = true;

  console.log('[Telegram Polling] Started polling @tatoo6ixbot updates...');

  // Initial load: fetch updates and process ALL pending updates in queue
  try {
    const initRes = await fetch(`https://api.telegram.org/bot${telegramState.botToken}/getUpdates`);
    const initData = await initRes.json();
    if (initData.ok && Array.isArray(initData.result)) {
      initData.result.forEach(update => {
        telegramState.lastUpdateId = Math.max(telegramState.lastUpdateId, update.update_id + 1);
        processIncomingTelegramUpdate(update);
      });
    }
  } catch (e) {
    console.warn('[Telegram Polling Init Error]', e);
  }

  // Continuous polling loop every 2 seconds
  setInterval(async () => {
    try {
      const res = await fetch(`https://api.telegram.org/bot${telegramState.botToken}/getUpdates?offset=${telegramState.lastUpdateId}&timeout=2`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.result)) {
        data.result.forEach(update => {
          telegramState.lastUpdateId = Math.max(telegramState.lastUpdateId, update.update_id + 1);
          processIncomingTelegramUpdate(update);
        });
      }
    } catch (err) {
      console.warn('[Telegram Polling Loop Error]', err);
    }
  }, 2000);
}
