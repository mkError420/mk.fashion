// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

// Backend types (matching PHP API responses)
export interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  parent_name?: string | null;
  parent_slug?: string | null;
}

export interface BackendProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface BackendProductSize {
  size: string;
  stock_quantity: number;
}

export interface BackendProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  sku: string | null;
  stock_quantity: number;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  category_name: string | null;
  category_slug: string | null;
  images: BackendProductImage[];
  sizes: BackendProductSize[];
}

export interface BackendCartItem {
  id: number;
  product_id: number;
  quantity: number;
  size: string | null;
  name: string;
  price: number;
  image_url: string | null;
  stock_quantity: number;
}

export interface BackendOrder {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_phone: string | null;
  notes: string | null;
  created_at: string;
  items: BackendOrderItem[];
}

export interface BackendOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  size: string | null;
  product_name: string;
}

// Session management
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('aristo_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('aristo_session_id', sessionId);
  }
  return sessionId;
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Categories API
export const fetchCategories = async (): Promise<BackendCategory[]> => {
  try {
    const res = await apiRequest<BackendCategory[]>('/frontend_categories.php');
    if (Array.isArray(res) && res.length > 0) return res;
  } catch (err) {
    console.warn('frontend_categories.php fetch failed, trying categories.php:', err);
  }
  return apiRequest<BackendCategory[]>('/categories.php');
};

export const fetchCategory = async (id: number): Promise<BackendCategory> => {
  return apiRequest<BackendCategory>(`/category.php?id=${id}`);
};

// Products API
export const fetchProducts = async (params?: {
  category_id?: number;
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<BackendProduct[]> => {
  const queryParams = new URLSearchParams();
  if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
  if (params?.featured) queryParams.append('featured', 'true');
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  
  const queryString = queryParams.toString();
  const result = await apiRequest<BackendProduct[] | unknown>(`/products.php${queryString ? `?${queryString}` : ''}`);
  // Guard: API might return an error object instead of an array
  if (!Array.isArray(result)) {
    console.error('fetchProducts: expected array but got', result);
    return [];
  }
  return result;
};

export const fetchProduct = async (id: number): Promise<BackendProduct> => {
  return apiRequest<BackendProduct>(`/product.php?id=${id}`);
};

// Cart API
export const fetchCart = async (sessionId: string): Promise<BackendCartItem[]> => {
  return apiRequest<BackendCartItem[]>(`/cart.php?session_id=${sessionId}`);
};

export const addToCartApi = async (
  sessionId: string,
  productId: number,
  quantity: number,
  size?: string
): Promise<{ message: string; quantity?: number }> => {
  return apiRequest('/cart.php', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      quantity,
      size,
    }),
  });
};

export const updateCartItemApi = async (
  cartId: number,
  quantity: number
): Promise<{ message: string }> => {
  return apiRequest('/cart.php', {
    method: 'PUT',
    body: JSON.stringify({
      cart_id: cartId,
      quantity,
    }),
  });
};

export const deleteFromCartApi = async (cartId: number): Promise<{ message: string }> => {
  return apiRequest(`/cart.php?cart_id=${cartId}`, {
    method: 'DELETE',
  });
};

// Orders API
export const createOrder = async (
  customer: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    postal_code?: string;
  },
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
    size?: string;
  }>,
  paymentMethod: string = 'cod',
  notes?: string,
  sessionId?: string
): Promise<{ message: string; order_number: string; total_amount: number }> => {
  return apiRequest('/orders.php', {
    method: 'POST',
    body: JSON.stringify({
      customer,
      items,
      payment_method: paymentMethod,
      notes,
      session_id: sessionId,
    }),
  });
};

export const fetchOrder = async (orderNumber: string): Promise<BackendOrder> => {
  return apiRequest<BackendOrder>(`/orders.php?order_number=${orderNumber}`);
};

// Helper function to convert backend product to frontend product
export const convertBackendToFrontendProduct = (backendProduct: BackendProduct) => {
  // Guard against null/undefined images and sizes returned by the API
  const safeImages: BackendProductImage[] = Array.isArray(backendProduct.images) ? backendProduct.images : [];
  const safeSizes: BackendProductSize[] = Array.isArray(backendProduct.sizes) ? backendProduct.sizes : [];

  const images = safeImages.length > 0
    ? safeImages.map(img => img.image_url)
    : (backendProduct.image_url ? [backendProduct.image_url] : ['/placeholder-product.jpg']);
  
  const sizes = safeSizes.length > 0
    ? safeSizes.map(s => s.size)
    : ['Free Size'];

  return {
    id: backendProduct.id.toString(),
    backendId: backendProduct.id,
    name: backendProduct.name,
    bengaliName: backendProduct.name, // Use same name for now
    category: backendProduct.category_slug as any || 'all',
    subcategory: undefined,
    gender: 'unisex' as const,
    price: backendProduct.price,
    originalPrice: backendProduct.compare_price || backendProduct.price,
    discountPercent: backendProduct.compare_price 
      ? Math.round(((backendProduct.compare_price - backendProduct.price) / backendProduct.compare_price) * 100)
      : undefined,
    rating: 4.5, // Default rating
    reviewCount: Math.floor(Math.random() * 50) + 10, // Random review count
    sku: backendProduct.sku || `SKU-${backendProduct.id}`,
    images,
    badge: backendProduct.is_featured ? 'Bestseller' : undefined,
    sizes,
    colors: [{ name: 'Standard', hex: '#000000' }], // Default color
    fabric: 'Premium Material',
    fit: 'Regular Fit',
    description: backendProduct.description || 'No description available',
    highlights: [
      'Premium quality material',
      'Comfortable fit',
      'Stylish design'
    ],
    careInstructions: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low'
    ],
    inStock: backendProduct.stock_quantity > 0,
    stockCount: backendProduct.stock_quantity,
  };
};

// Helper function to convert backend cart item to frontend cart item
export const convertBackendToFrontendCartItem = async (
  backendItem: BackendCartItem
): Promise<any> => {
  const product = await fetchProduct(backendItem.product_id);
  const frontendProduct = convertBackendToFrontendProduct(product);
  
  return {
    id: backendItem.id.toString(),
    product: frontendProduct,
    selectedSize: backendItem.size || 'Free Size',
    selectedColor: 'Standard',
    quantity: backendItem.quantity,
  };
};
