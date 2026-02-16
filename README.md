# 🛍️ GoShope - Full-Stack E-Commerce Platform

A modern, feature-rich e-commerce platform built with React, TypeScript, Node.js, Express, and MongoDB. Features include user authentication, product management, shopping cart, payment processing, admin dashboard, and more.

![GoShope Banner](https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=GoShope+E-Commerce)

## ✨ Features

### 🛒 Core E-Commerce Features

- **User Authentication** - Firebase Authentication with secure login/signup
- **Product Management** - CRUD operations for products with image uploads
- **Shopping Cart** - Persistent cart with Redux state management
- **Order Management** - Complete order lifecycle from placement to delivery
- **Payment Processing** - Stripe integration for secure payments
- **Product Reviews** - User reviews and ratings system
- **Search & Filtering** - Advanced product search with category and price filters

### 👨‍💼 Admin Dashboard

- **Product Management** - Add, edit, delete products with Cloudinary image uploads
- **Order Management** - View and update order status
- **User Management** - Customer management and analytics
- **Analytics Dashboard** - Charts and statistics with Chart.js
- **Coupon Management** - Create and manage discount coupons

### 🎨 Modern UI/UX

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Glassmorphism Effects** - Modern glass-like UI components
- **Framer Motion Animations** - Smooth page transitions and interactions
- **Dark/Light Theme** - Theme switching capability
- **Loading States** - Beautiful loading indicators and progress bars

## 🚀 Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Redux Toolkit** - State management with RTK Query
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage and optimization

### External Services

- **Firebase** - Authentication and user management
- **Stripe** - Payment processing
- **Cloudinary** - Image hosting and optimization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/goshope.git
cd goshope
```

### 2. Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/goshope

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Pagination
PRODUCT_PER_PAGE=8

# CORS
CLIENT_URL=http://localhost:5173
```

#### Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_SERVER_URL=http://localhost:4000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Install Dependencies

#### Install Backend Dependencies

```bash
cd server
npm install
```

#### Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# On Windows (if using MongoDB Compass/Service)
mongod

# Or use MongoDB Atlas (cloud) and update MONGO_URI in .env
```

### 5. Build and Run

#### Backend Development

```bash
cd server
npm run dev
```

#### Frontend Development

```bash
cd client
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000

## 📁 Project Structure

```
goshope/
├── client/                          # React Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── admin/              # Admin components
│   │   │   ├── Carousel.tsx        # Product carousel
│   │   │   ├── CartItem.tsx        # Cart item component
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   └── ...
│   │   ├── pages/                  # Page components
│   │   │   ├── admin/              # Admin pages
│   │   │   ├── Cart.tsx            # Shopping cart
│   │   │   ├── Home.tsx            # Home page
│   │   │   ├── Login.tsx           # Authentication
│   │   │   └── ...
│   │   ├── redux/                  # State management
│   │   │   ├── api/                # RTK Query APIs
│   │   │   ├── reducer/            # Redux reducers
│   │   │   └── store.ts            # Redux store
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Utility functions
│   │   └── assets/                 # Images and data
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                          # Express Backend
│   ├── src/
│   │   ├── controllers/            # Route controllers
│   │   ├── middleware/             # Custom middleware
│   │   ├── models/                 # MongoDB models
│   │   ├── routes/                 # API routes
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Utility functions
│   │   └── app.ts                  # Express app setup
│   ├── uploads/                    # File uploads directory
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── .gitignore
└── README.md
```

## 🔗 API Endpoints

### Authentication

- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/signup` - User registration
- `GET /api/v1/user/me` - Get user profile

### Products

- `GET /api/v1/product/all` - Get all products
- `GET /api/v1/product/:id` - Get single product
- `POST /api/v1/product/new` - Create new product (Admin)
- `PUT /api/v1/product/:id` - Update product (Admin)
- `DELETE /api/v1/product/:id` - Delete product (Admin)

### Orders

- `POST /api/v1/order/new` - Create new order
- `GET /api/v1/order/my` - Get user orders
- `GET /api/v1/order/:id` - Get single order
- `PUT /api/v1/order/:id` - Update order status (Admin)

### Reviews

- `GET /api/v1/review/:productId` - Get product reviews
- `POST /api/v1/review/:productId` - Create product review

### Admin

- `GET /api/v1/admin/dashboard` - Dashboard statistics
- `GET /api/v1/admin/products` - All products (Admin)
- `GET /api/v1/admin/users` - All users (Admin)
- `GET /api/v1/admin/orders` - All orders (Admin)

## 🎨 Key Components & Features

### Product Management

- Image upload with Cloudinary integration
- Product CRUD operations
- Category-based filtering
- Price range filtering
- Search functionality

### Shopping Cart

- Add/remove items
- Quantity management
- Persistent cart state
- Price calculations

### Payment Integration

- Stripe payment processing
- Secure checkout flow
- Order confirmation

### Admin Dashboard

- Product management interface
- Order status updates
- User management
- Analytics and charts

## 🔧 Development Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run watch        # Watch mode for TypeScript compilation
npm start            # Start production server
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway)

```bash
npm run build
npm start
```

## 📦 Dependencies & Links

### Frontend Dependencies

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [React Router](https://reactrouter.com/) - Routing
- [Axios](https://axios-http.com/) - HTTP client
- [React Hot Toast](https://react-hot-toast.com/) - Notifications
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

### Backend Dependencies

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [JWT](https://jwt.io/) - Authentication
- [Multer](https://github.com/expressjs/multer) - File uploads
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Stripe](https://stripe.com/) - Payment processing
- [Validator](https://github.com/validatorjs/validator.js) - Input validation

### External Services

- [Firebase](https://firebase.google.com/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/docs/)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy Shopping! 🛍️**
