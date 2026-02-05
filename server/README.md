# Product Management System - Backend API

A secure RESTful API for product management built with Node.js, Express.js, and MongoDB.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Security:** Helmet.js, HPP, Rate Limiting, CORS

## Features

- User authentication (Register, Login, Logout)
- Product CRUD operations with ownership protection
- Bulk product creation support
- Rich text description field (HTML content supported)
- Image gallery management
- Input validation on all endpoints
- Protected routes with JWT middleware
- Rate limiting to prevent abuse

## Prerequisites

- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `config.env` file in the root directory:
   ```env
   # Database
   DATABASE_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Database

   # JWT Configuration
   JWT_SECRET_KEY=your-secure-secret-key-min-32-chars
   JWT_EXPIRATION=7d

   # Application
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm start

   # Production
   npm run dev
   ```

## API Endpoints

### Base URL
```
http://127.0.0.1:5000/api/v1
```

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register new user | No |
| POST | `/users/login` | User login | No |
| POST | `/users/logout` | User logout | No |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | Yes |
| GET | `/products/:id` | Get product by ID | Yes |
| POST | `/products` | Create product(s) | Yes |
| PATCH | `/products/:id` | Update product | Yes |
| DELETE | `/products/:id` | Delete product | Yes |

## Authentication

### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully.",
  "Token": "eyJhbGciOiJIUzI1NiIs...",
  "User": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Using Protected Routes
Include the JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

## Product Schema

### Request Body (Create/Update)
```json
{
  "metaTitle": "SEO Meta Title",
  "productName": "Product Display Name",
  "slug": "product-url-slug",
  "price": 99.99,
  "discountedPrice": 79.99,
  "description": "<p>Rich text HTML description</p>",
  "galleryImages": [
    {
      "url": "https://example.com/image.jpg",
      "publicId": "optional-cloud-id",
      "alt": "Image description"
    }
  ],
  "isActive": true,
  "createdBy": "user-id"
}
```

### Validation Rules

| Field | Type | Rules |
|-------|------|-------|
| metaTitle | String | Required, 3-60 characters |
| productName | String | Required, 3-200 characters |
| slug | String | Required, 3-100 chars, lowercase, hyphens only |
| price | Number | Required, min 0, max 1,000,000 |
| discountedPrice | Number | Optional, must be less than price |
| description | String | Required, 10-5000 characters (HTML allowed) |
| galleryImages | Array | Optional, max 10 images |
| galleryImages.url | String | Required, valid URI |
| galleryImages.alt | String | Optional, max 200 characters |
| isActive | Boolean | Optional, default: true |
| createdBy | String | Required, valid MongoDB ObjectId |

### Slug Format
- Lowercase letters and numbers only
- Words separated by single hyphens
- No leading/trailing hyphens
- Examples: `my-product`, `product123`, `new-item-2024`

## Bulk Product Creation

Create multiple products in a single request:
```http
POST /api/v1/products
Content-Type: application/json
Authorization: Bearer <token>

[
  { "metaTitle": "...", "productName": "Product 1", ... },
  { "metaTitle": "...", "productName": "Product 2", ... }
]
```

## Error Responses

All errors follow this format:
```json
{
  "status": "fail",
  "message": "Error description",
  "field": "fieldName"
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Security Features

### Helmet.js
Configures secure HTTP headers including:
- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- And more...

### Rate Limiting
| Limiter | Window | Max Requests |
|---------|--------|--------------|
| General API | 15 minutes | 100 requests |
| Auth Routes | 15 minutes | 10 requests |

### Additional Security
- **HPP:** Prevents HTTP Parameter Pollution
- **CORS:** Configured for frontend origin
- **Body Size Limit:** 10KB max payload
- **Password Hashing:** bcrypt with salt rounds
- **HttpOnly Cookies:** JWT stored securely

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Test Suites
- **auth.test.js** - Authentication endpoints
- **product.test.js** - Product CRUD operations
- **validation.test.js** - Schema validation rules

## Project Structure

```
Backend/
├── Controller/
│   ├── productController.js    # Product CRUD logic
│   └── userController.js       # Auth logic
├── Middleware/
│   ├── Protected.js            # JWT authentication
│   └── validation.js           # Joi validation schemas
├── Model/
│   ├── productModel.js         # Product Mongoose schema
│   └── userModel.js            # User Mongoose schema
├── Routes/
│   ├── productRoutes.js        # Product endpoints
│   └── userRoutes.js           # Auth endpoints
├── Utils/
│   ├── jwt.js                  # Token generation/verification
│   └── rateLimiter.js          # Rate limiting config
├── tests/
│   ├── setup.js                # Test helpers
│   ├── auth.test.js            # Auth tests
│   ├── product.test.js         # Product tests
│   └── validation.test.js      # Validation tests
├── app.js                      # Express app configuration
├── server.js                   # Server entry point
├── config.env                  # Environment variables
├── package.json
└── vitest.config.js            # Test configuration
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URI | MongoDB connection string | - |
| JWT_SECRET_KEY | Secret for signing tokens | - |
| JWT_EXPIRATION | Token expiry duration | 7d |
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |

## License

ISC

## Author

Sankalp Patel
