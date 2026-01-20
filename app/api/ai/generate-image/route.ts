import { NextRequest, NextResponse } from "next/server";
import {
  validateServicePrompt,
  enhancePromptForMIDC,
  analyzeImageWithOllama,
  checkOllamaHealth,
} from "@/lib/ai/ollama-client";
import {
  generateImageWithComfyUI,
  checkComfyUIHealth,
} from "@/lib/ai/comfyui-client";
import { Resend } from "resend";

// Force dynamic to prevent static analysis during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    // Lazy load Sanity client to avoid build-time initialization
    const { client: sanityClient } = await import("@/sanity/lib/client");

    const formData = await request.formData();

    const email = formData.get("email") as string;
    const prompt = formData.get("prompt") as string;
    const serviceCategory = formData.get("serviceCategory") as string;
    const uploadedImage = formData.get("image") as File | null;

    // Validation
    if (!email || !prompt) {
      return NextResponse.json(
        { error: "Email and prompt are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if AI services are available
    const [ollamaHealthy, comfyUIHealthy] = await Promise.all([
      checkOllamaHealth(),
      checkComfyUIHealth(),
    ]);

    if (!ollamaHealthy || !comfyUIHealthy) {
      return NextResponse.json(
        {
          error:
            "AI services are temporarily unavailable. Please try again later.",
          details: {
            ollama: ollamaHealthy ? "online" : "offline",
            comfyUI: comfyUIHealthy ? "online" : "offline",
          },
        },
        { status: 503 }
      );
    }

    // Validate if prompt is related to MIDC services
    const validation = await validateServicePrompt(prompt);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Prompt must be related to design or construction services",
          suggestion: validation.suggestion,
        },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Process uploaded image if provided
    let imageAnalysis: string | undefined;
    let uploadedImageBase64: string | undefined;

    if (uploadedImage) {
      const bytes = await uploadedImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      uploadedImageBase64 = buffer.toString("base64");

      // Analyze uploaded image with LLaVA
      imageAnalysis = await analyzeImageWithOllama(
        uploadedImageBase64,
        `Describe this image in detail, focusing on architectural and design elements. How can we enhance this design for a luxury project?`,
        "llava"
      );
    }

    // Enhance the prompt using Ollama
    const enhancedPrompt = await enhancePromptForMIDC(
      imageAnalysis
        ? `${prompt}. Reference image analysis: ${imageAnalysis}`
        : prompt,
      serviceCategory || validation.category
    );

    console.log("Enhanced prompt:", enhancedPrompt);

    // Generate image with ComfyUI
    const generatedImageBuffer = await generateImageWithComfyUI({
      prompt: enhancedPrompt,
      negative_prompt:
        "low quality, blurry, distorted, unrealistic, amateur, sketchy, bad architecture, poor design",
      width: 1024,
      height: 768,
      steps: 30,
      cfg_scale: 7.5,
      seed: -1,
    });

    const generationTime = Math.round((Date.now() - startTime) / 1000);

    // Upload generated image to Sanity
    const imageAsset = await sanityClient.assets.upload(
      "image",
      generatedImageBuffer,
      {
        filename: `ai-generated-${Date.now()}.png`,
        contentType: "image/png",
      }
    );

    // Upload user's image to Sanity if provided
    let uploadedImageAsset;
    if (uploadedImage && uploadedImageBase64) {
      const uploadedBuffer = Buffer.from(uploadedImageBase64, "base64");
      uploadedImageAsset = await sanityClient.assets.upload(
        "image",
        uploadedBuffer,
        {
          filename: `user-upload-${Date.now()}.${uploadedImage.type.split("/")[1]}`,
          contentType: uploadedImage.type,
        }
      );
    }

    // Create lead in Sanity
    const lead = await sanityClient.create({
      _type: "lead",
      email,
      prompt,
      serviceCategory: serviceCategory || validation.category,
      uploadedImage: uploadedImageAsset
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadedImageAsset._id,
            },
          }
        : undefined,
      generatedImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      },
      status: "processing",
      modelUsed: "SDXL + Llama3",
      generationTime,
      createdAt: new Date().toISOString(),
    });

    // Generate image URL from Sanity CDN
    const imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${imageAsset._id.replace("image-", "").replace("-png", ".png")}`;

    // Send email with generated image (if Resend is configured)
    try {
      if (!resend) {
        console.log("Resend not configured, skipping email");
        await sanityClient
          .patch(lead._id)
          .set({ status: "completed" })
          .commit();
      } else {
        await resend.emails.send({
          from: "MIDC AI Design Studio <noreply@midc.ae>",
          to: email,
          subject: "Your AI-Generated Design Concept from MIDC",
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #c9a962; margin: 0; font-size: 28px; font-weight: 300;">MIDC AI Design Studio</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Your Vision, Elevated by AI</p>
              </div>

              <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #333;">Dear Valued Client,</p>

                <p style="font-size: 14px; color: #666; line-height: 1.8;">
                  Thank you for exploring the future of design with MIDC. Based on your prompt, our AI has generated a concept visualization that captures your vision with MIDC's signature blend of European precision and Arabic warmth.
                </p>

                <div style="margin: 30px 0; padding: 20px; background: #f8f8f8; border-left: 4px solid #c9a962; border-radius: 4px;">
                  <p style="margin: 0 0 10px 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Your Prompt</p>
                  <p style="margin: 0; font-size: 14px; color: #333; font-style: italic;">"${prompt}"</p>
                </div>

                <div style="margin: 30px 0; text-align: center;">
                  <img src="${imageUrl}" alt="AI Generated Design" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                </div>

                <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Next Steps</h3>
                  <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                    <li style="margin-bottom: 10px;">Our design team will review your concept within 24 hours</li>
                    <li style="margin-bottom: 10px;">We'll reach out to discuss how we can bring this vision to life</li>
                    <li style="margin-bottom: 10px;">Schedule a consultation to explore detailed design options</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://midc.ae/contact" style="display: inline-block; background: #c9a962; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Schedule Consultation</a>
                </div>

                <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px;">
                  <p style="font-size: 12px; color: #999; margin: 0;">
                    <strong>Generation Details:</strong><br>
                    Time: ${generationTime} seconds | Service: ${serviceCategory || validation.category}<br>
                    Lead ID: ${lead._id}
                  </p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                  <p style="font-size: 12px; color: #999; margin: 5px 0;">
                    Mouhajer International Design & Contracting<br>
                    Dubai, UAE | <a href="tel:+971XXXXXXXX" style="color: #c9a962;">+971 XX XXX XXXX</a>
                  </p>
                  <div style="margin-top: 15px;">
                    <a href="https://midc.ae" style="color: #c9a962; text-decoration: none; margin: 0 10px; font-size: 12px;">Website</a>
                    <a href="https://linkedin.com/company/midc" style="color: #c9a962; text-decoration: none; margin: 0 10px; font-size: 12px;">LinkedIn</a>
                    <a href="https://instagram.com/midc.ae" style="color: #c9a962; text-decoration: none; margin: 0 10px; font-size: 12px;">Instagram</a>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        });

        // Update lead status
        await sanityClient
          .patch(lead._id)
          .set({
            status: "sent",
            emailSentAt: new Date().toISOString(),
          })
          .commit();
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the request if email fails
      await sanityClient.patch(lead._id).set({ status: "completed" }).commit();
    }

    return NextResponse.json({
      success: true,
      message: "Image generated successfully! Check your email.",
      data: {
        leadId: lead._id,
        imageUrl,
        generationTime,
        enhancedPrompt,
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const [ollamaHealthy, comfyUIHealthy] = await Promise.all([
    checkOllamaHealth(),
    checkComfyUIHealth(),
  ]);

  return NextResponse.json({
    status: ollamaHealthy && comfyUIHealthy ? "healthy" : "degraded",
    services: {
      ollama: ollamaHealthy ? "online" : "offline",
      comfyUI: comfyUIHealthy ? "online" : "offline",
    },
    timestamp: new Date().toISOString(),
  });
}
