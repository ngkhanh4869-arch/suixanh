import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Package,
  ShieldCheck,
  FlaskConical,
  Sparkles,
  Calculator,
  Share2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../firebase/authContext';

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
  const { currentUser, isAdmin, isSuperAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    scrollToSection(sectionId);
  };

  const handleCartClick = () => {
    setIsMenuOpen(false);
    openCart();
  };

  const handleOrdersClick = () => {
    setIsMenuOpen(false);
    if (onOpenOrders) onOpenOrders();
  };

  const handleAuthClick = () => {
    setIsMenuOpen(false);
    if (onOpenMemberAuth) onOpenMemberAuth();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Zone 1: Brand wordmark (Left) */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-lg font-extrabold tracking-tight font-sans whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 flex items-center gap-1.5"
            >
              <span className="text-emerald-950 font-black">SỦI</span>
              <span className="text-orange-600 font-black">XANH</span>
            </button>

            {/* Zone 2: Single Tab Button on the right for BOTH Mobile & PC */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all shadow-2xs ${
                  isMenuOpen
                    ? 'bg-emerald-950 text-white ring-2 ring-emerald-700'
                    : 'bg-emerald-900 hover:bg-emerald-850 text-white'
                }`}
                aria-label="Mở menu tính năng"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4 text-amber-200" />
                ) : (
                  <Menu className="w-4 h-4 text-amber-200" />
                )}
                <span>Menu</span>

                {/* Notification indicator for cart items or active account */}
                {cartCount > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {cartCount}
                  </span>
                ) : currentUser ? (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSuperAdmin
                        ? 'bg-rose-400 ring-2 ring-rose-300'
                        : isAdmin
                        ? 'bg-purple-400 ring-2 ring-purple-300'
                        : 'bg-emerald-400 ring-2 ring-emerald-300'
                    }`}
                  />
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer for All Features (Mobile & PC) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div
            ref={menuRef}
            className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-stone-200 animate-in slide-in-from-right duration-250"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-stone-900 font-sans tracking-tight">
                  <span className="text-emerald-950">SỦI </span>
                  <span className="text-orange-600">XANH</span>
                </span>
                <span className="text-[11px] font-medium text-stone-500">· Danh Mục Tính Năng</span>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* SECTION 1: Customer Actions, Cart, Orders & Account */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-1">
                  Đơn Hàng &amp; Tiện Ích
                </span>

                <div className="space-y-2">
                  {/* Cart Item Button */}
                  <button
                    onClick={handleCartClick}
                    className="w-full p-3 rounded-xl border border-stone-200 hover:border-emerald-700 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4 text-emerald-800" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-stone-900 group-hover:text-emerald-950">
                          Giỏ Hàng Của Bạn
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {cartCount > 0
                            ? `${cartCount} sản phẩm đang chờ thanh toán`
                            : 'Chưa có sản phẩm nào trong giỏ'}
                        </div>
                      </div>
                    </div>
                    {cartCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white font-bold text-[11px] tabular-nums">
                        {cartCount}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-700 transition-colors" />
                    )}
                  </button>

                  {/* My Orders Button */}
                  {onOpenOrders && (
                    <button
                      onClick={handleOrdersClick}
                      className="w-full p-3 rounded-xl border border-stone-200 hover:border-emerald-700 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-blue-800" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-stone-900 group-hover:text-emerald-950">
                            Tiến Độ Đơn Hàng
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Tra cứu hành trình vận chuyển &amp; giao nhận
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-700 transition-colors" />
                    </button>
                  )}

                  {/* Member & Admin Account Button */}
                  {onOpenMemberAuth && (
                    <button
                      onClick={handleAuthClick}
                      className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between group text-left ${
                        currentUser
                          ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50'
                          : 'border-stone-200 hover:border-emerald-700 bg-white hover:bg-emerald-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSuperAdmin
                              ? 'bg-rose-100 text-rose-800'
                              : isAdmin
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {isSuperAdmin ? (
                            <ShieldAlert className="w-4 h-4 text-rose-700" />
                          ) : isAdmin ? (
                            <ShieldCheck className="w-4 h-4 text-purple-700" />
                          ) : (
                            <User className="w-4 h-4 text-emerald-800" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
                            <span>
                              {currentUser
                                ? isAdmin
                                  ? 'Cổng Quản Trị Viên'
                                  : 'Tài Khoản Thành Viên'
                                : 'Đăng Ký / Đăng Nhập Thành Viên'}
                            </span>
                            {isSuperAdmin ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-bold uppercase">
                                Super Admin
                              </span>
                            ) : isAdmin ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-200 text-purple-900 font-bold uppercase">
                                Admin
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono truncate max-w-[200px]">
                            {currentUser ? currentUser.email : 'Tùy chọn nhận ưu đãi và quản lý'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-700 transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION 2: Navigation Links to Sections on Store Page */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block px-1">
                  Khám Phá Sủi Xanh
                </span>

                <div className="space-y-1.5">
                  <button
                    onClick={() => handleNavClick('fizz-lab-section')}
                    className="w-full p-2.5 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FlaskConical className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-[13px] font-semibold text-stone-800 group-hover:text-emerald-950 block">
                          Phòng Thí Nghiệm Sủi
                        </span>
                        <span className="text-[11px] text-stone-400 block">
                          Thử nghiệm cơ chế làm sạch sinh học &amp; sủi bọt
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700" />
                  </button>

                  <button
                    onClick={() => handleNavClick('products-section')}
                    className="w-full p-2.5 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-[13px] font-semibold text-stone-800 group-hover:text-emerald-950 block">
                          Sản Phẩm &amp; Combo Giảm Giá
                        </span>
                        <span className="text-[11px] text-stone-400 block">
                          Gói viên nén thử nghiệm, combo bình thủy tinh &amp; refill
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700" />
                  </button>

                  <button
                    onClick={() => handleNavClick('eco-calculator-section')}
                    className="w-full p-2.5 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calculator className="w-4 h-4 text-emerald-800 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-[13px] font-semibold text-stone-800 group-hover:text-emerald-950 block">
                          Công Cụ Tính Giảm Rác Thải
                        </span>
                        <span className="text-[11px] text-stone-400 block">
                          Ước lượng lượng vỏ cam tái chế &amp; chai nhựa giảm thiểu
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700" />
                  </button>

                  <button
                    onClick={() => handleNavClick('media-section')}
                    className="w-full p-2.5 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Share2 className="w-4 h-4 text-stone-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-[13px] font-semibold text-stone-800 group-hover:text-emerald-950 block">
                          Kênh Truyền Thông &amp; Mạng Xã Hội
                        </span>
                        <span className="text-[11px] text-stone-400 block">
                          Fanpage Sủi Xanh, câu chuyện startup &amp; phản hồi
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50/90 text-center space-y-1">
              <p className="text-[11px] text-stone-500 font-medium">
                Dự án Viên nén sủi sinh học từ phụ phẩm vỏ cam
              </p>
              <p className="text-[10px] text-stone-400">
                100% Nguyên liệu thiên nhiên · Giảm thiểu rác thải nhựa
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
