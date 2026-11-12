import React from 'react';
import { ShoppingBag, User, Package, ShieldCheck } from 'lucide-react';
import { useAuth } from '../firebase/authContext';

interface NavbarProps {
  cartCount: number;
  openCart: () => void;
  scrollToSection: (id: string) => void;
  onOpenMemberAuth?: () => void;
  onOpenOrders?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  openCart,
  scrollToSection,
  onOpenMemberAuth,
  onOpenOrders,
}) => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg font-extrabold tracking-tight font-sans whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 flex items-center gap-1.5"
          >
            <span className="text-emerald-950">SỦI</span>
            <span className="text-orange-600">XANH</span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-stone-600">
            <button
              onClick={() => scrollToSection('fizz-lab-section')}
              className="hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Phòng Thí Nghiệm Sủi
            </button>
            <button
              onClick={() => scrollToSection('products-section')}
              className="hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Sản Phẩm &amp; Combo
            </button>
            <button
              onClick={() => scrollToSection('eco-calculator-section')}
              className="hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Tính Giảm Rác Thải
            </button>
            <button
              onClick={() => scrollToSection('media-section')}
              className="hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
            >
              Kênh Truyền Thông
            </button>
          </nav>

          {/* Zone 3: Actions, Member/Admin Portal & Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* My Orders Button */}
            {onOpenOrders && (
              <button
                onClick={onOpenOrders}
                className="hidden sm:flex items-center px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors text-[12px] font-medium"
                title="Xem đơn hàng của bạn"
              >
                <span>Đơn hàng</span>
              </button>
            )}

            {/* Optional Member / Admin Login Button */}
            {onOpenMemberAuth && (
              <button
                onClick={onOpenMemberAuth}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[12px] font-medium transition-all ${
                  currentUser
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950 font-semibold hover:bg-emerald-100/60'
                    : 'border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                }`}
                title={
                  currentUser
                    ? `Tài khoản: ${currentUser.email}`
                    : 'Đăng nhập thành viên tùy chọn'
                }
              >
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                ) : (
                  <User className="w-4 h-4 text-emerald-800" />
                )}
                <span className="hidden sm:inline">
                  {currentUser ? (isAdmin ? 'Quản trị' : 'Thành viên') : 'Thành viên'}
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-900 text-white hover:bg-emerald-850 transition-colors flex items-center gap-2 font-medium text-[13px] shadow-xs whitespace-nowrap"
              aria-label="Xem giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">Giỏ Hàng</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
