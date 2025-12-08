// Shared Content Type Configuration
// Used by both frontend and backend to ensure consistency

export interface ContentTypeConfig {
  default: number;
  min: number;
  max: number;
}

export const contentTypeConfigs: Record<string, ContentTypeConfig> = {
  'blog-post': { default: 800, min: 800, max: 2000 },
  'article': { default: 900, min: 700, max: 1800 },
  'listicle': { default: 900, min: 700, max: 1800 },
  'product-description': { default: 120, min: 50, max: 300 },
  'category-page-description': { default: 350, min: 200, max: 600 },
  'amazon-listing': { default: 450, min: 300, max: 800 },
  'shopify-listing': { default: 450, min: 300, max: 800 },
  'ebay-listing': { default: 350, min: 200, max: 600 },
  'etsy-listing': { default: 350, min: 200, max: 600 },
  'landing-page-copy': { default: 500, min: 300, max: 800 },
  'landing-page-headline': { default: 50, min: 20, max: 100 },
  'cta-generator': { default: 20, min: 10, max: 40 },
  'service-page': { default: 700, min: 500, max: 1200 },
  'about-us': { default: 400, min: 250, max: 600 },
  'newsletter': { default: 200, min: 100, max: 400 },
  'promo-email': { default: 200, min: 100, max: 400 },
  'facebook-ad': { default: 60, min: 20, max: 100 },
  'instagram-ad': { default: 60, min: 20, max: 100 },
  'tiktok-ad': { default: 60, min: 20, max: 100 },
  'google-search-ad': { default: 60, min: 20, max: 100 },
  'linkedin-ad': { default: 60, min: 20, max: 100 },
  'facebook-caption': { default: 80, min: 30, max: 150 },
  'instagram-caption': { default: 80, min: 30, max: 150 },
  'tiktok-caption': { default: 50, min: 20, max: 100 },
  'linkedin-post': { default: 250, min: 150, max: 400 },
  'twitter-post': { default: 30, min: 20, max: 50 },
  'twitter-thread': { default: 150, min: 100, max: 300 },
  'youtube-title-description': { default: 150, min: 100, max: 250 },
  'hashtag-generator': { default: 20, min: 5, max: 29 },
};
