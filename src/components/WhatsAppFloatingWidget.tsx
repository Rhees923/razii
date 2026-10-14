import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloatingWidget: React.FC = () => {
  const { storeSettings, logWhatsAppEnquiry } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || message || 'Hello Milora Gold & Diamonds, I would like to enquire about jewellery availability and bridal appointments.';
    logWhatsAppEnquiry('General Concierge Enquiry', 'CONCIERGE-DIRECT');
    const encoded = encodeURIComponent(textToSend);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#FCFBF7] border border-[#E8DCCB] shadow-2xl p-4 text-xs text-[#221C16] animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3 mb-3 bg-[#1C1611] text-white -m-4 p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <strong className="block font-serif text-sm text-[#F5EFEB]">Milora Concierge</strong>
                <span className="text-[10px] text-[#DAA520]">Heritage Jewellery Specialist</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#D5C2A5] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[#5C4D3E] leading-relaxed mb-3">
            Namaste! How may our senior jewellery consultants assist you today?
          </p>

          <div className="space-y-1.5 mb-3">
            <button
              onClick={() => handleSendMessage('Hello! I would like to book a private VIP Bridal Suite consultation.')}
              className="w-full text-left p-2 bg-[#FAF7F2] hover:bg-[#F2EDE2] border border-[#E8DCCB] text-[11px] text-[#4A3E33] transition-colors cursor-pointer"
            >
              💍 Book Private Bridal Consultation
            </button>
            <button
              onClick={() => handleSendMessage('Hello! Please share today live 22K and 24K gold rates and custom kada designs.')}
              className="w-full text-left p-2 bg-[#FAF7F2] hover:bg-[#F2EDE2] border border-[#E8DCCB] text-[11px] text-[#4A3E33] transition-colors cursor-pointer"
            >
              ✨ Inquire on Custom Design & Gold Rates
            </button>
            <button
              onClick={() => handleSendMessage('Hello! I would like to schedule a High-Definition Video Call to view pieces live.')}
              className="w-full text-left p-2 bg-[#FAF7F2] hover:bg-[#F2EDE2] border border-[#E8DCCB] text-[11px] text-[#4A3E33] transition-colors cursor-pointer"
            >
              📹 Schedule Live Video Shopping Call
            </button>
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your enquiry..."
              className="flex-1 px-2.5 py-1.5 bg-white border border-[#D5C2A5] text-xs focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-3 bg-[#25D366] text-white hover:bg-[#20ba5a] flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#1C1611] text-[#F9F6F0] hover:bg-[#3D3024] shadow-xl border border-[#C5A059] transition-transform hover:scale-105 cursor-pointer group"
        aria-label="Chat with Milora Concierge on WhatsApp"
      >
        <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
          <MessageCircle className="w-4 h-4 fill-white" />
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline text-[#E8D5B5] group-hover:text-white">
          WhatsApp Concierge
        </span>
      </button>
    </div>
  );
};
