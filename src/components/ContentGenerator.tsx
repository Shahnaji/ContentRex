import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Globe } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { countries } from '../utils/countries';
import { contentTypeConfigs, ContentTypeConfig } from '../utils/content-type-configs';
import { getRemainingFreeUsage, hasReachedFreeLimit, incrementUsage } from '../utils/usageTracking';
import { UsageLimitModal } from './UsageLimitModal';
import { saveToHistory } from './HistoryTab';

interface SEOAnalysis {
  overallScore: number;
  titleScore: number;
  contentScore: number;
  keywordScore: number;
  metaScore: number;
  readabilityScore: number;
}

interface ExtractedElements {
  // Blog
  title?: string;
  headings?: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  metaDescription?: string;
  keywords?: string[];
  
  // eCommerce
  productTitle?: string;
  bulletPoints?: string[];
  categoryTags?: string[];
  metaTags?: string[];
  
  // Landing
  mainHeadline?: string;
  subheadings?: string[];
  ctaText?: string[];
  metaTitle?: string;
  
  // Social
  mainCaption?: string;
  hashtags?: string[];
  emojis?: string[];
  characterCount?: number;
  platformLimit?: number;
  engagementHook?: string;
  
  // Email/Ad
  subjectLine?: string;
  mainCopy?: string;
  cta?: string;
  
  // YouTube
  videoTitle?: string;
  description?: string;
  timestamps?: string[];
}

