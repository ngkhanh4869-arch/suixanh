import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { OrangeHeroCanvas } from './OrangeHeroCanvas';

interface HeroSectionProps {
  onBuyStarter: (product: Product) => void;
  starterProduct: Product;
  onExploreFizzLab: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBuyStarter,
  starterProduct,
  onExploreFizzLab,
}) => {
  const [showLabels, setShowLabels] = useState(true);
  const [resetCounter, setResetCounter] = useState(0);

  return (
    <section className="relative bg-[#FBFBF7]">
      {/* Full-Width Interactive 3D Citrus Stage with Floating Text Overlay */}
      <div className="relative w-full min-h-[650px] lg:min-h-[660px] flex items-start lg:items-center overflow-hidden bg-gradient-to-br from-[#ebf3ed] via-[#faf6ec] to-[#fcefd9] border-b border-stone-200/80">
        {/* Interactive 3D Orange + Rising Citrus Mist Canvas */}
        <OrangeHeroCanvas
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels((prev) => !prev)}
          resetCounter={resetCounter}
          onResetView={() => setResetCounter((c) => c + 1)}
        />

        {/* Soft Directional Legibility Scrim (pointer-events-none so dragging works everywhere) */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#faf7f0]/92 via-[#faf7f0]/55 to-transparent lg:bg-gradient-to-r lg:from-[#faf7f0]/92 lg:via-[#faf7f0]/62 lg:to-transparent"
          aria-hidden="true"
        />

        {/* Floating Foreground Typography & Conversion Actions */}
        <div className="relative z-10 pointer-events-none max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-56 lg:py-16">
          <div className="max-w-xl space-y-5">
            {/* Unboxed editorial metadata lead-in (zero pill enclosures or pulsing dots) */}
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-emerald-900">
              <span>Kinh tế tuần hoàn Việt Nam</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Phụ phẩm vỏ cam tươi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-stone-900 tracking-tight leading-[1.14] text-balance">
              Viên nén sủi khử mùi &amp; làm sạch bồn cầu từ phụ phẩm vỏ cam
            </h1>

            <p className="text-[14px] sm:text-[15px] text-stone-700 leading-relaxed max-w-lg">
              Giải pháp vệ sinh sinh học thế hệ mới thay thế nước tẩy hóa chất nồng gắt.
              Tận dụng nguồn vỏ cam thu gom từ các quán nước ép, Sủi Xanh giải phóng tinh dầu
              cam tươi mát, khử sạch mùi hôi hầm tự hoại và an toàn cho bề mặt men sứ.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onBuyStarter(starterProduct)}
                className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-[13px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 group whitespace-nowrap shrink-0"
              >
                <span>Mua Bộ Khởi Động ({starterProduct.price.toLocaleString('vi-VN')}đ)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-200" />
              </button>

              <button
                type="button"
                onClick={onExploreFizzLab}
                className="px-5 py-3.5 bg-white/95 hover:bg-emerald-50 text-emerald-950 border border-stone-200 rounded-xl font-semibold text-[13px] transition-colors flex items-center gap-2 shadow-2xs whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Xem Thử Nghiệm Sủi Bọt</span>
              </button>
            </div>

            {/* Clean Unboxed Trust Metadata */}
            <div className="pt-4 border-t border-stone-300/60 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-medium text-stone-700">
              <span>Tái chế 500g vỏ cam / viên</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>pH 6.8 an toàn men sứ</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Tan chậm 15 – 20 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unified 4-Column Metric Strip in Full-Width Row Below Hero Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pt-8 pb-8">
        <div className="rounded-2xl bg-white border border-stone-200/90 p-4 sm:p-5 shadow-2xs grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] font-medium text-stone-500">Tỷ lệ hòa tan tự nhiên</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-900 tabular-nums">98.5%</div>
            <p className="text-[11px] text-stone-400">Tan sạch hoàn toàn, không cặn</p>
          </div>

          <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
            <div className="text-[11px] font-medium text-stone-500">Thời gian sử dụng</div>
            <div className="text-xl sm:text-2xl font-bold text-orange-600 tabular-nums">15 – 20 ngày</div>
            <p className="text-[11px] text-stone-400">300 – 400 lần xả nước/viên</p>
          </div>

          <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
            <div className="text-[11px] font-medium text-stone-500">Độ pH an toàn men sứ</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-900 tabular-nums">pH 6.5 – 7.0</div>
            <p className="text-[11px] text-stone-400">Bảo vệ hệ vi sinh tự hoại</p>
          </div>

          <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
            <div className="text-[11px] font-medium text-stone-500">Người dùng hài lòng</div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">84.4%</div>
            <p className="text-[11px] text-stone-400">Sẵn sàng đổi sang Sủi Xanh</p>
          </div>
        </div>
      </div>
    </section>
  );
};
