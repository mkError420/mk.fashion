# cPanel Deployment Guide - InfinityFree

This guide explains how to deploy your Aristo Fashion BD e-commerce platform to InfinityFree hosting with cPanel.

## Prerequisites

- InfinityFree hosting account
- cPanel access
- FTP access or File Manager
- MySQL database credentials (provided below)

## Database Credentials

```
MySQL DB Name: if0_42963205_efashionbd
MySQL User Name: if0_42963205
MySQL Password: hrYV7cuoACRx
MySQL Host Name: sql308.infinityfree.com
Site URL: https://efashionbd.rf.gd/
```

## Step 1: Database Setup

### 1.1 Access phpMyAdmin

1. Log in to your InfinityFree cPanel
2. Navigate to "MySQL Databases" or "phpMyAdmin"
3. Access phpMyAdmin using your credentials

### 1.2 Import Database Schema

1. In phpMyAdmin, select the database `if0_42963205_efashionbd`
2. Click on "Import" tab
3. Choose the `backend/database_infinityfree.sql` file from your local project
4. Click "Go" to import the schema and sample data

**Important:** Use `database_infinityfree.sql` instead of `database.sql` because InfinityFree doesn't allow creating new databases. The infinityfree version is optimized for your hosting environment.

**Alternative: Manual SQL Import**
```sql
-- You can also copy the contents of backend/database_infinityfree.sql
-- and paste it in the SQL tab of phpMyAdmin
```

### 1.3 Verify Database

After import, verify that the following tables exist:
- categories
- products
- product_images
- product_sizes
- customers
- orders
- order_items
- cart

## Step 2: Backend Deployment

### 2.1 Upload Backend Files

**Option A: Using File Manager**
1. Log in to cPanel File Manager
2. Navigate to `public_html` or `htdocs` folder
3. Create a folder called `backend`
4. Upload all files from your local `backend` folder to `backend/`

**Option B: Using FTP**
1. Use FileZilla or similar FTP client
2. Connect to your InfinityFree FTP account
3. Navigate to `public_html` or `htdocs`
4. Upload the entire `backend` folder

### 2.2 Configure Backend Database

1. In File Manager, go to `backend/` folder
2. Create a new file called `.env` (or edit if exists)
3. Add the following content:

```env
DB_HOST=sql308.infinityfree.com
DB_NAME=if0_42963205_efashionbd
DB_USER=if0_42963205
DB_PASS=hrYV7cuoACRx
```

### 2.3 Set File Permissions

Important: Set correct permissions for security:

1. Right-click on `backend/.env` → Change Permissions
2. Set to `644` (Owner: Read/Write, Group: Read, World: Read)
3. Set `backend/config/` folder to `755`
4. Set PHP files to `644`

### 2.4 Test Backend API

Access the following URLs to test your backend:

- `https://efashionbd.rf.gd/backend/` - Should show API info
- `https://efashionbd.rf.gd/backend/api/categories.php` - Should return categories
- `https://efashionbd.rf.gd/backend/api/products.php` - Should return products

## Step 3: Frontend Deployment

### 3.1 Build Frontend for Production

On your local machine:

```bash
# Build the frontend
npm run build

# This creates a 'dist' folder with optimized files
```

### 3.2 Upload Frontend Files

**Option A: Using File Manager**
1. In cPanel File Manager, navigate to `public_html` or `htdocs`
2. Upload all contents from the local `dist/` folder
3. Make sure `index.html` is in the root directory

**Option B: Using FTP**
1. Connect via FTP
2. Navigate to `public_html` or `htdocs`
3. Upload all contents from `dist/` folder

### 3.3 Configure Frontend API URL

The frontend needs to know the backend API URL. Since we've already updated `.env.example`, you need to ensure the build uses the correct URL.

**If you need to change the API URL after build:**

1. In the uploaded `dist/` folder, find the JavaScript files (usually in `dist/assets/`)
2. The API URL might be hardcoded in the build
3. For production, the URL should be: `https://efashionbd.rf.gd/backend/api`

**Alternative: Set environment variable before build**

```bash
# On your local machine before building
set VITE_API_URL=https://efashionbd.rf.gd/backend/api
npm run build
```

Then upload the new build.

## Step 4: Configure .htaccess for Frontend

Create/Edit `.htaccess` in the root directory (`public_html/.htaccess`):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures React Router works correctly on your hosting.

## Step 5: Verify Deployment

### 5.1 Test Frontend

Access: `https://efashionbd.rf.gd/`

- Homepage should load
- Navigation should work
- Products should display (loaded from backend)

