// API URL
const API_URL = 'http://localhost:5000/api/products';
const CART_API_URL = 'http://localhost:5000/api/cart';
const AUTH_API_URL = 'http://localhost:5000/api/auth';

// Get token
const token = localStorage.getItem('token');
console.log('Token:', token ? 'Present' : 'Missing');

// Check if user is logged in
if (!token) {
    window.location.href = '../Login Page/login.html';
}

// Get category and search from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('category');
const searchQuery = urlParams.get('search');
console.log('Selected category:', selectedCategory);
console.log('Search query from URL:', searchQuery);

// Update page title based on category
if (selectedCategory) {
    const pageTitle = document.querySelector('h1');
    if (pageTitle) {
        pageTitle.textContent = `${selectedCategory} Products`;
    }
    const resultsText = document.querySelector('#resultsCount');
    if (resultsText) {
        resultsText.textContent = `Showing ${selectedCategory} products`;
    }
} else {
    const resultsText = document.querySelector('#resultsCount');
    if (resultsText) {
        resultsText.textContent = 'Showing all products';
    }
}

// Products container
const productsContainer = document.getElementById('productsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

// Price range filter elements
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPriceInput');
const applyPriceFilterBtn = document.getElementById('applyPriceFilter');

// Search elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Store all products for filtering
let allProducts = [];

// Load products from API
async function loadProducts() {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    
    let url = API_URL;
    if (selectedCategory) {
        const encodedCategory = encodeURIComponent(selectedCategory);
        url = `${API_URL}?category=${encodedCategory}`;
    }
    console.log('Fetching products from:', url);
    
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.data && result.data.length > 0) {
            // Store all products for filtering
            allProducts = [...result.data];
            if (selectedCategory) {
                allProducts = result.data.filter(product => product.category === selectedCategory);
            }
            
            console.log('Total products loaded:', allProducts.length);
            
            // Check if there's a search query from URL (Home page search)
            if (searchQuery && searchInput) {
                console.log('Search query detected from URL:', searchQuery);
                searchInput.value = searchQuery;
                // Apply search filter after products are loaded
                setTimeout(() => {
                    performSearch();
                }, 500);
            } else {
                // Display all products initially
                displayProducts(allProducts);
            }
        } else {
            console.log('No products found in database');
            showNoProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNoProducts();
    } finally {
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
    }
}

// Perform search from input value
function performSearch() {
    if (!allProducts.length) {
        console.log('No products to search');
        return;
    }
    
    const searchTerm = searchInput?.value?.toLowerCase().trim() || '';
    console.log('Searching for:', searchTerm);
    
    let filtered = [...allProducts];
    
    if (searchTerm !== '') {
        filtered = filtered.filter(product => {
            const productName = (product.name || '').toLowerCase();
            const productDescription = (product.description || '').toLowerCase();
            const productCategory = (product.category || '').toLowerCase();
            const productBrand = (product.brand || '').toLowerCase();
            
            return productName.includes(searchTerm) || 
                   productDescription.includes(searchTerm) || 
                   productCategory.includes(searchTerm) ||
                   productBrand.includes(searchTerm);
        });
        console.log(`Search found ${filtered.length} products for "${searchTerm}"`);
        
        // Update results count text
        const resultsText = document.querySelector('#resultsCount');
        if (resultsText) {
            resultsText.textContent = `Found ${filtered.length} results for "${searchTerm}"`;
        }
    } else {
        // Reset results count
        const resultsText = document.querySelector('#resultsCount');
        if (resultsText) {
            if (selectedCategory) {
                resultsText.textContent = `Showing ${selectedCategory} products (${allProducts.length} items)`;
            } else {
                resultsText.textContent = `Showing all products (${allProducts.length} items)`;
            }
        }
    }
    
    // Apply price filter after search
    applyPriceFilterToResults(filtered);
}

// Apply price filter to results
function applyPriceFilterToResults(products) {
    const minPrice = parseInt(minPriceInput?.value) || 0;
    const maxPrice = parseInt(maxPriceInput?.value) || 5000;
    
    const filtered = products.filter(product => {
        const productPrice = product.price || 0;
        return productPrice >= minPrice && productPrice <= maxPrice;
    });
    
    console.log(`After price filter: ${filtered.length} products`);
    
    if (filtered.length === 0) {
        const searchTerm = searchInput?.value?.toLowerCase().trim() || '';
        showNoFilterResults(searchTerm, minPrice, maxPrice);
    } else {
        displayProducts(filtered);
    }
}

// Apply both filters (called by price filter button)
function applyFilters() {
    if (!allProducts.length) return;
    
    const searchTerm = searchInput?.value?.toLowerCase().trim() || '';
    let filtered = [...allProducts];
    
    if (searchTerm !== '') {
        filtered = filtered.filter(product => {
            const productName = (product.name || '').toLowerCase();
            const productDescription = (product.description || '').toLowerCase();
            const productCategory = (product.category || '').toLowerCase();
            const productBrand = (product.brand || '').toLowerCase();
            
            return productName.includes(searchTerm) || 
                   productDescription.includes(searchTerm) || 
                   productCategory.includes(searchTerm) ||
                   productBrand.includes(searchTerm);
        });
    }
    
    applyPriceFilterToResults(filtered);
}

