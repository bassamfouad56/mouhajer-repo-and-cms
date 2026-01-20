import { NextRequest, NextResponse } from "next/server";
import { createClient, type SanityClient } from "@sanity/client";

// Force dynamic to prevent static analysis during build
export const dynamic = "force-dynamic";

// Validate projectId - must not be empty and must only contain a-z, 0-9, and dashes
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv";
const isValidProjectId = projectId && /^[a-z0-9-]+$/.test(projectId);

// Only create client if projectId is valid
let client: SanityClient | null = null;
if (isValidProjectId) {
  client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-11-21",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Increment view count in Sanity
    if (client && process.env.SANITY_API_TOKEN) {
      const result = await client
        .patch(postId)
        .setIfMissing({ viewCount: 0 })
        .inc({ viewCount: 1 })
        .commit();

      return NextResponse.json({ success: true, views: result.viewCount });
    }

    // If no client or token, just return success (views tracked client-side)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
