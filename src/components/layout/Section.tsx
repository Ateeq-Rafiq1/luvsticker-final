
import React from 'react';

type SectionVariant = 'white' | 'gray' | 'orange' | 'blue';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: SectionVariant;
  containerClass?: string;
}

const getBackgroundColor = (variant: SectionVariant) => {
  switch (variant) {
    case 'white':
      return 'bg-white';
    case 'gray':
      return 'bg-gray-100';
    case 'orange':
      return 'bg-istickers-orange text-white';
    case 'blue':
      return 'bg-istickers-blue text-white';
    default:
      return 'bg-white';
  }
};

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  variant = 'white',
  containerClass = '',
}) => {
  const bgColorClass = getBackgroundColor(variant);
  
  return (
    <section className={`py-16 md:py-24 ${bgColorClass} ${className}`}>
      <div className={`container mx-auto px-4 ${containerClass}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
