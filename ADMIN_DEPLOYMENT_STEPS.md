# Admin Dashboard Deployment for Live Site

Your site is live at: `https://efashionbd.rf.gd/`

## Configuration Updated ✅

All API endpoints now point to your live production backend:
- **API URL:** `https://efashionbd.rf.gd/backend/api`
- **Database:** Already configured with your InfinityFree credentials

## Quick Deployment Steps

### 1. Update Database

Import the updated database schema to add the admin users table:

1. Log in to your InfinityFree cPanel
2. Go to phpMyAdmin
3. Select database: `if0_42963205_efashionbd`
4. Click "Import" tab
5. Upload: `backend/database_infinityfree.sql`
6. Click "Go"

This will create the `admin_users` table with your admin account.

### 2. Upload Backend Files

Upload these new files to your hosting `htdocs/backend/` folder:

**New Files:**
- `backend/api/admin_login.php`
- `backend/api/admin_dashboard.php`

**Updated Files:**
- `backend/config/database.php` (has production defaults)
- `backend/.htaccess` (enhanced security)

### 3. Create Backend .env File

In cPanel File Manager, go to `htdocs/backend/` and create `.env` file:

```env
DB_HOST=sql308.infinityfree.com
DB_NAME=if0_42963205_efashionbd
DB_USER=if0_42963205
DB_PASS=hrYV7cuoACRx
```

Set file permissions to 644.

### 4. Upload Frontend

Upload the newly built frontend files to `htdocs/`:

**From local `dist/` folder, upload:**
- `index.html` (replace existing)
- `assets/index-DSjVJesN.css` (replace existing)
- `assets/index-DF05AiVo.js` (replace existing)
- Keep other assets as they are

### 5. Test Admin Access

1. Go to: `https://efashionbd.rf.gd/admin/login`
2. Login with:
   - **Email:** `mk.rabbani.cse@gmail.com`
   - **Password:** `sup123456123`
3. You should be redirected to: `https://efashionbd.rf.gd/admin/dashboard`

## What's Now Configured

### ✅ Production API URL
All API calls now use: `https://efashionbd.rf.gd/backend/api`

### ✅ Database Connection
Your InfinityFree database credentials are configured

### ✅ Admin Authentication
- Secure login with session management
- Password hashing with bcrypt
- Session-based authentication

### ✅ Dashboard Features
- Real-time statistics from your live database
- Order management
- Product management
- Customer management

## File Upload Summary

### Backend Files to Upload:
```
htdocs/backend/
├── api/
│   ├── admin_login.php          # NEW
│   ├── admin_dashboard.php     # NEW
│   ├── cart.php                # (existing)
│   ├── categories.php          # (existing)
│   ├── category.php            # (existing)
│   ├── orders.php              # (existing)
│   ├── product.php             # (existing)
│   └── products.php            # (existing)
├── config/
│   └── database.php            # UPDATED
├── includes/
│   └── cors.php                # (existing)
├── .env                        # CREATE THIS
├── .htaccess                   # UPDATED
└── index.php                  # (existing)
```

### Frontend Files to Upload:
```
htdocs/
├── index.html                 # REPLACE
└── assets/
    ├── index-DSjVJesN.css     # REPLACE
    ├── index-DF05AiVo.js      # REPLACE
    └── [other assets]         # KEEP AS IS
```

## Testing Checklist

After deployment, test these:

- [ ] Frontend loads at `https://efashionbd.rf.gd/`
- [ ] Products load from database
- [ ] Admin login page loads at `/admin/login`
- [ ] Can login with provided credentials
- [ ] Dashboard loads with statistics
- [ ] Can navigate between tabs
- [ ] Logout functionality works
- [ ] Cart functionality works
- [ ] Order placement works

## Troubleshooting

### Admin Login Not Working

**Problem:** "Invalid email or password"
- Check if `admin_users` table exists in database
- Verify `.env` file exists in `backend/` folder
- Check database credentials in `.env`

**Problem:** "Database error"
- Verify database connection settings
- Check if MySQL server is accessible
- Test database connection in phpMyAdmin

### Dashboard Not Loading Data

**Problem:** No statistics showing
- Check if backend API is accessible
- Test: `https://efashionbd.rf.gd/backend/api/admin_dashboard.php?action=stats`
- Check browser console for errors
- Verify session is active

### Frontend Not Connecting

**Problem:** API requests failing
- Check API URL in built files
- Verify CORS configuration
- Test API endpoints directly in browser

## Admin Access URLs

- **Login:** `https://efashionbd.rf.gd/admin/login`
- **Dashboard:** `https://efashionbd.rf.gd/admin/dashboard`
- **Main Site:** `https://efashionbd.rf.gd/`

## Security Notes

⚠️ **Important:**
- `.env` file contains database credentials
- Ensure `.env` is protected by `.htaccess`
- Never commit `.env` to version control
- Use strong passwords
- Keep admin credentials secure

## Support

If you encounter issues:
1. Check browser console for errors
2. Test API endpoints individually
3. Verify database connection in phpMyAdmin
4. Check file permissions
5. Review error logs in cPanel

Your admin dashboard is now configured for your live production site! 🚀
