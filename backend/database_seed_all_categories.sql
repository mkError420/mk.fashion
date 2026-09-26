-- =========================================================================
-- Aristo Fashion BD - Complete Frontend Categories & Subcategories Seed
-- Run this in phpMyAdmin on your database: if0_42963205_efashionbd
-- =========================================================================

USE if0_42963205_efashionbd;

-- 1. Insert Parent / Top-Level Categories
INSERT IGNORE INTO categories (name, slug, description, parent_id) VALUES
('NEW IN', 'new-in', 'Latest arrivals, Eid & Festive Drop 2026', NULL),
('SUMMER', 'summer', 'Summer Breeze Collection and breathable knitwear', NULL),
('BLUCHEEZ | BLACK', 'blucheez-black', 'The Monochrome Atelier & Luxury Society Label', NULL),
('BELWARI', 'belwari', 'Handcrafted Heritage Handloom & Royal Ethnic', NULL),
('MEN', 'men', 'The Modern Gentleman - Panjabi, Shirts, Polos, & Pants', NULL),
('WOMEN', 'women', 'Graceful Elegance - Festive, Kurtis, Sarees, & Western', NULL),
('ACCESSORIES', 'accessories', 'Curated Essentials, Caps, Eyewear, Leather Belts & Fragrances', NULL);

-- 2. Insert Subcategories under 'NEW IN'
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Essential Panjabi', 'new-in-essential-panjabi', 'Essential Panjabi in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Exclusive Panjabi', 'new-in-exclusive-panjabi', 'Exclusive Panjabi in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Formal Shirts', 'new-in-formal-shirts', 'Formal Shirts in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Polo Shirts', 'new-in-polo-shirts', 'Polo Shirts in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Waistcoats', 'new-in-waistcoats', 'Waistcoats in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Belwari Jamdani Sarees', 'new-in-belwari-jamdani-sarees', 'Belwari Jamdani Sarees in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Embroidered Kurti Sets', 'new-in-embroidered-kurti-sets', 'Embroidered Kurti Sets in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Two-Piece Kurti', 'new-in-two-piece-kurti', 'Two-Piece Kurti in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Three-Piece Kurti', 'new-in-three-piece-kurti', 'Three-Piece Kurti in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Anarkali', 'new-in-anarkali', 'Anarkali in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Blucheez Black Label', 'new-in-blucheez-black-label', 'Blucheez Black Label in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Belwari Signature', 'new-in-belwari-signature', 'Belwari Signature in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Summer Polos', 'new-in-summer-polos', 'Summer Polos in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Fragrances', 'new-in-fragrances', 'Fragrances in NEW IN', id FROM categories WHERE slug = 'new-in' LIMIT 1;

-- 3. Insert Subcategories under 'SUMMER'
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Sweater Polos', 'summer-sweater-polos', 'Sweater Polos in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Boxy-Fit Drop Shoulder Polos', 'summer-boxy-fit-drop-shoulder-polos', 'Boxy-Fit Drop Shoulder Polos in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Classic Polos', 'summer-classic-polos', 'Classic Polos in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Drop Shoulder T-Shirt', 'summer-drop-shoulder-t-shirt', 'Drop Shoulder T-Shirt in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Oversized T-Shirt', 'summer-oversized-t-shirt', 'Oversized T-Shirt in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Lawn Cotton Panjabi', 'summer-lawn-cotton-panjabi', 'Lawn Cotton Panjabi in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Short Sleeve Panjabi', 'summer-short-sleeve-panjabi', 'Short Sleeve Panjabi in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Cotton Pajama', 'summer-cotton-pajama', 'Cotton Pajama in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Breathable Kurtis', 'summer-breathable-kurtis', 'Breathable Kurtis in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Casual Shirts', 'summer-casual-shirts', 'Casual Shirts in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Relaxed Wear', 'summer-relaxed-wear', 'Relaxed Wear in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Shorts', 'summer-shorts', 'Shorts in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Cotton Chinos', 'summer-cotton-chinos', 'Cotton Chinos in SUMMER', id FROM categories WHERE slug = 'summer' LIMIT 1;

-- 4. Insert Subcategories under 'BLUCHEEZ | BLACK'
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Panjabi | Black', 'blucheez-black-panjabi-black', 'Panjabi | Black in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Executive Wool Blazers', 'blucheez-black-executive-wool-blazers', 'Executive Wool Blazers in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Tailored Black Shirts', 'blucheez-black-tailored-black-shirts', 'Tailored Black Shirts in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Slim Fit Black Trousers', 'blucheez-black-slim-fit-black-trousers', 'Slim Fit Black Trousers in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Black Zari Suits', 'blucheez-black-black-zari-suits', 'Black Zari Suits in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Draped Sarees', 'blucheez-black-draped-sarees', 'Draped Sarees in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Obsidian Cufflinks', 'blucheez-black-obsidian-cufflinks', 'Obsidian Cufflinks in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Italian Leather Belts', 'blucheez-black-italian-leather-belts', 'Italian Leather Belts in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Premium Noir Fragrance', 'blucheez-black-premium-noir-fragrance', 'Premium Noir Fragrance in BLUCHEEZ | BLACK', id FROM categories WHERE slug = 'blucheez-black' LIMIT 1;

