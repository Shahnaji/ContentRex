# Master Prompt Update - AEO Ultra

## 🎯 Update Summary

**Date:** November 14, 2025
**Version:** AEO Ultra Master Prompt

The master prompt has been completely restructured with a more organized, SEO-focused approach based on your improvements.

---

## 🔄 What Changed

### Before: Generic Content Engine
- Basic content generation instructions
- Less structured approach
- SEO rules scattered throughout
- No clear step-by-step process

### After: AEO Ultra System
- **Branded as "AEO Ultra"** - Advanced SEO-aware system
- **6-Factor SEO Standard** - Clear quality benchmarks
- **Step-by-step structure** - Systematic approach
- **Iterative improvement logic** - Built-in iteration guidance
- **DataForSEO integration** - Now accepts SEO insights

---

## ✨ Key Improvements

### 1. Clear Branding & Identity
```
You are "AEO Ultra", an advanced SEO-aware content generation system.
```
- Professional branding
- Clear role definition
- Sets expectations for quality

### 2. 6-Factor SEO Standard
Every piece of content must meet these 6 factors:

1. **Title Quality** - Captivating + keyword-optimized
2. **Content Quality** - Strong structure, benefit-driven
3. **Keyword Usage** - Natural placement, first 100 words
4. **Meta SEO** - Meta title & description
5. **Readability** - Grade 5-8, short sentences
6. **Keyword Density** - 0.8-2% (no stuffing!)

This gives GPT a **clear quality checklist** to follow.

### 3. Step-by-Step Structure

**BEFORE:**
```
Generate content...
Follow these rules...
(rules scattered everywhere)
```

**AFTER:**
```
STEP 1 — UNDERSTAND INPUT
STEP 2 — APPLY THE "SEO 6-FACTOR STANDARD"
STEP 3 — APPLY CONTENT TYPE RULES
STEP 4 — APPLY COPYWRITING FRAMEWORK IF GIVEN
STEP 5 — GENERATE THE FINAL CONTENT
```

Clear, sequential process that GPT can follow systematically.

### 4. Iterative Improvement System

**NEW SECTION:**
```
If the system is running iteration 2 or iteration 3, DO THIS:

**DO NOT regenerate from scratch.**  
**Preserve everything that works.**

You will be told which SEO factors scored lowest.  
Based on those factors:

1. Identify the exact parts needing improvement  
2. Rewrite ONLY those sections  
3. Do NOT change sections that already scored high  
4. Ensure keyword density remains healthy  
5. Improve clarity, structure, and SEO placement  

Goal: Small, precise improvements — NOT full rewrite.
```

This solves the problem of iterations getting worse!

### 5. DataForSEO Integration

**Added parameter:**
```typescript
export interface MasterPromptConfig {
  content_input: string;
  content_type: string;
  audience: string;
  tone: string;
  framework: string;
  country: string;
  word_count: number;
  seoInsights?: string;  // ✨ NEW!
}
```

Now the master prompt can include DataForSEO keyword insights when available.

### 6. Better Content-Type Rules

**BEFORE:**
- Long paragraphs explaining each content type
- Hard to scan
- Mixed in with other rules

**AFTER:**
```
📝 BLOG POST / ARTICLE / LISTICLE:
   - Include Meta Title + Meta Description
   - Add clear headings (H2/H3)
   ...

🛍️ PRODUCT DESCRIPTION:
   - Optimized product title
   - 5 compelling bullet points
   ...

📱 AD COPY:
   - Scroll-stopping hook
   - Platform-specific rules
   ...
```

- Emojis for visual scanning
- Concise bullet points
- Grouped by category

### 7. Explicit Output Rules

**NEW SECTION:**
```
• Output ONLY the content—not analysis  
• Follow platform formatting exactly
• Respect word count (${word_count} words ±10%)
• NEVER produce generic "AI-sounding" filler  
• Think like a top-tier human copywriter + SEO expert  
• NO explanations, NO meta-commentary
• Deliver clean, formatted, ready-to-publish content
```

Clear directive to avoid GPT's tendency to explain what it's doing.

---

## 📊 Expected Impact

### Problem: Iterations Getting Worse
**Before:**
- GPT regenerated from scratch each iteration
- Lost good elements from previous version
- Scores: 85 → 80 → 78 ❌

**After:**
- Explicit instruction to preserve what works
- Only fix low-scoring factors
- Expected scores: 85 → 88 → 92 ✅

### Problem: Keyword Stuffing
**Before:**
- No clear density guidelines
- "Use keywords naturally" (vague)

**After:**
- Explicit density range: 0.8-2%
- Part of 6-Factor Standard
- "Avoid keyword stuffing" directive

### Problem: Generic AI Content
**Before:**
- No specific anti-generic instructions

**After:**
- "NEVER produce generic 'AI-sounding' filler"
- "Think like a top-tier human copywriter"
- "Zero fluff, zero generic filler"

---

## 🔧 Technical Changes

### Files Modified

1. **`/supabase/functions/server/master-prompt.tsx`**
   - Complete rewrite with new structure
   - Added `seoInsights` parameter
   - Improved organization and clarity

