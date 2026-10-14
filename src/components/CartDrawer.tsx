import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import { resolveJewelleryImage } from '../assets/images';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    storeSettings,
    setCurrentActivePage,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput, cartSubtotal);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) setCouponInput('');
  };

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      discountAmount = appliedCoupon.value;
    } else if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.discountType === 'making_charges') {
      discountAmount = Math.round(cartSubtotal * 0.12 * 0.1);
    }
  }

  const shippingFee = cartSubtotal >= storeSettings.freeShippingThreshold ? 0 : 500;
  const estimatedGst = Math.round(((cartSubtotal - discountAmount) * 3) / 100);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#FCFBF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DCCB]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8DCCB] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#996515]" />
            <h3 className="font-serif text-xl text-[#1C1611] font-semibold tracking-wide">
              Your Jewellery Bag ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-[#5C4D3E] hover:text-[#1C1611] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EFE8DC]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#6E5D4E]">
              <div className="w-16 h-16 rounded-full bg-[#F5EFEB] flex items-center justify-center mb-4 text-[#C5A059]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-lg text-[#1C1611] font-semibold">Your bag is empty</h4>
              <p className="text-xs text-[#8C7A6B] mt-1 max-w-xs">
                Explore our exquisite 22K gold bridal jewels, solitaire rings, and daily wear diamond collections.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentActivePage('catalog');
                }}
                className="mt-6 px-6 py-2.5 bg-[#1C1611] text-[#F9F6F0] text-xs uppercase tracking-wider font-semibold hover:bg-[#3D3024] cursor-pointer"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedSize}-${idx}`} className="py-4 flex gap-4">
                <div className="w-20 h-20 bg-[#F5EFEB] border border-[#E8DCCB] shrink-0 overflow-hidden">
                  <img
                    src={resolveJewelleryImage(item.product.images[0])}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = '/images/hero_bridal.jpg'; }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-semibold text-[#1C1611] line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-[#A08D7D] hover:text-[#991B1B] transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#8C7A6B] mt-0.5">
                      <span>Size: {item.selectedSize || 'Standard'}</span>
                      {item.product.goldPurity && (
                        <span> · {item.product.goldPurity}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F7F3EB]">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#D5C2A5] bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                        className="px-2 py-1 text-[#5C4D3E] hover:bg-[#F5EFEB] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums text-[#1C1611]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                        className="px-2 py-1 text-[#5C4D3E] hover:bg-[#F5EFEB] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-serif text-sm font-semibold text-[#1C1611] tabular-nums">
                      {formatINR(item.calculatedPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#E8DCCB] bg-[#FAF7F2] space-y-4">
            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C7A6B]" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. MILORA10, BRIDAL5)"
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D5C2A5] text-xs uppercase font-mono text-[#1C1611] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1C1611] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#3D3024] cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <p className={`text-[11px] mt-1.5 ${couponMsg.success ? 'text-[#25D366]' : 'text-[#DC2626]'}`}>
                  {couponMsg.text}
                </p>
              )}

              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between text-xs text-[#8B6508] bg-[#FAF4E6] p-2 border border-[#DAA520]/30">
                  <span>Code <strong>{appliedCoupon.code}</strong> applied</span>
                  <button
                    onClick={removeCoupon}
                    className="text-[#991B1B] hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#5C4D3E] pt-2 border-t border-[#E8DCCB]">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="tabular-nums font-mono text-[#1C1611]">{formatINR(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#8B6508]">
                  <span>Promotional Discount</span>
                  <span className="tabular-nums font-mono">- {formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Armoured Transit</span>
                <span className="tabular-nums font-mono text-[#25D366]">
                  {shippingFee === 0 ? 'Complimentary' : formatINR(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-[#1C1611] pt-2 border-t border-[#E8DCCB]">
                <span>Total Payable</span>
                <span className="font-serif text-lg tabular-nums text-[#1C1611]">
                  {formatINR(finalTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#1C1611] text-[#F9F6F0] hover:bg-[#32281F] transition-all text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border border-[#C5A059]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#DAA520]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7A6B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#996515]" />
              <span>Complimentary Insurance · 100% Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
