import React, { useState } from 'react';
import { useAuth } from '../firebase/authContext';
import { X, ShieldCheck, User, LogOut, CheckCircle2, Package, ArrowRight, RefreshCw } from 'lucide-react';

interface MemberAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onOpenOrders: () => void;
}

export const MemberAuthModal: React.FC<MemberAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onOpenOrders,
}) => {
  const { currentUser, isAdmin, loginWithGoogle, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Firebase Login Error:', err);
      if (err?.code === 'auth/unauthorized-domain') {
        const hostname = window.location.hostname;
        setAuthError(
          `DOMAIN_UNAUTHORIZED:${hostname}`
        );
      } else if (err?.code === 'auth/popup-blocked') {
        setAuthError('Trình duyệt đang chặn cửa sổ pop-up đăng nhập. Vui lòng cho phép pop-up và thử lại.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do not show an aggressive error
      } else {
        setAuthError(err?.message || 'Đăng nhập Google không thành công. Vui lòng thử lại.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-800" />
            <h3 className="text-base font-bold text-stone-900">
              {currentUser ? 'Tài Khoản Thành Viên' : 'Thành Viên Sủi Xanh'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {currentUser ? (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-base shrink-0">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                </div>
                <div className="space-y-0.5 overflow-hidden flex-1">
                  <h4 className="text-sm font-bold text-stone-900 truncate">
                    {currentUser.displayName || 'Thành viên Sủi Xanh'}
                  </h4>
                  <p className="text-[12px] text-stone-500 font-mono truncate">
                    {currentUser.email}
                  </p>
                </div>
                {isAdmin && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold uppercase shrink-0 border border-amber-300">
                    Admin
                  </span>
                )}
              </div>

              {/* Admin Access Section */}
              {isAdmin && (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-[13px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Quyền Quản Trị Hệ Thống Sủi Xanh</span>
                  </div>
                  <p className="text-[12px] text-emerald-900/80 leading-relaxed">
                    Hệ thống nhận diện tài khoản của bạn là Quản trị viên. Bạn có toàn quyền theo dõi và cập nhật tiến độ đơn hàng.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-850 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>Mở Bảng Quản Trị Đơn Hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Customer Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrders();
                  }}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors"
                >
                  <Package className="w-4 h-4 text-stone-600" />
                  <span>Xem Tiến Độ Đơn Hàng Của Bạn</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-stone-500 hover:text-rose-700 font-medium text-[12px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <h4 className="text-base font-bold text-stone-900">
                  Đăng Ký &amp; Đăng Nhập Thành Viên
                </h4>
                <p className="text-[12px] text-stone-600 leading-relaxed text-balance">
                  Đăng nhập tùy chọn để nhận thông tin cập nhật, ưu đãi kinh tế tuần hoàn và quản lý đơn hàng thuận tiện. Quý khách vẫn có thể đặt mua hàng bình thường mà không cần tài khoản.
                </p>
              </div>

              {authError && (
                authError.startsWith('DOMAIN_UNAUTHORIZED:') ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-[12px] space-y-2 text-left">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <span>Cần cấp phép tên miền trong Firebase</span>
                    </div>
                    <p className="text-[11.5px] text-amber-900/90 leading-relaxed">
                      Tên miền <strong>{authError.split(':')[1]}</strong> chưa nằm trong danh sách <em>Authorized domains</em> của Firebase. Để đăng nhập trên Vercel:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] text-amber-900">
                      <li>Truy cập mục Cài đặt xác thực Firebase bên dưới.</li>
                      <li>Tại thẻ <strong>Authorized domains</strong>, bấm <strong>Add domain</strong>.</li>
                      <li>Nhập <code>{authError.split(':')[1]}</code> và nhấn <strong>Save</strong>.</li>
                    </ol>
                    <a
                      href="https://console.firebase.google.com/project/rock-legacy-5vc14/authentication/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 py-1.5 px-3 rounded-lg bg-amber-800 text-white font-bold text-[11px] hover:bg-amber-900 transition-colors shadow-2xs"
                    >
                      Mở Cài Đặt Firebase Console
                    </a>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[12px]">
                    {authError}
                  </div>
                )
              )}

              <div className="space-y-3 pt-1">
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-850 disabled:opacity-70 text-white font-bold text-[13px] flex items-center justify-center gap-2.5 shadow-sm transition-all"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang kết nối tài khoản Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                      </svg>
                      <span>Tiếp Tục Với Tài Khoản Google</span>
                    </>
                  )}
                </button>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Quyền lợi thành viên:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                    <li>Nhận bản tin quy trình thu gom và tái chế vỏ cam</li>
                    <li>Ưu đãi gói refill định kỳ tiết kiệm chi phí</li>
                    <li>Lưu lịch sử và theo dõi đơn hàng tiện lợi</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
