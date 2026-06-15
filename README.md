# FinSight – AI Powered Personal Finance Tracker

## Overview

FinSight is a full-stack web application developed using the MERN stack that helps users manage their personal finances in a simple and organized way. The application allows users to record their income and expenses, set budgets, view financial reports, and receive AI-generated insights about their spending habits.

The goal of this project is to help users better understand their financial activities and make smarter financial decisions through data visualization and AI-powered recommendations.

---

## Key Features

### User Authentication

* User registration and login
* Secure JWT-based authentication
* Password encryption using bcrypt
* Profile management and password update

### Transaction Management

* Add income and expense transactions
* Edit existing transactions
* Delete transactions
* Search and filter transactions
* Pagination support for handling large datasets

### Budget Management

* Set monthly spending limits
* Create category-wise budgets
* Monitor budget utilization
* Track overspending in different categories

### Interactive Dashboard

* Total income overview
* Total expenses overview
* Savings summary
* Monthly spending trends
* Category-wise expense analysis
* Recent transaction history

### AI-Powered Financial Insights

* Personalized spending recommendations
* Spending behavior analysis
* Future expense predictions
* Financial improvement suggestions
* Gemini AI integration for intelligent insights
* Rule-based fallback system when AI services are unavailable

### Reports and Analytics

* Monthly financial reports
* Category-wise expense summaries
* PDF report generation and export
* Detailed financial breakdowns

### User Profile Management

* Update personal information
* Change account password
* View account statistics

---

## Technologies Used

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Redux
* React Router DOM
* Axios
* Tailwind CSS
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt

### AI Integration

* Google Gemini AI
* Rule-Based Recommendation Engine

### Additional Libraries

* PDFKit
* Helmet
* CORS
* Express Rate Limiter

---

## Project Structure

FINANCE_TRACKER
│
├── client
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── redux
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── vite.config.js
│   ├── package.json
│   └── tailwind.config.js
│
├── server
│   ├── models
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── package.json
│   └── server.js
│
└── README.md

---

## Installation and Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd FINANCE_TRACKER
```

---

### Step 2: Backend Setup

Move to the server folder:

```bash
cd server
```

Install required dependencies:

```bash
npm install
```

Create a `.env` file and add the following configuration:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/ai-finance-tracker

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

---

### Step 3: Frontend Setup

Move to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run the frontend application:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## MongoDB Setup

### Option 1: Local MongoDB

Start MongoDB locally:

```bash
mongod
```

### Option 2: MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Obtain the connection string.
5. Update the `MONGODB_URI` variable in the `.env` file.

---

## Application Workflow

### 1. User Registration

Users can create an account using their name, email, and password.

### 2. Login

Registered users can securely log in and access their financial dashboard.

### 3. Manage Transactions

Users can:

* Add income records
* Add expense records
* Edit transactions
* Delete transactions
* Search and filter records

### 4. Set Budgets

Users can define:

* Overall monthly budgets
* Category-specific spending limits

### 5. Analyze Financial Data

The dashboard automatically displays:

* Income summaries
* Expense summaries
* Savings calculations
* Spending charts
* Category breakdowns

### 6. Generate Reports

Users can generate monthly reports and download them as PDF files.

### 7. Receive AI Insights

Gemini AI analyzes transaction history and provides personalized recommendations to improve financial management.

---

## Database Design

### Transaction Collection

Stores:

* Income records
* Expense records
* Categories
* Payment methods
* Transaction dates

### Budget Collection

Stores:

* Monthly budget limits
* Category-wise limits
* User-specific budget information

### User Collection

Stores:

* User details
* Authentication information
* Profile settings

---

## Future Enhancements

Planned improvements for future versions include:

* Mobile Application
* Bank Account Integration
* Recurring Transactions
* Investment Tracking
* Savings Goal Tracking
* Multi-Currency Support
* Expense Sharing
* Advanced Financial Analytics
* Smart Notifications and Alerts

---

## Conclusion

FinSight is an AI-powered personal finance management application designed to help users track their income, expenses, budgets, and savings in one place. By combining modern web technologies with Google Gemini AI, the application provides meaningful financial insights and recommendations that can help users improve their financial habits and make better decisions.

This project was developed as a learning-focused full-stack application to strengthen my skills in MERN stack development, API integration, database management, and practical AI implementation.

---