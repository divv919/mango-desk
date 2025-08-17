import nodemailer from "nodemailer";
import { fromHTMLToText, truncateWords } from "./util";

export async function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}
export async function sendToEmails(
  summary: string,
  emails: string[],
  subject = "Summary of Transcript"
) {
  const transporter = await createTransporter();
  const limitedEmails = emails.slice(0, 8);

  for (const email of limitedEmails) {
    (async () => {
      const info = await transporter.sendMail({
        from: '"Divyansh Swarnkar" <divyanshsoni919@gmail.com>',
        to: email,
        subject: truncateWords(subject, 80) ?? "Summary of Transcript",
        text: fromHTMLToText(summary),
        html: summary,
      });

      console.log("Message sent:", info.messageId, email, summary);
    })();
  }
}
