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
    const id = section.getAttribute('id');
    if (id && window.scrollY >= section.offsetTop - 100) {
      current = id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// // --- Language Translation Logic ---
let currentLang = localStorage.getItem('preferredLang') || 'id';

// Translation logic is now consolidated at the bottom of the file

function toggleLanguage() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('preferredLang', currentLang);

  applyTranslations();

  // Re-render dynamic components
  const activeFilter = document.querySelector('.filter-btn.active');
  renderMenu(activeFilter ? activeFilter.getAttribute('data-category') : 'all');
  renderTopFoods();

  // If on detail page
  if (document.getElementById('food-detail-name')) {
    loadDetail();
  }
}

// Render Menu Cards (Carousel) with Filter Support
function renderMenu(filter = 'all') {
  const container = document.getElementById('food-carousel');
  if (!container) return;

  container.scrollLeft = 0; // Reset scroll position on filter/render

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

    // Duplicate items for seamless infinite scroll
    const items = [...filteredFoods, ...filteredFoods];

    items.forEach((food, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'food-card-wrap';
      // Only apply AOS to the first set to avoid double animation triggers
      if (index < filteredFoods.length) {
        wrap.setAttribute('data-aos', 'fade-up');
        wrap.setAttribute('data-aos-delay', (index % 4) * 100);
      }

      const name = currentLang === 'en' ? (food.name_en || food.name) : food.name;
      const btnText = currentLang === 'en' ? 'View Details' : 'Lihat Detail';

      wrap.innerHTML = `
        <div class="food-card">
          <h3 class="card-title">${name}</h3>
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
          <a href="detail.html?id=${food.id}" class="btn-detail">${btnText}</a>
          <button onclick="addToCart(${food.id})" class="btn-add-cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span data-i18n="add-to-cart">Tambah</span>
          </button>
        </div>
        <div class="food-card-img-box">
          <img src="${food.image}" alt="${name}">
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
  container.innerHTML = '';

  foods.slice(0, 4).forEach((food, index) => {
    const item = document.createElement('div');
    item.className = 'top-food-item';
    item.setAttribute('data-aos', 'zoom-in');
    item.setAttribute('data-aos-delay', index * 100);

    const name = currentLang === 'en' ? (food.name_en || food.name) : food.name;
    const meta = currentLang === 'en' ? 'R3 Berkah Stall' : 'Warung R3 Berkah';

    item.innerHTML = `
      <div class="top-food-img-box">
        <img src="${food.image}" alt="${name}" class="top-food-img">
        <div class="top-food-glow"></div>
      </div>
      <div style="text-align: center;">
        <h3 class="top-food-name">${name}</h3>
        <p class="top-food-meta">${meta}</p>
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
  if (!container) return;

  const scrollAmount = 340;
  const halfWidth = container.scrollWidth / 2;

  if (direction === 'right') {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(() => {
      if (container.scrollLeft >= halfWidth) {
        container.scrollTo({ left: container.scrollLeft - halfWidth, behavior: 'auto' });
      }
    }, 600);
  } else {
    if (container.scrollLeft <= 5) {
      container.scrollTo({ left: halfWidth, behavior: 'auto' });
      setTimeout(() => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }, 10);
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }
}

// Powerful Continuous Auto Scroll Logic
let scrollSpeed = 1.2; // Pixels per frame
let isPaused = false;
let rafId;

function initAutoScroll() {
  const container = document.getElementById('food-carousel');
  if (!container) return;

  startContinuousScroll();

  container.addEventListener('mouseenter', () => isPaused = true);
  container.addEventListener('mouseleave', () => isPaused = false);

  const navBtns = document.querySelectorAll('.carousel-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      isPaused = true;
      clearTimeout(window.resumeScrollTimer);
      window.resumeScrollTimer = setTimeout(() => {
        isPaused = false;
      }, 5000);
    });
  });
}

function startContinuousScroll() {
  if (rafId) cancelAnimationFrame(rafId);

  function loop() {
    const container = document.getElementById('food-carousel');
    if (container && !isPaused) {
      // Only scroll if content overflows the container
      if (container.scrollWidth > container.clientWidth) {
        container.scrollLeft += scrollSpeed;

        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft = 0;
        }
      }
    }
    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);
}

