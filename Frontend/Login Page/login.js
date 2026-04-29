// Clear any existing tokens on login page load to prevent auto-redirect
// Comment this out if you want to keep users logged in
// localStorage.removeItem('token');
// localStorage.removeItem('user');

// API URL for backend
const API_URL = 'http://localhost:5000/api/auth';

console.log('Login page loaded');

// Check if user is already logged in (optional - comment out to force login)
const token = localStorage.getItem('token');
if (token) {
    console.log('Token found, but we will let user login manually');
    // Optional: You can keep this or remove it
    // Uncomment below if you want auto-redirect for already logged in users
    /*
    fetch(`${API_URL}/verify`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('User already logged in, redirecting to home');
                window.location.href = '../Home page/home.html';
            }
        });
    */
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }
    
    console.log('Login form found, attaching submit handler');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        const identifier = document.getElementById('identifier').value.trim();
        const password = document.getElementById('password').value;
        
        console.log('Identifier:', identifier);
        
        // Clear previous messages
        clearMessages();
        
        // Validation
        if (!identifier || !password) {
            showError('Please enter both email/mobile and password');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '⏳ Signing in...';
        submitBtn.disabled = true;
        
        try {
            console.log('Sending login request to:', `${API_URL}/login`);
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password })
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (data.success) {
                // Store token and user data ONLY on successful login
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                console.log('Login successful! Token stored');
                console.log('Redirecting to home page in 1.5 seconds...');
                showSuccess('✅ Login successful! Redirecting to home page...');
                
                // Redirect to HOME page after successful login
                setTimeout(() => {
                    console.log('Now redirecting to home page');
                    window.location.href = '../Home page/home.html';
                }, 1500);
            } else {
                // Show error message
                const errorMsg = data.message || data.errors?.map(e => e.msg).join(', ') || 'Invalid credentials';
                console.log('Login failed:', errorMsg);
                showError('❌ ' + errorMsg);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('❌ Network error. Please make sure backend server is running on port 5000');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Create account button handler
    const createAccountBtn = document.querySelector('.mt-4.w-full');
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', () => {
            console.log('Create account button clicked, going to create page');
            window.location.href = '../Create Page/create.html';
        });
    }
});

function clearMessages() {
    const existingErrors = document.querySelectorAll('.error-message, .success-message');
    existingErrors.forEach(el => el.remove());
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
    errorDiv.innerHTML = `
        <span class="block sm:inline">${message}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onclick="this.parentElement.remove()">×</span>
    `;
    
    const form = document.getElementById('loginForm');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4';
    successDiv.innerHTML = `<span class="block sm:inline">${message}</span>`;
    
    const form = document.getElementById('loginForm');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
    }
}

console.log('Equinox Marketplace Login Script Loaded');