interface ContentGeneratorProps {
  user?: any;
  onSignUpClick?: () => void;
  isDashboard?: boolean;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ user, onSignUpClick, isDashboard }) => {
  const [mode, setMode] = useState<'generate' | 'repurpose'>('generate');
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [targetKeyword, setTargetKeyword] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [targetAudience, setTargetAudience] = useState('all-ages');
  const [writingTone, setWritingTone] = useState('professional');
  const [framework, setFramework] = useState('no-framework');
  const [country, setCountry] = useState('WW');
  const [wordCount, setWordCount] = useState('800');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [targetFormat, setTargetFormat] = useState('social-media');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null);
  const [extractedElements, setExtractedElements] = useState<ExtractedElements | null>(null);
  const [copied, setCopied] = useState(false);
  const [contentStatus, setContentStatus] = useState<'success' | 'warning' | 'needs_retry' | 'failed' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [attemptHistory, setAttemptHistory] = useState<Array<{ iteration: number; score: number }>>([]);
  const [showRetryPanel, setShowRetryPanel] = useState(false);
  const [retryPayload, setRetryPayload] = useState<any>(null);

  // Update word count when content type changes
  const handleContentTypeChange = (newContentType: string) => {
    setContentType(newContentType);
    const config = contentTypeConfigs[newContentType];
    if (config) {
      setWordCount(config.default.toString());
    }
  };

  const handleGenerate = async () => {
    // Check usage limit for non-authenticated users
    if (!user && hasReachedFreeLimit()) {
      setShowUsageLimitModal(true);
      return;
    }

    if (mode === 'generate' && !targetKeyword) {
      toast.error('Please enter a target keyword');
      return;
    }

    if (mode === 'repurpose' && !originalContent) {
      toast.error('Please paste your content to repurpose');
      return;
    }

    // Validate word count for generate mode
    if (mode === 'generate') {
      if (!wordCount || wordCount.trim() === '') {
        toast.error('Please enter a word count');
        return;
      }

      const wordCountNum = parseInt(wordCount);
      const config = contentTypeConfigs[contentType];
      
      if (isNaN(wordCountNum)) {
        toast.error('Word count must be a valid number');
        return;
      }

      if (config && (wordCountNum < config.min || wordCountNum > config.max)) {
        toast.error(`Word count must be between ${config.min} and ${config.max} for ${contentType}`);
        return;
      }
    }

    setLoading(true);
    setLoadingStage(0);
    setLoadingProgress(0);
    setGeneratedContent('');
    setSeoAnalysis(null);
    setExtractedElements(null);
    setContentStatus(null);
    setStatusMessage('');
    setAttemptHistory([]);
    setShowRetryPanel(false);
    setRetryPayload(null);

    // Animate loading stages
    let stageInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    stageInterval = setInterval(() => {
      setLoadingStage(prev => (prev < 5 ? prev + 1 : prev));
    }, 12000); // Change stage every 12 seconds

    progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 800); // Update progress every 800ms

    try {
      const endpoint = mode === 'generate' 
        ? '/make-server-c658ea3d/generate-content'
        : '/make-server-c658ea3d/repurpose-content';

      const payload = mode === 'generate'
        ? {
            targetKeyword,
            contentType,
            targetAudience,
            writingTone,
            framework,
            country,
            wordCount,
            additionalInstructions,
            isRetry: false
          }
        : {
            originalContent,
            contentType,
            targetKeyword,
            country,
            wordCount
          };

      // Store payload for potential retry
      if (mode === 'generate') {
        setRetryPayload(payload);
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
        if (data.seoAnalysis) {
          setSeoAnalysis(data.seoAnalysis);
        }
        if (data.extractedElements) {
          setExtractedElements(data.extractedElements);
        }
        setContentStatus(data.status || 'success');
        setStatusMessage(data.message || 'Content generated successfully!');
        setAttemptHistory(data.attempts || []);
        
        // Save to history
        saveToHistory({
          tool: 'content-generator',
          mode,
          contentType,
          keyword: targetKeyword,
          targetFormat: mode === 'repurpose' ? targetFormat : undefined,
          generatedContent: data.content,
          seoAnalysis: data.seoAnalysis,
          extractedElements: data.extractedElements,
          metadata: {
            wordCount,
            country,
            audience: targetAudience,
            tone: writingTone,
            framework
          }
        });
        
        // Increment usage for non-authenticated users
        if (!user) {
          incrementUsage();
        }
        
        if (data.status === 'needs_retry') {
          // Score < 70 after first 3 iterations, offer retry
          toast.warning('Content needs improvement. Would you like to retry?');
          setShowRetryPanel(true);
        } else if (data.status === 'warning') {
          toast.warning(data.message || 'Content generated with warnings');
        } else {
          toast.success(data.message || 'Content generated successfully!');
        }
      } else if (data.status === 'failed') {
        // Score < 70 after 6 total iterations
        setContentStatus('failed');
        setStatusMessage(data.message);
        setAttemptHistory(data.attempts || []);
        setShowRetryPanel(true);
        
        if (data.content && data.seoAnalysis) {
          setGeneratedContent(data.content);
          setSeoAnalysis(data.seoAnalysis);
        }
        
        toast.error(data.message || 'Content quality too low');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Content generation error:', error);
      toast.error(error.message || 'Failed to generate content. Please try again.');
    } finally {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingStage(0);
      setLoadingProgress(0);
    }
  };

  const handleRetry = async () => {
    if (!retryPayload) {
      toast.error('No retry data available');
      return;
    }

    setLoading(true);
    setLoadingStage(0);
    setLoadingProgress(0);
    setShowRetryPanel(false);

    // Animate loading stages for retry
    let stageInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    stageInterval = setInterval(() => {
      setLoadingStage(prev => (prev < 5 ? prev + 1 : prev));
    }, 12000);

    progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 800);

    try {
      const retryData = { ...retryPayload, isRetry: true };
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c658ea3d/generate-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(retryData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to retry content generation');
      }

      const data = await response.json();

      if (data.success || data.status === 'failed') {
        setGeneratedContent(data.content);
        if (data.seoAnalysis) {
          setSeoAnalysis(data.seoAnalysis);
        }
        if (data.extractedElements) {
          setExtractedElements(data.extractedElements);
        }
        setContentStatus(data.status);
        setStatusMessage(data.message);
        setAttemptHistory(data.attempts || []);

        if (data.status === 'failed') {
          setShowRetryPanel(true);
          toast.error(data.message || 'Content quality still too low after retry');
        } else if (data.status === 'warning') {
          toast.warning(data.message);
        } else {
          toast.success(data.message || 'Content improved successfully!');
        }
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Retry error:', error);
      toast.error(error.message || 'Failed to retry. Please try again.');
    } finally {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingStage(0);
      setLoadingProgress(0);
    }
  };

  const handleCopy = () => {
    try {
      // Fallback method for clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = generatedContent;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          toast.success('Copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } else {
          toast.error('Failed to copy to clipboard');
        }
      } catch (err) {
        console.error('Copy failed:', err);
        toast.error('Failed to copy to clipboard');
      }
      
      document.body.removeChild(textArea);
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mode Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => {
            setMode('generate');
            // Clear all input fields
            setTargetKeyword('');
            setContentType('blog-post');
            setWordCount('800');
            setCountry('WW');
            setTargetAudience('');
            setWritingTone('professional');
            setFramework('no-framework');
            setAdditionalInstructions('');
            setOriginalContent('');
            // Clear output fields
            setGeneratedContent('');
            setSeoAnalysis(null);
            setExtractedElements(null);
            setShowRetryPanel(false);
            setContentStatus(null);
            setStatusMessage('');
            setAttemptHistory([]);
            setRetryPayload(null);
          }}
          className={`px-6 py-3 rounded-lg transition-colors ${
            mode === 'generate'
              ? 'bg-[#ff7d00] text-white shadow-lg'
              : 'bg-white text-[#001524] border-2 border-[#15616d] hover:bg-[#ffecd1]'
          }`}
        >
          Generate Content
        </button>
        <button
          onClick={() => {
            setMode('repurpose');
            // Clear all input fields
            setOriginalContent('');
            setTargetFormat('social-media');
            setContentType('blog-post');
            setWordCount('800');
            setTargetKeyword('');
            setTargetAudience('');
            setWritingTone('professional');
            setFramework('no-framework');
            setAdditionalInstructions('');
            // Clear output fields
            setGeneratedContent('');
            setSeoAnalysis(null);
            setExtractedElements(null);
            setShowRetryPanel(false);
            setContentStatus(null);
            setStatusMessage('');
            setAttemptHistory([]);
            setRetryPayload(null);
          }}
          className={`px-6 py-3 rounded-lg transition-colors ${
            mode === 'repurpose'
              ? 'bg-[#ff7d00] text-white shadow-lg'
              : 'bg-white text-[#001524] border-2 border-[#15616d] hover:bg-[#ffecd1]'
          }`}
        >
          Repurpose Content
        </button>
      </div>

      <div className="space-y-8">
        {/* Usage Counter for Non-Authenticated Users (Only on Public Landing Page) */}
        <div className="max-w-4xl mx-auto">
          {!user && !isDashboard && (
            <div className="mb-4 bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white px-4 py-3 rounded-lg shadow-lg text-center">
              <p className="text-base">
                ✨ <strong>{getRemainingFreeUsage()} of 3</strong> free generations remaining
                {getRemainingFreeUsage() > 0 && (
                  <span className="block text-sm mt-1 text-[#ffecd1]">
                    Sign up for unlimited access with a 14-day free trial!
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-[#15616d] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-2xl text-[#001524] mb-6">
              {mode === 'generate' ? 'Generate Content' : 'Repurpose Content'}
            </h2>

            {mode === 'generate' ? (
              <div className="space-y-5">
                {/* Content Input - Full Width */}
                <div>
                  <label className="block text-sm text-[#15616d] mb-2">
                    Content Input
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter a keyword, custom prompt, or URL"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                  />
                  <p className="text-xs text-[#15616d] mt-1 text-center opacity-70">
                    📌 Keyword  •  ✍️ Custom Prompt  •  🔗 URL
                  </p>
                </div>

                {/* 5 fields in 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Content Type */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Content Type
                    </label>
                    <select 
                      value={contentType} 
                      onChange={(e) => handleContentTypeChange(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    >
                      <optgroup label="📝 Blog & Long-Form">
                        <option value="blog-post">Blog Post</option>
                        <option value="article">Article</option>
                        <option value="listicle">Listicle</option>
                      </optgroup>
                      
                      <optgroup label="🛍️ Product & eCommerce">
                        <option value="product-description">Product Description</option>
                        <option value="category-page-description">Category Page Description</option>
                        <option value="amazon-listing">Amazon Listing</option>
                        <option value="shopify-listing">Shopify Listing</option>
                        <option value="ebay-listing">Ebay Listing</option>
                        <option value="etsy-listing">Etsy Listing</option>
                      </optgroup>
                      
                      <optgroup label="🧭 Landing & Website Copy">
                        <option value="landing-page-copy">Landing Page Copy</option>
                        <option value="landing-page-headline">Landing Page Headline & Subheadline</option>
                        <option value="cta-generator">Call-to-Action (CTA) Generator</option>
                        <option value="service-page">Service Page</option>
                        <option value="about-us">About Us</option>
                      </optgroup>
                      
                      <optgroup label="💌 Email Campaign">
                        <option value="newsletter">Newsletter</option>
                        <option value="promo-email">Promo Email</option>
                      </optgroup>
                      
                      <optgroup label="📢💸 Ad Copy">
                        <option value="facebook-ad">Facebook Ad</option>
                        <option value="instagram-ad">Instagram Ad</option>
                        <option value="tiktok-ad">TikTok Ad</option>
                        <option value="google-search-ad">Google Search Ad</option>
                        <option value="linkedin-ad">LinkedIn Ad</option>
                      </optgroup>
                      
                      <optgroup label="📱 Social Media & Content Marketing">
                        <option value="facebook-caption">Facebook Caption</option>
                        <option value="instagram-caption">Instagram Caption</option>
                        <option value="tiktok-caption">TikTok Caption</option>
                        <option value="linkedin-post">LinkedIn Post</option>
                        <option value="twitter-post">Twitter/X Post</option>
                        <option value="twitter-thread">Twitter/X Thread</option>
                        <option value="youtube-title-description">YouTube Title + Description</option>
                        <option value="hashtag-generator">Hashtag Generator</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Target Audience
                    </label>
                    <select 
                      value={targetAudience} 
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    >
                      <option value="gen-z">Gen Z</option>
                      <option value="millennials">Millennials</option>
                      <option value="gen-x">Gen X</option>
                      <option value="all-ages">All Ages</option>
                    </select>
                  </div>

                  {/* Writing Tone */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Writing Tone
                    </label>
                    <select 
                      value={writingTone} 
                      onChange={(e) => setWritingTone(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="humorous">Humorous</option>
                      <option value="motivational">Motivational</option>
                      <option value="direct">Direct</option>
                    </select>
                  </div>

                  {/* Copywriting Framework */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Copywriting Framework
                    </label>
                    <select 
                      value={framework} 
                      onChange={(e) => setFramework(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    >
                      <option value="no-framework">No Framework</option>
                      <option value="aida">AIDA (Attention, Interest, Desire, Action)</option>
                      <option value="pas">PAS (Problem, Agitate, Solution)</option>
                      <option value="bab">BAB (Before, After, Bridge)</option>
                      <option value="4ps">4Ps (Promise, Picture, Proof, Push)</option>
                      <option value="fab">FAB (Features, Advantages, Benefits)</option>
                    </select>
                  </div>

                  {/* Target Country */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2 flex items-center gap-2">
                      Target Country
                      <Globe className="w-4 h-4" />
                    </label>
                    <select 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Word Count */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Word Count ({contentTypeConfigs[contentType]?.min || 100}-{contentTypeConfigs[contentType]?.max || 5000})
                    </label>
                    <input
                      type="number"
                      min={contentTypeConfigs[contentType]?.min || 100}
                      max={contentTypeConfigs[contentType]?.max || 5000}
                      value={wordCount}
                      onChange={(e) => setWordCount(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    />
                  </div>
                </div>

                {/* Additional Instructions - Full Width */}
                <div>
                  <label className="block text-sm text-[#15616d] mb-2">
                    Additional Instructions (Optional)
                  </label>
                  <Textarea
                    placeholder="Any specific requirements or guidelines..."
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] min-h-[100px]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Original Content - Full Width */}
                <div>
                  <label className="block text-sm text-[#15616d] mb-2">
                    Original Content
                  </label>
                  <Textarea
                    placeholder="Paste your existing content here to repurpose..."
                    value={originalContent}
                    onChange={(e) => setOriginalContent(e.target.value)}
                    className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] min-h-[200px]"
                  />
                </div>

                {/* 4 fields in 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Target Content Type */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Target Content Type
                    </label>
                    <select 
                      value={contentType} 
                      onChange={(e) => handleContentTypeChange(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    >
                      <optgroup label="📝 Blog & Long-Form">
                        <option value="blog-post">Blog Post</option>
                        <option value="article">Article</option>
                        <option value="listicle">Listicle</option>
                      </optgroup>
                      
                      <optgroup label="🛍️ Product & eCommerce">
                        <option value="product-description">Product Description</option>
                        <option value="category-page-description">Category Page Description</option>
                        <option value="amazon-listing">Amazon Listing</option>
                        <option value="shopify-listing">Shopify Listing</option>
                        <option value="ebay-listing">Ebay Listing</option>
                        <option value="etsy-listing">Etsy Listing</option>
                      </optgroup>
                      
                      <optgroup label="🧭 Landing & Website Copy">
                        <option value="landing-page-copy">Landing Page Copy</option>
                        <option value="landing-page-headline">Landing Page Headline & Subheadline</option>
                        <option value="cta-generator">Call-to-Action (CTA) Generator</option>
                        <option value="service-page">Service Page</option>
                        <option value="about-us">About Us</option>
                      </optgroup>
                      
                      <optgroup label="💌 Email Campaign">
                        <option value="newsletter">Newsletter</option>
                        <option value="promo-email">Promo Email</option>
                      </optgroup>
                      
                      <optgroup label="📢💸 Ad Copy">
                        <option value="facebook-ad">Facebook Ad</option>
                        <option value="instagram-ad">Instagram Ad</option>
                        <option value="tiktok-ad">TikTok Ad</option>
                        <option value="google-search-ad">Google Search Ad</option>
                        <option value="linkedin-ad">LinkedIn Ad</option>
                      </optgroup>
                      
                      <optgroup label="📱 Social Media & Content Marketing">
                        <option value="facebook-caption">Facebook Caption</option>
                        <option value="instagram-caption">Instagram Caption</option>
                        <option value="tiktok-caption">TikTok Caption</option>
                        <option value="linkedin-post">LinkedIn Post</option>
                        <option value="twitter-post">Twitter/X Post</option>
                        <option value="twitter-thread">Twitter/X Thread</option>
                        <option value="youtube-title-description">YouTube Title + Description</option>
                        <option value="hashtag-generator">Hashtag Generator</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2 flex items-center justify-center gap-1">
                      <Globe className="w-4 h-4" />
                      Country
                    </label>
                    <select 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#15616d] rounded-lg focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    >
                      <option value="WW">🌍 Worldwide</option>
                      <optgroup label="Popular Countries">
                        <option value="US">🇺🇸 United States</option>
                        <option value="GB">🇬🇧 United Kingdom</option>
                        <option value="CA">🇨🇦 Canada</option>
                        <option value="AU">🇦🇺 Australia</option>
                        <option value="IN">🇮🇳 India</option>
                      </optgroup>
                      <optgroup label="All Countries">
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Target Keyword (Optional) */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Target Keyword (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., digital marketing"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    />
                  </div>

                  {/* Word Count */}
                  <div>
                    <label className="block text-sm text-[#15616d] mb-2">
                      Target Word Count
                    </label>
                    <Input
                      type="number"
                      placeholder="800"
                      value={wordCount}
                      onChange={(e) => setWordCount(e.target.value)}
                      min={contentTypeConfigs[contentType]?.min || 10}
                      max={contentTypeConfigs[contentType]?.max || 2000}
                      className="border-2 border-[#15616d] focus:border-[#ff7d00] focus:ring-2 focus:ring-[#ff7d00] text-center"
                    />
                    <p className="text-xs text-[#15616d] mt-1 text-center opacity-70">
                      Range: {contentTypeConfigs[contentType]?.min || 10} - {contentTypeConfigs[contentType]?.max || 2000} words
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-6 py-4 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-center"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  🎨 {mode === 'generate' ? 'Creating Your Content...' : 'Repurposing Your Content...'}
                </span>
              ) : (
                mode === 'generate' ? '✨ Generate Content' : '🔄 Repurpose Content'
              )}
            </button>

            {/* Timing Message or Loading Animation */}
            <div className="mt-3 text-center">
              {!loading ? (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ffecd1] to-[#fff] rounded-full border-2 border-[#ff7d00] shadow-sm"
                >
                  <span className="text-xl">⏱️</span>
                  <span className="text-sm text-[#001524]">
                    <span className="opacity-70">Generation typically takes</span>{' '}
                    <span className="text-[#ff7d00]">1-2 minutes</span>
                  </span>
                  <span className="text-xl">✨</span>
                </motion.div>
              ) : (
                <div className="w-full max-w-2xl mx-auto space-y-4 py-8">
                  {/* Animated Stage Display */}
                  <motion.div
                    key={loadingStage}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center"
                  >
                    <div className="text-6xl mb-4">
                      {loadingStage === 0 && '🔍'}
                      {loadingStage === 1 && '✨'}
                      {loadingStage === 2 && '🚀'}
                      {loadingStage === 3 && '💎'}
                      {loadingStage === 4 && '🎯'}
                      {loadingStage === 5 && '🏆'}
                    </div>
                    <h3 className="text-2xl text-[#001524] mb-2">
                      {loadingStage === 0 && 'Analyzing Your Input...'}
                      {loadingStage === 1 && 'Generating Draft 1...'}
                      {loadingStage === 2 && 'Improving Draft 2...'}
                      {loadingStage === 3 && 'Perfecting Draft 3...'}
                      {loadingStage === 4 && 'Optimizing SEO Score...'}
                      {loadingStage === 5 && 'Almost Ready!'}
                    </h3>
                    <p className="text-[#15616d]">
                      {loadingStage === 0 && 'Understanding your requirements and gathering insights...'}
                      {loadingStage === 1 && 'Creating your first high-quality content draft...'}
                      {loadingStage === 2 && 'Enhancing content structure and keyword placement...'}
                      {loadingStage === 3 && 'Fine-tuning language, tone, and engagement...'}
                      {loadingStage === 4 && 'Running final SEO checks and scoring...'}
                      {loadingStage === 5 && 'Selecting the best version for you...'}
                    </p>
                  </motion.div>

                  {/* Animated Progress Bar */}
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff7d00] via-[#15616d] to-[#ff7d00]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${Math.min(loadingProgress, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                  </div>

                  {/* Floating Particles */}
                  <div className="flex justify-center gap-4 py-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-[#ff7d00]"
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Fun Facts Carousel */}
                  <motion.div
                    key={`fact-${loadingStage}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-sm text-gray-600 italic bg-[#ffecd1] rounded-lg p-3"
                  >
                    {loadingStage === 0 && '💡 Did you know? Our AI analyzes over 50 SEO factors!'}
                    {loadingStage === 1 && '💡 Fun fact: We use 3-iteration improvement for top quality!'}
                    {loadingStage === 2 && '💡 Pro tip: Our granular scoring detects 30+ quality variations!'}
                    {loadingStage === 3 && '💡 Smart: Each iteration builds on the previous one!'}
                    {loadingStage === 4 && '💡 Smart: We auto-select the highest scoring version!'}
                    {loadingStage === 5 && '💡 Almost there! Your content is ready in seconds...'}
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Retry Panel - Shown when score < 70 after 3 iterations (needs_retry) */}
        {showRetryPanel && contentStatus === 'needs_retry' && seoAnalysis && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-500 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🔄</div>
                <h2 className="text-2xl text-[#001524] mb-2">Almost There! Let's Try Again 💪</h2>
                <p className="text-[#15616d]">Score: {seoAnalysis.overallScore}/100 after {attemptHistory.length} attempts</p>
              </div>

              {/* Attempt History */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">📊 Attempt Scores:</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {attemptHistory.map((attempt) => (
                    <Badge key={attempt.iteration} variant="outline" className="text-yellow-700 border-yellow-400">
                      #{attempt.iteration}: {attempt.score}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Encouraging message */}
              <div className="text-center mb-6 bg-white rounded-lg p-4">
                <p className="text-lg text-[#001524] mb-3">
                  ✨ <span className="text-[#ff7d00]">We're close!</span> Let's do 3 more iterations to improve this! 🚀
                </p>
                <p className="text-sm text-[#15616d]">
                  Our AI will make another 3 attempts to reach the quality threshold.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="px-8 py-3 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>🎨 Retrying...</>
                  ) : (
                    <>🔄 Try 3 More Iterations (Total 6)</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRetryPanel(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-white text-[#001524] border-2 border-[#15616d] rounded-lg hover:bg-[#ffecd1] transition-colors"
                >
                  🎨 Start Fresh Instead
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Final Failure Panel - Shown when score < 70 after 6 total iterations (failed) */}
        {showRetryPanel && contentStatus === 'failed' && seoAnalysis && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🔴</div>
                <h2 className="text-2xl text-red-700 mb-2">Quality Warning: Unable to Meet Standards</h2>
                <p className="text-red-600">We attempted 6 optimizations but couldn't reach the 70+ target.</p>
                <p className="text-red-700 mt-2">Best score achieved: {seoAnalysis.overallScore}/100</p>
              </div>

              {/* Attempt History */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">📊 All Attempt Scores:</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {attemptHistory.map((attempt) => (
                    <Badge key={attempt.iteration} variant="outline" className="text-red-600 border-red-300">
                      #{attempt.iteration}: {attempt.score}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Encouraging message */}
              <div className="text-center mb-6 bg-white rounded-lg p-4">
                <p className="text-lg text-[#001524] mb-3">
                  🎯 <span className="text-[#ff7d00]">Don't worry!</span> Let's try a different approach
                </p>
                <p className="text-sm text-[#15616d]">
                  Sometimes adjusting your inputs can make a big difference. Try:
                </p>
              </div>

              {/* Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border-2 border-[#ff7d00] rounded-lg p-4">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="text-[#001524] mb-2">Simplify Your Keyword</h3>
                  <p className="text-sm text-[#15616d]">Try using a shorter, more focused keyword</p>
                </div>
                <div className="bg-white border-2 border-[#ff7d00] rounded-lg p-4">
                  <div className="text-2xl mb-2">📏</div>
                  <h3 className="text-[#001524] mb-2">Adjust Word Count</h3>
                  <p className="text-sm text-[#15616d]">Try increasing by 200-300 words</p>
                </div>
                <div className="bg-white border-2 border-[#ff7d00] rounded-lg p-4">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="text-[#001524] mb-2">Change Content Type</h3>
                  <p className="text-sm text-[#15616d]">Try "Article" instead of "Listicle"</p>
                </div>
                <div className="bg-white border-2 border-[#ff7d00] rounded-lg p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <h3 className="text-[#001524] mb-2">Simplify Instructions</h3>
                  <p className="text-sm text-[#15616d]">Remove complex additional requirements</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3 bg-[#ff7d00] text-white rounded-lg hover:bg-[#78290f] transition-colors"
                >
                  🔄 Try Again with Adjustments
                </button>
                <button
                  onClick={() => setShowRetryPanel(false)}
                  className="px-6 py-3 bg-white text-[#001524] border-2 border-[#15616d] rounded-lg hover:bg-[#ffecd1] transition-colors"
                >
                  ✏️ Use This Draft Anyway
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* SEO Analysis Section */}
        {seoAnalysis && !showRetryPanel && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">📊</span>
                <h2 className="text-2xl text-[#001524]">SEO Analysis</h2>
              </div>

              {/* Overall Score with Badge System */}
              <div className={`rounded-xl p-6 mb-6 text-center ${
                seoAnalysis.overallScore >= 90 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                  : seoAnalysis.overallScore >= 80 
                  ? 'bg-gradient-to-br from-green-500 to-green-700'
                  : seoAnalysis.overallScore >= 70
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-700'
                  : 'bg-gradient-to-br from-red-500 to-red-700'
              } text-white`}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-4xl">
                    {seoAnalysis.overallScore >= 90 ? '🏆' : seoAnalysis.overallScore >= 80 ? '✅' : seoAnalysis.overallScore >= 70 ? '⚠️' : '❌'}
                  </span>
                  <div className="text-6xl">{seoAnalysis.overallScore}</div>
                  <span className="text-2xl opacity-90">/100</span>
                </div>
                <div className="text-lg opacity-90">
                  {seoAnalysis.overallScore >= 90 ? '🏆 Excellent' : seoAnalysis.overallScore >= 80 ? '✅ Great' : seoAnalysis.overallScore >= 70 ? '⚠️ Good' : '❌ Needs Improvement'}
                </div>
                {attemptHistory.length > 0 && (
                  <div className="mt-3 text-sm opacity-75">
                    Generated in {attemptHistory.length} iteration{attemptHistory.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-[#ffecd1] rounded-lg border border-[#ff7d00]">
                  <div className="text-2xl text-[#001524] mb-2">{seoAnalysis.titleScore}</div>
                  <div className="text-sm text-[#15616d]">Title</div>
                  <div className="mt-1">
                    {'⭐'.repeat(Math.ceil(seoAnalysis.titleScore / 20))}
                  </div>
                </div>

                <div className="text-center p-4 bg-[#ffecd1] rounded-lg border border-[#ff7d00]">
                  <div className="text-2xl text-[#001524] mb-2">{seoAnalysis.contentScore}</div>
                  <div className="text-sm text-[#15616d]">Content</div>
                  <div className="mt-1">
                    {'⭐'.repeat(Math.ceil(seoAnalysis.contentScore / 20))}
                  </div>
                </div>

                <div className="text-center p-4 bg-[#ffecd1] rounded-lg border border-[#ff7d00]">
                  <div className="text-2xl text-[#001524] mb-2">{seoAnalysis.keywordScore}</div>
                  <div className="text-sm text-[#15616d]">Keywords</div>
                  <div className="mt-1">
                    {'⭐'.repeat(Math.ceil(seoAnalysis.keywordScore / 20))}
                  </div>
                </div>

                <div className="text-center p-4 bg-[#ffecd1] rounded-lg border border-[#ff7d00]">
                  <div className="text-2xl text-[#001524] mb-2">{seoAnalysis.metaScore}</div>
                  <div className="text-sm text-[#15616d]">Meta</div>
                  <div className="mt-1">
                    {'⭐'.repeat(Math.ceil(seoAnalysis.metaScore / 20))}
                  </div>
                </div>

                <div className="text-center p-4 bg-[#ffecd1] rounded-lg border border-[#ff7d00]">
                  <div className="text-2xl text-[#001524] mb-2">{seoAnalysis.readabilityScore}</div>
                  <div className="text-sm text-[#15616d]">Readability</div>
                  <div className="mt-1">
                    {'⭐'.repeat(Math.ceil(seoAnalysis.readabilityScore / 20))}
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}

        {/* Extracted SEO Elements Section */}
        {extractedElements && (
          <div className="max-w-4xl mx-auto mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white border-2 border-[#15616d] rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🔍</span>
                <h2 className="text-2xl text-[#001524]">Extracted SEO Elements</h2>
              </div>

              {/* Blog Elements */}
              {extractedElements.title && extractedElements.headings && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-[#15616d] mb-2">Title</h3>
                    <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                      <p className="text-[#001524]">{extractedElements.title}</p>
                    </div>
                  </div>

                  {extractedElements.headings.h1.length > 0 && extractedElements.headings.h1[0] !== 'No H1 headings found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">H1 Headings</h3>
                      <div className="space-y-2">
                        {extractedElements.headings.h1.map((h, idx) => (
                          <div key={idx} className="bg-[#ffecd1] p-3 rounded-lg border border-[#ff7d00]">
                            <p className="text-[#001524]">{h}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.headings.h2.length > 0 && extractedElements.headings.h2[0] !== 'No H2 headings found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">H2 Headings</h3>
                      <div className="space-y-2">
                        {extractedElements.headings.h2.map((h, idx) => (
                          <div key={idx} className="bg-[#ffecd1] p-3 rounded-lg border border-[#ff7d00]">
                            <p className="text-[#001524]">{h}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.headings.h3.length > 0 && extractedElements.headings.h3[0] !== 'No H3 headings found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">H3 Headings</h3>
                      <div className="space-y-2">
                        {extractedElements.headings.h3.map((h, idx) => (
                          <div key={idx} className="bg-[#ffecd1] p-3 rounded-lg border border-[#ff7d00]">
                            <p className="text-[#001524]">{h}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.metaDescription && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Meta Description</h3>
                      <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                        <p className="text-[#001524]">{extractedElements.metaDescription}</p>
                      </div>
                    </div>
                  )}

                  {extractedElements.keywords && extractedElements.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#ff7d00] text-white rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* eCommerce Elements */}
              {extractedElements.productTitle && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-[#15616d] mb-2">Product Title</h3>
                    <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                      <p className="text-[#001524]">{extractedElements.productTitle}</p>
                    </div>
                  </div>

                  {extractedElements.bulletPoints && extractedElements.bulletPoints[0] !== 'No bullet points found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Bullet Points</h3>
                      <div className="space-y-2">
                        {extractedElements.bulletPoints.map((bullet, idx) => (
                          <div key={idx} className="bg-[#ffecd1] p-3 rounded-lg border border-[#ff7d00] flex items-start gap-2">
                            <span className="text-[#ff7d00] mt-1">•</span>
                            <p className="text-[#001524] flex-1">{bullet}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.keywords && extractedElements.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#ff7d00] text-white rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.categoryTags && extractedElements.categoryTags.length > 0 && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Category Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.categoryTags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#15616d] text-white rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.metaTags && extractedElements.metaTags.length > 0 && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Meta Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.metaTags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#78290f] text-white rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Landing Page Elements */}
              {extractedElements.mainHeadline && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-[#15616d] mb-2">Main Headline</h3>
                    <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                      <p className="text-[#001524]">{extractedElements.mainHeadline}</p>
                    </div>
                  </div>

                  {extractedElements.subheadings && extractedElements.subheadings[0] !== 'No subheadings found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Subheadings</h3>
                      <div className="space-y-2">
                        {extractedElements.subheadings.map((sub, idx) => (
                          <div key={idx} className="bg-[#ffecd1] p-3 rounded-lg border border-[#ff7d00]">
                            <p className="text-[#001524]">{sub}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.ctaText && extractedElements.ctaText[0] !== 'No CTA found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Call-to-Action (CTA)</h3>
                      <div className="space-y-2">
                        {extractedElements.ctaText.map((cta, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white p-4 rounded-lg">
                            <p>{cta}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.metaTitle && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Meta Title</h3>
                      <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                        <p className="text-[#001524]">{extractedElements.metaTitle}</p>
                      </div>
                    </div>
                  )}

                  {extractedElements.metaDescription && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Meta Description</h3>
                      <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                        <p className="text-[#001524]">{extractedElements.metaDescription}</p>
                      </div>
                    </div>
                  )}

                  {extractedElements.keywords && extractedElements.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#ff7d00] text-white rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Social Media Elements */}
              {extractedElements.mainCaption && (
                <div className="space-y-6">
                  {extractedElements.engagementHook && extractedElements.engagementHook !== 'No hook found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Engagement Hook</h3>
                      <div className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white p-4 rounded-lg">
                        <p>{extractedElements.engagementHook}</p>
                      </div>
                    </div>
                  )}

                  {extractedElements.hashtags && extractedElements.hashtags[0] !== 'No hashtags found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Hashtags</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.hashtags.map((hashtag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#15616d] text-white rounded-full text-sm">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.emojis && extractedElements.emojis.length > 0 && extractedElements.emojis[0] !== 'No emojis used' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Emojis Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.emojis.map((emoji, idx) => (
                          <span key={idx} className="text-3xl">
                            {emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {typeof extractedElements.characterCount !== 'undefined' && typeof extractedElements.platformLimit !== 'undefined' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Character Count</h3>
                      <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#001524]">
                            {extractedElements.characterCount} / {extractedElements.platformLimit}
                          </span>
                          <span className={extractedElements.characterCount <= extractedElements.platformLimit ? 'text-green-600' : 'text-red-600'}>
                            {extractedElements.characterCount <= extractedElements.platformLimit ? '✅ Within limit' : '⚠️ Exceeds limit'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Email/Ad Elements */}
              {extractedElements.subjectLine && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-[#15616d] mb-2">Subject Line</h3>
                    <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                      <p className="text-[#001524]">{extractedElements.subjectLine}</p>
                    </div>
                  </div>

                  {extractedElements.mainCopy && extractedElements.mainCopy !== 'No copy found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Main Copy</h3>
                      <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                        <p className="text-[#001524] whitespace-pre-wrap">{extractedElements.mainCopy}</p>
                      </div>
                    </div>
                  )}

                  {extractedElements.cta && extractedElements.cta !== 'No CTA found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Call-to-Action (CTA)</h3>
                      <div className="bg-gradient-to-r from-[#ff7d00] to-[#78290f] text-white p-4 rounded-lg">
                        <p>{extractedElements.cta}</p>
                      </div>
                    </div>
                  )}

                  {extractedElements.keywords && extractedElements.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#ff7d00] text-white rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {typeof extractedElements.characterCount !== 'undefined' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Character Count</h3>
                      <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                        <p className="text-[#001524]">{extractedElements.characterCount} characters</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* YouTube Elements */}
              {extractedElements.videoTitle && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-[#15616d] mb-2">Video Title</h3>
                    <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                      <p className="text-[#001524]">{extractedElements.videoTitle}</p>
                    </div>
                  </div>

                  {extractedElements.description && extractedElements.description !== 'No description found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Description</h3>
                      <div className="bg-[#ffecd1] p-4 rounded-lg border border-[#ff7d00]">
                        <p className="text-[#001524] whitespace-pre-wrap">{extractedElements.description}</p>
                      </div>
                    </div>
                  )}

                  {extractedElements.hashtags && extractedElements.hashtags[0] !== 'No hashtags found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Hashtags</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.hashtags.map((hashtag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#15616d] text-white rounded-full text-sm">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.timestamps && extractedElements.timestamps[0] !== 'No timestamps found' && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Timestamps</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.timestamps.map((timestamp, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#78290f] text-white rounded-full text-sm">
                            {timestamp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedElements.keywords && extractedElements.keywords.length > 0 && (
                    <div>
                      <h3 className="text-lg text-[#15616d] mb-2">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedElements.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#ff7d00] text-white rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Generated Content Section */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white border-2 border-[#15616d] rounded-2xl p-6 sm:p-8 shadow-xl ${!generatedContent ? 'min-h-[400px]' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <h2 className="text-2xl text-[#001524]">Generated Content</h2>
              </div>
              {generatedContent && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-[#15616d] rounded-lg hover:bg-[#ffecd1] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {generatedContent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-[#001524] font-sans text-center">
                    {generatedContent}
                  </pre>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center py-32">
                <div className="text-center text-[#15616d]">
                  <div className="text-6xl mb-4">✨</div>
                  <p>Your generated content will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Limit Modal */}
      <UsageLimitModal 
        isOpen={showUsageLimitModal}
        onClose={() => setShowUsageLimitModal(false)}
        onSignUp={() => {
          setShowUsageLimitModal(false);
          if (onSignUpClick) {
            onSignUpClick();
          }
        }}
      />
    </div>
  );
};
