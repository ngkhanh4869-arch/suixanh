import React, { useState } from 'react';
import { Product } from '../types';
import { Check, Plus, ShoppingCart } from 'lucide-react';
import { ProductPlaceholder } from './ProductPlaceholder';

interface ProductSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  onAddToCart,
  onBuyNow,
}) => {
  const [filter, setFilter] = useState<'all' | 'combo' | 'refill' | 'trial'>('all');

  const filteredProducts = products.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <section id="products-section" className="py-16 bg-[#FBFBF7] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header without boilerplate eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight text-balance">
              Các Gói Viên Nén Sủi Xanh
            </h2>
            <p className="text-[13px] text-stone-600 mt-1 max-w-xl">
              100% công thức từ phụ phẩm vỏ cam tự nhiên, tan chậm khử sạch mùi hôi và bảo vệ bề mặt men sứ bồn cầu.
            </p>
          </div>

          {/* Filter segment tabs with Botanical Green active state */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl self-start md:self-auto border border-stone-200 shadow-2xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất Cả Gói
            </button>
            <button
              onClick={() => setFilter('combo')}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                filter === 'combo'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Gói Combo
            </button>
            <button
              onClick={() => setFilter('refill')}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                filter === 'refill'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Viên Nạp Refill
            </button>
            <button
              onClick={() => setFilter('trial')}
              className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                filter === 'trial'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Gói Dùng Thử
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className={`flex flex-col rounded-2xl border transition-all duration-300 bg-white overflow-hidden group ${
                  product.isPopular
                    ? 'border-emerald-700/80 shadow-md ring-1 ring-emerald-700/20'
                    : 'border-stone-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                {/* Product Image Placeholder using ProductPlaceholder */}
                <div className="p-3 bg-stone-50/60 border-b border-stone-100">
                  <ProductPlaceholder
                    title={product.name}
                    subtitle={product.tagline}
                    aspectRatio="4/3"
                    badge={
                      product.category === 'combo'
                        ? 'Ảnh Bộ Combo Thực Tế'
                        : product.category === 'refill'
                        ? 'Ảnh Hộp Giấy Kraft Refill'
                        : 'Ảnh Gói Dùng Thử'
                    }
                    specs={product.duration}
                  />
                </div>

                {/* Product Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 mb-1">
                      <span>
                        {product.category === 'combo'
                          ? 'Trọn Bộ Thiết Bị'
                          : product.category === 'refill'
                          ? 'Gói Nạp Tiết Kiệm'
                          : 'Trải Nghiệm Mẫu'}
                      </span>
                      {product.isPopular && (
                        <span className="text-emerald-950 bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          Khuyên Dùng
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-stone-900 leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[12px] text-stone-500 mt-1 line-clamp-2">
                      {product.tagline}
                    </p>

                    {/* Price baseline */}
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="text-xl font-extrabold text-stone-900 tabular-nums">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] text-stone-400 line-through tabular-nums">
                            {formatCurrency(product.originalPrice)}
                          </span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded tabular-nums">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-[11px] text-emerald-800 font-medium">
                      {product.duration}
                    </div>

                    {/* Features list */}
                    <ul className="mt-4 space-y-2 pt-3 border-t border-stone-100 text-[12px] text-stone-600">
                      {product.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions: Valencia Orange Buy Now & Botanical Add To Cart */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-2 px-3 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50 text-stone-700 hover:text-emerald-950 font-semibold text-[12px] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Giỏ</span>
                    </button>

                    <button
                      onClick={() => onBuyNow(product)}
                      className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-[12px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-200" />
                      <span>Mua Ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
