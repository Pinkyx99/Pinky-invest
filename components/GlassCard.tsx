import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
