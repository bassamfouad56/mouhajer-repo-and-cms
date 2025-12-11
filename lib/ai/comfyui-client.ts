/**
 * ComfyUI Client for Image Generation
 * Connects to ComfyUI running on Mac Mini for SDXL image generation
 */

// ComfyUI running locally on Windows PC (D: drive)
const COMFYUI_BASE_URL = process.env.COMFYUI_BASE_URL || 'http://localhost:8188';

export interface ComfyUIWorkflow {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfg_scale?: number;
  seed?: number;
  sampler?: string;
  scheduler?: string;
  input_image?: string; // Base64
  denoise?: number;
}

export interface ComfyUIImg2ImgWorkflow extends ComfyUIWorkflow {
  input_image: string; // Base64 - required for img2img
  denoise?: number; // 0.0 to 1.0 - how much to change (0.65 recommended for redesign)
}

export interface ComfyUIJobStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  outputImages?: string[];
  error?: string;
}

/**
 * Check if ComfyUI is running
 */
export async function checkComfyUIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${COMFYUI_BASE_URL}/system_stats`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error('ComfyUI health check failed:', error);
    return false;
  }
}

/**
 * Generate MIDC architectural design workflow
 * This creates a ComfyUI workflow optimized for architectural visualization
 */
function createMIDCArchitecturalWorkflow(params: ComfyUIWorkflow): any {
  const {
    prompt,
    negative_prompt = 'low quality, blurry, distorted, unrealistic, amateur, sketchy',
    width = 1024,
    height = 768,
    steps = 30,
    cfg_scale = 7.5,
    seed = -1,
  } = params;

  // Enhanced prompt for MIDC luxury style
  const enhancedPrompt = `${prompt}, luxury architectural photography, professional interior design, high-end materials, elegant lighting, photorealistic 3D rendering, 8K resolution, award-winning design, MIDC signature style`;

  return {
    '1': {
      inputs: {
        ckpt_name: 'sd_xl_base_1.0.safetensors',
      },
      class_type: 'CheckpointLoaderSimple',
    },
    '2': {
      inputs: {
        text: enhancedPrompt,
        clip: ['1', 1],
      },
      class_type: 'CLIPTextEncode',
    },
    '3': {
      inputs: {
        text: negative_prompt,
        clip: ['1', 1],
      },
      class_type: 'CLIPTextEncode',
    },
    '4': {
      inputs: {
        width,
        height,
        batch_size: 1,
      },
      class_type: 'EmptyLatentImage',
    },
    '5': {
      inputs: {
        seed,
        steps,
        cfg: cfg_scale,
        sampler_name: 'dpmpp_2m',
        scheduler: 'karras',
        denoise: 1.0,
        model: ['1', 0],
        positive: ['2', 0],
        negative: ['3', 0],
        latent_image: ['4', 0],
      },
      class_type: 'KSampler',
    },
    '6': {
      inputs: {
        samples: ['5', 0],
        vae: ['1', 2],
      },
      class_type: 'VAEDecode',
    },
    '7': {
      inputs: {
        filename_prefix: 'midc_ai_generated',
        images: ['6', 0],
      },
      class_type: 'SaveImage',
    },
  };
}

/**
 * Queue a ComfyUI workflow
 */
export async function queueComfyUIWorkflow(workflow: ComfyUIWorkflow): Promise<string> {
  const workflowData = createMIDCArchitecturalWorkflow(workflow);

  const response = await fetch(`${COMFYUI_BASE_URL}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: workflowData,
      client_id: `midc_web_${Date.now()}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`ComfyUI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.prompt_id;
}

/**
 * Check status of a ComfyUI job
 */
