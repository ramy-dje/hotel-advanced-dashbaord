"use client";
import { cn } from "@/lib/utils";
import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";

// The text editor
interface Props {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  modules?: Record<any, any>;
  content: string;
  heading?: boolean;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function TextEditor({
  className,
  placeholder,
  modules: customModules,
  content,
  disabled,
  heading = false,
  setContent,
}: Props) {
  // editor ref
  const quill = useRef<any>(null);

  // config
  const modules = useMemo(
    () =>
      customModules
        ? customModules
        : {
            toolbar: {
              container: [
                [
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "code-block",
                  { list: "ordered" },
                  { list: "bullet" },
                  { script: "sub" },
                  { script: "super" },
                  { indent: "-1" },
                  { indent: "+1" },
                  { font: [] },
                  { align: [] },
                  "link",
                  "clean",
                  ...(heading ? [{ header: [2, 3, 4, 5, false] }] : []),
                ],
                // [{ size: ["small", false, "large", "huge"] }],
              ],
            },
            clipboard: {
              matchVisual: true,
            },
          },
    []
  );

  return (
    <div className={cn("w-full h-full", className)}>
      <ReactQuill
        modules={modules}
        ref={quill}
        theme="snow"
        readOnly={disabled}
        className={cn(
          "w-full h-full",
          disabled && "pointer-events-none cursor-auto opacity-50"
        )}
        placeholder={placeholder}
        value={content}
        onChange={setContent}
      />
    </div>
  );
}
