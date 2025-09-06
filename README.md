# 🌱 EcoFinds - Sustainable Second-Hand Marketplace  

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
![React Native](https://img.shields.io/badge/React%2520Native-0.72.0-61dafb.svg)  
![Node.js](https://img.shields.io/badge/Node.js-18.0%252B-green.svg)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-336791.svg)  
![Hosted on Railway](https://img.shields.io/badge/Hosted%2520on-Railway-0B0D0E.svg)  

EcoFinds is revolutionizing sustainable consumption through a trusted second-hand marketplace.  
Our platform extends product lifecycles, reduces waste, and makes sustainable shopping accessible to everyone.  

---

## ✨ Features  

- 🔐 **Secure Authentication** – Email/password registration and login  
- 🛍️ **Product Listings** – Create, read, update, and delete listings with images  
- 🔍 **Smart Discovery** – Filter by category and search by keywords  
- 🛒 **Shopping Cart** – Add items to cart for future purchase  
- 📊 **User Dashboard** – Manage profile and view your activity  
- 📱 **Responsive Design** – Works seamlessly on desktop and mobile  
- ♻️ **Sustainability Tracking** – See your environmental impact  

---
# 🚀 Quick Start

## Prerequisites

- Node.js 18.0+
- Expo CLI
- PostgreSQL database
- Railway account (for deployment)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ecofinds.git
cd ecofinds

### 2. Install backend dependencies
cd backend
npm install

### 3. Install frontend dependencies
cd ../frontend
npm install

### 4. Set up environment variables

## Backend (.env)
# (Create a .env file in the backend folder with the following content)
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001

## Frontend (app.config.js)
# (Edit app.config.js in the frontend folder as follows)
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL || "http://localhost:3001",
    },
  },
};

### 5. Initialize database
cd backend
npx sequelize-cli db:migrate

### 6. Start development servers

# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start

## 🏗️ Architecture

Here’s an overview of the project architecture:

![Architecture Diagram](https://github.com/shrey3108/VirtualCommunity_TS/blob/main/deepseek_mermaid_20250906_d8f80d.png)

## 🎨 UI Components

EcoFinds features a clean, modern interface with sustainability at its core:

- **Color Palette:** Earth tones (greens, browns, tans)  
- **Typography:** Rounded, friendly fonts  
- **Icons:** Custom eco-friendly icon set  
- **Layout:** Card-based design for products

## 🗂️ Database Schema

[![Database Schema](https://github.com/shrey3108/VirtualCommunity_TS/blob/main/deepseek_mermaid_20250906_86d6b8.png)](https://github.com/shrey3108/VirtualCommunity_TS/blob/main/deepseek_mermaid_20250906_86d6b8.png)


## 🔌 API Endpoints

| Method | Endpoint                 | Description          |
|--------|-------------------------|--------------------|
| POST   | `/api/auth/register`     | User registration  |
| POST   | `/api/auth/login`        | User login         |
| GET    | `/api/products`          | Get all products   |
| POST   | `/api/products`          | Create a product   |
| GET    | `/api/products/:id`      | Get product details|
| PUT    | `/api/products/:id`      | Update a product   |
| DELETE | `/api/products/:id`      | Delete a product   |
| GET    | `/api/users/:id`         | Get user profile   |
| PUT    | `/api/users/:id`         | Update user profile|
| GET    | `/api/cart`              | Get user's cart    |
| POST   | `/api/cart`              | Add to cart        |
| DELETE | `/api/cart/:productId`   | Remove from cart   |


## 🚀 Deployment

### Backend (Railway)
1. Connect your repository to Railway.  
2. Set environment variables in the Railway dashboard.  
3. Deploy automatically from the `main` branch.  

### Frontend (Expo + Hosting)
1. Build the Expo app:
```bash
cd frontend
expo build:web

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Inspired by the circular economy movement  
- Built during the Sustainability Hackathon 2023  
- Thanks to all our beta testers and contributors  

---

## 📞 Support

If you have any questions or need help, please:  

- Check our FAQ  
- Open an issue  
- Contact us at email 








  

