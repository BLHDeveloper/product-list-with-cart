const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// SVGs for icons
const IconAddToCart = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs></svg>`;
const IconIncrement = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>`;
const IconDecrement = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path d="M0 .375h10v1.25H0V.375Z"/></svg>`;
const IconRemove = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>`;

// State Management
const CartStore = {
  items: new Map(), // name -> { product, quantity }
  
  add(product) {
    if (this.items.has(product.name)) {
      this.increment(product.name);
    } else {
      this.items.set(product.name, { product, quantity: 1 });
    }
  },

  remove(productName) {
    this.items.delete(productName);
  },

  increment(productName) {
    const item = this.items.get(productName);
    if (item) {
      item.quantity += 1;
    }
  },

  decrement(productName) {
    const item = this.items.get(productName);
    if (item) {
      item.quantity -= 1;
      if (item.quantity === 0) {
        this.remove(productName);
      }
    }
  },

  clear() {
    this.items.clear();
  },

  getTotalItems() {
    let count = 0;
    for (const item of this.items.values()) {
      count += item.quantity;
    }
    return count;
  },

  getTotalPrice() {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.product.price * item.quantity;
    }
    return total;
  },

  getQuantity(productName) {
    return this.items.get(productName)?.quantity || 0;
  }
};

let productsData = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartFilled = document.getElementById('cart-filled');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const btnConfirmOrder = document.getElementById('btn-confirm-order');
const orderModal = document.getElementById('order-modal');
const modalItemsContainer = document.getElementById('modal-items');
const modalTotalPrice = document.getElementById('modal-total-price');
const btnStartNew = document.getElementById('btn-start-new');

// Initialization
async function init() {
  try {
    const response = await fetch('./data.json');
    productsData = await response.json();
    renderProductGrid();
    setupEventListeners();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Rendering
function renderProductGrid() {
  productGrid.innerHTML = '';
  
  productsData.forEach(product => {
    const qty = CartStore.getQuantity(product.name);
    const inCart = qty > 0;
    
    const card = document.createElement('article');
    card.className = `product-card ${inCart ? 'in-cart' : ''}`;
    card.dataset.name = product.name;
    
    card.innerHTML = `
      <div class="product-image-container">
        <picture>
          <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
          <source media="(min-width: 768px)" srcset="${product.image.tablet}">
          <img class="product-image" src="${product.image.mobile}" alt="${product.name}">
        </picture>
        <div class="btn-container">
          ${inCart ? `
            <div class="btn-stepper">
              <button class="stepper-btn btn-decrement" aria-label="Decrease quantity" data-name="${product.name}">
                ${IconDecrement}
              </button>
              <span class="stepper-qty" aria-live="polite">${qty}</span>
              <button class="stepper-btn btn-increment" aria-label="Increase quantity" data-name="${product.name}">
                ${IconIncrement}
              </button>
            </div>
          ` : `
            <button class="btn-add-to-cart" data-name="${product.name}">
              ${IconAddToCart}
              Add to Cart
            </button>
          `}
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatCurrency(product.price)}</p>
      </div>
    `;
    
    productGrid.appendChild(card);
  });
}

function renderCart() {
  const totalItems = CartStore.getTotalItems();
  cartCount.textContent = totalItems;
  
  if (totalItems === 0) {
    cartEmpty.classList.remove('hidden');
    cartFilled.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    cartFilled.classList.remove('hidden');
    
    cartItemsContainer.innerHTML = '';
    
    for (const [name, item] of CartStore.items.entries()) {
      const lineTotal = item.product.price * item.quantity;
      
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-name">${name}</span>
          <div class="cart-item-pricing">
            <span class="cart-item-qty">${item.quantity}x</span>
            <span class="cart-item-unit-price">@ ${formatCurrency(item.product.price)}</span>
            <span class="cart-item-line-total">${formatCurrency(lineTotal)}</span>
          </div>
        </div>
        <button class="btn-remove-item" aria-label="Remove ${name} from cart" data-name="${name}">
          ${IconRemove}
        </button>
      `;
      cartItemsContainer.appendChild(li);
    }
    
    cartTotalPrice.textContent = formatCurrency(CartStore.getTotalPrice());
  }
}

// Event Listeners
function setupEventListeners() {
  // Event delegation for product grid
  productGrid.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;
    
    const productName = target.dataset.name;
    const product = productsData.find(p => p.name === productName);
    
    if (target.classList.contains('btn-add-to-cart')) {
      CartStore.add(product);
      updateUI();
    } else if (target.classList.contains('btn-increment')) {
      CartStore.increment(productName);
      updateUI();
    } else if (target.classList.contains('btn-decrement')) {
      CartStore.decrement(productName);
      updateUI();
    }
  });

  // Event delegation for cart
  cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.btn-remove-item');
    if (!target) return;
    
    const productName = target.dataset.name;
    CartStore.remove(productName);
    updateUI();
  });

  // Confirm Order
  btnConfirmOrder.addEventListener('click', openModal);

  // Start New Order
  btnStartNew.addEventListener('click', () => {
    CartStore.clear();
    closeModal();
    updateUI();
  });
}

function updateUI() {
  renderProductGrid();
  renderCart();
}

function openModal() {
  modalItemsContainer.innerHTML = '';
  
  for (const [name, item] of CartStore.items.entries()) {
    const lineTotal = item.product.price * item.quantity;
    
    const li = document.createElement('li');
    li.className = 'modal-item';
    li.innerHTML = `
      <div class="modal-item-left">
        <img src="${item.product.image.thumbnail}" alt="${name}" class="modal-item-image">
        <div>
          <span class="modal-item-name">${name}</span>
          <div class="modal-item-pricing">
            <span class="modal-item-qty">${item.quantity}x</span>
            <span class="modal-item-unit-price">@ ${formatCurrency(item.product.price)}</span>
          </div>
        </div>
      </div>
      <span class="modal-item-line-total">${formatCurrency(lineTotal)}</span>
    `;
    modalItemsContainer.appendChild(li);
  }
  
  modalTotalPrice.textContent = formatCurrency(CartStore.getTotalPrice());
  orderModal.showModal();
}

function closeModal() {
  orderModal.close();
}

// Start app
init();

