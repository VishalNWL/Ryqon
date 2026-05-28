"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Option } from "@prisma/client";

interface MCQOptionsProps {
  options: Option[];
}

type AnswerState = "unanswered" | "correct" | "wrong";

export default function MCQOptions({ options }: MCQOptionsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");

  const handleSelect = (option: Option) => {
    // Don't allow re-answering
    if (answerState !== "unanswered") return;

    setSelectedId(option.id);
    setAnswerState(option.isCorrect ? "correct" : "wrong");
  };

  const getOptionStyle = (option: Option) => {
    // Not answered yet
    if (answerState === "unanswered") {
      return "border-border hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer";
    }

    // This is the correct answer — always highlight green
    if (option.isCorrect) {
      return "border-emerald-500 bg-emerald-50 text-emerald-900 cursor-default";
    }

    // This is the one user selected but it's wrong
    if (option.id === selectedId && !option.isCorrect) {
      return "border-rose-500 bg-rose-50 text-rose-900 cursor-default";
    }

    // Other unselected wrong options — dim them
    return "border-border opacity-50 cursor-default";
  };

  const getLabelStyle = (option: Option) => {
    if (answerState === "unanswered") {
      return "bg-secondary text-secondary-foreground";
    }
    if (option.isCorrect) {
      return "bg-emerald-500 text-white";
    }
    if (option.id === selectedId && !option.isCorrect) {
      return "bg-rose-500 text-white";
    }
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelect(option)}
          disabled={answerState !== "unanswered"}
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
            getOptionStyle(option)
          )}
        >
          {/* Label A/B/C/D */}
          <span
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
              getLabelStyle(option)
            )}
          >
            {option.label}
          </span>

          {/* Option text */}
          <span className="flex-1 text-sm font-medium">{option.text}</span>

          {/* Result icon */}
          {answerState !== "unanswered" && option.isCorrect && (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          {answerState !== "unanswered" &&
            option.id === selectedId &&
            !option.isCorrect && (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
        </button>
      ))}

      {/* Result message */}
      {answerState === "correct" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Correct! Well done.
        </div>
      )}
      {answerState === "wrong" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          <XCircle className="w-4 h-4 shrink-0" />
          Incorrect. The correct answer is highlighted in green.
        </div>
      )}
    </div>
  );
}