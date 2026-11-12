import React, { useState } from 'react';
import { Leaf, DollarSign, Trash2, Award, Users } from 'lucide-react';

export const EcoCalculator: React.FC = () => {
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [toiletCount, setToiletCount] = useState<number>(2);

  // Math models:
  // Average flush: 4 flushes/person/day
  // 1 tablet Sủi Xanh lasts ~350 flushes (approx 20 days for 4 people with 2 toilets)
  // 1 tablet uses ~500g of fresh orange peel equivalent
  // Plastic bottles saved: 1 plastic cleaner bottle used per bathroom per 1.5 months
  const orangePeelKgPerYear = Math.round(peopleCount * 4.5 * toiletCount);
  const plasticBottlesSaved = Math.round(toiletCount * 8);
  const moneySavedVND = Math.round(toiletCount * 320000);
  const co2ReducedKg = (orangePeelKgPerYear * 0.75).toFixed(1);

  return (
    <section id="eco-calculator-section" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Controls Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight text-balance">
                Tính Lượng Rác Thải &amp; Chi Phí Giảm Được
              </h2>
              <p className="text-[13px] text-stone-600 mt-2">
                Mỗi viên nén Sủi Xanh được sản xuất từ phụ phẩm vỏ cam thu gom trực tiếp từ các quán nước ép,
                thay thế các chai chất tẩy rửa hóa học dùng một lần.
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-5 bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
              {/* Slider 1: People Count */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[12px] font-bold text-stone-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Số thành viên trong nhà:</span>
                  </label>
                  <span className="text-base font-extrabold text-emerald-950 tabular-nums">
                    {peopleCount} người
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  className="w-full accent-emerald-700 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>1 người (Ở trọ)</span>
                  <span>4 người (Hộ gia đình)</span>
                  <span>8+ người</span>
                </div>
              </div>

              {/* Slider 2: Toilets */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[12px] font-bold text-stone-700 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-orange-600" />
                    <span>Số phòng vệ sinh (bồn cầu):</span>
                  </label>
                  <span className="text-base font-extrabold text-orange-950 tabular-nums">
                    {toiletCount} bồn cầu
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={toiletCount}
                  onChange={(e) => setToiletCount(Number(e.target.value))}
                  className="w-full accent-orange-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>1 phòng</span>
                  <span>2 phòng</span>
                  <span>4 phòng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Display Right Column: Quieted, unified aesthetic */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Metric 1 */}
              <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-stone-700">
                    Vỏ cam tươi được tái chế
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-emerald-950 tabular-nums">
                    {orangePeelKgPerYear} kg
                  </div>
                  <p className="text-[12px] text-stone-500 mt-1">
                    Vỏ cam phế phẩm mỗi năm được chuyển đổi thành tinh dầu khử mùi sinh học có giá trị.
                  </p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-stone-700">
                    Chai nhựa hóa chất giảm
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-orange-950 tabular-nums">
                    {plasticBottlesSaved} chai
                  </div>
                  <p className="text-[12px] text-stone-500 mt-1">
                    Loại bỏ chai nhựa dùng một lần nhờ chuyển sang viên nén sinh học từ phụ phẩm vỏ cam.
                  </p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-stone-700">
                    Tiết kiệm chi phí gia đình
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-stone-900 tabular-nums">
                    {moneySavedVND.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[12px] text-stone-500 mt-1">
                    Tiết kiệm so với việc phải mua viên thả bồn cầu nhập khẩu hoặc dịch vụ thông tắc hầm cầu.
                  </p>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-stone-700">
                    Giảm phát thải CO₂e
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                    CO₂
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-emerald-900 tabular-nums">
                    {co2ReducedKg} kg CO₂e
                  </div>
                  <p className="text-[12px] text-stone-500 mt-1">
                    Ngăn chặn khí methane và CO₂ sinh ra khi vỏ cam bị thối rữa tại các bãi rác lộ thiên.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
