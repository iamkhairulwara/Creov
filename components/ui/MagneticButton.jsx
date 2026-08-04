"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  magneticStrength = 0.2, // 0 to 1, higher = stronger pull
  as = "button",
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = as === "link" ? Link : motion.button;
  const commonProps = {
    ref: ref,
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    className: `relative inline-flex items-center justify-center transition-shadow duration-300 ${className}`,
  };

  if (as === "link") {
    return (
      <Link href={href || "#"} passHref legacyBehavior>
        <motion.a
          {...commonProps}
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
          onClick={onClick}
        >
          {children}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button
      {...commonProps}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
