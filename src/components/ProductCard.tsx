import React from 'react';
import { Heart, Eye, ShoppingBag, MessageCircle, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { calculateProductPrice, formatINR } from '../utils/pricing';
import { resolveJewelleryImage } from '../assets/images';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const {
    goldRates,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    setSelectedProductForDetail,
    logWhatsAppEnquiry,
    storeSettings,
  } = useStore();

  const priceBreakdown = calculateProductPrice(product, goldRates);
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    } else {
      setSelectedProductForDetail(product);
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    logWhatsAppEnquiry(product.title, product.sku);

    const message = encodeURIComponent(
      `Hello Milora Gold & Diamonds, I am interested in exploring "${product.title}" (SKU: ${product.sku}, Approx Price: ${formatINR(priceBreakdown.finalPrice)}). Could you please share more details, video inspection, and availability?`
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#FCFBF7] border border-[#E8DCCB] hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md"
    >
      {/* Image Container with 4:3 or 1:1 Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F3EB] border-b border-[#EFE8DC]">
        {product.images && product.images.length > 0 ? (
          <img
            src={resolveJewelleryImage(product.images[0])}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('hero_bridal.jpg')) {
                target.src = '/images/hero_bridal.jpg';
              }
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-[#996515] bg-[#F5EFEB]">
            <Sparkles className="w-8 h-8 opacity-40 mb-2" />
            <span className="text-xs font-serif tracking-widest uppercase">Milora Fine Jewellery</span>
          </div>
        )}

        {/* Top Badges / Indicators (Zero-pill discipline: subtle text indicators) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestseller && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#8B6508] bg-[#FAF4E6]/90 px-2 py-0.5 border border-[#DAA520]/30 backdrop-blur-xs">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#1C1611] bg-white/90 px-2 py-0.5 border border-[#E8DCCB] backdrop-blur-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            inWishlist
              ? 'bg-[#8B6508] text-white shadow-sm'
              : 'bg-white/80 text-[#5C4D3E] hover:text-[#8B6508] hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1C1611]/80 via-[#1C1611]/30 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-1.5 px-3 bg-white/95 text-[#1C1611] hover:bg-[#DAA520] hover:text-white transition-colors text-[11px] font-medium tracking-wider uppercase flex items-center justify-center gap-1.5"
            title="Quick Preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={handleWhatsAppClick}
            className="py-1.5 px-2.5 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors text-[11px] flex items-center justify-center"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata line (Category · Purity · Weight) */}
          <div className="text-[11px] text-[#8C7A6B] tracking-wider uppercase flex items-center gap-1.5 mb-1 font-medium">
            <span>{product.goldPurity || 'Fine Jewellery'}</span>
            <span aria-hidden="true">·</span>
            {product.netGoldWeightGm ? (
              <span>{product.netGoldWeightGm}g Net</span>
            ) : product.diamondSpecs ? (
              <span>{product.diamondSpecs.carat} ct Diamond</span>
            ) : (
              <span>{product.category.toUpperCase()}</span>
            )}
            {product.hallmarkCertified && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#8B6508]">BIS 916</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg text-[#1C1611] group-hover:text-[#996515] transition-colors line-clamp-1 leading-snug">
            {product.title}
          </h3>

          <p className="text-xs text-[#6E5D4E] line-clamp-1 font-light mt-1">
            {product.shortDesc}
          </p>
        </div>

        {/* Pricing & Add to Cart Module */}
        <div className="pt-2 border-t border-[#F2EDE2]">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-xs text-[#8C7A6B] block -mb-1">
                {product.fixedPrice ? 'Direct Price' : 'Estimated Price (incl. GST)'}
              </span>
              <span className="font-serif text-lg sm:text-xl font-semibold text-[#1C1611] tabular-nums">
                {formatINR(priceBreakdown.finalPrice)}
              </span>
            </div>

            {product.stockQuantity <= 2 && product.stockQuantity > 0 && (
              <span className="text-[10px] text-[#A66214] font-medium">
                Only {product.stockQuantity} left
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              disabled={!product.inStock}
              className="w-full py-2 bg-[#1C1611] text-[#F9F6F0] hover:bg-[#32281F] active:bg-[#000] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#DAA520]" />
              <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
