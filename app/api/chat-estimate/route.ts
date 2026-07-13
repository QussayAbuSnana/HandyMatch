import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/** Guards against a response that parses as JSON but doesn't match the shape the UI expects. */
function isValidResult(result: unknown): boolean {
  if (!result || typeof result !== "object") return false;
  const r = result as Record<string, unknown>;

  if (r.type === "question") {
    return (
      typeof r.question === "string" &&
      Array.isArray(r.options) &&
      r.options.length > 0 &&
      r.options.every((o) => typeof o === "string")
    );
  }

  if (r.type === "estimate") {
    const priceRange = r.priceRange as Record<string, unknown> | undefined;
    return (
      typeof r.category === "string" &&
      typeof r.summary === "string" &&
      !!priceRange && typeof priceRange.min === "number" && typeof priceRange.max === "number" &&
      typeof r.estimatedHours === "number" &&
      typeof r.complexity === "string" &&
      Array.isArray(r.breakdown) &&
      Array.isArray(r.tips) &&
      Array.isArray(r.questionsToAsk)
    );
  }

  return false;
}

export async function POST(req: NextRequest) {
  const { description, answers } = await req.json() as {
    description: string;
    answers: { question: string; answer: string }[];
  };

  if (!description || description.trim().length < 5) {
    return NextResponse.json({ error: "Please describe the job." }, { status: 400 });
  }

  const history = answers
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n");

  const shouldForceEstimate = answers.length >= 5;

  const prompt = shouldForceEstimate
    ? `Job description: "${description.trim()}"
${history ? `\nClarifications:\n${history}` : ""}

You now have enough information. Give a detailed final estimate. Respond with ONLY valid JSON:
{
  "type": "estimate",
  "category": "<Plumbing|Electrical|Carpentry|Painting|HVAC|Cleaning|Landscaping|Moving|Appliance Repair|General Handyman>",
  "summary": "<one sentence restatement of the exact problem>",
  "priceRange": { "min": <number>, "max": <number> },
  "estimatedHours": <number>,
  "complexity": "<simple|moderate|complex>",
  "breakdown": [{ "item": "<cost item>", "amount": "<e.g. $30–$50>" }],
  "tips": ["<tip>", "<tip>", "<tip>"],
  "questionsToAsk": ["<question to ask the pro>", "<question to ask the pro>"]
}`
    : `Job description: "${description.trim()}"
${history ? `\nClarifications so far:\n${history}` : ""}

You are diagnosing a home service problem to give an accurate cost estimate.
Ask ONE short clarifying question that will most help narrow down the cost or complexity.
Cover things like: severity, size/area, age of equipment, number of items, material preference, urgency, access difficulty.
Provide exactly 2 or 3 short answer options (keep each option under 5 words).

If you already have enough detail to give a confident estimate, give the estimate instead.

Respond with ONLY valid JSON in one of these formats:

Question format:
{
  "type": "question",
  "question": "<short question under 12 words>",
  "options": ["<option1>", "<option2>", "<option3 optional>"]
}

Estimate format:
{
  "type": "estimate",
  "category": "<Plumbing|Electrical|Carpentry|Painting|HVAC|Cleaning|Landscaping|Moving|Appliance Repair|General Handyman>",
  "summary": "<one sentence describing the exact problem>",
  "priceRange": { "min": <number>, "max": <number> },
  "estimatedHours": <number>,
  "complexity": "<simple|moderate|complex>",
  "breakdown": [{ "item": "<item>", "amount": "<amount>" }],
  "tips": ["<tip>", "<tip>", "<tip>"],
  "questionsToAsk": ["<question>", "<question>"]
}`;

  const runCompletion = async () => {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 2048,
      messages: [
        {
          role: "system",
          content: "You are a home services cost estimator for HandyMatch, an Israeli marketplace. Respond ONLY with valid JSON, no markdown, no extra text. Use realistic USD prices.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in AI response");

    // Remove newlines inside JSON string values to prevent parse errors
    const cleaned = match[0].replace(/("(?:[^"\\]|\\.)*")/g, (s) =>
      s.replace(/\n/g, " ").replace(/\r/g, "")
    );
    const parsed = JSON.parse(cleaned);
    if (!isValidResult(parsed)) throw new Error("AI response did not match the expected shape");
    return parsed;
  };

  try {
    let result;
    try {
      result = await runCompletion();
    } catch (firstErr) {
      // The model occasionally returns malformed/truncated JSON — one retry usually succeeds.
      console.error("chat-estimate parse failed, retrying once:", firstErr);
      result = await runCompletion();
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error("chat-estimate error (after retry):", e);
    return NextResponse.json({ error: "Could not generate an estimate right now. Please try again." }, { status: 500 });
  }
}
