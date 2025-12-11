import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Chat API with Local Ollama on Windows + Knowledge Base
 * 100% FREE - Uses local LLM with models on X: drive
 * Now enhanced with indexed content from the website
 *
 * Uses: llama3.2:3b via localhost:11434 (models stored on X:\ollama-models)
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://100.100.215.40:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), 'lib', 'ai', 'knowledge-base.json');

// Load knowledge base
interface KnowledgeItem {
  id: string;
  type: string;
  title: string;
  content: string;
  keywords: string[];
  metadata?: Record<string, any>;
}

interface KnowledgeBase {
  items: KnowledgeItem[];
  companyInfo: Record<string, any>;
}

let knowledgeBase: KnowledgeBase | null = null;

function loadKnowledgeBase(): KnowledgeBase | null {
  try {
    if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
      console.log('[Chat] Knowledge base not found, using static prompt only');
      return null;
    }
    const data = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[Chat] Failed to load knowledge base:', error);
    return null;
  }
}

/**
 * Search knowledge base for relevant content
 */
function searchKnowledgeBase(query: string, maxResults: number = 5): KnowledgeItem[] {
  if (!knowledgeBase) {
    knowledgeBase = loadKnowledgeBase();
  }
  if (!knowledgeBase?.items) return [];

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  // Score each item based on keyword matches
  const scored = knowledgeBase.items.map(item => {
    let score = 0;

    // Check title match
    if (item.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Check content match
    if (item.content.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Check keyword matches
    for (const word of queryWords) {
      if (item.keywords.some(kw => kw.includes(word))) {
        score += 3;
      }
      if (item.title.toLowerCase().includes(word)) {
        score += 2;
      }
      if (item.content.toLowerCase().includes(word)) {
        score += 1;
      }
    }

    // Boost certain types for common queries
    if (queryLower.includes('project') && item.type === 'project') score += 3;
    if (queryLower.includes('service') && item.type === 'service') score += 3;
    if ((queryLower.includes('faq') || queryLower.includes('question')) && item.type === 'faq') score += 3;
    if (queryLower.includes('award') && item.type === 'company') score += 3;

    return { item, score };
  });

  // Sort by score and return top results
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.item);
}

/**
 * Build context from knowledge base results
 */
function buildContextFromKnowledge(items: KnowledgeItem[]): string {
  if (items.length === 0) return '';

  const context = items.map(item => {
    let text = `[${item.type.toUpperCase()}] ${item.title}`;
    if (item.content) {
      text += `\n${item.content}`;
    }
    if (item.metadata?.slug) {
      text += `\n(View more at: /${item.type}s/${item.metadata.slug})`;
    }
    return text;
  }).join('\n\n');

  return `\n\n=== RELEVANT CONTEXT FROM OUR WEBSITE ===\n${context}\n=== END CONTEXT ===`;
}

const SYSTEM_PROMPT = `You are the AI assistant for Mouhajer International Design & Contracting (MIDC), a luxury design and construction company in Dubai, UAE.

=== CRITICAL RULES - READ CAREFULLY ===

1. ONLY use information provided in this prompt - NEVER make up or fabricate details
2. If you don't know something, say "I don't have that specific information, but our team can help you with that"
3. Do NOT invent names, dates, statistics, or any facts not listed below
4. Always direct complex questions to the team via WhatsApp or email

=== STRICT SCOPE BOUNDARIES ===

You MUST ONLY discuss:
- MIDC services (design, construction, fit-out, joinery, FF&E, project management)
- MIDC projects and portfolio
- Company information (founder, awards, certifications)
- Contact information and consultations
- General interior design and construction topics RELATED to potential projects

You MUST NEVER:
- Generate reports, analysis, or documents of any kind
- Discuss topics unrelated to design, construction, or interior work
- Provide advice on marketing, SEO, website performance, IT, finance, legal, etc.
- Write essays, articles, or long-form content
- Pretend to have capabilities you don't have
- Discuss competitors or other companies in detail

=== OFF-TOPIC RESPONSE ===

If someone asks about something outside your scope, respond with:
"I'm here to help with design and construction inquiries! I can tell you about our services, projects, or help you schedule a consultation. What would you like to know about MIDC?"

=== RESPONSE LENGTH ===

Keep ALL responses to 2-4 sentences maximum. Never write long responses, reports, or lists unless specifically listing our services or awards.

=== COMPANY INFORMATION ===

FOUNDER & CEO: Eng. Maher Mouhajer
- Full name: Engineer Maher Mouhajer (NOT "Ali" or any other name)
- Role: Founder & CEO
- Experience: Over 20 years in luxury design and construction
- Based in: Dubai & Abu Dhabi, UAE

COMPANY: Mouhajer International Design & Contracting (MIDC)
- Full name: Mouhajer International Design & Contracting
- Short name: MIDC or Mouhajer Design
- Founded: Over 20 years ago
- Headquarters: Dubai, UAE
- Branch: Abu Dhabi, UAE
- Website: mouhajerdesign.com

=== OUR SERVICES (6 Core Pillars) ===

1. DESIGN & ENGINEERING
   - Architecture & Planning
   - Interior Design (Residential, Commercial, Hospitality)
   - MEP Engineering
   - 3D Visualization & Renders

2. CIVIL CONSTRUCTION
   - Villa construction from ground up
   - Commercial buildings
   - Structural work
   - Foundation to finish

3. FIT-OUT & EXECUTION
   - Complete interior fit-out
   - Luxury finishing
   - Turnkey delivery
   - Quality control

4. MANUFACTURING & JOINERY
   - Custom furniture manufacturing
   - Bespoke joinery
   - In-house production facility
   - Premium materials

5. FF&E SPECIFICATION
   - Furniture, Fixtures & Equipment
   - Material selection
   - Vendor coordination
   - Procurement management

6. PROJECT MANAGEMENT
   - End-to-end project delivery
   - Timeline management
   - Budget control
   - Quality assurance

=== AWARDS & CERTIFICATIONS ===

INTERNATIONAL PROPERTY AWARDS (5-Star Winner):
- Best Hotel Suite Interior Arabia 2023-2024 (Address Boulevard VIP Suite)
- Best Hotel Suite Interior Dubai 2023-2024 (Address Boulevard VIP Suite)
- Best Residential Interior Apartment Dubai 2023-2024 (Address Boulevard Penthouse)
- Best Hotel Interior Abu Dhabi 2022-2023 (Sheraton Abu Dhabi Hotel & Resort)

LUXURY LIFESTYLE AWARDS:
- Certificate of Recognition 2021 (Best Luxury Interior Design)

ISO CERTIFICATIONS:
- ISO 9001:2015 (Quality Management)
- ISO 14001:2015 (Environmental Management)
- ISO 45001:2018 (Occupational Health & Safety)

=== KEY PARTNERS & PROJECTS ===

Hotel Partners:
- Address Hotels & Resorts (Dubai)
- Sheraton Hotels (Abu Dhabi)
- Grand Hyatt Hotels (Dubai)
- Abu Dhabi National Hotels

Project Types:
- Luxury Villas & Palaces
- 5-Star Hotel Interiors
- High-End Apartments & Penthouses
- Commercial Offices
- Restaurant & Hospitality

Statistics:
- 150+ completed projects
- 20+ years experience
- Triple ISO certified
- 0 safety incidents

=== CONTACT INFORMATION ===

Phone: +971 52 304 1482
Email: info@mouhajerdesign.com
WhatsApp: +971 52 304 1482
Location: Dubai & Abu Dhabi, UAE

=== CONVERSATION GUIDELINES ===

1. Be concise (2-3 sentences max per response)
2. Ask clarifying questions to understand their project needs
3. NEVER quote specific prices - say "pricing depends on project scope, let's discuss"
4. Offer to connect them with the team via WhatsApp, email, or phone
5. Be helpful and consultative, not pushy
6. Focus on understanding their vision first
7. If asked about the founder/CEO, ALWAYS say "Eng. Maher Mouhajer"
8. Maintain a luxury, professional tone

=== RESPONSE EXAMPLES ===

Q: "Who is your founder?"
A: "Our founder and CEO is Eng. Maher Mouhajer, who has over 20 years of experience in luxury design and construction. Would you like to know more about our services?"

Q: "What awards have you won?"
A: "We're proud to be multiple-time 5-Star Winners at the International Property Awards, including Best Hotel Suite Interior for Address Boulevard VIP Suite. We're also triple ISO certified."

Q: "How much does a villa renovation cost?"
A: "Pricing depends on the scope and specifications of your project. I'd recommend scheduling a consultation with our team to discuss your vision and get a personalized estimate. Would you like to connect via WhatsApp?"

Remember: You represent a luxury brand. Be professional, warm, and helpful. NEVER fabricate information.`;

/**
 * Chat with Local Ollama (Windows) + Knowledge Base Enhancement
 */
async function chatWithOllama(message: string, conversationHistory?: { role: string; content: string }[]): Promise<string> {
  // Search knowledge base for relevant context
  const relevantItems = searchKnowledgeBase(message, 5);
  const knowledgeContext = buildContextFromKnowledge(relevantItems);

  // Build enhanced system prompt with knowledge base context
  let enhancedPrompt = SYSTEM_PROMPT;
  if (knowledgeContext) {
    enhancedPrompt += knowledgeContext;
    enhancedPrompt += `\n\nUse the RELEVANT CONTEXT above to provide accurate, specific answers when applicable. Reference specific projects, services, or FAQs when they match the user's question.`;
  }

  const messages = [
    { role: 'system', content: enhancedPrompt },
  ];

  // Add conversation history if available (last 5 messages for context)
  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory.slice(-5));
  }

  // Add current message
  messages.push({ role: 'user', content: message });

  // Log knowledge base usage for debugging
  if (relevantItems.length > 0) {
    console.log(`[Chat] Found ${relevantItems.length} relevant knowledge items:`, relevantItems.map(i => i.title));
  }

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: {
        temperature: 0.5, // Lower temperature for more factual responses
        top_p: 0.85,
        num_ctx: 4096, // Larger context window
      },
    }),
    signal: AbortSignal.timeout(30000), // 30s timeout
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || 'I apologize, I encountered an error. Please try again.';
}

