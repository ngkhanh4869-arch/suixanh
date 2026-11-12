import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { ProductPlaceholder } from './ProductPlaceholder';

export const CircularProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Thu gom vỏ cam tươi phụ phẩm',
      desc: 'Hợp tác cùng chuỗi cửa hàng nước ép, thu gom vỏ cam tươi trong ngày, tránh lãng phí và ô nhiễm bãi rác.',
    },
    {
      step: '02',
      title: 'Sấy lạnh & Chiết xuất tinh chất',
      desc: 'Rửa sạch bằng nước muối loãng, sấy nhiệt độ thấp 45°C để giữ nguyên 90%+ hoạt chất D-Limonene quý giá.',
    },
    {
      step: '03',
      title: 'Phối trộn tạo sủi sinh học',
      desc: 'Kết hợp bột vỏ cam micro với Baking soda thực phẩm và Axit citric tự nhiên, không hóa chất độc hại.',
    },
    {
      step: '04',
      title: 'Dập viên nén ma trận tan chậm',
      desc: 'Ứng dụng chất mang thực vật tự nhiên, giúp viên chỉ tan từng lớp khi xả nước, kéo dài 15 - 20 ngày/viên.',
    },
    {
      step: '05',
      title: 'Ứng dụng thực tế tại hộ gia đình',
      desc: 'Viên nén giải phóng tinh chất qua từng lần xả nước, mang lại hương cam dễ chịu và hỗ trợ khử mùi bồn cầu hiệu quả.',
    },
  ];

  return (
    <section className="py-16 bg-[#FBFBF7] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Image showcase */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xs p-4 space-y-4">
              <ProductPlaceholder
                title="Quy Trình Thu Gom &amp; Chiết Xuất Vỏ Cam"
                subtitle="Vị trí hiển thị ảnh tư liệu thực tế: Thu gom vỏ cam phế phẩm từ các quán nước ép, quá trình sấy lạnh 45°C và chiết xuất tinh dầu D-Limonene."
                aspectRatio="4/3"
                badge="Khung Ảnh Tư Liệu Nghiên Cứu"
                specs="Nhiệt độ sấy lạnh: 45°C · Giữ lại >90% tinh chất D-Limonene"
              />

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-950">
                  <RefreshCcw className="w-4 h-4 text-emerald-700" />
                  <span>Mô Hình Kinh Tế Tuần Hoàn Từ Vỏ Cam</span>
                </div>
                <p className="text-[12px] text-stone-600 leading-relaxed">
                  Tại Việt Nam, hơn 150 tấn vỏ cam bị vứt bỏ mỗi ngày. Sủi Xanh tái sinh nguồn phụ phẩm này
                  thành viên nén sinh học khử sạch mùi hôi bồn cầu, bảo vệ sức khỏe và hệ vi sinh xử lý chất thải.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Legitimate Numbered Sequence Steps */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight text-balance">
                Hành Trình Tái Sinh Của Vỏ Cam Phụ Phẩm
              </h2>
            </div>

            <div className="space-y-3">
              {steps.map((st) => (
                <div
                  key={st.step}
                  className="flex items-start gap-4 p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                    {st.step}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-[13px] font-bold text-stone-900">{st.title}</h4>
                    <p className="text-[12px] text-stone-600 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
