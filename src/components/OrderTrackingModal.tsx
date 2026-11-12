import React, { useState, useEffect } from 'react';
import { getOrderById } from '../services/orderService';
import { OrderInfo, OrderStatus } from '../types';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  RotateCcw,
  PhoneCall,
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  onGoToProducts?: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
  onGoToProducts,
}) => {
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Manual search state
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualSearchAttempted, setManualSearchAttempted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const activeOrderId =
      initialOrderId || localStorage.getItem('sui_xanh_latest_order_id');

    if (activeOrderId) {
      loadOrder(activeOrderId);
    } else {
      setOrder(null);
      setIsLoading(false);
    }
  }, [isOpen, initialOrderId]);

  const loadOrder = async (orderId: string) => {
    setIsLoading(true);
    setManualSearchAttempted(false);
    try {
      const data = await getOrderById(orderId.trim());
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setIsLoading(true);
    setManualSearchAttempted(true);
    try {
      const data = await getOrderById(manualCode.trim());
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (val: number) => val.toLocaleString('vi-VN') + ' đ';

  const getStepState = (
    currentStatus: OrderStatus,
    step: 'pending' | 'preparing' | 'shipping' | 'delivered'
  ) => {
    const orderRanks: Record<OrderStatus, number> = {
      pending: 1,
      preparing: 2,
      shipping: 3,
      delivered: 4,
      returned: 0,
      cancelled: 0,
    };

    const stepRanks = {
      pending: 1,
      preparing: 2,
      shipping: 3,
      delivered: 4,
    };

    const currentRank = orderRanks[currentStatus] || 1;
    const targetRank = stepRanks[step];

    if (currentStatus === 'cancelled' || currentStatus === 'returned') return 'cancelled';
    if (currentRank > targetRank) return 'completed';
    if (currentRank === targetRank) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header without unnecessary icons or emojis */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {order ? 'Thông Tin & Tiến Độ Đơn Hàng' : 'Đơn Hàng Của Bạn'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-stone-500 flex items-center justify-center gap-2.5 text-[13px]">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-800" />
              <span>Đang tải thông tin đơn hàng...</span>
            </div>
          ) : order ? (
            /* HAS PLACED AN ORDER: DIRECTLY DISPLAY IT */
            <div className="space-y-6">
              {/* Top Banner with ID & Date */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                    Mã đơn hàng
                  </span>
                  <strong className="text-base font-extrabold text-stone-900 font-mono">
                    {order.id}
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Thời gian đặt</span>
                  <span className="text-[12px] font-medium text-stone-700">{order.createdAt}</span>
                </div>
              </div>

              {/* Status Section */}
              {order.status === 'cancelled' ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[13px] flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Đơn hàng này đã hủy</strong>
                    <span className="text-[12px] text-rose-700">
                      Nếu có thắc mắc, quý khách vui lòng liên hệ bộ phận hỗ trợ khách hàng.
                    </span>
                  </div>
                </div>
              ) : order.status === 'returned' ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[13px] flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Đơn hàng đã hoàn tiền / Trả hàng</strong>
                    <span className="text-[12px] text-rose-700">
                      Yêu cầu hoàn trả của bạn đã được ghi nhận và xử lý hoàn tất.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-stone-400">
                    Tiến Độ Vận Chuyển
                  </h4>

                  {/* 4 Steps timeline without emoji */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    {/* Step 1 */}
                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                          getStepState(order.status, 'pending') === 'completed' ||
                          getStepState(order.status, 'pending') === 'current'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="block font-bold text-stone-800">Đặt hàng</span>
                      <span className="text-[10px] text-stone-500">Đã tiếp nhận</span>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                          getStepState(order.status, 'preparing') === 'completed'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : getStepState(order.status, 'preparing') === 'current'
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-2xs'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="block font-bold text-stone-800">Chuẩn bị</span>
                      <span className="text-[10px] text-stone-500">Đóng gói</span>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                          getStepState(order.status, 'shipping') === 'completed'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : getStepState(order.status, 'shipping') === 'current'
                            ? 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-2xs'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="block font-bold text-stone-800">Vận chuyển</span>
                      <span className="text-[10px] text-stone-500">
                        {order.status === 'shipping'
                          ? order.estimatedDeliveryDays || '3 - 5 ngày'
                          : 'Đang giao'}
                      </span>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                          getStepState(order.status, 'delivered') === 'completed' ||
                          getStepState(order.status, 'delivered') === 'current'
                            ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-2xs'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="block font-bold text-stone-800">Đã giao</span>
                      <span className="text-[10px] text-stone-500">Hoàn tất</span>
                    </div>
                  </div>

                  {/* Informational Banner */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[12px] space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        {order.status === 'pending' &&
                          'Đơn hàng đã được ghi nhận vào hệ thống và đang chờ xác nhận.'}
                        {order.status === 'preparing' &&
                          'Sủi Xanh đang chuẩn bị và đóng gói sản phẩm gửi đến bạn.'}
                        {order.status === 'shipping' &&
                          `Đơn hàng đang trên đường giao. Thời gian dự kiến: ${order.estimatedDeliveryDays || '3 - 5 ngày'}.`}
                        {order.status === 'delivered' &&
                          'Đơn hàng đã được giao thành công và hoàn tất. Cảm ơn bạn đã đồng hành cùng giải pháp sinh học Sủi Xanh!'}
                      </span>
                    </div>
                  </div>

                  {/* Delivered / Completed Order & Refund Support Policy */}
                  {order.status === 'delivered' && (
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-[12px] space-y-2">
                      <div className="flex items-center justify-between text-stone-800">
                        <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Đã nhận hàng trọn vẹn
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">Bảo hành 7 ngày</span>
                      </div>
                      <p className="text-[11.5px] text-stone-600 leading-relaxed">
                        Chính sách đổi trả &amp; hoàn tiền: Nếu bạn chưa nhận được đơn hoặc muốn yêu cầu hoàn tiền vì bất kỳ lý do gì, vui lòng liên hệ hotline:
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <a
                          href="tel:0912345678"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-850 text-white rounded-lg font-bold text-[11px] transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Hotline Hỗ Trợ: 0912 345 678</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Destination and Items Summary */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Người nhận:</span>
                  <strong className="text-stone-900">
                    {order.customerName} - {order.phone}
                  </strong>
                </div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-stone-500 shrink-0">Địa chỉ giao:</span>
                  <span className="text-stone-800 text-right">{order.address}</span>
                </div>
                {order.note && (
                  <div className="flex justify-between items-start gap-3 text-[11px] text-stone-600">
                    <span className="text-stone-500 shrink-0">Ghi chú:</span>
                    <span className="text-right">{order.note}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-stone-200/60 pt-2 font-bold text-stone-900">
                  <span>Tổng thanh toán:</span>
                  <span className="text-emerald-900 tabular-nums">
                    {formatCurrency(order.total || 0)} (
                    {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR'})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* HAS NOT PLACED AN ORDER YET */
            <div className="py-8 px-2 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-stone-400" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-stone-900">
                  Bạn chưa có đơn hàng nào
                </h4>
                <p className="text-[13px] text-stone-600 leading-relaxed max-w-sm mx-auto text-balance">
                  Bạn chưa đặt đơn hàng nào tại Sủi Xanh. Sau khi đặt hàng, tiến độ vận chuyển và thông tin đơn hàng sẽ tự động xuất hiện tại đây mà không cần nhập mã.
                </p>
              </div>

              {onGoToProducts && (
                <button
                  onClick={() => {
                    onClose();
                    onGoToProducts();
                  }}
                  className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-850 text-white rounded-xl font-bold text-[13px] transition-colors shadow-2xs"
                >
                  Khám Phá Sản Phẩm Sủi Xanh
                </button>
              )}
            </div>
          )}

          {/* Optional small accordion to search by code if on another device */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            {!showManualSearch ? (
              <button
                onClick={() => setShowManualSearch(true)}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline underline-offset-4"
              >
                Tra cứu bằng mã đơn hàng khác?
              </button>
            ) : (
              <form onSubmit={handleManualSearch} className="space-y-2 text-left">
                <label className="block text-[11px] font-semibold text-stone-600">
                  Nhập mã đơn hàng:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ví dụ: SX-2026-1024"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[12px] focus:bg-white focus:outline-none focus:border-emerald-700"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white text-[12px] font-bold rounded-lg transition-colors"
                  >
                    Tìm
                  </button>
                </div>
                {manualSearchAttempted && !order && !isLoading && (
                  <p className="text-[11px] text-rose-600">
                    Không tìm thấy đơn hàng với mã "{manualCode}". Vui lòng kiểm tra lại.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold text-[12px] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
