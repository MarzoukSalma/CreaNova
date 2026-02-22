// src/components/ui/glowing-effect.jsx
import React, { useState, useRef, useEffect } from "react";

export const GlowingEffect = ({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
  borderWidth = 3,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      {/* Glowing gradient effect */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: glow && isVisible ? 1 : 0,
            background: `radial-gradient(${spread}px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.15), transparent 80%)`,
          }}
        />
      </div>

      {/* Glowing border effect */}
      {borderWidth > 0 && (
        <div
          className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 500ms",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(${proximity}px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.4), transparent ${inactiveZone * 100}%)`,
              mask: `radial-gradient(farthest-side at ${position.x}px ${position.y}px, transparent calc(100% - ${borderWidth}px), black calc(100% - ${borderWidth}px))`,
              WebkitMask: `radial-gradient(farthest-side at ${position.x}px ${position.y}px, transparent calc(100% - ${borderWidth}px), black calc(100% - ${borderWidth}px))`,
            }}
          />
        </div>
      )}
    </>
  );
};
