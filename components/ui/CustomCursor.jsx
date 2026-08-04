"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Hide until first move

  useEffect(() => {
    // Determine if we are on a touch device
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return; // Disable custom cursor on mobile
    }

    setIsHidden(false);

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering over a clickable element
      if (
        e.target.closest("button") ||
        e.target.closest("a") ||
        e.target.closest("[data-cursor='hover']") ||
        e.target.closest("input") ||
        e.target.closest("textarea")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);
    
    // Cleanup
    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (isHidden) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      animate={{
        x: position.x - (isHovering ? 16 : 6),
        y: position.y - (isHovering ? 16 : 6),
      }}
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 35,
        mass: 0.5,
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? 32 : 12,
          height: isHovering ? 32 : 12,
          backgroundColor: isHovering ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 1)",
          scale: isHovering ? 1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className="rounded-full flex items-center justify-center shadow-lg"
      />
    </motion.div>
  );
}
