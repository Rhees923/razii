import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  GoldRates,
  CartItem,
  Address,
  Order,
  CustomerUser,
  StoreSettings,
  Coupon,
  WhatsAppEnquiry,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_GOLD_RATES,
  INITIAL_STORE_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_USER,
  INITIAL_ORDERS,
} from '../data/initialData';
import { calculateProductPrice } from '../utils/pricing';
import { resolveJewelleryImage } from '../assets/images';

interface StoreContextType {
  // Products & Rates
  products: Product[];
  goldRates: GoldRates;
  updateGoldRates: (newRates: Partial<GoldRates>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Customer
  currentUser: CustomerUser | null;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<CustomerUser>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], tracking?: string, courier?: string) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, subtotal: number) => { success: boolean; message: string; discount: number };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;

  // Store Settings & Leads
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  enquiries: WhatsAppEnquiry[];
  logWhatsAppEnquiry: (productTitle: string, sku: string, customerName?: string, phone?: string) => void;

  // Admin
  isAdminLoggedIn: boolean;
  loginAdmin: (pinOrPass: string) => boolean;
  logoutAdmin: () => void;

  // Active Modals & Navigation
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  currentActivePage: string;
  setCurrentActivePage: (page: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or Defaults with Image Path Migration
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('milora_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // Migrate any old /src/assets/images paths to working production bundles
        return parsed.map((p) => ({
          ...p,
          images: Array.isArray(p.images) && p.images.length > 0
            ? p.images.map((img) => resolveJewelleryImage(img))
            : [resolveJewelleryImage()],
        }));
      }
    } catch (e) {
      console.warn('Failed to parse saved products, reverting to initial data', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [goldRates, setGoldRates] = useState<GoldRates>(() => {
    const saved = localStorage.getItem('milora_gold_rates');
    return saved ? JSON.parse(saved) : INITIAL_GOLD_RATES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('milora_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          product: {
            ...item.product,
            images: item.product.images?.map((img) => resolveJewelleryImage(img)) || [resolveJewelleryImage()],
          },
        }));
      }
    } catch (e) {
      console.warn('Failed to parse cart', e);
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('milora_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('milora_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.map((ord) => ({
          ...ord,
          items: ord.items.map((item) => ({
            ...item,
            product: {
              ...item.product,
              images: item.product.images?.map((img) => resolveJewelleryImage(img)) || [resolveJewelleryImage()],
            },
          })),
        }));
      }
    } catch (e) {
      console.warn('Failed to parse orders', e);
    }
    return INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('milora_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('milora_settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  const [enquiries, setEnquiries] = useState<WhatsAppEnquiry[]>(() => {
    const saved = localStorage.getItem('milora_enquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('milora_admin_auth') === 'true';
  });

  // Navigation & Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [currentActivePage, setCurrentActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('milora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('milora_gold_rates', JSON.stringify(goldRates));
  }, [goldRates]);

  useEffect(() => {
    localStorage.setItem('milora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('milora_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('milora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('milora_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('milora_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('milora_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  // Methods
  const updateGoldRates = (newRates: Partial<GoldRates>) => {
    setGoldRates((prev) => ({
      ...prev,
      ...newRates,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', Today',
    }));
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    const breakdown = calculateProductPrice(product, goldRates);
    const size = selectedSize || (product.sizesAvailable && product.sizesAvailable[0]) || 'Standard';

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size,
          calculatedPrice: breakdown.finalPrice,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && (!size || item.selectedSize === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (!size || item.selectedSize === size))
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.calculatedPrice * item.quantity,
    0
  );

  // Wishlist
  const wishlist = currentUser?.wishlist || [];

  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      setIsAccountOpen(true);
      return;
    }
    const current = currentUser.wishlist || [];
    const exists = current.includes(productId);
    const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
    setCurrentUser({
      ...currentUser,
      wishlist: updated,
    });
  };

  const isInWishlist = (productId: string) => {
    return !!currentUser?.wishlist?.includes(productId);
  };

  // Customer Management
  const loginUser = (email: string, name = 'Valued Collector') => {
    const user: CustomerUser = {
      id: `user-${Date.now()}`,
      name: name,
      email: email,
      phone: '+91 98200 99881',
      wishlist: currentUser?.wishlist || [],
      addresses: currentUser?.addresses || [
        {
          id: 'addr-default',
          fullName: name,
          phone: '+91 98200 99881',
          email,
          addressLine1: 'B-702, Heritage Residency, Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400026',
          isDefault: true,
          type: 'Home',
        },
      ],
      orders: [],
    };
    setCurrentUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updates: Partial<CustomerUser>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updates });
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updated = [...currentUser.addresses, newAddress];
    setCurrentUser({ ...currentUser, addresses: updated });
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const orderNumber = `MLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              orders: [newOrder, ...prev.orders],
            }
          : prev
      );
    }
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order['orderStatus'],
    tracking?: string,
    courier?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: status,
              trackingNumber: tracking || o.trackingNumber,
              courierPartner: courier || o.courierPartner,
            }
          : o
      )
    );
  };

  // Coupons
  const applyCoupon = (code: string, subtotal: number) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code', discount: 0 };
    }
    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Requires minimum cart value of ₹${found.minOrderValue.toLocaleString('en-IN')}`,
        discount: 0,
      };
    }

    let discount = 0;
    if (found.discountType === 'fixed') {
      discount = found.value;
    } else if (found.discountType === 'percentage') {
      discount = Math.round((subtotal * found.value) / 100);
    } else if (found.discountType === 'making_charges') {
      discount = Math.round((subtotal * 0.12 * 0.1)); // ~10% making charges discount
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied: ₹${discount.toLocaleString('en-IN')} off!`,
      discount,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [...prev, newCoupon]);
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...updates }));
  };

  const logWhatsAppEnquiry = (
    productTitle: string,
    sku: string,
    customerName?: string,
    phone?: string
  ) => {
    const lead: WhatsAppEnquiry = {
      id: `enq-${Date.now()}`,
      productTitle,
      sku,
      customerName: customerName || currentUser?.name || 'Guest Collector',
      phone: phone || currentUser?.phone || 'WhatsApp Direct',
      timestamp: new Date().toLocaleString('en-IN'),
      status: 'New',
    };
    setEnquiries((prev) => [lead, ...prev]);
  };

  // Admin login
  const loginAdmin = (pass: string) => {
    if (pass === 'milora2026' || pass === 'admin123') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('milora_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('milora_admin_auth');
    setIsAdminOpen(false);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        goldRates,
        updateGoldRates,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        addAddress,
        orders,
        createOrder,
        updateOrderStatus,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCoupon,
        storeSettings,
        updateStoreSettings,
        enquiries,
        logWhatsAppEnquiry,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        quickViewProduct,
        setQuickViewProduct,
        selectedProductForDetail,
        setSelectedProductForDetail,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountOpen,
        setIsAccountOpen,
        isAdminOpen,
        setIsAdminOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        currentActivePage,
        setCurrentActivePage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
