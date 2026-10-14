import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Download,
  Users,
  Settings,
  Tag,
  MessageCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import { Product, Order, Coupon, GoldPurity } from '../types';
import { JEWELLERY_IMAGES, resolveJewelleryImage } from '../assets/images';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    goldRates,
    updateGoldRates,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCoupon,
    enquiries,
    storeSettings,
    updateStoreSettings,
  } = useStore();

  const [adminPassInput, setAdminPassInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'rates' | 'orders' | 'coupons' | 'enquiries' | 'settings'>('analytics');

  // New product modal / form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    title: '',
    sku: '',
    slug: '',
    category: 'gold',
    subcategory: 'necklaces',
    basePrice: 120000,
    goldPurity: '22K',
    grossWeightGm: 18.5,
    netGoldWeightGm: 18.0,
    stoneWeightGm: 0.5,
    makingCharges: 12,
    makingChargeType: 'percentage',
    stoneCharges: 0,
    images: [JEWELLERY_IMAGES.heroBridal],
    shortDesc: '',
    description: '',
    inStock: true,
    stockQuantity: 5,
    featured: false,
    isNewArrival: true,
    isBestseller: false,
    sizesAvailable: ['Standard'],
    tags: ['Gold', '22K'],
    occasion: 'Festive',
    metalColor: 'Yellow Gold',
    fixedPrice: false,
    hallmarkCertified: true,
  });

  // Rates edit state
  const [rateForm, setRateForm] = useState({
    rate24K: goldRates.rate24K,
    rate22K: goldRates.rate22K,
    rate18K: goldRates.rate18K,
    silverRate: goldRates.silverRate,
  });

  // New coupon form state
  const [couponForm, setCouponForm] = useState<Coupon>({
    code: '',
    discountType: 'percentage',
    value: 10,
    minOrderValue: 20000,
    description: '',
    isActive: true,
  });

  if (!isAdminOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(adminPassInput);
    if (!ok) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setAdminPassInput('');
    }
  };

  const handleQuickAdminLogin = () => {
    loginAdmin('milora2026');
  };

  // CSV Exporter for Orders
  const exportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'Total (INR)', 'Payment Status', 'Fulfillment Status'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      `"${o.customer.name}"`,
      o.customer.email,
      o.customer.phone,
      o.finalTotal,
      o.paymentStatus,
      o.orderStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `milora_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Exporter for Inventory
  const exportInventoryCSV = () => {
    const headers = ['SKU', 'Title', 'Category', 'Purity', 'Net Wt (g)', 'Gross Wt (g)', 'Base Price', 'Stock Qty', 'In Stock'];
    const rows = products.map((p) => [
      p.sku,
      `"${p.title}"`,
      p.category,
      p.goldPurity || 'N/A',
      p.netGoldWeightGm || 0,
      p.grossWeightGm || 0,
      p.basePrice,
      p.stockQuantity,
      p.inStock ? 'YES' : 'NO',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `milora_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoldRates(rateForm);
    alert('Precious metal rates updated successfully! All product catalog prices recalculated in real time.');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.sku) {
      alert('Please provide Product Title and unique SKU.');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
      setEditingProductId(null);
    } else {
      addProduct({
        ...productForm,
        slug: productForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
    }
    setShowAddProductModal(false);
  };

  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      title: p.title,
      sku: p.sku,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      basePrice: p.basePrice,
      goldPurity: p.goldPurity,
      grossWeightGm: p.grossWeightGm,
      netGoldWeightGm: p.netGoldWeightGm,
      stoneWeightGm: p.stoneWeightGm,
      makingCharges: p.makingCharges,
      makingChargeType: p.makingChargeType,
      stoneCharges: p.stoneCharges,
      diamondSpecs: p.diamondSpecs,
      images: p.images,
      shortDesc: p.shortDesc,
      description: p.description,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity,
      featured: p.featured,
      isNewArrival: p.isNewArrival,
      isBestseller: p.isBestseller,
      sizesAvailable: p.sizesAvailable,
      tags: p.tags,
      occasion: p.occasion,
      metalColor: p.metalColor,
      fixedPrice: p.fixedPrice,
      hallmarkCertified: p.hallmarkCertified,
    });
    setShowAddProductModal(true);
  };

  const totalGrossRevenue = orders.reduce((sum, o) => sum + o.finalTotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#FCFBF7] border border-[#E8DCCB] shadow-2xl rounded-none overflow-hidden my-auto max-h-[94vh] flex flex-col justify-between">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DCCB] bg-[#1C1611] text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#DAA520]" />
            <h3 className="font-serif text-xl font-semibold tracking-wide text-[#F5EFEB]">
              Milora Gold & Diamonds · Store Administration Suite
            </h3>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-[#D5C2A5] hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Check */}
        {!isAdminLoggedIn ? (
          <div className="p-10 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FAF4E6] border border-[#DAA520] flex items-center justify-center mx-auto text-[#996515]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-2xl text-[#1C1611] font-semibold">
                Authorized Personnel Login
              </h2>
              <p className="text-xs text-[#8C7A6B]">
                Enter master management passcode to modify precious metal rates, orders, and catalogue items.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <input
                  type="password"
                  required
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  placeholder="Enter Admin Password (e.g. milora2026)"
                  className="w-full px-3 py-2.5 bg-white border border-[#D5C2A5] text-[#1C1611] text-center font-mono focus:outline-none"
                />
                {loginError && (
                  <p className="text-[#DC2626] text-[11px] mt-1 font-medium">
                    Invalid administrator password. Try 'milora2026'.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1C1611] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#3D3024] cursor-pointer"
              >
                Enter Portal
              </button>
            </form>

            <button
              onClick={handleQuickAdminLogin}
              className="text-xs text-[#996515] underline font-medium hover:text-[#1C1611] cursor-pointer"
            >
              1-Click Demo Login (milora2026)
            </button>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Admin Subnav */}
            <div className="flex items-center justify-between border-b border-[#E8DCCB] px-6 py-2.5 bg-[#FAF7F2] text-xs font-semibold uppercase tracking-wider overflow-x-auto">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'analytics' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'products' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Products ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('rates')}
                  className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'rates' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Live Gold Rates</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'orders' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'coupons' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupons</span>
                </button>

                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'enquiries' ? 'border-b-2 border-[#996515] text-[#996515]' : 'text-[#8C7A6B] hover:text-[#1C1611]'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Leads ({enquiries.length})</span>
                </button>
              </div>

              <button
                onClick={logoutAdmin}
                className="text-[#991B1B] text-xs hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>

            {/* Main Admin Tab Body */}
            <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
              {/* TAB 1: ANALYTICS OVERVIEW */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-[#E8DCCB] space-y-1">
                      <span className="text-[11px] text-[#8C7A6B] uppercase tracking-wider block">Gross Sales</span>
                      <span className="font-serif text-2xl font-bold text-[#1C1611] tabular-nums block">
                        {formatINR(totalGrossRevenue)}
                      </span>
                      <span className="text-[10px] text-[#25D366]">Verified Orders</span>
                    </div>

                    <div className="p-4 bg-white border border-[#E8DCCB] space-y-1">
                      <span className="text-[11px] text-[#8C7A6B] uppercase tracking-wider block">Active Orders</span>
                      <span className="font-serif text-2xl font-bold text-[#1C1611] tabular-nums block">
                        {orders.length}
                      </span>
                      <span className="text-[10px] text-[#8B6508]">Pan-India Logistics</span>
                    </div>

                    <div className="p-4 bg-white border border-[#E8DCCB] space-y-1">
                      <span className="text-[11px] text-[#8C7A6B] uppercase tracking-wider block">Live 22K Gold Rate</span>
                      <span className="font-serif text-2xl font-bold text-[#996515] tabular-nums block">
                        {formatINR(goldRates.rate22K)}/g
                      </span>
                      <span className="text-[10px] text-[#8C7A6B]">Updated {goldRates.updatedAt}</span>
                    </div>

                    <div className="p-4 bg-white border border-[#E8DCCB] space-y-1">
                      <span className="text-[11px] text-[#8C7A6B] uppercase tracking-wider block">Total Jewellery SKU</span>
                      <span className="font-serif text-2xl font-bold text-[#1C1611] tabular-nums block">
                        {products.length}
                      </span>
                      <span className="text-[10px] text-[#25D366]">100% BIS Hallmarked</span>
                    </div>
                  </div>

                  {/* Actions & Export */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={exportOrdersCSV}
                      className="px-4 py-2 bg-[#1C1611] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#3D3024] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#DAA520]" />
                      <span>Export Orders (CSV)</span>
                    </button>

                    <button
                      onClick={exportInventoryCSV}
                      className="px-4 py-2 bg-[#FAF7F2] text-[#1C1611] border border-[#D5C2A5] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#EFE8DC] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#996515]" />
                      <span>Export Inventory (CSV)</span>
                    </button>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="bg-white border border-[#E8DCCB] p-5 space-y-3">
                    <h4 className="font-serif font-bold text-base text-[#1C1611]">Recent Precious Orders</h4>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] border-b border-[#E8DCCB] text-[#8C7A6B]">
                        <tr>
                          <th className="p-2">Order #</th>
                          <th className="p-2">Client</th>
                          <th className="p-2">Items</th>
                          <th className="p-2">Amount</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DCCB]">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id}>
                            <td className="p-2 font-mono font-bold text-[#1C1611]">{o.orderNumber}</td>
                            <td className="p-2">{o.customer.name}</td>
                            <td className="p-2">{o.items.length} piece(s)</td>
                            <td className="p-2 font-mono tabular-nums font-semibold">{formatINR(o.finalTotal)}</td>
                            <td className="p-2">
                              <span className="px-2 py-0.5 bg-[#FAF4E6] text-[#8B6508] border border-[#DAA520]/30 font-medium">
                                {o.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGER */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#1C1611]">Catalogue & Inventory Management</h4>
                      <p className="text-xs text-[#8C7A6B]">Configure weights, making charges, purity, diamond grading, and stock.</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProductId(null);
                        setShowAddProductModal(true);
                      }}
                      className="px-4 py-2 bg-[#1C1611] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#3D3024] cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#DAA520]" />
                      <span>Add New Jewellery Piece</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="bg-white border border-[#E8DCCB] overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] border-b border-[#E8DCCB] text-[#4A3E33]">
                        <tr>
                          <th className="p-3">Piece Details</th>
                          <th className="p-3">Purity & Weights</th>
                          <th className="p-3">Making / Price</th>
                          <th className="p-3 text-center">Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DCCB]">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FCFBF7]">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E8DCCB] shrink-0 overflow-hidden">
                                  <img
                                    src={resolveJewelleryImage(p.images[0])}
                                    alt={p.title}
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { e.currentTarget.src = '/images/hero_bridal.jpg'; }}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <strong className="text-[#1C1611] font-semibold block">{p.title}</strong>
                                  <span className="text-[11px] text-[#8C7A6B] font-mono">
                                    SKU: {p.sku} · {p.category.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="font-semibold text-[#1C1611] block">{p.goldPurity || 'Diamond Jewel'}</span>
                              <span className="text-[11px] text-[#8C7A6B]">
                                Net: {p.netGoldWeightGm || '—'}g · Gross: {p.grossWeightGm || '—'}g
                              </span>
                            </td>

                            <td className="p-3">
                              <span className="font-mono tabular-nums font-bold text-[#1C1611] block">
                                {formatINR(p.basePrice)}
                              </span>
                              <span className="text-[11px] text-[#8C7A6B]">
                                Making: {p.makingChargeType === 'percentage' ? `${p.makingCharges}%` : `₹${p.makingCharges}`}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              <button
                                onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                                className={`px-2 py-0.5 text-[11px] font-semibold cursor-pointer ${
                                  p.inStock
                                    ? 'bg-[#E7F8ED] text-[#25D366] border border-[#B3E6C5]'
                                    : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]'
                                }`}
                              >
                                {p.inStock ? `${p.stockQuantity} In Stock` : 'Sold Out'}
                              </button>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="p-1.5 text-[#5C4D3E] hover:text-[#1C1611] transition-colors"
                                  title="Edit Piece"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete ${p.title}?`)) deleteProduct(p.id);
                                  }}
                                  className="p-1.5 text-[#DC2626] hover:text-[#991B1B] transition-colors"
                                  title="Delete Piece"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE GOLD RATES UPDATER */}
              {activeTab === 'rates' && (
                <div className="max-w-2xl bg-white border border-[#E8DCCB] p-6 space-y-6 text-xs">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#1C1611]">Precious Metal Rates Configuration</h4>
                    <p className="text-xs text-[#8C7A6B]">
                      Updates apply instantaneously to all dynamic gold calculation formulas across the entire catalogue.
                    </p>
                  </div>

                  <form onSubmit={handleSaveRates} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#4A3E33] mb-1 font-medium">24K Pure Gold Rate (₹ / gram)</label>
                        <input
                          type="number"
                          required
                          value={rateForm.rate24K}
                          onChange={(e) => setRateForm({ ...rateForm, rate24K: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5] font-mono text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4A3E33] mb-1 font-medium">22K Standard Gold Rate (₹ / gram)</label>
                        <input
                          type="number"
                          required
                          value={rateForm.rate22K}
                          onChange={(e) => setRateForm({ ...rateForm, rate22K: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5] font-mono text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4A3E33] mb-1 font-medium">18K Diamond Jewellery Gold Rate (₹ / gram)</label>
                        <input
                          type="number"
                          required
                          value={rateForm.rate18K}
                          onChange={(e) => setRateForm({ ...rateForm, rate18K: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5] font-mono text-sm font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4A3E33] mb-1 font-medium">Silver 999 Rate (₹ / gram)</label>
                        <input
                          type="number"
                          required
                          value={rateForm.silverRate}
                          onChange={(e) => setRateForm({ ...rateForm, silverRate: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5] font-mono text-sm font-bold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#1C1611] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3D3024] cursor-pointer"
                    >
                      Update Rates & Re-price Store
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: ORDERS & DISPATCH */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#1C1611]">Order Fulfillment & Logistics</h4>
                      <p className="text-xs text-[#8C7A6B]">Update hallmarking, vault dispatch, and armoured transit tracking numbers.</p>
                    </div>

                    <button
                      onClick={exportOrdersCSV}
                      className="px-3 py-1.5 bg-[#FAF7F2] text-[#1C1611] border border-[#D5C2A5] text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#996515]" />
                      <span>Download CSV</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="p-4 bg-white border border-[#E8DCCB] space-y-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2EDE2] pb-2">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#1C1611]">{ord.orderNumber}</span>
                            <span className="text-[#8C7A6B] block text-[11px]">
                              {ord.customer.name} ({ord.customer.phone}) · {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-bold text-[#1C1611]">
                              {formatINR(ord.finalTotal)}
                            </span>
                            <span className="px-2 py-0.5 bg-[#E7F8ED] text-[#25D366] text-[10px] font-semibold">
                              {ord.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Status selector */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <label className="text-[#4A3E33] font-medium">Order Status:</label>
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['orderStatus'])}
                            className="px-2.5 py-1 bg-[#FAF7F2] border border-[#D5C2A5] font-semibold text-xs"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing & Crafting">Processing & Crafting</option>
                            <option value="Hallmarking & Quality Check">Hallmarking & Quality Check</option>
                            <option value="Insured Transit">Insured Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <span className="text-[#8C7A6B] ml-auto">
                            Tracking: <strong className="font-mono text-[#996515]">{ord.trackingNumber}</strong> ({ord.courierPartner})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: COUPONS */}
              {activeTab === 'coupons' && (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-lg text-[#1C1611]">Promotional Codes</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {coupons.map((c) => (
                      <div key={c.code} className="p-4 bg-white border border-[#E8DCCB] text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="font-mono text-sm text-[#996515]">{c.code}</strong>
                          <button
                            onClick={() => toggleCoupon(c.code)}
                            className={`px-2 py-0.5 text-[10px] font-semibold cursor-pointer ${
                              c.isActive ? 'bg-[#E7F8ED] text-[#25D366]' : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}
                          >
                            {c.isActive ? 'ACTIVE' : 'DISABLED'}
                          </button>
                        </div>
                        <p className="text-[#5C4D3E]">{c.description}</p>
                        <span className="text-[10px] text-[#8C7A6B] block">
                          Min Cart: ₹{c.minOrderValue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: WHATSAPP ENQUIRY LEADS */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#1C1611]">Inbound WhatsApp Concierge Leads</h4>
                    <p className="text-[#8C7A6B]">Logged every time a visitor clicks "Enquire on WhatsApp" for a specific jewellery piece.</p>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="p-8 text-center text-[#8C7A6B] bg-white border border-[#E8DCCB]">
                      No WhatsApp inquiries logged yet. Click WhatsApp enquiry on any product to test the tracking pipeline!
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E8DCCB] divide-y divide-[#E8DCCB]">
                      {enquiries.map((enq) => (
                        <div key={enq.id} className="p-3 flex items-center justify-between">
                          <div>
                            <strong className="text-[#1C1611] block">{enq.productTitle}</strong>
                            <span className="text-[11px] text-[#8C7A6B] font-mono">
                              SKU: {enq.sku} · Collector: {enq.customerName} ({enq.phone})
                            </span>
                          </div>
                          <span className="text-[11px] text-[#996515]">{enq.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-[#FCFBF7] border border-[#E8DCCB] max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
                <h4 className="font-serif font-bold text-base text-[#1C1611]">
                  {editingProductId ? 'Edit Jewellery Piece' : 'Add New Jewellery Piece'}
                </h4>
                <button onClick={() => setShowAddProductModal(false)} className="cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[#4A3E33] mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                    >
                      <option value="gold">Gold Jewellery</option>
                      <option value="diamond">Diamond Jewellery</option>
                      <option value="bridal">Bridal Suite</option>
                      <option value="daily_wear">Daily Wear</option>
                      <option value="coins">24K Coins</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1">Gold Purity</label>
                    <select
                      value={productForm.goldPurity}
                      onChange={(e) => setProductForm({ ...productForm, goldPurity: e.target.value as GoldPurity })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                    >
                      <option value="22K">22K (916 BIS Hallmark)</option>
                      <option value="18K">18K (750 Diamond Setting)</option>
                      <option value="24K">24K (999 Pure Fine Gold)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1">Base Price (INR) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.basePrice}
                      onChange={(e) => setProductForm({ ...productForm, basePrice: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1">Net Gold Weight (grams)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.netGoldWeightGm}
                      onChange={(e) => setProductForm({ ...productForm, netGoldWeightGm: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A3E33] mb-1">Making Charges (%)</label>
                    <input
                      type="number"
                      value={productForm.makingCharges}
                      onChange={(e) => setProductForm({ ...productForm, makingCharges: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5] font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[#4A3E33] mb-1">Image URL / Path</label>
                    <input
                      type="text"
                      value={productForm.images[0]}
                      onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5] font-mono text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[#4A3E33] mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={productForm.shortDesc}
                      onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D5C2A5]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DCCB]">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-1.5 bg-white border border-[#D5C2A5] text-[#5C4D3E] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-[#1C1611] text-white font-medium cursor-pointer"
                  >
                    Save Piece
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
