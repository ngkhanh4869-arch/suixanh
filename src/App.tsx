import React, { useState, useEffect } from 'react';
import { CartItem, OrderInfo, Product } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductSection } from './components/ProductSection';
import { InteractiveFizzLab } from './components/InteractiveFizzLab';
import { EcoCalculator } from './components/EcoCalculator';
import { CircularProcess } from './components/CircularProcess';
import { SocialAndFanpage } from './components/SocialAndFanpage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { MemberAuthModal } from './components/MemberAuthModal';
import { AuthProvider } from './firebase/authContext';
import { Check } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isMemberAuthOpen, setIsMemberAuthOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sui_xanh_cart');
      return saved ? JSON.parse(saved) : [{ product: PRODUCTS[0], quantity: 1 }];
    } catch {
      return [{ product: PRODUCTS[0], quantity: 1 }];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sui_xanh_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = (order: OrderInfo) => {
    setCart([]);
    showToast(`Đơn hàng #${order.id} đã được lưu thành công trên hệ thống!`);
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // If Admin View is active, render Admin Dashboard
  if (currentView === 'admin') {
    return (
      <AdminPanel onBackToStore={() => setCurrentView('store')} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF7] text-[#1C1917] text-[13px] font-sans">
      {/* Top Navigation */}
      <Navbar
        cartCount={totalCartItems}
        openCart={() => setIsCartOpen(true)}
        scrollToSection={scrollToSection}
        onOpenMemberAuth={() => setIsMemberAuthOpen(true)}
        onOpenOrders={() => {
          setTrackingOrderId(undefined);
          setIsTrackingOpen(true);
        }}
      />

      {/* Main Content View: Pure Sales & Communication */}
      <main className="flex-1">
        <HeroSection
          onBuyStarter={handleBuyNow}
          starterProduct={PRODUCTS[0]}
          onExploreFizzLab={() => scrollToSection('fizz-lab-section')}
        />

        {/* Centerpiece Interactive Chemistry Simulator */}
        <InteractiveFizzLab />

        <ProductSection
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />

        <EcoCalculator />

        <CircularProcess />

        <SocialAndFanpage />
      </main>

      {/* Footer */}
      <Footer onScrollTo={scrollToSection} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
        onOpenTracking={(orderId) => {
          setTrackingOrderId(orderId);
          setIsTrackingOpen(true);
        }}
      />

      {/* Order Tracking Modal for Customers */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        initialOrderId={trackingOrderId}
        onGoToProducts={() => scrollToSection('products-section')}
        onClose={() => {
          setIsTrackingOpen(false);
          setTrackingOrderId(undefined);
        }}
      />

      {/* Optional Member / Admin Auth Modal */}
      <MemberAuthModal
        isOpen={isMemberAuthOpen}
        onClose={() => setIsMemberAuthOpen(false)}
        onOpenAdmin={() => {
          setIsMemberAuthOpen(false);
          setCurrentView('admin');
        }}
        onOpenOrders={() => {
          setIsMemberAuthOpen(false);
          setIsTrackingOpen(true);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-[12px] border border-stone-800">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
