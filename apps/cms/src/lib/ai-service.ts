/**
 * AI Service - Node.js wrapper for Flux.1 Schnell Python inference
 * Handles communication between Next.js and Python AI model
 */

import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';

const PYTHON_SCRIPT = path.join(process.cwd(), 'python', 'flux_inference.py');
const PYTHON_EXECUTABLE = process.env.PYTHON_PATH || 'python3';

export interface AIGenerationParams {
  inputImagePath: string;
  prompt?: string;
  style: string;
  roomType: string;
  outputId: string;
  inferenceSteps?: number;
}

export interface AIGenerationResult {
  success: boolean;
  outputPath?: string;
  processingTime?: number;
  inferenceSteps?: number;
  model?: string;
  imageSize?: {
    width: number;
    height: number;
  };
  error?: string;
}

/**
 * Generate room redesign using Flux.1 Schnell AI model
 * Communicates with Python script via child_process
 */
export async function generateRoomRedesign(
  params: AIGenerationParams
): Promise<AIGenerationResult> {
  const {
    inputImagePath,
    prompt = '',
    style,
    roomType,
    outputId,
    inferenceSteps = 4,
  } = params;

  // Validate Python script exists
  try {
    await fs.access(PYTHON_SCRIPT);
  } catch (error) {
    return {
      success: false,
      error: `Python script not found at ${PYTHON_SCRIPT}. Please ensure flux_inference.py is in the python directory.`,
    };
  }

  return new Promise((resolve, reject) => {
    const args = [
      PYTHON_SCRIPT,
      inputImagePath,
      prompt,
      style,
      roomType,
      outputId,
      inferenceSteps.toString(),
    ];

    console.log(`[AI Service] Spawning Python process: ${PYTHON_EXECUTABLE} ${args.join(' ')}`);

    const pythonProcess = spawn(PYTHON_EXECUTABLE, args, {
      env: {
        ...process.env,
        // Pass environment variables to Python
        AI_MODELS_PATH: process.env.AI_MODELS_PATH,
        AI_OUTPUTS_PATH: process.env.AI_OUTPUTS_PATH,
      },
    });

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log(`[AI Service - Python stdout]: ${chunk}`);
      outputData += chunk;
    });

    pythonProcess.stderr.on('data', (data) => {
      const chunk = data.toString();
      console.error(`[AI Service - Python stderr]: ${chunk}`);
      errorData += chunk;
    });

    pythonProcess.on('close', (code) => {
      console.log(`[AI Service] Python process exited with code ${code}`);

      if (code === 0) {
        try {
          // Parse JSON output from Python script
          const result: AIGenerationResult = JSON.parse(outputData);
          console.log(`[AI Service] Generation result:`, result);
          resolve(result);
        } catch (parseError) {
          console.error(`[AI Service] Failed to parse Python output:`, outputData);
          reject(new Error(`Failed to parse AI generation result: ${parseError}`));
        }
      } else {
        const errorMessage = errorData || `Python script failed with exit code ${code}`;
        console.error(`[AI Service] Generation failed:`, errorMessage);
        reject(new Error(errorMessage));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error(`[AI Service] Failed to spawn Python process:`, error);
      reject(new Error(`Failed to start AI generation: ${error.message}`));
    });

    // Set a timeout for very long-running processes (e.g., 10 minutes)
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('AI generation timed out after 10 minutes'));
    }, 10 * 60 * 1000);

    pythonProcess.on('close', () => {
      clearTimeout(timeout);
    });
  });
}

/**
 * Check if the AI model is available and properly configured
 */
export async function checkAIModelAvailability(): Promise<{
  available: boolean;
  message: string;
}> {
  const modelPath = process.env.AI_MODELS_PATH;
  const outputPath = process.env.AI_OUTPUTS_PATH;

  if (!modelPath || !outputPath) {
    return {
      available: false,
      message: 'AI_MODELS_PATH or AI_OUTPUTS_PATH not configured in environment variables',
    };
  }

  try {
    // Check if Python script exists
    await fs.access(PYTHON_SCRIPT);

    // Check if model directory exists (on Mac mini external drive)
    // Note: This might fail if running from Windows dev machine
    // In production, this would run on Mac mini server
    try {
      await fs.access(modelPath);
    } catch {
      return {
        available: false,
        message: `Model path not accessible: ${modelPath}. Ensure external drive is mounted on Mac mini.`,
      };
    }

    // Check if output directory exists, create if not
    try {
      await fs.access(outputPath);
    } catch {
      await fs.mkdir(outputPath, { recursive: true });
    }

    return {
      available: true,
      message: 'AI model is properly configured and available',
    };
  } catch (error) {
    return {
      available: false,
      message: `AI model availability check failed: ${error}`,
    };
  }
}

/**
 * Get available design styles
 */
export const DESIGN_STYLES = [
  { value: 'modern', label: 'Modern', description: 'Clean lines, minimalist aesthetic' },
  { value: 'minimalist', label: 'Minimalist', description: 'Less is more, simple elegance' },
  { value: 'industrial', label: 'Industrial', description: 'Raw materials, urban edge' },
  { value: 'scandinavian', label: 'Scandinavian', description: 'Bright, cozy, functional' },
  { value: 'bohemian', label: 'Bohemian', description: 'Eclectic, colorful, artistic' },
  { value: 'luxury', label: 'Luxury', description: 'Opulent, sophisticated, high-end' },
  { value: 'traditional', label: 'Traditional', description: 'Classic, timeless elegance' },
  { value: 'contemporary', label: 'Contemporary', description: 'Current trends, stylish' },
] as const;

/**
 * Get available room types
 */
export const ROOM_TYPES = [
  { value: 'living_room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'dining_room', label: 'Dining Room' },
  { value: 'office', label: 'Home Office' },
  { value: 'entryway', label: 'Entryway' },
  { value: 'outdoor', label: 'Outdoor/Patio' },
] as const;