### 5.2 Test Backend API

Test these endpoints in your browser or using curl:

```bash
# Test categories
curl https://efashionbd.rf.gd/backend/api/categories.php

# Test products
curl https://efashionbd.rf.gd/backend/api/products.php

# Test specific product
curl https://efashionbd.rf.gd/backend/api/product.php?id=1
```

### 5.3 Test Functionality

- Browse products
- Add items to cart
- Proceed to checkout
- Place a test order

## Step 6: Security Measures

### 6.1 Protect Sensitive Files

Ensure `.env` file is not accessible via browser:

Add this to `backend/.htaccess`:

```apache
<Files .env>
  Order allow,deny
  Deny from all
</Files>
```

### 6.2 Database Security

- ✅ Database credentials are already configured
- ✅ Using PDO with prepared statements (SQL injection protection)
- ⚠️ Consider implementing IP restriction for database access
- ⚠️ Use HTTPS only (already enabled on InfinityFree)

### 6.3 File Permissions

Recommended permissions:
- PHP files: `644`
- Directories: `755`
- `.env` file: `644`
- Configuration files: `644`

## Troubleshooting

### Backend Not Working

**Issue: 500 Internal Server Error**
- Check PHP error logs in cPanel
- Verify database credentials in `.env`
- Ensure PDO MySQL extension is enabled
- Check file permissions

**Issue: Database Connection Failed**
- Verify database credentials
- Check if MySQL server is accessible
- Test connection using phpMyAdmin

**Issue: CORS Errors**
- Verify `backend/includes/cors.php` exists
- Check CORS headers are being sent
- Ensure frontend is calling correct API URL

### Frontend Not Working

**Issue: Blank Page**
- Check browser console for errors
- Verify all files were uploaded correctly
- Check `.htaccess` configuration
- Ensure `index.html` exists in root

**Issue: API Not Connecting**
- Verify backend API is accessible
- Check API URL in built files
- Test API endpoints directly in browser
- Check CORS configuration

**Issue: Routing Not Working**
- Verify `.htaccess` is configured correctly
- Check mod_rewrite is enabled on server
- Ensure React Router is properly configured

### Database Issues

**Issue: Tables Not Found**
- Verify database was imported correctly
- Check you're using the correct database name
- Re-import the schema if needed

**Issue: No Data Showing**
- Check if sample data was imported
- Verify products exist in database
- Test API endpoints directly

## InfinityFree Specific Notes

### Limitations

- **File Size**: InfinityFree has file size limits
- **Execution Time**: PHP scripts have time limits
- **Database Connections**: Limited concurrent connections
- **Storage**: Limited disk space

### Best Practices for InfinityFree

1. **Optimize Images**: Compress images before upload
2. **Minimize Files**: Remove unnecessary files
3. **Cache**: Implement browser caching
4. **Database**: Optimize queries and use indexes
5. **Monitor**: Check resource usage regularly

### Performance Optimization

1. **Enable Gzip Compression** (add to `.htaccess`):

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

2. **Set Browser Caching** (add to `.htaccess`):

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Maintenance

### Regular Tasks

1. **Monitor Database**: Check for unusual activity
2. **Backup Database**: Regular exports via phpMyAdmin
3. **Update Code**: Pull latest changes from GitHub
4. **Check Logs**: Review error logs regularly
5. **Test Functionality**: Regular testing of features

### Database Backup

1. Access phpMyAdmin
2. Select your database
3. Click "Export" tab
4. Choose "Quick" export method
5. Click "Go" to download backup

## Domain Configuration

Your site is already configured at: `https://efashionbd.rf.gd/`

If you want to use a custom domain:

1. Purchase domain from registrar
2. In InfinityFree panel, add addon domain
3. Update DNS settings at your registrar
4. Wait for DNS propagation (24-48 hours)

## Support

For InfinityFree-specific issues:
- Check InfinityFree forums
- Review InfinityFree documentation
- Contact InfinityFree support

For application issues:
- Check this deployment guide
- Review error logs
- Test API endpoints individually

## Post-Deployment Checklist

- [ ] Database imported successfully
- [ ] Backend API responding correctly
- [ ] Frontend loading properly
- [ ] Products displaying from database
- [ ] Cart functionality working
- [ ] Order placement working
- [ ] HTTPS working correctly
- [ ] File permissions set correctly
- [ ] .env file secured
- [ ] Error monitoring setup
- [ ] Backup procedures established

Your Aristo Fashion BD e-commerce platform is now live on InfinityFree!
