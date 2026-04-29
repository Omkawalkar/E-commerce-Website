// API URLs
const API_URL = 'http://localhost:5000/api';
const CART_API_URL = 'http://localhost:5000/api/cart';
const ORDERS_API_URL = 'http://localhost:5000/api/orders';
const AUTH_API_URL = 'http://localhost:5000/api/auth';

// Get token
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);

// Check if user is logged in
if (!token) {
    window.location.href = '../Login Page/login.html';
}

// DOM Elements
const orderItemsContainer = document.getElementById('orderItemsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const itemsCountElement = document.getElementById('itemsCount');
const placeOrderBtn = document.getElementById('placeOrderBtn');

// Load cart data
async function loadOrderData() {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    
    try {
        const response = await fetch(CART_API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        console.log('Cart data:', result);
        
        if (result.success && result.data && result.data.items.length > 0) {
            displayOrderSummary(result.data);
            displayOrderItems(result.data);
        } else {
            showEmptyCart();
        }
    } catch (error) {
        console.error('Error loading order data:', error);
        showEmptyCart();
    } finally {
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
    }
}

// Display order items
function displayOrderItems(cart) {
    if (!orderItemsContainer) return;
    
    const items = cart.items || [];
    
    if (items.length === 0) {
        showEmptyCart();
        return;
    }
    
    orderItemsContainer.innerHTML = items.map(item => `
        <div class="border border-outline-variant/15 rounded-xl p-4 flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-48 h-48 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                <img class="w-full h-full object-contain" 
                     src="${item.product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                     alt="${escapeHtml(item.product.name)}"/>
            </div>
            <div class="flex-grow">
                <h3 class="text-lg font-bold text-on-surface mb-1">${escapeHtml(item.product.name)}</h3>
                <p class="text-sm text-on-secondary-container mb-4">${escapeHtml(item.product.description?.substring(0, 100) || 'No description')}</p>
                <div class="flex items-center gap-4 mb-4">
                    <span class="text-2xl font-black text-on-surface">$${(item.price * item.quantity).toFixed(2)}</span>
                    <span class="bg-secondary-container text-on-secondary-fixed-variant px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        ${item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center bg-surface-container rounded-lg p-1">
                        <span class="w-8 h-8 flex items-center justify-center text-sm font-bold">${item.quantity}</span>
                    </div>
                    <span class="text-sm text-on-secondary-container">Quantity: ${item.quantity}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Display order summary with calculations
function displayOrderSummary(cart) {
    const items = cart.items || [];
    const itemCount = items.length;
    
    // Calculate subtotal
    const subtotal = cart.totalAmount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate tax (8%)
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    
    // Calculate total
    const total = subtotal + tax;
    
    // Update totals
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    if (itemsCountElement) itemsCountElement.textContent = itemCount;
    
    const itemsTotalSpan = document.getElementById('itemsTotal');
    if (itemsTotalSpan) itemsTotalSpan.textContent = `$${subtotal.toFixed(2)}`;
}

// Show empty cart message
function showEmptyCart() {
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = `
            <div class="text-center py-12">
                <span class="material-symbols-outlined text-6xl text-gray-400">shopping_cart</span>
                <p class="text-gray-500 mt-4">Your cart is empty</p>
                <a href="../ProductCard/card.html" class="inline-block mt-4 bg-primary-container px-6 py-2 rounded-lg">Continue Shopping</a>
            </div>
        `;
    }
    
    if (subtotalElement) subtotalElement.textContent = '$0.00';
    if (taxElement) taxElement.textContent = '$0.00';
    if (totalElement) totalElement.textContent = '$0.00';
    if (itemsCountElement) itemsCountElement.textContent = '0';
    const itemsTotalSpan = document.getElementById('itemsTotal');
    if (itemsTotalSpan) itemsTotalSpan.textContent = '$0.00';
}

// Get shipping address from form
function getShippingAddress() {
    return {
        fullName: document.getElementById('fullName')?.value || 'Test User',
        address: document.getElementById('address')?.value || '123 Test Street',
        city: document.getElementById('city')?.value || 'Test City',
        postalCode: document.getElementById('postalCode')?.value || '12345',
        country: document.getElementById('country')?.value || 'United States',
        phone: document.getElementById('phone')?.value || '1234567890'
    };
}

// Place order
async function placeOrder() {
    if (!placeOrderBtn) return;
    
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing...';
    
    try {
        const shippingAddress = getShippingAddress();
        
        console.log('Sending order request...');
        
        const response = await fetch(`${ORDERS_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shippingAddress: shippingAddress,
                paymentMethod: 'Credit Card'
            })
        });
        
        const result = await response.json();
        console.log('Order response:', result);
        
        if (result.success) {
            showToast('✅ Order placed successfully! Order #' + result.data.orderNumber, 'success');
            
            setTimeout(() => {
                window.location.href = '../Home page/home.html';
            }, 2000);
        } else {
            showToast('❌ Error: ' + result.message, 'error');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Your Order';
        }
        
    } catch (error) {
        console.error('Error placing order:', error);
        showToast('❌ Error: ' + error.message, 'error');
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Your Order';
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load user data
async function loadUserData() {
    try {
        const response = await fetch(`${AUTH_API_URL}/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success && result.user) {
            console.log('User:', result.user.fullName);
            const nameInput = document.getElementById('fullName');
            if (nameInput && result.user.fullName) {
                nameInput.value = result.user.fullName;
            }
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Add event listener for place order button
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
}

// Load order data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadOrderData();
    loadUserData();
});