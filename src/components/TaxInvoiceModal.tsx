import React from 'react';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import { MiloraLogo } from './MiloraLogo';

export const TaxInvoiceModal: React.FC = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder, storeSettings } = useStore();

  if (!activeInvoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white border border-[#E8DCCB] shadow-2xl overflow-hidden my-auto p-6 sm:p-10 font-sans text-[#221C16]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8DCCB] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#996515] font-semibold">
              Official Tax Invoice · Retail Precious Metals
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#1C1611] text-white text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:bg-[#3D3024] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#DAA520]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setActiveInvoiceOrder(null)}
              className="p-1.5 text-[#5C4D3E] hover:text-[#1C1611] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Header */}
        <div className="pt-6 pb-6 border-b border-[#E8DCCB] flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <MiloraLogo className="h-10 w-auto items-start mb-2" color="#4A5D43" />
            <p className="text-xs text-[#8C7A6B] mt-0.5">
              Haute Joaillerie & Royal Bridal Collections
            </p>
            <p className="text-[11px] text-[#5C4D3E] mt-2 max-w-xs leading-relaxed">
              {storeSettings.storeAddress}
              <br />
              Email: {storeSettings.contactEmail} · Care: {storeSettings.contactPhone}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1">
            <div className="font-mono text-sm font-bold text-[#1C1611]">
              INVOICE #{activeInvoiceOrder.orderNumber}
            </div>
            <div className="text-[#5C4D3E]">
              Date: {new Date(activeInvoiceOrder.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="text-[#8B6508] font-semibold">
              Payment Status: {activeInvoiceOrder.paymentStatus} ({activeInvoiceOrder.paymentMethod.toUpperCase()})
            </div>
            <div className="text-[11px] text-[#8C7A6B]">
              Ref ID: {activeInvoiceOrder.paymentId || 'N/A'}
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="py-6 border-b border-[#E8DCCB] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-[#8C7A6B] uppercase tracking-wider font-semibold block mb-1">
              Billed & Consigned To:
            </span>
            <strong className="text-[#1C1611] text-sm block">
              {activeInvoiceOrder.customer.name}
            </strong>
            <p className="text-[#5C4D3E] mt-1 leading-relaxed">
              {activeInvoiceOrder.customer.address.addressLine1}
              {activeInvoiceOrder.customer.address.addressLine2 && `, ${activeInvoiceOrder.customer.address.addressLine2}`}
              <br />
              {activeInvoiceOrder.customer.address.city}, {activeInvoiceOrder.customer.address.state} — {activeInvoiceOrder.customer.address.pincode}
              <br />
              Phone: {activeInvoiceOrder.customer.phone}
            </p>
          </div>

          <div>
            <span className="text-[#8C7A6B] uppercase tracking-wider font-semibold block mb-1">
              Dispatch Verification:
            </span>
            <p className="text-[#5C4D3E] leading-relaxed">
              Logistics Partner: <strong>{activeInvoiceOrder.courierPartner || 'BlueDart Apex Armoured'}</strong>
              <br />
              Security Tracking: <span className="font-mono font-bold text-[#996515]">{activeInvoiceOrder.trackingNumber}</span>
              <br />
              Transit Coverage: 100% Comprehensive All-Risk Marine Jewel Transit Insurance
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1C1611] text-[#1C1611] font-semibold">
                <th className="py-2 pr-2">Item Description & Specification</th>
                <th className="py-2 px-2 text-center">Purity</th>
                <th className="py-2 px-2 text-center">Qty</th>
                <th className="py-2 pl-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCCB]">
              {activeInvoiceOrder.items.map((item, i) => (
                <tr key={i} className="py-2">
                  <td className="py-3 pr-2">
                    <strong className="text-[#1C1611] font-medium block">
                      {item.product.title}
                    </strong>
                    <span className="text-[11px] text-[#8C7A6B]">
                      SKU: {item.product.sku} · Size: {item.selectedSize || 'Standard'}
                      {item.product.netGoldWeightGm ? ` · Net Wt: ${item.product.netGoldWeightGm}g` : ''}
                      {item.product.diamondSpecs ? ` · ${item.product.diamondSpecs.carat}ct Diamond` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-[11px]">
                    {item.product.goldPurity || '18K/22K'}
                  </td>
                  <td className="py-3 px-2 text-center font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-3 pl-2 text-right font-mono tabular-nums font-semibold">
                    {formatINR(item.calculatedPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="border-t-2 border-[#1C1611] pt-4 flex justify-end text-xs">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-[#5C4D3E]">
              <span>Subtotal:</span>
              <span className="font-mono tabular-nums">{formatINR(activeInvoiceOrder.subtotal)}</span>
            </div>

            {activeInvoiceOrder.discount > 0 && (
              <div className="flex justify-between text-[#8B6508]">
                <span>Coupon Discount ({activeInvoiceOrder.couponCode}):</span>
                <span className="font-mono tabular-nums">- {formatINR(activeInvoiceOrder.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#5C4D3E]">
              <span>Precious Metals GST (3%):</span>
              <span className="font-mono tabular-nums">{formatINR(activeInvoiceOrder.taxGst)}</span>
            </div>

            <div className="flex justify-between text-[#5C4D3E]">
              <span>Armoured Shipping:</span>
              <span className="font-mono tabular-nums">Complimentary</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#1C1611] border-t border-[#E8DCCB] pt-2">
              <span>Final Total:</span>
              <span className="font-serif font-bold text-lg tabular-nums">
                {formatINR(activeInvoiceOrder.finalTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Authenticity Certificate Note */}
        <div className="mt-8 pt-4 border-t border-[#E8DCCB] text-[11px] text-[#8C7A6B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#996515]" />
            <span>BIS Hallmarked 916 / 750 Gold with Laser Engraved HUID. Lifetime exchange & buyback backed by Milora.</span>
          </div>
          <span className="font-serif italic text-xs text-[#1C1611]">Milora Gold & Diamonds</span>
        </div>
      </div>
    </div>
  );
};
