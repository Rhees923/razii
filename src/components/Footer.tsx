import React, { useState } from 'react';
import {
  Instagram,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MiloraLogo } from './MiloraLogo';

interface FooterProps {
  onOpenPolicyPage?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicyPage }) => {
  const { storeSettings, setCurrentActivePage, setSelectedCategory, setIsAdminOpen } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  const handleNav = (page: string, cat = 'all') => {
    if (onOpenPolicyPage) onOpenPolicyPage(page);
    else setCurrentActivePage(page);
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1611] text-[#E8D5B5] border-t border-[#3D3024] font-sans">
      {/* 1. Newsletter & Privilege Club Banner */}
      <div className="border-b border-[#3D3024] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-1 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#DAA520] font-semibold">
              The Milora Connoisseur Club
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFEB] font-semibold">
              Privileged Previews & Rare Collections
            </h3>
            <p className="text-xs text-[#D5C2A5] font-light">
              Receive private invitations to private viewing exhibitions, daily precious metal intelligence, and early access to handcrafted bridal suites.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#25D366] bg-[#2A2118] px-4 py-3 border border-[#3D3024]">
                <CheckCircle className="w-4 h-4" />
                <span>Thank you. You have been added to our private connoisseur registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md w-full">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="px-4 py-3 bg-[#2A2118] text-[#F5EFEB] placeholder-[#8C7A6B] border border-[#3D3024] text-xs focus:outline-none focus:border-[#DAA520] flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#DAA520] text-[#1C1611] hover:bg-[#FBF5B7] font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
        {/* Brand & Story */}
        <div className="lg:col-span-2 space-y-4 pr-4">
          <div className="space-y-1">
            <MiloraLogo className="h-10 w-auto items-start" color="#F5EFEB" subtextColor="#C5A059" />
          </div>

          <p className="text-xs text-[#D5C2A5] leading-relaxed font-light">
            Crafting heirlooms for the modern royal. Milora Gold & Diamonds celebrates India’s sublime goldsmithing tradition, pairing certified ethical gemstones with master artisanal chasing, temple nakashi, and contemporary solitaires.
          </p>

          {/* Official Instagram link as requested */}
          <div className="pt-2 flex items-center gap-3">
            <a
              href="https://www.instagram.com/milora_gold_diamonds/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2A2118] hover:bg-[#3D3024] border border-[#DAA520]/40 text-xs text-[#F5EFEB] transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#DAA520]" />
              <span>@milora_gold_diamonds</span>
            </a>
          </div>

          <div className="text-[11px] text-[#A08D7D] pt-1">
            <span>Connect on Instagram for daily atelier craftsmanship clips & new bridal arrivals.</span>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-[#F5EFEB] uppercase tracking-wider">
            Collections
          </h4>
          <ul className="space-y-2 text-[#D5C2A5]">
            <li>
              <button onClick={() => handleNav('catalog', 'bridal')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Royal Bridal Suites
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('catalog', 'gold')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                22K Gold Necklaces & Harams
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('catalog', 'diamond')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Solitaire Engagement Rings
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('catalog', 'gold')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Temple Kadas & Bangles
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('catalog', 'daily_wear')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Daily Wear Diamond Jewels
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('catalog', 'coins')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                24K Pure Gold Coins (999)
              </button>
            </li>
          </ul>
        </div>

        {/* Client Care & Policies */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-[#F5EFEB] uppercase tracking-wider">
            Client Services
          </h4>
          <ul className="space-y-2 text-[#D5C2A5]">
            <li>
              <button onClick={() => handleNav('about')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                About Milora Atelier
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('contact')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Contact & Boutique Visit
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('shipping')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Insured Shipping & Delivery
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('returns')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                15-Day Exchange & Returns
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('care')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Jewellery Care Guide
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('terms')} className="hover:text-[#DAA520] transition-colors cursor-pointer">
                Terms & Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Flagship Boutique Contact */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-[#F5EFEB] uppercase tracking-wider">
            Flagship Atelier
          </h4>
          <div className="space-y-2.5 text-[#D5C2A5] leading-relaxed">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#DAA520] shrink-0 mt-0.5" />
              <span>{storeSettings.storeAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#DAA520] shrink-0" />
              <span>{storeSettings.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#DAA520] shrink-0" />
              <span>{storeSettings.contactEmail}</span>
            </div>
            <p className="text-[11px] text-[#A08D7D] pt-1">
              {storeSettings.businessHours}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Hallmark & Regulatory Compliance Bottom Strip */}
      <div className="border-t border-[#3D3024] bg-[#140F0C] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#8C7A6B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px]">
            <span className="text-[#DAA520] font-semibold">
              BIS Hallmarked 916 & 750 Gold with Laser HUID
            </span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span>Natural Conflict-Free Diamonds</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span>All-Risk Transit Insurance</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#D5C2A5] hover:underline cursor-pointer"
            >
              Management Portal
            </button>
          </div>

          <div className="text-[11px] text-center md:text-right">
            <span>© {new Date().getFullYear()} Milora Gold & Diamonds. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
