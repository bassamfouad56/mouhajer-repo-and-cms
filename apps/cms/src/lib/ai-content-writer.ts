/**
 * AI Content Writer - Free AI-powered content generation using Groq
 * Generates SEO-optimized content for pages
 */

import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface ContentGenerationOptions {
  topic: string;
  contentType: 'blog' | 'service' | 'about' | 'product' | 'landing' | 'faq';
  tone: 'professional' | 'casual' | 'creative' | 'persuasive';
  wordCount?: number;
  keywords?: string[];
  language: 'en' | 'ar';
  includeOutline?: boolean;
  includeFAQ?: boolean;
  includeMetaDescription?: boolean;
}

export interface GeneratedContent {
  title: string;
  content: string;
  outline?: string[];
  metaDescription?: string;
  metaTitle?: string;
  keywords?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  readabilityScore?: number;
  seoScore?: number;
}

/**
 * Generate high-quality content using Groq's free Llama model
 */
export async function generateContent(
  options: ContentGenerationOptions
): Promise<GeneratedContent> {
  const {
    topic,
    contentType,
    tone,
    wordCount = 800,
    keywords = [],
    language,
    includeOutline = true,
    includeFAQ = true,
    includeMetaDescription = true,
  } = options;

  // Build the prompt based on content type
  const contentPrompts = {
    blog: `Write an engaging blog post about "${topic}". Make it informative and valuable to readers.`,
    service: `Create a compelling service page for "${topic}". Focus on benefits, features, and why customers should choose this service.`,
    about: `Write an engaging "About Us" section for a company specializing in "${topic}". Include mission, values, and unique selling points.`,
    product: `Create a detailed product description for "${topic}". Include features, benefits, specifications, and use cases.`,
    landing: `Create a high-converting landing page content for "${topic}". Include hero section, benefits, social proof, and call-to-action.`,
    faq: `Generate comprehensive FAQ content about "${topic}". Cover common questions and provide detailed answers.`,
  };

  const toneInstructions = {
    professional: 'Use a professional, authoritative tone suitable for business audiences.',
    casual: 'Use a friendly, conversational tone that connects with readers.',
    creative: 'Use creative language, metaphors, and engaging storytelling.',
    persuasive: 'Use persuasive language that motivates action and highlights benefits.',
  };

  const systemPrompt = `You are an expert content writer and SEO specialist. Create high-quality, SEO-optimized content that ranks well in search engines and engages readers. ${language === 'ar' ? 'Write in Arabic.' : 'Write in English.'}`;

  const userPrompt = `
${contentPrompts[contentType]}

Requirements:
- Tone: ${toneInstructions[tone]}
- Target word count: ${wordCount} words
- Language: ${language === 'ar' ? 'Arabic' : 'English'}
${keywords.length > 0 ? `- Include these keywords naturally: ${keywords.join(', ')}` : ''}
${includeOutline ? '- Start with a content outline' : ''}
${includeMetaDescription ? '- Include a 155-character meta description' : ''}
${includeFAQ ? '- Add 5 relevant FAQs at the end' : ''}

Structure:
1. Compelling title (H1)
2. Introduction that hooks the reader
3. Well-structured body with subheadings (H2, H3)
4. Clear paragraphs with transition sentences
5. Strong conclusion with call-to-action
${includeFAQ ? '6. FAQ section' : ''}

SEO Guidelines:
- Use keywords naturally (2-3% density)
- Include semantic keywords
- Write scannable content with bullet points
- Use active voice
- Include internal linking opportunities
- Optimize for featured snippets

Please generate the content now.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: tone === 'creative' ? 0.8 : 0.7,
      max_tokens: 4000,
    });

    const generatedText = completion.choices[0]?.message?.content || '';

    // Parse the generated content
    const result = parseGeneratedContent(generatedText);

    // Calculate SEO and readability scores
    result.readabilityScore = calculateReadabilityScore(result.content);
    result.seoScore = calculateSEOScore(result.content, keywords);

    return result;
  } catch (error) {
    console.error('Content generation error:', error);
    throw new Error('Failed to generate content');
  }
}

/**
 * Generate content outline for a topic
 */
export async function generateOutline(
  topic: string,
  contentType: string
): Promise<string[]> {
  const prompt = `Create a detailed content outline for a ${contentType} about "${topic}".
  Include 5-7 main sections with 2-3 subsections each.
  Format as a simple list.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a content strategist.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content || '';
    return text.split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('Outline generation error:', error);
    return [];
  }
}

