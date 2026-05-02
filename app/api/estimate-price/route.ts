import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { description } = await req.json();

  if (!description || typeof description !== "string" || description.trim().length < 5) {
    return NextResponse.json({ error: "Please describe the job." }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content: "You are a home services cost estimator for HandyMatch, an Israeli marketplace. Respond only with valid JSON, no markdown, no extra text.",
        },
        {
          role: "user",
          content: `A customer described this job: "${description.trim()}"

Respond with ONLY valid JSON in this exact shape:
{
  "category": "<service category e.g. Plumbing, Electrical, Carpentry, Painting, HVAC, Cleaning, Landscaping, Moving, Appliance Repair, General Handyman>",
  "summary": "<one sentence restatement of the job>",
  "priceRange": { "min": <number>, "max": <number> },
  "estimatedHours": <number>,
  "complexity": "<simple or moderate or complex>",
  "breakdown": [
    { "item": "<cost item>", "amount": "<e.g. $30-$50>" }
  ],
  "tips": ["<short practical tip>", "<short practical tip>"],
  "questionsToAsk": ["<question to ask the pro>", "<question to ask the pro>"]
}

Use realistic USD prices for the Israeli market. Keep breakdown to 3-4 items.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse estimate." }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("estimate-price error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
