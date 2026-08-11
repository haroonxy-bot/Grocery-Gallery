/**
 * ==========================================================================
 * GROCERY GALLERY — ADMIN DASHBOARD LOGIC (admin_dashboard.js)
 * Comprehensive CRUD & LocalStorage State Synchronization with FileReader API
 * Stock Inventory Tracking & Admin Account Security Settings
 * ==========================================================================
 */

const STORAGE_KEY = 'groceryGalleryProducts';
const ADMIN_CREDS_KEY = 'groceryGalleryAdmin';

// Retrieve or Initialize Admin Credentials in LocalStorage
function getAdminCredentials() {
  const stored = localStorage.getItem(ADMIN_CREDS_KEY);
  if (!stored) {
    const defaultCreds = { username: 'HAROON', password: '123' };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaultCreds));
    return defaultCreds;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed && parsed.username && parsed.password) {
      return parsed;
    }
  } catch (e) {
    console.error('Error parsing admin credentials, resetting to default.', e);
  }
  const defaultCreds = { username: 'HAROON', password: '123' };
  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaultCreds));
  return defaultCreds;
}

function saveAdminCredentials(creds) {
  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
}

// Verify Admin Session on Load
function checkAdminAuth() {
  const isAuth = localStorage.getItem('groceryGalleryAdminAuth');
  if (isAuth !== 'true') {
    window.location.href = 'admin_login.html';
  }
}

// Helper function to build SVG placeholders
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

