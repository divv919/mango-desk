const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
// import "./tooltip.css";
import dynamic from "next/dynamic";
import { Dispatch } from "react";
export default function Editor({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <ReactQuill
      className="overflow-y-auto  min-w-full h-[400px] bg-white text-stone-900"
      theme="snow"
      value={value}
      onChange={setValue}
    />
  );
}