/**
 * POST /api/chat - Main chat endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { message, conversationId: existingId, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const conversationId = existingId || nanoid();

    let response: string;
    let source: string;

    // Try Local Ollama (Windows PC)
    try {
      console.log('[Chat] Trying Local Ollama (Windows)...');
      response = await chatWithOllama(message, history);
      source = 'ollama';
      console.log('[Chat] Ollama succeeded');
    } catch (ollamaError: any) {
      console.log('[Chat] Ollama failed:', ollamaError.message);

      // Use frontend fallback
      return NextResponse.json({
        conversationId,
        useFallback: true,
        error: 'AI temporarily unavailable',
      });
    }

    const latency = Date.now() - startTime;

    return NextResponse.json({
      conversationId,
      response,
      source,
      latency,
    });
  } catch (error: any) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        useFallback: true,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat - Health check
 */
export async function GET() {
  // Quick Ollama check
  let ollamaAvailable = false;
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    ollamaAvailable = response.ok;
  } catch {}

  return NextResponse.json({
    status: ollamaAvailable ? 'healthy' : 'degraded',
    provider: 'Local Ollama (Windows + X: drive)',
    model: OLLAMA_MODEL,
    url: OLLAMA_BASE_URL,
    available: ollamaAvailable,
    cost: 'FREE',
    timestamp: new Date().toISOString(),
  });
}
