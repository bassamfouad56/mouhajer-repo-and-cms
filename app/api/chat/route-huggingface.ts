import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

/**
 * Chat API with Hugging Face Inference API
 * 100% FREE - No API key needed!
 *
 * Uses: meta-llama/Llama-3.2-3B-Instruct (fast, capable, free)
 */

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
 * Chat with Hugging Face (FREE, no API key needed)
 */
async function chatWithHuggingFace(message: string): Promise<string> {
  const prompt = `${SYSTEM_PROMPT}

User: ${message}
Assistant:`;

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
          },
        }),
        signal: AbortSignal.timeout(15000), // 15s timeout
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[HuggingFace] Error:', error);

      // Model might be loading (cold start)
      if (error.includes('loading')) {
        throw new Error('Model is loading, please retry in 20 seconds');
      }

      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract generated text
    let generatedText = '';
    if (Array.isArray(data)) {
      generatedText = data[0]?.generated_text || '';
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    }

    // Clean up response
    generatedText = generatedText
      .replace(/^Assistant:\s*/i, '')
      .replace(/^User:\s*/i, '')
      .trim();

    return generatedText || 'I apologize, I encountered an error. Please try again.';
  } catch (error: any) {
    console.error('[HuggingFace] Failed:', error.message);
    throw error;
  }
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

    let response: string;
    let source: string;

    // Try Hugging Face
    try {
      console.log('[Chat] Trying Hugging Face...');
      response = await chatWithHuggingFace(message);
      source = 'huggingface';
      console.log('[Chat] Hugging Face succeeded');
    } catch (hfError: any) {
      console.log('[Chat] Hugging Face failed:', hfError.message);

      // Model loading? Tell user to retry
      if (hfError.message.includes('loading')) {
        return NextResponse.json({
          conversationId,
          useFallback: true,
          error: 'AI is warming up, please try again in 20 seconds',
        });
      }

      // Other error - use frontend fallback
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
  return NextResponse.json({
    status: 'healthy',
    provider: 'Hugging Face Inference API',
    model: 'meta-llama/Llama-3.2-3B-Instruct',
    cost: 'FREE',
    timestamp: new Date().toISOString(),
  });
}
