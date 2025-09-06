import { useCss } from '../hooks/useCss';
import { Css } from '../helpers/html';
import 'flag-icons/css/flag-icons.min.css';

const css: Css = {
  '&': {
    display: 'inline-block',
    width: '1.33em',
    height: '1em',
    borderRadius: '2px',
    overflow: 'hidden',
    verticalAlign: 'middle',
  },
  '&-square': {
    width: '1em',
    height: '1em',
  },
};

export interface FlagProps {
  cls?: string;
  iso: string; // ISO 3166-1 alpha-2 country code
  title?: string;
  size?: string | number;
  variant?: '4x3' | '1x1'; // 4x3 (rectangle) or 1x1 (square)
}

// Mapping pour les codes alternatifs
const ISO_MAPPING: Record<string, string> = {
  en: 'gb', // English -> Great Britain
  uk: 'gb', // United Kingdom -> Great Britain
};

export const Flag = ({ cls, iso, title, size, variant = '4x3' }: FlagProps) => {
  const c = useCss('Flag', css);

  // Normalize ISO code to lowercase
  let normalizedIso = iso?.toLowerCase() || '';

  // Apply mapping for alternative codes
  if (normalizedIso in ISO_MAPPING) {
    normalizedIso = ISO_MAPPING[normalizedIso];
  }

  // Determine title
  const flagTitle = title || `Flag of ${iso?.toUpperCase() || 'Unknown'}`;

  // Build flag-icons classes
  const flagClass = `fi fi-${normalizedIso}`;
  const variantClass = variant === '1x1' ? `${c}-square` : '';
  const classes = `${c} ${flagClass} ${variantClass} ${cls || ''}`.trim();

  const style: any = {};
  if (size) {
    const sizeValue = typeof size === 'number' ? `${size}em` : size;
    style.width = variant === '1x1' ? sizeValue : `${parseFloat(sizeValue) * 1.33}em`;
    style.height = sizeValue;
  }

  return <span className={classes} title={flagTitle} style={style} />;
};

/**
 * Utilitaire pour obtenir la classe CSS d'un drapeau
 * @param iso Code ISO 3166-1 alpha-2
 * @returns Classe CSS flag-icons
 */
export const getFlagClass = (iso: string): string => {
  let normalizedIso = iso?.toLowerCase() || '';

  // Apply mapping for alternative codes
  if (normalizedIso in ISO_MAPPING) {
    normalizedIso = ISO_MAPPING[normalizedIso];
  }

  return `fi fi-${normalizedIso}`;
};

/**
 * Utilitaire pour vérifier si un code ISO est supporté par flag-icons
 * @param iso Code ISO 3166-1 alpha-2
 * @returns true si le drapeau est disponible
 * Note: flag-icons supporte la plupart des codes ISO 3166-1 alpha-2
 */
export const isFlagSupported = (iso: string): boolean => {
  const normalizedIso = iso?.toLowerCase() || '';
  // flag-icons supporte presque tous les codes ISO valides
  // On peut faire une vérification basique sur la longueur
  return /^[a-z]{2}$/.test(normalizedIso) || normalizedIso in ISO_MAPPING;
};

/**
 * Liste des codes ISO les plus couramment utilisés
 */
export const COMMON_COUNTRIES = [
  'fr',
  'en',
  'gb',
  'de',
  'es',
  'it',
  'pt',
  'nl',
  'be',
  'ch',
  'at',
  'se',
  'no',
  'dk',
  'fi',
  'pl',
  'cz',
  'hu',
  'gr',
  'ro',
  'us',
  'ca',
  'mx',
  'br',
  'ar',
  'cl',
  'co',
  'pe',
  've',
  'uy',
  'cn',
  'jp',
  'kr',
  'in',
  'th',
  'vn',
  'sg',
  'my',
  'id',
  'ph',
  'au',
  'nz',
  'za',
  'ng',
  'eg',
  'ma',
  'ae',
  'sa',
  'il',
  'tr',
] as const;
