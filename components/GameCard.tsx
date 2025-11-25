
import React, { memo } from 'react';
import { GameType, GameMode, GameStats, GameCardStyle } from '../types';
import { Zap, Timer } from 'lucide-react';

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

  return (
    <div 
      onClick={onClick}
      className={`rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer overflow-hidden group relative flex items-center p-4 gap-4 h-full
        ${isSpeedRun ? 'border-2 border-red-400 bg-red-50 ring-2 ring-red-100 ring-offset-1' : 'border border-gray-100'}
        ${customStyle?.id === 'dark' ? 'bg-slate-800' : (isSpeedRun ? '' : 'bg-white')}
      `}
    >
      {/* Speed Run Background Effect */}
      {isSpeedRun && (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500 via-orange-400 to-transparent pointer-events-none"></div>
      )}

      <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 transition-colors z-10 ${bgClass}`}>
        {renderIcon()}
      </div>
      <div className="flex-1 min-w-0 z-10">
         <div className="flex justify-between items-center mb-1">
             <h3 className={`font-bold truncate ${customStyle?.id === 'dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
             {isSpeedRun ? (
                 <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold flex items-center shadow-sm animate-pulse">
                    <Zap className="w-3 h-3 mr-1" /> SPEED
                 </span>
             ) : (
                 stats && stats.highScore > 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">★ {stats.stars}</span>
             )}
         </div>
         <p className={`text-xs line-clamp-2 ${customStyle?.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
         
         {isSpeedRun && (
             <div className="mt-2 text-[10px] text-red-600 font-bold flex items-center">
                 <Timer className="w-3 h-3 mr-1" /> Thời gian gấp • x2 Điểm
             </div>
         )}
      </div>
    </div>
  );
});
