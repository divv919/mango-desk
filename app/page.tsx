"use client";

import { useEffect, useState } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Success from "../components/Success";

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [summary, setSummary] = useState("");
  return (
    <>
      {step === 1 ? (
        <Step1 setStep={setStep} setSummary={setSummary} />
      ) : step === 2 ? (
        summary && (
          <Step2 setStep={setStep} setSummary={setSummary} summary={summary} />
        )
      ) : (
        <Success setStep={setStep} />
      )}{" "}
    </>
  );
}
