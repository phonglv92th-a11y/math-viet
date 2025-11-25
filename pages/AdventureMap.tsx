
import React, { useEffect, useRef, useState } from 'react';
import { AdventureLevel, AppRoute, World } from '../types';
import { ArrowLeft, Lock, Star, CheckCircle, Play } from 'lucide-react';

interface AdventureMapProps {
  levels: AdventureLevel[];
  worlds: World[];
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({ levels, worlds, onNavigate }) => {
  const [selectedWorldId, setSelectedWorldId] = useState(worlds[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter levels for the selected world
  const currentLevels = levels.filter(l => l.worldId === selectedWorldId);
  const currentWorld = worlds.find(w => w.id === selectedWorldId) || worlds[0];

  useEffect(() => {
     // Scroll logic can be re-added here if needed for specific levels
  }, [selectedWorldId]);

  const handleLevelClick = (level: AdventureLevel) => {
    if (level.status === 'LOCKED') return;
    onNavigate(AppRoute.GAME_PLAY, {
      type: level.type,
      difficulty: level.difficulty, 
      levelId: level.id
    });
  };

  return (
    <div className={`min-h-screen bg-slate-50 relative overflow-hidden transition-colors duration-500 bg-gradient-to-b ${currentWorld.bgGradient}`}>
      
      {/* Decorative Background Elements based on World */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
        <div className="absolute top-10 left-10 text-9xl animate-pulse">{currentWorld.icon}</div>
        <div className="absolute bottom-20 right-10 text-9xl animate-bounce">{currentWorld.icon}</div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8 pb-32">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 sticky top-4 z-50">
           <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
             <button 
                onClick={() => onNavigate(AppRoute.DASHBOARD)}
                className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-white text-gray-700 transition-all mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-extrabold text-slate-800 drop-shadow-sm">Hành Trình Tri Thức</h1>
           </div>

           {/* World Selector Tabs */}
           <div className="flex bg-white/40 backdrop-blur-md p-1 rounded-2xl overflow-x-auto max-w-full">
              {worlds.map(world => (
                 <button
                    key={world.id}
                    onClick={() => setSelectedWorldId(world.id)}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                       selectedWorldId === world.id 
                       ? 'bg-white shadow-md text-gray-800 scale-105' 
                       : 'text-gray-600 hover:bg-white/50'
                    }`}
                 >
                    <span className="mr-2 text-lg">{world.icon}</span>
                    {world.name}
                 </button>
              ))}
           </div>
        </div>

        {/* World Description */}
        <div className="text-center mb-12 animate-in fade-in duration-500">
           <h2 className="text-3xl font-extrabold text-gray-800 mb-2">{currentWorld.name}</h2>
           <p className="text-gray-600 font-medium max-w-md mx-auto bg-white/30 py-1 px-4 rounded-full backdrop-blur-sm">
              {currentWorld.description}
           </p>
        </div>

        {/* Map Path */}
        <div className="flex flex-col items-center space-y-12 relative mt-12 min-h-[500px]">
          {/* Connecting Line */}
          <div className="absolute top-0 bottom-0 w-2 bg-white/40 rounded-full z-0 border-r-2 border-dashed border-gray-400/30"></div>

          {currentLevels.map((level, index) => {
            const isLocked = level.status === 'LOCKED';
            const isCompleted = level.status === 'COMPLETED';
            const isUnlocked = level.status === 'UNLOCKED';
            const alignClass = index % 2 === 0 ? 'md:translate-x-16' : 'md:-translate-x-16';

            return (
              <div 
                id={`level-${level.id}`}
                key={level.id}
                onClick={() => handleLevelClick(level)}
                className={`relative z-10 w-64 md:w-72 transition-all duration-300 transform ${alignClass} 
                  ${!isLocked ? 'cursor-pointer' : 'opacity-70 pointer-events-none'}
                  ${isUnlocked ? 'hover:scale-105 z-20' : ''}
                `}
              >
                <div className={`
                  relative rounded-3xl p-1 border-b-8 transition-all duration-300 shadow-xl overflow-hidden
                  ${isCompleted ? 'bg-green-500 border-green-700' : 
                    isUnlocked ? `bg-${currentWorld.themeColor}-400 border-${currentWorld.themeColor}-600 animate-[pulse-glow_2s_infinite]` : 
                    'bg-slate-300 border-slate-400 grayscale'}
                `}>
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center text-center h-full relative z-10">
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                       {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                       {isCompleted && <CheckCircle className="w-6 h-6 text-green-500 fill-green-100" />}
                    </div>

                    <div className="text-4xl mb-2">{level.icon}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Cấp độ {level.id}</div>
                    <h3 className="font-bold text-lg leading-tight mb-1 text-gray-800">{level.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{level.description}</p>
                    
                    <div className="flex space-x-1 mb-2">
                      {[1, 2, 3].map(i => (
                        <Star key={i} className={`w-3 h-3 ${isLocked ? 'text-gray-300' : 'text-yellow-400 fill-current'}`} />
                      ))}
                    </div>

                    {!isLocked && (
                      <div className={`mt-2 px-6 py-2 rounded-full text-xs font-bold text-white flex items-center shadow-md
                        ${isCompleted ? 'bg-green-500' : `bg-${currentWorld.themeColor}-500`}
                      `}>
                         {isCompleted ? 'Chơi lại' : 'Bắt đầu'} <Play className="w-3 h-3 ml-1 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
