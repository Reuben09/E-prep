
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-brand-surface/70 backdrop-blur-lg border border-brand-border rounded-xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
