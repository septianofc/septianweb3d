import React, { useRef, useState } from 'react';

interface Box3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  liftZ?: number;
  onClick?: () => void;
}

export const Box3D: React.FC<Box3DProps> = ({
  children,
  className = '',
  intensity = 10,
  liftZ = 10,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [styleTransform, setStyleTransform] = useState(
    'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  );
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * intensity;
    const ry = (px - 0.5) * intensity;
    setStyleTransform(
      `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(${liftZ}px)`
    );
    setGlare({ x: px * 100, y: py * 100, opacity: 0.14 });
  };

  const handleLeave = () => {
    setStyleTransform(
      'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    );
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={onClick}
      style={{ transform: styleTransform }}
      className={`card-3d ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(66, 165, 245, 0.45), transparent 62%)`,
        }}
      />
      {children}
    </div>
  );
};
