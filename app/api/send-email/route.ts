import { sendToEmails } from "@/app/lib/email";
import { emailRegex } from "@/app/lib/util";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// ✅ Schema with email validation
const BodySchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  emails: z
    .array(z.string().regex(emailRegex, "Invalid email format"))
    .nonempty("At least one email is required"),
  subject: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = BodySchema.safeParse(body);

    if (!result.success) {
      // ✅ Schema validation failed
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: result.error.format(), // gives field-level errors
        },
        { status: 400 }
      );
    }

    // ✅ Safe destructuring from parsed data
    const { summary, emails, subject } = result.data;

    await sendToEmails(summary, emails, subject);

    return NextResponse.json(
      {
        success: true,
        message: "Summary successfully sent to emails",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.log("error is ", err);
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
