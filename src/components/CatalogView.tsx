import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { calculateProductPrice } from '../utils/pricing';
import { Product } from '../types';

export const CatalogView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    goldRates,
  } = useStore();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedPurity, setSelectedPurity] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
        return false;
      }

      // Purity filter
      if (selectedPurity !== 'all' && p.goldPurity !== selectedPurity) {
        return false;
      }

      // Occasion filter
      if (selectedOccasion !== 'all' && p.occasion !== selectedOccasion) {
        return false;
      }

      // Price filter
      const breakdown = calculateProductPrice(p, goldRates);
      if (breakdown.finalPrice > maxPrice) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.shortDesc.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSku && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, selectedSubcategory, selectedPurity, selectedOccasion, maxPrice, searchQuery, goldRates]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = calculateProductPrice(a, goldRates).finalPrice;
      const priceB = calculateProductPrice(b, goldRates).finalPrice;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filteredProducts, sortBy, goldRates]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedPurity('all');
    setSelectedOccasion('all');
    setMaxPrice(1000000);
    setSearchQuery('');
  };

  return (
    <div className="bg-[#FCFBF7] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Title Area */}
        <div className="border-b border-[#E8DCCB] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold block">
              Curated Masterpieces
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1611] font-semibold mt-1">
              {searchQuery ? `Search Results for "${searchQuery}"` : (
                selectedCategory === 'gold' ? '22K & 24K Fine Gold Jewellery' :
                selectedCategory === 'diamond' ? 'Certified Diamond & Solitaire Jewellery' :
                selectedCategory === 'bridal' ? 'Royal Indian Bridal Collections' :
                selectedCategory === 'daily_wear' ? 'Everyday Luxury & Mangalsutras' :
                selectedCategory === 'coins' ? '24K Pure Gold Bullion & Coins' :
                'All Jewellery Collections'
              )}
            </h1>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Showing {sortedProducts.length} authentic pieces · BIS 916 Hallmarked
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden px-4 py-2 bg-[#FAF7F2] border border-[#D5C2A5] text-xs font-medium flex items-center gap-2 text-[#1C1611] cursor-pointer"
            >
              <Filter className="w-4 h-4 text-[#996515]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8C7A6B] hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white border border-[#D5C2A5] text-[#1C1611] text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (lg:col-span-3) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-[#E8DCCB] p-6 space-y-6 text-xs sticky top-28">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <span className="font-serif font-bold text-sm text-[#1C1611] uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#996515]" />
                <span>Filter Jewels</span>
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#996515] hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="font-semibold text-[#1C1611] uppercase tracking-wider text-[11px] block">
                Jewellery Category
              </label>
              <div className="space-y-1 text-[#5C4D3E]">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'gold', label: 'Gold Jewellery (22K)' },
                  { id: 'diamond', label: 'Diamond & Solitaire' },
                  { id: 'bridal', label: 'Royal Bridal Suites' },
                  { id: 'daily_wear', label: 'Daily Wear & Mangalsutras' },
                  { id: 'coins', label: '24K Investment Coins' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left py-1 px-1.5 transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'font-semibold text-[#996515] bg-[#FAF4E6]'
                        : 'hover:text-[#1C1611]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gold Purity Filter */}
            <div className="space-y-2 border-t border-[#E8DCCB] pt-4">
              <label className="font-semibold text-[#1C1611] uppercase tracking-wider text-[11px] block">
                Gold Purity
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['all', '22K', '18K', '24K'].map((purity) => (
                  <button
                    key={purity}
                    onClick={() => setSelectedPurity(purity)}
                    className={`px-3 py-1 border transition-colors cursor-pointer text-xs font-mono ${
                      selectedPurity === purity
                        ? 'bg-[#1C1611] text-white border-[#1C1611]'
                        : 'bg-[#FAF7F2] text-[#4A3E33] border-[#E8DCCB] hover:border-[#996515]'
                    }`}
                  >
                    {purity === 'all' ? 'All' : purity}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="space-y-2 border-t border-[#E8DCCB] pt-4">
              <label className="font-semibold text-[#1C1611] uppercase tracking-wider text-[11px] block">
                Occasion
              </label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#D5C2A5] text-[#1C1611] focus:outline-none"
              >
                <option value="all">All Occasions</option>
                <option value="Bridal & Wedding">Bridal & Wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Festive">Festive & Celebrations</option>
                <option value="Daily Wear">Daily Wear</option>
                <option value="Gifting">Auspicious Gifting</option>
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2 border-t border-[#E8DCCB] pt-4">
              <div className="flex justify-between items-center text-[#1C1611]">
                <label className="font-semibold uppercase tracking-wider text-[11px]">
                  Max Budget
                </label>
                <span className="font-mono text-xs font-bold text-[#996515]">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={1000000}
                step={25000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#996515]"
              />
              <div className="flex justify-between text-[10px] text-[#8C7A6B] font-mono">
                <span>₹20K</span>
                <span>₹10 Lakh+</span>
              </div>
            </div>
          </aside>

          {/* Product Grid Area (lg:col-span-9) */}
          <div className="lg:col-span-9 space-y-6">
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-[#E8DCCB] p-12 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-[#C5A059] mx-auto opacity-60" />
                <h3 className="font-serif text-xl text-[#1C1611] font-semibold">
                  No matching jewellery pieces found
                </h3>
                <p className="text-xs text-[#8C7A6B] max-w-md mx-auto">
                  Try adjusting your category, price range, or clearing active filters to browse our complete collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 px-6 py-2 bg-[#1C1611] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3D3024] cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end lg:hidden">
          <div className="w-80 bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <span className="font-serif font-bold text-base text-[#1C1611]">Filter Catalogue</span>
              <button onClick={() => setIsFilterDrawerOpen(false)}>
                <X className="w-5 h-5 text-[#5C4D3E]" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#1C1611] uppercase tracking-wider">Category</label>
              {['all', 'gold', 'diamond', 'bridal', 'daily_wear', 'coins'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsFilterDrawerOpen(false);
                  }}
                  className={`block w-full text-left py-1.5 px-2 text-xs capitalize ${
                    selectedCategory === cat ? 'bg-[#FAF4E6] text-[#996515] font-semibold' : 'text-[#5C4D3E]'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-2.5 bg-[#1C1611] text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
