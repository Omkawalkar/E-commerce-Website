// Clear any existing tokens on create page load
localStorage.removeItem('token');
localStorage.removeItem('user');
console.log('Cleared existing tokens on create page');

// API URL for backend
const API_URL = 'http://localhost:5000/api/auth';

console.log('Create account page loaded');

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, looking for form...');
    
    const form = document.getElementById('registrationForm');
    
    if (!form) {
        console.error('Form not found! Check if form ID is "registrationForm"');
        return;
    }
    
    console.log('Form found, attaching submit handler');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('Form submitted!');
        
        // Get form values
        const fullName = document.getElementById('full_name').value.trim();
        const accountId = document.getElementById('account_id').value.trim();
        const password = document.getElementById('password').value;
        const rePassword = document.getElementById('re_password').value;
        
        console.log('Form data:', { fullName, accountId, passwordLength: password.length });
        
        // Clear previous messages
        clearMessages();
        
        // Validation
        if (!fullName || !accountId || !password || !rePassword) {
            showError('Please fill all fields');
            return;
        }
        
        if (password !== rePassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }
        
        // Prepare data for backend
        let email = '';
        let mobileNumber = null;
        
        if (accountId.includes('@')) {
            email = accountId;
        } else {
            mobileNumber = accountId;
            email = `${accountId}@temp.com`;
        }
        
        const userData = {
            fullName: fullName,
            email: email,
            mobileNumber: mobileNumber,
            password: password,
            re_password: rePassword,
            account_id: accountId
        };
        
        console.log('Sending to backend:', { ...userData, password: '***' });
        
        // Show loading state on button
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Creating account...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            console.log('Response from server:', data);
            
            if (data.success) {
                // IMPORTANT: Do NOT store token here
                // Clear any existing data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                showSuccess('✅ Account created successfully! Redirecting to login page...');
                
                // Clear the form
                document.getElementById('registrationForm').reset();
                
                // Redirect to LOGIN page after 2 seconds
                console.log('Redirecting to login page in 2 seconds...');
                setTimeout(() => {
                    console.log('Now redirecting to login page');
                    window.location.href = '../Login Page/login.html';
                }, 2000);
            } else {
                // Show error message from server
                const errorMsg = data.message || data.errors?.map(e => e.msg).join(', ') || 'Registration failed';
                showError('❌ ' + errorMsg);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError('❌ Network error. Please make sure backend server is running on port 5000');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});

function clearMessages() {
    const container = document.getElementById('messageContainer');
    if (container) {
        container.innerHTML = '';
    }
}

function showError(message) {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
    errorDiv.innerHTML = `
        <span class="block sm:inline">${message}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onclick="this.parentElement.remove()">×</span>
    `;
    container.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4';
    successDiv.innerHTML = `<span class="block sm:inline">${message}</span>`;
    container.appendChild(successDiv);
}