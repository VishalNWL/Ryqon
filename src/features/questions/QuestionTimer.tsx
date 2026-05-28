"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export default function QuestionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-mono font-medium">
      <Timer className="w-3.5 h-3.5 text-muted-foreground" />
      <span>{formatTime(seconds)}</span>
    </div>
  );
}