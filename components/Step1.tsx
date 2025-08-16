import { ChangeEvent, useState } from "react";
import Editor from "./Editor";

export default function Step1({
  setStep,
  setSummary,
}: {
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const handleSummary = async () => {
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        body: JSON.stringify({ transcript, prompt }),
      });
      if (!res.ok) {
        throw new Error();
      }
      const jsonData = await res.json();
      setSummary(jsonData.message);
      console.log(jsonData);
      setStep(2);
    } catch (err) {
      alert("Error posting on backend" + err);
    }
  };
  return (
    <div>
      <textarea
        value={transcript}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setTranscript(e.target.value);
        }}
      />
      <textarea
        value={prompt}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setPrompt(e.target.value);
        }}
      />
      <button onClick={handleSummary}>Summarize</button>
    </div>
  );
}
