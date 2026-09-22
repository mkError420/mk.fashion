import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CategoryType, SearchFilterState, CourierPartner, Coupon, OrderCustomer } from '../types';
import { 
  fetchProducts, 
  fetchCart, 
  addToCartApi, 
  updateCartItemApi, 
  deleteFromCartApi, 
  createOrder,
  convertBackendToFrontendProduct,
  getSessionId
} from '../services/api';
import { SAMPLE_TRACKING_CODES, generateMockTrackingForOrder } from '../data/mockCourierData';

interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

const VALID_COUPONS: Record<string, Coupon> = {
  'BLUCHEEZ10': { code: 'BLUCHEEZ10', discountPercent: 10, label: '10% Off Blucheez Promo' },
  'BLUCHEEZVIP': { code: 'BLUCHEEZVIP', discountPercent: 15, label: '15% Off Black Society VIP' },
  'BLUSHVIP': { code: 'BLUSHVIP', discountPercent: 15, label: '15% Off VIP Member Club' },
  'EID2026': { code: 'EID2026', discountAmount: 300, label: '৳300 Festive Eid Discount' },
  'WELCOME': { code: 'WELCOME', discountAmount: 150, label: '৳150 First Order Welcome' },
  'FIRSTORDER': { code: 'FIRSTORDER', discountAmount: 200, label: '৳200 New Customer Discount' }
};