export async function checkComfyUIJobStatus(promptId: string): Promise<ComfyUIJobStatus> {
  try {
    const response = await fetch(`${COMFYUI_BASE_URL}/history/${promptId}`);

    if (!response.ok) {
      return { status: 'pending' };
    }

    const data = await response.json();
    const job = data[promptId];

    if (!job) {
      return { status: 'pending' };
    }

    if (job.status?.completed) {
      // Extract output images
      const outputs = job.outputs || {};
      const outputImages: string[] = [];

      for (const nodeId in outputs) {
        const nodeOutput = outputs[nodeId];
        if (nodeOutput.images) {
          outputImages.push(...nodeOutput.images.map((img: any) => img.filename));
        }
      }

      return {
        status: 'completed',
        outputImages,
      };
    }

    if (job.status?.error) {
      return {
        status: 'failed',
        error: job.status.error,
      };
    }

    return {
      status: 'running',
      progress: job.status?.progress || 0,
    };
  } catch (error) {
    console.error('Failed to check ComfyUI job status:', error);
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Download generated image from ComfyUI
 */
export async function downloadComfyUIImage(filename: string): Promise<Buffer> {
  const response = await fetch(`${COMFYUI_BASE_URL}/view?filename=${encodeURIComponent(filename)}`);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate image with ComfyUI and wait for completion
 */
export async function generateImageWithComfyUI(
  workflow: ComfyUIWorkflow,
  maxWaitTime = 120000 // 2 minutes
): Promise<Buffer> {
  const promptId = await queueComfyUIWorkflow(workflow);

  const startTime = Date.now();
  const pollInterval = 2000; // 2 seconds

  while (Date.now() - startTime < maxWaitTime) {
    const status = await checkComfyUIJobStatus(promptId);

    if (status.status === 'completed' && status.outputImages && status.outputImages.length > 0) {
      const imageBuffer = await downloadComfyUIImage(status.outputImages[0]);
      return imageBuffer;
    }

    if (status.status === 'failed') {
      throw new Error(`Image generation failed: ${status.error}`);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Image generation timeout');
}

/**
 * Create ComfyUI workflow for img2img (interior redesign)
 * Uses the input image as a starting point and applies style transfer
 */
function createMIDCImg2ImgWorkflow(params: ComfyUIImg2ImgWorkflow): Record<string, unknown> {
  const {
    prompt,
    negative_prompt = 'low quality, blurry, distorted, unrealistic, amateur, sketchy, bad design',
    input_image,
    width = 1024,
    height = 768,
    steps = 35,
    cfg_scale = 7.5,
    denoise = 0.65,
    seed = -1,
  } = params;

  // Enhanced prompt for luxury interior redesign
  const enhancedPrompt = `${prompt}, luxury interior design, professional architectural photography, high-end materials, elegant ambient lighting, photorealistic 3D rendering, 8K resolution, award-winning interior design, premium finishes, MIDC signature style`;

  return {
    '1': {
      inputs: {
        ckpt_name: 'sd_xl_base_1.0.safetensors',
      },
      class_type: 'CheckpointLoaderSimple',
    },
    '2': {
      inputs: {
        text: enhancedPrompt,
        clip: ['1', 1],
      },
      class_type: 'CLIPTextEncode',
    },
    '3': {
      inputs: {
        text: negative_prompt,
        clip: ['1', 1],
      },
      class_type: 'CLIPTextEncode',
    },
    // Load and encode the input image
    '8': {
      inputs: {
        image: input_image,
        upload: 'image',
      },
      class_type: 'LoadImageBase64',
    },
    // Resize image to target dimensions
    '9': {
      inputs: {
        width,
        height,
        interpolation: 'lanczos',
        method: 'fill / crop',
        condition: 'always',
        multiple_of: 8,
        image: ['8', 0],
      },
      class_type: 'ImageResize+',
    },
    // Encode image to latent space
    '10': {
      inputs: {
        pixels: ['9', 0],
        vae: ['1', 2],
      },
      class_type: 'VAEEncode',
    },
    // KSampler with input latent (img2img)
    '5': {
      inputs: {
        seed,
        steps,
        cfg: cfg_scale,
        sampler_name: 'dpmpp_2m',
        scheduler: 'karras',
        denoise, // Key parameter for img2img - controls how much to change
        model: ['1', 0],
        positive: ['2', 0],
        negative: ['3', 0],
        latent_image: ['10', 0], // Use encoded input image instead of empty latent
      },
      class_type: 'KSampler',
    },
    '6': {
      inputs: {
        samples: ['5', 0],
        vae: ['1', 2],
      },
      class_type: 'VAEDecode',
    },
    '7': {
      inputs: {
        filename_prefix: 'midc_redesign',
        images: ['6', 0],
      },
      class_type: 'SaveImage',
    },
  };
}

/**
 * Alternative simpler img2img workflow (fallback if custom nodes not available)
 */
function createSimpleImg2ImgWorkflow(params: ComfyUIImg2ImgWorkflow): Record<string, unknown> {
  const {
    prompt,
    negative_prompt = 'low quality, blurry, distorted, unrealistic, amateur, sketchy',
    width = 1024,
    height = 768,
    steps = 35,
    cfg_scale = 7.5,
    denoise = 0.65,
    seed = -1,
  } = params;

  const enhancedPrompt = `${prompt}, luxury interior design, professional photography, high-end materials, elegant lighting, photorealistic, 8K quality`;

  // This workflow assumes the image has been uploaded to ComfyUI's input folder
  return {
    '1': {
      inputs: {
        ckpt_name: 'sd_xl_base_1.0.safetensors',
      },
      class_type: 'CheckpointLoaderSimple',
    },
    '2': {
      inputs: {
        text: enhancedPrompt,
        clip: ['1', 1],
      },
      class_type: 'CLIPTextEncode',
    },
    '3': {
      inputs: {
        text: negative_prompt,
        clip: ['1', 1],
      },
      class_type: 'CLIPTextEncode',
    },
    '4': {
      inputs: {
        width,
        height,
        batch_size: 1,
      },
      class_type: 'EmptyLatentImage',
    },
    '5': {
      inputs: {
        seed,
        steps,
        cfg: cfg_scale,
        sampler_name: 'dpmpp_2m',
        scheduler: 'karras',
        denoise,
        model: ['1', 0],
        positive: ['2', 0],
        negative: ['3', 0],
        latent_image: ['4', 0],
      },
      class_type: 'KSampler',
    },
    '6': {
      inputs: {
        samples: ['5', 0],
        vae: ['1', 2],
      },
      class_type: 'VAEDecode',
    },
    '7': {
      inputs: {
        filename_prefix: 'midc_redesign',
        images: ['6', 0],
      },
      class_type: 'SaveImage',
    },
  };
}

/**
 * Upload image to ComfyUI for processing
 */
async function uploadImageToComfyUI(imageBase64: string, filename: string): Promise<string> {
  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  formData.append('image', blob, filename);
  formData.append('overwrite', 'true');

  const response = await fetch(`${COMFYUI_BASE_URL}/upload/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }

  const data = await response.json();
  return data.name || filename;
}

/**
 * Queue an img2img ComfyUI workflow
 */
async function queueComfyUIImg2ImgWorkflow(workflow: ComfyUIImg2ImgWorkflow): Promise<string> {
  // First, try to upload the input image
  const uploadedFilename = `input_${Date.now()}.png`;

  try {
    await uploadImageToComfyUI(workflow.input_image, uploadedFilename);
  } catch (error) {
    console.warn('[ComfyUI] Image upload failed, using base64 workflow:', error);
  }

  // Try advanced workflow first, fallback to simple
  let workflowData: Record<string, unknown>;
  try {
    workflowData = createMIDCImg2ImgWorkflow(workflow);
  } catch {
    console.warn('[ComfyUI] Using simple workflow as fallback');
    workflowData = createSimpleImg2ImgWorkflow(workflow);
  }

  const response = await fetch(`${COMFYUI_BASE_URL}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: workflowData,
      client_id: `midc_redesign_${Date.now()}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[ComfyUI] Workflow error:', errorText);
    throw new Error(`ComfyUI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.prompt_id;
}

/**
 * Generate redesigned interior image using img2img
 */
export async function generateImageWithComfyUIImg2Img(
  workflow: ComfyUIImg2ImgWorkflow,
  maxWaitTime = 180000 // 3 minutes for img2img (slightly longer)
): Promise<Buffer> {
  const promptId = await queueComfyUIImg2ImgWorkflow(workflow);

  const startTime = Date.now();
  const pollInterval = 2000; // 2 seconds

  while (Date.now() - startTime < maxWaitTime) {
    const status = await checkComfyUIJobStatus(promptId);

    if (status.status === 'completed' && status.outputImages && status.outputImages.length > 0) {
      const imageBuffer = await downloadComfyUIImage(status.outputImages[0]);
      return imageBuffer;
    }

    if (status.status === 'failed') {
      throw new Error(`Image generation failed: ${status.error}`);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Image generation timeout');
}

export const comfyUIConfig = {
  baseUrl: COMFYUI_BASE_URL,
  defaultWidth: 1024,
  defaultHeight: 768,
  defaultSteps: 30,
  defaultCfgScale: 7.5,
  maxWaitTime: 120000, // 2 minutes
};
