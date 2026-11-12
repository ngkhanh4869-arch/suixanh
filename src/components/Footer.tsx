import React from 'react';
import { Droplets, Sparkles } from 'lucide-react';

interface FooterProps {
  onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  return (
    <footer className="bg-[#f5ede0] text-[#5f4733] text-[12px] border-t border-[#dfd2be] relative overflow-hidden">
      {/* Subtle craft paper watermark pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#c2410c_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          {/* Brand info with citrus packaging stamp */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-[#382314] tracking-tight">
                SỦI XANH
              </span>
            </div>

            <p className="text-[#6d533e] text-[12px] leading-relaxed">
              Viên nén sủi khử mùi &amp; làm sạch bồn cầu từ phụ phẩm vỏ cam. Giải pháp sinh học tiên phong
              cho không gian vệ sinh sạch lành, bảo vệ sức khỏe và môi trường sống.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-2.5">
            <h4 className="text-[#382314] font-bold text-[13px]">Danh Mục &amp; Tính Năng</h4>
            <ul className="space-y-2 text-[#6d533e]">
              <li>
                <button
                  onClick={() => onScrollTo('fizz-lab-section')}
                  className="hover:text-orange-700 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Phòng Thí Nghiệm Sủi Bọt</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('products-section')}
                  className="hover:text-orange-700 transition-colors"
                >
                  Combo Khởi Động &amp; Gói Refill
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('eco-calculator-section')}
                  className="hover:text-orange-700 transition-colors"
                >
                  Bộ Tính Giảm Rác Thải &amp; Tiết Kiệm
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('media-section')}
                  className="hover:text-orange-700 transition-colors"
                >
                  Kênh Truyền Thông &amp; Fanpage
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Partnership */}
          <div className="space-y-2.5">
            <h4 className="text-[#382314] font-bold text-[13px]">Liên Hệ &amp; Hợp Tác</h4>
            <div className="text-[#6d533e] space-y-1.5 text-[12px]">
              <div>Email: <strong className="text-[#382314] font-mono tracking-widest">...</strong></div>
              <div>Hotline / Zalo: <strong className="text-[#382314] font-mono tracking-widest">...</strong></div>
              <div className="text-[11px] text-[#8c6b4f] pt-1">
                Tiêu chuẩn cơ sở: TCCS 01:2026/SUIXANH
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#dfd2be] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8c6b4f] text-[11px]">
          <div>
            © 2026 Sủi Xanh - Eco Fizz Vietnam. Bản quyền thuộc về Dự án Sủi Xanh.
          </div>
          <div className="text-[#6d533e]">
            Giải pháp khử mùi sinh học từ phụ phẩm vỏ cam
          </div>
        </div>
      </div>
    </footer>
  );
};
