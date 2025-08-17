import { MailCheck } from "lucide-react";
import { Dispatch } from "react";

export default function Success({
  setStep,
  setIsLoading,
}: {
  setStep: Dispatch<React.SetStateAction<1 | 2 | 3>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <div>
        <MailCheck />
      </div>
      Summary sent to emails successfully{" "}
      <span
        onClick={() => {
          setIsLoading(true);
          setStep(1);
          setIsLoading(false);
        }}
        className="underline underline-offset-2 cursor-pointer hover:text-blue-500"
      >
        Summarize more
      </span>
    </div>
  );
}
