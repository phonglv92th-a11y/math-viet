
import React from 'react';
import { UserProfile, GameType } from '../types';
import { Target } from 'lucide-react';

interface DailyMissionsProps {
  user: UserProfile;
}

const DailyMissions: React.FC<DailyMissionsProps> = ({ user }) => {
  // Determine missions dynamically based on user progress
  const mentalMathPlayed = user.progress[GameType.MENTAL_MATH]?.gamesPlayed || 0;
  const wordSearchPlayed = user.progress[GameType.WORD_SEARCH]?.gamesPlayed || 0;
  
  // Define dynamic missions
  const missions = [
    { 
      id: 1, 
      text: "Hoàn thành 3 bài Tính Nhẩm", 
      progress: mentalMathPlayed, 
      total: 3, 
      done: mentalMathPlayed >= 3 
    },
    { 
      id: 2, 
      text: "Chơi 1 ván Truy Tìm Từ Vựng", 
      progress: wordSearchPlayed, 
      total: 1, 
      done: wordSearchPlayed >= 1 
    },
    { 
      id: 3, 
      text: "Đạt Streak 3 ngày", 
      progress: user.streak, 
      total: 3, 
      done: user.streak >= 3 
    },
    {
       id: 4,
       text: "Đạt 1000 điểm tổng",
       progress: user.points,
       total: 1000,
       done: user.points >= 1000
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-red-500" /> Nhiệm vụ ngày
        </h3>
        <div className="space-y-4">
        {missions.map(m => (
            <div key={m.id} className="relative">
                <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${m.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{m.text}</span>
                    <span className="text-gray-500 text-xs">
                       {m.id === 4 ? `${Math.min(m.progress, m.total)}` : `${Math.min(m.progress, m.total)}/${m.total}`}
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${m.done ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${Math.min((m.progress/m.total)*100, 100)}%`}}></div>
                </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default DailyMissions;
