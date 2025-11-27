import React, { memo } from 'react';
import katex from 'katex';
// CSS is loaded via CDN in index.html to avoid build errors

interface MathRendererProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = memo(({ text, className = '', inline = false }) => {
  // Function to parse text and render math parts
  const renderContent = () => {
    // Regex to match LaTeX patterns: 
    // 1. $...$ for inline math
    // 2. $$...$$ for block math
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block math
        const math = part.slice(2, -2);
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          // Force text-gray-900 to ensure visibility
          return <span key={index} className="text-gray-900" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <span key={index}>{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        const math = part.slice(1, -1);
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          // Force text-gray-900
          return <span key={index} className="text-gray-900 font-serif" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <span key={index}>{part}</span>;
        }
      } else {
        // Plain text
        return <span key={index} dangerouslySetInnerHTML={{__html: part.replace(/\n/g, '<br/>')}} />;
      }
    });
  };

  return (
    <div className={`math-renderer ${className} ${inline ? 'inline-block' : 'block'}`}>
      {renderContent()}
    </div>
  );
});