import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Gem,
  Instagram,
  Heart,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { JEWELLERY_IMAGES, resolveJewelleryImage } from '../assets/images';

export const HomePage: React.FC = () => {
  const { products, setCurrentActivePage, setSelectedCategory, setSelectedProductForDetail } = useStore();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold">
            Signature Categorisation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1611] font-semibold">
            Explore Handcrafted Jewellery
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Royal Bridal Suite */}
          <div
            onClick={() => handleCategoryClick('bridal')}
            className="group relative aspect-[3/4] overflow-hidden bg-[#EFE8DC] border border-[#E8DCCB] cursor-pointer"
          >
            <img
              src={JEWELLERY_IMAGES.heroBridal}
              alt="Royal Indian Bridal Suites"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/images/hero_bridal.jpg'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] tracking-widest uppercase text-[#DAA520] block">The Royal Archive</span>
              <h3 className="font-serif text-lg sm:text-xl font-medium">Bridal Jewellery</h3>
              <p className="text-[11px] text-[#D5C2A5] mt-0.5">Heavy Chokers & Aad</p>
            </div>
          </div>

          {/* Card 2: Solitaire Diamond Engagement */}
          <div
            onClick={() => handleCategoryClick('diamond')}
            className="group relative aspect-[3/4] overflow-hidden bg-[#EFE8DC] border border-[#E8DCCB] cursor-pointer"
          >
            <img
              src={JEWELLERY_IMAGES.diamondRing}
              alt="Diamond Solitaire Rings"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/images/diamond_ring.jpg'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] tracking-widest uppercase text-[#DAA520] block">IGI Certified</span>
              <h3 className="font-serif text-lg sm:text-xl font-medium">Diamond Solitaires</h3>
              <p className="text-[11px] text-[#D5C2A5] mt-0.5">Rings & Tennis Bands</p>
            </div>
          </div>

          {/* Card 3: 22K Royal Gold Bangles */}
          <div
            onClick={() => handleCategoryClick('gold')}
            className="group relative aspect-[3/4] overflow-hidden bg-[#EFE8DC] border border-[#E8DCCB] cursor-pointer"
          >
            <img
              src={JEWELLERY_IMAGES.goldBangles}
              alt="Traditional Gold Bangles & Kadas"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/images/gold_bangles.jpg'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] tracking-widest uppercase text-[#DAA520] block">22K Pure Gold</span>
              <h3 className="font-serif text-lg sm:text-xl font-medium">Bangles & Kadas</h3>
              <p className="text-[11px] text-[#D5C2A5] mt-0.5">Temple Nakashi Work</p>
            </div>
          </div>

          {/* Card 4: Haute Joaillerie Emerald & Diamond */}
          <div
            onClick={() => handleCategoryClick('diamond')}
            className="group relative aspect-[3/4] overflow-hidden bg-[#EFE8DC] border border-[#E8DCCB] cursor-pointer"
          >
            <img
              src={JEWELLERY_IMAGES.diamondNecklace}
              alt="Haute Joaillerie Emerald and Diamonds"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = '/images/diamond_necklace.jpg'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] tracking-widest uppercase text-[#DAA520] block">High Jewellery</span>
              <h3 className="font-serif text-lg sm:text-xl font-medium">Haute Statement</h3>
              <p className="text-[11px] text-[#D5C2A5] mt-0.5">Columbian Emeralds & Pavé</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bestselling Masterpieces Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold block">
              Treasured by Collectors
            </span>
            <h2 className="font-serif text-3xl text-[#1C1611] font-semibold mt-1">
              Bestselling Jewellery
            </h2>
          </div>
          <button
            onClick={() => handleCategoryClick('all')}
            className="text-xs font-semibold uppercase tracking-wider text-[#996515] hover:text-[#1C1611] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Luxury Bridal Banner Spotlight */}
      <section className="bg-[#1C1611] text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-[#3D3024]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#DAA520] font-semibold">
              The Grand Indian Wedding Suite
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-semibold text-[#F5EFEB]">
              Heirlooms For The Sovereign Bride
            </h2>
            <p className="text-sm text-[#D5C2A5] leading-relaxed font-light">
              Each bridal trousseau suite is sculpted by our master artisans with unmatched devotion. Certified 22K 916 gold adorned with untreated polki diamonds, lustrous south sea pearls, and precision stone setting.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleCategoryClick('bridal')}
                className="px-8 py-3.5 bg-[#DAA520] text-[#1C1611] font-semibold uppercase tracking-wider text-xs hover:bg-[#FBF5B7] transition-colors cursor-pointer"
              >
                Explore Bridal Collection
              </button>
              <button
                onClick={() => {
                  window.open('https://wa.me/919820012345?text=Hello%20Milora%20Concierge,%20I%20would%20like%20to%20book%20a%20private%20bridal%20viewing.', '_blank');
                }}
                className="px-6 py-3.5 bg-transparent border border-[#DAA520] text-[#DAA520] font-semibold uppercase tracking-wider text-xs hover:bg-[#2A2118] transition-colors cursor-pointer"
              >
                Book VIP Atelier Viewing
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#2A2118]">
              <img
                src={JEWELLERY_IMAGES.heroBridal}
                alt="Milora Bridal High Jewellery Suite"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = '/images/hero_bridal.jpg'; }}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold block">
              Just Unveiled
            </span>
            <h2 className="font-serif text-3xl text-[#1C1611] font-semibold mt-1">
              New Atelier Arrivals
            </h2>
          </div>
          <button
            onClick={() => handleCategoryClick('all')}
            className="text-xs font-semibold uppercase tracking-wider text-[#996515] hover:text-[#1C1611] flex items-center gap-1 cursor-pointer"
          >
            <span>View All New Pieces</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Brand Story & Master Goldsmith Section */}
      <section className="bg-[#FAF7F2] border-y border-[#E8DCCB] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-[16/10] overflow-hidden border border-[#D5C2A5] shadow-lg bg-[#EFE8DC]">
              <img
                src={JEWELLERY_IMAGES.craftsmanship}
                alt="Master Goldsmith Artisan at Milora Atelier"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = '/images/craftsmanship.jpg'; }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold">
              The Milora Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1611] font-semibold">
              Artistry Preserved Across Generations
            </h2>
            <p className="text-sm text-[#5C4D3E] leading-relaxed font-light">
              Milora Gold & Diamonds was conceived with a sole conviction: that jewellery is not merely an ornament, but an enduring chronicle of memory, heritage, and prosperity.
            </p>
            <p className="text-xs text-[#6E5D4E] leading-relaxed">
              Every curve of our 22K temple bangles and every facet of our triple-excellent certified solitaires undergoes stringent quality protocols. We celebrate the master goldsmiths of India whose dextrous hands turn raw precious bullion into poetry.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentActivePage('about')}
                className="px-6 py-3 bg-[#1C1611] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#3D3024] cursor-pointer"
              >
                Read Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Official Instagram Gallery Section (Prompt Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold">
            <Instagram className="w-4 h-4 text-[#DAA520]" />
            <span>@milora_gold_diamonds</span>
          </div>
          <h2 className="font-serif text-3xl text-[#1C1611] font-semibold">
            Follow Our Instagram Journey
          </h2>
          <p className="text-xs text-[#8C7A6B]">
            Witness daily moments of pure gold craftsmanship, bridal previews, and collector stories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              img: JEWELLERY_IMAGES.heroBridal,
              title: 'Royal Bridal Choker in 22K Gold',
            },
            {
              img: JEWELLERY_IMAGES.diamondRing,
              title: 'VVS1 Solitaire Engagement Ring',
            },
            {
              img: JEWELLERY_IMAGES.goldBangles,
              title: 'Temple Nakashi 22K Bangles',
            },
            {
              img: JEWELLERY_IMAGES.diamondNecklace,
              title: 'Emerald Symphony Haute Joaillerie',
            },
          ].map((post, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/milora_gold_diamonds/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#EFE8DC] border border-[#E8DCCB]"
            >
              <img
                src={post.img}
                alt={post.title}
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = '/images/hero_bridal.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center text-white">
                <Instagram className="w-6 h-6 mb-2 text-[#DAA520]" />
                <span className="text-[11px] font-medium line-clamp-2">{post.title}</span>
                <span className="text-[10px] text-[#D5C2A5] mt-1 uppercase tracking-wider font-mono">View on Instagram</span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.instagram.com/milora_gold_diamonds/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FAF7F2] text-[#1C1611] border border-[#D5C2A5] hover:bg-[#EFE8DC] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#996515]" />
            <span>Visit Official Instagram Profile</span>
          </a>
        </div>
      </section>
    </div>
  );
};