// Display products in grid
function displayProducts(products) {
    if (!productsContainer) return;
    
    console.log('Displaying', products.length, 'products');
    
    if (products.length === 0) {
        showNoProducts(selectedCategory);
        return;
    }
    
    productsContainer.innerHTML = products.map(product => `
        <div class="bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col md:flex-row shadow-[0px_12px_32px_rgba(19,25,33,0.06)] group transition-all duration-300" data-product-id="${product._id}">
            <div class="md:w-72 h-64 md:h-auto overflow-hidden bg-surface-container-low p-6 flex items-center justify-center">
                <img class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                     src="${product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}" 
                     alt="${escapeHtml(product.name)}"/>
            </div>
            <div class="flex-1 p-8 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <span class="bg-secondary-container text-on-secondary-fixed-variant text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">
                            ${escapeHtml(product.category || 'Product')}
                        </span>
                        <div class="flex items-center text-primary-container">
                            <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="text-xs font-bold text-on-surface ml-1">4.9 (${Math.floor(Math.random() * 200) + 10} reviews)</span>
                        </div>
                    </div>
                    <h2 class="font-headline text-xl font-bold text-on-surface mb-2 leading-tight">${escapeHtml(product.name)}</h2>
                    <p class="text-on-surface-variant text-sm mb-6 leading-relaxed">${escapeHtml(product.description?.substring(0, 150) || 'No description available')}</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        ${displaySpecifications(product.specifications, product.category)}
                    </div>
                </div>
                <div class="flex items-center justify-between pt-6 border-t border-surface-container">
                    <div class="flex flex-col">
                        <span class="text-xs text-slate-500 font-medium">Price</span>
                        <span class="text-2xl font-black text-on-surface">$${(product.price || 0).toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="text-xs text-slate-400 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button onclick="addToCart('${product._id}')" class="bg-primary-container hover:bg-amber-400 text-on-primary-fixed px-8 py-3 rounded-xl font-headline font-bold text-sm transition-all active:scale-95 shadow-sm">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display specifications
function displaySpecifications(specs, category) {
    if (!specs || Object.keys(specs).length === 0) {
        return `
            <div><p class="text-[10px] text-slate-500 font-bold uppercase mb-1">Category</p><p class="text-sm font-semibold text-on-secondary-fixed">${escapeHtml(category || 'Product')}</p></div>
            <div><p class="text-[10px] text-slate-500 font-bold uppercase mb-1">Stock</p><p class="text-sm font-semibold text-on-secondary-fixed">In Stock</p></div>
        `;
    }
    
    const entries = Object.entries(specs).slice(0, 4);
    return entries.map(([key, value]) => `
        <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase mb-1">${escapeHtml(key)}</p>
            <p class="text-sm font-semibold text-on-secondary-fixed">${escapeHtml(value)}</p>
        </div>
    `).join('');
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show no products message
function showNoProducts(category = null) {
    if (productsContainer) {
        const categoryText = category ? ` in "${category}"` : '';
        productsContainer.innerHTML = `
            <div class="text-center py-12 col-span-full">
                <span class="material-symbols-outlined text-6xl text-gray-400">inventory_2</span>
                <p class="text-gray-500 mt-4">No products found${categoryText}. Please add products from Product Management page.</p>
                <a href="../ProductManagement/productmanagement.html" class="inline-block mt-4 bg-primary-container px-6 py-2 rounded-lg">Add Product</a>
            </div>
        `;
    }
}

// Show no filter results message
function showNoFilterResults(searchTerm, minPrice, maxPrice) {
    if (productsContainer) {
        const categoryText = selectedCategory ? ` in "${selectedCategory}"` : '';
        let message = `No products found${categoryText}`;
        if (searchTerm) message += ` matching "${escapeHtml(searchTerm)}"`;
        message += ` between $${minPrice} and $${maxPrice}`;
        
        productsContainer.innerHTML = `
            <div class="text-center py-12 col-span-full">
                <span class="material-symbols-outlined text-6xl text-gray-400">search_off</span>
                <p class="text-gray-500 mt-4">${message}</p>
                <button onclick="resetAllFilters()" class="inline-block mt-4 bg-primary-container px-6 py-2 rounded-lg">Clear Search</button>
            </div>
        `;
    }
}

// Reset all filters
window.resetAllFilters = function() {
    if (searchInput) searchInput.value = '';
    if (minPriceInput) minPriceInput.value = 0;
    if (maxPriceInput) maxPriceInput.value = 5000;
    
    displayProducts(allProducts);
    
    const resultsText = document.querySelector('#resultsCount');
    if (resultsText) {
        if (selectedCategory) {
            resultsText.textContent = `Showing ${selectedCategory} products (${allProducts.length} items)`;
        } else {
            resultsText.textContent = `Showing all products (${allProducts.length} items)`;
        }
    }
};

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

// Update cart count badge
async function updateCartCountBadge() {
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
        console.error('Error updating cart badge:', error);
    }
}

// Add to Cart function - GLOBAL
window.addToCart = async function(productId) {
    console.log('Add to Cart clicked:', productId);
    
    if (!token) {
        window.location.href = '../Login Page/login.html';
        return;
    }
    
    try {
        const response = await fetch(`${CART_API_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Product added to cart!', 'success');
            await updateCartCountBadge();
        } else {
            showToast('❌ ' + (result.message || 'Failed to add to cart'), 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('❌ Network error. Make sure backend is running', 'error');
    }
};

// Search event listeners
if (searchBtn) {
    searchBtn.addEventListener('click', function() {
        console.log('Search button clicked');
        performSearch();
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('Enter key pressed in search');
            performSearch();
        }
    });
}

// Apply price filter event listener
if (applyPriceFilterBtn) {
    applyPriceFilterBtn.addEventListener('click', function() {
        console.log('Apply filter clicked');
        applyFilters();
    });
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing card page');
    loadProducts();
    updateCartCountBadge();
});