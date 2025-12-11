import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { client as sanityClient } from '@/sanity/lib/client';

/**
 * Chat API Route - AI-Powered Chatbot with Ollama
 *
 * Features:
 * - Uses Mac Mini Ollama for intelligent responses
 * - Retry logic with exponential backoff
 * - Falls back to keyword-based responses if Ollama fails
 * - Logs all conversations to Sanity CMS
 */

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
 * Check Ollama health with timeout
 */
async function checkOllamaHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok;
  } catch (error) {
    console.log('[Ollama] Health check failed:', error);
    return false;
  }
}

/**
 * Chat with Ollama with retry logic
 */
async function chatWithOllama(
  messages: Array<{ role: string; content: string }>,
  maxRetries = 2
): Promise<string> {
  const fullMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
        // Exponential backoff: 1s, 2s
        const delay = 1000 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Load conversation from Sanity (DISABLED - Dataset issue)
 */
async function loadConversation(conversationId: string) {
  // Temporarily disabled - return empty for now
  return null;
}

/**
 * Save message to Sanity conversation (DISABLED - Dataset issue)
 */
async function saveMessage(
  conversationId: string,
  message: {
    role: 'user' | 'assistant';
    content: string;
    source?: string;
    latency?: number;
  }
) {
  // Temporarily disabled due to Sanity dataset configuration
  // Will re-enable once dataset is properly set up
  return;
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

    // Generate or use existing conversation ID
    const conversationId = existingId || nanoid();

    // Load conversation history (last 4 messages for context)
    const conversation = await loadConversation(conversationId);
    const previousMessages = conversation?.messages?.slice(-4) || [];

    // Save user message (async, don't block)
    saveMessage(conversationId, {
      role: 'user',
      content: message,
    }).catch(console.error);

    let response: string;
    let source: string;

    // Try Ollama with retry
    try {
      const isHealthy = await checkOllamaHealth();

      if (isHealthy) {
        const messages = [
          ...previousMessages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: message },
        ];

        response = await chatWithOllama(messages);
        source = 'ollama';
      } else {
        throw new Error('Ollama health check failed');
      }
    } catch (error) {
      console.log('[Chat] Ollama failed, using fallback');
      // Fallback response (will be generated by frontend's keyword matching)
      return NextResponse.json({
        conversationId,
        useFallback: true,
        error: 'AI temporarily unavailable',
      });
    }

    // Calculate latency
    const latency = Date.now() - startTime;

    // Save assistant message (async, don't block)
    saveMessage(conversationId, {
      role: 'assistant',
      content: response,
      source,
      latency,
    }).catch(console.error);

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
  const isHealthy = await checkOllamaHealth();

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'degraded',
    ollama: {
      url: OLLAMA_BASE_URL,
      model: OLLAMA_MODEL,
      available: isHealthy,
    },
    timestamp: new Date().toISOString(),
  });
}
