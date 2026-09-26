import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AdminProvider } from './context/AdminContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { FrontendDataProvider } from './context/FrontendDataContext';
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Global Modals and Interactive Drawers
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { QuickCheckoutModal } from './components/QuickCheckoutModal';
import { CourierTrackingModal } from './components/CourierTrackingModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ToastContainer } from './components/ToastContainer';

// Dedicated Functional Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { OutletsPage } from './pages/OutletsPage';
import { ExchangePolicyPage } from './pages/ExchangePolicyPage';
import { AboutPage } from './pages/AboutPage';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900 selection:bg-black selection:text-white pb-16 md:pb-0 w-full max-w-full overflow-x-clip">
      {!isAdminRoute && <Header />}

      <main className={isAdminRoute ? "flex-1" : "flex-1"}>
        <Routes>
          {/* Admin Routes - Full page without Header/Footer */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Main App Routes - With Header/Footer */}
          <Route path="/" element={<HomePage />} />

          {/* Dedicated Shop Catalog with full Category & Subcategory Sidebar */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />

          {/* Collections routes mapped to Shop with full sidebar capabilities */}
          <Route path="/collections" element={<Navigate to="/shop" replace />} />
          <Route path="/collections/:category" element={<ShopPage />} />

          {/* Product Detail Page with variants, tabs, and gallery */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Full Shopping Cart & Bag */}
          <Route path="/cart" element={<CartPage />} />

          {/* Full Direct COD Checkout */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Order Confirmation & Printable Invoice */}
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

          {/* Dedicated Courier Tracking with Timeline */}
          <Route path="/track" element={<TrackOrderPage />} />

          {/* Saved Wishlist Items */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Dhaka Retail Outlets & Flagship Centers */}
          <Route path="/outlets" element={<OutletsPage />} />

          {/* 7-Day Exchange & Return Policy */}
          <Route path="/exchange-policy" element={<ExchangePolicyPage />} />

          {/* Atelier Brand Story & Heritage */}
          <Route path="/about" element={<AboutPage />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      {/* Interactive Modals & Slide-out Drawers - Only on non-admin routes */}
      {!isAdminRoute && (
        <>
          <ProductQuickViewModal />
          <QuickCheckoutModal />
          <CourierTrackingModal />
          <CartDrawer />
          <WishlistDrawer />
          <OrderSuccessModal />
          <SizeGuideModal />
          <ToastContainer />
          <MobileBottomNav />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FrontendDataProvider>
        <AdminProvider>
          <AdminDataProvider>
            <ShopProvider>
              <ScrollToTop />
              <AppContent />
            </ShopProvider>
          </AdminDataProvider>
        </AdminProvider>
      </FrontendDataProvider>
    </BrowserRouter>
  );
}
