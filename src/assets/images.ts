import heroBridalImg from './images/hero_bridal_gold_necklace_1791799910845.jpg';
import diamondRingImg from './images/product_diamond_solitaire_ring_1791799924373.jpg';
import goldBanglesImg from './images/product_traditional_gold_bangles_1791799937748.jpg';
import diamondNecklaceImg from './images/product_diamond_necklace_emerald_1791799949168.jpg';
import craftsmanshipImg from './images/craftsmanship_artisan_jeweller_1791799960457.jpg';

export const JEWELLERY_IMAGES = {
  heroBridal: heroBridalImg,
  diamondRing: diamondRingImg,
  goldBangles: goldBanglesImg,
  diamondNecklace: diamondNecklaceImg,
  craftsmanship: craftsmanshipImg,
};

/**
 * Universal image resolver that safely resolves image paths in both Vite dev mode
 * and production builds, migrating any legacy '/src/assets/...' or '/images/...' paths.
 */
export function resolveJewelleryImage(path?: string): string {
  if (!path) return heroBridalImg;

  // External web URLs
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const lower = path.toLowerCase();

  if (lower.includes('hero_bridal') || lower.includes('noorani')) {
    return heroBridalImg;
  }
  if (lower.includes('solitaire') || lower.includes('diamond_ring') || lower.includes('eternity') || lower.includes('tennis')) {
    return diamondRingImg;
  }
  if (lower.includes('bangle') || lower.includes('kadas') || lower.includes('traditional_gold') || lower.includes('coin')) {
    return goldBanglesImg;
  }
  if (lower.includes('emerald') || lower.includes('necklace_emerald') || lower.includes('mangalsutra')) {
    return diamondNecklaceImg;
  }
  if (lower.includes('craftsmanship') || lower.includes('artisan') || lower.includes('jeweller') || lower.includes('chain')) {
    return craftsmanshipImg;
  }

  // If already a valid public path (e.g. /images/...)
  if (path.startsWith('/images/')) {
    return path;
  }

  // Fallback to hero bridal master image
  return heroBridalImg;
}
