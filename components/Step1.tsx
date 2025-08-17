"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Editor from "./Editor";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ClipboardPaste, FileUp } from "lucide-react";
export default function Step1({
  setStep,
  setSummary,
  setIsLoading,
}: {
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isTranscriptFill, setIsTranscriptFill] = useState(false);
  const handleSummary = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  const handlePaste = async () => {
    const content = await navigator.clipboard.readText();
    setTranscript(content);
  };

  useEffect(() => {
    setIsTranscriptFill(transcript.length >= 20);
  }, [transcript]);
  return (
    <div className="w-[1000px] flex flex-col justify-center items-start gap-5">
      <div className="w-full space-y-[10px]">
        <div className="flex justify-between items-center">
          <Label htmlFor="transcript">Your Transcript</Label>
          <div className="flex gap-6">
            <Button
              onClick={handlePaste}
              className="flex gaps-1 items-center hover:bg-stone-600 bg-stone-800 cursor-pointer"
            >
              <ClipboardPaste />
              <div>Paste</div>
            </Button>
          </div>
        </div>
        <Textarea
          maxLength={5000}
          id="transcript"
          placeholder="Paste your transcript or notes here…"
          className="resize-none border border-stone-600 bg-neutral-950 placeholder:text-stone-400 h-[300px]"
          value={transcript}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setTranscript(e.target.value);
          }}
        />
      </div>
      <div className="w-full space-y-[10px]">
        <Label htmlFor="prompt">Your Prompt</Label>

        <Textarea
          maxLength={500}
          value={prompt}
          id="prompt"
          placeholder="Enter your custom prompt…"
          className="resize-none border border-stone-600 bg-neutral-950 placeholder:text-stone-400 h-[80px]"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setPrompt(e.target.value);
          }}
        />
      </div>
      <Button
        disabled={!isTranscriptFill}
        className="hover:bg-stone-600 bg-stone-800 cursor-pointer"
        onClick={handleSummary}
      >
        Summarize
      </Button>
    </div>
  );
}