// Detail Page Logic
function loadDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  if (!id) return;

  const food = foods.find(f => f.id === id);
  if (!food) return;

  const name = currentLang === 'en' ? (food.name_en || food.name) : food.name;
  const desc = currentLang === 'en' ? (food.description_en || food.description) : food.description;
  const ingredients = currentLang === 'en' ? (food.ingredients_en || food.ingredients) : food.ingredients;
  const flavors = currentLang === 'en' ? (food.flavors_en || food.flavors) : food.flavors;

  document.getElementById('food-detail-name').innerText = name;
  document.getElementById('food-detail-desc').innerText = desc;
  document.getElementById('food-detail-rating').innerText = food.rating;
  document.getElementById('food-detail-likes').innerText = food.likes;
  document.getElementById('food-detail-price').innerText = food.price;
  document.getElementById('food-img').src = food.image;
  document.getElementById('food-img').alt = name;

  const ingredientGrid = document.getElementById('ingredient-grid');
  if (ingredientGrid) {
    ingredientGrid.innerHTML = '';
    ingredients.forEach(item => {
      const div = document.createElement('div');
      div.className = 'ingredient-item';
      div.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${item}</span>
      `;
      ingredientGrid.appendChild(div);
    });
  }

  const flavorGrid = document.getElementById('flavor-grid');
  if (flavorGrid && flavors) {
    flavorGrid.innerHTML = '';
    flavors.forEach(item => {
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
    const waMessage = currentLang === 'en'
      ? `Hello Warung R3 Berkah, I would like to order ${name}. What is the price?`
      : `Halo Warung R3 Berkah, saya ingin memesan ${name}. Berapa harganya ya?`;
    waBtn.href = `https://wa.me/6285147191733?text=${encodeURIComponent(waMessage)}`;
  }

  // Bind Detail Page Add to Cart Button
  const addBtn = document.getElementById('add-to-cart-btn-detail');
  if (addBtn) {
    addBtn.onclick = () => addToCart(id);
  }
}

// Hide Loader Function
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      // Refresh AOS to catch animations once content is visible
      if (typeof AOS !== 'undefined') AOS.refresh();
    }, 600); // Smoother, premium fade out
  }
}

function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.innerHTML = translations[currentLang][key];
    }
    
    // Handle Placeholders
    const placeholderKey = el.getAttribute('data-i18n-placeholder');
    if (placeholderKey && translations[currentLang] && translations[currentLang][placeholderKey]) {
      el.setAttribute('placeholder', translations[currentLang][placeholderKey]);
    }
  });

  // Support for non-i18n elements that need placeholder translation
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.setAttribute('placeholder', translations[currentLang][key]);
    }
  });

  // Update Button Text & Icon
  const langText = document.getElementById('lang-text');
  const langIcon = document.querySelector('.lang-icon');

  if (langText) {
    langText.textContent = currentLang === 'id' ? 'Indonesia' : 'English';
  }

  if (langIcon && langIcon.innerHTML === '') {
    langIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
  }

  // Support old slider if it exists
  const langToggle = document.getElementById('lang-btn');
  if (langToggle) {
    if (currentLang === 'en') {
      langToggle.classList.add('en-active');
    } else {
      langToggle.classList.remove('en-active');
    }
  }
}

// Initialize everything on DOMContentLoaded
// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // --- Failsafe: Force hide loader after 3 seconds no matter what ---
  const failsafeTimeout = setTimeout(() => {
    console.warn("Loader failsafe triggered.");
    hideLoader();
  }, 3000);

  try {
    // 1. Apply translations
    if (typeof translations !== 'undefined') {
      applyTranslations();
    }

    // 2. Language Button Event
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', toggleLanguage);
    }

    // 3. Render Page Specific Components
    if (document.getElementById('food-carousel')) {
      if (typeof foods !== 'undefined') {
        renderMenu();
        renderTopFoods();
      }
      if (typeof testimonials !== 'undefined') {
        renderTestimonials();
      }
      initFilters();
      initAutoScroll();
    }

    if (document.getElementById('food-detail-name')) {
      if (typeof foods !== 'undefined') {
        loadDetail();
      }
    }

    // 4. Initialize AOS with Premium Config
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-quad'
      });
    }

    // 5. Balanced delay for a "premium" feel (Increased for visibility)
    const isDetail = document.getElementById('food-detail-name');
    const delay = isDetail ? 1500 : 1500; // Increased to 1.5s as requested

    setTimeout(() => {
      clearTimeout(failsafeTimeout);
      hideLoader();
    }, delay);

  } catch (error) {
    console.error("Initialization error:", error);
    clearTimeout(failsafeTimeout);
    hideLoader(); // Emergency hide
  }
});

