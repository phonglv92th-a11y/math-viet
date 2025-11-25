import React, { useEffect, useState } from 'react';

const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  speed: number;
  delay: number;
}

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // percent
        y: -10 - Math.random() * 20, // percent above screen
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        speed: 3 + Math.random() * 5, // animation duration
        delay: Math.random() * 3
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm opacity-80"
          style={{
            left: `${p.x}%`,
            top: `-20px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            animation: `fall ${p.speed}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { top: -20px; transform: rotate(0deg) translateX(0px); }
          100% { top: 110vh; transform: rotate(720deg) translateX(20px); }
        }
      `}</style>
    </div>
  );
};