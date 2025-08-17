"use client";

import { useEffect, useState } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Success from "../components/Success";
import { MutatingDots } from "react-loader-spinner";

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [summary, setSummary] = useState(``);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen py-[40px] px-[20px] md:px-[40px] xl:px-[0px] relative">
      {isLoading && (
        <div className="absolute w-full h-full bg-black/40 flex items-center justify-center">
          <div className="size-fit ">
            <MutatingDots color="#44403b" secondaryColor="#79716b" />
          </div>
        </div>
      )}
      {step === 1 ? (
        <Step1
          setStep={setStep}
          setSummary={setSummary}
          setIsLoading={setIsLoading}
        />
      ) : step === 2 ? (
        summary && (
          <Step2
            setStep={setStep}
            setSummary={setSummary}
            summary={summary}
            setIsLoading={setIsLoading}
          />
        )
      ) : (
        <Success setStep={setStep} setIsLoading={setIsLoading} />
      )}{" "}
    </div>
  );
}
