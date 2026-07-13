import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const TARGET_LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  he: "Hebrew",
  ar: "Arabic",
};

export async function POST(req: NextRequest) {
  const { text, targetLocale } = await req.json();

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (typeof targetLocale !== "string" || !(targetLocale in TARGET_LANGUAGE_NAMES)) {
    return NextResponse.json({ error: "targetLocale must be one of en, he, ar" }, { status: 400 });
  }

  const targetLanguageName = TARGET_LANGUAGE_NAMES[targetLocale];

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content:
            "You are a translation engine for a home-services marketplace chat app. Respond only with valid JSON, no markdown, no extra text.",
        },
        {
          role: "user",
          content: `Detect the language of the following chat message and translate it into ${targetLanguageName}. If it is already written in ${targetLanguageName}, return it unchanged and set "sourceLanguage" to "${targetLanguageName}". Preserve the original meaning precisely — do not paraphrase or invent content.

Message: "${text.trim()}"

Respond with ONLY valid JSON:
{
  "translatedText": "<the message translated into ${targetLanguageName}>",
  "sourceLanguage": "<the detected source language name, e.g. English, Hebrew, Arabic>"
}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse translation response" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.translatedText !== "string" || typeof parsed.sourceLanguage !== "string") {
      return NextResponse.json({ error: "Malformed translation response" }, { status: 500 });
    }

    return NextResponse.json({
      translatedText: parsed.translatedText,
      sourceLanguage: parsed.sourceLanguage,
    });
  } catch (e) {
    console.error("translate error:", e);
    return NextResponse.json({ error: "AI request failed." }, { status: 500 });
  }
}
