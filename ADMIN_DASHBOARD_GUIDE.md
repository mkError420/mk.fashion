# Admin Dashboard Guide

Complete guide for the Aristo Fashion BD Admin Dashboard with login functionality and database integration.

## Admin Credentials

**Login Details:**
- **Email:** `mk.rabbani.cse@gmail.com`
- **Password:** `sup123456123`

## Features Implemented

### ✅ Database Integration
- **Admin Users Table:** Secure admin authentication with hashed passwords
- **Dashboard Statistics:** Real-time data from database
- **Order Management:** View and manage orders
- **Product Management:** Full CRUD operations
- **Customer Management:** View customer data

### ✅ Backend API Endpoints

#### Authentication
- `POST /api/admin_login.php` - Admin login
- `GET /api/admin_login.php` - Check authentication status
- `DELETE /api/admin_login.php` - Admin logout

#### Dashboard
- `GET /api/admin_dashboard.php?action=stats` - Get dashboard statistics
- `GET /api/admin_dashboard.php?action=orders` - Get all orders
- `GET /api/admin_dashboard.php?action=products` - Get all products
- `GET /api/admin_dashboard.php?action=customers` - Get all customers
- `POST /api/admin_dashboard.php?action=product` - Create product
- `PUT /api/admin_dashboard.php?action=product` - Update product
- `PUT /api/admin_dashboard.php?action=order` - Update order status
- `DELETE /api/admin_dashboard.php?action=product` - Delete product

### ✅ Frontend Features

#### Admin Login Page
- Secure login form with email/password
- Session-based authentication
- Error handling with user feedback
- Responsive design
- Back to website link

#### Admin Dashboard
- **Overview Tab:** Statistics cards and recent orders
- **Orders Tab:** Order management interface
- **Products Tab:** Product management interface
- **Customers Tab:** Customer management interface
- **Sidebar Navigation:** Easy navigation between sections
- **User Profile:** Display admin information
- **Logout Functionality:** Secure session termination

## Database Schema

### Admin Users Table
```sql
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security Features

### ✅ Password Security
- Passwords hashed using PHP's `password_hash()`
- Uses `PASSWORD_DEFAULT` (bcrypt) algorithm
- Secure password verification with `password_verify()`

### ✅ Session Management
- PHP session-based authentication
- Session verification on each admin request
- Automatic session cleanup on logout

### ✅ API Security
- Session-based authentication check
- CORS configuration for frontend integration
- SQL injection prevention with prepared statements
- Input validation and sanitization

## Accessing the Admin Dashboard

### Local Development
1. Start your PHP backend server:
```bash
cd backend
php -S localhost:8000
```

2. Start your React frontend:
```bash
npm run dev
```

3. Access admin login:
```
http://localhost:3000/admin/login
```

### Production (InfinityFree)
1. Access admin login:
```
https://efashionbd.rf.gd/admin/login
```

2. Login with your credentials:
- Email: `mk.rabbani.cse@gmail.com`
- Password: `sup123456123`

3. You'll be redirected to the dashboard:
```
https://efashionbd.rf.gd/admin/dashboard
```

## Dashboard Features

### Overview Tab
- **Total Products:** Count of active products
- **Total Orders:** Count of all orders
- **Total Revenue:** Sum of paid orders
- **Pending Orders:** Count of pending orders
- **Recent Orders:** Last 5 orders with details

### Orders Tab
- View all orders with pagination
- Filter by order status
- Update order status
- View customer details
- See order amounts and dates

### Products Tab
- View all products with pagination
- Create new products
- Update existing products
- Delete products
- Manage product details

### Customers Tab
- View all customers with pagination
- See customer contact information
- View customer order history
- Manage customer data

## API Response Examples

### Login Response
```json
{
  "message": "Login successful",
  "admin": {
    "id": 1,
    "email": "mk.rabbani.cse@gmail.com",
    "name": "Admin User"
  }
}
```

### Dashboard Stats Response
```json
{
  "stats": {
    "totalProducts": 6,
    "totalOrders": 15,
    "totalRevenue": 45000,
    "pendingOrders": 3
  },
  "recentOrders": [
    {
      "id": 1,
      "order_number": "ORD123456",
      "total_amount": 1200.00,
      "status": "pending",
      "payment_status": "pending",
      "created_at": "2024-09-22 10:30:00"
    }
  ]
}
```

## Deployment Instructions

### 1. Update Database
Import the updated database schema with admin users table:

```bash
# In phpMyAdmin, select your database and import:
backend/database_infinityfree.sql
```

This will create the `admin_users` table and insert your admin account.

### 2. Upload Backend Files
Upload these new/updated files to your hosting:

**New Files:**
- `backend/api/admin_login.php`
- `backend/api/admin_dashboard.php`

**Updated Files:**
- `backend/database_infinityfree.sql` (includes admin table)
- `backend/database.sql` (includes admin table)

### 3. Upload Frontend
Build and upload the updated frontend:

```bash
npm run build
```

Upload contents of `dist/` folder to your hosting `htdocs/` directory.

### 4. Create .env File
Ensure `backend/.env` exists with your database credentials:

```env
DB_HOST=sql308.infinityfree.com
DB_NAME=if0_42963205_efashionbd
DB_USER=if0_42963205
DB_PASS=hrYV7cuoACRx
```

### 5. Test Admin Access
1. Go to: `https://efashionbd.rf.gd/admin/login`
2. Login with: `mk.rabbani.cse@gmail.com` / `sup123456123`
3. Verify dashboard loads correctly
4. Test navigation between tabs
5. Test logout functionality

