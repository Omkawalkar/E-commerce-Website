// API URLs
const CART_API_URL = 'http://localhost:5000/api/cart';

// Get token - DECLARE ONLY ONCE
const authToken = localStorage.getItem('token');

// Check if user is logged in
if (!authToken) {
    window.location.href = '../Login Page/login.html';
}

// DOM Elements
const cartItemsContainer = document.getElementById('cartItemsContainer');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const itemCountElement = document.getElementById('itemCount');

// Make proceedToCheckout available globally
window.proceedToCheckout = function() {
    window.location.href = '../OrderPage/order.html';
};

// Load cart from API
async function loadCart() {
    console.log('Loading cart...');
    
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
    
    try {
        const response = await fetch(CART_API_URL, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        console.log('Cart response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Cart data:', result);
        
        if (result.success && result.data && result.data.items && result.data.items.length > 0) {
            displayCart(result.data);
        } else {
            showEmptyCart();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        showEmptyCart();
    } finally {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}

// Display cart items
function displayCart(cart) {
    if (!cartItemsContainer) return;
    
    const items = cart.items || [];
    const itemCount = items.length;
    
    console.log('Displaying', itemCount, 'items in cart');
    
    // Update item count
    if (itemCountElement) {
        itemCountElement.textContent = itemCount;
    }
    
    // Calculate totals
    const subtotal = cart.totalAmount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Update order summary
    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `₹${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`;
    
    // Hide empty message, show container
    if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
    cartItemsContainer.classList.remove('hidden');
    
    // Display cart items
    cartItemsContainer.innerHTML = items.map(item => {
        const product = item.product;
        return `
        <div class="bg-surface-container-lowest p-6 rounded-xl flex flex-col sm:flex-row gap-6 transition-transform hover:scale-[1.01] duration-200" data-product-id="${product._id}">
            <div class="w-full sm:w-40 h-40 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                <img class="w-full h-full object-cover" 
                     src="${product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                     alt="${escapeHtml(product.name)}"/>
            </div>
            <div class="flex-grow flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start">
                        <h3 class="text-xl font-bold text-on-surface">${escapeHtml(product.name)}</h3>
                        <span class="text-xl font-black text-on-surface">₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p class="text-sm text-on-surface-variant mt-1">${escapeHtml(product.description?.substring(0, 100) || 'No description')}</p>
                    <span class="inline-block mt-2 px-3 py-1 bg-secondary-container text-on-secondary-fixed-variant text-[10px] font-bold uppercase tracking-widest rounded-full">
                        In Stock
                    </span>
                </div>
                <div class="flex items-center justify-between mt-6">
                    <div class="flex items-center bg-surface-container rounded-lg p-1">
                        <button onclick="updateQuantity('${product._id}', ${item.quantity - 1})" 
                                class="w-8 h-8 flex items-center justify-center hover:bg-surface-dim rounded-md transition-colors">
                            <span class="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span class="w-10 text-center font-bold text-sm">${item.quantity}</span>
                        <button onclick="updateQuantity('${product._id}', ${item.quantity + 1})" 
                                class="w-8 h-8 flex items-center justify-center hover:bg-surface-dim rounded-md transition-colors">
                            <span class="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                    <button onclick="removeFromCart('${product._id}')" 
                            class="text-error font-medium text-sm flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        <span class="material-symbols-outlined text-lg">delete</span> Remove
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Update cart badge
    updateCartCountBadge(itemCount);
}

// Show empty cart message
function showEmptyCart() {
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.classList.add('hidden');
    }
    
    if (emptyCartMessage) {
        emptyCartMessage.classList.remove('hidden');
    }
    
    // Reset order summary
    if (subtotalElement) subtotalElement.textContent = '$0.00';
    if (taxElement) taxElement.textContent = '$0.00';
    if (totalElement) totalElement.textContent = '$0.00';
    if (itemCountElement) itemCountElement.textContent = '0';
    
    // Update cart badge
    updateCartCountBadge(0);
}

// Update quantity
window.updateQuantity = async function(productId, newQuantity) {
    console.log('Updating quantity:', productId, newQuantity);
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    try {
        const response = await fetch(`${CART_API_URL}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ productId, quantity: newQuantity })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayCart(result.data);
            showToast('Cart updated!', 'success');
        } else {
            showToast('Error updating cart', 'error');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        showToast('Network error', 'error');
    }
};

// Remove from cart
window.removeFromCart = async function(productId) {
    console.log('Removing from cart:', productId);
    
    try {
        const response = await fetch(`${CART_API_URL}/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayCart(result.data);
            showToast('Item removed from cart', 'success');
        } else {
            showToast('Error removing item', 'error');
        }
    } catch (error) {
        console.error('Error removing item:', error);
        showToast('Network error', 'error');
    }
};

// Update cart count badge
async function updateCartCountBadge(count = null) {
    const cartBadge = document.getElementById('cartCount');
    if (!cartBadge) return;
    
    if (count !== null) {
        cartBadge.textContent = count;
        if (count === 0) {
            cartBadge.classList.add('hidden');
        } else {
            cartBadge.classList.remove('hidden');
        }
        return;
    }
    
    try {
        const response = await fetch(CART_API_URL, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const result = await response.json();
        if (result.success && result.data) {
            const itemCount = result.data.items?.length || 0;
            cartBadge.textContent = itemCount;
            if (itemCount === 0) {
                cartBadge.classList.add('hidden');
            } else {
                cartBadge.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
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

// Load cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cart page loaded');
    loadCart();
});