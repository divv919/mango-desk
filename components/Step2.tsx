import { ChangeEvent, useState } from "react";
import Editor from "./Editor";

export default function Step2({
  setStep,
  setSummary,
  summary,
}: {
  setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailString, setEmailString] = useState("");
  const [subject, setSubject] = useState("");
  const handleSubmit = async () => {
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
    }
  };
  const handleEmailChange = () => {
    //validation for string
    setEmails((prev) => [...prev, emailString]);
    setEmailString("");
  };
  return (
    <div>
      <Editor setValue={setSummary} value={summary} />
      <div>
        <textarea
          placeholder="Enter Emails"
          value={emailString}
          onChange={(e) => setEmailString(e.target.value)}
        />
        <textarea
          placeholder="Enter Subject of email"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <button onClick={handleEmailChange}>Add Email</button>
      </div>
      <button onClick={handleSubmit}>Send Email</button>
    </div>
  );
}
