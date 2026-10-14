import React from 'react';
import { ArrowRight, ShieldCheck, Gem, Sparkles, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import { JEWELLERY_IMAGES, resolveJewelleryImage } from '../assets/images';

export const HeroBanner: React.FC = () => {
  const { goldRates, setCurrentActivePage, setSelectedCategory } = useStore();

  const handleExplore = (category = 'all') => {
    setSelectedCategory(category);
    setCurrentActivePage('catalog');
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#E8DCCB]">
      {/* Hero Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#996515] font-semibold">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Milora Gold & Diamonds · Royal Archives</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1C1611] leading-[1.12] tracking-tight text-balance">
              Timeless Elegance. <br />
              <span className="italic font-light text-[#996515]">Jewellery</span> for Every Moment.
            </h1>

            <p className="text-[#5C4D3E] text-base sm:text-lg leading-relaxed max-w-xl font-light">
              Discover exquisite gold and diamond jewellery crafted for your most precious moments. Hand-finished 22K bridal masterpieces, brilliant certified solitaires, and everyday heirlooms.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleExplore('all')}
                className="px-8 py-4 bg-[#1C1611] text-[#F9F6F0] hover:bg-[#32281F] transition-all flex items-center gap-3 text-xs tracking-[0.18em] uppercase font-medium border border-[#C5A059]/40 cursor-pointer shadow-sm group"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 text-[#DAA520] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleExplore('bridal')}
                className="px-8 py-4 bg-[#F2EDE2] text-[#2C231B] hover:bg-[#EAE2D2] transition-all text-xs tracking-[0.18em] uppercase font-medium border border-[#D5C2A5] cursor-pointer"
              >
                <span>Shop Bridal Suites</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-[#E8DCCB] grid grid-cols-3 gap-4 text-xs text-[#5C4D3E]">
              <div>
                <strong className="block text-sm font-semibold text-[#1C1611]">100% BIS</strong>
                <span className="text-[11px] text-[#8C7A6B]">916 Hallmarked Gold</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-[#1C1611]">IGI & GIA</strong>
                <span className="text-[11px] text-[#8C7A6B]">Certified Diamonds</span>
              </div>
              <div>
                <strong className="block text-sm font-semibold text-[#1C1611]">Insured Transit</strong>
                <span className="text-[11px] text-[#8C7A6B]">Complimentary Pan-India</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Image Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/10] lg:aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-[#D5C2A5]/60 bg-[#EFE8DC]">
              <img
                src={JEWELLERY_IMAGES.heroBridal}
                alt="Milora Handcrafted Royal 22K Gold Bridal Choker"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to static public image if needed
                  const target = e.currentTarget;
                  if (!target.src.includes('hero_bridal.jpg')) {
                    target.src = '/images/hero_bridal.jpg';
                  }
                }}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#E8D5B5] block">
                    Featured Masterwork
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white">
                    The Noorani Royal Bridal Choker
                  </h3>
                  <p className="text-xs text-[#D5C2A5] font-light mt-0.5">
                    22K Pure Gold · Natural Basra Pearls
                  </p>
                </div>
                <button
                  onClick={() => handleExplore('bridal')}
                  className="px-4 py-2 bg-white/95 text-[#1C1611] text-xs font-semibold uppercase tracking-wider hover:bg-[#DAA520] hover:text-white transition-colors cursor-pointer"
                >
                  View Piece
                </button>
              </div>
            </div>

            {/* Subtle floating gold seal */}
            <div className="absolute -top-4 -right-4 bg-[#FCFBF7] border border-[#C5A059] p-3 rounded-full shadow-lg hidden sm:flex items-center gap-2">
              <Gem className="w-5 h-5 text-[#996515]" />
              <div className="text-[10px] text-[#4A3E33] leading-tight pr-1">
                <span className="font-bold block text-[#1C1611]">Heritage Craft</span>
                <span>Over 140 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Gold Rate Banner Strip */}
      <div className="bg-[#1C1611] border-t border-[#3D3024] py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#E8D5B5]">
            <Clock className="w-4 h-4 text-[#DAA520]" />
            <span className="tracking-wider uppercase font-semibold text-[11px]">
              Live Precious Metal Rates ({goldRates.updatedAt}):
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-white tabular-nums">
            <div className="flex items-center gap-2">
              <span className="text-[#C5A059]">24K Pure Gold (999):</span>
              <span className="font-semibold text-[#FBF5B7]">{formatINR(goldRates.rate24K)} / gram</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C5A059]">22K Standard Gold (916):</span>
              <span className="font-semibold text-[#FBF5B7]">{formatINR(goldRates.rate22K)} / gram</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C5A059]">18K Diamond Setting (750):</span>
              <span className="font-semibold text-[#FBF5B7]">{formatINR(goldRates.rate18K)} / gram</span>
            </div>
            <div className="flex items-center gap-2 hidden lg:flex">
              <span className="text-[#C5A059]">Silver 999:</span>
              <span className="font-semibold text-[#FBF5B7]">₹{goldRates.silverRate} / gram</span>
            </div>
          </div>

          <div className="text-[11px] text-[#8C7A6B]">
            <span>Prices calculated with BIS Hallmarked purity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
