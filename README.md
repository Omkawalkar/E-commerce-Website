E-Commerce Website
==================

This is a complete full-stack e-commerce web application that allows users to browse products, add items to shopping cart, process payments, and manage orders. The application includes both customer-facing interfaces and an admin dashboard for inventory and order management.

Table of Contents
-----------------

1. Project Overview
2. Technology Stack
3. Features
4. Project Structure
5. Prerequisites
6. Installation and Setup
7. Running the Application
8. Environment Variables
9. API Endpoints
10. Database Schema
11. Usage Guide
12. Troubleshooting
13. Contributing
14. License

Project Overview
----------------

This E-Commerce platform is a complete online shopping application that provides a seamless shopping experience. The backend is built with Node.js and Express, using MongoDB for data storage. The frontend is developed with React.js for a responsive and interactive user interface. The application uses JWT for secure authentication and follows REST API architecture for communication between frontend and backend.

Technology Stack
----------------

Backend Technologies:
- Node.js as the runtime environment
- Express.js as the web framework
- MongoDB with Mongoose ODM for database
- JWT for authentication tokens
- bcryptjs for password encryption
- Multer for file uploads

Frontend Technologies:
- React.js for user interface
- Redux or Context API for state management
- CSS3 or Tailwind CSS for styling
- Axios for HTTP requests

Development Tools:
- Git for version control
- npm for package management
- dotenv for environment configuration

Features
--------

User Features:
- User registration and login system
- Product browsing with search functionality
- Product filtering by category, price range, and ratings
- Shopping cart management
- Order placement process
- Payment integration
- Order history viewing
- User profile management

Admin Features:
- Admin dashboard with analytics
- Product management including add, edit, and delete operations
- Inventory management system
- Order management and tracking
- User management controls
- Sales reporting and analytics

Security Features:
- Password hashing for security
- JWT based authentication
- Input validation for all forms
- Protection against XSS attacks
- CORS configuration for secure cross-origin requests

Project Structure
-----------------

The project has the following folder structure:

E-COMMERCE/
|
+-- Backend/
|   +-- config/           Database configuration files
|   +-- middleware/       Authentication and error handling middleware
|   +-- models/          Database models for User, Product, Order
|   +-- routes/          API route definitions
|   +-- node_modules/    Backend dependencies
|   +-- package.json     Backend dependencies list
|   +-- package-lock.json
|   +-- server.js        Backend entry point
|
+-- Frontend/
|   +-- public/          Static assets like images and index.html
|   +-- src/             React source code
|   |   +-- components/  Reusable UI components
|   |   +-- pages/       Page components for different routes
|   |   +-- redux/       State management files
|   |   +-- utils/       Helper functions and utilities
|   |   +-- App.js       Main React component
|   +-- node_modules/    Frontend dependencies
|   +-- package.json     Frontend dependencies list
|
+-- .dist/               Distribution files
+-- .git/                Git repository data
+-- .vscode/             VS Code editor settings
+-- .env                 Environment variables file
+-- .gitignore           Git ignore rules
+-- package.json         Root package.json
+-- package-lock.json    Root lock file

Prerequisites
-------------

Before running this project on your computer, ensure you have the following software installed:

- Node.js version 14 or higher
- npm version 6 or higher or yarn package manager
- MongoDB installed locally or a MongoDB Atlas cloud account
- Git for cloning the repository

Installation and Setup
----------------------

Follow these steps to get the application running on your local machine.

Step 1: Clone the Repository

Open your terminal and run the following command:

git clone https://github.com/Omkawalkar/E-commerce-website.git
cd E-commerce-website

Step 2: Install Backend Dependencies

Navigate to the Backend folder and install the required packages:

cd Backend
npm install

The backend dependencies include express, mongoose, jsonwebtoken, bcryptjs, dotenv, cors, multer, and nodemon for development.

Step 3: Install Frontend Dependencies

Open a new terminal window, navigate to the Frontend folder, and install packages:

cd ../Frontend
npm install

The frontend dependencies include react, react-dom, react-router-dom, axios, redux or react-redux, and tailwindcss if you are using it.

Step 4: Configure Environment Variables

Create a .env file in the Backend directory. Copy and paste the following variables and update them with your own values:

For Server Configuration:
PORT=5000
NODE_ENV=development

For Database Configuration:
MONGODB_URI=mongodb://localhost:27017/ecommerce

If you are using MongoDB Atlas instead of local MongoDB, use this format:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

For JWT Configuration:
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

For Payment Configuration if you have implemented payments:
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

For Admin Configuration:
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

Step 5: Set Up the Database

If you are using local MongoDB:
- Install MongoDB Community Edition on your computer
- Start the MongoDB service

For Windows:
net start MongoDB

For MacOS or Linux:
sudo systemctl start mongod

If you are using MongoDB Atlas:
- Create a free cluster at mongodb.com/cloud/atlas
- Get your connection string from the Atlas dashboard
- Add the connection string as MONGODB_URI in your .env file

Running the Application
-----------------------

You have two options to run the application.

Option 1: Run Backend and Frontend Separately