/**
 * Improve existing content with AI
 */
export async function improveContent(
  content: string,
  improvements: {
    addKeywords?: string[];
    changeTone?: string;
    expandLength?: boolean;
    addFAQ?: boolean;
    fixGrammar?: boolean;
  }
): Promise<string> {
  const instructions = [];

  if (improvements.addKeywords?.length) {
    instructions.push(`Add these keywords naturally: ${improvements.addKeywords.join(', ')}`);
  }
  if (improvements.changeTone) {
    instructions.push(`Change the tone to ${improvements.changeTone}`);
  }
  if (improvements.expandLength) {
    instructions.push('Expand the content with more details and examples');
  }
  if (improvements.addFAQ) {
    instructions.push('Add a FAQ section with 5 questions and answers');
  }
  if (improvements.fixGrammar) {
    instructions.push('Fix any grammar and spelling errors');
  }

  const prompt = `Improve the following content based on these instructions:
${instructions.join('\n')}

Original content:
${content}

Please provide the improved version.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a professional content editor.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.6,
      max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Content improvement error:', error);
    return content;
  }
}

/**
 * Generate SEO meta tags for content
 */
export async function generateSEOTags(
  content: string,
  topic: string
): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
  };
}> {
  const prompt = `Based on this content about "${topic}", generate SEO tags:

Content preview: ${content.substring(0, 500)}...

Generate:
1. Meta title (50-60 characters)
2. Meta description (150-160 characters)
3. 5-8 relevant keywords
4. Open Graph title
5. Open Graph description

Format as JSON.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an SEO expert. Generate optimized meta tags.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(response);
  } catch (error) {
    console.error('SEO tag generation error:', error);
    return {
      metaTitle: topic.substring(0, 60),
      metaDescription: content.substring(0, 160),
      keywords: topic.split(' ').filter(w => w.length > 3),
      openGraph: {
        title: topic,
        description: content.substring(0, 200),
      },
    };
  }
}

// Helper Functions

function parseGeneratedContent(text: string): GeneratedContent {
  // Extract title (first H1 or first line)
  const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/^(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  // Extract FAQs if present
  const faqs: Array<{ question: string; answer: string }> = [];
  const faqSection = text.match(/FAQ|Frequently Asked Questions([\s\S]*?)$/i);
  if (faqSection) {
    const faqText = faqSection[0];
    const qaMatches = faqText.matchAll(/Q:?\s*(.+?)\nA:?\s*(.+?)(?=\nQ:|$)/gi);
    for (const match of qaMatches) {
      faqs.push({ question: match[1].trim(), answer: match[2].trim() });
    }
  }

  // Extract meta description if present
  const metaMatch = text.match(/Meta Description:?\s*(.{50,200})/i);
  const metaDescription = metaMatch ? metaMatch[1].trim() : text.substring(0, 155);

  // Clean content (remove meta info)
  let content = text
    .replace(/Meta Description:?.*/i, '')
    .replace(/Meta Title:?.*/i, '')
    .replace(/Keywords:?.*/i, '')
    .trim();

  return {
    title,
    content,
    metaDescription,
    metaTitle: title.substring(0, 60),
    faqs: faqs.length > 0 ? faqs : undefined,
  };
}

function calculateReadabilityScore(text: string): number {
  // Simple Flesch Reading Ease approximation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => {
    // Simple syllable counting (not perfect but good enough)
    return count + Math.max(1, word.replace(/[^aeiouAEIOU]/g, '').length);
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease formula
  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Normalize to 0-100
  return Math.max(0, Math.min(100, score));
}

function calculateSEOScore(content: string, keywords: string[]): number {
  let score = 50; // Base score

  // Check content length
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 600) score += 10;
  if (wordCount >= 1000) score += 10;

  // Check keyword presence
  if (keywords.length > 0) {
    const contentLower = content.toLowerCase();
    const keywordMatches = keywords.filter(kw =>
      contentLower.includes(kw.toLowerCase())
    ).length;
    score += (keywordMatches / keywords.length) * 20;
  }

  // Check for headings
  if (content.includes('##')) score += 10;

  // Check for lists
  if (content.includes('- ') || content.includes('* ')) score += 5;

  // Check for questions (good for featured snippets)
  if (content.match(/\?/g)?.length || 0 > 2) score += 5;

  return Math.min(100, Math.round(score));
}

export default {
  generateContent,
  generateOutline,
  improveContent,
  generateSEOTags,
};