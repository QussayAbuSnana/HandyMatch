import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SERVICES = [
  "Plumbing", "Electrical", "Carpentry", "Painting", "HVAC",
  "Cleaning", "Landscaping", "Moving", "Appliance Repair", "General Handyman",
];

export async function POST(req: NextRequest) {
  const { description } = await req.json();

  if (!description || typeof description !== "string" || description.trim().length < 3) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 256,
      messages: [
        {
          role: "system",
          content: "You are a home services classifier for HandyMatch marketplace. Respond only with valid JSON, no markdown, no extra text.",
        },
        {
          role: "user",
          content: `Available service categories: ${SERVICES.join(", ")}.

Given this job description: "${description.trim()}"

Respond with ONLY valid JSON:
{
  "category": "<one of the categories above>",
  "summary": "<one sentence restatement>",
  "estimatedHours": <number>,
  "priceRange": { "min": <number>, "max": <number> }
}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse classifier response" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (e) {
    console.error("classify-job error:", e);
    return NextResponse.json({ error: "AI request failed." }, { status: 500 });
  }
}
