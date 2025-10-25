/**
 * Free SEO Analyzer - Real-time SEO analysis and scoring
 * No paid APIs required - uses algorithms and free tools
 */

export interface SEOAnalysis {
  score: number; // 0-100
  title: {
    score: number;
    length: number;
    optimal: boolean;
    suggestions: string[];
  };
  description: {
    score: number;
    length: number;
    optimal: boolean;
    suggestions: string[];
  };
  content: {
    score: number;
    wordCount: number;
    readability: number;
    keywordDensity: Map<string, number>;
    headings: {
      h1: number;
      h2: number;
      h3: number;
    };
    images: {
      count: number;
      withoutAlt: number;
    };
    links: {
      internal: number;
      external: number;
      broken: string[];
    };
    suggestions: string[];
  };
  keywords: {
    primary: string[];
    secondary: string[];
    density: Map<string, number>;
    suggestions: string[];
  };
  technical: {
    urlSlug: {
      score: number;
      length: number;
      suggestions: string[];
    };
    schema: {
      present: boolean;
      types: string[];
    };
  };
}

/**
 * Analyze SEO for page content
 */
export function analyzeSEO(params: {
  title: string;
  description: string;
  content: string;
  url: string;
  keywords?: string[];
  images?: Array<{ src: string; alt?: string }>;
  links?: Array<{ href: string; text: string }>;
}): SEOAnalysis {
  const { title, description, content, url, keywords = [], images = [], links = [] } = params;

  const analysis: SEOAnalysis = {
    score: 0,
    title: analyzeTitle(title, keywords),
    description: analyzeDescription(description, keywords),
    content: analyzeContent(content, keywords, images, links),
    keywords: analyzeKeywords(content, keywords),
    technical: analyzeTechnical(url, content),
  };

  // Calculate overall score
  analysis.score = calculateOverallScore(analysis);

  return analysis;
}

/**
 * Real-time SEO suggestions as user types
 */
export function getRealtimeSuggestions(
  field: 'title' | 'description' | 'content',
  value: string,
  keywords: string[] = []
): string[] {
  const suggestions: string[] = [];

  switch (field) {
    case 'title':
      if (value.length < 30) {
        suggestions.push('Title is too short. Aim for 30-60 characters.');
      }
      if (value.length > 60) {
        suggestions.push('Title is too long. Keep it under 60 characters.');
      }
      if (keywords.length > 0 && !keywords.some(kw => value.toLowerCase().includes(kw.toLowerCase()))) {
        suggestions.push('Include your primary keyword in the title.');
      }
      if (!value.match(/[0-9]/)) {
        suggestions.push('Consider adding numbers for better CTR (e.g., "5 Tips", "2024 Guide")');
      }
      break;

    case 'description':
      if (value.length < 120) {
        suggestions.push('Description is too short. Aim for 120-160 characters.');
      }
      if (value.length > 160) {
        suggestions.push('Description is too long. Keep it under 160 characters.');
      }
      if (!value.includes('?') && !value.match(/(how|what|why|when|where)/i)) {
        suggestions.push('Consider making it a question or adding action words.');
      }
      break;

    case 'content':
      const wordCount = value.split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount < 300) {
        suggestions.push('Content is too short. Aim for at least 300 words.');
      }
      if (!value.includes('## ') && !value.includes('### ')) {
        suggestions.push('Add subheadings (H2, H3) to structure your content.');
      }
      if (!value.includes('- ') && !value.includes('1. ')) {
        suggestions.push('Use bullet points or numbered lists for better readability.');
      }
      break;
  }

  return suggestions;
}

// Analysis Functions

function analyzeTitle(title: string, keywords: string[]) {
  const analysis = {
    score: 0,
    length: title.length,
    optimal: false,
    suggestions: [] as string[],
  };

  // Length scoring
  if (title.length >= 30 && title.length <= 60) {
    analysis.score += 40;
    analysis.optimal = true;
  } else if (title.length >= 20 && title.length <= 70) {
    analysis.score += 25;
  } else {
    analysis.score += 10;
    analysis.suggestions.push(
      title.length < 30
        ? 'Title too short. Add more descriptive words.'
        : 'Title too long. Keep it under 60 characters.'
    );
  }

  // Keyword presence
  if (keywords.length > 0) {
    const titleLower = title.toLowerCase();
    const hasKeyword = keywords.some(kw => titleLower.includes(kw.toLowerCase()));
    if (hasKeyword) {
      analysis.score += 30;
    } else {
      analysis.suggestions.push('Include your primary keyword in the title.');
    }
  }

  // Power words and numbers
  const powerWords = ['best', 'guide', 'how', 'tips', 'ultimate', 'complete', 'essential'];
  if (powerWords.some(word => title.toLowerCase().includes(word))) {
    analysis.score += 15;
  }

  if (/\d/.test(title)) {
    analysis.score += 15;
  }

  return analysis;
}

