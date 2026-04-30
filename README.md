# WEB NOTE'S - Full Stack Notes Application

A complete full-stack note-taking web application that allows users to create, edit, organize, and manage notes with rich text formatting, folder organization, user authentication, and real-time search capabilities.

---

## Table of Contents

1. Overview
2. Features
3. Technology Stack
4. Project Structure
5. Prerequisites
6. Installation Guide
7. Backend Setup
8. Frontend Setup
9. Running the Application
10. API Documentation
11. Database Schema
12. Usage Guide
13. Troubleshooting
14. License

---

## Overview

WEB NOTE'S is a modern note-taking application built with the MERN stack. It provides users with a secure platform to create, organize, and manage their notes. The application features user authentication, rich text editing, folder organization, pinning and favoriting capabilities, and persistent data storage using MongoDB. Each user has their own isolated workspace, ensuring complete data privacy and security.

---

## Features

### User Authentication and Security

- User registration with encrypted password storage using bcryptjs
- Secure login using JSON Web Token authentication
- Token-based authorization for all protected API routes
- Password hashing with 10 salt rounds for enhanced security
- 7-day token expiration for automatic logout
- Complete user data isolation between different accounts

### Note Management

- Create, read, update, and delete notes
- Rich text editing with custom toolbar
- Auto-resize text editor based on content length
- Real-time search by note title or content
- Export notes as PDF files
- Automatic save functionality

### Rich Text Editor Features

Text Formatting Options:
- Bold, Italic, and Underline formatting
- Text color selection with 8 predefined colors
- Text highlight with 8 predefined colors
- Custom color picker for both text and highlight
- Font size adjustment with 7 different sizes from 10px to 32px

Paragraph Formatting Options:
- Bulleted lists for unordered information
- Numbered lists for ordered information
- Multilevel lists for nested content
- Text alignment including Left, Center, Right, and Justify
- Heading styles H1 and H2
- Blockquote formatting for quoted content
- Hyperlink insertion

### Organization Features

Folder Management System:
- Create new custom folders
- Edit existing folder names
- Delete folders with automatic note reassignment
- View all notes inside a specific folder
- Move notes between different folders
- Display note count for each folder

Note Organization Options:
- Pin important notes to access them quickly
- Mark notes as favorites for easy reference
- Smart home page shows only regular notes
- Dedicated pages for pinned notes only
- Dedicated pages for favorite notes only

### User Experience Features

- Dark mode and Light mode theme toggle
- Responsive design that works on all devices
- User profile section with logout functionality
- Real-time search with instant filtering
- Loading states for all async operations
- Confirmation dialogs for delete operations
- Error handling with user-friendly messages

---

## Technology Stack

### Frontend Technologies

HTML5
- Semantic markup structure for better accessibility
- Contenteditable attribute for rich text editing
- Responsive meta tags for mobile devices

CSS3
- Tailwind CSS utility framework for styling
- CSS Grid and Flexbox for layouts
- Custom CSS animations for transitions
- Dark mode support with CSS variables
- Media queries for responsive design

JavaScript ES6+
- Modern JavaScript features including async/await
- Arrow functions and destructuring assignments
- Fetch API for backend communication
- LocalStorage for session and token management
- DOM manipulation for dynamic content updates
- Event handling for user interactions

External Libraries
- Tailwind CSS version 3.x for styling
- Google Fonts Inter for typography
- Google Material Symbols for icons

### Backend Technologies

Runtime and Framework
- Node.js version 18 or higher as JavaScript runtime
- Express.js version 5.x as web application framework

Database
- MongoDB version 6 or higher as NoSQL database
- Mongoose version 9.x as Object Data Modeling library

Authentication and Security
- JSON Web Token version 9.x for authentication
- bcryptjs version 3.x for password hashing
- CORS for cross-origin resource sharing
- dotenv version 17.x for environment variable management

Development Tools
- Nodemon version 3.x for automatic server restart during development

---


## Prerequisites

Before installing the application, ensure you have the following installed:

1. Node.js version 18 or higher
   - Download from nodejs.org
   - Verify installation: node --version

