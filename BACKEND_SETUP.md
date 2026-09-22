# Backend Integration Guide

This guide explains how to set up and run the PHP/MySQL backend for the Aristo Fashion BD e-commerce platform.

## Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Composer (optional, for PHP dependency management)
- Web server (Apache, Nginx, or PHP built-in server)

## Backend Setup

### 1. Database Setup

1. Start your MySQL server
2. Create the database and import the schema:

```bash
# Using MySQL command line
mysql -u root -p < backend/database.sql

# Or using phpMyAdmin
# Import the backend/database.sql file through phpMyAdmin interface
```

3. Update database credentials in `backend/.env`:

```env
DB_HOST=localhost
DB_NAME=aristo_fashion
DB_USER=root
DB_PASS=your_password
```

### 2. Start PHP Backend Server

#### Option A: PHP Built-in Server (Development)

```bash
cd backend
php -S localhost:8000
```

The API will be available at `http://localhost:8000/api/`

#### Option B: Apache (Production)

1. Configure Apache to point to the `backend` directory
2. Ensure `mod_rewrite` is enabled
3. The `.htaccess` file is already included for URL rewriting

#### Option C: Nginx (Production)

Add this to your Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/backend;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 3. Frontend Configuration

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Update the API URL in `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
```

For production, use your actual backend URL:

```env
VITE_API_URL=https://your-domain.com/api
```

### 4. Run Frontend Development Server

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Categories
- `GET /api/categories.php` - Get all categories
- `GET /api/category.php?id={id}` - Get specific category

### Products
- `GET /api/products.php` - Get all products
  - Query parameters: `category_id`, `featured=true`, `limit`, `offset`
- `GET /api/product.php?id={id}` - Get specific product

### Cart
- `GET /api/cart.php?session_id={id}` - Get cart items
- `POST /api/cart.php` - Add item to cart
- `PUT /api/cart.php` - Update cart item
- `DELETE /api/cart.php?cart_id={id}` - Remove item from cart

### Orders
- `POST /api/orders.php` - Create new order
- `GET /api/orders.php?order_number={number}` - Get order details

## How It Works

### Data Flow

1. **Product Loading**: When the app loads, it fetches products from the PHP backend API
2. **Cart Management**: Cart operations are synced with the backend using session IDs
3. **Order Processing**: Orders are created via the backend API with full customer and order details
4. **Fallback Mode**: If the backend is unavailable, the app falls back to local storage and mock data

### Session Management

- Guest users are assigned a unique session ID stored in localStorage
- This session ID is used to sync cart data with the backend
- Session IDs persist across browser sessions

### Data Transformation

The backend API returns data in a different format than the frontend expects. The `api.ts` service includes conversion functions:

- `convertBackendToFrontendProduct()` - Converts backend product data to frontend format
- `convertBackendToFrontendCartItem()` - Converts backend cart items to frontend format

## Testing the API

### Test Categories Endpoint

```bash
curl http://localhost:8000/api/categories.php
```

### Test Products Endpoint

```bash
curl http://localhost:8000/api/products.php
curl http://localhost:8000/api/products.php?featured=true
curl http://localhost:8000/api/products.php?category_id=1
```

### Test Specific Product

```bash
curl http://localhost:8000/api/product.php?id=1
```

### Test Cart Operations

```bash
# Add to cart
curl -X POST http://localhost:8000/api/cart.php \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test123","product_id":1,"quantity":2,"size":"M"}'

# Get cart
curl http://localhost:8000/api/cart.php?session_id=test123
```

### Test Order Creation

```bash
curl -X POST http://localhost:8000/api/orders.php \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01712345678",
      "address": "123 Street",
      "city": "Dhaka"
    },
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price": 1200.00,
        "size": "M"
      }
    ],
    "payment_method": "cod",
    "session_id": "test123"
  }'
```

## Troubleshooting

### Backend Not Responding

1. Check if PHP server is running: `http://localhost:8000`
2. Check PHP error logs
3. Verify database connection in `backend/config/database.php`

### CORS Errors

The backend includes CORS configuration in `backend/includes/cors.php`. If you still encounter CORS issues:

1. Check your browser console for specific error messages
2. Verify the API URL in your frontend `.env.local`
3. Ensure the backend is responding with proper CORS headers

### Database Connection Errors

1. Verify MySQL is running
2. Check database credentials in `backend/.env`
3. Ensure the database `aristo_fashion` exists
4. Test database connection manually:

```bash
mysql -u root -p aristo_fashion
```

### Products Not Loading

1. Check browser console for API errors
2. Verify the backend API is accessible
3. Check if sample data exists in the database
4. Try accessing the API endpoint directly in browser

## Security Considerations

### Development vs Production

- **Development**: The current setup is suitable for development
- **Production**: Implement these security measures:

1. **Authentication**: Add user authentication for admin endpoints
2. **HTTPS**: Use SSL/TLS for all API communications
3. **Input Validation**: Validate and sanitize all user inputs
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Environment Variables**: Never commit `.env` files to version control
6. **Database Security**: Use strong database passwords and restricted privileges

### Recommended Security Improvements

- Add JWT or session-based authentication
- Implement CSRF protection
- Add request rate limiting
- Use prepared statements (already implemented)
- Add API key authentication for sensitive operations
- Implement proper error handling without exposing sensitive information

## Performance Optimization

### Backend

1. Enable database query caching
2. Implement database connection pooling
3. Add Redis for session management
4. Use CDN for static assets
5. Implement API response caching

### Frontend

1. Implement client-side caching for products
2. Use optimistic UI updates for cart operations
3. Implement lazy loading for images
4. Add service worker for offline support

## Deployment

### Backend Deployment

1. Upload backend files to your server
2. Configure production database credentials
3. Set up proper file permissions
4. Configure SSL certificate
5. Set up process manager (like Supervisor) for PHP

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Upload `dist` folder to your web server
3. Configure production API URL in environment variables
4. Set up proper routing for single-page application

## Monitoring and Logging

### Backend Logging

Add logging to critical operations:

```php
error_log("Order created: " . $order_number);
```

### Frontend Error Tracking

Consider integrating error tracking services like:

- Sentry
- LogRocket
- Custom error logging

## Support

For issues or questions:

1. Check the API documentation in `backend/README.md`
2. Review the troubleshooting section above
3. Check browser console and server logs
4. Test API endpoints individually using curl or Postman
