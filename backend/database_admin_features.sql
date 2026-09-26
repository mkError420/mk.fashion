-- Additional tables for Admin Dashboard features
-- Add to existing database: if0_42963205_efashionbd

USE if0_42963205_efashionbd;

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

-- Insert sample banners
INSERT INTO banners (title, description, image_url, link_url, position, is_active) VALUES
('Summer Collection 2026', 'Discover our latest summer collection with exclusive designs', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200', '/shop/summer', 1, TRUE),
('Blucheez Black Exclusive', 'Premium black collection for the modern gentleman', 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1200', '/shop/blucheez-black', 2, TRUE),
('Traditional Belwari', 'Authentic handloom Belwari sarees and attire', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200', '/shop/belwari', 3, TRUE);

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
('social_youtube', 'https://youtube.com/blucheez', 'text', 'social', 'YouTube channel URL');