import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import { Order, Address } from '../types';
import { resolveJewelleryImage } from '../assets/images';

export const CustomerAccountModal: React.FC = () => {
  const {
    currentUser,
    loginUser,
    logoutUser,
    addAddress,
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    isAccountOpen,
    setIsAccountOpen,
    setActiveInvoiceOrder,
    setSelectedProductForDetail,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    type: 'Home' as 'Home' | 'Office',
  });

  if (!isAccountOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    loginUser(loginEmail, loginName || 'Valued Collector');
  };

  const handleQuickDemoLogin = () => {
    loginUser('ananya.sharma@example.com', 'Ananya Sharma');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.addressLine1 || !newAddress.pincode) return;
    addAddress({
      ...newAddress,
      isDefault: false,
    });
    setShowNewAddressForm(false);
  };

  const userOrders = currentUser
    ? orders.filter((o) => o.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FCFBF7] border border-[#E8DCCB] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DCCB] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#996515]" />
            <h3 className="font-serif text-xl text-[#1C1611] font-semibold tracking-wide">
              {currentUser ? `Welcome, ${currentUser.name}` : 'Milora Customer Account'}
            </h3>
          </div>
          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 text-[#5C4D3E] hover:text-[#1C1611] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!currentUser ? (
          /* Authentication Screen */
          <div className="p-8 max-w-md mx-auto w-full space-y-6 text-center">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl text-[#1C1611] font-semibold">
                {isRegisterMode ? 'Create Milora Account' : 'Sign in to Your Account'}
              </h2>
              <p className="text-xs text-[#8C7A6B]">
                Track high-value jewellery orders, save bridal wishlists, and receive insured transit updates.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-left text-xs">
              {isRegisterMode && (
                <div>
                  <label className="block text-[#4A3E33] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. Radhika Merchant"
                    className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#4A3E33] mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#4A3E33] mb-1 font-medium">Password</label>
                <input
                  type="password"
                  required
                  defaultValue="password123"
                  className="w-full px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1C1611] text-[#F9F6F0] hover:bg-[#3D3024] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-[#C5A059]"
              >
                {isRegisterMode ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#E8DCCB]" />
              <span className="flex-shrink mx-3 text-[11px] text-[#8C7A6B] uppercase font-mono">Or Quick Access</span>
              <div className="flex-grow border-t border-[#E8DCCB]" />
            </div>

            {/* Quick Demo Login */}
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 bg-[#FAF4E6] text-[#8B6508] border border-[#DAA520]/40 text-xs font-semibold hover:bg-[#F5EBD4] transition-colors cursor-pointer"
            >
              Log In as Demo Customer (Ananya Sharma)
            </button>

            <div className="text-xs text-[#5C4D3E] pt-2">
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="hover:underline text-[#996515] font-medium"
              >
                {isRegisterMode ? 'Already have an account? Sign In' : 'New to Milora? Create your client profile'}
              </button>
            </div>
          </div>
        ) : (
          /* Customer Dashboard */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DCCB] pb-3 text-xs font-semibold uppercase tracking-wider">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'orders' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders ({userOrders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'wishlist' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Saved Wishlist ({wishlistProducts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'addresses' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Addresses ({currentUser.addresses.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'profile' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </div>

              <button
                onClick={logoutUser}
                className="text-xs text-[#991B1B] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {requestSubmitted && (
              <div className="p-3 bg-[#E7F8ED] border border-[#B3E6C5] text-[#25D366] text-xs flex items-center justify-between">
                <span>{requestSubmitted}</span>
                <button onClick={() => setRequestSubmitted(null)} className="underline text-[11px]">Dismiss</button>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="text-center py-12 text-[#8C7A6B]">
                    <Package className="w-10 h-10 mx-auto text-[#D5C2A5] mb-2" />
                    <p className="text-sm font-medium text-[#1C1611]">No jewellery orders yet</p>
                    <p className="text-xs mt-1">Your confirmed orders and transit tracking will appear here.</p>
                  </div>
                ) : (
                  userOrders.map((ord) => (
                    <div key={ord.id} className="bg-white border border-[#E8DCCB] p-5 space-y-4 text-xs">
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2EDE2] pb-3">
                        <div>
                          <span className="font-mono font-bold text-[#1C1611] text-sm">
                            Order {ord.orderNumber}
                          </span>
                          <span className="text-[#8C7A6B] block text-[11px]">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF4E6] text-[#8B6508] border border-[#DAA520]/30">
                            {ord.orderStatus}
                          </span>
                          <button
                            onClick={() => setActiveInvoiceOrder(ord)}
                            className="px-3 py-1 bg-[#1C1611] text-white hover:bg-[#3D3024] text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3 h-3 text-[#DAA520]" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E8DCCB] shrink-0 overflow-hidden">
                                <img
                                  src={resolveJewelleryImage(item.product.images[0])}
                                  alt={item.product.title}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.currentTarget.src = '/images/hero_bridal.jpg'; }}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <strong className="text-[#1C1611] block font-medium">
                                  {item.product.title}
                                </strong>
                                <span className="text-[#8C7A6B] text-[11px]">
                                  Qty: {item.quantity} · Size: {item.selectedSize} · SKU: {item.product.sku}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono tabular-nums font-semibold text-[#1C1611]">
                              {formatINR(item.calculatedPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking & Status Timeline */}
                      <div className="p-3 bg-[#FAF8F2] border border-[#E8DCCB] space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#8C7A6B]">
                            Courier: <strong className="text-[#1C1611]">{ord.courierPartner}</strong>
                          </span>
                          <span className="font-mono text-[#996515]">
                            Airway Bill: {ord.trackingNumber}
                          </span>
                        </div>

                        {/* Order Timeline indicator */}
                        <div className="pt-2 flex items-center justify-between text-[10px] text-[#8C7A6B] border-t border-[#E8DCCB]/60">
                          <span className="font-semibold text-[#1C1611]">1. Confirmed</span>
                          <span aria-hidden="true">→</span>
                          <span className="font-semibold text-[#1C1611]">2. Hallmarking Verification</span>
                          <span aria-hidden="true">→</span>
                          <span className={ord.orderStatus === 'Insured Transit' || ord.orderStatus === 'Delivered' ? 'font-semibold text-[#1C1611]' : ''}>
                            3. Armoured Transit
                          </span>
                          <span aria-hidden="true">→</span>
                          <span className={ord.orderStatus === 'Delivered' ? 'font-semibold text-[#25D366]' : ''}>
                            4. Handover
                          </span>
                        </div>
                      </div>

                      {/* Service actions */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-[#5C4D3E]">
                          Total Paid: <strong className="font-mono text-[#1C1611] text-xs">{formatINR(ord.finalTotal)}</strong>
                        </span>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setRequestSubmitted(`Care & Polish service ticket created for Order ${ord.orderNumber}. Our concierge will contact you within 24 hours.`)}
                            className="text-[#996515] hover:underline cursor-pointer"
                          >
                            Request Polish / Service
                          </button>
                          <button
                            onClick={() => setRequestSubmitted(`Exchange inquiry logged for Order ${ord.orderNumber}. Our jewellery specialist will coordinate pickup.`)}
                            className="text-[#5C4D3E] hover:underline cursor-pointer"
                          >
                            Exchange Inquiry
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12 text-[#8C7A6B]">
                    <Heart className="w-10 h-10 mx-auto text-[#D5C2A5] mb-2" />
                    <p className="text-sm font-medium text-[#1C1611]">Your saved wishlist is empty</p>
                    <p className="text-xs mt-1">Tap the heart icon on any piece to save it for consultation or future purchase.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((p) => (
                      <div key={p.id} className="bg-white border border-[#E8DCCB] p-4 flex gap-4 text-xs">
                        <div className="w-20 h-20 bg-[#FAF7F2] shrink-0 overflow-hidden border border-[#E8DCCB]">
                          <img
                            src={resolveJewelleryImage(p.images[0])}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.src = '/images/hero_bridal.jpg'; }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-sm font-semibold text-[#1C1611] line-clamp-1">
                              {p.title}
                            </h4>
                            <span className="text-[#8C7A6B] text-[11px] block">
                              {p.goldPurity || 'Fine Jewellery'} · SKU: {p.sku}
                            </span>
                            <span className="font-serif text-sm font-bold text-[#1C1611] tabular-nums mt-1 block">
                              {formatINR(p.basePrice)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => {
                                addToCart(p, 1);
                                toggleWishlist(p.id);
                              }}
                              className="px-3 py-1 bg-[#1C1611] text-white hover:bg-[#3D3024] text-[11px] font-medium"
                            >
                              Move to Bag
                            </button>
                            <button
                              onClick={() => toggleWishlist(p.id)}
                              className="text-[#991B1B] hover:underline text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5C4D3E]">
                    Manage your verified residential and office delivery locations.
                  </span>
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="px-3 py-1.5 bg-[#1C1611] text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#DAA520]" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showNewAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-4 bg-[#FAF7F2] border border-[#E8DCCB] space-y-3 text-xs">
                    <h5 className="font-serif font-bold text-[#1C1611]">Add New Delivery Address</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#4A3E33] mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#4A3E33] mb-1">Mobile Phone</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[#4A3E33] mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddress.addressLine1}
                          onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#4A3E33] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#4A3E33] mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-3 py-1 bg-white border border-[#D5C2A5] text-[#5C4D3E]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 bg-[#1C1611] text-white font-medium"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 bg-white border border-[#E8DCCB] text-xs space-y-1.5 relative">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#1C1611] font-semibold">{addr.fullName}</strong>
                        <span className="px-2 py-0.5 bg-[#FAF7F2] border border-[#E8DCCB] text-[10px] font-mono">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-[#5C4D3E] leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 && `, ${addr.addressLine2}`}
                        <br />
                        {addr.city}, {addr.state} — {addr.pincode}
                        <br />
                        Phone: {addr.phone}
                      </p>
                      {addr.isDefault && (
                        <span className="text-[10px] text-[#25D366] font-medium block pt-1">
                          ✓ Default Shipping Address
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="max-w-md bg-white border border-[#E8DCCB] p-6 space-y-4 text-xs">
                <h4 className="font-serif font-bold text-base text-[#1C1611]">Client Profile</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-[#8C7A6B] block">Client Name:</span>
                    <strong className="text-[#1C1611] text-sm">{currentUser.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] block">Registered Email:</span>
                    <strong className="text-[#1C1611]">{currentUser.email}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] block">Mobile:</span>
                    <strong className="text-[#1C1611]">{currentUser.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] block">Membership:</span>
                    <span className="text-[#8B6508] font-semibold">Milora Heritage Privileged Collector</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