// --- Shopping Cart Logic ---
let cart = JSON.parse(localStorage.getItem('r3_cart')) || [];

function toggleOrderInfo() {
  const body = document.getElementById('cart-order-body');
  const header = document.querySelector('.cart-collapsible-header');
  if (body && header) {
    body.classList.toggle('collapsed');
    header.classList.toggle('collapsed-icon');
  }
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer && overlay) {
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}

function addToCart(productId) {
  const food = foods.find(f => f.id === productId);
  if (!food) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: food.name,
      name_en: food.name_en,
      price: food.price,
      image: food.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  
  // Open cart drawer after adding
  const drawer = document.getElementById('cart-drawer');
  if (drawer && !drawer.classList.contains('open')) {
    toggleCart();
  }
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('r3_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalAmount = document.getElementById('cart-total-amount');

  if (!cartCount || !cartItemsContainer || !cartTotalAmount) return;

  // Update total items count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalItems;

  // Render items
  cartItemsContainer.innerHTML = '';
  let totalOrder = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align:center; padding: 40px 0; color: var(--muted);" data-i18n="cart-empty">Keranjang kosong</p>`;
    applyTranslations();
  } else {
    cart.forEach(item => {
      const priceVal = parseInt(item.price.replace(/[^0-9]/g, ''));
      totalOrder += priceVal * item.quantity;
      
      const name = currentLang === 'en' ? (item.name_en || item.name) : item.name;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-price">${item.price}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  cartTotalAmount.innerText = `Rp ${totalOrder.toLocaleString('id-ID')}`;
}

function checkoutWA() {
  if (cart.length === 0) return;

  const nameEl = document.getElementById('customer-name');
  const customerName = nameEl ? nameEl.value.trim() : "";

  let message = currentLang === 'en' ? "*Order Summary - Warung R3 Berkah*\n\n" : "*Ringkasan Pesanan - Warung R3 Berkah*\n\n";
  
  if (customerName) {
    const nameLabel = currentLang === 'en' ? "Customer Name" : "Nama Customer";
    message += `👤 *${nameLabel}: ${customerName}*\n`;
  }

  const pickupEl = document.getElementById('pickup-time');
  const pickupTime = pickupEl ? pickupEl.value.trim() : "";
  if (pickupTime) {
    const pickupLabel = currentLang === 'en' ? "Pickup Time" : "Waktu Ambil";
    message += `⏰ *${pickupLabel}: ${pickupTime}*\n`;
  }

  if (customerName || pickupTime) {
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
  }

  let totalOrder = 0;

  cart.forEach(item => {
    const name = currentLang === 'en' ? (item.name_en || item.name) : item.name;
    const priceVal = parseInt(item.price.replace(/[^0-9]/g, ''));
    const itemTotal = priceVal * item.quantity;
    totalOrder += itemTotal;
    
    message += `✅ *${name}*\n`;
    message += `   ${item.quantity} x ${item.price} = Rp ${itemTotal.toLocaleString('id-ID')}\n\n`;
  });

  const totalText = currentLang === 'en' ? "Total Amount" : "Total Keseluruhan";
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *${totalText}: Rp ${totalOrder.toLocaleString('id-ID')}*\n\n`;

  // Add Notes if any
  const notesEl = document.getElementById('cart-notes');
  if (notesEl && notesEl.value.trim() !== '') {
    const notesTitle = currentLang === 'en' ? "Notes (Flavor/Topping):" : "Catatan (Rasa/Topping):";
    message += `📝 *${notesTitle}*\n`;
    message += `_"${notesEl.value.trim()}"_`;
  }

  const waUrl = `https://wa.me/6285147191733?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// Initial UI Update
document.addEventListener('DOMContentLoaded', updateCartUI);

// Lightbox Logic
function openLightbox(imgSrc) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (modal && img) {
    img.src = imgSrc;
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

function closeLightbox(e) {
  // If an event is passed, check if the click target is inside the content (e.g. the image itself).
  // We only close if clicking the overlay background or the close button.
  if (e && e.target && e.target.closest('.lightbox-content')) {
    return;
  }
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = 'auto';
  }
}

// Close lightbox on Esc key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
