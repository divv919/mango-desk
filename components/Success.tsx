import { Dispatch } from "react";

export default function Success({
  setStep,
}: {
  setStep: Dispatch<React.SetStateAction<1 | 2 | 3>>;
}) {
  return <div>Summary sent to emails successfully Summarize more</div>;
}
