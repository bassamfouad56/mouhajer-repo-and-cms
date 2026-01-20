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

type ReactionType = "helpful" | "insightful" | "loved";

export async function POST(request: NextRequest) {
  try {
    const { postId, type, action } = await request.json();

    if (!postId || !type) {
      return NextResponse.json(
        { error: "Post ID and reaction type are required" },
        { status: 400 }
      );
    }

    const validTypes: ReactionType[] = ["helpful", "insightful", "loved"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    // Update reaction count in Sanity
    if (client && process.env.SANITY_API_TOKEN) {
      const fieldPath = `reactions.${type}`;
      const increment = action === "remove" ? -1 : 1;

      const result = await client
        .patch(postId)
        .setIfMissing({ reactions: { helpful: 0, insightful: 0, loved: 0 } })
        .inc({ [fieldPath]: increment })
        .commit();

      return NextResponse.json({
        success: true,
        reactions: result.reactions,
      });
    }

    // If no token, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating reaction:", error);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
