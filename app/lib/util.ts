import { htmlToText } from "html-to-text";

export function cleanGroqHtml(str: string) {
  return str.replace(/```html|```/g, "").trim();
}

export function truncateWords(text: string, maxWords: number) {
  const words = text.split(/\s+/); // split by whitespace
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ");
}
export function fromHTMLToText(html: string) {
  return htmlToText(html, {
    wordwrap: 150,
  });
}
