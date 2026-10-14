import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Share2,
  Ruler,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { calculateProductPrice, formatINR } from '../utils/pricing';
import { resolveJewelleryImage } from '../assets/images';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    goldRates,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsSizeGuideOpen,
    logWhatsAppEnquiry,
    storeSettings,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizesAvailable && product.sizesAvailable[0] ? product.sizesAvailable[0] : 'Standard'
  );
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const priceBreakdown = calculateProductPrice(product, goldRates);
  const inWishlist = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, 1, selectedSize);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppEnquiry = () => {
    logWhatsAppEnquiry(product.title, product.sku);
    const message = encodeURIComponent(
      `Namaste Milora Gold & Diamonds,\n\nI am inquiring about:\n*${product.title}*\nSKU: ${product.sku}\nSize: ${selectedSize}\nPrice: ${formatINR(priceBreakdown.finalPrice)}\n\nPlease assist me with availability, certified diamond specs, and custom bridal consultation.`
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#FCFBF7] border border-[#E8DCCB] shadow-2xl rounded-none overflow-hidden my-auto">
        {/* Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DCCB] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-xs text-[#8C7A6B] tracking-wider uppercase">
            <span>Catalogue</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1C1611] font-semibold">{product.category.toUpperCase()}</span>
            <span className="hidden sm:inline">· SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5C4D3E] hover:text-[#1C1611] hover:bg-[#EFE8DC] rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Gallery & Zoom */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square sm:aspect-[4/3] bg-[#F7F3EB] border border-[#E8DCCB] overflow-hidden group">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={resolveJewelleryImage(product.images[selectedImageIndex] || product.images[0])}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('hero_bridal.jpg')) {
                        target.src = '/images/hero_bridal.jpg';
                      }
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#996515]">
                    <Sparkles className="w-12 h-12 opacity-50" />
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-[#1C1611]/85 text-[#F5EFEB] px-2.5 py-1 text-[10px] tracking-widest uppercase font-mono">
                  {product.goldPurity ? `${product.goldPurity} Gold` : 'Fine Jewels'}
                </div>
              </div>

              {/* Thumbnail strip */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 shrink-0 border-2 overflow-hidden cursor-pointer ${
                        selectedImageIndex === idx ? 'border-[#996515]' : 'border-[#E8DCCB] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={resolveJewelleryImage(img)}
                        alt={`${product.title} thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('hero_bridal.jpg')) {
                            target.src = '/images/hero_bridal.jpg';
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#F9F6F0] border border-[#E8DCCB] text-center text-xs text-[#5C4D3E]">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#996515] mb-1" />
                  <span className="font-semibold text-[#1C1611]">BIS Hallmarked</span>
                  <span className="text-[10px] text-[#8C7A6B]">100% Certified</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-[#996515] mb-1" />
                  <span className="font-semibold text-[#1C1611]">Insured Transit</span>
                  <span className="text-[10px] text-[#8C7A6B]">Armoured Courier</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-[#996515] mb-1" />
                  <span className="font-semibold text-[#1C1611]">15-Day Exchange</span>
                  <span className="text-[10px] text-[#8C7A6B]">Buyback Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Breakdown & Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8C7A6B] tracking-widest uppercase font-mono">
                    SKU: {product.sku}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-1.5 text-[#5C4D3E] hover:text-[#1C1611] transition-colors"
                      title="Share Product"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-1.5 text-[#5C4D3E] hover:text-[#996515] transition-colors"
                      title="Add to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#996515] text-[#996515]' : ''}`} />
                    </button>
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1611] font-semibold mt-1">
                  {product.title}
                </h2>

                {copiedLink && (
                  <p className="text-xs text-[#25D366] font-medium mt-1">
                    Link copied to clipboard!
                  </p>
                )}
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-[#F7F3EB] border border-[#E8DCCB]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-[#8C7A6B] uppercase tracking-wider block">
                      {product.fixedPrice ? 'Direct Purchase Price' : 'Estimated Price (incl. 3% GST)'}
                    </span>
                    <span className="font-serif text-3xl font-bold text-[#1C1611] tabular-nums">
                      {formatINR(priceBreakdown.finalPrice)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#25D366] bg-[#E7F8ED] px-2.5 py-1 border border-[#B3E6C5]">
                    In Stock
                  </span>
                </div>

                {/* Transparent Price Breakdown (Prompt Section 4 Requirement) */}
                <div className="mt-4 pt-3 border-t border-[#E8DCCB] space-y-1.5 text-xs text-[#5C4D3E]">
                  <div className="flex justify-between font-medium text-[#1C1611]">
                    <span>Transparent Price Breakdown</span>
                    <span className="text-[11px] text-[#8C7A6B] font-mono">Gold Rate: ₹{priceBreakdown.goldRateUsed || goldRates.rate22K}/g</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Gold Net Weight ({priceBreakdown.netWeightGm}g @ {product.goldPurity || '22K'})</span>
                    <span className="tabular-nums font-mono">{formatINR(priceBreakdown.goldValue)}</span>
                  </div>

                  {priceBreakdown.makingCharges > 0 && (
                    <div className="flex justify-between">
                      <span>Making Charges ({product.makingChargeType === 'percentage' ? `${product.makingCharges}%` : 'Handcrafted Fixed'})</span>
                      <span className="tabular-nums font-mono">{formatINR(priceBreakdown.makingCharges)}</span>
                    </div>
                  )}

                  {priceBreakdown.stoneCharges > 0 && (
                    <div className="flex justify-between">
                      <span>Stone & Gemstone Charges</span>
                      <span className="tabular-nums font-mono">{formatINR(priceBreakdown.stoneCharges)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-[#E8DCCB]/60 pt-1 text-[#1C1611]">
                    <span>Tax (3% Precious Metals GST)</span>
                    <span className="tabular-nums font-mono">{formatINR(priceBreakdown.gstAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Diamond & Metal Specifications Card */}
              <div className="p-4 bg-white border border-[#E8DCCB] space-y-3 text-xs">
                <h4 className="font-serif font-bold text-sm text-[#1C1611] tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#996515]" />
                  <span>Jewellery Specifications</span>
                </h4>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[#4A3E33]">
                  <div>
                    <span className="text-[#8C7A6B] block">Gold Purity:</span>
                    <span className="font-semibold">{product.goldPurity || '18K / 22K Purity'}</span>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] block">Gross Weight:</span>
                    <span className="font-semibold tabular-nums">{product.grossWeightGm || product.netGoldWeightGm} grams</span>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] block">Net Gold Weight:</span>
                    <span className="font-semibold tabular-nums">{product.netGoldWeightGm || '—'} grams</span>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] block">Hallmark:</span>
                    <span className="font-semibold text-[#8B6508]">BIS 916 with HUID</span>
                  </div>

                  {product.diamondSpecs && (
                    <>
                      <div>
                        <span className="text-[#8C7A6B] block">Diamond Carat:</span>
                        <span className="font-semibold">{product.diamondSpecs.carat} Carats ({product.diamondSpecs.stoneCount || 1} stones)</span>
                      </div>
                      <div>
                        <span className="text-[#8C7A6B] block">Colour & Clarity:</span>
                        <span className="font-semibold">{product.diamondSpecs.color} · {product.diamondSpecs.clarity}</span>
                      </div>
                      <div>
                        <span className="text-[#8C7A6B] block">Diamond Cut:</span>
                        <span className="font-semibold">{product.diamondSpecs.cut}</span>
                      </div>
                      <div>
                        <span className="text-[#8C7A6B] block">Certification:</span>
                        <span className="font-semibold text-[#8B6508]">{product.diamondSpecs.certificate || 'IGI Certified'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Size / Variant Selector */}
              {product.sizesAvailable && product.sizesAvailable.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1C1611]">Select Size / Variant:</span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-[#996515] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Sizing Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizesAvailable.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-2 text-xs font-medium border transition-colors cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#1C1611] text-[#F9F6F0] border-[#1C1611]'
                            : 'bg-white text-[#4A3E33] border-[#E8DCCB] hover:border-[#996515]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pincode Delivery Estimator */}
              <div className="p-3 bg-[#FAF8F2] border border-[#E8DCCB] text-xs">
                <div className="flex items-center gap-2 mb-2 text-[#4A3E33]">
                  <Truck className="w-4 h-4 text-[#996515]" />
                  <span className="font-medium">Estimated Delivery & Insured Shipping</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 400001)"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/[^0-9]/g, ''));
                      setPincodeChecked(false);
                    }}
                    className="w-full px-3 py-1.5 border border-[#D5C2A5] bg-white text-[#1C1611] text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => setPincodeChecked(pincode.length === 6)}
                    className="px-4 py-1.5 bg-[#1C1611] text-white hover:bg-[#3D3024] font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Check
                  </button>
                </div>
                {pincodeChecked && (
                  <p className="mt-2 text-[11px] text-[#25D366] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available for express armoured delivery in 2-4 business days to {pincode}.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, 1, selectedSize);
                      onClose();
                    }}
                    className="py-3.5 bg-[#FAF7F2] text-[#1C1611] hover:bg-[#EFE8DC] border border-[#1C1611] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#996515]" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 bg-[#1C1611] text-[#F9F6F0] hover:bg-[#32281F] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#C5A059]"
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {/* WhatsApp Direct Enquiry Button (Prompt Section 5 & 8 Requirement) */}
                <button
                  onClick={handleWhatsAppEnquiry}
                  className="w-full py-3 bg-[#25D366] text-white hover:bg-[#20ba5a] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Enquire on WhatsApp (Instant Video Call / Appointment)</span>
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-[#E8DCCB] pt-4 text-xs text-[#5C4D3E] space-y-2 leading-relaxed">
                <h4 className="font-serif font-bold text-sm text-[#1C1611] uppercase tracking-wider">
                  The Milora Craftsmanship
                </h4>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
