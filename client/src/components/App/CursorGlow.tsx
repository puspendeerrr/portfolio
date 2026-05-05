import { useEffect, useRef } from "react";

/**
 * CursorGlow — follows the mouse and casts a radial gradient spotlight
 * wherever the cursor is on the page.
 */
export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
      glowRef.current.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      if (!glowRef.current) return;
      glowRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9999,
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle at center, rgba(124, 58, 237, 0.12) 0%, rgba(236, 72, 153, 0.05) 40%, transparent 70%)",
        opacity: 0,
        transition: "opacity 0.4s ease",
        mixBlendMode: "screen",
      }}
    />
  );
};
