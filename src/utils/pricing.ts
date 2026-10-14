import { Product, GoldRates } from '../types';

export interface PriceBreakdown {
  goldRateUsed: number;
  goldValue: number;
  makingCharges: number;
  stoneCharges: number;
  netWeightGm: number;
  grossWeightGm: number;
  subtotal: number;
  gstAmount: number;
  finalPrice: number;
}

export function calculateProductPrice(product: Product, rates: GoldRates): PriceBreakdown {
  if (product.fixedPrice) {
    // Fixed price item (e.g. diamond solitaire with fixed craftsmanship or gold coin)
    const subtotal = Math.round(product.basePrice / 1.03);
    const gstAmount = product.basePrice - subtotal;
    return {
      goldRateUsed: 0,
      goldValue: subtotal,
      makingCharges: 0,
      stoneCharges: 0,
      netWeightGm: product.netGoldWeightGm || 0,
      grossWeightGm: product.grossWeightGm || product.netGoldWeightGm || 0,
      subtotal,
      gstAmount,
      finalPrice: product.basePrice,
    };
  }

  // Dynamic calculation for gold & diamond jewellery
  let goldRate = rates.rate22K;
  if (product.goldPurity === '24K') goldRate = rates.rate24K;
  else if (product.goldPurity === '18K') goldRate = rates.rate18K;

  const netWeight = product.netGoldWeightGm || 0;
  const grossWeight = product.grossWeightGm || netWeight;
  const goldValue = Math.round(netWeight * goldRate);

  let makingCharges = 0;
  if (product.makingChargeType === 'percentage') {
    const pct = product.makingCharges || 12;
    makingCharges = Math.round((goldValue * pct) / 100);
  } else {
    makingCharges = product.makingCharges || 0;
  }

  const stoneCharges = product.stoneCharges || 0;
  const subtotal = goldValue + makingCharges + stoneCharges;
  const gstAmount = Math.round((subtotal * 3) / 100);
  const finalPrice = subtotal + gstAmount;

  return {
    goldRateUsed: goldRate,
    goldValue,
    makingCharges,
    stoneCharges,
    netWeightGm: netWeight,
    grossWeightGm: grossWeight,
    subtotal,
    gstAmount,
    finalPrice,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
