// Shared Location Code Helper
// Used by: youtube-seo-helper, trend-hunter-helper, ppc-spy-helper, multi-engine-helper, content-generator-helper

// Map country codes to DataForSEO location codes (ALL 112 SUPPORTED COUNTRIES)
// Reference: https://docs.dataforseo.com/v3/appendix/locations/
export const COUNTRY_LOCATION_MAP: Record<string, number> = {
  'ww': 2840,      // Worldwide (defaults to US)
  'af': 2004,      // Afghanistan
  'al': 2008,      // Albania
  'dz': 2012,      // Algeria
  'ar': 2032,      // Argentina
  'am': 2051,      // Armenia
  'au': 2036,      // Australia
  'at': 2040,      // Austria
  'az': 2031,      // Azerbaijan
  'bh': 2048,      // Bahrain
  'bd': 2050,      // Bangladesh
  'by': 2112,      // Belarus
  'be': 2056,      // Belgium
  'bo': 2068,      // Bolivia
  'ba': 2070,      // Bosnia and Herzegovina
  'br': 2076,      // Brazil
  'bg': 2100,      // Bulgaria
  'kh': 2116,      // Cambodia
  'ca': 2124,      // Canada
  'cl': 2152,      // Chile
  'co': 2170,      // Colombia
  'cr': 2188,      // Costa Rica
  'hr': 2191,      // Croatia
  'cy': 2196,      // Cyprus
  'cz': 2203,      // Czech Republic
  'dk': 2208,      // Denmark
  'do': 2214,      // Dominican Republic
  'ec': 2218,      // Ecuador
  'eg': 2818,      // Egypt
  'sv': 2222,      // El Salvador
  'ee': 2233,      // Estonia
  'et': 2231,      // Ethiopia
  'fi': 2246,      // Finland
  'fr': 2250,      // France
  'ge': 2268,      // Georgia
  'de': 2276,      // Germany
  'gh': 2288,      // Ghana
  'gr': 2300,      // Greece
  'gt': 2320,      // Guatemala
  'hn': 2340,      // Honduras
  'hk': 2344,      // Hong Kong
  'hu': 2348,      // Hungary
  'is': 2352,      // Iceland
  'in': 2356,      // India
  'id': 2360,      // Indonesia
  'iq': 2368,      // Iraq
  'ie': 2372,      // Ireland
  'il': 2376,      // Israel
  'it': 2380,      // Italy
  'jm': 2388,      // Jamaica
  'jp': 2392,      // Japan
  'jo': 2400,      // Jordan
  'kz': 2398,      // Kazakhstan
  'ke': 2404,      // Kenya
  'kw': 2414,      // Kuwait
  'la': 2418,      // Laos
  'lv': 2428,      // Latvia
  'lb': 2422,      // Lebanon
  'ly': 2434,      // Libya
  'lt': 2440,      // Lithuania
  'lu': 2442,      // Luxembourg
  'my': 2458,      // Malaysia
  'mt': 2470,      // Malta
  'mx': 2484,      // Mexico
  'md': 2498,      // Moldova
  'mn': 2496,      // Mongolia
  'ma': 2504,      // Morocco
  'mm': 2104,      // Myanmar
  'np': 2524,      // Nepal
  'nl': 2528,      // Netherlands
  'nz': 2554,      // New Zealand
  'ni': 2558,      // Nicaragua
  'ng': 2566,      // Nigeria
  'no': 2578,      // Norway
  'om': 2512,      // Oman
  'pk': 2586,      // Pakistan
  'pa': 2591,      // Panama
  'py': 2600,      // Paraguay
  'pe': 2604,      // Peru
  'ph': 2608,      // Philippines
  'pl': 2616,      // Poland
  'pt': 2620,      // Portugal
  'pr': 2630,      // Puerto Rico
  'qa': 2634,      // Qatar
  'ro': 2642,      // Romania
  'ru': 2643,      // Russia
  'sa': 2682,      // Saudi Arabia
  'rs': 2688,      // Serbia
  'sg': 2702,      // Singapore
  'sk': 2703,      // Slovakia
  'si': 2705,      // Slovenia
  'za': 2710,      // South Africa
  'kr': 2410,      // South Korea
  'es': 2724,      // Spain
  'lk': 2144,      // Sri Lanka
  'se': 2752,      // Sweden
  'ch': 2756,      // Switzerland
  'tw': 2158,      // Taiwan
  'tz': 2834,      // Tanzania
  'th': 2764,      // Thailand
  'tn': 2788,      // Tunisia
  'tr': 2792,      // Turkey
  'ug': 2800,      // Uganda
  'ua': 2804,      // Ukraine
  'ae': 2784,      // United Arab Emirates
  'gb': 2826,      // United Kingdom
  'us': 2840,      // United States
  'uy': 2858,      // Uruguay
  'uz': 2860,      // Uzbekistan
  've': 2862,      // Venezuela
  'vn': 2704,      // Vietnam
  'zw': 2716,      // Zimbabwe
};

