// API URLs
const CART_API_URL = 'http://localhost:5000/api/cart';
const ORDERS_API_URL = 'http://localhost:5000/api/orders';

// Get token
const token = localStorage.getItem('token');

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
    console.log('Loading order data...');
    
    try {
        const response = await fetch(CART_API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        console.log('Cart data:', result);
        
        if (result.success && result.data && result.data.items && result.data.items.length > 0) {
            // Hide loading indicator
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            
            const items = result.data.items;
            const itemCount = items.length;
            
            // Calculate totals
            const subtotal = result.data.totalAmount;
            const tax = subtotal * 0.08;
            const total = subtotal + tax;
            
            // Update summary
            if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
            if (taxElement) taxElement.textContent = `₹${tax.toFixed(2)}`;
            if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`;
            if (itemsCountElement) itemsCountElement.textContent = itemCount;
            
            const itemsTotalSpan = document.getElementById('itemsTotal');
            if (itemsTotalSpan) itemsTotalSpan.textContent = `₹${subtotal.toFixed(2)}`;
            
            // Display items
            orderItemsContainer.innerHTML = items.map(item => {
                const product = item.product;
                return `
                    <div class="border border-outline-variant/15 rounded-xl p-4">
                        <div class="flex gap-4">
                            <img class="w-20 h-20 object-cover rounded-lg" 
                                 src="${product.images?.[0] || 'https://via.placeholder.com/100x100?text=Product'}" 
                                 alt="${product.name}"/>
                            <div class="flex-1">
                                <h3 class="font-bold text-lg">${product.name}</h3>
                                <p class="text-sm text-gray-500">${product.description?.substring(0, 80) || ''}</p>
                                <div class="flex justify-between items-center mt-2">
                                    <span class="text-sm">Quantity: ${item.quantity}</span>
                                    <span class="text-xl font-bold">₹${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
        } else {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            orderItemsContainer.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-gray-500">Your cart is empty.</p>
                    <a href="../ProductCard/card.html" class="inline-block mt-4 bg-primary-container px-6 py-2 rounded-lg">Continue Shopping</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        orderItemsContainer.innerHTML = `<div class="text-center py-12 text-red-500">Error loading cart: ${error.message}</div>`;
    }
}

// Place order
async function placeOrder() {
    if (!placeOrderBtn) return;
    
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing...';
    
    try {
        const response = await fetch(`${ORDERS_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shippingAddress: {
                    fullName: document.getElementById('fullName')?.value || 'Alex Thompson',
                    address: document.getElementById('address')?.value || '1248 Quantum Drive',
                    city: document.getElementById('city')?.value || 'Silicon Valley',
                    postalCode: document.getElementById('postalCode')?.value || '94025',
                    country: document.getElementById('country')?.value || 'United States',
                    phone: document.getElementById('phone')?.value || '(555) 012-3456'
                },
                paymentMethod: 'Credit Card'
            })
        });
        
        const result = await response.json();
        console.log('Order response:', result);
        
        if (result.success) {
            alert('✅ Order placed successfully! Order #' + result.data.orderNumber);
            window.location.href = '../Home page/home.html';
        } else {
            alert('❌ Error: ' + result.message);
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Your Order';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Your Order';
    }
}

// Event listener
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrderData();
});