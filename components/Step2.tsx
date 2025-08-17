"use client";
import { ChangeEvent, useEffect, useState } from "react";
import Editor from "./Editor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { emailRegex } from "@/app/lib/util";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { htmlToText } from "html-to-text";

export default function Step2({
  setStep,
  setSummary,
  summary,
  setIsLoading,
}: {
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailString, setEmailString] = useState("");
  const [subject, setSubject] = useState("Summary Of Your Transcript");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [error, setError] = useState({
    emailError: "",
    globalError: "",
    headingError: "",
  });
  useEffect(() => {
    setIsEmailValid(emailRegex.test(emailString));
  }, [emailString]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({
          summary,
          emails,
          subject,
        }),
      });
      if (!res.ok) {
        throw new Error();
      }
      setSummary("");
      setStep(3);
    } catch (err) {
      alert("Error sending emails" + err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEmailChange = () => {
    if (emails.includes(emailString)) {
      setEmailString("");

      return;
    }
    //validation for string
    setEmails((prev) => [...prev, emailString]);
    setEmailString("");
  };

  const closeEmail = (email: string) => {
    setEmails(
      emails.filter((toAllow) => {
        return toAllow !== email;
      })
    );
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(htmlToText(summary));
  };

  return (
    <div className="w-full xl:w-[1000px] flex flex-col justify-center items-start gap-5">
      <div>
        <Button onClick={handleCopy}>Copy</Button>
      </div>
      <div className="bg-stone-800 text-stone-100 w-full">
        <Editor setValue={setSummary} value={summary} />
      </div>
      <div className="w-full flex flex-col gap-2 items-start">
        <div className="w-full xl:w-1/3 flex  gap-2 items-end">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Enter Email</Label>
            <Input
              placeholder="example@gmail.com"
              id="email"
              maxLength={60}
              value={emailString}
              onChange={(e) => setEmailString(e.target.value)}
              className="resize-none border  border-stone-600 bg-neutral-950 placeholder:text-stone-400  w-full"
            />
          </div>
          <Button
            disabled={!isEmailValid || emails.length >= 5}
            className=" w-fit flex gaps-1 items-center hover:bg-stone-600 bg-stone-800 cursor-pointer"
            onClick={handleEmailChange}
          >
            Add Email
          </Button>
        </div>
        <div className=" w-full flex flex-wrap gap-2">
          {emails.map((email, index) => {
            return (
              <Badge key={email + index}>
                {email}{" "}
                <div
                  className="p-2 hover:bg-stone-800 cursor-pointer rounded-md"
                  onClick={() => closeEmail(email)}
                >
                  <X size={16} />
                </div>
              </Badge>
            );
          })}
        </div>
        {/* dialog */}
      </div>
      <div className="w-full xl:w-2/3  flex gap-2 items-end">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="subject">Enter Subject of Email</Label>
          <Input
            id="subject"
            maxLength={80}
            placeholder="Enter Subject of email"
            value={subject}
            className=" resize-none border border-stone-600 bg-neutral-950 placeholder:text-stone-400  w-full"
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <Button
          className=" w-fit flex gaps-1 items-center hover:bg-stone-600 bg-stone-800 cursor-pointer"
          disabled={summary.length < 20 || emails.length < 1}
          onClick={handleSubmit}
        >
          Send Email
        </Button>
      </div>
    </div>
  );
}
