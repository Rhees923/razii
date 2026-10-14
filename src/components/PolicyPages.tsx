import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Truck,
  RotateCcw,
  Gem,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { JEWELLERY_IMAGES } from '../assets/images';

interface PolicyPageProps {
  pageType: 'about' | 'contact' | 'shipping' | 'returns' | 'care' | 'terms';
  onBackToHome: () => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ pageType, onBackToHome }) => {
  const { storeSettings, logWhatsAppEnquiry } = useStore();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: 'Bridal Consultation',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logWhatsAppEnquiry(`Boutique Contact: ${contactForm.enquiryType}`, 'CONTACT-FORM', contactForm.name, contactForm.phone);
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb back */}
        <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
          <button
            onClick={onBackToHome}
            className="hover:text-[#1C1611] transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Back to Storefront
          </button>
          <span className="uppercase tracking-widest font-mono text-[#996515]">
            Milora Heritage Documentation
          </span>
        </div>

        {/* 1. ABOUT US */}
        {pageType === 'about' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3 text-center sm:text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold">
                Heritage & Legacy
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1611] font-semibold">
                The Story of Milora Gold & Diamonds
              </h1>
              <p className="text-[#5C4D3E] text-base font-light leading-relaxed">
                Founded on an unyielding reverence for Indian metallurgy and contemporary gemological precision, Milora creates heirlooms that transcend generations.
              </p>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden border border-[#D5C2A5] bg-[#EFE8DC] shadow-lg">
              <img
                src={JEWELLERY_IMAGES.craftsmanship}
                alt="Master Goldsmith Artisan at Milora Atelier"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = '/images/craftsmanship.jpg'; }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-xs sm:text-sm font-light max-w-xl">
                  "Every millimeter of gold is a canvas. Our master goldsmiths carry forward four generations of nakashi and jadau filigree expertise."
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#5C4D3E] leading-relaxed">
              <div className="space-y-3">
                <h3 className="font-serif text-lg text-[#1C1611] font-semibold uppercase tracking-wider">
                  Uncompromising Purity
                </h3>
                <p>
                  Every gold creation at Milora is strictly crafted from 100% BIS Hallmarked gold, bearing the government-mandated 6-digit laser-engraved HUID (Hallmark Unique Identification). We uphold total transparency: you receive a comprehensive breakdown of net gold weight, live bullion rate, making charges, and gem value.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-lg text-[#1C1611] font-semibold uppercase tracking-wider">
                  Ethical Solitaires & Fine Diamonds
                </h3>
                <p>
                  Our diamonds are individually evaluated by seasoned gemologists and graded by the world's premier institutes including IGI and GIA. Sourced exclusively from certified conflict-free pipelines, each stone is cut for maximum light dispersion and fire.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. CONTACT US */}
        {pageType === 'contact' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#996515] font-semibold">
                Atelier Concierge
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1611] font-semibold">
                Connect With Milora
              </h1>
              <p className="text-[#5C4D3E] text-sm font-light">
                Schedule a private boutique viewing, bridal consultation, or custom jewellery design commission.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information Card */}
              <div className="bg-[#FAF7F2] border border-[#E8DCCB] p-6 space-y-6 text-xs text-[#5C4D3E]">
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-base text-[#1C1611] uppercase tracking-wider">
                    Flagship Boutique
                  </h4>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#996515] shrink-0 mt-0.5" />
                    <span>{storeSettings.storeAddress}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#996515] shrink-0" />
                    <span>{storeSettings.contactPhone} (Call & WhatsApp)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#996515] shrink-0" />
                    <span>{storeSettings.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#996515] shrink-0" />
                    <span>{storeSettings.businessHours}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8DCCB] space-y-2">
                  <strong className="text-[#1C1611] block">Direct WhatsApp Line:</strong>
                  <a
                    href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-[#25D366] text-white font-semibold text-xs transition-colors hover:bg-[#20ba5a]"
                  >
                    Open Instant WhatsApp Chat
                  </a>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="bg-white border border-[#E8DCCB] p-6 space-y-4 text-xs">
                <h4 className="font-serif font-bold text-base text-[#1C1611]">
                  Book an Appointment
                </h4>

                {contactSubmitted ? (
                  <div className="p-4 bg-[#E7F8ED] border border-[#B3E6C5] text-[#25D366] space-y-2">
                    <strong className="block text-sm">Thank You for Inquiring!</strong>
                    <p>Our senior concierge will reach out to you via WhatsApp / Phone to confirm your appointment details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[#4A3E33] mb-1 font-medium">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#4A3E33] mb-1 font-medium">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#4A3E33] mb-1 font-medium">Email *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#4A3E33] mb-1 font-medium">Interest Area</label>
                      <select
                        value={contactForm.enquiryType}
                        onChange={(e) => setContactForm({ ...contactForm, enquiryType: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5]"
                      >
                        <option value="Bridal Suite Consultation">Royal Bridal Suite Consultation</option>
                        <option value="Solitaire Engagement Ring">Solitaire Engagement Rings</option>
                        <option value="Custom Gold Kada Design">Custom Gold Kada / Bangle Commission</option>
                        <option value="Gold Coin Investment">24K Gold Coin Bulk Purchase</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#4A3E33] mb-1 font-medium">Message / Preferred Date</label>
                      <textarea
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us about the occasion or design preferences..."
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C2A5]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#1C1611] text-white font-semibold uppercase tracking-wider text-xs hover:bg-[#3D3024] cursor-pointer"
                    >
                      Submit Appointment Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. SHIPPING & DELIVERY */}
        {pageType === 'shipping' && (
          <div className="space-y-6 text-xs text-[#5C4D3E] leading-relaxed animate-fadeIn">
            <h1 className="font-serif text-3xl text-[#1C1611] font-semibold">
              Insured Armoured Transit & Delivery
            </h1>
            <div className="p-4 bg-[#FAF7F2] border border-[#E8DCCB] space-y-2">
              <strong className="text-sm text-[#1C1611] block">100% Fully Insured Nationwide</strong>
              <p>
                Every Milora jewellery consignment travels under comprehensive all-risk transit insurance via specialized armoured logistics carriers (BlueDart Apex Secure). You bear zero financial risk until the package is physically handed to you.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1C1611] uppercase tracking-wider">
                Tamper-Evident Velvet Packaging
              </h4>
              <p>
                All pieces arrive encased in an inner signature velvet heirloom box, enclosed inside a serialized tamper-evident security pouch. Do not accept deliveries if the external outer seal is broken.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1C1611] uppercase tracking-wider">
                One-Time Password (OTP) Handover
              </h4>
              <p>
                To safeguard precious jewellery shipments, parcels are released exclusively upon OTP verification sent directly to the client's registered mobile number at the moment of delivery.
              </p>
            </div>
          </div>
        )}

        {/* 4. RETURNS & EXCHANGES */}
        {pageType === 'returns' && (
          <div className="space-y-6 text-xs text-[#5C4D3E] leading-relaxed animate-fadeIn">
            <h1 className="font-serif text-3xl text-[#1C1611] font-semibold">
              15-Day Exchange & Lifetime Buyback Policy
            </h1>
            <div className="p-4 bg-[#FAF7F2] border border-[#E8DCCB] space-y-2">
              <strong className="text-sm text-[#1C1611] block">15-Day Hassle-Free Exchange</strong>
              <p>
                If your jewellery piece does not fit perfectly or meet your exacting expectations, request an exchange within 15 days of delivery. The item must be unworn, with the security tag intact and all original certificates included.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1C1611] uppercase tracking-wider">
                Lifetime Buyback & Upgrade Guarantee
              </h4>
              <p>
                We stand behind our craftsmanship perpetually. Milora offers transparent buyback and exchange valuation based on the prevailing live gold bullion rate at the time of return, minus minimal melting and polishing deductions. Diamonds are credited at 90% of prevailing benchmark value.
              </p>
            </div>
          </div>
        )}

        {/* 5. JEWELLERY CARE */}
        {pageType === 'care' && (
          <div className="space-y-6 text-xs text-[#5C4D3E] leading-relaxed animate-fadeIn">
            <h1 className="font-serif text-3xl text-[#1C1611] font-semibold">
              Jewellery Preservation & Care Guide
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white border border-[#E8DCCB] space-y-2">
                <strong className="text-[#1C1611] font-semibold block">Gold Jewellery Maintenance</strong>
                <p>
                  Store fine 22K and 18K gold pieces individually in separate velvet compartments to prevent friction and scratches. Avoid wearing fine gold during rigorous workouts or in chlorinated swimming pools.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E8DCCB] space-y-2">
                <strong className="text-[#1C1611] font-semibold block">Diamond & Gemstone Radiance</strong>
                <p>
                  Diamonds naturally attract oils and lotions. Clean gently with lukewarm water and mild dish soap using a soft-bristled baby toothbrush. Rinse thoroughly and pat dry with a lint-free cloth.
                </p>
              </div>
            </div>
            <div className="p-4 bg-[#FAF7F2] border border-[#E8DCCB]">
              <strong className="text-[#1C1611] block">Complimentary Lifetime Polishing</strong>
              <p className="mt-1">
                Bring any authentic Milora piece to our boutiques or ship it via insured transit anytime for complimentary ultrasonic inspection, prong tightening, and rhodium rejuvenation.
              </p>
            </div>
          </div>
        )}

        {/* 6. TERMS & COMPLIANCE */}
        {pageType === 'terms' && (
          <div className="space-y-6 text-xs text-[#5C4D3E] leading-relaxed animate-fadeIn">
            <h1 className="font-serif text-3xl text-[#1C1611] font-semibold">
              Terms of Service & Regulatory Disclosures
            </h1>
            <p>
              Prices displayed on Milora Gold & Diamonds are denominated in Indian Rupees (₹) and include applicable 3% Goods and Services Tax (GST) for precious metals and jewellery.
            </p>
            <p>
              Due to daily market fluctuations in bullion trading on international and Indian commodities exchanges, dynamic gold jewellery pricing reflects the prevailing live gold rate at the exact timestamp of checkout confirmation.
            </p>
            <p>
              Every gold article is certified with the Bureau of Indian Standards (BIS) Hallmark. Certified diamond products are accompanied by independent laboratory certificates (IGI or GIA).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
