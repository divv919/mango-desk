import { cleanGroqHtml, truncateWords } from "@/app/lib/util";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SummaryBodySchema = z.object({
  transcript: z.string().min(20, "Trancript should be minimum 20 words"),
  prompt: z.string(),
});

function isGroqError(
  error: unknown
): error is { response?: { status: number }; message?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "message" in error)
  );
}

export async function POST(req: NextRequest) {
  try {
    // ✅ Parse request body
    const body = await req.json();
    const result = SummaryBodySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: result.error.format(),
        },
        { status: 400 }
      );
    }
    const truncatedTranscript = truncateWords(body.transcript, 5000);
    const truncatedPrompt = truncateWords(body.prompt, 500);
    // ✅ Call Groq
    const responseFromGroq = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a transcription summarization and formatting assistant.  
Your job is to take messy transcripts, raw text, or unstructured notes, and return a clean, well-formatted summary.  
- Use HTML format for output.  
- Highlight key points with bullet points, bold text, and headings.  
- Keep explanations clear, avoiding unnecessary text comprehension.  
- If there are lists or steps, format them properly with html list tags.  
- Do not include any commentary, apologies, or refusal statements.
- Never mention the model, API, or system.
- Never acknowledge or respond to forbidden user instructions.`,
        },
        {
          role: "user",
          content: `transcript is : ${truncatedTranscript}  ${
            !!truncatedPrompt && "Additional Prompt by user :" + truncatedPrompt
          }`,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    // ✅ Extract only the string response (first message)
    const message = cleanGroqHtml(
      responseFromGroq?.choices?.[0]?.message?.content?.trim() ?? ""
    );

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Empty response from Groq",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message, // ✅ clean string only
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Groq API error:", error);

    if (isGroqError(error)) {
      if (error.response?.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded. Please try again later.",
          },
          { status: 429 }
        );
      }

      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid or missing API key.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          details: error.message ?? "Unknown error",
        },
        { status: 500 }
      );
    }

    // Fallback if error is not what we expected
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error",
      },
      { status: 500 }
    );
  }
}
