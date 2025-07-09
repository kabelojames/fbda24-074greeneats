// ===== GLOBAL VARIABLES =====
let cart = [];
const products = [
  {
    id: 1,
    name: "Organic Apples",
    price: 4.99,
    category: "fruits",
    image: "/images/products/apples.jpg",
    description: "Crisp and juicy, straight from the orchard",
    stock: "in-stock"
  },
  {
    id: 2,
    name: "Organic Mixed Berries",
    price: 7.99,
    category: "fruits",
    image: "./images/products/berries.jpg",
    description: "Sweet and antioxidant-rich berry mix",
    stock: "in-stock"
  },
  {
    id: 3,
    name: "Fresh Carrots",
    price: 3.49,
    category: "vegetables",
    image: "images/products/carrots.jpg",
    description: "Crunchy and vitamin-packed",
    stock: "low-stock"
  },
  {
    id: 4,
    name: "Organic Milk",
    price: 5.99,
    category: "dairy",
    image: "images/products/milk.jpg",
    description: "Creamy and hormone-free",
    stock: "in-stock"
  },
  {
    id: 5,
    name: "Whole Grain Bread",
    price: 4.49,
    category: "bakery",
    image: "images/products/bread.jpg",
    description: "Freshly baked daily",
    stock: "in-stock"
  },
  {
    id: 6,
    name: "Organic Eggs",
    price: 6.99,
    category: "dairy",
    image: "images/products/eggs.jpg",
    description: "Free-range and organic",
    stock: "in-stock"
  }
];

// ===== CART FUNCTIONS =====
function addToCart(e) {
  const productId = parseInt(e.target.dataset.id);
  const product = products.find(p => p.id === productId);
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  updateCartCount();
  showNotification(`${product.name} added to cart!`);
  saveCartToStorage();
  renderCartItems();
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    const removedItem = cart.splice(itemIndex, 1)[0];
    showNotification(`${removedItem.name} removed from cart!`);
    updateCartCount();
    saveCartToStorage();
    renderCartItems();
  }
}

function saveCartToStorage() {
  localStorage.setItem('greeneats-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('greeneats-cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

function renderCartItems() {
  const cartContainer = document.getElementById('cart-items-container');
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <a href="shop.html" class="btn">Continue Shopping</a>
      </div>
    `;
    return;
  }

  cartContainer.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <div class="quantity-controls">
              <button class="btn quantity-btn minus" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="btn quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="btn remove-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>$${calculateSubtotal().toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (8%):</span>
        <span>$${calculateTax().toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>$${calculateTotal().toFixed(2)}</span>
      </div>
      <button class="btn checkout-btn">Proceed to Checkout</button>
    </div>
  `;

  setupCartButtons();
}

function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTax() {
  return calculateSubtotal() * 0.08;
}

function calculateTotal() {
  return calculateSubtotal() + calculateTax();
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function setupCartButtons() {
  document.querySelectorAll('.quantity-btn.plus').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const item = cart.find(item => item.id === productId);
      if (item) {
        item.quantity++;
        updateCartCount();
        saveCartToStorage();
        renderCartItems();
      }
    });
  });

  document.querySelectorAll('.quantity-btn.minus').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      const item = cart.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
        updateCartCount();
        saveCartToStorage();
        renderCartItems();
      }
    });
  });

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      removeFromCart(productId);
    });
  });

  document.querySelectorAll('.checkout-btn').forEach(button => {
    button.addEventListener('click', () => {
      showNotification('Checkout functionality coming soon!');
    });
  });
}

// ===== PRODUCT FUNCTIONS =====
function loadProducts() {
  const productContainer = document.querySelector('.products') || document.getElementById('product-container');
  const productTable = document.querySelector('.products-table tbody');
  const category = new URLSearchParams(window.location.search).get('category');
  
  let filteredProducts = products;
  if (category && category !== 'all') {
    filteredProducts = products.filter(product => product.category === category);
  }
  
  if (productContainer) {
    productContainer.innerHTML = filteredProducts.map(product => `
      <div class="product-card" data-category="${product.category}">
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">$${product.price.toFixed(2)}</div>
          <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `).join('');
  }
  
  if (productTable) {
    productTable.innerHTML = filteredProducts.map(product => `
      <tr>
        <td>${product.name}</td>
        <td><img src="${product.image}" alt="${product.name}" class="product-img-table"></td>
        <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td><span class="stock ${product.stock}">${product.stock === 'in-stock' ? 'In Stock' : 'Low Stock'}</span></td>
        <td><button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button></td>
      </tr>
    `).join('');
  }
  
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
}

// ===== FORM VALIDATION =====
function setupFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
      if (!isValidEmail(field.value)) {
        isValid = false;
        field.classList.add('error');
      }
    });
    
    if (isValid) {
      showNotification('Thank you for your submission!');
      form.reset();
    } else {
      showNotification('Please fill all required fields correctly.');
    }
  });
  
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.classList.remove('error');
      }
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== NOTIFICATION =====
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
  const menuToggle = document.createElement('div');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '<span></span><span></span><span></span>';
  
  const header = document.querySelector('header .container');
  if (header) {
    header.prepend(menuToggle);
    
    menuToggle.addEventListener('click', () => {
      document.querySelector('nav').classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
}

// ===== FILTER PRODUCTS =====
function setupFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      const category = this.dataset.category;
      window.history.pushState({}, '', `?category=${category}`);
      loadProducts();
      
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn === this);
      });
    });
  });
}

function setActiveFilter() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'all';
  
  document.querySelectorAll('.filter-btn').forEach(button => {
    if (button.dataset.category === category) {
      button.classList.add('active');
    }
  });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  loadCartFromStorage();
  
  if (document.querySelector('.products') || document.querySelector('.products-table')) {
    loadProducts();
  }
  
  if (document.getElementById('contact-form')) {
    setupFormValidation('contact-form');
  }
  
  if (document.getElementById('feedback-form')) {
    setupFormValidation('feedback-form');
  }
  
  if (document.getElementById('cart-items-container')) {
    renderCartItems();
  }
  
  updateCartCount();
  setupMobileMenu();
  setupFilterButtons();
  setActiveFilter();
  
  // Newsletter subscription
  document.querySelectorAll('.newsletter button').forEach(button => {
    button.addEventListener('click', function() {
      const emailInput = this.previousElementSibling;
      if (isValidEmail(emailInput.value)) {
        showNotification('Thanks for subscribing!');
        emailInput.value = '';
      } else {
        showNotification('Please enter a valid email address');
        emailInput.classList.add('error');
      }
    });
  });
});