2. MongoDB version 6 or higher
   - Download from mongodb.com for local installation
   - Or create a free MongoDB Atlas cloud account
   - Verify installation: mongod --version

3. Git (optional, for cloning the repository)
   - Download from git-scm.com

---

## Installation Guide

### Step 1: Get the Source Code

Option A - Clone using Git:
git clone https://github.com/yourusername/web-notes.git
cd web-notes

Option B - Download ZIP:
- Download the ZIP file from GitHub
- Extract it to your desired location
- Open terminal in the extracted folder

### Step 2: Install Backend Dependencies

cd backend
npm install

### Step 3: Configure Environment Variables

Create a .env file in the backend folder and add:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notes_app
JWT_SECRET=your_super_secret_key_change_this_to_a_strong_key

### Step 4: Start MongoDB

For local MongoDB installation:

Windows:
net start MongoDB
or
mongod

MacOS with Homebrew:
brew services start mongodb-community

Linux:
sudo systemctl start mongod

### Step 5: Start the Backend Server

From the backend folder:

Development mode:
npm run dev

Production mode:
npm start

You will see:
Server is running on port 5000
MongoDB connected: 127.0.0.1

### Step 6: Open the Frontend

Method 1 - VS Code Live Server (Recommended):
- Install Live Server extension
- Right-click on frontend/login/login.html
- Select Open with Live Server

Method 2 - Python HTTP Server:
cd frontend
python -m http.server 5500

Method 3 - Node.js HTTP Server:
npx serve frontend

The application will be available at: http://127.0.0.1:5500

---

## Backend Setup

### Environment Variables Reference

| Variable | Description | Required | Example Value |
|----------|-------------|----------|---------------|
| PORT | Backend server port number | Yes | 5000 |
| MONGO_URI | MongoDB connection string | Yes | mongodb://127.0.0.1:27017/notes_app |
| JWT_SECRET | Secret key for JWT signing | Yes | your_secure_secret_key_here |

### NPM Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start server with auto-restart (development) |
| npm start | Start server without auto-restart (production) |
| npm install | Install all dependencies |

### Database Collections

- users - Stores user account information
- notes - Stores all notes with user references
- folders - Stores all folders with user references

---

## Frontend Setup

### Page Navigation Structure

1. Login Page (login/login.html) - Entry point for authentication
2. Create Account Page (create/create.html) - New user registration
3. Home Page (Home page/Home.html) - Main dashboard showing regular notes
4. Create Note Page (add new/new.html) - Rich text editor for notes
5. Edit Note Page (add new/new.html with ID) - Loads existing note for editing
6. Favorites Page (Favorite page/favorite.html) - Shows favorite notes
7. Pinned Page (pinned page/pinned.html) - Shows pinned notes
8. Folders Page (folder/folder.html) - Manage folders and view notes by folder

---

## Running the Application

Step 1: Open Terminal Window 1 for Backend
- cd backend
- npm run dev
- Keep this terminal window open

Step 2: Open Terminal Window 2 for Frontend (Optional)
- cd frontend
- python -m http.server 5500

Step 3: Open Browser
- Go to http://localhost:5500/login/login.html

Step 4: Create an Account
- Click Create Account link
- Fill in your details
- Click Create Account button

Step 5: Login
- Enter your email and password
- Click Login button

Step 6: Start Using the Application
- Click New Note to create your first note
- Use the rich text editor to write content
- Save your note

---

## API Documentation

Base URL: http://localhost:5000/api

### Authentication Endpoints

POST /api/auth/register
Request Body: { "name": "John Doe", "email": "john@example.com", "password": "password123" }
Success Response: 201 with message and user object

POST /api/auth/login
Request Body: { "email": "john@example.com", "password": "password123" }
Success Response: 200 with message, token, and user object

### Note Endpoints (Authentication Required)

Header: Authorization: Bearer your_jwt_token_here

GET /api/notes - Get all user notes
GET /api/notes/:id - Get single note
POST /api/notes - Create new note
PUT /api/notes/:id - Update note
DELETE /api/notes/:id - Delete note

### Folder Endpoints (Authentication Required)

