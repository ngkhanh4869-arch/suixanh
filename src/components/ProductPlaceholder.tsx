import React from 'react';
import { Package, Layers, Sparkles, Camera } from 'lucide-react';

interface ProductPlaceholderProps {
  title: string;
  subtitle?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1' | 'auto';
  className?: string;
  badge?: string;
  specs?: string;
}

export const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({
  title,
  subtitle,
  aspectRatio = '4/3',
  className = '',
  badge = 'Khung Ảnh Thực Tế',
  specs,
}) => {
  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-dashed border-stone-300 bg-stone-100/70 flex flex-col items-center justify-center p-5 text-center group transition-colors hover:bg-stone-100/90 hover:border-stone-400 ${aspectClass} ${className}`}
      aria-label={`Vị trí ảnh sản phẩm: ${title}`}
    >
      {/* Drafting Crosshairs at 4 corners */}
      <span className="absolute top-2 left-2 font-mono text-[10px] text-stone-300 select-none">┌</span>
      <span className="absolute top-2 right-2 font-mono text-[10px] text-stone-300 select-none">┐</span>
      <span className="absolute bottom-2 left-2 font-mono text-[10px] text-stone-300 select-none">└</span>
      <span className="absolute bottom-2 right-2 font-mono text-[10px] text-stone-300 select-none">┘</span>

      {/* Blueprint schematic icon */}
      <div className="relative mb-2.5">
        <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-400 group-hover:scale-105 transition-transform">
          <Camera className="w-5 h-5 text-amber-600/70" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[8px] font-bold">
          SX
        </div>
      </div>

      {/* Specification title */}
      <div className="space-y-1 max-w-[85%]">
        <span className="inline-block text-[11px] font-semibold text-stone-700 tracking-tight leading-snug">
          [ {title} ]
        </span>
        {subtitle && (
          <p className="text-[10px] text-stone-500 leading-normal line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Technical framing info */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-mono text-stone-500 bg-white/90 px-2 py-0.5 rounded border border-stone-200/70">
        <span>{badge}</span>
        <span aria-hidden="true">·</span>
        <span>{aspectRatio === 'auto' ? 'Tỉ lệ linh hoạt' : `Tỉ lệ ${aspectRatio}`}</span>
      </div>

      {specs && (
        <span className="mt-1 text-[9px] text-stone-400 font-mono">
          {specs}
        </span>
      )}
    </div>
  );
};