// Default 24 Demo Products with Initial Stock values
const INITIAL_DEMO_PRODUCTS = [
  { id: 'prod_1', name: 'Red Delicious Apples (1kg)', category: 'Fruits', image: createSvgPlaceholder('Red Apples', 'Fruits', '#dc2626'), price: 450, deliveryPrice: 100, stock: 45, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_2', name: 'Fresh Sindhri Mangoes (1kg)', category: 'Fruits', image: createSvgPlaceholder('Sindhri Mangoes', 'Fruits', '#f59e0b'), price: 350, deliveryPrice: 100, stock: 30, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_3', name: 'Farm Bananas (1 Dozen)', category: 'Fruits', image: createSvgPlaceholder('Bananas', 'Fruits', '#eab308'), price: 180, deliveryPrice: 80, stock: 60, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_4', name: 'Sweet Kinnow Oranges (1 Dozen)', category: 'Fruits', image: createSvgPlaceholder('Kinnow Oranges', 'Fruits', '#ea580c'), price: 250, deliveryPrice: 90, stock: 25, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_5', name: 'Fresh Seedless Grapes (500g)', category: 'Fruits', image: createSvgPlaceholder('Seedless Grapes', 'Fruits', '#9333ea'), price: 400, deliveryPrice: 100, stock: 18, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_6', name: 'Juicy Watermelon (1 Whole ~4kg)', category: 'Fruits', image: createSvgPlaceholder('Watermelon', 'Fruits', '#059669'), price: 300, deliveryPrice: 120, stock: 15, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_7', name: 'Red Pomegranate (1kg)', category: 'Fruits', image: createSvgPlaceholder('Pomegranate', 'Fruits', '#b91c1c'), price: 500, deliveryPrice: 100, stock: 12, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_8', name: 'Guava - Amrood (1kg)', category: 'Fruits', image: createSvgPlaceholder('Guava', 'Fruits', '#65a30d'), price: 220, deliveryPrice: 80, stock: 35, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_9', name: 'Fresh Strawberries (Pack 250g)', category: 'Fruits', image: createSvgPlaceholder('Strawberries', 'Fruits', '#e11d48'), price: 600, deliveryPrice: 100, stock: 4, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_10', name: 'Golden Pineapple (1 Piece)', category: 'Fruits', image: createSvgPlaceholder('Pineapple', 'Fruits', '#ca8a04'), price: 450, deliveryPrice: 100, stock: 8, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_11', name: 'Swat Peaches (1kg)', category: 'Fruits', image: createSvgPlaceholder('Swat Peaches', 'Fruits', '#f97316'), price: 380, deliveryPrice: 90, stock: 20, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_12', name: 'Nashpati Pears (1kg)', category: 'Fruits', image: createSvgPlaceholder('Nashpati Pears', 'Fruits', '#84cc16'), price: 320, deliveryPrice: 90, stock: 0, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_13', name: 'Super Kernel Basmati Rice (1kg)', category: 'Groceries', image: createSvgPlaceholder('Basmati Rice', 'Groceries', '#0d9488'), price: 380, deliveryPrice: 100, stock: 100, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_14', name: 'Premium Cooking Oil (1 Litre Pouch)', category: 'Groceries', image: createSvgPlaceholder('Cooking Oil', 'Groceries', '#d97706'), price: 520, deliveryPrice: 100, stock: 75, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_15', name: 'Refined White Sugar (1kg)', category: 'Groceries', image: createSvgPlaceholder('Refined Sugar', 'Groceries', '#0284c7'), price: 150, deliveryPrice: 80, stock: 80, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_16', name: 'Chakki Whole Wheat Atta (5kg Bag)', category: 'Groceries', image: createSvgPlaceholder('Chakki Atta', 'Groceries', '#b45309'), price: 650, deliveryPrice: 150, stock: 50, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_17', name: 'Supreme Danedar Black Tea (250g)', category: 'Groceries', image: createSvgPlaceholder('Supreme Tea', 'Groceries', '#451a03'), price: 420, deliveryPrice: 80, stock: 40, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_18', name: 'Nescafe Classic Instant Coffee (100g)', category: 'Drinks', image: createSvgPlaceholder('Nescafe Coffee', 'Drinks', '#78350f'), price: 850, deliveryPrice: 100, stock: 3, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_19', name: 'MilkPack Pure UHT Milk (1 Litre)', category: 'Drinks', image: createSvgPlaceholder('MilkPack 1L', 'Drinks', '#2563eb'), price: 290, deliveryPrice: 80, stock: 90, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_20', name: 'Nestle Milkpak Fresh Yogurt (1kg)', category: 'Groceries', image: createSvgPlaceholder('Fresh Yogurt', 'Groceries', '#3b82f6'), price: 220, deliveryPrice: 80, stock: 30, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_21', name: 'Dawn Large Sandwich Bread', category: 'Groceries', image: createSvgPlaceholder('Dawn Bread', 'Groceries', '#d97706'), price: 140, deliveryPrice: 60, stock: 50, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_22', name: 'Chocolate Cream Biscuits Family Pack', category: 'Snacks', image: createSvgPlaceholder('Cream Biscuits', 'Snacks', '#a16207'), price: 100, deliveryPrice: 60, stock: 65, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_23', name: 'Lays Masala Wavy Potato Chips (Large)', category: 'Snacks', image: createSvgPlaceholder('Lays Chips', 'Snacks', '#eab308'), price: 90, deliveryPrice: 50, stock: 110, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' },
  { id: 'prod_24', name: 'Gourmet Cola Soft Drink (1.5 Litre)', category: 'Drinks', image: createSvgPlaceholder('Gourmet Cola', 'Drinks', '#dc2626'), price: 130, deliveryPrice: 70, stock: 70, whatsapp: '923001234567', deliveryOption: 'Cash on Delivery', createdAt: '2026-08-01' }
];

// LocalStorage helpers with backward-compatible stock handling
function getProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  let products = INITIAL_DEMO_PRODUCTS;
  if (stored) {
    try {
      products = JSON.parse(stored);
    } catch (e) {
      products = INITIAL_DEMO_PRODUCTS;
    }
  }
  // Guarantee stock property on all product objects
  return products.map(p => ({
    ...p,
    stock: typeof p.stock === 'number' ? p.stock : 50
  }));
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Global State
let editingProductId = null;
let currentUploadedBase64 = null;
let pendingDeleteId = null;

// DOM Load Event Handler
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();

  // Load and render Current Admin Username Display
  updateAdminUsernameDisplays();

  // Initialize UI components
  renderDashboardStats();
  renderProductTable();

  // Setup Add/Edit Product Modal listeners
  const addBtn = document.getElementById('open-add-modal-btn');
  if (addBtn) addBtn.addEventListener('click', () => openProductModal());

  const modalCloseBtns = document.querySelectorAll('.close-admin-modal');
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('product-form-modal');
      closeModal('delete-confirm-modal');
      closeModal('reset-confirm-modal');
      closeModal('reset-creds-confirm-modal');
    });
  });

  // Setup FileReader image upload
  const imageInput = document.getElementById('product-image-file');
  if (imageInput) {
    imageInput.addEventListener('change', handleImageUpload);
  }

  // Setup Product Form Submit (Add / Edit)
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }

  // Table Search Listener
  const tableSearch = document.getElementById('admin-table-search');
  if (tableSearch) {
    tableSearch.addEventListener('input', (e) => {
      renderProductTable(e.target.value.trim().toLowerCase());
    });
  }

  // Delete Confirmation Button
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', executeDeleteProduct);
  }

  // Reset Demo Products Button
  const resetBtn = document.getElementById('reset-demo-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => openModal('reset-confirm-modal'));
  }

  const confirmResetBtn = document.getElementById('confirm-reset-btn');
  if (confirmResetBtn) {
    confirmResetBtn.addEventListener('click', executeResetProducts);
  }

  // Logout Button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Admin Account Settings Form Listener
  const settingsForm = document.getElementById('admin-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', handleAdminSettingsUpdate);
  }

  // Reset Credentials Button
  const resetCredsBtn = document.getElementById('reset-admin-creds-btn');
  if (resetCredsBtn) {
    resetCredsBtn.addEventListener('click', () => openModal('reset-creds-confirm-modal'));
  }

  const confirmResetCredsBtn = document.getElementById('confirm-reset-creds-btn');
  if (confirmResetCredsBtn) {
    confirmResetCredsBtn.addEventListener('click', executeResetAdminCredentials);
  }

  // Setup Settings Eye Icon Password Toggles
  const passToggleBtns = document.querySelectorAll('.toggle-settings-pass');
  passToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.innerText = isPass ? '👁️' : '🙈';
      }
    });
  });
});

