# Input Types & Keyword Extraction Guide

## 🎯 Overview

The system now intelligently handles **3 types of inputs** and extracts appropriate SEO keywords for each:

---

## 1️⃣ Regular Keywords

### When Detected
- Short input (≤50 characters)
- Few words (≤7 words)
- Examples: "SEO tools", "project management software", "best running shoes"

### Processing
```typescript
Input: "SEO tools"
Detection: keyword (short, few words)
Keyword Extraction: NONE (use as-is)
SEO Keywords: "SEO tools"
```

### SEO Analysis
- Searches content for: **"SEO tools"** (exact phrase)
- Multi-word keywords also match individual words
- Expected Density: 1.8-2.5%

### Example Flow
```
User Input: "SEO tools"
     ↓
Type: keyword
     ↓
SEO Keywords: "SEO tools" (no extraction needed)
     ↓
Content Generated: "Discover the best SEO tools for 2024. These SEO tools help..."
     ↓
Keyword Matches: 2 occurrences of "SEO tools"
     ↓
Density: 2.1% ✅
```

---

## 2️⃣ Custom Prompts

### When Detected
- Long input (>50 characters)
- Many words (>7 words)
- Examples: "I create a ring with rare stones that give you calm and trendy both at same time"

### Processing
```typescript
Input: "I create a ring with rare stones that give you calm and trendy both at same time"
Detection: prompt (long text, >7 words)
Keyword Extraction: YES (GPT extracts main concepts)
Extracted Keywords: "rare stones, ring, calm"
SEO Keywords: "rare stones, ring, calm"
```

### SEO Analysis
- Searches content for: **"rare stones"**, **"ring"**, **"calm"** (separately)
- Counts all matches for ALL keywords
- Expected Density: 1.8-2.5% (combined)

### Example Flow
```
User Input: "I create a ring with rare stones that give you calm and trendy both at same time"
     ↓
Type: prompt (>50 chars, >7 words)
     ↓
Extracting keywords from custom prompt...
     ↓
GPT Analysis: Identifies core concepts
     ↓
SEO Keywords: "rare stones, ring, calm" ✅
     ↓
Content Generated: "Discover our handcrafted ring featuring rare stones! 
                    Each rare stone brings calm and style. This unique ring..."
     ↓
Keyword Matches: 
  - "rare stones": 2 times
  - "ring": 2 times
  - "calm": 1 time
  - Total: 5 matches
     ↓
Density: 2.1% ✅
```

---

## 3️⃣ URL Inputs

### When Detected
- Starts with `http://` or `https://`
- Examples: "https://example.com/blog/seo-tips"

### Processing
```typescript
Input: "https://www.example.com/blog/digital-marketing-strategies"
Detection: url (starts with http)
Step 1: Extract content from URL using GPT
Step 2: Extract keywords from URL content
SEO Keywords: "digital marketing, content strategy, SEO"
```

### SEO Analysis
- Searches content for: **keywords extracted from the webpage** (NOT the URL!)
- Counts matches for all extracted keywords
- Expected Density: 1.8-2.5%

### Example Flow
```
User Input: "https://www.example.com/blog/digital-marketing-strategies-2024"
     ↓
Type: url (starts with https://)
     ↓
Fetching URL content...
     ↓
GPT Extracts: "This article covers digital marketing strategies, 
               including content marketing, SEO optimization, 
               and social media tactics for 2024..."
     ↓
Extracting keywords from URL content...
     ↓
GPT Analysis: Identifies main topics
     ↓
SEO Keywords: "digital marketing, content strategy, SEO" ✅
     ↓
Content Generated: "Master digital marketing with proven content strategy 
                    techniques. Our SEO-focused approach to digital marketing..."
     ↓
Keyword Matches:
  - "digital marketing": 2 times
  - "content strategy": 1 time
  - "SEO": 2 times
  - Total: 5 matches
     ↓
Density: 2.3% ✅
```

---

## 🔄 Comparison Table

| Feature | Regular Keyword | Custom Prompt | URL Input |
|---------|----------------|---------------|-----------|
| **Detection** | Short, ≤7 words | Long, >7 words | Starts with http |
| **Extraction** | ❌ None (use as-is) | ✅ GPT extracts concepts | ✅ GPT extracts from page |
| **Example Input** | "SEO tools" | "I create handmade jewelry..." | "https://example.com/blog" |
| **SEO Keywords** | "SEO tools" | "jewelry, handmade, unique" | "blog topic, keywords..." |
| **Old Behavior** | ✅ Worked | ❌ 0% density (searched for full prompt) | ❌ 0% density (searched for URL) |
| **New Behavior** | ✅ No change | ✅ Extracts keywords, 2%+ density | ✅ Extracts from content, 2%+ density |