2. **`/supabase/functions/server/prompt-builder.tsx`**
   - Added `seoInsights` to PromptConfig interface
   - Updated destructuring to include seoInsights
   - Passed seoInsights to getMasterPrompt()

3. **`/supabase/functions/server/index.tsx`**
   - Added seoInsights to promptConfig object
   - Now passes DataForSEO insights to master prompt

---

## 📋 Master Prompt Structure

```
┌─────────────────────────────────────────┐
│         IDENTITY & ROLE                 │
│  "You are AEO Ultra..."                 │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         7 QUALITY STANDARDS             │
│  1. Highest SEO quality                 │
│  2. Perfect readability                 │
│  3. Perfect keyword placement           │
│  ... (7 total)                          │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         5-STEP STRUCTURE                │
│  STEP 1: Understand Input               │
│  STEP 2: Apply 6-Factor SEO Standard    │
│  STEP 3: Apply Content Type Rules       │
│  STEP 4: Apply Framework                │
│  STEP 5: Generate Content               │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    ITERATIVE IMPROVEMENT LOGIC          │
│  - Preserve what works                  │
│  - Fix only low-scoring factors         │
│  - Small, precise improvements          │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    CONTENT-TYPE SPECIFIC RULES          │
│  📝 Blog / Article                      │
│  🛍️ Product Description                │
│  📄 Landing Page                        │
│  📱 Ad Copy                             │
│  💬 Social Media                        │
│  ... (11 categories)                    │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         FRAMEWORK LOGIC                 │
│  AIDA, PAS, BAB, 4Ps, FAB              │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    AUDIENCE & TONE ADAPTATION           │
│  Gen Z, Millennials, Gen X, etc.       │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         OUTPUT RULES                    │
│  - Only content, no analysis            │
│  - No AI-sounding filler                │
│  - Clean, ready-to-publish              │
└─────────────────────────────────────────┘
```

---

## 🎯 6-Factor SEO Standard in Detail

### Factor 1: Title Quality
- Includes main keyword
- Captivating and engaging
- Platform-optimized length

### Factor 2: Content Quality
- Strong, clear structure
- Factual and benefit-driven
- Correct format for content type
- Digestible paragraphs

### Factor 3: Keyword Usage
- Main keyword in first 100 words
- Naturally placed throughout
- Secondary keywords when relevant
- No forced insertion

### Factor 4: Meta SEO
- Meta title (~60 chars)
- Meta description (150-160 chars)
- Keyword inclusion
- Compelling copy

### Factor 5: Readability
- Target grade level: 5-8
- Short, clear sentences
- Scannable formatting
- Logical flow

### Factor 6: Keyword Density
- **Target: 0.8-2%** (depending on content type)
- **Critical: Avoid keyword stuffing**
- Natural distribution
- Context-appropriate usage

---

## ✅ Benefits

### For Content Quality
1. **Consistency** - 6-factor standard ensures every piece meets quality bar
2. **SEO Optimization** - Built-in SEO best practices
3. **Natural Writing** - Anti-generic directives
4. **Platform Fit** - Specific rules for each content type

### For Iterations
1. **Progressive Improvement** - Explicit preservation of good elements
2. **Targeted Fixes** - Only improve low-scoring factors
3. **Avoid Regression** - Don't change what's already working
4. **Keyword Balance** - Maintain healthy density

### For Development
1. **Modular** - Clear sections, easy to update
2. **Scalable** - Easy to add new content types
3. **Debuggable** - Step-by-step structure helps identify issues
4. **Documented** - Self-explanatory with clear comments

---

## 🧪 Testing Recommendations

Try the same input that was problematic:

**Input:**
```
"I created bracelet that can wearable on left or right hand glows at night and gives you lucky charm vibe"
Type: facebook-ad
Word Count: 60
```

**Expected Improvements:**

**Iteration 1:**
- Follows 6-Factor Standard
- Natural keyword placement
- Keyword density ~2%
- Score: 88-90

**Iteration 2:**
- Preserves good elements from iteration 1
- Fixes low-scoring factors only
- Improves keyword placement
- Score: 90-92 (+2 to +4)

**Iteration 3:**
- Small, surgical improvements
- Maintains keyword density
- Optimizes lowest 3 factors
- Score: 92-95 (+2 to +3)

**Best Iteration:** 3 ✅

---

## 📝 Version History

**V1 - Original Master Prompt**
- Generic content generation
- Basic SEO rules
- No iteration guidance

**V2 - AEO Ultra (Current)**
- 6-Factor SEO Standard
- Step-by-step structure
- Iterative improvement logic
- DataForSEO integration
- Better organization

---

## 🚀 Status

**Version:** AEO Ultra Master Prompt
**Date:** November 14, 2025
**Status:** ✅ Complete and Integrated

**All Changes Applied:**
- ✅ Master prompt rewritten
- ✅ seoInsights parameter added
- ✅ prompt-builder.tsx updated
- ✅ index.tsx updated
- ✅ DataForSEO insights integration

**Ready for testing!** 🎉
