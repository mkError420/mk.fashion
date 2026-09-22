# Admin Dashboard Troubleshooting Guide

## Current Error Analysis

**Error:** `GET https://efashionbd.rf.gd/backend/api/admin_login.php 401 (Unauthorized)`

This error indicates that the backend API is either:
1. Not properly uploaded to the server
2. Database connection is failing
3. Admin users table doesn't exist
4. Session configuration issue

## Step-by-Step Troubleshooting

### Step 1: Verify Backend Files Are Uploaded

Check if these files exist on your server:

**Required Files:**
```
htdocs/backend/api/admin_login.php
htdocs/backend/api/admin_dashboard.php
htdocs/backend/config/database.php
htdocs/backend/.env
```

**Action:** Login to cPanel File Manager and verify these files exist in the correct locations.

### Step 2: Test Backend API Directly

Open these URLs in your browser to test if the backend is working:

1. **Test API Root:**
   ```
   https://efashionbd.rf.gd/backend/
   ```
   Should show API information

2. **Test Admin Login (GET):**
   ```
   https://efashionbd.rf.gd/backend/api/admin_login.php
   ```
   Should return: `{"authenticated":false,"message":"Not authenticated"}`

3. **Test Categories:**
   ```
   https://efashionbd.rf.gd/backend/api/categories.php
   ```
   Should return categories JSON

**If any of these fail to load or show errors, the backend files are not properly uploaded.**

### Step 3: Check Database Configuration

Verify the `htdocs/backend/.env` file exists and contains:

```env
DB_HOST=sql308.infinityfree.com
DB_NAME=if0_42963205_efashionbd
DB_USER=if0_42963205
DB_PASS=hrYV7cuoACRx
```

**Action:** In cPanel File Manager, check if `.env` file exists in `htdocs/backend/` and has correct content.

### Step 4: Verify Database and Admin User Table

1. Log in to phpMyAdmin in cPanel
2. Select database: `if0_42963205_efashionbd`
3. Check if `admin_users` table exists
4. Run this SQL query to verify admin user exists:

```sql
SELECT * FROM admin_users WHERE email = 'mk.rabbani.cse@gmail.com';
```

**Expected Result:** Should return 1 row with the admin user.

**If table doesn't exist:**
1. Import `backend/database_infinityfree.sql` in phpMyAdmin
2. This will create the admin_users table with your admin account

### Step 5: Check PHP Error Logs

In cPanel:
1. Go to "Error Logs" or "Raw Access Logs"
2. Look for recent errors related to admin_login.php
3. Common errors to look for:
   - Database connection errors
   - File not found errors
   - Permission errors

### Step 6: Test Database Connection

Create a test file to verify database connection:

**Create:** `htdocs/backend/test_connection.php`

```php
<?php
try {
    $host = 'sql308.infinityfree.com';
    $dbname = 'if0_42963205_efashionbd';
    $username = 'if0_42963205';
    $password = 'hrYV7cuoACRx';

    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Database connection successful!<br>";
    
    // Test admin_users table
    $stmt = $pdo->query("SELECT COUNT(*) FROM admin_users");
    $count = $stmt->fetchColumn();
    echo "Admin users count: $count<br>";
    
    // Test products table
    $stmt = $pdo->query("SELECT COUNT(*) FROM products");
    $count = $stmt->fetchColumn();
    echo "Products count: $count<br>";
    
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
```

**Access:** `https://efashionbd.rf.gd/backend/test_connection.php`

This will tell you if the database connection is working.

## Common Issues and Solutions

### Issue 1: Backend Files Not Uploaded

**Symptoms:** 404 errors when accessing backend URLs

**Solution:**
1. Upload these files to `htdocs/backend/`:
   - `api/admin_login.php`
   - `api/admin_dashboard.php`
   - `config/database.php`
   - `.env` file with database credentials

### Issue 2: Database Connection Failed

**Symptoms:** Database connection errors in logs

**Solution:**
1. Verify database credentials in `.env` file
2. Check if MySQL server is accessible
3. Test connection using test_connection.php

### Issue 3: Admin Users Table Missing

**Symptoms:** Authentication works but no admin user found

**Solution:**
1. Import `backend/database_infinityfree.sql` in phpMyAdmin
2. Verify admin_users table exists
3. Check admin user was inserted correctly

### Issue 4: File Permissions

**Symptoms:** 403 Forbidden errors

**Solution:**
1. Set PHP files to 644 permissions
2. Set directories to 755 permissions
3. Ensure `.env` file is 644

### Issue 5: Session Issues

**Symptoms:** Authentication works but session not persisting

**Solution:**
1. Check PHP session configuration
2. Verify session.save_path is writable
3. Check browser cookie settings

## Quick Fix Checklist

Use this checklist to systematically fix the issue:

- [ ] Backend files uploaded to correct location
- [ ] `.env` file exists with correct database credentials
- [ ] Database connection test successful
- [ ] Admin users table exists in database
- [ ] Admin user account exists with correct credentials
- [ ] File permissions are correct (644 for files, 755 for dirs)
- [ ] PHP error logs show no database connection errors
- [ ] API endpoints return proper JSON responses
- [ ] CORS headers are properly configured

## Expected API Responses

### GET /backend/api/admin_login.php
**Not Logged In:**
```json
{
  "authenticated": false,
  "message": "Not authenticated"
}
```

### POST /backend/api/admin_login.php
**Successful Login:**
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

**Failed Login:**
```json
{
  "message": "Invalid email or password"
}
```

### GET /backend/api/admin_dashboard.php?action=stats
**Authenticated:**
```json
{
  "stats": {
    "totalProducts": 6,
    "totalOrders": 0,
    "totalRevenue": 0,
    "pendingOrders": 0
  },
  "recentOrders": []
}
```

## Next Steps

1. **Test Backend First:** Before testing the frontend, ensure all backend API endpoints work
2. **Use Browser DevTools:** Check Network tab to see exact API responses
3. **Check Console:** Look for JavaScript errors that might give more details
4. **Test Step by Step:** Test login, then dashboard, then other features

## If All Else Fails

If you've tried all the above and still have issues:

1. **Check InfinityFree Status:** Ensure your hosting account is active
2. **Verify Domain:** Ensure `efashionbd.rf.gd` is pointing to correct server
3. **Contact Support:** If database connection issues persist, contact InfinityFree support

## Most Likely Cause

Based on the 401 error, the most likely issues are:

1. **Backend files not uploaded** - admin_login.php doesn't exist on server
2. **Database not configured** - .env file missing or incorrect
3. **Admin table missing** - Database not updated with admin_users table

Start with verifying the backend files are uploaded, then test the database connection.
