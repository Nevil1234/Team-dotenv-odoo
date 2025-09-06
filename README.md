# 🌱 EcoFinds - Sustainable Second-Hand Marketplace

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.72.0-61dafb.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.0%2B-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-336791.svg)
![Hosted on Railway](https://img.shields.io/badge/Hosted%20on-Railway-0B0D0E.svg)

EcoFinds is revolutionizing sustainable consumption through a trusted second-hand marketplace. Our platform extends product lifecycles, reduces waste, and makes sustainable shopping accessible to everyone.

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+
- Expo CLI
- PostgreSQL database
- Railway account (for deployment)



## 🏗️ Architecture

Here’s an overview of the project architecture:

![Architecture Diagram](https://github.com/shrey3108/VirtualCommunity_TS/blob/main/deepseek_mermaid_20250906_d8f80d.png)

---

## 🎨 UI Components

EcoFinds features a clean, modern interface with sustainability at its core:

- **Color Palette:** Earth tones (greens, browns, tans)  
- **Typography:** Rounded, friendly fonts  
- **Icons:** Custom eco-friendly icon set  
- **Layout:** Card-based design for products  

---

## 🗂️ Database Schema

![Database Schema](https://github.com/shrey3108/VirtualCommunity_TS/blob/main/deepseek_mermaid_20250906_86d6b8.png)







































































MethodEndpointDescriptionPOST/api/auth/registerUser registrationPOST/api/auth/loginUser loginGET/api/productsGet all productsPOST/api/productsCreate a productGET/api/products/:idGet product detailsPUT/api/products/:idUpdate a productDELETE/api/products/:idDelete a productGET/api/users/:idGet user profilePUT/api/users/:idUpdate user profileGET/api/cartGet user's cartPOST/api/cartAdd to cartDELETE/api/cart/:productIdRemove from cart

🚀 Deployment
Backend (Railway)

Connect your repository to Railway.
Set environment variables in the Railway dashboard.
Deploy automatically from the main branch.

Frontend (Expo + Hosting)


Build the Expo app:
bashcd frontend
expo build:web


Host the build output on your preferred hosting service (e.g., Netlify, Vercel).



📝 License
This project is licensed under the MIT License.

🙏 Acknowledgments

Inspired by the circular economy movement
Built during the Sustainability Hackathon 2023
Thanks to all our beta testers and contributors


📞 Support
If you have any questions or need help, please:

Check our FAQ
Open an issue on GitHub
Contact us at support@ecofinds.com
