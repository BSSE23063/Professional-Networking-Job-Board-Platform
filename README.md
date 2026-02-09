# Professional Networking & Job Board Platform

## Overview
A comprehensive full-stack platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that combines job board functionality with professional networking features. The platform enables employers to post job opportunities and connect with qualified candidates while providing job seekers with advanced search tools and professional networking capabilities.

## Features

### For Job Seekers
- **Advanced Job Search:** Multiple filter criteria (location, salary, job type).
- **Personalized Recommendations:** Job suggestions based on profile and preferences.
- **Company Exploration:** Detailed company profiles and information.
- **Community Engagement:** Professional forums and discussions.
- **Application Tracking:** Dashboard for managing applications.
- **Resume Management:** Upload and manage CVs/resumes.
- **Real-time Notifications:** Alerts for new job postings.

### For Employers
- **Job Management:** Comprehensive posting and management system.
- **Candidate Discovery:** Filtering and search capabilities for potential hires.
- **Brand Management:** Company profile customization.
- **Analytics Dashboard:** Metrics on job performance and views.
- **Application Review:** Tools to review and manage applicants.
- **Direct Messaging:** Communication channels with candidates.
- **Talent Pool:** Building and managing candidate lists.

## Community & Networking
- Interactive discussion forums for professional topics.
- Post creation, commenting, and liking functionality.
- Professional networking connections.
- Industry-specific discussion groups.
- Knowledge sharing and career advice.
- Event announcements and professional meetups.

## Technology Stack

### Frontend
- **React 18:** Library for building user interfaces.
- **React Router 6:** Client-side routing.
- **Context API:** State management.
- **Axios:** HTTP client for API requests.
- **React Icons:** Icon library.
- **React Toastify:** Notification system.
- **CSS3:** Styling with modern features.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web application framework.
- **MongoDB:** NoSQL database.
- **Mongoose:** Object Data Modeling (ODM) library.
- **JWT:** Authentication and authorization.
- **Bcrypt:** Password hashing.
- **Multer:** File upload handling.
- **CORS:** Cross-origin resource sharing.

## Project Structure

```text
professional-networking-platform/
├── client/                 # React Frontend Application
│   ├── public/             # Static assets
│   └── src/                # Source code
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── context/        # React Context providers
│       ├── services/       # API service functions
│       ├── styles/         # CSS stylesheets
│       └── utils/          # Utility functions
├── server/                 # Node.js Backend Application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── utils/              # Server utilities
└── documentation/          # Project documentation
Prerequisites
Node.js (version 18 or higher)

MongoDB (version 6 or higher)

npm (version 9 or higher) or yarn

Git

Installation
1. Clone the Repository
Bash
git clone [https://github.com/BSSE23063/Professional-Networking-Job-Board-Platform.git](https://github.com/BSSE23063/Professional-Networking-Job-Board-Platform.git)
cd Professional-Networking-Job-Board-Platform
2. Backend Setup
Bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Edit .env file with your configuration
# Update the following variables:
# - MONGODB_URI
# - JWT_SECRET
# - PORT

# Start the development server
npm run dev
3. Frontend Setup
Bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Edit .env file with your configuration
# Update REACT_APP_API_URL to point to your backend

# Start the development server
npm start
Environment Variables
Server (/server/.env)
Code snippet
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
Client (/client/.env)
Code snippet
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_ENVIRONMENT=development
API Documentation
Authentication Endpoints
POST /api/auth/register - Register a new user

POST /api/auth/login - Authenticate user and return token

POST /api/auth/logout - Logout user

GET /api/auth/me - Get current user information

PUT /api/auth/update - Update user profile

Job Endpoints
GET /api/jobs - Get all jobs (with optional filters)

GET /api/jobs/:id - Get specific job details

POST /api/jobs - Create a new job (employer only)

PUT /api/jobs/:id - Update job details

DELETE /api/jobs/:id - Delete a job

GET /api/jobs/search - Advanced job search

Company Endpoints
GET /api/companies - Get all companies

GET /api/companies/:id - Get specific company details

POST /api/companies - Register a new company

PUT /api/companies/:id - Update company information

GET /api/companies/user/:userId - Get companies by user

Community Endpoints
GET /api/posts - Get all community posts

POST /api/posts - Create a new post

GET /api/posts/:id - Get specific post with comments

PUT /api/posts/:id - Update a post

DELETE /api/posts/:id - Delete a post

POST /api/posts/:id/like - Like/unlike a post

POST /api/posts/:id/comment - Add comment to a post
