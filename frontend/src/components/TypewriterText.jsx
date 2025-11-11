import { useEffect, useRef, useState } from "react";

export default function Typewriter({ text, speed = 40 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!text) return;

    setDisplayedText("");
    setIsTyping(true);
    indexRef.current = 0;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "1.2rem",
        whiteSpace: "pre-wrap",
      }}
    >
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
}
