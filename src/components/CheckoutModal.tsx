import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  Truck,
  Building,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import { Address, PaymentMethod, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    storeSettings,
    currentUser,
    createOrder,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setActiveInvoiceOrder,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Address form
  const defaultAddr = currentUser?.addresses && currentUser.addresses[0];
  const [formData, setFormData] = useState({
    fullName: defaultAddr?.fullName || currentUser?.name || '',
    phone: defaultAddr?.phone || currentUser?.phone || '',
    email: defaultAddr?.email || currentUser?.email || '',
    addressLine1: defaultAddr?.addressLine1 || '',
    addressLine2: defaultAddr?.addressLine2 || '',
    landmark: defaultAddr?.landmark || '',
    city: defaultAddr?.city || 'Mumbai',
    state: defaultAddr?.state || 'Maharashtra',
    pincode: defaultAddr?.pincode || '400001',
    notes: '',
  });

  // Test card input fields
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvv: '•••',
  });

  if (!isCheckoutOpen) return null;

  // Pricing calculations
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
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const taxGst = Math.round((taxableAmount * 3) / 100);
  const finalTotal = taxableAmount + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      alert('Please fill in your complete shipping address and contact details.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const shippingAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        isDefault: true,
        type: 'Home',
      };

      const newOrder = createOrder({
        items: cart,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: shippingAddress,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'concierge_reservation' ? 'Reserved' : 'Paid',
        paymentId: paymentMethod === 'concierge_reservation' ? 'RES_CONCIERGE_' + Date.now() : `rzp_test_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        orderStatus: 'Confirmed',
        trackingNumber: `BD-APEX-${Math.floor(100000 + Math.random() * 900000)}`,
        courierPartner: 'BlueDart Apex Armoured Express',
        subtotal: cartSubtotal,
        discount: discountAmount,
        makingChargeDiscount: 0,
        taxGst,
        shippingFee,
        finalTotal,
        couponCode: appliedCoupon?.code,
        notes: formData.notes,
      });

      setIsProcessing(false);
      setCompletedOrder(newOrder);
    }, 1200);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FCFBF7] border border-[#E8DCCB] shadow-2xl rounded-none overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DCCB] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#996515]" />
            <h3 className="font-serif text-xl text-[#1C1611] font-semibold tracking-wide">
              {completedOrder ? 'Order Confirmed' : 'Milora Encrypted Luxury Checkout'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#5C4D3E] hover:text-[#1C1611] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Order State */}
        {completedOrder ? (
          <div className="p-8 overflow-y-auto space-y-6 text-center">
            <div className="w-16 h-16 bg-[#E7F8ED] border border-[#B3E6C5] text-[#25D366] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold">
                Payment & Reservation Confirmed
              </span>
              <h2 className="font-serif text-3xl text-[#1C1611] font-semibold">
                Thank You, {completedOrder.customer.name}
              </h2>
              <p className="text-sm text-[#5C4D3E] max-w-lg mx-auto font-light">
                Your luxury jewellery order has been authenticated and entered into our bespoke workshop queue. A confirmation receipt has been sent to <strong>{completedOrder.customer.email}</strong>.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="max-w-xl mx-auto bg-[#FAF8F2] border border-[#E8DCCB] p-6 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-[#E8DCCB] pb-2 font-mono">
                <span className="text-[#8C7A6B]">Order Reference:</span>
                <strong className="text-[#1C1611] font-semibold">{completedOrder.orderNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Payment Method:</span>
                <span className="capitalize font-semibold">{completedOrder.paymentMethod} (Test Auth)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Armoured Tracking:</span>
                <span className="font-mono text-[#996515] font-semibold">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7A6B]">Insured Dispatch:</span>
                <span>BlueDart Apex Armoured Carrier</span>
              </div>
              <div className="flex justify-between border-t border-[#E8DCCB] pt-2 font-serif text-base text-[#1C1611] font-bold">
                <span>Amount Paid:</span>
                <span>{formatINR(completedOrder.finalTotal)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setActiveInvoiceOrder(completedOrder);
                }}
                className="px-6 py-3 bg-[#1C1611] text-[#F9F6F0] text-xs uppercase tracking-wider font-semibold hover:bg-[#3D3024] flex items-center gap-2 cursor-pointer border border-[#C5A059]"
              >
                <FileText className="w-4 h-4 text-[#DAA520]" />
                <span>View & Print Tax Invoice</span>
              </button>

              <button
                onClick={handleClose}
                className="px-6 py-3 bg-[#F2EDE2] text-[#1C1611] text-xs uppercase tracking-wider font-semibold hover:bg-[#EAE2D2] border border-[#D5C2A5] cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleCompleteOrder} className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Shipping Address & Information */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="font-serif text-lg text-[#1C1611] font-semibold tracking-wide flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#996515]" />
                    <span>Insured Delivery Address</span>
                  </h4>
                  <p className="text-xs text-[#8C7A6B]">
                    Tamper-evident armoured delivery directly to your doorstep with OTP verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[#4A3E33] mb-1 font-medium">Full Name (as per Govt ID) *</label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1 font-medium">Mobile Phone (for Delivery OTP) *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98200 12345"
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1 font-medium">Email Address (for Invoice) *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ananya@example.com"
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#4A3E33] mb-1 font-medium">Street Address / Apartment *</label>
                    <input
                      type="text"
                      required
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Flat 1204, Oberoi Sky Heights, Lokhandwala"
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1 font-medium">City *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1 font-medium">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Punjab">Punjab</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1 font-medium">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1 font-medium">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near Club House"
                      className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div className="text-xs">
                  <label className="block text-[#4A3E33] mb-1 font-medium">Special Packaging / Gifting Instructions</label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Velvet bridal box, discreet delivery timings, or greeting message card..."
                    className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Payment Method Selection & Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h4 className="font-serif text-lg text-[#1C1611] font-semibold tracking-wide flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#996515]" />
                    <span>Select Payment Method</span>
                  </h4>
                  <p className="text-xs text-[#8C7A6B]">
                    PCI-DSS compliant sandbox mode with instant order confirmation.
                  </p>
                </div>

                {/* Payment Options */}
                <div className="space-y-3 text-xs">
                  {/* Option 1: Razorpay Mode */}
                  <label
                    className={`block p-3 border cursor-pointer transition-colors ${
                      paymentMethod === 'razorpay'
                        ? 'bg-[#FAF4E6] border-[#996515]'
                        : 'bg-white border-[#E8DCCB] hover:border-[#D5C2A5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="text-[#996515] focus:ring-0"
                      />
                      <div className="flex-1">
                        <strong className="block text-[#1C1611]">Razorpay Gateway (Test Mode)</strong>
                        <span className="text-[11px] text-[#8C7A6B]">Instant Cards, NetBanking, Wallets</span>
                      </div>
                      <CreditCard className="w-4 h-4 text-[#996515]" />
                    </div>
                  </label>

                  {/* Option 2: UPI */}
                  <label
                    className={`block p-3 border cursor-pointer transition-colors ${
                      paymentMethod === 'upi'
                        ? 'bg-[#FAF4E6] border-[#996515]'
                        : 'bg-white border-[#E8DCCB] hover:border-[#D5C2A5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-[#996515] focus:ring-0"
                      />
                      <div className="flex-1">
                        <strong className="block text-[#1C1611]">Instant UPI / QR</strong>
                        <span className="text-[11px] text-[#8C7A6B]">Google Pay, PhonePe, Paytm, BHIM</span>
                      </div>
                      <QrCode className="w-4 h-4 text-[#996515]" />
                    </div>
                  </label>

                  {/* Option 3: Bespoke In-Store / Concierge High-Value Reservation */}
                  <label
                    className={`block p-3 border cursor-pointer transition-colors ${
                      paymentMethod === 'concierge_reservation'
                        ? 'bg-[#FAF4E6] border-[#996515]'
                        : 'bg-white border-[#E8DCCB] hover:border-[#D5C2A5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'concierge_reservation'}
                        onChange={() => setPaymentMethod('concierge_reservation')}
                        className="text-[#996515] focus:ring-0"
                      />
                      <div className="flex-1">
                        <strong className="block text-[#1C1611]">Milora Concierge Reservation</strong>
                        <span className="text-[11px] text-[#8C7A6B]">Reserve high-value suite without upfront swipe</span>
                      </div>
                      <Building className="w-4 h-4 text-[#996515]" />
                    </div>
                  </label>
                </div>

                {/* Simulated payment detail field */}
                {paymentMethod === 'razorpay' && (
                  <div className="p-3 bg-white border border-[#E8DCCB] text-[11px] space-y-2">
                    <span className="text-[#8C7A6B] block">Development Test Gateway Details:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          readOnly
                          value={cardInfo.cardNumber}
                          className="w-full bg-[#FAF7F2] border border-[#E8DCCB] px-2 py-1 text-mono text-xs"
                        />
                      </div>
                    </div>
                    <span className="text-[#25D366] text-[10px] block">
                      ✓ Preloaded with valid test credentials. Click Authorize to complete.
                    </span>
                  </div>
                )}

                {/* Price Breakdown in Checkout */}
                <div className="p-4 bg-[#FAF7F2] border border-[#E8DCCB] space-y-2 text-xs text-[#5C4D3E]">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({cart.length})</span>
                    <span className="tabular-nums font-mono text-[#1C1611]">{formatINR(cartSubtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#8B6508]">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="tabular-nums font-mono">- {formatINR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Insured Armoured Shipping</span>
                    <span className="tabular-nums font-mono text-[#25D366]">Complimentary</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Precious Metals GST (3%)</span>
                    <span className="tabular-nums font-mono">{formatINR(taxGst)}</span>
                  </div>

                  <div className="flex justify-between border-t border-[#E8DCCB] pt-2 text-base font-bold text-[#1C1611]">
                    <span>Payable Total</span>
                    <span className="font-serif text-lg tabular-nums">{formatINR(finalTotal)}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#1C1611] text-[#F9F6F0] hover:bg-[#32281F] text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors border border-[#C5A059] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Securing Vault Authorization...</span>
                  ) : (
                    <>
                      <span>{paymentMethod === 'concierge_reservation' ? 'Confirm Bespoke Reservation' : `Pay ${formatINR(finalTotal)}`}</span>
                      <ArrowRight className="w-4 h-4 text-[#DAA520]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
