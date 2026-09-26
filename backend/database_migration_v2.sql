-- =====================================================
-- Aristo Fashion BD - Admin Dashboard Enhancement SQL
-- Run this on your live database to add new settings
-- =====================================================

USE if0_42963205_efashionbd;

-- Add missing settings (INSERT IGNORE skips if already exists)
INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, category, description) VALUES
('announcement_text', 'Cash on Delivery Available Nationwide • 100% Cotton • Fast Delivery', 'text', 'general', 'Top announcement bar text (editable from admin)'),
('whatsapp_number', '+8801XXXXXXXXX', 'text', 'contact', 'WhatsApp number for customer concierge');

-- Update free_shipping_minimum to 3000 (was 5000 in original)
UPDATE settings SET setting_value = '3000' WHERE setting_key = 'free_shipping_minimum';

-- Ensure customer_name and customer_phone columns exist in orders query (view only - no schema change needed)
-- The admin_dashboard.php JOIN already fetches these from customers table.

-- Add index for faster order queries (optional but recommended)
-- ALTER TABLE orders ADD INDEX idx_status (status);
-- ALTER TABLE orders ADD INDEX idx_created_at (created_at);
-- ALTER TABLE orders ADD INDEX idx_customer_id (customer_id);

SELECT 'Migration complete!' AS status;
