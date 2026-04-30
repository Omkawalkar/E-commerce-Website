
MarketEngine - Complete E-Commerce Website Documentation
Project Overview

MarketEngine is a fully functional full-stack e-commerce website that I built during my internship at Incode Vision. It allows users to browse products, add items to cart, and complete orders. Admins can manage products and track orders through a dedicated dashboard.
Features
User Features

User registration and login with secure authentication
Browse products by categories like Electronics, Home and Kitchen, Fashion, Books, Beauty, Sports, Toys, Automotive, Groceries, and Health
Search products by name, description, or brand
Filter products by price range
View detailed product information including specifications
Add products to shopping cart
Update quantity of items in cart
Remove items from cart
Proceed to secure checkout
Place orders with shipping address
Receive order confirmation with unique order number
Admin Features

Add new products with images
Edit existing product details
Set product price, stock quantity, and category
Add technical specifications for products
Upload and manage product images
View all customer orders
Update order status from Pending to Processing to Shipped to Delivered
Delete orders if needed
Track inventory levels
Technology Stack
Frontend Technologies

HTML5 for structure
Tailwind CSS for styling and responsive design
JavaScript for interactivity and API calls
Material Symbols for icons
Backend Technologies

Node.js for runtime environment
Express.js for web framework
MongoDB for database
Mongoose for database modeling
JWT for authentication
Bcryptjs for password hashing
Development Tools

Nodemon for automatic server restarts
CORS for cross-origin requests
Cookie-parser for handling cookies
Dotenv for environment variables
Project Structure

The project is organised into two main folders.

Backend folder contains all server-side code. Inside this folder you will find the config folder which has database connection file. The middleware folder contains authentication logic. The models folder has all database schemas including User, Product, Cart, and Order. The routes folder contains API endpoints for auth, products, cart, and orders. The main server.js file initialises the Express server.

Frontend folder contains all client-side code. Inside you will find the Create Page for user registration, Login Page for user authentication, Home page for landing page, Product Card page for displaying products, Product Management page for admin to add products, Add Cart Page for shopping cart, Order Page for checkout process, and Admin Order page for managing orders.
API Endpoints

Authentication endpoints include POST request to register a new user, POST request to login a user, and GET request to verify user token.

Product endpoints include GET request to fetch all products with optional category and price filters, GET request to fetch single product by id, POST request to create a new product, PUT request to update product by id, and DELETE request to remove product by id.

Cart endpoints include GET request to fetch user cart, POST request to add item to cart, PUT request to update item quantity, DELETE request to remove specific item, and DELETE request to clear entire cart.

Order endpoints include POST request to create a new order from cart, GET request to fetch all orders for admin, GET request to fetch single order by id, PUT request to update order status, and DELETE request to delete order.
How to Run the Project on Your Computer

Follow these steps carefully to run the project locally.
Prerequisites

First you need to install Node.js on your computer. Download it from the official Node.js website.

Second you need to install MongoDB on your computer. Download MongoDB Community Edition and install it. Make sure MongoDB service is running on your computer.

Third you need a code editor. Visual Studio Code is recommended.
Step by Step Installation Guide

Step 1 - Download or clone the project folder to your computer.

Step 2 - Open the project folder in your code editor.

Step 3 - Open a terminal in the project root directory.

Step 4 - Install all backend dependencies by running the command npm install

This will install all required packages like express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, cookie-parser, express-validator, and nodemon.

Step 5 - Create a .env file in the root directory with the following content

PORT=5000
MONGODB_URI=mongodb://localhost:27017/equinox_marketplace
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development

Make sure to change the JWT_SECRET to your own secret key.

Step 6 - Start MongoDB on your computer. Open a new terminal and run the command mongod

Keep this terminal running while you use the project.

Step 7 - Start the backend server. In the main terminal run the command npm run dev

You should see messages saying server running on port 5000 and MongoDB connected.

Step 8 - Open the frontend files using Live Server. In your code editor, right click on any HTML file inside the Frontend folder and select Open with Live Server.

The website will open in your browser. Make sure the Live Server is running on port 5500.

Step 9 - First register a new user account. Go to the Create Page and fill in your details.

Step 10 - Login with your credentials. You will be redirected to the home page.

Step 11 - To add products as admin, go to the Product Management page. Fill in product name, category, price, description, and upload an image. Click Update or Add Product.

Step 12 - View products on the Product Card page. You can filter by category or price range.

Step 13 - Add products to cart using the Add to Cart button.

Step 14 - View your cart by clicking the cart icon. Update quantities or remove items as needed.

Step 15 - Proceed to checkout by clicking Proceed to Checkout button.

Step 16 - Fill in your shipping address and place your order.

Step 17 - View all orders in the Admin Order page. Here you can update order status or delete orders.
Common Issues and Solutions

If MongoDB connection fails, make sure MongoDB is installed and running. Run mongod in a separate terminal to start the database service.

If you see CORS errors, make sure your backend server is running on port 5000 and your frontend Live Server is running on port 5500.

If images are not uploading, check the server.js file and make sure the payload limit is set to 50mb. The code already includes this setting.

If you cannot login, check the browser console for errors. Make sure you have registered a user first.

If products are not showing, check if you have added any products from the Product Management page. The database starts empty.
Live Demo Notes

This project runs locally on your computer. To show it to someone else, you would need to deploy it to a hosting service.

For deployment, you would need to change the API URLs from localhost to your actual domain name. You would also need to use MongoDB Atlas instead of local MongoDB.
Project Status

This project is fully functional and complete. All core e-commerce features are working including user authentication, product management, shopping cart, order processing, and admin dashboard.

The website is responsive and works on desktop, tablet, and mobile devices.
Credits

This project was built during my internship at Incode Vision. I handled both frontend and backend development from start to finish.
Contact

If you have any questions about this project or want to collaborate, feel free to reach out to me on LinkedIn.

Thank you for taking the time to explore my project.