function analyzeDescription(description: string, keywords: string[]) {
  const analysis = {
    score: 0,
    length: description.length,
    optimal: false,
    suggestions: [] as string[],
  };

  // Length scoring
  if (description.length >= 120 && description.length <= 160) {
    analysis.score += 40;
    analysis.optimal = true;
  } else if (description.length >= 100 && description.length <= 170) {
    analysis.score += 25;
  } else {
    analysis.score += 10;
    analysis.suggestions.push(
      description.length < 120
        ? 'Description too short. Aim for 120-160 characters.'
        : 'Description too long. Keep it under 160 characters.'
    );
  }

  // Keyword presence
  if (keywords.length > 0) {
    const descLower = description.toLowerCase();
    const hasKeyword = keywords.some(kw => descLower.includes(kw.toLowerCase()));
    if (hasKeyword) {
      analysis.score += 30;
    } else {
      analysis.suggestions.push('Include keywords naturally in the description.');
    }
  }

  // Call to action
  const ctaWords = ['learn', 'discover', 'get', 'find', 'read', 'explore'];
  if (ctaWords.some(word => description.toLowerCase().includes(word))) {
    analysis.score += 30;
  } else {
    analysis.suggestions.push('Add a call-to-action word (Learn, Discover, Get, etc.)');
  }

  return analysis;
}

