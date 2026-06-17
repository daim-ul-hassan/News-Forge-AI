"use client";

import { useEffects } from "./effects-provider";

export function RainOverlay() {
  const { effectsEnabled } = useEffects();

  if (!effectsEnabled) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 motion-reduce:hidden">
      {Array.from({ length: 40 }).map((_, index) => (
        <span
          key={index}
          className="rain-drop absolute h-8 w-px bg-secondary/60"
          style={{
            left: `${(index * 7) % 100}%`,
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}