/**
 * Get DataForSEO location code from country code
 * @param country - ISO country code (e.g., 'us', 'gb', 'de')
 * @returns DataForSEO location code (defaults to 2840 for US if not found)
 */
export function getLocationCode(country: string): number {
  const countryLower = country.toLowerCase();
  const locationCode = COUNTRY_LOCATION_MAP[countryLower] || 2840; // Default to US
  
  return locationCode;
}

/**
 * Normalize domain for comparison
 * Removes protocol, www prefix, and trailing paths
 * @param domain - Domain to normalize (e.g., 'https://www.example.com/path')
 * @returns Normalized domain (e.g., 'example.com')
 */
export function normalizeDomain(domain: string): string {
  let normalized = domain.trim().toLowerCase();
  
  // Remove protocol (http://, https://)
  normalized = normalized.replace(/^https?:\/\//, '');
  
  // Remove www. prefix
  normalized = normalized.replace(/^www\./, '');
  
  // Remove trailing slash and path
  normalized = normalized.split('/')[0];
  
  return normalized;
}

/**
 * Get Google Trends location name from country code
 * DataForSEO Trends API uses location_name (e.g., "United States", "United Kingdom")
 * @param country - ISO country code (e.g., 'us', 'gb', 'de')
 * @returns Location name for Google Trends API
 */
export function getTrendsLocationName(country: string): string {
  const locationMap: Record<string, string> = {
    'ww': 'United States',  // Default worldwide to US
    'us': 'United States',
    'gb': 'United Kingdom',
    'ca': 'Canada',
    'au': 'Australia',
    'de': 'Germany',
    'fr': 'France',
    'es': 'Spain',
    'it': 'Italy',
    'nl': 'Netherlands',
    'be': 'Belgium',
    'ch': 'Switzerland',
    'at': 'Austria',
    'se': 'Sweden',
    'no': 'Norway',
    'dk': 'Denmark',
    'fi': 'Finland',
    'ie': 'Ireland',
    'nz': 'New Zealand',
    'sg': 'Singapore',
    'hk': 'Hong Kong',
    'in': 'India',
    'jp': 'Japan',
    'kr': 'South Korea',
    'br': 'Brazil',
    'mx': 'Mexico',
    'ar': 'Argentina',
    'cl': 'Chile',
    'co': 'Colombia',
    'pe': 'Peru',
    'za': 'South Africa',
    'ng': 'Nigeria',
    'eg': 'Egypt',
    'ke': 'Kenya',
    'ru': 'Russia',
    'ua': 'Ukraine',
    'pl': 'Poland',
    'ro': 'Romania',
    'cz': 'Czech Republic',
    'hu': 'Hungary',
    'gr': 'Greece',
    'pt': 'Portugal',
    'tr': 'Turkey',
    'il': 'Israel',
    'sa': 'Saudi Arabia',
    'ae': 'United Arab Emirates',
    'my': 'Malaysia',
    'th': 'Thailand',
    'id': 'Indonesia',
    'ph': 'Philippines',
    'vn': 'Vietnam',
    'pk': 'Pakistan',
    'bd': 'Bangladesh',
    'tw': 'Taiwan',
  };
  
  const countryLower = country.toLowerCase();
  return locationMap[countryLower] || 'United States'; // Default to US
}