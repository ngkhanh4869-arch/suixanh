import React, { useState } from 'react';
import { CartItem, OrderInfo } from '../types';
import { X, CheckCircle2, ShieldCheck, QrCode, Truck, RefreshCw, Eye } from 'lucide-react';
import { createOrder } from '../services/orderService';
import { useAuth } from '../firebase/authContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: OrderInfo) => void;
  onOpenTracking?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  onOpenTracking,
}) => {
  const { currentUser } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('cod');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<OrderInfo | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const shippingFee = rawSubtotal >= 150000 || rawSubtotal === 0 ? 0 : 25000;
  const total = rawSubtotal + shippingFee;

  const formatCurrency = (val: number) => val.toLocaleString('vi-VN') + ' đ';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    const orderId = 'SX-2026-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderInfo = {
      id: orderId,
      userId: currentUser?.uid,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || currentUser?.email || '',
      address: address.trim(),
      note: note.trim(),
      paymentMethod,
      items,
      total,
      totalAmount: total,
      status: 'pending',
      estimatedDeliveryDays: '3 - 5 ngày',
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      updatedAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      await createOrder(newOrder);
      try {
        localStorage.setItem('sui_xanh_latest_order_id', newOrder.id);
      } catch (storageErr) {
        console.warn(storageErr);
      }
      onOrderSuccess(newOrder);
      onClose();
      if (onOpenTracking) {
        onOpenTracking(newOrder.id);
      }
    } catch (err) {
      console.error('Failed to create order in Firestore:', err);
      try {
        localStorage.setItem('sui_xanh_latest_order_id', newOrder.id);
      } catch (storageErr) {
        console.warn(storageErr);
      }
      onOrderSuccess(newOrder);
      onClose();
      if (onOpenTracking) {
        onOpenTracking(newOrder.id);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setCreatedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">
              {isSubmitted ? 'Xác Nhận Đơn Hàng Thành Công' : 'Đặt Hàng Nhanh Sủi Xanh'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        {isSubmitted && createdOrder ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-stone-900">Cảm ơn bạn đã đồng hành cùng Sủi Xanh!</h4>
              <p className="text-[12px] text-stone-500 mt-1">
                Mã đơn hàng: <strong className="text-emerald-900 font-mono text-sm">{createdOrder.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-[12px] space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Người nhận:</span>
                <strong className="text-stone-900">{createdOrder.customerName} - {createdOrder.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Địa chỉ:</span>
                <span className="text-stone-800 text-right">{createdOrder.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Phương thức:</span>
                <strong className="text-emerald-800 uppercase">
                  {createdOrder.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản QR'}
                </strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-stone-900">
                <span>Tổng thanh toán:</span>
                <span className="text-emerald-900 text-sm tabular-nums">
                  {formatCurrency(createdOrder.total)}
                </span>
              </div>
            </div>

            {createdOrder.paymentMethod === 'vietqr' && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-[12px] space-y-3 text-stone-800">
                <div className="flex items-center justify-between font-bold text-emerald-950 pb-2 border-b border-stone-200">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-800" />
                    <span>Thanh Toán Chuyển Khoản VietQR</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">Tự động xác nhận</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-stone-200">
                  {/* Clean QR Graphic */}
                  <div className="w-28 h-28 bg-stone-50 rounded-lg border border-stone-300 p-2 flex flex-col items-center justify-center shrink-0">
                    <QrCode className="w-16 h-16 text-emerald-950" />
                    <span className="text-[9px] font-mono text-stone-500 mt-1">VIETQR NAPAS</span>
                  </div>

                  <div className="space-y-1 text-left text-[11px] flex-1">
                    <div>Ngân hàng: <strong>...</strong></div>
                    <div>Số tài khoản: <strong className="font-mono text-emerald-950 text-xs tracking-widest">...</strong></div>
                    <div>Chủ TK: <strong>DỰ ÁN SỦI XANH</strong></div>
                    <div>Số tiền: <strong className="font-mono text-emerald-900">{formatCurrency(createdOrder.total)}</strong></div>
                    <div>Cú pháp: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono font-bold text-emerald-900">{createdOrder.id}</code></div>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 text-center">
                  Hệ thống tự động kích hoạt giao hàng ngay khi hệ thống ngân hàng ghi nhận giao dịch.
                </p>
              </div>
            )}

            <div className="space-y-2 pt-1">
              {onOpenTracking && (
                <button
                  onClick={() => {
                    const id = createdOrder.id;
                    handleResetAndClose();
                    onOpenTracking(id);
                  }}
                  className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-850 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Tra Cứu Lộ Trình Đơn Hàng</span>
                </button>
              )}

              <button
                onClick={handleResetAndClose}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-[12px] transition-colors"
              >
                Hoàn Tất &amp; Tiếp Tục Xem Trang
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  Số điện thoại nhận hàng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  Địa chỉ giao hàng (Số nhà, đường, phường/xã, quận/huyện) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ví dụ: Căn hộ 402, Chung cư EcoGreen, Đường Nguyễn Hữu Thọ, Quận 7, TP.HCM"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1">
                  Ghi chú cho shipper (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700"
                />
              </div>

              {/* Payment selector */}
              <div>
                <label className="block text-[12px] font-semibold text-stone-700 mb-1.5">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>COD (Khi nhận hàng)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      paymentMethod === 'vietqr'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>Quét mã VietQR / MoMo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Total display */}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-stone-800">
              <span className="text-[12px] text-stone-500">Tổng thanh toán (đã gồm ship):</span>
              <span className="text-xl font-extrabold text-emerald-950 tabular-nums">
                {formatCurrency(total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-70 text-white rounded-xl font-bold text-[13px] shadow-sm transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang ghi nhận đơn hàng lên hệ thống...</span>
                </>
              ) : (
                <span>Xác Nhận Đặt Hàng Ngay</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