## Troubleshooting

### Login Issues

**Problem:** "Invalid email or password"
- **Solution:** Verify database credentials in `.env` file
- **Solution:** Check if admin_users table exists in database
- **Solution:** Verify admin user was inserted correctly

**Problem:** "Database error"
- **Solution:** Check database connection settings
- **Solution:** Verify MySQL server is accessible
- **Solution:** Check database permissions

### Dashboard Issues

**Problem:** Dashboard shows no data
- **Solution:** Check if products/orders exist in database
- **Solution:** Verify API endpoints are accessible
- **Solution:** Check browser console for JavaScript errors

**Problem:** API requests failing
- **Solution:** Check CORS configuration
- **Solution:** Verify session is active
- **Solution:** Check API URL in environment variables

### Session Issues

**Problem:** Automatically logged out
- **Solution:** Check PHP session configuration
- **Solution:** Verify session cookie settings
- **Solution:** Check session timeout settings

## File Structure

### Backend
```
backend/
├── api/
│   ├── admin_login.php          # Authentication endpoints
│   ├── admin_dashboard.php     # Dashboard endpoints
│   ├── cart.php
│   ├── categories.php
│   └── products.php
├── config/
│   └── database.php            # Database connection
├── includes/
│   └── cors.php                # CORS configuration
├── database_infinityfree.sql   # Database schema (updated)
├── .env                        # Database credentials
└── .htaccess                   # URL rewriting
```

### Frontend
```
src/
├── context/
│   ├── AdminContext.tsx        # Admin authentication context
│   └── ShopContext.tsx         # Shop context
├── pages/
│   ├── AdminLoginPage.tsx      # Login page
│   ├── AdminDashboardPage.tsx  # Dashboard page
│   └── [other pages...]
└── App.tsx                     # Main app with admin routes
```

## Customization

### Adding New Admin Users

1. Generate password hash:
```bash
cd backend
php -r "echo password_hash('your_password', PASSWORD_DEFAULT);"
```

2. Insert into database:
```sql
INSERT INTO admin_users (email, password, name, is_active) 
VALUES ('new_admin@example.com', '$2y$12$generated_hash', 'New Admin', TRUE);
```

### Changing Admin Credentials

1. Generate new password hash
2. Update in database:
```sql
UPDATE admin_users SET password = '$2y$12$new_hash' WHERE email = 'mk.rabbani.cse@gmail.com';
```

### Adding New Dashboard Features

1. Add new endpoint in `backend/api/admin_dashboard.php`
2. Add corresponding API call in frontend
3. Update dashboard UI in `src/pages/AdminDashboardPage.tsx`

## Best Practices

### Security
- ✅ Never commit `.env` files to version control
- ✅ Use strong, unique passwords
- ✅ Keep PHP and dependencies updated
- ✅ Implement rate limiting for login attempts
- ✅ Use HTTPS in production
- ✅ Regular security audits

### Performance
- ✅ Implement database query optimization
- ✅ Use pagination for large datasets
- ✅ Cache frequently accessed data
- ✅ Optimize images and assets
- ✅ Monitor server resources

### Maintenance
- ✅ Regular database backups
- ✅ Monitor error logs
- ✅ Update admin credentials periodically
- ✅ Test functionality after updates
- ✅ Keep documentation updated

## Support

For issues or questions:
1. Check this guide for common solutions
2. Review error logs in cPanel
3. Test API endpoints individually
4. Verify database connection
5. Check browser console for errors

Your admin dashboard is now fully functional with secure authentication and complete database integration! 🚀
