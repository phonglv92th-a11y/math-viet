import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div 
        className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-max max-w-[200px] hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-50 shadow-xl transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none text-center leading-relaxed`}
      >
        {content}
        {/* Triangle Arrow */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent ${position === 'top' ? 'top-full border-t-gray-900' : 'bottom-full border-b-gray-900'}`}
        ></div>
      </div>
    </div>
  );
};