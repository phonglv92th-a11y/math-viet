
import React, { useState } from 'react';
import { AppRoute } from '../types';
import { HelpCircle, ChevronRight, GraduationCap, Star, BookOpen, Calculator, Rocket, Atom, Brain, Sparkles, Shapes, Ruler, Edit3, X, Smile, Map, Languages } from 'lucide-react';

interface HomeProps {
  onNavigate: (route: AppRoute) => void;
  onStart: (name: string, grade: number) => void;
  onOpenHelp: () => void;
}

// Configuration for Grade Cards
const GRADE_LEVELS = [
  // Primary
  { grade: 1, title: 'Lớp 1', icon: '🌱', desc: 'Làm quen số học', color: 'from-green-400 to-emerald-500', shadow: 'shadow-green-200', text: 'text-green-600' },
  { grade: 2, title: 'Lớp 2', icon: '🐥', desc: 'Cộng trừ cơ bản', color: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-200', text: 'text-yellow-600' },
  { grade: 3, title: 'Lớp 3', icon: '🚀', desc: 'Nhân chia & Hình học', color: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-200', text: 'text-blue-600' },
  { grade: 4, title: 'Lớp 4', icon: '⭐', desc: 'Phân số & Số lớn', color: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-200', text: 'text-indigo-600' },
  { grade: 5, title: 'Lớp 5', icon: '🏆', desc: 'Hỗn số & Tỉ số', color: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-200', text: 'text-rose-600' },
  // Secondary
  { grade: 6, title: 'Lớp 6', icon: '📐', desc: 'Số nguyên & Hình học', color: 'from-teal-500 to-emerald-600', shadow: 'shadow-teal-200', text: 'text-teal-700' },
  { grade: 7, title: 'Lớp 7', icon: '⚡', desc: 'Đại số & Hàm số', color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-200', text: 'text-orange-700' },
  { grade: 8, title: 'Lớp 8', icon: '🧬', desc: 'Hóa học & Đa thức', color: 'from-violet-500 to-fuchsia-600', shadow: 'shadow-violet-200', text: 'text-violet-700' },
  { grade: 9, title: 'Lớp 9', icon: '🎓', desc: 'Luyện thi vào 10', color: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-300', text: 'text-slate-700' },
];

export const Home: React.FC<HomeProps> = ({ onNavigate, onStart, onOpenHelp }) => {
  const [name, setName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const handleStart = () => {
    if (name.trim() && selectedGrade) {
      onStart(name, selectedGrade);
      onNavigate(AppRoute.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Hero Section */}
      <header className="bg-white pt-6 pb-16 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold mb-4 border border-blue-100 animate-pulse">
              ✨ Nền tảng học tập Gamification số 1
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Học Toán, Văn & Anh <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Thật Vui!</span> 🇻🇳
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto md:mx-0">
              Khám phá thế giới tri thức qua các trò chơi tương tác, rèn luyện tư duy logic và chinh phục các thử thách thú vị dành cho học sinh lớp 1-9.
            </p>
            
            {/* Added relative z-30 to ensure input is above any background decorations */}
            <div className="relative z-30 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto md:mx-0 flex">
               <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="w-full flex-1 px-4 py-3 rounded-xl outline-none text-gray-700 font-bold placeholder-gray-400 bg-transparent"
               />
            </div>
            {name && !selectedGrade && (
               <p className="text-sm text-blue-500 mt-2 font-bold animate-bounce">👇 Chọn lớp bên dưới để bắt đầu!</p>
            )}
          </div>

          <div className="md:w-1/2 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"></div>
             <div className="relative z-10 grid grid-cols-2 gap-4 max-w-sm mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white p-4 rounded-2xl shadow-lg border-b-4 border-blue-100 flex flex-col items-center">
                   <div className="bg-blue-100 p-3 rounded-full mb-2"><Calculator className="text-blue-500" /></div>
                   <span className="font-bold text-gray-700">Toán Học</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg border-b-4 border-rose-100 flex flex-col items-center mt-8">
                   <div className="bg-rose-100 p-3 rounded-full mb-2"><BookOpen className="text-rose-500" /></div>
                   <span className="font-bold text-gray-700">Tiếng Việt</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg border-b-4 border-indigo-100 flex flex-col items-center -mt-8">
                   <div className="bg-indigo-100 p-3 rounded-full mb-2"><Languages className="text-indigo-500" /></div>
                   <span className="font-bold text-gray-700">Tiếng Anh</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg border-b-4 border-green-100 flex flex-col items-center">
                   <div className="bg-green-100 p-3 rounded-full mb-2"><Smile className="text-green-500" /></div>
                   <span className="font-bold text-gray-700">Vui Nhộn</span>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Grade Selection */}
      <main className="flex-1 px-4 py-12 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8 flex items-center justify-center">
          <GraduationCap className="w-8 h-8 mr-2 text-primary" />
          Chọn Lớp Của Bạn
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
           {GRADE_LEVELS.map((level) => (
             <button
                key={level.grade}
                onClick={() => setSelectedGrade(level.grade)}
                className={`relative group rounded-2xl p-4 transition-all duration-300 border-2 flex flex-col items-center text-center
                  ${selectedGrade === level.grade 
                    ? `bg-white border-${level.color.split('-')[1]} ring-4 ring-${level.color.split('-')[1]}/20 transform scale-105 z-10 shadow-xl` 
                    : 'bg-white border-transparent hover:border-gray-200 hover:shadow-lg hover:-translate-y-1'
                  }
                `}
             >
                <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center text-3xl shadow-sm bg-gradient-to-br ${level.color} text-white`}>
                   {level.icon}
                </div>
                <h3 className={`text-lg font-bold mb-1 ${level.text}`}>{level.title}</h3>
                <p className="text-xs text-gray-400 font-medium">{level.desc}</p>
                
                {selectedGrade === level.grade && (
                   <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   </div>
                )}
             </button>
           ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
           <button
              onClick={handleStart}
              disabled={!name.trim() || !selectedGrade}
              className={`text-xl font-bold py-4 px-12 rounded-full shadow-xl transition-all transform
                 ${(!name.trim() || !selectedGrade)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 hover:shadow-2xl hover:shadow-blue-200'
                 }
              `}
           >
              Bắt Đầu Hành Trình 🚀
           </button>
        </div>
      </main>

      {/* Footer & Sitemap Link */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
         <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-gray-500 space-y-2">
            <div className="flex flex-col md:flex-row items-center justify-between w-full">
               <div className="flex items-center mb-4 md:mb-0">
                  <span className="font-bold text-gray-700 mr-2">MathViet</span> 
                  © 2024. Nền tảng học tập thông minh.
               </div>
               
               <div className="flex items-center space-x-6">
                  <button onClick={onOpenHelp} className="hover:text-primary transition-colors">Hướng dẫn</button>
                  <button onClick={() => onNavigate(AppRoute.SITEMAP)} className="flex items-center hover:text-primary transition-colors font-bold text-gray-600">
                     <Map className="w-4 h-4 mr-1" /> Sitemap & Features
                  </button>
               </div>
            </div>
            <div className="text-xs text-gray-400 font-mono pt-4 border-t w-full text-center">
               Owner of this website all information signature is phonglam.1992
            </div>
         </div>
      </footer>
    </div>
  );
};
