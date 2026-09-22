import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // MEN: PANJABI, KABLI, WAISTCOATS & SUITS
  // ==========================================
  {
    id: 'prod-1',
    name: 'Blucheez Exclusive Embroidered Panjabi',
    bengaliName: 'ব্লুচিজ এক্সক্লুসিভ এমব্রয়ডারি পাঞ্জাবি',
    category: 'men',
    subcategory: 'Exclusive Panjabi',
    gender: 'men',
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 142,
    sku: 'PAN-BLU-0102',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Blucheez Exclusive',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Deep Burgundy / Maroon', hex: '#800020' },
      { name: 'Royal Ivory', hex: '#fdfbf7' },
      { name: 'Imperial Navy', hex: '#0f172a' }
    ],
    fabric: '100% Fine Mercerized Egyptian Cotton with Jacquard Placket',
    fit: 'Semi-Fit Contemporary Cut',
    description: 'Blucheez signature Eid & Festive collection. Features intricate thread embroidery along the mandarin collar and hidden placket with metal snap buttons.',
    highlights: [
      'Authentic handloom thread embroidery with modern minimalist aesthetics',
      'Breathable all-weather mercerized cotton yarn',
      'Antimicrobial wash finish for lasting freshness',
      'Includes spare custom metallic crest buttons'
    ],
    careInstructions: [
      'Dry clean recommended for first wash',
      'Gentle hand wash in cold water with mild detergent',
      'Do not bleach or tumble dry',
      'Warm iron on reverse side of embroidery'
    ],
    inStock: true,
    stockCount: 28
  },
  {
    id: 'prod-2',
    name: 'Blucheez | Black Monochrome Tailored Panjabi',
    bengaliName: 'ব্লুচিজ ব্ল্যাক টেলর্ড পাঞ্জাবি',
    category: 'blucheez-black',
    subcategory: 'Panjabi | Black',
    gender: 'men',
    price: 3850,
    originalPrice: 4500,
    discountPercent: 14,
    rating: 4.95,
    reviewCount: 164,
    sku: 'PAN-BLK-9901',
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Black Label',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Jet Noir Black', hex: '#0a0a0a' }
    ],
    fabric: 'High-Twist Compact Cotton with Silk Satin Trim',
    fit: 'Tailored Slim Fit',
    description: 'From the Blucheez | Black Society archive. Minimalist matte black fabric with tonal black crystal button detailing and concealed side pockets.',
    highlights: [
      'Exclusive Black Society collection badge',
      'Tonal matte metal buttons',
      'Crisp high-definition mandarin collar'
    ],
    careInstructions: ['Dry clean only', 'Steam press'],
    inStock: true,
    stockCount: 35
  },
  {
    id: 'prod-3',
    name: 'Heritage Essential Kabli Set with Pajama',
    bengaliName: 'হেরিটেজ এসেনশিয়াল কাবলি সেট',
    category: 'men',
    subcategory: 'Kabli',
    gender: 'men',
    price: 4250,
    originalPrice: 4800,
    discountPercent: 12,
    rating: 4.85,
    reviewCount: 215,
    sku: 'KAB-BLU-3042',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Bestseller',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Jet Onyx Black', hex: '#111827' },
      { name: 'Earthy Olive', hex: '#3f4f3a' },
      { name: 'Slate Grey', hex: '#475569' }
    ],
    fabric: 'Textured Slub Cotton with Micro Poly Stretch',
    fit: 'Straight Relaxed Silhouette with Matching Pajama',
    description: 'A contemporary take on traditional Afghan and Bengali Kabli suit. Distinctive side patch pockets, utility chest pockets, and contrasting gold-tone metal buttons.',
    highlights: [
      'Complete two-piece set (Kabli Panjabi + Matching Pajama included)',
      'Side cargo utility style pockets with structured flaps',
      'Wrinkle-resistant heavy fall fabric with comfortable drape'
    ],
    careInstructions: [
      'Machine wash gentle cycle at 30°C',
      'Wash dark colors separately',
      'Medium heat iron'
    ],
    inStock: true,
    stockCount: 35
  },
  {
    id: 'prod-4',
    name: 'Regal Brocade Ceremonial Waistcoat',
    bengaliName: 'রেগাল ব্রোকেড সেরিমোনিয়াল ওয়েস্টকোট',
    category: 'men',
    subcategory: 'Waistcoat',
    gender: 'men',
    price: 3650,
    originalPrice: 4400,
    discountPercent: 17,
    rating: 4.9,
    reviewCount: 64,
    sku: 'WST-BLU-1123',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Festive Special',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Royal Black & Gold Zari', hex: '#18181b' },
      { name: 'Deep Burgundy Velvet', hex: '#831843' }
    ],
    fabric: 'Self-Textured Brocade Jacquard with Pure Brass Metal Buttons',
    fit: 'Tailored Waistcoat with Mandarin Collar',
    description: 'A timeless formal essential for weddings, Eid ceremonies, and galas. Tailored in the iconic 6-button high-collar cut.',
    highlights: [
      'High mandarin collar with satin border binding',
      'Hand-cast antique brass buttons with heraldic engraving',
      'Double welt pockets and inside breast pocket'
    ],
    careInstructions: ['Dry clean only', 'Do not wash in water'],
    inStock: true,
    stockCount: 19
  },
  {
    id: 'prod-5',
    name: 'Executive 100% Giza Cotton Formal Shirt',
    bengaliName: 'এক্সিকিউটিভ গিজা কটন ফরমাল শার্ট',
    category: 'men',
    subcategory: 'Formal Shirt',
    gender: 'men',
    price: 2650,
    originalPrice: 3200,
    discountPercent: 17,
    rating: 4.88,
    reviewCount: 310,
    sku: 'SHT-BLU-4401',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Blucheez Exclusive',
    sizes: ['15 (S)', '15.5 (M)', '16 (L)', '16.5 (XL)', '17 (XXL)'],
    colors: [
      { name: 'Crisp Royal White', hex: '#ffffff' },
      { name: 'Sky Cambridge Blue', hex: '#93c5fd' },
      { name: 'Powder Lilac', hex: '#e9d5ff' }
    ],
    fabric: '100% Egyptian Giza Long-Staple Cotton (Two-Ply 100/2)',
    fit: 'Slim Executive Fit with Semi-Cutaway Collar',
    description: 'Silky hand-feel with non-iron technology that maintains a crisp drape throughout a 14-hour workday.',
    highlights: [
      'Liquid ammonia treated non-iron finish',
      'German collar interlining guaranteed not to bubble',
      'Mother-of-pearl engraved buttons'
    ],
    careInstructions: ['Machine wash warm', 'Hang dry'],
    inStock: true,
    stockCount: 45
  },
  {
    id: 'prod-8',
    name: 'Executive Slim-Fit Italian Wool Blazer',
    bengaliName: 'এক্সিকিউটিভ স্লিম-ফিট উল ব্লেজার',
    category: 'men',
    subcategory: 'Executive Wool Blazers',
    gender: 'men',
    price: 8950,
    originalPrice: 10500,
    discountPercent: 15,
    rating: 4.95,
    reviewCount: 98,
    sku: 'BLZ-BLU-8841',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Black Label',
    sizes: ['36R', '38R', '40R', '42R', '44R'],
    colors: [
      { name: 'Midnight Charcoal', hex: '#1e293b' },
      { name: 'Navy Blue', hex: '#0f172a' }
    ],
    fabric: 'Super 120s Premium Wool Blend with Satin Viscose Lining',
    fit: 'Modern Tailored Fit',
    description: 'Masterfully structured half-canvas Italian wool blazer with precision shoulder pads, double back vents, and genuine horn buttons.',
    highlights: [
      'Structured half-canvas chest piece',
      'Double back vents for comfort',
      'High crease recovery fabric'
    ],
    careInstructions: ['Specialist dry clean only'],
    inStock: true,
    stockCount: 14
  },
  {
    id: 'prod-14',
    name: 'Royal Ivory Resham Zari Chikankari Panjabi',
    bengaliName: 'রয়্যাল আইভরি রেশম জারি চিকনকারি পাঞ্জাবি',
    category: 'men',
    subcategory: 'Exclusive Panjabi',
    gender: 'men',
    price: 4650,
    originalPrice: 5500,
    discountPercent: 15,
    rating: 4.96,
    reviewCount: 88,
    sku: 'PAN-BLU-9021',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Festive Special',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Ivory Cream', hex: '#fdfbf7' },
      { name: 'Pearl White', hex: '#ffffff' }
    ],
    fabric: 'Hand-Woven Resham Silk & Modal Blend',
    fit: 'Classic Semi-Fit',
    description: 'Regal ivory Eid Panjabi adorned with Lucknowi Chikankari motifs and subtle metallic zari highlights along collar and placket.',
    highlights: [
      'Authentic Chikankari hand embroidery',
      'Handcrafted pearlized buttons',
      'Breathable all-weather fabric'
    ],
    careInstructions: ['Dry clean only'],
    inStock: true,
    stockCount: 20
  },

  // ==========================================
  // WOMEN: BELWARI JAMDANI SAREES & KURTIS
  // ==========================================
  {
    id: 'prod-9',
    name: 'Belwari Handloom Dhakai Jamdani Saree',
    bengaliName: 'বেলওয়ারী তাঁতের ঢাকাই জামদানি শাড়ি',
    category: 'belwari',
    subcategory: 'Belwari Jamdani Saree',
    gender: 'women',
    price: 7850,
    originalPrice: 9500,
    discountPercent: 17,
    rating: 4.97,
    reviewCount: 112,
    sku: 'SAR-BEL-001',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Belwari Heritage',
    sizes: ['Free Size (5.5m + Blouse Piece)'],
    colors: [
      { name: 'Antique Gold & Crimson Zari', hex: '#881337' },
      { name: 'Ivory Pearl & Silver Weave', hex: '#fdfbf7' }
    ],
    fabric: 'Authentic 100-Count Resham Silk & Fine Cotton with Pure Zari',
    fit: 'Classic Saree Drape with 0.8m Blouse Fabric',
    description: 'The crowning jewel of the Belwari Atelier. Handcrafted by master weavers with intricate geometric floral motifs and majestic pallu.',
    highlights: [
      'Belwari Heritage certificate of authenticity',
      'Pure Zari handloom weave',
      'Feather-light ethereal drape'
    ],
    careInstructions: ['Dry clean only', 'Muslin cloth wrapping'],
    inStock: true,
    stockCount: 15
  },
  {
    id: 'prod-10',
    name: 'Belwari Luxury Three-Piece Embroidered Kurti Set',
    bengaliName: 'বেলওয়ারী লাক্সারি থ্রি-পিস কুর্তি সেট',
    category: 'women',
    subcategory: 'Three Pieces Kurti',
    gender: 'women',
    price: 4950,
    originalPrice: 5800,
    discountPercent: 15,
    rating: 4.93,
    reviewCount: 135,
    sku: 'KRT-BEL-302',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Belwari Heritage',
    sizes: ['36', '38', '40', '42', '44'],
    colors: [
      { name: 'Dusty Rose & Wine', hex: '#9f1239' },
      { name: 'Royal Emerald', hex: '#064e3b' }
    ],
    fabric: 'Chanderi Silk with Cotton Lawn Lining & Jacquard Organza Dupatta',
    fit: 'Flared Silhouette with Cigarette Pants & Printed Dupatta',
    description: 'Intricate zardozi threadwork on neckline with paired cigarette pants and an ethereal digital-printed organza dupatta.',
    highlights: [
      'Complete 3-Piece Ensemble (Kurti + Pants + Dupatta)',
      'Breathable inner lining for all-day comfort',
      'Hand-finished hem with scallop embroidery'
    ],
    careInstructions: ['Dry wash recommended'],
    inStock: true,
    stockCount: 24
  },
  {
    id: 'prod-11',
    name: 'Blucheez | Black Royale Flared Anarkali',
    bengaliName: 'ব্লুচিজ ব্ল্যাক রয়্যাল আনারকলি',
    category: 'blucheez-black',
    subcategory: 'Anarkali',
    gender: 'women',
    price: 5950,
    originalPrice: 7200,
    discountPercent: 17,
    rating: 4.96,
    reviewCount: 89,
    sku: 'ANK-BLK-4001',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Black Label',
    sizes: ['36', '38', '40', '42'],
    colors: [
      { name: 'Obsidian Midnight Black', hex: '#09090b' }
    ],
    fabric: 'Georgette Silk with Gold Tilla Threadwork',
    fit: '32-Kali High Flared Floor Length',
    description: 'Dramatic sweeping 32-kali flare crafted in pitch black georgette, highlighted with antique gold tilla thread work along the neckline.',
    highlights: [
      'Extravagant 32-kali flare circumference',
      'Includes matching churidar and dupatta with zari lace',
      'Soft crepe lining'
    ],
    careInstructions: ['Dry clean only'],
    inStock: true,
    stockCount: 18
  },
  {
    id: 'prod-15',
    name: 'Belwari Crimson Katan Banarasi Silk Saree',
    bengaliName: 'বেলওয়ারী ক্রিমসন কাতান বেনারসি সিল্ক শাড়ি',
    category: 'belwari',
    subcategory: 'Belwari Jamdani Saree',
    gender: 'women',
    price: 8450,
    originalPrice: 9900,
    discountPercent: 15,
    rating: 4.98,
    reviewCount: 76,
    sku: 'SAR-BEL-002',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Festive Special',
    sizes: ['Free Size (5.5m + Blouse Piece)'],
    colors: [
      { name: 'Royal Crimson Red', hex: '#991b1b' },
      { name: 'Bridal Maroon', hex: '#831843' }
    ],
    fabric: 'Pure Katan Silk with Antique Metallic Zari',
    fit: 'Traditional Grand Drape',
    description: 'Handwoven festive bridal katan saree adorned with intricate floral meenakari motifs and dense pallu craftsmanship.',
    highlights: [
      'Pure Katan Silk guarantee',
      'Rich floral zari border and pallu',
      'Comes with unstitched blouse fabric'
    ],
    careInstructions: ['Dry clean only'],
    inStock: true,
    stockCount: 12
  },
  {
    id: 'prod-16',
    name: 'Belwari Hand-Embroidered Velvet Gharara Suit',
    bengaliName: 'বেলওয়ারী হ্যান্ড-এমব্রয়ডার্ড ভেলভেট ঘারারা স্যুট',
    category: 'women',
    subcategory: 'Three Pieces Kurti',
    gender: 'women',
    price: 6850,
    originalPrice: 8200,
    discountPercent: 16,
    rating: 4.94,
    reviewCount: 54,
    sku: 'GHR-BEL-701',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Festive Special',
    sizes: ['36', '38', '40', '42'],
    colors: [
      { name: 'Deep Plum Wine', hex: '#581c87' },
      { name: 'Emerald Velvet', hex: '#064e3b' }
    ],
    fabric: 'Micro Velvet with Pure Organza Dupatta and Silk Crepe Lining',
    fit: 'Flared Festive Gharara Cut',
    description: 'Royal festive velvet kurti with zardozi dabka handwork paired with sweeping gathered gharara bottoms and scalloped dupatta.',
    highlights: [
      'Heavy zardozi embroidery on neckline and sleeves',
      'Dramatic wide flare gharara pants',
      'Embroidered border on all 4 sides of dupatta'
    ],
    careInstructions: ['Specialist dry clean only'],
    inStock: true,
    stockCount: 16
  },

  // ==========================================
  // SUMMER & CASUAL POLOS
  // ==========================================
  {
    id: 'prod-6',
    name: 'Textured Knit Button-Through Sweater Polo',
    bengaliName: 'টেক্সচার্ড নিট সোয়েটার পোলো শার্ট',
    category: 'summer',
    subcategory: 'Sweater Polos',
    gender: 'men',
    price: 2250,
    originalPrice: 2650,
    discountPercent: 15,
    rating: 4.89,
    reviewCount: 188,
    sku: 'POL-BLU-7721',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Summer Essential',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Ecru Cream', hex: '#fdfbf7' },
      { name: 'Forest Green', hex: '#14532d' },
      { name: 'Midnight Navy', hex: '#0f172a' }
    ],
    fabric: 'Fine Gauge Breathable Cotton Knit',
    fit: 'Relaxed Retro Fit with Full Button Front',
    description: 'Blucheez viral summer knit polo. Distinctive vertical rib pattern with retro revere collar and horn buttons.',
    highlights: [
      'Breathable airy open knit structure',
      'Can be worn buttoned or layered open over a tank',
      'Ribbed cuffs and waistband'
    ],
    careInstructions: ['Hand wash cold', 'Dry flat in shade'],
    inStock: true,
    stockCount: 50
  },
  {
    id: 'prod-7',
    name: 'Boxy-Fit Drop Shoulder Heavyweight Polo',
    bengaliName: 'বক্সি-ফিট ড্রপ শোল্ডার পোলো',
    category: 'summer',
    subcategory: 'Boxy-Fit Drop Shoulder Polos',
    gender: 'men',
    price: 1950,
    originalPrice: 2400,
    discountPercent: 18,
    rating: 4.84,
    reviewCount: 220,
    sku: 'POL-BLU-5512',
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'New Arrival',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Washed Charcoal', hex: '#334155' },
      { name: 'Sage Mint', hex: '#64748b' }
    ],
    fabric: '280 GSM Compact Heavy Pique',
    fit: 'Modern Boxy Drop Shoulder',
    description: 'Streetwear tailored polo with relaxed drop shoulders and wide boxy chest proportion.',
    highlights: ['280 GSM heavyweight cotton', 'Drop shoulder streetwear silhouette', 'Reinforced collar'],
    careInstructions: ['Machine wash cold inside out'],
    inStock: true,
    stockCount: 40
  },

  // ==========================================
  // ACCESSORIES & LEATHER
  // ==========================================
  {
    id: 'prod-12',
    name: 'Blucheez Signature Noir Eau De Parfum (100ml)',
    bengaliName: 'ব্লুচিজ সিগনেচার নয়ার সুগন্ধি',
    category: 'accessories',
    subcategory: 'Fragrances (Men & Women)',
    gender: 'unisex',
    price: 2450,
    originalPrice: 2950,
    discountPercent: 17,
    rating: 4.91,
    reviewCount: 204,
    sku: 'ACC-BLU-FRG01',
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Blucheez Exclusive',
    sizes: ['100ml EDP'],
    colors: [
      { name: 'Matte Black Glass Bottle', hex: '#18181b' }
    ],
    fabric: 'Extrait de Parfum (25% Concentration)',
    fit: 'Long-Lasting 12+ Hour Sillage',
    description: 'Top notes of Italian Bergamot and Pink Pepper, middle notes of Leather and Cardamom, base notes of Smoked Oud and Ambergris.',
    highlights: [
      'Formulated in Grasse, France',
      'Long-lasting projection suited for tropical climate',
      'Magnetic metallic cap and luxury presentation box'
    ],
    careInstructions: ['Keep in cool dark place away from heat'],
    inStock: true,
    stockCount: 50
  },
  {
    id: 'prod-13',
    name: 'Handcrafted Full-Grain Leather Dress Belt',
    bengaliName: 'হ্যান্ডক্রাফটেড জেনুইন লেদার বেল্ট',
    category: 'accessories',
    subcategory: 'Genuine Leather Belts',
    gender: 'men',
    price: 1650,
    originalPrice: 1950,
    discountPercent: 15,
    rating: 4.86,
    reviewCount: 147,
    sku: 'ACC-BLU-BLT02',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'New Arrival',
    sizes: ['32', '34', '36', '38', '40'],
    colors: [
      { name: 'Cognac Brown', hex: '#78350f' },
      { name: 'Classic Black', hex: '#0f172a' }
    ],
    fabric: '100% Vegetable-Tanned Cow Leather with Brushed Gunmetal Buckle',
    fit: '35mm Width Formal Dress Fit',
    description: 'Smooth full-grain leather that patinas beautifully with time. Finished with hand-burnished edges and a solid zinc-alloy buckle.',
    highlights: [
      '100% vegetable tanned genuine leather',
      'Scratch-resistant buckle finish',
      'Supplied with custom dust pouch'
    ],
    careInstructions: ['Wipe with damp cloth', 'Condition with leather balm'],
    inStock: true,
    stockCount: 65,
    salesCount: 412
  },
  {
    id: 'prod-17',
    name: 'Blucheez Semi-Formal Linen Cotton Kurta Shirt',
    bengaliName: 'ব্লুচিজ সেমি-ফরমাল লিনেন কটন কুর্তা শার্ট',
    category: 'men',
    subcategory: 'Casual Shirt',
    gender: 'men',
    price: 2450,
    originalPrice: 2950,
    discountPercent: 17,
    rating: 4.88,
    reviewCount: 196,
    sku: 'SHT-BLU-9921',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Bestseller',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Natural Sand', hex: '#d4c5b9' },
      { name: 'Slate Blue', hex: '#64748b' }
    ],
    fabric: '60% French Linen, 40% Long-Staple Cotton',
    fit: 'Relaxed Mandarin Band Collar Fit',
    description: 'Lightweight linen blend kurta shirt designed for warm humid weather with rolled-sleeve tabs and subtle wooden buttons.',
    highlights: [
      'Pre-washed linen for softness without scratchiness',
      'Natural wooden buttons with logo engraving',
      'Breathable loose weave'
    ],
    careInstructions: ['Hand wash or gentle machine wash'],
    inStock: true,
    stockCount: 42,
    salesCount: 520
  },
  {
    id: 'prod-18',
    name: 'Belwari Handcrafted Peacock Resham Jamdani Saree',
    bengaliName: 'বেলওয়ারী পিকক রেশম জামদানি শাড়ি',
    category: 'belwari',
    subcategory: 'Belwari Jamdani Saree',
    gender: 'women',
    price: 8950,
    originalPrice: 10500,
    discountPercent: 15,
    rating: 4.98,
    reviewCount: 145,
    sku: 'SAR-BEL-804',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Belwari Heritage',
    sizes: ['Free Size (5.5m + Blouse Piece)'],
    colors: [
      { name: 'Midnight Peacock Teal', hex: '#115e59' },
      { name: 'Royal Gold Weave', hex: '#ca8a04' }
    ],
    fabric: 'Pure 120-Count Resham Mulberry Silk with Fine Zari',
    fit: 'Regal Festive Drape',
    description: 'Exquisite handloom creation featuring mythical peacock motifs across the border and dense floral buta throughout the body.',
    highlights: [
      'Over 22 days of artisan handloom weaving',
      'Includes unstitched pure silk blouse piece',
      'Collector edition Belwari silk mark guarantee'
    ],
    careInstructions: ['Dry clean only in muslin cover'],
    inStock: true,
    stockCount: 8,
    salesCount: 380
  },
  {
    id: 'prod-19',
    name: 'Blucheez Signature Stretch Chino Trousers',
    bengaliName: 'ব্লুচিজ সিগনেচার স্ট্রেচ চিনো ট্রাউজার',
    category: 'men',
    subcategory: 'Casual Pants',
    gender: 'men',
    price: 2150,
    originalPrice: 2600,
    discountPercent: 17,
    rating: 4.87,
    reviewCount: 340,
    sku: 'PNT-BLU-108',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Bestseller',
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Khaki Beige', hex: '#c2b280' },
      { name: 'Navy', hex: '#0f172a' },
      { name: 'Olive Green', hex: '#3f4f3a' }
    ],
    fabric: '98% Combed Cotton Twill with 2% Spandex Stretch',
    fit: 'Tapered Slim Fit with Comfort Flex Waistband',
    description: 'All-day smart casual trousers crafted from high-density twill with stretch comfort and shirt-gripper inner waistband.',
    highlights: [
      'Flexible comfort waistband with internal gripper',
      'Double welt back pockets with horn button closure',
      'Deep reinforced mobile pocket'
    ],
    careInstructions: ['Machine wash cold with like colors'],
    inStock: true,
    stockCount: 58,
    salesCount: 680
  },
  {
    id: 'prod-20',
    name: 'Artisan Hand-Stitched Leather Peshawari Sandals',
    bengaliName: 'হ্যান্ড-স্টিচড লেদার পেশোয়ারি স্যান্ডেল',
    category: 'accessories',
    subcategory: 'Leather Footwear',
    gender: 'men',
    price: 3250,
    originalPrice: 3850,
    discountPercent: 16,
    rating: 4.92,
    reviewCount: 162,
    sku: 'SHOE-BLU-PSH01',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Blucheez Exclusive',
    sizes: ['40 (6)', '41 (7)', '42 (8)', '43 (9)', '44 (10)'],
    colors: [
      { name: 'Rich Tan Leather', hex: '#92400e' },
      { name: 'Midnight Black', hex: '#0f172a' }
    ],
    fabric: '100% Genuine Full-Grain Calf Leather with Cushioned Insole and Anti-Slip Tire Sole',
    fit: 'Traditional Peshawari Buckled Fit',
    description: 'Mastercrafted traditional footwear engineered for comfort during weddings and festive celebrations with orthopedic padding.',
    highlights: [
      '100% full-grain calfskin leather upper',
      'Orthopedic arch cushioned memory foam footbed',
      'Hand-cut tire rubber outer sole for grip'
    ],
    careInstructions: ['Condition with neutral wax polish'],
    inStock: true,
    stockCount: 25,
    salesCount: 495
  },
  {
    id: 'prod-21',
    name: 'Blucheez | Black Minimalist Nehru Waistcoat',
    bengaliName: 'ব্লুচিজ ব্ল্যাক মিনিমালিস্ট নেহরু ওয়েস্টকোট',
    category: 'blucheez-black',
    subcategory: 'Waistcoat',
    gender: 'men',
    price: 3950,
    originalPrice: 4700,
    discountPercent: 16,
    rating: 4.94,
    reviewCount: 110,
    sku: 'WST-BLK-2201',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Black Label',
    sizes: ['38', '40', '42', '44', '46'],
    colors: [
      { name: 'Monochrome Pitch Black', hex: '#09090b' }
    ],
    fabric: 'Fine Tropical Wool Blend with Matte Metal Hardware',
    fit: 'Structured Tailored Fit with Band Collar',
    description: 'A sharp, architectural waistcoat from the Black Society collection, designed for high-profile evening events and festive layering.',
    highlights: [
      'Concealed placket with matte black crest buttons',
      'Double jetted pockets with watch pocket slot',
      'Breathable viscose satin lining'
    ],
    careInstructions: ['Dry clean only'],
    inStock: true,
    stockCount: 22,
    salesCount: 430
  },
  {
    id: 'prod-22',
    name: 'Belwari Zari Embroidered Organza Festive Kurti Set',
    bengaliName: 'বেলওয়ারী জারি এমব্রয়ডার্ড অরগাঞ্জা কুর্তি সেট',
    category: 'women',
    subcategory: 'Three Pieces Kurti',
    gender: 'women',
    price: 5450,
    originalPrice: 6500,
    discountPercent: 16,
    rating: 4.91,
    reviewCount: 128,
    sku: 'KRT-BEL-504',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Belwari Heritage',
    sizes: ['36', '38', '40', '42', '44'],
    colors: [
      { name: 'Pastel Mint & Gold', hex: '#059669' },
      { name: 'Blush Rose & Silver', hex: '#e11d48' }
    ],
    fabric: 'Pure Tissue Organza with Butter Silk Slip and Georgette Dupatta',
    fit: 'Straight Flared Elegance with Straight Pants',
    description: 'Festive 3-piece set detailed with intricate scalloped dabka needlework along sleeves, hemline, and dupatta borders.',
    highlights: [
      'Pure tissue organza outer layer with soft inner slip',
      'Hand-embroidered floral motifs',
      'Matching tailored cigarette trousers included'
    ],
    careInstructions: ['Specialist dry clean only'],
    inStock: true,
    stockCount: 19,
    salesCount: 510
  }
];

export const DISTRICTS_OF_BANGLADESH = [
  'Dhaka (ঢাকা)',
  'Gazipur (গাজীপুর)',
  'Narayanganj (নারায়ণগঞ্জ)',
  'Chattogram (চট্টগ্রাম)',
  'Sylhet (সিলেট)',
  'Rajshahi (রাজশাহী)',
  'Khulna (খুলনা)',
  'Barishal (বরিশাল)',
  'Rangpur (রংপুর)',
  'Mymensingh (ময়মনসিংহ)',
  'Cumilla (কুমিল্লা)',
  'Noakhali (নোয়াখালী)',
  'Brahmanbaria (ব্রাহ্মণবাড়িয়া)',
  'Bogura (বগুড়া)',
  'Jessore (যশোর)',
  'Cox\'s Bazar (কক্সবাজার)',
  'Tangail (টাঙ্গাইল)',
  'Faridpur (ফরিদপুর)',
  'Pabna (পাবনা)',
  'Kushtia (কুষ্টিয়া)',
  'Dinajpur (দিনাজপুর)',
  'Habiganj (হবিগঞ্জ)',
  'Moulvibazar (মৌলভীবাজার)',
  'Sunamganj (সুনামগঞ্জ)'
];