interface ShopContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  isLoadingCart: boolean;
  wishlist: string[];
  orders: Order[];
  filters: SearchFilterState;
  toasts: Toast[];

  // Blucheez Cart Features
  appliedCoupon: Coupon | null;
  orderNote: string;
  isGiftPackaging: boolean;
  
  // Modals & Drawers
  quickViewProduct: Product | null;
  quickCheckoutItem: { product: Product; size: string; color: string; quantity: number } | null;
  isCheckoutOpen: boolean;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isTrackingOpen: boolean;
  trackingQueryCode: string;
  isSizeGuideOpen: boolean;
  sizeGuideCategory: 'panjabi' | 'suits' | 'shirts';
  confirmedOrder: Order | null;
  isMobileMenuOpen: boolean;

  // Actions
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  updateFilter: <K extends keyof SearchFilterState>(key: K, value: SearchFilterState[K]) => void;
  resetFilters: () => void;
  
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setOrderNote: (note: string) => void;
  setIsGiftPackaging: (enable: boolean) => void;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  openQuickCheckout: (product?: Product, size?: string, color?: string, quantity?: number) => void;
  openCartCheckout: () => void;
  closeQuickCheckout: () => void;

  openCart: () => void;
  closeCart: () => void;

  openWishlist: () => void;
  closeWishlist: () => void;

  openTracking: (code?: string) => void;
  closeTracking: () => void;

  openSizeGuide: (category?: 'panjabi' | 'suits' | 'shirts') => void;
  closeSizeGuide: () => void;

  setConfirmedOrder: (order: Order | null) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;

  placeOrder: (customer: OrderCustomer, deliveryZone: 'Inside Dhaka' | 'Outside Dhaka' | 'Sub-Dhaka Express', itemsToOrder?: CartItem[]) => Promise<Order>;
  confirmOrder: (customer: OrderCustomer, deliveryZone: 'Inside Dhaka' | 'Outside Dhaka' | 'Sub-Dhaka Express', itemsToOrder?: CartItem[]) => Promise<Order>;

  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_FILTERS: SearchFilterState = {
  query: '',
  category: 'all',
  subcategory: undefined,
  minPrice: 0,
  maxPrice: 15000,
  sortBy: 'featured',
  inStockOnly: false
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Cart state persisted
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aristo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aristo_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-4'];
    }
  });

  // Initial Sample Order for testing COD and Courier Tracking immediately
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aristo_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const sampleProduct = INITIAL_PRODUCTS[0];
    const initialOrder: Order = {
      orderId: 'AR-98214',
      date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [
        {
          id: 'item-initial-1',
          product: sampleProduct,
          selectedSize: '42',
          selectedColor: 'Deep Burgundy / Maroon',
          quantity: 1
        }
      ],
      subtotal: 3450,
      deliveryFee: 60,
      total: 3510,
      deliveryZone: 'Inside Dhaka',
      customer: {
        fullName: 'Mahmudur Rahman',
        phone: '01712-349812',
        district: 'Dhaka (ঢাকা)',
        address: 'House 42, Road 27, Dhanmondi, Dhaka-1209',
        notes: 'Please call before arrival. Cash on delivery ready.'
      },
      paymentMethod: 'Cash on Delivery (COD)',
      status: 'Shipped',
      tracking: SAMPLE_TRACKING_CODES['ST-9821415']
    };
    return [initialOrder];
  });

  // Modal controls
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickCheckoutItem, setQuickCheckoutItem] = useState<{ product: Product; size: string; color: string; quantity: number } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [trackingQueryCode, setTrackingQueryCode] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<'panjabi' | 'suits' | 'shirts'>('panjabi');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Blucheez Cart Features
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('blucheez_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [orderNote, setOrderNote] = useState<string>('');
  const [isGiftPackaging, setIsGiftPackaging] = useState<boolean>(false);
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);

  // Fetch products from API on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const backendProducts = await fetchProducts();
        const frontendProducts = backendProducts.map(convertBackendToFrontendProduct);
        setProducts(frontendProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to mock data if API fails
        const { INITIAL_PRODUCTS } = await import('../data/products');
        setProducts(INITIAL_PRODUCTS);
        addToast('API Error', 'Using offline mode. Some features may be limited.', 'warning');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('aristo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aristo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('aristo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('blucheez_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('blucheez_coupon');
    }
  }, [appliedCoupon]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const normalized = code.trim().toUpperCase();
    const found = VALID_COUPONS[normalized];
    if (found) {
      setAppliedCoupon(found);
      addToast('Coupon Applied!', `${found.label} activated.`, 'success');
      return { success: true, message: `Applied: ${found.label}` };
    } else {
      addToast('Invalid Promo Code', 'Try code BLUCHEEZ10 (10% off) or EID2026 (৳300 off)', 'warning');
      return { success: false, message: 'Invalid promo code. Try BLUCHEEZ10 or EID2026' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon Removed', 'Discount removed from your shopping bag.', 'info');
  };

  const updateFilter = <K extends keyof SearchFilterState>(key: K, value: SearchFilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const addToCart = async (
    product: Product, 
    selectedSize?: string, 
    selectedColor?: string, 
    quantity: number = 1,
    openDrawer: boolean = true
  ) => {
    const size = selectedSize || product.sizes[0] || 'Free Size';
    const color = selectedColor || product.colors[0]?.name || 'Standard';

    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity
        };
        return [...prev, newItem];
      }
    });

    // Sync with backend API
    try {
      const sessionId = getSessionId();
      await addToCartApi(sessionId, parseInt(product.id), quantity, size);
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
      addToast('Cart Sync Failed', 'Item added locally but backend sync failed.', 'warning');
    }

    addToast('Added to Cart', `${product.name} (Size: ${size}) added to your bag.`);
    
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    
    // Try to sync with backend (note: cartItemId format may differ from backend)
    try {
      const numericId = parseInt(cartItemId.split('-')[0]);
      if (!isNaN(numericId)) {
        await deleteFromCartApi(numericId);
      }
    } catch (error) {
      console.error('Failed to sync cart removal with backend:', error);
    }
    
    addToast('Item Removed', 'Product removed from shopping bag.', 'info');
  };

  const updateCartQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
    
    // Try to sync with backend
    try {
      const numericId = parseInt(cartItemId.split('-')[0]);
      if (!isNaN(numericId)) {
        await updateCartItemApi(numericId, newQty);
      }
    } catch (error) {
      console.error('Failed to sync cart update with backend:', error);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const product = products.find(p => p.id === productId);
      const name = product ? product.name : 'Product';
      if (exists) {
        addToast('Removed from Wishlist', `${name} removed from your saved items.`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to Wishlist', `${name} added to your wishlist.`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const openQuickCheckout = (product?: Product, size?: string, color?: string, quantity: number = 1) => {
    if (product) {
      setQuickCheckoutItem({
        product,
        size: size || product.sizes[0] || 'Regular',
        color: color || product.colors[0]?.name || 'Standard',
        quantity
      });
    } else {
      setQuickCheckoutItem(null);
    }
    setIsCheckoutOpen(true);
  };

  const openCartCheckout = () => {
    setQuickCheckoutItem(null);
    setIsCheckoutOpen(true);
  };

  const closeQuickCheckout = () => {
    setIsCheckoutOpen(false);
    setQuickCheckoutItem(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const openTracking = (code?: string) => {
    if (code) {
      setTrackingQueryCode(code);
    }
    setIsTrackingOpen(true);
  };

  const closeTracking = () => {
    setIsTrackingOpen(false);
  };

  const openSizeGuide = (category: 'panjabi' | 'suits' | 'shirts' = 'panjabi') => {
    setSizeGuideCategory(category);
    setIsSizeGuideOpen(true);
  };

  const closeSizeGuide = () => {
    setIsSizeGuideOpen(false);
  };

  const placeOrder = async (
    customer: {
      fullName: string;
      phone: string;
      alternativePhone?: string;
      district: string;
      address: string;
      notes?: string;
    },
    deliveryZone: 'Inside Dhaka' | 'Outside Dhaka' | 'Sub-Dhaka Express',
    itemsToOrder?: CartItem[]
  ): Promise<Order> => {
    const activeItems = itemsToOrder && itemsToOrder.length > 0 ? itemsToOrder : cart;
    const subtotal = activeItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    
    // Free delivery over Tk 3,000 threshold (Blucheez Policy)
    const isFreeDelivery = subtotal >= 3000;
    const standardFee = deliveryZone === 'Inside Dhaka' ? 60 : deliveryZone === 'Sub-Dhaka Express' ? 100 : 120;
    const deliveryFee = isFreeDelivery ? 0 : standardFee;

    // Coupon discount calculation
    let discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountPercent) {
        discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      } else if (appliedCoupon.discountAmount) {
        discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
      }
    }

    const giftFee = isGiftPackaging ? 150 : 0;
    const total = Math.max(0, subtotal - discountAmount + deliveryFee + giftFee);

    // Try to create order via backend API
    try {
      const sessionId = getSessionId();
      const orderItems = activeItems.map(item => ({
        product_id: parseInt(item.product.id),
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize
      }));

      const backendOrder = await createOrder(
        {
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.district,
          postal_code: customer.postal_code,
        },
        orderItems,
        'cod',
        customer.notes || orderNote,
        sessionId
      );

      // Create order number from backend response
      const orderId = backendOrder.order_number;
      
      // Select courier partner based on destination
      const couriers: CourierPartner[] = ['Steadfast Courier', 'Pathao Logistics', 'RedX Delivery', 'Paperfly'];
      const assignedCourier: CourierPartner = deliveryZone === 'Inside Dhaka' ? 'Pathao Logistics' : 'Steadfast Courier';

      const tracking = generateMockTrackingForOrder(orderId, assignedCourier, customer.district);

      const newOrder: Order = {
        orderId,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: activeItems,
        subtotal,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        giftPackaging: isGiftPackaging,
        deliveryFee,
        total: backendOrder.total_amount, // Use backend total
        deliveryZone,
        customer: {
          ...customer,
          notes: customer.notes || orderNote || undefined
        },
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Confirmed',
        tracking
      };

      setOrders(prev => [newOrder, ...prev]);

      // If order was from main cart, clear it
      if (!itemsToOrder) {
        clearCart();
        setOrderNote('');
        setIsGiftPackaging(false);
        setAppliedCoupon(null);
      }

      setConfirmedOrder(newOrder);
      addToast('Order Placed Successfully!', `Order ${orderId} confirmed with Cash on Delivery.`, 'success');

      return newOrder;
    } catch (error) {
      console.error('Failed to create order via backend:', error);
      
      // Fallback to local order creation
      const orderNumber = Math.floor(10000 + Math.random() * 90000);
      const orderId = `BC-${orderNumber}`;

      const couriers: CourierPartner[] = ['Steadfast Courier', 'Pathao Logistics', 'RedX Delivery', 'Paperfly'];
      const assignedCourier: CourierPartner = deliveryZone === 'Inside Dhaka' ? 'Pathao Logistics' : 'Steadfast Courier';

      const tracking = generateMockTrackingForOrder(orderId, assignedCourier, customer.district);

      const newOrder: Order = {
        orderId,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: activeItems,
        subtotal,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        giftPackaging: isGiftPackaging,
        deliveryFee,
        total,
        deliveryZone,
        customer: {
          ...customer,
          notes: customer.notes || orderNote || undefined
        },
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Confirmed',
        tracking
      };

      setOrders(prev => [newOrder, ...prev]);

      if (!itemsToOrder) {
        clearCart();
        setOrderNote('');
        setIsGiftPackaging(false);
        setAppliedCoupon(null);
      }

      setConfirmedOrder(newOrder);
      addToast('Order Placed (Offline Mode)', `Order ${orderId} saved locally. Backend sync failed.`, 'warning');

      return newOrder;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        isLoadingCart,
        wishlist,
        orders,
        filters,
        toasts,
        appliedCoupon,
        orderNote,
        isGiftPackaging,
        quickViewProduct,
        quickCheckoutItem,
        isCheckoutOpen,
        isCartOpen,
        isWishlistOpen,
        isTrackingOpen,
        trackingQueryCode,
        isSizeGuideOpen,
        sizeGuideCategory,
        confirmedOrder,
        isMobileMenuOpen,
        setFilters,
        updateFilter,
        resetFilters,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setOrderNote,
        setIsGiftPackaging,
        toggleWishlist,
        isInWishlist,
        openQuickView,
        closeQuickView,
        openQuickCheckout,
        openCartCheckout,
        closeQuickCheckout,
        openCart,
        closeCart,
        openWishlist,
        closeWishlist,
        openTracking,
        closeTracking,
        openSizeGuide,
        closeSizeGuide,
        setConfirmedOrder,
        setIsMobileMenuOpen,
        placeOrder,
        confirmOrder: placeOrder,
        addToast,
        removeToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