GET /api/folders - Get all user folders
POST /api/folders - Create new folder
PUT /api/folders/:id - Update folder
DELETE /api/folders/:id - Delete folder

---

## Database Schema

### User Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | User's full name |
| email | String | Yes | Unique email address |
| password | String | Yes | Hashed password |
| createdAt | Date | Auto | Timestamp of creation |
| updatedAt | Date | Auto | Timestamp of update |

### Note Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | String | Yes | - | Note title |
| content | String | Yes | - | HTML content |
| pinned | Boolean | No | false | Pin status |
| favorite | Boolean | No | false | Favorite status |
| folder | String | No | "" | Folder name |
| user | ObjectId | Yes | - | Owner reference |
| createdAt | Date | Auto | - | Creation timestamp |
| updatedAt | Date | Auto | - | Update timestamp |

### Folder Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Folder name |
| user | ObjectId | Yes | Owner reference |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Update timestamp |

---

## Usage Guide

### First Time User Setup

1. Open the application in your browser
2. Click the Create Account link
3. Fill in your name, email, and password
4. Accept the terms and conditions
5. Click Create Account
6. After success message, you will be redirected to login
7. Enter your email and password
8. Click Login to enter the application

### Creating a New Note

1. Click the New Note button in the sidebar
2. Enter a title for your note
3. Type your content in the rich text editor
4. Use toolbar buttons for formatting
5. Optionally pin the note or mark as favorite
6. Select a folder from the dropdown
7. Click Save to save your note

### Editing an Existing Note

1. Click on any note card on the Home page
2. The note opens in the editor
3. Make your changes
4. Click Save to update the note

### Deleting a Note

1. Open the note you want to delete
2. Click the Delete button
3. Confirm deletion when prompted

### Searching for Notes

1. Locate the search bar at the top of the Home page
2. Type any keyword to search
3. Results filter in real-time
4. Clear the search box to see all notes

### Creating and Managing Folders

1. Navigate to the Folders page
2. Click New Folder button
3. Enter a folder name and confirm
4. Click on any folder to view notes inside
5. Hover over a folder to see edit and delete buttons
6. Click Back to Folders to return to folder list

### Using Pin and Favorite Features

1. When creating or editing a note, use the toggles in the right sidebar
2. Turn on Pin to Top to pin the note
3. Turn on Add to Favorites to favorite the note
4. Pinned notes appear on the Pinned page
5. Favorite notes appear on the Favorites page
6. These notes do NOT appear on the Home page

### Changing Theme

1. Look for the dark mode button in the top header
2. Click to toggle between light and dark themes

### Exporting Notes as PDF

1. Open any note in the editor
2. Click the Download PDF button
3. Use the browser print dialog to save as PDF

### Logging Out

1. Click your profile section at the bottom of the sidebar
2. Click the Logout button
3. You will be redirected to the login page

---

## Troubleshooting

### Backend Won't Start

Issue: MongoDB connection error
Solution: Ensure MongoDB is running with mongod command

Issue: Port 5000 already in use
Solution: Change PORT in .env file to a different number

Issue: JWT_SECRET not set
Solution: Ensure JWT_SECRET is defined in your .env file

### Frontend Issues

Issue: Cannot connect to backend
Solution: Verify backend is running on http://localhost:5000

Issue: Login fails with correct credentials
Solution: Clear browser localStorage and try again

Issue: Notes not saving or loading
Solution: Check browser console for API errors

### Common Error Messages

"Invalid credentials" - Email or password is incorrect

"Not authorized, no token" - You are not logged in

"Failed to fetch note" - Backend server may be down

"Server not reachable" - Backend is not running

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible NoSQL database
- Express.js for the minimalist web framework
- Node.js for the JavaScript runtime
- Google Fonts and Material Icons for typography and icons

---

## Version History

Version 1.0.0 - Initial release
- Complete authentication system
- Full CRUD operations for notes
- Folder organization system
- Pin and favorite features
- Rich text editor with formatting
- Dark mode support
- PDF export functionality
- Real-time search
- Responsive design

---

Thank you for using WEB NOTE'S
