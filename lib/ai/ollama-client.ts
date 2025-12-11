/**
 * Ollama Client for Local Windows PC
 * Connects to Ollama running on localhost (models stored on X:ollama-models)
 *
 * Setup: Run 'setx OLLAMA_MODELS "X:ollama-models"' then 'ollama serve'
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || 'D:\wbsite\mouhajer-new-marketing-website\public\ai-generated';

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  images?: string[];
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  userEmail: string;
  uploadedImageBase64?: string;
  serviceCategory?: string;
  model?: 'llava' | 'bakllava' | 'llama3.2:3b';
}

export interface ImageGenerationResult {
  success: boolean;
  imagePath?: string;
  description?: string;
  error?: string;
  generationTime?: number;
  modelUsed?: string;
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error('Ollama health check failed:', error);
    return false;
  }
}

export async function listOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) throw new Error('Failed to fetch models');
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch (error) {
    console.error('Failed to list Ollama models:', error);
    return [];
  }
}

export async function generateWithOllama(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, stream: false }),
  });
  if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);
  return await response.json();
}

export async function analyzeImageWithOllama(imageBase64: string, prompt: string, model: 'llava' | 'bakllava' = 'llava'): Promise<string> {
  const response = await generateWithOllama({ model, prompt, images: [imageBase64] });
  return response.response;
}

export const ollamaConfig = {
  baseUrl: OLLAMA_BASE_URL,
  model: OLLAMA_MODEL,
  localStoragePath: LOCAL_STORAGE_PATH,
  defaultVisionModel: 'llava',
  defaultTextModel: 'llama3.2:3b',
  timeout: 60000,
};

// Service categories for MIDC
export const SERVICE_CATEGORIES = [
  'interior',
  'architecture',
  'construction',
  'renovation',
  'hospitality',
  'residential',
  'commercial',
  'landscape',
  'mep',
  'design',
] as const;

export interface ValidationResult {
  isValid: boolean;
  category: string;
  suggestion?: string;
}

/**
 * Validates if a prompt is related to MIDC services
 */
export async function validateServicePrompt(prompt: string): Promise<ValidationResult> {
  const promptLower = prompt.toLowerCase();

  // Check for service-related keywords
  const designKeywords = ['design', 'interior', 'decor', 'furniture', 'space', 'room', 'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'hotel', 'restaurant', 'villa', 'apartment', 'home', 'house'];
  const architectureKeywords = ['architecture', 'building', 'structure', 'facade', 'floor plan', 'elevation', 'layout'];
  const constructionKeywords = ['construction', 'build', 'renovation', 'remodel', 'fit-out', 'finishing', 'MEP', 'plumbing', 'electrical'];

  const hasDesignKeyword = designKeywords.some(kw => promptLower.includes(kw));
  const hasArchitectureKeyword = architectureKeywords.some(kw => promptLower.includes(kw));
  const hasConstructionKeyword = constructionKeywords.some(kw => promptLower.includes(kw));

  if (hasDesignKeyword || hasArchitectureKeyword || hasConstructionKeyword) {
    let category = 'interior';
    if (hasArchitectureKeyword) category = 'architecture';
    if (hasConstructionKeyword) category = 'construction';

    return {
      isValid: true,
      category,
    };
  }

  return {
    isValid: false,
    category: 'interior',
    suggestion: 'Please describe a design, architecture, or construction project. For example: "Modern luxury villa interior with marble flooring" or "Contemporary office space with natural lighting"',
  };
}

/**
 * Enhances a user prompt for MIDC-style image generation
 */
export async function enhancePromptForMIDC(prompt: string, category: string = 'interior'): Promise<string> {
  try {
    // Try to use Ollama to enhance the prompt
    const enhanceRequest: OllamaGenerateRequest = {
      model: OLLAMA_MODEL,
      prompt: `You are a luxury design expert for MIDC (Mouhajer International Design & Contracting).
Enhance this design prompt to create a stunning, photorealistic visualization:

Original prompt: "${prompt}"
Category: ${category}

Add specific details about:
- Materials (marble, brass, natural wood, premium fabrics)
- Lighting (ambient, accent, natural light)
- Style elements (clean lines, geometric patterns, Arabic-inspired details)
- Quality descriptors (luxury, premium, sophisticated, elegant)

Return ONLY the enhanced prompt, nothing else. Keep it under 200 words.`,
      stream: false,
    };

    const response = await generateWithOllama(enhanceRequest);
    return response.response.trim();
  } catch (error) {
    // Fallback enhancement if Ollama is unavailable
    console.error('Ollama enhancement failed, using fallback:', error);

    const stylePrefix = category === 'architecture'
      ? 'Modern architectural visualization, contemporary design, clean lines, '
      : category === 'construction'
      ? 'High-end construction project, premium materials, professional finish, '
      : 'Luxury interior design, premium materials, sophisticated lighting, ';

    const styleSuffix = ', photorealistic 3D render, 8K quality, architectural visualization, studio lighting, elegant atmosphere';

    return `${stylePrefix}${prompt}${styleSuffix}`;
  }
}
