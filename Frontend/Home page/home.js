/**
 * Script for MarketEngine - Home Page
 */

const API_URL = 'http://localhost:5000/api/auth';
const CART_API_URL = 'http://localhost:5000/api/cart';

console.log('Home page loaded');

// Check if user is logged in
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

console.log('Token exists:', !!token);
console.log('User data:', user);

if (!token) {
    console.log('No token found, redirecting to login');
    window.location.href = '../Login Page/login.html';
} else {
    // Verify token
    fetch(`${API_URL}/verify`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(data => {
            console.log('Token verification response:', data);
            if (!data.success) {
                console.log('Invalid token, clearing storage and redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '../Login Page/login.html';
            } else {
                console.log('User authenticated:', data.user);
                // Update user greeting
                updateUserGreeting(data.user.fullName);
            }
        })
        .catch(error => {
            console.error('Auth verification error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../Login Page/login.html';
        });
}

// Update user greeting in header
function updateUserGreeting(fullName) {
    const greetingElement = document.querySelector('.flex.flex-col.cursor-pointer span:first-child');
    if (greetingElement && fullName) {
        const firstName = fullName.split(' ')[0];
        greetingElement.innerHTML = `Hello, ${firstName}`;
        console.log('Updated greeting to:', `Hello, ${firstName}`);
    }
}

// Update cart count from backend
async function updateCartCount() {
    if (!token) return;
    
    try {
        const response = await fetch(CART_API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success && result.data) {
            const count = result.data.items?.length || 0;
            const cartBadge = document.getElementById('cartCount');
            if (cartBadge) {
                cartBadge.textContent = count;
                if (count === 0) cartBadge.classList.add('hidden');
                else cartBadge.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('Error getting cart count:', error);
    }
}

// Search functionality - redirect to product card page with search query
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    console.log('Search term:', searchTerm);
    
    if (searchTerm !== '') {
        // Redirect to product card page with search parameter
        const searchUrl = `../ProductCard/card.html?search=${encodeURIComponent(searchTerm)}`;
        console.log('Redirecting to:', searchUrl);
        window.location.href = searchUrl;
    } else {
        // If empty, just go to product card page
        window.location.href = '../ProductCard/card.html';
    }
}

// Add search event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners');
    
    // Update cart count
    updateCartCount();
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    console.log('Search button found:', !!searchBtn);
    console.log('Search input found:', !!searchInput);
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Search button clicked');
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key pressed in search');
                performSearch();
            }
        });
    }
    
    // Account menu click handler
    const accountMenu = document.querySelector('.flex.flex-col.cursor-pointer');
    if (accountMenu) {
        accountMenu.addEventListener('click', function(e) {
            console.log('Account menu clicked');
        });
    }
});

// Logout functionality
function logout() {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../Login Page/login.html';
}