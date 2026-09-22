# Aristo Fashion BD - PHP Backend API

A RESTful API built with PHP and MySQL for the Aristo Fashion BD e-commerce platform.

## Features

- Product management with categories, images, and sizes
- Shopping cart functionality for guest users
- Order processing with customer management
- Cash on delivery (COD) payment support
- CORS enabled for frontend integration

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache or Nginx web server
- PDO MySQL extension

## Installation

### 1. Database Setup

Import the database schema:

```bash
mysql -u root -p < database.sql
```

Or use phpMyAdmin to import the `database.sql` file.

### 2. Configuration

Update the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_NAME=aristo_fashion
DB_USER=root
DB_PASS=your_password
```

### 3. Web Server Configuration

#### Apache

Ensure `mod_rewrite` is enabled and create a `.htaccess` file:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

#### Nginx

Add this to your Nginx configuration:

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## API Endpoints

### Categories

- `GET /api/categories.php` - Get all categories
- `GET /api/category.php?id={id}` - Get specific category

### Products

- `GET /api/products.php` - Get all products
  - Query parameters:
    - `category_id` - Filter by category
    - `featured=true` - Get featured products only
    - `limit` - Limit number of results
    - `offset` - Offset for pagination
- `GET /api/product.php?id={id}` - Get specific product

### Cart

- `GET /api/cart.php?session_id={session_id}` - Get cart items
- `POST /api/cart.php` - Add item to cart
  ```json
  {
    "session_id": "unique_session_id",
    "product_id": 1,
    "quantity": 2,
    "size": "M"
  }
  ```
- `PUT /api/cart.php` - Update cart item
  ```json
  {
    "cart_id": 1,
    "quantity": 3
  }
  ```
- `DELETE /api/cart.php?cart_id={cart_id}` - Remove item from cart

### Orders

- `POST /api/orders.php` - Create new order
  ```json
  {
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01712345678",
      "address": "123 Street, Dhaka",
      "city": "Dhaka",
      "postal_code": "1000"
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
    "notes": "Optional order notes",
    "session_id": "unique_session_id"
  }
  ```
- `GET /api/orders.php?order_number={order_number}` - Get order details

## Response Format

All responses are in JSON format:

```json
{
  "data": {...},
  "message": "Success message"
}
```

Error responses:

```json
{
  "message": "Error message"
}
```

## Database Schema

The database includes the following tables:

- `categories` - Product categories
- `products` - Product information
- `product_images` - Product images
- `product_sizes` - Product sizes and stock
- `customers` - Customer information
- `orders` - Order information
- `order_items` - Order line items
- `cart` - Shopping cart for guest users

## Security Notes

- Update default database credentials in production
- Implement proper authentication/authorization for admin endpoints
- Use HTTPS in production
- Add rate limiting to prevent abuse
- Validate and sanitize all input data

## Development

To test the API locally:

1. Start your PHP built-in server:
```bash
php -S localhost:8000
```

2. Access the API at `http://localhost:8000/api/`

## License

This project is part of Aristo Fashion BD e-commerce platform.
