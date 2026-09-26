-- Additional tables for Admin Dashboard features
-- Add to existing database: if0_42963205_efashionbd

USE if0_42963205_efashionbd;

-- Banners feature removed (Hero Video is used instead)
DROP TABLE IF EXISTS banners;

-- Promocodes table
CREATE TABLE IF NOT EXISTS promocodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_order_value DECIMAL(10, 2) DEFAULT 0,
    maximum_discount DECIMAL(10, 2) DEFAULT NULL,
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATETIME,
    end_date DATETIME,
    applicable_categories TEXT, -- JSON array of category IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Insert sample promocodes
INSERT INTO promocodes (code, description, discount_type, discount_value, minimum_order_value, usage_limit, is_active, start_date, end_date) VALUES
('SUMMER20', '20% off on summer collection', 'percentage', 20.00, 1000.00, 100, TRUE, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('FLAT500', 'Flat 500 TK off on orders above 2000', 'fixed', 500.00, 2000.00, 50, TRUE, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('NEW10', '10% off for new customers', 'percentage', 10.00, 500.00, 200, TRUE, '2024-01-01 00:00:00', '2024-12-31 23:59:59');

-- Insert sample settings
INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'Blucheez Fashion', 'text', 'general', 'Website name'),
('site_description', 'Modern Lifestyle & Heritage Atelier', 'text', 'general', 'Site description'),
('contact_email', 'support@blucheez.fashion', 'text', 'contact', 'Contact email'),
('contact_phone', '09613-258248', 'text', 'contact', 'Contact phone'),
('whatsapp_number', '+8801XXXXXXXXX', 'text', 'contact', 'WhatsApp number for concierge'),
('currency', 'BDT', 'text', 'general', 'Currency code'),
('currency_symbol', '৳', 'text', 'general', 'Currency symbol'),
('enable_cod', '1', 'boolean', 'payment', 'Enable Cash on Delivery'),
('cod_charge_inside_dhaka', '60', 'number', 'shipping', 'COD charge inside Dhaka'),
('cod_charge_outside_dhaka', '120', 'number', 'shipping', 'COD charge outside Dhaka'),
('free_shipping_minimum', '3000', 'number', 'shipping', 'Minimum order for free shipping'),
('announcement_text', 'Cash on Delivery Available Nationwide • 100% Cotton • Fast Delivery', 'text', 'general', 'Top announcement bar text'),
('social_facebook', 'https://facebook.com/blucheez', 'text', 'social', 'Facebook page URL'),
('social_instagram', 'https://instagram.com/blucheez', 'text', 'social', 'Instagram page URL'),
('social_youtube', 'https://youtube.com/blucheez', 'text', 'social', 'YouTube channel URL'),
('hero_video_url', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'text', 'hero_video', 'Primary MP4 video URL displayed in the homepage hero banner'),
('hero_video_fallback_url', 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-39875-large.mp4', 'text', 'hero_video', 'Fallback MP4 video URL if primary source fails'),
('hero_video_poster', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85', 'text', 'hero_video', 'Poster image URL shown while video loads'),
('hero_video_badge', 'FESTIVE EDITORIAL 2026', 'text', 'hero_video', 'Optional top badge or seasonal tag'),
('hero_video_title', 'THE ART OF DEMI-COUTURE', 'text', 'hero_video', 'Hero overlay headline'),
('hero_video_subtitle', 'Handcrafted Heritage • Luxury Fabrics • Modern Silhouette', 'text', 'hero_video', 'Hero overlay subtitle / description'),
('hero_video_button_text', 'EXPLORE COLLECTION', 'text', 'hero_video', 'Call to action button text'),
('hero_video_button_link', '/shop', 'text', 'hero_video', 'Destination URL when CTA button is clicked'),
('hero_video_overlay_darkness', '20', 'text', 'hero_video', 'Dark tint overlay percentage (0, 20, 40, 60)'),
('hero_video_autoplay', '1', 'boolean', 'hero_video', 'Whether video autoplays on load'),
('hero_video_loop', '1', 'boolean', 'hero_video', 'Whether video loops continuously'),
('hero_video_muted', '1', 'boolean', 'hero_video', 'Whether video starts muted'),
('hero_video_enabled', '1', 'boolean', 'hero_video', 'Toggle Homepage Hero Video banner on or off');