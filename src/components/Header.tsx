import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import { MiloraLogo } from './MiloraLogo';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    currentUser,
    setIsCartOpen,
    setIsAccountOpen,
    setIsAdminOpen,
    goldRates,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setCurrentActivePage,
  } = useStore();

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleNavClick = (page: string, category = 'all') => {
    setCurrentActivePage(page);
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF7]/95 backdrop-blur-md border-b border-[#E8DCCB] transition-all">
      {/* 1. Announcement Bar */}
      <div className="bg-[#1C1611] text-[#E8D5B5] text-xs py-2 px-4 border-b border-[#3D3024]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DAA520]" />
            <span className="font-light tracking-wide text-[#F5EFEB]">
              100% BIS Hallmarked 916 Gold · Laser Inscribed IGI Diamonds
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#D5C2A5]">
            <span>Today's 22K Rate: <strong className="text-[#FBF5B7] font-semibold tabular-nums">{formatINR(goldRates.rate22K)}/g</strong></span>
            <span aria-hidden="true" className="opacity-40">|</span>
            <span>24K Rate: <strong className="text-[#FBF5B7] font-semibold tabular-nums">{formatINR(goldRates.rate24K)}/g</strong></span>
            <span aria-hidden="true" className="opacity-40">|</span>
            <span className="text-[#F5EFEB]">Insured Armoured Transit</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#D5C2A5] hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium"
              title="Store Owner Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#DAA520]" />
              <span className="hidden sm:inline">Store Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Bar (Strict 3-zone contract separated by gap-8) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Official Milora Logo) */}
        <button
          onClick={() => handleNavClick('home', 'all')}
          className="text-left group cursor-pointer shrink-0 flex items-center py-1"
          title="Milora Gold & Diamonds"
          aria-label="Milora Gold & Diamonds Home"
        >
          <MiloraLogo className="h-10 sm:h-12 w-auto group-hover:opacity-90 transition-opacity" color="#4A5D43" />
        </button>

        {/* Zone 2: Navigation Links (single-line, whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wider uppercase font-medium text-[#4A3E33]">
          <button
            onClick={() => handleNavClick('home', 'all')}
            className={`transition-colors hover:text-[#996515] pb-1 ${
              selectedCategory === 'all' ? 'text-[#996515] border-b-2 border-[#C5A059]' : ''
            }`}
          >
            All Collections
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'gold')}
            className={`transition-colors hover:text-[#996515] pb-1 ${
              selectedCategory === 'gold' ? 'text-[#996515] border-b-2 border-[#C5A059]' : ''
            }`}
          >
            Gold Jewellery
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'diamond')}
            className={`transition-colors hover:text-[#996515] pb-1 ${
              selectedCategory === 'diamond' ? 'text-[#996515] border-b-2 border-[#C5A059]' : ''
            }`}
          >
            Diamond Jewellery
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'bridal')}
            className={`transition-colors hover:text-[#996515] pb-1 ${
              selectedCategory === 'bridal' ? 'text-[#996515] border-b-2 border-[#C5A059]' : ''
            }`}
          >
            Bridal Suite
          </button>
          <button
            onClick={() => handleNavClick('catalog', 'daily_wear')}
            className={`transition-colors hover:text-[#996515] pb-1 ${
              selectedCategory === 'daily_wear' ? 'text-[#996515] border-b-2 border-[#C5A059]' : ''
            }`}
          >
            Daily Luxury
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="transition-colors hover:text-[#996515] pb-1"
          >
            Our Story
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="transition-colors hover:text-[#996515] pb-1"
          >
            Boutique
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Wishlist, Bag, Account) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-[#2C241E]">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="p-2 hover:text-[#996515] transition-colors cursor-pointer"
            aria-label="Search jewellery"
            title="Search catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Customer Account */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="p-2 hover:text-[#996515] transition-colors relative cursor-pointer"
            aria-label="Customer Account"
            title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign In'}
          >
            <User className="w-5 h-5" />
            {currentUser && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C5A059]" />
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => {
              if (currentUser) {
                setIsAccountOpen(true);
              } else {
                setIsAccountOpen(true);
              }
            }}
            className="p-2 hover:text-[#996515] transition-colors relative cursor-pointer"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#996515] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#1C1611] text-[#F5EFEB] hover:bg-[#32281F] px-4 py-2 rounded-none transition-colors border border-[#C5A059]/40 cursor-pointer text-xs font-medium tracking-wider"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#DAA520]" />
            <span className="hidden sm:inline">BAG</span>
            <span className="text-[#DAA520] font-semibold tabular-nums">
              ({cartCount})
            </span>
          </button>
        </div>
      </div>

      {/* 3. Search Bar Expansion Overlay */}
      {isSearchVisible && (
        <div className="border-t border-[#E8DCCB] bg-[#F7F3EB] px-4 py-3 animate-fadeIn">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-[#8C7A6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  setCurrentActivePage('catalog');
                }
              }}
              placeholder="Search by necklace, solitaire ring, 22K bangles, emerald, SKU..."
              className="w-full bg-transparent border-none text-[#221C16] placeholder-[#8C7A6B] focus:outline-none text-sm font-sans"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#8C7A6B] hover:text-[#1C1611] cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsSearchVisible(false)}
              className="p-1 text-[#8C7A6B] hover:text-[#1C1611] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Quick Category Strip (Mobile & Desktop sub-nav) */}
      <div className="border-t border-[#EFE8DC] bg-[#FAF8F2] px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs tracking-wider text-[#6A5A4D] whitespace-nowrap gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('catalog', 'all')}
              className={`hover:text-[#996515] transition-colors cursor-pointer ${
                selectedCategory === 'all' ? 'text-[#996515] font-semibold' : ''
              }`}
            >
              All Jewellery
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'gold')}
              className={`hover:text-[#996515] transition-colors cursor-pointer ${
                selectedCategory === 'gold' ? 'text-[#996515] font-semibold' : ''
              }`}
            >
              22K & 24K Gold
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'diamond')}
              className={`hover:text-[#996515] transition-colors cursor-pointer ${
                selectedCategory === 'diamond' ? 'text-[#996515] font-semibold' : ''
              }`}
            >
              Solitaire & Diamond
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'bridal')}
              className={`hover:text-[#996515] transition-colors cursor-pointer ${
                selectedCategory === 'bridal' ? 'text-[#996515] font-semibold' : ''
              }`}
            >
              Royal Bridal
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'daily_wear')}
              className={`hover:text-[#996515] transition-colors cursor-pointer ${
                selectedCategory === 'daily_wear' ? 'text-[#996515] font-semibold' : ''
              }`}
            >
              Daily Luxury & Mangalsutras
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'coins')}
              className={`hover:text-[#996515] transition-colors cursor-pointer ${
                selectedCategory === 'coins' ? 'text-[#996515] font-semibold' : ''
              }`}
            >
              24K Gold Coins (999)
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#996515] text-[11px] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Heritage Quality Since Inception</span>
          </div>
        </div>
      </div>
    </header>
  );
};
