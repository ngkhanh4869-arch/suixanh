import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const shippingFee = rawSubtotal >= 150000 || rawSubtotal === 0 ? 0 : 25000;
  const finalTotal = Math.max(0, rawSubtotal - discount + shippingFee);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'SUIXANH10') {
      setDiscount(10000);
      setCouponMessage('Đã áp dụng mã giảm giá 10.000 đ!');
    } else if (couponCode.trim().toUpperCase() === 'ECOFRIZZ') {
      setDiscount(15000);
      setCouponMessage('Đã áp dụng mã giảm giá 15.000 đ từ chiến dịch sống xanh!');
    } else {
      setCouponMessage('Mã giảm giá không hợp lệ. Hãy thử: SUIXANH10');
    }
  };

  const formatCurrency = (val: number) => val.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">Giỏ Hàng Của Bạn</h2>
              <span className="text-[12px] text-stone-500 tabular-nums">
                ({items.reduce((acc, item) => acc + item.quantity, 0)} món)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                  <X className="w-6 h-6" />
                </div>
                <p className="text-[13px] text-stone-500 font-medium">Giỏ hàng của bạn đang trống</p>
                <p className="text-[11px] text-stone-400">
                  Hãy thêm Combo Khởi Động hoặc Gói Refill để bắt đầu bảo vệ bồn cầu nhà bạn nhé!
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-xl bg-stone-100/90 border border-stone-200/80 flex flex-col items-center justify-center shrink-0 text-stone-500 p-1 text-center font-mono text-[9px]">
                    <Package className="w-4 h-4 text-emerald-800 mb-0.5" />
                    <span className="line-clamp-1 leading-tight">[Ảnh Mẫu]</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-stone-900 truncate">{product.name}</h3>
                    <div className="text-[11px] text-stone-500 truncate mt-0.5">{product.tagline}</div>
                    <div className="mt-1 text-[13px] font-extrabold text-emerald-900 tabular-nums">
                      {formatCurrency(product.price)}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-[12px] font-bold tabular-nums text-stone-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/70 space-y-4">
              {/* Coupon input */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Mã ưu đãi (VD: SUIXANH10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-[12px] focus:outline-none focus:border-emerald-600 font-mono uppercase"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-[12px] font-semibold transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponMessage && (
                  <div className="text-[11px] text-emerald-700 font-medium">{couponMessage}</div>
                )}
              </div>

              {/* Free ship progress */}
              <div className="p-2.5 bg-white rounded-xl border border-stone-200/80 text-[11px]">
                {rawSubtotal >= 150000 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Đơn hàng đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!
                  </span>
                ) : (
                  <span className="text-stone-500">
                    Mua thêm{' '}
                    <strong className="text-emerald-900 tabular-nums font-bold">
                      {formatCurrency(150000 - rawSubtotal)}
                    </strong>{' '}
                    để được miễn phí vận chuyển.
                  </span>
                )}
              </div>

              {/* Price details */}
              <div className="space-y-1.5 text-[12px] text-stone-600">
                <div className="flex justify-between">
                  <span>Tạm tính hàng:</span>
                  <span className="tabular-nums font-medium">{formatCurrency(rawSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Mã giảm giá:</span>
                    <span className="tabular-nums font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <span className="tabular-nums font-medium">
                    {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-orange-950 text-base tabular-nums">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-[13px] shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
