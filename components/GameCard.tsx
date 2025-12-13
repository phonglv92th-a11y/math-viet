
import React, { memo, useEffect, useState, useRef } from 'react';
import { GameType, GameMode, GameStats, GameCardStyle } from '../types';
import { Zap, Timer } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface GameCardProps {
  title: string;
  description: string;
  icon: any;
  color: string;
  type: GameType;
  mode: GameMode;
  stats?: GameStats;
  customStyle?: GameCardStyle;
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = memo(({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  mode,
  stats,
  customStyle,
  onClick 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [scoreDiff, setScoreDiff] = useState(0);
  const prevScoreRef = useRef(stats?.highScore || 0);

  useEffect(() => {
    const currentHigh = stats?.highScore || 0;
    const prevHigh = prevScoreRef.current;
    
    // Trigger animation only if the high score has increased
    if (currentHigh > prevHigh) {
      setScoreDiff(currentHigh - prevHigh);
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 2000);
      
      prevScoreRef.current = currentHigh;
      return () => clearTimeout(timer);
    } else {
      // Sync ref if updated without increase (e.g. data load)
      prevScoreRef.current = currentHigh;
    }
  }, [stats?.highScore]);

  const bgClass = customStyle ? customStyle.gradient : `bg-${color}-100 group-hover:bg-${color}-200`;
  const textClass = customStyle ? customStyle.text : `text-${color}-600`;
  const iconStyle = customStyle ? customStyle.iconStyle : 'SIMPLE';

  const renderIcon = () => {
    const iconBase = <Icon className={`w-10 h-10 ${textClass} transition-transform group-hover:scale-110 duration-300`} />;
    switch (iconStyle) {
      case 'BUBBLE': return <div className="bg-white p-2.5 rounded-full shadow-md transform group-hover:-translate-y-1 transition-transform">{iconBase}</div>;
      case 'GLASS': return <div className="bg-white/30 backdrop-blur-md border border-white/50 p-2.5 rounded-2xl shadow-sm">{iconBase}</div>;
      case 'NEON': return <div className="relative"><div className={`absolute inset-0 blur-lg opacity-50 ${textClass.replace('text', 'bg')}`}></div><div className="relative z-10">{iconBase}</div></div>;
      default: return iconBase;
    }
  };

  const isSpeedRun = mode === GameMode.SPEED_RUN;
  
  // Logic for Special Styles
  const isCute = customStyle?.id === 'cute-logic';
  const borderRadiusClass = isCute ? 'rounded-[2.5rem]' : 'rounded-xl';

  const containerClasses = isCute 
    ? `${borderRadiusClass} border-b-8 border-r-4 border-purple-200 bg-white hover:bg-purple-50 shadow-md transform active:scale-95`
    : `${borderRadiusClass} shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] ${isSpeedRun ? 'border-2 border-red-400 bg-red-50 ring-2 ring-red-100 ring-offset-1' : 'border border-gray-100'} ${customStyle?.id === 'dark' ? 'bg-slate-800' : (isSpeedRun ? '' : 'bg-white')}`;

  return (
    <div 
      onClick={onClick}
      className={`${containerClasses} transition-all duration-300 cursor-pointer group relative flex items-center p-4 gap-4 h-full
        ${isUpdating ? 'ring-2 ring-yellow-400 scale-[1.02] shadow-lg' : ''}
      `}
    >
      {/* Update Flash Effect */}
      {isUpdating && (
        <div className={`absolute inset-0 bg-yellow-400/10 animate-pulse pointer-events-none z-0 ${borderRadiusClass}`}></div>
      )}

      {/* Speed Run Background Effect */}
      {isSpeedRun && (
          <div className={`absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500 via-orange-400 to-transparent pointer-events-none ${borderRadiusClass}`}></div>
      )}

      <Tooltip content="Nhấn để chơi ngay!" position="bottom">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 z-10 ${bgClass} ${isUpdating ? 'scale-110 rotate-3' : ''}`}>
          {renderIcon()}
        </div>
      </Tooltip>

      <div className="flex-1 min-w-0 z-10 relative">
         <div className="flex justify-between items-start mb-1">
             {/* IMPROVED CONTRAST: Use slate-800/white instead of colored text for title */}
             <h3 className={`font-bold leading-tight transition-colors duration-300 ${customStyle?.id === 'dark' ? 'text-white' : 'text-slate-800'} ${isUpdating ? 'text-yellow-600' : ''}`}>
               {title}
             </h3>
             {isSpeedRun ? (
                 <Tooltip content="Chế độ Tốc độ: X2 điểm thưởng!" position="top">
                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold flex items-center shadow-sm animate-pulse ml-2 shrink-0">
                        <Zap className="w-3 h-3 mr-1" /> SPEED
                    </span>
                 </Tooltip>
             ) : (
                 stats && stats.highScore > 0 && (
                   <Tooltip content={`Độ thông thạo: ${stats.stars}/3 sao`} position="top">
                       <span className={`text-xs px-1.5 py-0.5 rounded font-bold transition-all duration-300 ml-2 shrink-0 ${isUpdating ? 'bg-yellow-400 text-white scale-110 shadow-sm' : 'bg-yellow-100 text-yellow-800'}`}>
                         ★ {stats.stars}
                       </span>
                   </Tooltip>
                 )
             )}
         </div>
         
         <p className={`text-xs line-clamp-2 transition-opacity duration-300 ${customStyle?.id === 'dark' ? 'text-gray-400' : 'text-slate-500'} ${isUpdating ? 'opacity-0' : 'opacity-100'}`}>
           {description}
         </p>
         
         {/* Animated Score Update Notification */}
         <div className={`absolute top-6 left-0 right-0 flex items-center transition-all duration-500 ${isUpdating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full shadow-sm border border-green-100">
               ↗ Kỷ lục mới: +{scoreDiff}
            </span>
         </div>

         {isSpeedRun && !isUpdating && (
             <div className="mt-2 text-[10px] text-red-600 font-bold flex items-center">
                 <Timer className="w-3 h-3 mr-1" /> Thời gian gấp • x2 Điểm
             </div>
         )}
      </div>
    </div>
  );
});
