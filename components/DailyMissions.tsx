
import React from 'react';
import { UserProfile, GameType } from '../types';
import { Target, CheckCircle2, Circle } from 'lucide-react';

interface DailyMissionsProps {
  user: UserProfile;
}

const DailyMissions: React.FC<DailyMissionsProps> = ({ user }) => {
  const mentalMathPlayed = user.progress[GameType.MENTAL_MATH]?.gamesPlayed || 0;
  const wordSearchPlayed = user.progress[GameType.WORD_SEARCH]?.gamesPlayed || 0;
  
  const missions = [
    { 
      id: 1, 
      text: "3 bài Tính Nhẩm", 
      progress: mentalMathPlayed, 
      total: 3, 
      done: mentalMathPlayed >= 3,
      color: 'blue'
    },
    { 
      id: 2, 
      text: "1 ván Tìm Từ", 
      progress: wordSearchPlayed, 
      total: 1, 
      done: wordSearchPlayed >= 1,
      color: 'purple'
    },
    { 
      id: 3, 
      text: "Streak 3 ngày", 
      progress: user.streak, 
      total: 3, 
      done: user.streak >= 3,
      color: 'orange'
    },
    {
       id: 4,
       text: "Đạt 1000 điểm",
       progress: user.points,
       total: 1000,
       done: user.points >= 1000,
       color: 'emerald'
    }
  ];

  const completedCount = missions.filter(m => m.done).length;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 border border-gray-100 overflow-hidden relative group">
        {/* Background glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
        
        <div className="flex justify-between items-center mb-5">
           <h3 className="font-extrabold text-gray-800 text-sm flex items-center">
             <Target className="w-5 h-5 mr-2 text-red-500" /> Nhiệm vụ ngày
           </h3>
           <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
             {completedCount}/{missions.length} Xong
           </span>
        </div>

        <div className="space-y-4">
        {missions.map(m => (
            <div key={m.id} className="relative group/item">
                <div className="flex items-center gap-3 mb-1.5">
                   <div className={`shrink-0 transition-all ${m.done ? 'text-green-500 scale-110' : 'text-gray-300'}`}>
                      {m.done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                   </div>
                   <div className="flex-1 flex justify-between items-center min-w-0">
                       <span className={`text-xs font-bold truncate ${m.done ? 'text-gray-400 line-through decoration-2' : 'text-slate-700'}`}>{m.text}</span>
                       <span className={`text-[10px] font-black tabular-nums ${m.done ? 'text-green-600' : 'text-slate-400'}`}>
                          {m.id === 4 ? `${Math.min(m.progress, m.total)}` : `${Math.min(m.progress, m.total)}/${m.total}`}
                       </span>
                   </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${m.done ? 'bg-green-500' : `bg-${m.color}-500 shadow-[0_0_8px_rgba(var(--tw-shadow-color),0.5)] shadow-${m.color}-200`}`} 
                      style={{width: `${Math.min((m.progress/m.total)*100, 100)}%`}}
                    ></div>
                </div>
            </div>
        ))}
        </div>
        
        {completedCount === missions.length && (
           <div className="mt-5 p-3 bg-green-50 border border-green-100 rounded-2xl text-center animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Nhiệm vụ hoàn tất! 🎉</p>
           </div>
        )}
    </div>
  );
};

export default DailyMissions;
