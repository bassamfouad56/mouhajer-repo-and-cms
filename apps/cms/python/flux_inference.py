#!/usr/bin/env python3
"""
Flux.1 Schnell - AI Room Redesign Inference Script
Optimized for Mac mini M2/M3 with external drive storage
"""

import sys
import json
import os
import time
from pathlib import Path
from typing import Dict, Any

# Import AI libraries (will be installed separately)
try:
    import torch
    from diffusers import FluxPipeline
    from PIL import Image
    import logging
except ImportError as e:
    print(json.dumps({
        "success": False,
        "error": f"Missing required Python libraries: {str(e)}. Please install: pip3 install torch diffusers pillow transformers accelerate"
    }))
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration - these can be overridden via environment variables
MODEL_PATH = os.getenv('AI_MODELS_PATH', '/Volumes/ExternalDrive/ai-models/flux/FLUX.1-schnell')
OUTPUT_PATH = os.getenv('AI_OUTPUTS_PATH', '/Volumes/ExternalDrive/ai-outputs')
DEVICE = "mps"  # Metal Performance Shaders for Mac

# Global model instance (reuse if script is kept alive)
_model_pipeline = None


def load_model() -> FluxPipeline:
    """
    Load Flux.1 Schnell model from external drive.
    Uses Metal Performance Shaders (MPS) for Mac GPU acceleration.
    """
    global _model_pipeline

    if _model_pipeline is not None:
        logger.info("Using cached model pipeline")
        return _model_pipeline

    logger.info(f"Loading Flux.1 Schnell from {MODEL_PATH}")

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. "
            f"Please download Flux.1 Schnell to this location."
        )

    try:
        # Load model with FP16 for memory efficiency
        _model_pipeline = FluxPipeline.from_pretrained(
            MODEL_PATH,
            torch_dtype=torch.float16,
            use_safetensors=True
        )

        # Move to Mac GPU (MPS)
        _model_pipeline = _model_pipeline.to(DEVICE)

        # Enable memory-efficient attention for lower VRAM usage
        if hasattr(_model_pipeline, 'enable_attention_slicing'):
            _model_pipeline.enable_attention_slicing()

        logger.info("Model loaded successfully")
        return _model_pipeline

    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise


def generate_room_redesign(
    input_image_path: str,
    prompt: str,
    style: str,
    room_type: str,
    output_id: str,
    inference_steps: int = 4
) -> Dict[str, Any]:
    """
    Generate AI room redesign using Flux.1 Schnell.

    Args:
        input_image_path: Path to original room image
        prompt: User's custom description
        style: Design style (modern, minimalist, industrial, etc.)
        room_type: Type of room (living_room, bedroom, etc.)
        output_id: Unique identifier for output file
        inference_steps: Number of inference steps (1-4 for Schnell)

    Returns:
        Dict with success status, output path, and metadata
    """
    start_time = time.time()

    try:
        # Validate input image exists
        if not os.path.exists(input_image_path):
            return {
                "success": False,
                "error": f"Input image not found: {input_image_path}"
            }

        # Ensure output directory exists
        os.makedirs(OUTPUT_PATH, exist_ok=True)

        # Load the model
        logger.info(f"Starting generation for {output_id}")
        pipe = load_model()

        # Load input image
        logger.info(f"Loading input image: {input_image_path}")
        input_image = Image.open(input_image_path).convert("RGB")

        # Resize if too large (to prevent OOM on Mac mini)
        max_size = 1024
        if max(input_image.size) > max_size:
            logger.info(f"Resizing image from {input_image.size}")
            input_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

        # Construct comprehensive prompt for interior design
        full_prompt = f"""
        {style} interior design style, {room_type}.
        {prompt if prompt else 'Professional interior redesign with elegant furniture and decor'}
        High quality, photorealistic, well-lit, modern aesthetic, clean composition.
        Professional interior photography, magazine quality.
        """.strip()

        logger.info(f"Generating with prompt: {full_prompt[:100]}...")
        logger.info(f"Using {inference_steps} inference steps")

        # Generate the redesign
        # Flux Schnell doesn't use guidance_scale (set to 0.0)
        result = pipe(
            prompt=full_prompt,
            image=input_image,
            num_inference_steps=inference_steps,
            guidance_scale=0.0,  # Schnell is guidance-free
            height=input_image.height,
            width=input_image.width,
        ).images[0]

        # Save to external drive
        output_filename = f"{output_id}_generated.jpg"
        output_path = os.path.join(OUTPUT_PATH, output_filename)

        logger.info(f"Saving result to: {output_path}")
        result.save(output_path, quality=95, optimize=True)

        # Calculate processing time
        processing_time = int(time.time() - start_time)

        logger.info(f"Generation completed in {processing_time} seconds")

        return {
            "success": True,
            "output_path": output_path,
            "processing_time": processing_time,
            "inference_steps": inference_steps,
            "model": "flux-schnell",
            "image_size": {
                "width": result.width,
                "height": result.height
            }
        }

    except Exception as e:
        processing_time = int(time.time() - start_time)
        error_msg = str(e)
        logger.error(f"Generation failed: {error_msg}")

        return {
            "success": False,
            "error": error_msg,
            "processing_time": processing_time
        }


def main():
    """
    Main entry point for CLI usage.
    Expected arguments:
        1. input_image_path
        2. prompt
        3. style
        4. room_type
        5. output_id
        6. inference_steps (optional, defaults to 4)
    """
    if len(sys.argv) < 6:
        print(json.dumps({
            "success": False,
            "error": "Usage: python flux_inference.py <input_path> <prompt> <style> <room_type> <output_id> [inference_steps]"
        }))
        sys.exit(1)

    input_path = sys.argv[1]
    prompt = sys.argv[2]
    style = sys.argv[3]
    room_type = sys.argv[4]
    output_id = sys.argv[5]
    inference_steps = int(sys.argv[6]) if len(sys.argv) > 6 else 4

    # Validate inference steps for Schnell (1-4)
    if not 1 <= inference_steps <= 4:
        logger.warning(f"Invalid inference_steps {inference_steps}, defaulting to 4")
        inference_steps = 4

    result = generate_room_redesign(
        input_image_path=input_path,
        prompt=prompt,
        style=style,
        room_type=room_type,
        output_id=output_id,
        inference_steps=inference_steps
    )

    # Output JSON result for Node.js to parse
    print(json.dumps(result))


if __name__ == "__main__":
    main()
