import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SERVICES = [
  "Plumbing", "Electrical", "Carpentry", "Painting", "HVAC",
  "Cleaning", "Landscaping", "Moving", "Appliance Repair", "General Handyman",
];

export async function POST(req: NextRequest) {
  const { description } = await req.json();

  if (!description || typeof description !== "string" || description.trim().length < 3) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `You are a home services classifier for a handyman marketplace called HandyMatch.

Available service categories: ${SERVICES.join(", ")}.

Given the user's job description below, respond with ONLY valid JSON in this exact shape:
{
  "category": "<one of the categories above>",
  "summary": "<one sentence restatement of the job>",
  "estimatedHours": <number, realistic estimate>,
  "priceRange": { "min": <number>, "max": <number> }
}

User description: "${description.trim()}"`,
      },
    ],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();

  // Extract JSON even if model wraps it in markdown fences
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse classifier response" }, { status: 500 });
  }

  try {
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid JSON from classifier" }, { status: 500 });
  }
}
