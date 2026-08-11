/**
 * ==========================================================================
 * GROCERY GALLERY — CUSTOMER CLIENT SCRIPT (script.js)
 * High-Performance, Reusable Frontend Logic using LocalStorage & DOM Methods
 * Includes Product Stock Tracking & Dynamic Quantity Order Calculation
 * ==========================================================================
 */

const STORAGE_KEY = 'groceryGalleryProducts';

// Helper function to build high quality SVG placeholder images for products
function createSvgPlaceholder(title, category, colorHex) {
  const iconMap = {
    Fruits: '🍎',
    Vegetables: '🥦',
    Drinks: '🥤',
    Snacks: '🍪',
    Groceries: '🛒'
  };
  const icon = iconMap[category] || '🛒';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${colorHex}"/>
    <circle cx="200" cy="130" r="65" fill="#ffffff" opacity="0.9"/>
    <text x="200" y="145" font-family="sans-serif" font-size="52" text-anchor="middle">${icon}</text>
    <text x="200" y="240" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
  </svg>`;
  
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// 24 Initial Demo Grocery Products with Pakistani PKR pricing and Stock counts
const INITIAL_DEMO_PRODUCTS = [
  // FRUITS (12 Items)
  {
    id: 'prod_1',
    name: 'Red Delicious Apples (1kg)',
    category: 'Fruits',
    image: createSvgPlaceholder('Red Apples', 'Fruits', '#dc2626'),
    price: 450,
    deliveryPrice: 100,
    stock: 45,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_2',
    name: 'Fresh Sindhri Mangoes (1kg)',
    category: 'Fruits',
    image: createSvgPlaceholder('Sindhri Mangoes', 'Fruits', '#f59e0b'),
    price: 350,
    deliveryPrice: 100,
    stock: 30,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_3',
    name: 'Farm Bananas (1 Dozen)',
    category: 'Fruits',
    image: createSvgPlaceholder('Bananas', 'Fruits', '#eab308'),
    price: 180,
    deliveryPrice: 80,
    stock: 60,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_4',
    name: 'Sweet Kinnow Oranges (1 Dozen)',
    category: 'Fruits',
    image: createSvgPlaceholder('Kinnow Oranges', 'Fruits', '#ea580c'),
    price: 250,
    deliveryPrice: 90,
    stock: 25,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_5',
    name: 'Fresh Seedless Grapes (500g)',
    category: 'Fruits',
    image: createSvgPlaceholder('Seedless Grapes', 'Fruits', '#9333ea'),
    price: 400,
    deliveryPrice: 100,
    stock: 18,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_6',
    name: 'Juicy Watermelon (1 Whole ~4kg)',
    category: 'Fruits',
    image: createSvgPlaceholder('Watermelon', 'Fruits', '#059669'),
    price: 300,
    deliveryPrice: 120,
    stock: 15,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_7',
    name: 'Red Pomegranate (1kg)',
    category: 'Fruits',
    image: createSvgPlaceholder('Pomegranate', 'Fruits', '#b91c1c'),
    price: 500,
    deliveryPrice: 100,
    stock: 12,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_8',
    name: 'Guava - Amrood (1kg)',
    category: 'Fruits',
    image: createSvgPlaceholder('Guava', 'Fruits', '#65a30d'),
    price: 220,
    deliveryPrice: 80,
    stock: 35,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_9',
    name: 'Fresh Strawberries (Pack 250g)',
    category: 'Fruits',
    image: createSvgPlaceholder('Strawberries', 'Fruits', '#e11d48'),
    price: 600,
    deliveryPrice: 100,
    stock: 4,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_10',
    name: 'Golden Pineapple (1 Piece)',
    category: 'Fruits',
    image: createSvgPlaceholder('Pineapple', 'Fruits', '#ca8a04'),
    price: 450,
    deliveryPrice: 100,
    stock: 8,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_11',
    name: 'Swat Peaches (1kg)',
    category: 'Fruits',
    image: createSvgPlaceholder('Swat Peaches', 'Fruits', '#f97316'),
    price: 380,
    deliveryPrice: 90,
    stock: 20,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_12',
    name: 'Nashpati Pears (1kg)',
    category: 'Fruits',
    image: createSvgPlaceholder('Nashpati Pears', 'Fruits', '#84cc16'),
    price: 320,
    deliveryPrice: 90,
    stock: 0,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },

  // GROCERIES / VEGETABLES / DRINKS / SNACKS (12 Items)
  {
    id: 'prod_13',
    name: 'Super Kernel Basmati Rice (1kg)',
    category: 'Groceries',
    image: createSvgPlaceholder('Basmati Rice', 'Groceries', '#0d9488'),
    price: 380,
    deliveryPrice: 100,
    stock: 100,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_14',
    name: 'Premium Cooking Oil (1 Litre Pouch)',
    category: 'Groceries',
    image: createSvgPlaceholder('Cooking Oil', 'Groceries', '#d97706'),
    price: 520,
    deliveryPrice: 100,
    stock: 75,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_15',
    name: 'Refined White Sugar (1kg)',
    category: 'Groceries',
    image: createSvgPlaceholder('Refined Sugar', 'Groceries', '#0284c7'),
    price: 150,
    deliveryPrice: 80,
    stock: 80,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_16',
    name: 'Chakki Whole Wheat Atta (5kg Bag)',
    category: 'Groceries',
    image: createSvgPlaceholder('Chakki Atta', 'Groceries', '#b45309'),
    price: 650,
    deliveryPrice: 150,
    stock: 50,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_17',
    name: 'Supreme Danedar Black Tea (250g)',
    category: 'Groceries',
    image: createSvgPlaceholder('Supreme Tea', 'Groceries', '#451a03'),
    price: 420,
    deliveryPrice: 80,
    stock: 40,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_18',
    name: 'Nescafe Classic Instant Coffee (100g)',
    category: 'Drinks',
    image: createSvgPlaceholder('Nescafe Coffee', 'Drinks', '#78350f'),
    price: 850,
    deliveryPrice: 100,
    stock: 3,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_19',
    name: 'MilkPack Pure UHT Milk (1 Litre)',
    category: 'Drinks',
    image: createSvgPlaceholder('MilkPack 1L', 'Drinks', '#2563eb'),
    price: 290,
    deliveryPrice: 80,
    stock: 90,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_20',
    name: 'Nestle Milkpak Fresh Yogurt (1kg)',
    category: 'Groceries',
    image: createSvgPlaceholder('Fresh Yogurt', 'Groceries', '#3b82f6'),
    price: 220,
    deliveryPrice: 80,
    stock: 30,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_21',
    name: 'Dawn Large Sandwich Bread',
    category: 'Groceries',
    image: createSvgPlaceholder('Dawn Bread', 'Groceries', '#d97706'),
    price: 140,
    deliveryPrice: 60,
    stock: 50,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_22',
    name: 'Chocolate Cream Biscuits Family Pack',
    category: 'Snacks',
    image: createSvgPlaceholder('Cream Biscuits', 'Snacks', '#a16207'),
    price: 100,
    deliveryPrice: 60,
    stock: 65,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_23',
    name: 'Lays Masala Wavy Potato Chips (Large)',
    category: 'Snacks',
    image: createSvgPlaceholder('Lays Chips', 'Snacks', '#eab308'),
    price: 90,
    deliveryPrice: 50,
    stock: 110,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  },
  {
    id: 'prod_24',
    name: 'Gourmet Cola Soft Drink (1.5 Litre)',
    category: 'Drinks',
    image: createSvgPlaceholder('Gourmet Cola', 'Drinks', '#dc2626'),
    price: 130,
    deliveryPrice: 70,
    stock: 70,
    whatsapp: '923001234567',
    deliveryOption: 'Cash on Delivery',
    createdAt: '2026-08-01'
  }
];

// Reusable LocalStorage Management Functions
function getProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  let products = INITIAL_DEMO_PRODUCTS;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        products = parsed;
      }
    } catch (e) {
      console.error('Error reading localStorage, reinitializing demo products.', e);
      products = INITIAL_DEMO_PRODUCTS;
    }
  }

  // Ensure every product object contains the stock property
  return products.map(p => ({
    ...p,
    stock: typeof p.stock === 'number' ? p.stock : 50
  }));
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function updateProduct(updatedProduct) {
  let products = getProducts();
  products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
  saveProducts(products);
}

// Toast notification function
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
  
  const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// State management for Customer UI
let currentCategoryFilter = 'All';
let currentSearchQuery = '';
let activeProductForOrder = null;
let orderQuantity = 1;

// DOM Load Event Handler
document.addEventListener('DOMContentLoaded', () => {
  // Ensure products exist in localStorage
  getProducts();

  // Setup search input listener
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      renderProducts();
    });

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = searchInput.value.trim();

        // Secret Admin Access Check: "HAROON"
        if (val === 'HAROON') {
          showToast('Redirecting to Secret Admin Gateway...', 'success');
          setTimeout(() => {
            window.location.href = 'admin_login.html';
          }, 600);
          return;
        }

        currentSearchQuery = val;
        renderProducts();
      });
    }
  }

  // Category filter buttons setup
  const catButtons = document.querySelectorAll('.cat-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategoryFilter = btn.getAttribute('data-category') || 'All';
      renderProducts();
    });
  });

  // Modal Close Listeners
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('product-detail-modal');
      closeModal('order-modal');
    });
  });

  // Quantity Control Buttons Listeners
  const minusBtn = document.getElementById('qty-minus-btn');
  const plusBtn = document.getElementById('qty-plus-btn');
  const qtyInput = document.getElementById('order-qty-input');

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (!activeProductForOrder || activeProductForOrder.stock <= 0) return;
      if (orderQuantity > 1) {
        orderQuantity--;
        updateOrderCalculations();
      }
    });
  }

  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      if (!activeProductForOrder || activeProductForOrder.stock <= 0) return;
      if (orderQuantity < activeProductForOrder.stock) {
        orderQuantity++;
        updateOrderCalculations();
      } else {
        showToast(`Only ${activeProductForOrder.stock} units available in stock.`, 'warning');
      }
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener('change', (e) => {
      if (!activeProductForOrder || activeProductForOrder.stock <= 0) return;
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > activeProductForOrder.stock) {
        showToast(`Only ${activeProductForOrder.stock} units available in stock.`, 'warning');
        val = activeProductForOrder.stock;
      }
      orderQuantity = val;
      updateOrderCalculations();
    });
  }

  // Order Confirmation Form Handler
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }

  // Initial Product Render
  renderProducts();
});

// Render Customer Products
function renderProducts() {
  const grid = document.getElementById('product-grid');
  const emptyState = document.getElementById('empty-state');
  if (!grid) return;

  const allProducts = getProducts();

  // Filter products by search query and category
  const filtered = allProducts.filter(p => {
    const matchesCategory = (currentCategoryFilter === 'All') || (p.category === currentCategoryFilter);
    const query = currentSearchQuery.toLowerCase();
    const matchesSearch = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = filtered.map(product => {
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    let stockBadge = '';
    if (isOutOfStock) {
      stockBadge = `<span class="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">Out of Stock</span>`;
    } else if (isLowStock) {
      stockBadge = `<span class="absolute top-3 right-3 bg-amber-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">Low Stock (${product.stock} left)</span>`;
    } else {
      stockBadge = `<span class="absolute top-3 right-3 badge-delivery">${escapeHtml(product.deliveryOption || 'Cash on Delivery')}</span>`;
    }

    const actionButton = isOutOfStock ? `
      <button 
        disabled
        class="w-full bg-slate-200 text-slate-500 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm cursor-not-allowed border border-slate-300"
      >
        <span>🚫</span> OUT OF STOCK
      </button>
    ` : `
      <button 
        onclick="openOrderModal('${product.id}')"
        class="w-full bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        ORDER NOW
      </button>
    `;

    return `
      <div class="product-card bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden shadow-xs flex flex-col justify-between">
        <div class="relative cursor-pointer group" onclick="openProductDetail('${product.id}')">
          <div class="w-full h-48 bg-[#F7F6F0] overflow-hidden relative flex items-center justify-center border-b border-[#E5E3DC]">
            <img 
              src="${product.image}" 
              alt="${escapeHtml(product.name)}" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-60 grayscale-[30%]' : ''}"
              onerror="this.onerror=null; this.src='https://placehold.co/400x300/5A5A40/ffffff?text=Grocery+Gallery';"
            />
            <span class="absolute top-3 left-3 badge-category">${escapeHtml(product.category)}</span>
            ${stockBadge}
          </div>
          <div class="p-4">
            <h3 class="font-normal font-serif text-[#2A2A24] text-lg leading-snug line-clamp-2 group-hover:text-[#5A5A40] transition-colors">
              ${escapeHtml(product.name)}
            </h3>
            <div class="mt-2 flex items-baseline justify-between">
              <div>
                <span class="text-[10px] text-[#66665C] font-bold uppercase tracking-wider block">Price</span>
                <span class="text-xl font-extrabold text-[#5A5A40]">Rs. ${product.price}</span>
              </div>
              <div class="text-right">
                <span class="text-[10px] text-[#66665C] font-bold uppercase tracking-wider block">Delivery</span>
                <span class="text-xs font-semibold text-[#2A2A24]">Rs. ${product.deliveryPrice}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 pb-4 pt-1">
          ${actionButton}
        </div>
      </div>
    `;
  }).join('');
}

// Open Product Detail Modal
function openProductDetail(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const img = document.getElementById('detail-img');
  const title = document.getElementById('detail-title');
  const category = document.getElementById('detail-category');
  const price = document.getElementById('detail-price');
  const delivery = document.getElementById('detail-delivery');
  const stockEl = document.getElementById('detail-stock');
  const option = document.getElementById('detail-option');
  const orderBtn = document.getElementById('detail-order-btn');

  if (img) img.src = product.image;
  if (title) title.innerText = product.name;
  if (category) category.innerText = product.category;
  if (price) price.innerText = `Rs. ${product.price}`;
  if (delivery) delivery.innerText = `Rs. ${product.deliveryPrice}`;
  if (option) option.innerText = product.deliveryOption || 'Cash on Delivery';

  const stockVal = typeof product.stock === 'number' ? product.stock : 50;
  if (stockEl) {
    if (stockVal === 0) {
      stockEl.innerHTML = `<span class="text-red-600 font-extrabold">Out of Stock (0 units)</span>`;
    } else if (stockVal <= 5) {
      stockEl.innerHTML = `<span class="text-amber-700 font-bold">Low Stock (${stockVal} units left)</span>`;
    } else {
      stockEl.innerHTML = `<span class="text-[#5A5A40] font-bold">${stockVal} units available</span>`;
    }
  }

  if (orderBtn) {
    if (stockVal <= 0) {
      orderBtn.innerText = 'OUT OF STOCK';
      orderBtn.disabled = true;
      orderBtn.className = 'w-full bg-slate-300 text-slate-500 font-bold py-3.5 px-6 rounded-2xl cursor-not-allowed';
    } else {
      orderBtn.innerText = 'ORDER NOW';
      orderBtn.disabled = false;
      orderBtn.className = 'w-full bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all text-base cursor-pointer';
      orderBtn.onclick = () => {
        closeModal('product-detail-modal');
        openOrderModal(productId);
      };
    }
  }

  openModal('product-detail-modal');
}

// Open Order Form Modal
function openOrderModal(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  activeProductForOrder = product;
  orderQuantity = 1;

  const stockVal = typeof product.stock === 'number' ? product.stock : 50;
  const stockNotice = document.getElementById('order-stock-notice');
  const qtyInput = document.getElementById('order-qty-input');
  const minusBtn = document.getElementById('qty-minus-btn');
  const plusBtn = document.getElementById('qty-plus-btn');

  if (stockNotice) {
    if (stockVal === 0) {
      stockNotice.innerText = 'Out of Stock';
      stockNotice.className = 'text-[11px] font-bold text-red-600';
    } else if (stockVal <= 5) {
      stockNotice.innerText = `Only ${stockVal} units remaining!`;
      stockNotice.className = 'text-[11px] font-bold text-amber-700';
    } else {
      stockNotice.innerText = `${stockVal} units available`;
      stockNotice.className = 'text-[11px] font-semibold text-[#5A5A40]';
    }
  }

  if (qtyInput) {
    qtyInput.value = 1;
    qtyInput.disabled = stockVal === 0;
  }
  if (minusBtn) minusBtn.disabled = stockVal === 0;
  if (plusBtn) plusBtn.disabled = stockVal === 0;

  updateOrderCalculations();
  openModal('order-modal');
}

// Update Dynamic Bill Breakdown
function updateOrderCalculations() {
  if (!activeProductForOrder) return;

  const title = document.getElementById('order-prod-title');
  const unitPriceEl = document.getElementById('order-unit-price');
  const qtyDisplay = document.getElementById('order-qty-display');
  const unitPriceSub = document.getElementById('order-unit-price-sub');
  const qtyInput = document.getElementById('order-qty-input');
  const subtotalEl = document.getElementById('order-prod-subtotal');
  const delivery = document.getElementById('order-prod-delivery');
  const total = document.getElementById('order-prod-total');

  const unitPrice = Number(activeProductForOrder.price) || 0;
  const deliveryCharge = Number(activeProductForOrder.deliveryPrice) || 0;
  const subtotal = unitPrice * orderQuantity;
  const totalBill = subtotal + deliveryCharge;

  if (title) title.innerText = activeProductForOrder.name;
  if (unitPriceEl) unitPriceEl.innerText = `Rs. ${unitPrice}`;
  if (unitPriceSub) unitPriceSub.innerText = `Rs. ${unitPrice}`;
  if (qtyDisplay) qtyDisplay.innerText = orderQuantity;
  if (qtyInput) qtyInput.value = orderQuantity;
  if (subtotalEl) subtotalEl.innerText = `Rs. ${subtotal}`;
  if (delivery) delivery.innerText = `Rs. ${deliveryCharge}`;
  if (total) total.innerText = `Rs. ${totalBill}`;
}

// Submit Order and Construct Dynamic WhatsApp Redirect URL
function handleOrderSubmit(e) {
  e.preventDefault();
  if (!activeProductForOrder) return;

  if (activeProductForOrder.stock <= 0) {
    showToast('Sorry, this product is currently out of stock.', 'error');
    return;
  }

  if (orderQuantity > activeProductForOrder.stock) {
    showToast(`Cannot order ${orderQuantity} units. Only ${activeProductForOrder.stock} units in stock.`, 'warning');
    return;
  }

  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const addressInput = document.getElementById('cust-address');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const address = addressInput ? addressInput.value.trim() : '';

  if (!name || !address) {
    showToast('Please fill in your Name and Complete Delivery Address.', 'warning');
    return;
  }

  const unitPrice = Number(activeProductForOrder.price) || 0;
  const subtotal = unitPrice * orderQuantity;
  const delPrice = Number(activeProductForOrder.deliveryPrice) || 0;
  const totalBill = subtotal + delPrice;
  const rawWhatsAppNumber = (activeProductForOrder.whatsapp || '923001234567').replace(/[^0-9]/g, '');

  // Format WhatsApp Message with Quantity Breakdown
  const message = `Hello, I want to order ${activeProductForOrder.name}.

Quantity: ${orderQuantity} unit(s)
Price per Unit: Rs. ${unitPrice}
Products Subtotal: Rs. ${subtotal}
Flat Delivery Charges: Rs. ${delPrice}
Total Bill: Rs. ${totalBill}

Customer Name: ${name}
Phone: ${phone || 'N/A'}
Delivery Address: ${address}

Payment/Delivery Option: ${activeProductForOrder.deliveryOption || 'Cash on Delivery'}`;

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${rawWhatsAppNumber}?text=${encodedMessage}`;

  // Automatically deduct stock in localStorage
  activeProductForOrder.stock = Math.max(0, activeProductForOrder.stock - orderQuantity);
  updateProduct(activeProductForOrder);

  showToast('Order confirmed! Opening WhatsApp...', 'success');

  // Open WhatsApp in new tab and refresh shop grid
  setTimeout(() => {
    window.open(waUrl, '_blank');
    closeModal('order-modal');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (addressInput) addressInput.value = '';
    activeProductForOrder = null;
    orderQuantity = 1;
    renderProducts();
  }, 800);
}

// Reusable Modal Utilities
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Escape HTML for safety
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