---

## 📊 Expected Results

### All Input Types Should Show:

1. **✅ Keyword Density > 0%**
   - Regular Keywords: 1.8-2.5%
   - Custom Prompts: 1.8-2.5% (combined keywords)
   - URLs: 1.8-2.5% (combined keywords)

2. **✅ Score Improvements**
   - Iteration 1: 80-85
   - Iteration 2: 84-88 (+3 to +5)
   - Iteration 3: 88-92 (+3 to +5)

3. **✅ Best Iteration is 2 or 3**
   - Not always iteration 1
   - Shows actual improvement

4. **✅ Individual Scores Improve**
   - Title Score: increases each iteration
   - Keyword Score: increases each iteration
   - Content Score: stays high or improves

---

## 🚨 Red Flags (Issues to Watch)

### ❌ Keyword Density = 0%
**Problem:** Keywords not appearing in content
**Check:** What keywords are being used? Are they correct?
**Fix:** Verify keyword extraction is working

### ❌ Scores Don't Improve (or Get Worse)
**Problem:** Iteration 2 or 3 has lower score than iteration 1
**Check:** Are SEO suggestions being followed?
**Fix:** Review improvement prompts

### ❌ Best Iteration Always #1
**Problem:** Iterations 2 and 3 aren't improving content
**Check:** Are correct keywords being used for analysis?
**Fix:** Verify seoKeywords parameter is passed correctly

### ❌ URL String in Content
**Problem:** Content includes the actual URL
**Check:** Is keyword extraction happening for URLs?
**Fix:** Ensure extractKeywordsFromPrompt runs for URLs

---

## 🧪 Testing Commands

### Test Custom Prompt
```
Input: "I create a ring with rare stones that give you calm and trendy both at same time"
Type: instagram-caption
Country: Worldwide
Word Count: 80

Expected Logs:
✓ Detected input type: Custom Prompt
✓ Extracting keywords from custom prompt...
✓ Extracted keywords: "rare stones, ring, calm"
✓ SEO Keywords extracted from prompt: "rare stones, ring, calm"
✓ Iteration 1: Density=2.1%
✓ Iteration 2: Density=2.3%, Score improved
✓ Best iteration: 2 or 3
```

### Test URL Input
```
Input: "https://www.searchenginejournal.com/seo-guide/"
Type: blog-post
Country: United States
Word Count: 500

Expected Logs:
✓ Detected input type: URL
✓ Fetching content from URL: https://...
✓ Successfully extracted content from URL
✓ Extracting keywords from custom prompt... (extracts from URL content)
✓ Extracted keywords: "SEO, optimization, search engines"
✓ SEO Keywords extracted from URL content: "SEO, optimization, search engines"
✓ Iteration 1: Density=2.2%
✓ Iteration 2: Density=2.4%, Score improved
✓ Best iteration: 2 or 3
```

### Test Regular Keyword
```
Input: "project management software"
Type: landing-page-copy
Country: Worldwide
Word Count: 300

Expected Logs:
✓ Detected input type: Keyword
✓ Using keyword as-is: "project management software"
✓ Iteration 1: Density=2.0%
✓ Iteration 2: Density=2.2%, Score improved
✓ Best iteration: 2 or 3
```

---

## ✅ Success Criteria

All three input types should:
- ✅ Have keyword density >0% (ideally 1.8-2.5%)
- ✅ Show score improvements across iterations
- ✅ Select iteration 2 or 3 as best (not always 1)
- ✅ Display meaningful, actionable suggestions
- ✅ Generate natural, high-quality content

---

## 🔧 Troubleshooting

| Issue | Input Type | Likely Cause | Solution |
|-------|-----------|--------------|----------|
| 0% Density | Custom Prompt | Keyword extraction failed | Check GPT API, verify extractKeywordsFromPrompt |
| 0% Density | URL | URL content empty OR extraction failed | Check URL fetch, verify extractKeywordsFromPrompt |
| No improvement | All | Wrong keywords used for SEO | Verify seoKeywords parameter passed to all functions |
| Best is #1 | All | Iterations not improving | Check buildContentGenerationPrompt receives seoKeywords |
| URL in content | URL | Using URL as keyword | Ensure keyword extraction happens for URLs |
