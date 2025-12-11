import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

/**
 * Enhanced Chat API with Groq + Mac Mini Ollama Fallback
 *
 * Architecture:
 * 1. Try Groq (fast, reliable, free)
 * 2. Fallback to Mac Mini Ollama
 * 3. Final fallback to keyword responses (handled by frontend)
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://100.111.21.66:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2-vision:latest';

// System prompt for MIDC customer service & sales
const SYSTEM_PROMPT = `You are the AI assistant for Mouhajer International Design & Contracting (MIDC), a luxury design and construction company in Dubai, UAE.

Your role:
- Answer questions about MIDC services professionally and warmly
- Qualify potential leads by understanding their project needs
- Guide users toward booking consultations
- Maintain a luxury, professional tone

MIDC Services:
• Architecture & Planning - Complete architectural design and planning services
• Interior Design - Luxury residential, commercial, and hospitality interiors
• FF&E Specification - Furniture, fixtures, and equipment curation
• Project Management - End-to-end construction management
• Custom Furniture - Bespoke furniture design and manufacturing

Key Information:
- Location: Dubai, UAE
- Phone: +971 52 304 1482
- Email: info@mouhajerdesign.com
- Portfolio: 150+ completed projects including Address Hotels partnerships
- Focus: Luxury residential, commercial, and hospitality projects

Conversation Guidelines:
1. Be concise (2-3 sentences max per response)
2. Ask clarifying questions to understand their project
3. Never quote specific prices - say "pricing depends on scope, let's discuss"
4. If interested, offer to connect them with the team via WhatsApp, email, or phone
5. Be helpful and consultative, not pushy
6. Focus on understanding their vision first

Remember: You represent a luxury brand. Be professional, warm, and helpful.`;

/**
 * Try Groq (Primary AI Provider)
 */
async function chatWithGroq(messages: Array<{ role: string; content: string }>): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: GROQ_API_KEY,
  });

  const { text } = await generateText({
    model: groq('llama-3.3-70b-versatile'), // Fast and powerful
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    temperature: 0.7,
    maxTokens: 500,
  });

  return text;
}

/**
 * Fallback: Mac Mini Ollama
 */
async function chatWithOllama(
  messages: Array<{ role: string; content: string }>,
  maxRetries = 1
): Promise<string> {
  const fullMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: fullMessages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message?.content || 'I apologize, I encountered an error. Please try again.';
    } catch (error: any) {
      console.log(`[Ollama] Attempt ${attempt + 1} failed:`, error.message);

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * POST /api/chat - Main chat endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { message, conversationId: existingId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const conversationId = existingId || nanoid();
    const userMessage = { role: 'user', content: message };

    let response: string;
    let source: string;

    // Try Groq first (primary provider)
    try {
      console.log('[Chat] Trying Groq...');
      response = await chatWithGroq([userMessage]);
      source = 'groq';
      console.log('[Chat] Groq succeeded');
    } catch (groqError: any) {
      console.log('[Chat] Groq failed:', groqError.message);

      // Fallback to Mac Mini Ollama
      try {
        console.log('[Chat] Trying Mac Mini Ollama...');
        response = await chatWithOllama([userMessage]);
        source = 'ollama';
        console.log('[Chat] Ollama succeeded');
      } catch (ollamaError) {
        console.log('[Chat] Ollama failed, using frontend fallback');

        // Tell frontend to use keyword fallback
        return NextResponse.json({
          conversationId,
          useFallback: true,
          error: 'AI temporarily unavailable',
        });
      }
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
  const groqAvailable = !!GROQ_API_KEY;

  // Quick Ollama check (no timeout)
  let ollamaAvailable = false;
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    ollamaAvailable = response.ok;
  } catch {}

  return NextResponse.json({
    status: groqAvailable ? 'healthy' : 'degraded',
    providers: {
      groq: {
        available: groqAvailable,
        model: 'llama-3.3-70b-versatile',
      },
      ollama: {
        url: OLLAMA_BASE_URL,
        model: OLLAMA_MODEL,
        available: ollamaAvailable,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
