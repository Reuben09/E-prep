"use client";
import { useEffect, useState } from "react";

interface TypewriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export default function Typewriter({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing effect
      if (displayText.length < currentText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Pause before deleting
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      // Deleting effect
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Move to next sentence
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="bg-clip-text text-black bg-gradient-to-r from-brand-primary to-brand-secondary">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
