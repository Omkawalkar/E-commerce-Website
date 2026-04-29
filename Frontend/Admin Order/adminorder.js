/**
 * Admin Orders - Load and display orders from database
 */

const ORDERS_API_URL = 'http://localhost:5000/api/orders';
const token = localStorage.getItem('token');

// Check if admin is logged in (you can add admin check later)
if (!token) {
    window.location.href = '../Login Page/login.html';
}

// Container for orders
const ordersContainer = document.getElementById('ordersContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

// Load orders from API
async function loadOrders() {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    
    try {
        const response = await fetch(`${ORDERS_API_URL}/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        console.log('Orders data:', result);
        
        if (result.success && result.data) {
            displayOrders(result.data);
        } else {
            showNoOrders();
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showNoOrders();
    } finally {
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
    }
}

// Display orders
function displayOrders(orders) {
    if (!ordersContainer) return;
    
    if (orders.length === 0) {
        showNoOrders();
        return;
    }
    
    ordersContainer.innerHTML = orders.map(order => `
        <div class="bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0px_12px_32px_rgba(19,25,33,0.06)]">
            <div class="p-6 border-b border-surface-container-high bg-slate-50/50">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900">#${order.orderNumber}</h3>
                        <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <span class="material-symbols-outlined text-sm">calendar_today</span>
                            ${new Date(order.createdAt).toLocaleDateString()} • ${new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <span class="px-3 py-1 bg-secondary-container text-on-secondary-fixed-variant text-[10px] font-bold rounded-full uppercase tracking-wider">${order.paymentStatus}</span>
                        <span class="px-3 py-1 bg-primary-container text-on-primary-fixed text-[10px] font-bold rounded-full uppercase tracking-wider">${order.orderStatus}</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-1">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Customer</p>
                        <div class="flex items-center gap-2">
                            <p class="font-bold text-slate-900">${escapeHtml(order.customerName)}</p>
                        </div>
                        <p class="text-xs text-slate-600 italic">${escapeHtml(order.customerEmail)}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Shipping To</p>
                        <p class="text-xs text-slate-900 leading-snug">${escapeHtml(order.shippingAddress.address)}<br/>${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.postalCode)}</p>
                    </div>
                </div>
            </div>
            <div class="flex-1 p-6 space-y-4">
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order Summary (${order.items.length} items)</p>
                <div class="space-y-3">
                    ${order.items.map(item => `
                        <div class="flex items-center gap-4 bg-surface-container-low p-2 rounded-lg">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-slate-900 truncate">${escapeHtml(item.name)}</p>
                                <p class="text-[10px] text-slate-500">Qty: ${item.quantity}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-slate-900">$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="p-6 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Order Value</p>
                    <p class="text-2xl font-black text-slate-900">$${order.total.toFixed(2)}</p>
                </div>
                <div class="flex gap-3">
                    <select onchange="updateOrderStatus('${order._id}', this.value)" class="px-3 py-2 bg-white text-slate-900 border border-slate-200 text-xs font-bold rounded-md">
                        <option value="Pending" ${order.orderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <button onclick="deleteOrder('${order._id}')" class="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700 transition-opacity">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update order status
window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        const response = await fetch(`${ORDERS_API_URL}/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderStatus: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Order status updated!', 'success');
            loadOrders(); // Refresh orders
        } else {
            showToast('❌ Error updating status', 'error');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('❌ Network error', 'error');
    }
};

// Delete order
window.deleteOrder = async function(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
        const response = await fetch(`${ORDERS_API_URL}/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Order deleted!', 'success');
            loadOrders(); // Refresh orders
        } else {
            showToast('❌ Error deleting order', 'error');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        showToast('❌ Network error', 'error');
    }
};

// Show no orders message
function showNoOrders() {
    if (ordersContainer) {
        ordersContainer.innerHTML = `
            <div class="text-center py-12 col-span-full">
                <span class="material-symbols-outlined text-6xl text-gray-400">shopping_bag</span>
                <p class="text-gray-500 mt-4">No orders found</p>
            </div>
        `;
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

// Load orders when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});