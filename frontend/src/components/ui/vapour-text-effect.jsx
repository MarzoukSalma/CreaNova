// src/components/ui/vapour-text-effect.jsx
import React, { useEffect, useRef } from "react";

export const Component = ({ text = "CRÉATIVITÉ STUDIO" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const particles = [];
    const particleCount = 150;
    const mouse = { x: 0, y: 0 };

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1.5 - 0.75,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    function animate() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw text
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.font = "bold 50px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.offsetWidth / 2, canvas.offsetHeight / 2);

      // Animate particles
      particles.forEach((particle) => {
        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          particle.x -= (dx / distance) * 1.5;
          particle.y -= (dy / distance) * 1.5;
        }

        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;

        // Draw particle - monochrome white/gray
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [text]);

  return (
    <div className="relative w-full h-64">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
