// Mobile Hamburger Menu Toggle
function toggleMobileMenu() {
  const nav = document.getElementById('nav-menu');
  const hamburger = document.getElementById('hamburger-btn');
  nav.classList.toggle('open');
  hamburger.classList.toggle('active');
}

// Close mobile menu when a nav link is clicked or clicking outside
document.addEventListener('click', (e) => {
  const nav = document.getElementById('nav-menu');
  const hamburger = document.getElementById('hamburger-btn');

  if (!nav || !hamburger) return;

  // Close if clicking a link
  if (e.target.matches('nav a')) {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
  }

  // Close if clicking outside the menu and hamburger button
  if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
  }
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Active Link Update on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Render Menu Cards (Carousel) with Filter Support
function renderMenu(filter = 'all') {
  const container = document.getElementById('food-carousel');
  if (!container) return;

  // Show Skeleton Loading State
  container.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card skeleton';
    container.appendChild(skeleton);
  }

  // Simulate loading delay for "premium" feel and to show skeleton
  setTimeout(() => {
    container.innerHTML = '';

    const filteredFoods = filter === 'all'
      ? foods
      : foods.filter(food => food.category === filter);

    filteredFoods.forEach((food, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'food-card-wrap';
      wrap.setAttribute('data-aos', 'fade-up');
      wrap.setAttribute('data-aos-delay', (index % 4) * 100);
      wrap.innerHTML = `
        <div class="food-card">
          <h3 class="card-title">${food.name}</h3>
          <div class="card-stats">
            <div class="stat-pill heart">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ${food.likes}
            </div>
            <div class="stat-pill star">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ${food.rating}
            </div>
          </div>
          <a href="detail.html?id=${food.id}" class="btn-detail">Lihat Detail</a>
        </div>
        <div class="food-card-img-box">
          <img src="${food.image}" alt="${food.name}">
          <div class="card-price-badge">${food.price}</div>
        </div>
      `;
      container.appendChild(wrap);
    });

    if (typeof AOS !== 'undefined') AOS.refresh();
  }, 400); // 400ms is perfect for a quick but visible skeleton
}

// Render Testimonials
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container || typeof testimonials === 'undefined') return;

  testimonials.forEach((testi, index) => {
    const stars = '★'.repeat(testi.rating) + '☆'.repeat(5 - testi.rating);
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index % 3) * 150);
    card.innerHTML = `
      <div class="testi-header">
        <img src="${testi.avatar}" alt="${testi.name}" class="testi-avatar">
        <div>
          <div class="testi-name">${testi.name}</div>
          <div class="testi-role">${testi.role}</div>
        </div>
      </div>
      <div class="testi-rating">${stars}</div>
      <p class="testi-comment">"${testi.comment}"</p>
    `;
    container.appendChild(card);
  });

  if (typeof AOS !== 'undefined') AOS.refresh();
}

// Filter Logic Initialization
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update UI
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Render filtered
      const category = btn.getAttribute('data-category');
      renderMenu(category);
    });
  });
}

// Render Top Foods (Circular Items)
function renderTopFoods() {
  const container = document.getElementById('top-foods');
  if (!container) return;

  // Take first 4 as top foods
  foods.slice(0, 4).forEach((food, index) => {
    const item = document.createElement('div');
    item.className = 'top-food-item';
    item.setAttribute('data-aos', 'zoom-in');
    item.setAttribute('data-aos-delay', index * 100);
    item.innerHTML = `
      <div class="top-food-img-box">
        <img src="${food.image}" alt="${food.name}" class="top-food-img">
        <div class="top-food-glow"></div>
      </div>
      <div style="text-align: center;">
        <h3 class="top-food-name">${food.name}</h3>
        <p class="top-food-meta">Warung R3 Berkah</p>
      </div>
    `;
    item.onclick = () => window.location.href = `detail.html?id=${food.id}`;
    container.appendChild(item);
  });

  if (typeof AOS !== 'undefined') AOS.refresh();
}

// Carousel Navigation
function scrollCarousel(direction) {
  const container = document.getElementById('food-carousel');
  const scrollAmount = 300;
  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
}

// Detail Page Logic
function loadDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  if (!id) return;

  const food = foods.find(f => f.id === id);
  if (!food) {
    document.body.innerHTML = '<div style="text-align:center; padding: 100px;"><h1>Menu tidak ditemukan</h1><a href="index.html">Kembali ke Home</a></div>';
    return;
  }

  document.title = `${food.name} | R3 Berkah`;

  const setContent = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setContent('food-name', food.name);
  setContent('food-price', food.price);
  setContent('food-desc', food.description);
  setContent('food-likes', `${food.likes} Suka`);
  setContent('food-rating', food.rating);

  const imgEl = document.getElementById('food-img');
  if (imgEl) {
    imgEl.src = food.image;
    imgEl.alt = food.name;
  }

  const ingredientsGrid = document.getElementById('ingredients-grid');
  if (ingredientsGrid && food.ingredients) {
    ingredientsGrid.innerHTML = '';
    food.ingredients.forEach(item => {
      const div = document.createElement('div');
      div.className = 'ingredient-item';
      div.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${item}</span>
      `;
      ingredientsGrid.appendChild(div);
    });
  }

   const flavorGrid = document.getElementById('flavor-grid');
  if (flavorGrid && food.flavors) {
    flavorGrid.innerHTML = '';
    food.flavors.forEach(item => {
      const div = document.createElement('div');
      div.className = 'ingredient-item';
      div.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${item}</span>
      `;
      flavorGrid.appendChild(div);
    });
  }

 

  const waBtn = document.getElementById('wa-btn');
  if (waBtn) {
    const waMessage = `Halo Warung R3 Berkah, saya ingin memesan ${food.name}. Berapa harganya ya?`;
    const waUrl = `https://wa.me/6285147191733?text=${encodeURIComponent(waMessage)}`;
    waBtn.href = waUrl;
  }
}


// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Robust Loader Hiding
  const hideLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        // Refresh AOS to catch Beranda animations after loader is gone
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      }, 1500); 
    }
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  if (document.getElementById('food-carousel')) {
    renderMenu();
    renderTopFoods();
    renderTestimonials();
    initFilters();
  }

  // Initialize AOS with Exit support
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: false,   // Allow repeating animations
      mirror: true,  // Allow animations when scrolling back up
      easing: 'ease-in-out-cubic',
      offset: 50     // Trigger earlier for better feel
    });
  }

  if (document.getElementById('food-name')) {
    loadDetail();
  }
});

// Lightbox Logic
function openLightbox(imageSrc) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');

  if (modal && img) {
    img.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

function closeLightbox(event) {
  // Only close if clicking the background or the close button, not the image itself
  if (event && event.target.id === 'lightbox-img') return;

  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    // Clear src after animation
    setTimeout(() => {
      document.getElementById('lightbox-img').src = '';
    }, 300);
  }
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});
