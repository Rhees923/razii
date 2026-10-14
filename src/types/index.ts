export type GoldPurity = '18K' | '22K' | '24K';

export interface DiamondSpecs {
  carat: number;
  cut: string; // e.g. 'Round Brilliant', 'Princess', 'Pear'
  color: string; // e.g. 'D-F (Colourless)', 'G-H (Near Colourless)'
  clarity: string; // e.g. 'VVS1', 'VS1-VS2', 'SI1'
  certificate?: string; // e.g. 'IGI Certified', 'GIA Certified'
  stoneCount?: number;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  slug: string;
  category: 'gold' | 'diamond' | 'bridal' | 'daily_wear' | 'coins';
  subcategory: 'necklaces' | 'rings' | 'earrings' | 'bangles' | 'bracelets' | 'pendants' | 'coins' | 'chains' | 'mangalsutras';
  basePrice: number; // Base or indicative price
  originalPrice?: number;
  fixedPrice: boolean; // if false, price recalculates dynamically based on gold rate + making charges
  goldPurity?: GoldPurity;
  grossWeightGm?: number;
  netGoldWeightGm?: number;
  stoneWeightGm?: number;
  makingCharges?: number; // Either percentage e.g. 12% or fixed ₹
  makingChargeType?: 'fixed' | 'percentage';
  stoneCharges?: number;
  diamondSpecs?: DiamondSpecs;
  images: string[];
  shortDesc: string;
  description: string;
  inStock: boolean;
  stockQuantity: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  sizesAvailable?: string[]; // e.g. ['12', '14', '16', '18'] or ['2.4', '2.6', '2.8']
  tags: string[];
  occasion?: 'Bridal & Wedding' | 'Engagement' | 'Festive' | 'Daily Wear' | 'Gifting';
  metalColor?: 'Yellow Gold' | 'Rose Gold' | 'White Gold' | 'Dual Tone';
  hallmarkCertified?: boolean;
}

export interface GoldRates {
  rate24K: number; // ₹ per gram
  rate22K: number;
  rate18K: number;
  silverRate: number;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  calculatedPrice: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'Home' | 'Office';
}

export type OrderStatus =
  | 'Confirmed'
  | 'Processing & Crafting'
  | 'Hallmarking & Quality Check'
  | 'Insured Transit'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'razorpay'
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'concierge_reservation';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: Address;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending Verification' | 'Reserved';
  paymentId?: string;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierPartner?: string;
  subtotal: number;
  discount: number;
  makingChargeDiscount: number;
  taxGst: number;
  shippingFee: number;
  finalTotal: number;
  couponCode?: string;
  notes?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
  orders: Order[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  businessHours: string;
  freeShippingThreshold: number;
  makingChargeDefaultPercent: number;
  gstPercent: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'making_charges';
  value: number; // percent or ₹
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface WhatsAppEnquiry {
  id: string;
  productTitle: string;
  sku: string;
  customerName?: string;
  phone?: string;
  timestamp: string;
  status: 'New' | 'Contacted' | 'Closed';
}
