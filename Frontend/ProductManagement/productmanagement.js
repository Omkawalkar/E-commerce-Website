// API URL
const API_URL = 'http://localhost:5000/api/products';

// Get token
const token = localStorage.getItem('token');

// Check if user is logged in
if (!token) {
    window.location.href = '../Login Page/login.html';
}

// DOM Elements
const productForm = document.getElementById('productForm');
const submitBtn = document.querySelector('.update-add-btn');
const messageContainer = document.getElementById('messageContainer');

// Form field references
const productName = document.getElementById('productName');
const category = document.getElementById('category');
const brand = document.getElementById('brand');
const description = document.getElementById('description');
const price = document.getElementById('price');
const originalPrice = document.getElementById('originalPrice');
const stock = document.getElementById('stock');
const sku = document.getElementById('sku');

// Technical specs table
const specsTable = document.getElementById('specsTable');
const addSpecBtn = document.getElementById('addSpecBtn');

// Image upload handling
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
let uploadedImages = [];

// Add specification row
function addSpecRow(key = '', value = '') {
    const row = document.createElement('tr');
    row.className = 'border-b border-outline-variant/15';
    row.innerHTML = `
        <td class="py-3 pr-4">
            <input class="w-full bg-transparent border border-gray-200 rounded px-2 py-1 text-sm" type="text" value="${key}" placeholder="Spec name"/>
        </td>
        <td class="py-3 pr-4">
            <input class="w-full bg-transparent border border-gray-200 rounded px-2 py-1 text-sm" type="text" value="${value}" placeholder="Value"/>
        </td>
        <td class="py-3 text-right">
            <button class="remove-spec text-red-500 hover:text-red-700">
                <span class="material-symbols-outlined text-lg">delete</span>
            </button>
        </td>
    `;
    
    const removeBtn = row.querySelector('.remove-spec');
    removeBtn.addEventListener('click', () => row.remove());
    
    specsTable.appendChild(row);
}

// Add spec button handler
if (addSpecBtn) {
    addSpecBtn.addEventListener('click', () => addSpecRow('', ''));
}

// Get specifications from table
function getSpecifications() {
    const specs = {};
    const rows = specsTable.querySelectorAll('tr:not(.header-row)');
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        if (inputs[0] && inputs[0].value.trim()) {
            specs[inputs[0].value.trim()] = inputs[1]?.value.trim() || '';
        }
    });
    return specs;
}

// Image upload handler
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImages.push(event.target.result);
                displayImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        });
    });
}

function displayImagePreview(imgSrc) {
    const div = document.createElement('div');
    div.className = 'aspect-square bg-surface-container rounded-xl relative group overflow-hidden';
    div.innerHTML = `
        <img class="w-full h-full object-cover" src="${imgSrc}" alt="Product image"/>
        <button class="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity remove-image">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
    `;
    
    const removeBtn = div.querySelector('.remove-image');
    removeBtn.addEventListener('click', () => {
        div.remove();
        const index = uploadedImages.indexOf(imgSrc);
        if (index > -1) uploadedImages.splice(index, 1);
    });
    
    imagePreview.appendChild(div);
}

// Show message
function showMessage(message, isError = true) {
    if (!messageContainer) return;
    
    messageContainer.innerHTML = `
        <div class="${isError ? 'bg-red-100 text-red-700 border-red-400' : 'bg-green-100 text-green-700 border-green-400'} border px-4 py-3 rounded relative mb-4">
            <span class="block sm:inline">${message}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onclick="this.parentElement.remove()">×</span>
        </div>
    `;
    
    setTimeout(() => {
        if (messageContainer.firstChild) messageContainer.firstChild.remove();
    }, 5000);
}

// Create/Update product
async function saveProduct() {
    // Validate required fields
    if (!productName?.value.trim()) {
        showMessage('Please enter product name');
        return;
    }
    if (!price?.value) {
        showMessage('Please enter product price');
        return;
    }
    if (!category?.value) {
        showMessage('Please select a category');
        return;
    }
    
    const productData = {
        name: productName.value.trim(),
        description: description?.value.trim() || '',
        price: parseFloat(price.value),
        originalPrice: originalPrice?.value ? parseFloat(originalPrice.value) : null,
        category: category.value,
        brand: brand?.value.trim() || '',
        stock: parseInt(stock?.value) || 0,
        sku: sku?.value.trim() || '',
        specifications: getSpecifications(),
        images: uploadedImages,
        isActive: true
    };
    
    console.log('Saving product:', productData);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('✅ Product created successfully!', false);
            // Reset form
            if (productForm) productForm.reset();
            uploadedImages = [];
            if (imagePreview) imagePreview.innerHTML = '';
            specsTable.innerHTML = '<tr class="header-row border-b border-outline-variant/15"><th class="pb-3 text-left text-xs font-bold uppercase">Specification Name</th><th class="pb-3 text-left text-xs font-bold uppercase">Value</th><th class="pb-3 w-10"></th></tr>';
        } else {
            showMessage('❌ Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showMessage('❌ Network error. Make sure backend server is running.');
    }
}

// Add event listener to submit button
if (submitBtn) {
    submitBtn.addEventListener('click', saveProduct);
}

// Add some initial spec rows
addSpecRow('Processor', '');
addSpecRow('RAM', '');
addSpecRow('Storage', '');