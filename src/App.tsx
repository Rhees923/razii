/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CatalogView } from './components/CatalogView';
import { PolicyPages } from './components/PolicyPages';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TaxInvoiceModal } from './components/TaxInvoiceModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SizingGuideModal } from './components/SizingGuideModal';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';

const MainContent: React.FC = () => {
  const {
    currentActivePage,
    setCurrentActivePage,
    selectedProductForDetail,
    setSelectedProductForDetail,
    quickViewProduct,
    setQuickViewProduct,
  } = useStore();

  const handleOpenPolicyPage = (pageName: string) => {
    setCurrentActivePage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF7] text-[#221C16]">
      {/* Top Header */}
      <Header />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {currentActivePage === 'home' && <HomePage />}
        {currentActivePage === 'catalog' && <CatalogView />}
        {['about', 'contact', 'shipping', 'returns', 'care', 'terms'].includes(currentActivePage) && (
          <PolicyPages
            pageType={currentActivePage as any}
            onBackToHome={() => {
              setCurrentActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenPolicyPage={handleOpenPolicyPage} />

      {/* Floating WhatsApp Widget */}
      <WhatsAppFloatingWidget />

      {/* Interactive Global Modals */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
        />
      )}

      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <CartDrawer />
      <CheckoutModal />
      <TaxInvoiceModal />
      <CustomerAccountModal />
      <AdminDashboard />
      <SizingGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
