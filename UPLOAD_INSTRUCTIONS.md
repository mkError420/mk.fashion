# Quick Upload Instructions for InfinityFree

## Your Database Credentials
```
MySQL DB Name: if0_42963205_efashionbd
MySQL User Name: if0_42963205
MySQL Password: hrYV7cuoACRx
MySQL Host Name: sql308.infinityfree.com
Site URL: https://efashionbd.rf.gd/
```

## Step 1: Database Setup (5 minutes)

1. Log in to your InfinityFree cPanel
2. Go to "MySQL Databases" or "phpMyAdmin"
3. Select database: `if0_42963205_efashionbd`
4. Click "Import" tab
5. Upload file: `backend/database_infinityfree.sql` (Use this file - it's optimized for InfinityFree)
6. Click "Go"

✅ **Database is now ready with sample data**

**Note:** Use `database_infinityfree.sql` instead of `database.sql` because InfinityFree doesn't allow creating new databases - you can only use the pre-assigned database.

## Step 2: Backend Upload (10 minutes)

### Files to Upload:
Upload the entire `backend/` folder to your hosting:

**Backend folder structure:**
```
backend/
├── api/
│   ├── cart.php
│   ├── categories.php
│   ├── category.php
│   ├── orders.php
│   ├── product.php
│   └── products.php
├── config/
│   └── database.php
├── includes/
│   └── cors.php
├── .env (CREATE THIS FILE)
├── .htaccess
├── database_infinityfree.sql (optional - can skip)
├── index.php
└── README.md (optional)
```

### Create .env File:
Create a new file called `.env` in the `backend/` folder with this content:

```env
DB_HOST=sql308.infinityfree.com
DB_NAME=if0_42963205_efashionbd
DB_USER=if0_42963205
DB_PASS=hrYV7cuoACRx
```

### Upload Methods:

**Option A: cPanel File Manager**
1. Log in to cPanel → File Manager
2. Go to `public_html/` folder
3. Create `backend/` folder
4. Upload all backend files
5. Create `.env` file with the content above
6. Set `.env` file permissions to 644

**Option B: FTP (FileZilla)**
1. Connect to your InfinityFree FTP
2. Navigate to `public_html/`
3. Upload the entire `backend/` folder
4. Create `.env` file with the content above

## Step 3: Frontend Build & Upload (10 minutes)

### Build Frontend Locally:
```bash
npm run build
```

### Upload Frontend:
Upload contents of `dist/` folder to `public_html/`:

**Frontend files to upload:**
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── [other asset files]
└── .htaccess (CREATE THIS FILE)
```

### Create Root .htaccess:
Create `.htaccess` in `public_html/` (root) with:

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

## Step 4: Test Everything (5 minutes)

### Test Backend API:
Open these URLs in your browser:

- `https://efashionbd.rf.gd/backend/` - Should show API info
- `https://efashionbd.rf.gd/backend/api/categories.php` - Should show categories JSON
- `https://efashionbd.rf.gd/backend/api/products.php` - Should show products JSON

### Test Frontend:
- Open: `https://efashionbd.rf.gd/`
- Homepage should load
- Products should display
- Try adding to cart
- Try checkout process

## Troubleshooting

### Backend shows 500 error:
- Check `.env` file exists in `backend/` folder
- Verify database credentials are correct
- Check file permissions (644 for files, 755 for folders)

### Frontend shows blank page:
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Check `.htaccess` exists in root

### Products not loading:
- Test backend API directly
- Check database has data
- Verify API URL is correct

### CORS errors:
- Verify `backend/includes/cors.php` exists
- Check CORS headers in browser network tab

## File Permissions

Set these permissions in File Manager:

- PHP files: 644
- Folders: 755
- `.env` file: 644
- `.htaccess` files: 644

## Security Notes

⚠️ **Important Security:**
- `.env` file contains database credentials
- Ensure `.env` is NOT accessible via browser
- The `.htaccess` in backend folder already protects it
- Never commit `.env` to git

## Quick Verification

After upload, test these commands in browser console:

```javascript
// Test API connection
fetch('https://efashionbd.rf.gd/backend/api/products.php')
  .then(r => r.json())
  .then(data => console.log('Products:', data.length));
```

## What's Next?

Your site should now be live at: `https://efashionbd.rf.gd/`

For detailed documentation, see:
- `CPANEL_DEPLOYMENT.md` - Complete deployment guide
- `BACKEND_SETUP.md` - Backend API documentation
- `backend/README.md` - API endpoint documentation

## Support

If you encounter issues:
1. Check cPanel error logs
2. Test API endpoints individually
3. Verify database connection in phpMyAdmin
4. Review the troubleshooting section above

Your e-commerce platform is now ready to go live! 🚀
