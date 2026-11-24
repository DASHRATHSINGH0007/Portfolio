// ===== THEME TOGGLE (DARK BY DEFAULT) =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Ensure pure dark theme
setTheme('dark');

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
const roles = ['Software Developer', 'Full-Stack Developer', 'Python Developer', 'AI / ML Engineer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWrite() {
  if (!typewriterEl) return;
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeWrite, delay);
}

if (typewriterEl) {
  typeWrite();
}

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== ANIMATED SKILL BARS =====
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const width = target.getAttribute('data-width');
      target.style.width = width + '%';
      skillObserver.unobserve(target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 30);
}

const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== CONTACT FORM (LIVE GMAIL DELIVERY VIA WEB3FORMS) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('contactSubmitBtn') || contactForm.querySelector('.btn-primary');
    const statusMsg = document.getElementById('formStatusMsg');
    const originalHtml = btn.innerHTML;
    const accessKey = document.getElementById('web3FormsKey')?.value;

    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const subject = document.getElementById('subject')?.value || '';
    const message = document.getElementById('message')?.value || '';

    // If Access Key is still placeholder, use direct mailto so message is never lost!
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      const mailtoUrl = `mailto:dashrathraj2123@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\nMessage:\n" + message)}`;
      window.location.href = mailtoUrl;

      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#f6c042';
        statusMsg.textContent = 'Opened in your email client! Add your free Web3Forms key to index.html for direct background sending.';
      }
      return;
    }

    // Loading State
    btn.disabled = true;
    btn.innerHTML = '<span>Sending Message...</span>';
    if (statusMsg) statusMsg.style.display = 'none';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        btn.innerHTML = '✓ Message Sent to Gmail!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.style.color = '#22c55e';
          statusMsg.textContent = 'Thank you! Your message has been sent directly to Dashrath\'s Gmail.';
        }
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Submission error');
      }
    } catch (err) {
      btn.innerHTML = '✕ Sending Failed';
      btn.style.background = '#ef4444';
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = '#ef4444';
        statusMsg.textContent = 'Failed to send. Please email directly to dashrathraj2123@gmail.com.';
      }
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        btn.style.background = '';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 4000);
    }
  });
}

// ===== SMOOTH PARALLAX ON MOUSE MOVE (hero only) =====
const heroSection = document.querySelector('.hero');
const profileWrapper = document.querySelector('.profile-wrapper');

if (heroSection && profileWrapper) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    profileWrapper.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    profileWrapper.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    profileWrapper.style.transition = 'transform 0.5s';
    setTimeout(() => { profileWrapper.style.transition = ''; }, 500);
  });
}

// ===== NOTABLE PROJECTS INTERACTIVE CONTROLLER =====
let currentProjectIndex = 0;
const totalProjects = 4;

function showProject(index) {
  if (index < 0) index = totalProjects - 1;
  if (index >= totalProjects) index = 0;
  currentProjectIndex = index;

  // Update tabs
  document.querySelectorAll('.project-tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === currentProjectIndex);
  });

  // Update dots
  document.querySelectorAll('.slider-dots .dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentProjectIndex);
  });

  // Update cards
  document.querySelectorAll('.notable-project-card').forEach((card, idx) => {
    card.classList.toggle('active', idx === currentProjectIndex);
  });

  // Refresh lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Tab buttons
document.querySelectorAll('.project-tab-btn').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const wrapper = document.getElementById('notableCardsWrapper');
    if (wrapper && wrapper.classList.contains('view-all-mode')) {
      wrapper.classList.remove('view-all-mode');
      const viewBtn = document.getElementById('viewToggleBtn');
      if (viewBtn) viewBtn.innerHTML = '<i data-lucide="layout-grid" style="width:14px;height:14px;"></i> View All';
    }
    showProject(idx);
  });
});

// Dot indicators
document.querySelectorAll('.slider-dots .dot').forEach((dot, idx) => {
  dot.addEventListener('click', () => showProject(idx));
});

// Arrow navigation
const prevBtn = document.getElementById('prevProjectBtn');
const nextBtn = document.getElementById('nextProjectBtn');
if (prevBtn) prevBtn.addEventListener('click', () => showProject(currentProjectIndex - 1));
if (nextBtn) nextBtn.addEventListener('click', () => showProject(currentProjectIndex + 1));

// View All Toggle
const viewToggleBtn = document.getElementById('viewToggleBtn');
if (viewToggleBtn) {
  viewToggleBtn.addEventListener('click', () => {
    const wrapper = document.getElementById('notableCardsWrapper');
    if (!wrapper) return;
    const isViewAll = wrapper.classList.toggle('view-all-mode');
    viewToggleBtn.innerHTML = isViewAll 
      ? '<i data-lucide="layers" style="width:14px;height:14px;"></i> Slide View' 
      : '<i data-lucide="layout-grid" style="width:14px;height:14px;"></i> View All';
    if (window.lucide) lucide.createIcons();
  });
}

