# Webiators - Product Management System

A full-stack web application for managing products with user authentication, authorization, and admin dashboard functionality. Built with modern web technologies for a scalable and maintainable codebase.

## 🎯 Overview

Webiators is a comprehensive Product Management System featuring a React-based frontend and a robust Node.js backend API. It enables users to browse products, manage inventory with rich descriptions and image galleries, and provides admin controls for product lifecycle management.

## 🚀 Tech Stack

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI)
- **Styling:** Emotion CSS-in-JS
- **State Management:** Context API
- **HTTP Client:** Axios
- **Rich Text Editor:** React Quill
- **Carousel:** Swiper
- **Notifications:** React Toastify
- **Testing:** Vitest with React Testing Library
- **Router:** React Router 7

### Backend

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Input Validation:** Joi
- **Security:** Helmet.js, HPP, CORS, Rate Limiting
- **Testing:** Vitest with Supertest
- **Development:** Nodemon, Morgan

## ✨ Features

### User Features

- User registration and login authentication
- Product catalog browsing with search and filtering
- Product detail view with image gallery
- Rich product descriptions with HTML content support
- Shopping cart functionality
- Protected user routes

### Admin Features

- Admin dashboard with analytics
- Product CRUD operations (Create, Read, Update, Delete)
- Bulk product upload support
- Image gallery management
- User management
- Protected admin routes with role-based access

### Security

- JWT-based authentication and authorization
- Password encryption with bcryptjs
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS protection
- Security headers with Helmet.js
- Parameter pollution prevention (HPP)

## 📁 Project Structure

```
webiators/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── Components/     # Reusable React components
│   │   │   ├── layout/     # Header and Sidebar components
│   │   │   ├── products/   # Product-related components
│   │   │   └── AllRoutes.jsx, PrivateRoute.jsx
│   │   ├── Pages/          # Page components
│   │   ├── Context/        # React Context (Auth, Product, GlobalInfo)
│   │   ├── Utils/          # API utilities
│   │   ├── theme/          # Theme configuration
│   │   ├── tests/          # Test files
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Node.js/Express Backend
    ├── Controller/         # Route controllers
    ├── Model/              # Mongoose models (Users, Products)
    ├── Routes/             # API routes
    ├── Middleware/         # Custom middleware
    ├── Utils/              # Utility functions (JWT, Rate Limiter)
    ├── tests/              # Test files
    ├── app.js              # Express app setup
    ├── server.js           # Server entry point
    ├── config.env          # Environment configuration
    ├── package.json
    └── vitest.config.js
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**

   ```bash
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `config.env` file in the server directory:

   ```env
   # Database
   DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/webiators

   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d

   # Server
   PORT=5000
   NODE_ENV=development

   # Security
   RATE_LIMIT_WINDOW_MS=15000
   RATE_LIMIT_MAX_REQUESTS=10
   ```

4. **Start the server**

   ```bash
   npm start          # With auto-reload (nodemon)
   npm run dev        # Alternative dev command
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`

## 📝 Available Scripts

### Frontend (client/)

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm test                 # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Run tests with UI
npm run test:coverage   # Generate coverage report
```

### Backend (server/)

```bash
npm start               # Start with nodemon
npm run dev            # Run dev server
npm test               # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Register:** Users create an account with email and password
2. **Login:** Users authenticate and receive a JWT token
3. **Token Storage:** Token is stored in cookies/localStorage
4. **Protected Routes:** Private routes check token validity
5. **Admin Access:** Admin role grants access to admin dashboard

### API Authentication Header

```
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Schema

### User Model

- `_id` - MongoDB ObjectId
- `name` - User full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (user/admin)
- `createdAt` - Account creation date
- `updatedAt` - Last update date

### Product Model

- `_id` - MongoDB ObjectId
- `title` - Product name
- `description` - Rich HTML description
- `price` - Product price
- `category` - Product category
- `images` - Array of image URLs
- `stock` - Available quantity
- `owner` - User who created the product
- `createdAt` - Creation date
- `updatedAt` - Last update date

## 🧪 Testing

### Frontend Tests

```bash
cd client
npm test                # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

**Test Files:**

- `AuthContext.test.js` - Authentication context
- `ProductContext.test.js` - Product context
- `Login.test.js` - Login page
- `Dashboard.test.js` - Admin dashboard
- `ProductForm.test.js` - Product form
- `Integration.test.js` - Integration tests

### Backend Tests

```bash
cd server
npm test              # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

**Test Files:**

- `auth.test.js` - Authentication endpoints
- `product.test.js` - Product CRUD endpoints
- `validation.test.js` - Input validation
- `setup.js` - Test configuration

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Product Endpoints

- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (authenticated)
- `PUT /products/:id` - Update product (owner only)
- `DELETE /products/:id` - Delete product (owner only)
- `POST /products/bulk` - Bulk create products (admin)

## 🔒 Security Features

- JWT authentication with expiration  
- Password hashing with bcryptjs  
- Input validation with Joi  
- XSS protection with DOMPurify  
- Rate limiting per IP  
- CORS configuration  
- Security headers (Helmet.js)  
- HTTP Parameter Pollution protection  
- Protected API routes  
- Role-based access control

## 📦 Dependencies

### Critical Frontend Dependencies

- `react@18.3.1` - UI library
- `react-router@7.13.0` - Routing
- `axios@1.13.4` - HTTP requests
- `@mui/material@7.3.7` - UI components
- `react-quill@2.0.0` - Rich text editor

### Critical Backend Dependencies

- `express@5.2.1` - Web framework
- `mongoose@9.1.5` - MongoDB ODM
- `jsonwebtoken@9.0.3` - JWT authentication
- `joi@18.0.2` - Schema validation
- `bcryptjs@3.0.3` - Password hashing

## 🚀 Deployment

### Frontend Deployment

- Configured for Vercel (see `client/vercel.json`)
- Build output: `dist/` directory
- Environment variables in Vercel dashboard

### Backend Deployment

- Deploy to platforms like Heroku, Railway, or AWS EC2
- Set environment variables in hosting platform
- Ensure MongoDB connection from server is allowed

## 📖 Documentation

For detailed information on specific features:

- [Backend API Documentation](./server/README.md)
- [Frontend Details](./client/README.md)
- [CKEditor Integration](./server/CKEDITOR_INTEGRATION.md)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/YourFeature`)
2. Commit changes (`git commit -m 'Add YourFeature'`)
3. Push to branch (`git push origin feature/YourFeature`)
4. Open a Pull Request

## 📄 License

ISC

## 👤 Author

Sankalp Patel

---

## ❓ Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure `DATABASE_URI` is set in `config.env`

### Token Expired

- Clear cookies/localStorage
- Login again to get a fresh token

### CORS Errors

- Check backend CORS configuration
- Verify frontend URL is whitelisted
- Ensure credentials are sent with requests

### Port Already in Use

- Frontend: Change in `vite.config.js`
- Backend: Change `PORT` in `config.env`


---

**Last Updated:** February 2026
