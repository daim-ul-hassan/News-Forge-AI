"use client";

import { useEffects } from "./effects-provider";

export function ParticleField() {
  const { effectsEnabled } = useEffects();

  if (!effectsEnabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 motion-reduce:hidden"
    >
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-primary"
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${(index * 23) % 100}%`,
            animation: `pulse 3s ease-in-out ${index * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