To start the Backend Server:
cd Backend
npm start

For development with auto-reload when files change:
npm run dev

The backend will run on http://localhost:5000

To start the Frontend Development Server:
cd Frontend
npm start

The frontend will run on http://localhost:3000

Option 2: Run Both Together from Root Directory

If you have the concurrently package installed at the root level, you can run:
npm run dev

Option 3: Production Build

To create a production build of the frontend:
cd Frontend
npm run build

To run the production server:
cd Backend
NODE_ENV=production npm start

Access the Application
----------------------

After starting both servers, you can access:

- Frontend Application at http://localhost:3000
- Backend API at http://localhost:5000/api

API Endpoints
-------------

Authentication Routes:

POST /api/auth/register - Register a new user account
POST /api/auth/login - Login with existing account
GET /api/auth/profile - Get the profile of logged in user
PUT /api/auth/profile - Update user profile information

Product Routes:

GET /api/products - Get list of all products
GET /api/products/:id - Get details of a single product
POST /api/products - Create a new product (Admin only)
PUT /api/products/:id - Update an existing product (Admin only)
DELETE /api/products/:id - Delete a product (Admin only)

Order Routes:

POST /api/orders - Create a new order
GET /api/orders/myorders - Get orders placed by the logged in user
GET /api/orders/:id - Get order details by order ID
PUT /api/orders/:id/pay - Update payment status of an order

Cart Routes:

GET /api/cart - Get items in user's cart
POST /api/cart - Add an item to cart
PUT /api/cart/:id - Update quantity of cart item
DELETE /api/cart/:id - Remove an item from cart

Database Schema
---------------

User Model Schema:
- name: String type and required field
- email: String type, required, and must be unique
- password: String type and required
- isAdmin: Boolean type with default value false
- createdAt: Date type for account creation timestamp

Product Model Schema:
- name: String type and required
- price: Number type and required
- description: String type and required
- category: String type and required
- countInStock: Number type and required for inventory tracking
- rating: Number type with default value 0
- imageUrl: String type for product image path

Order Model Schema:
- user: ObjectId type that references the User model
- orderItems: Array type containing ordered products
- shippingAddress: Object type with address details
- paymentMethod: String type for payment method selection
- totalPrice: Number type for order total
- isPaid: Boolean type with default false
- isDelivered: Boolean type with default false

Usage Guide for Customers
-------------------------

Register an Account:
Click on the Sign Up button on the homepage. Enter your name, email address, and a secure password. After registration, you will be automatically logged in or you may need to verify your email if configured.

Browse Products:
After logging in, you can view all products on the homepage. Use the search bar to find specific products by name. You can also filter products by category or by price range.

Add Items to Cart:
Click on any product to view its details page. Select the quantity you want to purchase. Click the Add to Cart button. You can continue shopping or proceed to checkout.

Checkout Process:
Review all items in your cart on the cart page. Add your shipping address information. Select your preferred payment method. Review your order summary and place the order.

Track Your Orders:
Go to the My Orders section in your profile. You can view all your past and current orders. Click on any order to see its status and tracking information.

Usage Guide for Admins
----------------------

Admin Login:
Use the admin email and password you set in the .env file or the admin credentials created in the database. After login, you will see an Admin Dashboard link.

Manage Products:
From the admin dashboard, you can add new products with images and details. Update existing product information such as price and stock count. Remove products that are no longer available.

Process Orders:
View all customer orders in the orders management section. Update order status from pending to processing to shipped to delivered. Mark orders as delivered when the customer receives them.

Troubleshooting Common Issues
-----------------------------

Issue 1: MongoDB Connection Error

If you see an error message like MongooseServerSelectionError, this means the application cannot connect to MongoDB. Check if MongoDB is running on your computer. Verify that the MONGODB_URI in your .env file is correct. If using MongoDB Atlas, check your internet connection.

Issue 2: Port Already in Use

If you get an error saying address already in use, it means another application is using port 5000 or 3000. You can either stop the other application or change the port number in your .env file. To change the backend port, set PORT=5001 or any other available port.

Issue 3: npm Install Fails

If npm install gives errors, try deleting the node_modules folder and package-lock.json file, then run npm install again. You can also try clearing npm cache with npm cache clean --force.

Issue 4: CORS Errors in Browser

If you see CORS errors in the browser console, check that the backend CORS configuration allows requests from http://localhost:3000. The frontend API calls should point to http://localhost:5000/api.

Issue 5: JWT Token Expired

If you are logged out unexpectedly, your JWT token may have expired. The default expiration is set to 7 days. Log in again to get a new token.

Contributing to the Project
--------------------------

If you want to contribute to this project:

1. Fork the repository on GitHub
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with clear messages
4. Push your branch to your forked repository
5. Submit a pull request to the main repository

Please ensure your code follows the existing style and includes appropriate comments.

License
-------

This project is for educational purposes. Please check with the repository owner for specific licensing terms.

Contact
-------

For any questions or issues related to this project, please open an issue on the GitHub repository or contact the project maintainer.

Thank you for using this E-Commerce Website.