// Update Username Displays across Admin Page
function updateAdminUsernameDisplays() {
  const creds = getAdminCredentials();
  const settingsDisplay = document.getElementById('current-admin-username-display');
  if (settingsDisplay) {
    settingsDisplay.innerText = creds.username;
  }
}

// Render Statistics Cards
function renderDashboardStats() {
  const products = getProducts();

  const total = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const fruits = products.filter(p => p.category === 'Fruits').length;
  const vegetables = products.filter(p => p.category === 'Vegetables').length;
  const drinks = products.filter(p => p.category === 'Drinks').length;
  const snacksAndGroceries = products.filter(p => p.category === 'Snacks' || p.category === 'Groceries').length;

  setElementText('stat-total', total);
  setElementText('stat-stock-total', totalStock);
  setElementText('stat-low-stock', lowStock);
  setElementText('stat-out-of-stock', outOfStock);

  setElementText('stat-fruits', fruits);
  setElementText('stat-vegetables', vegetables);
  setElementText('stat-drinks', drinks);
  setElementText('stat-snacks-groceries', snacksAndGroceries);
}

function setElementText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// Render Admin Product Table
function renderProductTable(filterQuery = '') {
  const tbody = document.getElementById('admin-product-tbody');
  if (!tbody) return;

  const products = getProducts();
  const filtered = products.filter(p => {
    if (!filterQuery) return true;
    return p.name.toLowerCase().includes(filterQuery) || p.category.toLowerCase().includes(filterQuery);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center py-8 text-slate-400 font-medium text-sm">
          No products match your search.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(product => {
    let stockBadge = '';
    if (product.stock === 0) {
      stockBadge = `<span class="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-200">Out of Stock</span>`;
    } else if (product.stock <= 5) {
      stockBadge = `<span class="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200">Low (${product.stock})</span>`;
    } else {
      stockBadge = `<span class="text-xs font-bold text-[#5A5A40]">${product.stock} units</span>`;
    }

    return `
      <tr class="hover:bg-[#F7F6F0] transition-colors border-b border-[#E5E3DC]">
        <td data-label="Image" class="py-3 px-4">
          <div class="w-12 h-12 bg-[#F7F6F0] rounded-xl overflow-hidden border border-[#E5E3DC] flex items-center justify-center">
            <img 
              src="${product.image}" 
              alt="${escapeHtml(product.name)}" 
              class="w-full h-full object-cover" 
              onerror="this.onerror=null; this.src='https://placehold.co/100x100/5A5A40/ffffff?text=Grocery';"
            />
          </div>
        </td>
        <td data-label="Product Name" class="py-3 px-4 font-bold text-[#2A2A24] text-sm">
          ${escapeHtml(product.name)}
        </td>
        <td data-label="Category" class="py-3 px-4">
          <span class="badge-category">${escapeHtml(product.category)}</span>
        </td>
        <td data-label="Stock" class="py-3 px-4">
          ${stockBadge}
        </td>
        <td data-label="Price" class="py-3 px-4 font-extrabold text-[#5A5A40] text-sm">
          Rs. ${product.price}
        </td>
        <td data-label="Delivery" class="py-3 px-4 font-semibold text-slate-600 text-sm">
          Rs. ${product.deliveryPrice}
        </td>
        <td data-label="WhatsApp" class="py-3 px-4 text-xs font-mono text-slate-600">
          +${escapeHtml(product.whatsapp || '923001234567')}
        </td>
        <td data-label="Delivery Option" class="py-3 px-4">
          <span class="badge-delivery">${escapeHtml(product.deliveryOption || 'Cash on Delivery')}</span>
        </td>
        <td data-label="Actions" class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button 
              onclick="editProduct('${product.id}')"
              class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs py-1.5 px-3 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button 
              onclick="promptDeleteProduct('${product.id}')"
              class="bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs py-1.5 px-3 rounded-lg border border-red-200 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// FileReader API: Convert Uploaded Image File to Base64
function handleImageUpload(e) {
  const file = e.target.files[0];
  const previewImg = document.getElementById('image-preview');
  
  if (!file) {
    currentUploadedBase64 = null;
    if (previewImg) previewImg.classList.add('hidden');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    currentUploadedBase64 = event.target.result;
    if (previewImg) {
      previewImg.src = currentUploadedBase64;
      previewImg.classList.remove('hidden');
    }
  };
  reader.readAsDataURL(file);
}

// Open Form Modal for Adding or Editing
function openProductModal(productId = null) {
  editingProductId = productId;
  currentUploadedBase64 = null;

  const modalTitle = document.getElementById('modal-form-title');
  const submitBtn = document.getElementById('form-submit-btn');
  const nameInput = document.getElementById('product-name');
  const catInput = document.getElementById('product-category');
  const priceInput = document.getElementById('product-price');
  const stockInput = document.getElementById('product-stock');
  const deliveryInput = document.getElementById('product-delivery');
  const waInput = document.getElementById('product-whatsapp');
  const optionInput = document.getElementById('product-option');
  const fileInput = document.getElementById('product-image-file');
  const previewImg = document.getElementById('image-preview');

  if (fileInput) fileInput.value = '';

  if (productId) {
    // EDIT MODE
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (modalTitle) modalTitle.innerText = 'Edit Product';
    if (submitBtn) submitBtn.innerText = 'Update Product';

    if (nameInput) nameInput.value = product.name;
    if (catInput) catInput.value = product.category;
    if (priceInput) priceInput.value = product.price;
    if (stockInput) stockInput.value = typeof product.stock === 'number' ? product.stock : 50;
    if (deliveryInput) deliveryInput.value = product.deliveryPrice;
    if (waInput) waInput.value = product.whatsapp || '923001234567';
    if (optionInput) optionInput.value = product.deliveryOption || 'Cash on Delivery';

    if (previewImg) {
      previewImg.src = product.image;
      previewImg.classList.remove('hidden');
    }
  } else {
    // ADD MODE
    if (modalTitle) modalTitle.innerText = 'Add New Product';
    if (submitBtn) submitBtn.innerText = 'Add Product';

    if (nameInput) nameInput.value = '';
    if (catInput) catInput.value = 'Fruits';
    if (priceInput) priceInput.value = '';
    if (stockInput) stockInput.value = '50';
    if (deliveryInput) deliveryInput.value = '100';
    if (waInput) waInput.value = '923001234567';
    if (optionInput) optionInput.value = 'Cash on Delivery';

    if (previewImg) previewImg.classList.add('hidden');
  }

  openModal('product-form-modal');
}

// Save Product (Add / Edit)
function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value;
  const price = Number(document.getElementById('product-price').value);
  const stockVal = Number(document.getElementById('product-stock').value);
  const stock = isNaN(stockVal) ? 0 : Math.max(0, Math.floor(stockVal));
  const deliveryPrice = Number(document.getElementById('product-delivery').value);
  const whatsapp = document.getElementById('product-whatsapp').value.trim();
  const deliveryOption = document.getElementById('product-option').value;

  if (!name || isNaN(price) || isNaN(deliveryPrice)) {
    showToast('Please fill in valid name, price, and delivery charges.', 'warning');
    return;
  }

  let products = getProducts();

  if (editingProductId) {
    // Update existing
    const existing = products.find(p => p.id === editingProductId);
    if (!existing) return;

    existing.name = name;
    existing.category = category;
    existing.price = price;
    existing.stock = stock;
    existing.deliveryPrice = deliveryPrice;
    existing.whatsapp = whatsapp;
    existing.deliveryOption = deliveryOption;

    if (currentUploadedBase64) {
      existing.image = currentUploadedBase64;
    }

    saveProducts(products);
    showToast('Product updated successfully!', 'success');
  } else {
    // Add new product
    const imageToUse = currentUploadedBase64 || createSvgPlaceholder(name, category, '#5A5A40');
    const newProduct = {
      id: 'prod_' + Date.now(),
      name,
      category,
      image: imageToUse,
      price,
      stock,
      deliveryPrice,
      whatsapp,
      deliveryOption,
      createdAt: new Date().toISOString().split('T')[0]
    };

    products.unshift(newProduct);
    saveProducts(products);
    showToast('New product added to store!', 'success');
  }

  closeModal('product-form-modal');
  renderDashboardStats();
  renderProductTable();
}

// Admin Account & Security Settings Handler
function handleAdminSettingsUpdate(e) {
  e.preventDefault();

  const newUsernameInput = document.getElementById('settings-new-username');
  const currentPassInput = document.getElementById('settings-current-pass');
  const newPassInput = document.getElementById('settings-new-pass');
  const confirmPassInput = document.getElementById('settings-confirm-pass');

  const newUsername = newUsernameInput ? newUsernameInput.value.trim() : '';
  const currentPass = currentPassInput ? currentPassInput.value.trim() : '';
  const newPass = newPassInput ? newPassInput.value.trim() : '';
  const confirmPass = confirmPassInput ? confirmPassInput.value.trim() : '';

  const creds = getAdminCredentials();
  let usernameUpdated = false;
  let passwordUpdated = false;

  // Validate Username Change
  if (newUsername.length > 0) {
    if (newUsername.length < 3) {
      showToast('New username must be at least 3 characters long.', 'error');
      return;
    }
    creds.username = newUsername;
    usernameUpdated = true;
  }

  // Validate Password Change
  if (newPass.length > 0 || currentPass.length > 0 || confirmPass.length > 0) {
    if (!currentPass) {
      showToast('Please enter your current password to set a new password.', 'warning');
      return;
    }
    if (currentPass !== creds.password) {
      showToast('Current password is incorrect.', 'error');
      return;
    }
    if (newPass.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }
    if (newPass === creds.password) {
      showToast('New password must be different from your current password.', 'warning');
      return;
    }
    creds.password = newPass;
    passwordUpdated = true;
  }

  if (!usernameUpdated && !passwordUpdated) {
    showToast('No changes were made.', 'warning');
    return;
  }

  // Save new credentials
  saveAdminCredentials(creds);
  updateAdminUsernameDisplays();

  // Reset fields
  if (newUsernameInput) newUsernameInput.value = '';
  if (currentPassInput) currentPassInput.value = '';
  if (newPassInput) newPassInput.value = '';
  if (confirmPassInput) confirmPassInput.value = '';

  let message = 'Admin account updated successfully.';
  if (usernameUpdated && passwordUpdated) message = 'Username and password updated successfully!';
  else if (usernameUpdated) message = `Admin username updated to "${creds.username}".`;
  else if (passwordUpdated) message = 'Admin password changed successfully!';

  showToast(message, 'success');
}

// Reset Admin Credentials
function executeResetAdminCredentials() {
  const defaultCreds = { username: 'HAROON', password: '123' };
  saveAdminCredentials(defaultCreds);
  updateAdminUsernameDisplays();

  closeModal('reset-creds-confirm-modal');
  showToast('Admin credentials reset to HAROON / 123', 'success');
}

// Global Edit Handler for inline onclick
window.editProduct = function (id) {
  openProductModal(id);
};

// Global Delete Handler for inline onclick
window.promptDeleteProduct = function (id) {
  pendingDeleteId = id;
  openModal('delete-confirm-modal');
};

function executeDeleteProduct() {
  if (!pendingDeleteId) return;

  let products = getProducts();
  products = products.filter(p => p.id !== pendingDeleteId);
  saveProducts(products);

  showToast('Product deleted from inventory.', 'error');
  pendingDeleteId = null;

  closeModal('delete-confirm-modal');
  renderDashboardStats();
  renderProductTable();
}

// Reset Demo Data
function executeResetProducts() {
  saveProducts(INITIAL_DEMO_PRODUCTS);
  showToast('Demo products restored successfully!', 'success');
  closeModal('reset-confirm-modal');
  renderDashboardStats();
  renderProductTable();
}

// Logout
function handleLogout() {
  localStorage.removeItem('groceryGalleryAdminAuth');
  showToast('Logged out of Admin Portal.', 'success');
  setTimeout(() => {
    window.location.href = 'admin_login.html';
  }, 400);
}

// Modal Utilities
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

// Toast notification helper
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