-- 5. Insert Subcategories under 'BELWARI'
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Belwari Jamdani Saree', 'belwari-belwari-jamdani-saree', 'Belwari Jamdani Saree in BELWARI', id FROM categories WHERE slug = 'belwari' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Zari Embroidered Suit', 'belwari-zari-embroidered-suit', 'Zari Embroidered Suit in BELWARI', id FROM categories WHERE slug = 'belwari' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Artisan Silk Kurtis', 'belwari-artisan-silk-kurtis', 'Artisan Silk Kurtis in BELWARI', id FROM categories WHERE slug = 'belwari' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Heritage Zari Panjabi', 'belwari-heritage-zari-panjabi', 'Heritage Zari Panjabi in BELWARI', id FROM categories WHERE slug = 'belwari' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Two-Piece Salwar Kameez', 'belwari-two-piece-salwar-kameez', 'Two-Piece Salwar Kameez in BELWARI', id FROM categories WHERE slug = 'belwari' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Bridal & Reception Sets', 'belwari-bridal-reception-sets', 'Bridal & Reception Sets in BELWARI', id FROM categories WHERE slug = 'belwari' LIMIT 1;

-- 6. Insert Subcategories under 'MEN'
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Elegant Panjabi', 'men-elegant-panjabi', 'Elegant Panjabi in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Kabli Set', 'men-kabli-set', 'Kabli Set in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Pajama', 'men-pajama', 'Pajama in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Formal Shirt', 'men-formal-shirt', 'Formal Shirt in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Premium Shirt', 'men-premium-shirt', 'Premium Shirt in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Casual Shirt', 'men-casual-shirt', 'Casual Shirt in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Giza Cotton Shirt', 'men-giza-cotton-shirt', 'Giza Cotton Shirt in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Formal Pant', 'men-formal-pant', 'Formal Pant in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Casual Pant', 'men-casual-pant', 'Casual Pant in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Jeans', 'men-jeans', 'Jeans in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Slim-Fit Pajama', 'men-slim-fit-pajama', 'Slim-Fit Pajama in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Wide-Leg Pajama', 'men-wide-leg-pajama', 'Wide-Leg Pajama in MEN', id FROM categories WHERE slug = 'men' LIMIT 1;

-- 7. Insert Subcategories under 'WOMEN'
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Salwar Kameez', 'women-salwar-kameez', 'Salwar Kameez in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Dhakai Jamdani Saree', 'women-dhakai-jamdani-saree', 'Dhakai Jamdani Saree in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Western Tops', 'women-western-tops', 'Western Tops in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Tops & Tunics', 'women-tops-tunics', 'Tops & Tunics in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Denim Jeans', 'women-denim-jeans', 'Denim Jeans in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Wide Leg Pants', 'women-wide-leg-pants', 'Wide Leg Pants in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Seasonal Apparel', 'women-seasonal-apparel', 'Seasonal Apparel in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Belwari Heritage Sarees', 'women-belwari-heritage-sarees', 'Belwari Heritage Sarees in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Designer Party Kurtis', 'women-designer-party-kurtis', 'Designer Party Kurtis in WOMEN', id FROM categories WHERE slug = 'women' LIMIT 1;

-- 8. Insert Subcategories under 'ACCESSORIES'
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Caps', 'accessories-caps', 'Caps in ACCESSORIES', id FROM categories WHERE slug = 'accessories' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Eyewear', 'accessories-eyewear', 'Eyewear in ACCESSORIES', id FROM categories WHERE slug = 'accessories' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Fragrances (Men & Women)', 'accessories-fragrances', 'Fragrances in ACCESSORIES', id FROM categories WHERE slug = 'accessories' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Genuine Leather Belts', 'accessories-genuine-leather-belts', 'Genuine Leather Belts in ACCESSORIES', id FROM categories WHERE slug = 'accessories' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Wallets', 'accessories-wallets', 'Wallets in ACCESSORIES', id FROM categories WHERE slug = 'accessories' LIMIT 1;
INSERT IGNORE INTO categories (name, slug, description, parent_id)
SELECT 'Cufflinks', 'accessories-cufflinks', 'Cufflinks in ACCESSORIES', id FROM categories WHERE slug = 'accessories' LIMIT 1;

SELECT 'All frontend categories and subcategories inserted successfully!' AS status;
