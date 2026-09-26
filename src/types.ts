export type CategoryType = 
  | 'all' 
  | 'new-in'
  | 'summer'
  | 'blucheez-black'
  | 'belwari'
  | 'men' 
  | 'women' 
  | 'accessories'
  // Legacy / Direct categories for backwards compatibility
  | 'panjabi' 
  | 'suits' 
  | 'shirts' 
  | 'polos' 
  | 'sarees' 
  | 'kurtis' 
  | 'waistcoats'
  | (string & {});

export interface ProductVariant {
  id?: number;
  product_id?: number;
  size?: string | null;
  color?: string | null;
  color_hex?: string | null;
  stock_quantity: number;
  price_override?: number | null;
  sku?: string | null;
}

export interface Product {
  id: string;
  name: string;
  bengaliName: string;
  category: CategoryType;
  subcategory?: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  sku: string;
  images: string[];
  badge?: 'Blucheez Exclusive' | 'Black Label' | 'Belwari Heritage' | 'Festive Special' | 'Bestseller' | 'New Arrival' | 'Summer Essential' | 'Top Ten Pick' | 'Richman Exclusive' | 'Rang Heritage';
  sizes: string[];
  colors: { name: string; hex: string }[];
  variants?: ProductVariant[];
  fabric: string;
  fit: string;
  description: string;
  highlights: string[];
  careInstructions: string[];
  inStock: boolean;
  stockCount: number;
  salesCount?: number;
  // Backend sync properties
  backendId?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  alternatePhone?: string;
  email?: string;
  district: string;
  thana?: string;
  address: string;
  notes?: string;
}

export type CourierPartner = 'Steadfast Courier' | 'Pathao Logistics' | 'RedX Delivery' | 'Paperfly';

export interface TrackingCheckpoint {
  time: string;
  date: string;
  title: string;
  location: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface CourierTrackingInfo {
  courier: CourierPartner;
  trackingCode: string;
  consignmentId: string;
  status: 'Order Placed' | 'Picked by Courier' | 'In Sorting Hub' | 'Out for Delivery' | 'Delivered' | 'Returned';
  estimatedDelivery: string;
  riderName?: string;
  riderPhone?: string;
  hubLocation: string;
  checkpoints: TrackingCheckpoint[];
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  label: string;
  minSpend?: number;
}

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  giftPackaging?: boolean;
  deliveryFee: number;
  total: number;
  deliveryZone: 'Inside Dhaka' | 'Outside Dhaka' | 'Sub-Dhaka Express';
  customer: OrderCustomer;
  paymentMethod: 'Cash on Delivery (COD)';
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  tracking: CourierTrackingInfo;
}

export interface SearchFilterState {
  query: string;
  category: CategoryType;
  subcategory?: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
  inStockOnly: boolean;
  selectedSize?: string;
}
