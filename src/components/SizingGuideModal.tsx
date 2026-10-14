import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizingGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'ring' | 'bangle' | 'chain'>('ring');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FCFBF7] border border-[#E8DCCB] shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#996515]" />
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1611] font-semibold">
              Milora Luxury Jewellery Size Guide
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 text-[#5C4D3E] hover:text-[#1C1611] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8DCCB] my-4 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('ring')}
            className={`py-2 px-4 transition-colors cursor-pointer ${
              activeTab === 'ring'
                ? 'border-b-2 border-[#996515] text-[#996515]'
                : 'text-[#8C7A6B] hover:text-[#1C1611]'
            }`}
          >
            Ring Sizing
          </button>
          <button
            onClick={() => setActiveTab('bangle')}
            className={`py-2 px-4 transition-colors cursor-pointer ${
              activeTab === 'bangle'
                ? 'border-b-2 border-[#996515] text-[#996515]'
                : 'text-[#8C7A6B] hover:text-[#1C1611]'
            }`}
          >
            Bangle & Kada Sizing
          </button>
          <button
            onClick={() => setActiveTab('chain')}
            className={`py-2 px-4 transition-colors cursor-pointer ${
              activeTab === 'chain'
                ? 'border-b-2 border-[#996515] text-[#996515]'
                : 'text-[#8C7A6B] hover:text-[#1C1611]'
            }`}
          >
            Necklace & Chain Lengths
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-[#5C4D3E] max-h-[60vh] overflow-y-auto pr-1">
          {activeTab === 'ring' && (
            <div className="space-y-4">
              <p className="leading-relaxed">
                Measure the inside diameter of a well-fitting ring you already own, or wrap a thin strip of paper snugly around your knuckle and measure its length in millimetres.
              </p>

              <table className="w-full text-left border border-[#E8DCCB] text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#E8DCCB] font-semibold text-[#1C1611]">
                  <tr>
                    <th className="p-2.5">Indian Size</th>
                    <th className="p-2.5">Inside Diameter (mm)</th>
                    <th className="p-2.5">Circumference (mm)</th>
                    <th className="p-2.5">US / International</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCB] tabular-nums font-mono">
                  <tr><td className="p-2">10</td><td className="p-2">15.9 mm</td><td className="p-2">50.0 mm</td><td className="p-2">5.5</td></tr>
                  <tr className="bg-[#FCFBF7]"><td className="p-2">12</td><td className="p-2">16.5 mm</td><td className="p-2">51.9 mm</td><td className="p-2">6.0</td></tr>
                  <tr><td className="p-2 font-bold text-[#1C1611]">14 (Most Popular)</td><td className="p-2">17.2 mm</td><td className="p-2">54.0 mm</td><td className="p-2">7.0</td></tr>
                  <tr className="bg-[#FCFBF7]"><td className="p-2 font-bold text-[#1C1611]">16 (Most Popular)</td><td className="p-2">17.8 mm</td><td className="p-2">56.0 mm</td><td className="p-2">7.5</td></tr>
                  <tr><td className="p-2">18</td><td className="p-2">18.5 mm</td><td className="p-2">58.0 mm</td><td className="p-2">8.5</td></tr>
                  <tr className="bg-[#FCFBF7]"><td className="p-2">20</td><td className="p-2">19.1 mm</td><td className="p-2">60.0 mm</td><td className="p-2">9.5</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bangle' && (
            <div className="space-y-4">
              <p className="leading-relaxed">
                Indian bangles are sized by their inner diameter in inches and sixteenths of an inch. Fold your thumb into your palm as if slipping on a closed bangle, and measure across the widest knuckle point.
              </p>

              <table className="w-full text-left border border-[#E8DCCB] text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#E8DCCB] font-semibold text-[#1C1611]">
                  <tr>
                    <th className="p-2.5">Indian Bangle Size</th>
                    <th className="p-2.5">Inner Diameter (Inches)</th>
                    <th className="p-2.5">Inner Diameter (mm)</th>
                    <th className="p-2.5">Wrist Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCB] tabular-nums font-mono">
                  <tr><td className="p-2">2.2</td><td className="p-2">2 - 2/16"</td><td className="p-2">54.0 mm</td><td className="p-2">Extra Petite</td></tr>
                  <tr className="bg-[#FCFBF7]"><td className="p-2">2.4</td><td className="p-2">2 - 4/16"</td><td className="p-2">57.2 mm</td><td className="p-2">Petite / Small</td></tr>
                  <tr><td className="p-2 font-bold text-[#1C1611]">2.6 (Standard)</td><td className="p-2">2 - 6/16"</td><td className="p-2">60.3 mm</td><td className="p-2">Medium / Standard</td></tr>
                  <tr className="bg-[#FCFBF7]"><td className="p-2 font-bold text-[#1C1611]">2.8 (Broad)</td><td className="p-2">2 - 8/16"</td><td className="p-2">63.5 mm</td><td className="p-2">Large / Comfort</td></tr>
                  <tr><td className="p-2">2.10</td><td className="p-2">2 - 10/16"</td><td className="p-2">66.7 mm</td><td className="p-2">Extra Large</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'chain' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#FAF7F2] border border-[#E8DCCB] space-y-2">
                <div>
                  <strong className="text-[#1C1611] block">14" - 16" (Choker & Collar):</strong>
                  <span>Sits closely around the base of the throat. Ideal for bridal aad, high-neck blouses, and cocktail chokers.</span>
                </div>
                <div>
                  <strong className="text-[#1C1611] block">18" (Princess Length - Most Versatile):</strong>
                  <span>Rests elegantly on the collarbone. The ideal standard length for solitaires, diamond pendants, and daily wear mangalsutras.</span>
                </div>
                <div>
                  <strong className="text-[#1C1611] block">22" - 24" (Matinee & Royal Haram):</strong>
                  <span>Falls to the centre of the bust. Ideal for layering with shorter necklaces or wearing temple haram suites.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#E8DCCB] flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2 bg-[#1C1611] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3D3024] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
