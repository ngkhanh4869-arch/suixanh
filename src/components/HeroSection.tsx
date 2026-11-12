import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, RefreshCw, Leaf } from 'lucide-react';
import { Product } from '../types';
import { ProductPlaceholder } from './ProductPlaceholder';

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
  return (
    <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-[#f0f6f2] via-[#faf7f0] to-[#FBFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Direct natural descriptor with botanical eco badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-emerald-950 font-medium text-[12px]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Dự án khởi nghiệp kinh tế tuần hoàn từ phụ phẩm vỏ cam</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-stone-900 tracking-tight leading-[1.15] text-balance">
              Viên nén sủi khử mùi &amp; làm sạch bồn cầu từ phụ phẩm vỏ cam
            </h1>

            <p className="text-[14px] text-stone-600 leading-relaxed max-w-2xl">
              Giải pháp vệ sinh sinh học thế hệ mới thay thế hoàn toàn nước tẩy hóa chất độc hại.
              Tận dụng nguồn vỏ cam thải bỏ từ các quán nước ép, Sủi Xanh mang đến hương cam tươi mát,
              khử sạch mùi hôi hầm tự hoại, bảo vệ men sứ và an toàn tuyệt đối cho gia đình bạn.
            </p>

            {/* CTAs with citrus-first primary button & botanical secondary button */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => onBuyStarter(starterProduct)}
                className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-[13px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 group"
              >
                <span>Mua Combo Khởi Động (19.000đ)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-200" />
              </button>

              <button
                onClick={onExploreFizzLab}
                className="px-5 py-3.5 bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl font-semibold text-[13px] transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Xem Thử Nghiệm Sủi Bọt</span>
              </button>
            </div>

            {/* Meta Trust info */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-[12px] text-stone-600 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Tái chế 1.5kg vỏ cam/combo</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>pH 6.8 an toàn men sứ</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Viên nén tan chậm tự nhiên</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image Placeholder */}
          <div className="lg:col-span-5 relative">
            <ProductPlaceholder
              title="Combo Khởi Động Sủi Xanh (Gói 3 Viên Nén Tan Chậm)"
              subtitle="Vị trí hiển thị ảnh chụp thực tế: 3 viên nén sủi chiết xuất từ phụ phẩm vỏ cam tươi và phản ứng tạo bọt tự nhiên."
              aspectRatio="4/3"
              className="w-full shadow-xs bg-white/80 border-stone-200"
              badge="Khung Ảnh Sản Phẩm Mẫu"
              specs="Quy cách: Gói 3 viên nén sủi tan chậm · 25g/viên"
            />
          </div>
        </div>

        {/* Quieted Metric Strip: Slim, unified, elegant bar without competing cards */}
        <div className="mt-10 rounded-2xl bg-white/95 border border-stone-200/80 p-4 sm:p-5 shadow-2xs grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
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