// Modal Data
const projectModalData = {
  uber: {
    title: "Uber Pricing Optimization NYC — Executive Presentation Deck",
    deckImg: "assets/images/uber_project_banner.jpg",
    dashboardTitle: "Uber NYC Tableau Dynamic Pricing Dashboard",
    dashboardContent: `
      <div style="margin-bottom:20px;">
        <img src="assets/images/uber_showcase_banner.png" alt="Uber Dashboard" class="modal-img-full">
      </div>
      <div class="modal-kpi-grid">
        <div class="modal-kpi-card">
          <h4>Total Optimized Revenue</h4>
          <p>$688,787</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Avg Revenue / Order</h4>
          <p>$10.74</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Total Bookings Analyzed</h4>
          <p>64,127</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Revenue Uplift</h4>
          <p>+11.5%</p>
        </div>
      </div>
      <div style="margin-top:24px;line-height:1.8;font-size:14px;color:#cbd5e1;">
        <h4 style="color:#f6c042;margin-bottom:8px;">Analytical Findings:</h4>
        <p>• Applied Multiple Linear Regression on pickup zones, surge rates, distance, and hour of the day.</p>
        <p>• Manhattan zones revealed highest price elasticity, allowing dynamic fare optimization without decreasing booking conversion.</p>
        <p>• Recommended balanced pricing model that resulted in an evaluated <strong>11.5% net revenue surge</strong>.</p>
      </div>
    `
  },
  medintel: {
    title: "MedIntel AI Healthcare Intelligence System — Architecture & Deck",
    deckImg: "assets/images/medintel_showcase_banner.svg",
    dashboardTitle: "MedIntel AI Clinical Diagnostic & OCR Engine",
    dashboardContent: `
      <div style="margin-bottom:20px;">
        <img src="assets/images/medintel_showcase_banner.svg" alt="MedIntel AI" class="modal-img-full">
      </div>
      <div class="modal-kpi-grid">
        <div class="modal-kpi-card">
          <h4>Diagnostic Precision</h4>
          <p>94.8%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Turnaround Reduction</h4>
          <p>-42.0%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Reports Processed</h4>
          <p>18,450</p>
        </div>
        <div class="modal-kpi-card">
          <h4>ROC-AUC Score</h4>
          <p>0.962</p>
        </div>
      </div>
      <div style="margin-top:24px;line-height:1.8;font-size:14px;color:#cbd5e1;">
        <h4 style="color:#f6c042;margin-bottom:8px;">Clinical Impact Highlights:</h4>
        <p>• Automated lab report ingestion using OpenCV and Tesseract OCR with adaptive noise removal.</p>
        <p>• Convolutional neural network classification for multi-class pathology risk assessment.</p>
        <p>• Reduced diagnosis review time from 45 minutes to under 5 minutes per patient file.</p>
      </div>
    `
  },
  sales: {
    title: "Sales Forecasting & Demand Elasticity — Technical Deck",
    deckImg: "assets/images/sales_showcase_banner.svg",
    dashboardTitle: "Power BI Store Sales Forecasting Dashboard",
    dashboardContent: `
      <div style="margin-bottom:20px;">
        <img src="assets/images/sales_showcase_banner.svg" alt="Sales Prediction" class="modal-img-full">
      </div>
      <div class="modal-kpi-grid">
        <div class="modal-kpi-card">
          <h4>Projected Revenue</h4>
          <p>$1.42M</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Model Accuracy</h4>
          <p>92.4%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Store Orders</h4>
          <p>142.8K</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Stockout Drop</h4>
          <p>-28.0%</p>
        </div>
      </div>
      <div style="margin-top:24px;line-height:1.8;font-size:14px;color:#cbd5e1;">
        <h4 style="color:#f6c042;margin-bottom:8px;">Forecasting Methodology:</h4>
        <p>• Evaluated ARIMA, Random Forest, and XGBoost regressors on multi-store retail dataset.</p>
        <p>• Captured seasonal trend components, promotions, and holiday spikes to minimize prediction residuals.</p>
        <p>• Empowered supply chain team to mitigate stockouts by 28% and improve forecasting precision by 18.3%.</p>
      </div>
    `
  },
  chatbot: {
    title: "Intelligent NLP Conversational Assistant — System Architecture",
    deckImg: "assets/images/chatbot_showcase_banner.svg",
    dashboardTitle: "NLP Assistant Telemetry & Intent Matrix",
    dashboardContent: `
      <div style="margin-bottom:20px;">
        <img src="assets/images/chatbot_showcase_banner.svg" alt="Chatbot Telemetry" class="modal-img-full">
      </div>
      <div class="modal-kpi-grid">
        <div class="modal-kpi-card">
          <h4>Intent Accuracy</h4>
          <p>96.2%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Auto Resolution</h4>
          <p>74.5%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Conversations</h4>
          <p>34.2K</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Avg Latency</h4>
          <p>120ms</p>
        </div>
      </div>
      <div style="margin-top:24px;line-height:1.8;font-size:14px;color:#cbd5e1;">
        <h4 style="color:#f6c042;margin-bottom:8px;">NLP Engine Architecture:</h4>
        <p>• Semantic intent matching using NLTK and Spacy tokenization with TF-IDF and dense embeddings.</p>
        <p>• Integrated context state tracker for multi-turn conversations and slot filling.</p>
        <p>• Built with high-performance Flask REST API enabling sub-second response times across 34k+ queries.</p>
      </div>
    `
  },
  ecommerce: {
    title: "Full-Stack Sweet Ordering & Inventory Management Platform",
    deckImg: "assets/images/ecommerce_showcase_banner.svg",
    dashboardTitle: "Sweet Store Admin & Inventory Telemetry",
    dashboardContent: `
      <div style="margin-bottom:20px;">
        <img src="assets/images/ecommerce_showcase_banner.svg" alt="E-Commerce Storefront" class="modal-img-full">
      </div>
      <div class="modal-kpi-grid">
        <div class="modal-kpi-card">
          <h4>Total Store Orders</h4>
          <p>1,280+</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Conversion Rate</h4>
          <p>4.85%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Avg Order Value</h4>
          <p>$48.50</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Catalog Items</h4>
          <p>240+</p>
        </div>
      </div>
      <div style="margin-top:24px;line-height:1.8;font-size:14px;color:#cbd5e1;">
        <h4 style="color:#f6c042;margin-bottom:8px;">Platform Highlights:</h4>
        <p>• Modular Django architecture with customized model managers and template context processors.</p>
        <p>• Session-based shopping cart with asynchronous AJAX item update and instant subtotal recomputation.</p>
        <p>• Admin order management dashboard tracking fulfillment status and stock reorder triggers.</p>
      </div>
    `
  },
  hospital: {
    title: "Hospital Management & Patient Records ERP — System Architecture",
    deckImg: "assets/images/hospital_showcase_banner.svg",
    dashboardTitle: "CarePlus HMS — Clinical Operations & Ward Telemetry",
    dashboardContent: `
      <div style="margin-bottom:20px;">
        <img src="assets/images/hospital_showcase_banner.svg" alt="Hospital Management Portal" class="modal-img-full">
      </div>
      <div class="modal-kpi-grid">
        <div class="modal-kpi-card">
          <h4>Total Admissions</h4>
          <p>3,420+</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Bed Occupancy</h4>
          <p>86.4%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Wait Time Drop</h4>
          <p>-38.0%</p>
        </div>
        <div class="modal-kpi-card">
          <h4>Doctors On Call</h4>
          <p>48</p>
        </div>
      </div>
      <div style="margin-top:24px;line-height:1.8;font-size:14px;color:#cbd5e1;">
        <h4 style="color:#f6c042;margin-bottom:8px;">Clinical ERP Architecture:</h4>
        <p>• Role-Based Access Control (RBAC) securely separating administrative, nursing, and consultant views.</p>
        <p>• Automated inpatient bed allocation and discharge workflow with real-time ward telemetry.</p>
        <p>• Integrated digital pharmacy prescription dispensing and itemized insurance billing pipeline.</p>
      </div>
    `
  }
};

window.openDeckModal = function(projectId) {
  const data = projectModalData[projectId];
  if (!data) return;
  const modal = document.getElementById('notableModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (modal && title && body) {
    title.textContent = data.title;
    body.innerHTML = `
      <div style="text-align:center;">
        <img src="${data.deckImg}" alt="${data.title}" class="modal-img-full" style="max-height:75vh;object-fit:contain;">
      </div>
      <div style="margin-top:20px;text-align:right;">
        <a href="${data.deckImg}" target="_blank" class="action-pill-btn" style="display:inline-flex;padding:8px 20px;">Open Full Resolution Image ↗</a>
      </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  }
};

window.openDashboardModal = function(projectId) {
  const data = projectModalData[projectId];
  if (!data) return;
  const modal = document.getElementById('notableModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  if (modal && title && body) {
    title.textContent = data.dashboardTitle;
    body.innerHTML = data.dashboardContent;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  }
};

window.closeNotableModal = function() {
  const modal = document.getElementById('notableModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNotableModal();
  }
});