function analyzeContent(
  content: string,
  keywords: string[],
  images: Array<{ src: string; alt?: string }>,
  links: Array<{ href: string; text: string }>
) {
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const analysis = {
    score: 0,
    wordCount: words.length,
    readability: calculateReadability(content),
    keywordDensity: new Map<string, number>(),
    headings: {
      h1: (content.match(/^#\s+/gm) || []).length,
      h2: (content.match(/^##\s+/gm) || []).length,
      h3: (content.match(/^###\s+/gm) || []).length,
    },
    images: {
      count: images.length,
      withoutAlt: images.filter(img => !img.alt || img.alt.trim() === '').length,
    },
    links: {
      internal: links.filter(link => !link.href.startsWith('http')).length,
      external: links.filter(link => link.href.startsWith('http')).length,
      broken: [],
    },
    suggestions: [] as string[],
  };

  // Word count scoring
  if (words.length >= 1000) {
    analysis.score += 25;
  } else if (words.length >= 600) {
    analysis.score += 20;
  } else if (words.length >= 300) {
    analysis.score += 10;
  } else {
    analysis.suggestions.push('Content is too short. Aim for at least 600 words.');
  }

  // Headings scoring
  if (analysis.headings.h2 >= 3) {
    analysis.score += 15;
  } else {
    analysis.suggestions.push('Add more subheadings (H2) to structure content.');
  }

  // Images scoring
  if (images.length > 0) {
    analysis.score += 10;
    if (analysis.images.withoutAlt === 0) {
      analysis.score += 10;
    } else {
      analysis.suggestions.push(`Add alt text to ${analysis.images.withoutAlt} image(s).`);
    }
  } else {
    analysis.suggestions.push('Add images to make content more engaging.');
  }

  // Links scoring
  if (analysis.links.internal > 0) {
    analysis.score += 10;
  } else {
    analysis.suggestions.push('Add internal links to other pages.');
  }

  if (analysis.links.external > 0 && analysis.links.external < 5) {
    analysis.score += 5;
  }

  // Keyword density
  if (keywords.length > 0) {
    const contentLower = content.toLowerCase();
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
      const matches = contentLower.match(regex) || [];
      const density = (matches.length / words.length) * 100;
      analysis.keywordDensity.set(keyword, density);

      if (density >= 0.5 && density <= 2.5) {
        analysis.score += 10;
      } else if (density > 2.5) {
        analysis.suggestions.push(`Keyword "${keyword}" is overused (${density.toFixed(1)}%). Reduce usage.`);
      } else {
        analysis.suggestions.push(`Keyword "${keyword}" is underused (${density.toFixed(1)}%). Use it more naturally.`);
      }
    });
  }

  // Readability scoring
  if (analysis.readability >= 60) {
    analysis.score += 15;
  } else {
    analysis.suggestions.push('Improve readability by using shorter sentences and simpler words.');
  }

  return analysis;
}

function analyzeKeywords(content: string, targetKeywords: string[]) {
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordFrequency = new Map<string, number>();

  // Count word frequency
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    if (cleanWord) {
      wordFrequency.set(cleanWord, (wordFrequency.get(cleanWord) || 0) + 1);
    }
  });

  // Sort by frequency
  const sortedWords = Array.from(wordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  // Calculate density
  const density = new Map<string, number>();
  sortedWords.forEach(([word, count]) => {
    density.set(word, (count / words.length) * 100);
  });

  // Find semantic keywords
  const semanticKeywords = findSemanticKeywords(targetKeywords, sortedWords.map(([w]) => w));

  const suggestions: string[] = [];

  // Check if target keywords are in top keywords
  targetKeywords.forEach(keyword => {
    if (!sortedWords.some(([w]) => w.includes(keyword.toLowerCase()))) {
      suggestions.push(`Primary keyword "${keyword}" not found in top keywords.`);
    }
  });

  return {
    primary: targetKeywords,
    secondary: semanticKeywords,
    density,
    suggestions,
  };
}

function analyzeTechnical(url: string, content: string) {
  const urlSlug = url.split('/').pop() || '';

  const analysis = {
    urlSlug: {
      score: 0,
      length: urlSlug.length,
      suggestions: [] as string[],
    },
    schema: {
      present: false,
      types: [] as string[],
    },
  };

  // URL slug analysis
  if (urlSlug.length > 0 && urlSlug.length <= 50) {
    analysis.urlSlug.score += 50;
  } else if (urlSlug.length > 50) {
    analysis.urlSlug.suggestions.push('URL slug is too long. Keep it under 50 characters.');
  }

  if (!/^[a-z0-9-]+$/.test(urlSlug)) {
    analysis.urlSlug.suggestions.push('URL should only contain lowercase letters, numbers, and hyphens.');
    analysis.urlSlug.score -= 25;
  } else {
    analysis.urlSlug.score += 25;
  }

  if (urlSlug.includes('--')) {
    analysis.urlSlug.suggestions.push('Avoid double hyphens in URL.');
  }

  // Schema detection
  const schemaTypes = ['Article', 'Product', 'Service', 'Organization', 'FAQPage', 'HowTo'];
  schemaTypes.forEach(type => {
    if (content.includes(`"@type": "${type}"`)) {
      analysis.schema.present = true;
      analysis.schema.types.push(type);
    }
  });

  if (!analysis.schema.present) {
    analysis.urlSlug.suggestions.push('Add structured data (Schema.org) for better search visibility.');
  }

  return analysis;
}

function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => {
    // Simplified syllable counting
    return count + Math.max(1, word.replace(/[^aeiouAEIOU]/g, '').length);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease
  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  return Math.max(0, Math.min(100, score));
}

function calculateOverallScore(analysis: SEOAnalysis): number {
  const weights = {
    title: 0.2,
    description: 0.15,
    content: 0.35,
    keywords: 0.15,
    technical: 0.15,
  };

  const keywordScore = analysis.keywords.suggestions.length === 0 ? 80 : 40;

  const score =
    analysis.title.score * weights.title +
    analysis.description.score * weights.description +
    analysis.content.score * weights.content +
    keywordScore * weights.keywords +
    analysis.technical.urlSlug.score * weights.technical;

  return Math.round(Math.min(100, score));
}

function findSemanticKeywords(primary: string[], allWords: string[]): string[] {
  const semantic: string[] = [];
  const relatedTerms: { [key: string]: string[] } = {
    'design': ['interior', 'modern', 'style', 'decor', 'aesthetic'],
    'service': ['professional', 'quality', 'expert', 'solution', 'consultation'],
    'dubai': ['uae', 'emirates', 'luxury', 'premium'],
    'room': ['space', 'area', 'interior', 'home', 'house'],
  };

  primary.forEach(keyword => {
    const key = keyword.toLowerCase();
    if (relatedTerms[key]) {
      relatedTerms[key].forEach(term => {
        if (allWords.includes(term) && !semantic.includes(term)) {
          semantic.push(term);
        }
      });
    }
  });

  return semantic.slice(0, 5);
}

/**
 * Generate content improvement suggestions
 */
export function getContentImprovements(analysis: SEOAnalysis): {
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: string;
}[] {
  const improvements = [];

  // High priority
  if (analysis.score < 50) {
    improvements.push({
      priority: 'high' as const,
      suggestion: 'Overall SEO score is low. Focus on title, description, and content optimization.',
      impact: 'Could improve search rankings by 40-60%',
    });
  }

  if (analysis.content.wordCount < 300) {
    improvements.push({
      priority: 'high' as const,
      suggestion: 'Content is too thin. Add more valuable information.',
      impact: 'Longer content typically ranks 2x better',
    });
  }

  // Medium priority
  if (analysis.content.images.withoutAlt > 0) {
    improvements.push({
      priority: 'medium' as const,
      suggestion: 'Add descriptive alt text to all images.',
      impact: 'Improves accessibility and image search rankings',
    });
  }

  if (analysis.content.links.internal === 0) {
    improvements.push({
      priority: 'medium' as const,
      suggestion: 'Add internal links to related content.',
      impact: 'Helps search engines understand site structure',
    });
  }

  // Low priority
  if (!analysis.technical.schema.present) {
    improvements.push({
      priority: 'low' as const,
      suggestion: 'Implement structured data markup.',
      impact: 'Can enable rich snippets in search results',
    });
  }

  return improvements;
}

export default {
  analyzeSEO,
  getRealtimeSuggestions,
  getContentImprovements,
};