
import React, { useState, useEffect } from 'react';
import { AppRoute, BgTheme } from '../types';
import { 
  HelpCircle, GraduationCap, BookOpen, Calculator, Languages, 
  Map, User, LogIn, School, Book, ChevronRight, Sparkles, 
  MessageCircle, Shapes, Heart, Info, Globe, Palette, Lock, UserPlus,
  Cloud // Added Cloud icon
} from 'lucide-react';

interface HomeProps {
  onNavigate: (route: AppRoute) => void;
  onStartGuest: (name: string, grade: number) => void;
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string, fullName: string, grade: number) => void;
  onOpenHelp: () => void;
  onOpenDonation: () => void;
  bgTheme: BgTheme; // Add prop
  onThemeChange: (theme: BgTheme) => void; // Add prop
}

// Configuration for Grade Cards
const GRADE_LEVELS = [
  // Primary
  { grade: 1, title: 'Lớp 1', icon: '🌱', desc: 'Làm quen số học', color: 'from-green-400 to-emerald-500', text: 'text-green-600', bg: 'bg-green-50' },
  { grade: 2, title: 'Lớp 2', icon: '🐥', desc: 'Cộng trừ cơ bản', color: 'from-yellow-400 to-orange-500', text: 'text-yellow-600', bg: 'bg-yellow-50' },
  { grade: 3, title: 'Lớp 3', icon: '🚀', desc: 'Nhân chia & Hình', color: 'from-blue-400 to-cyan-500', text: 'text-blue-600', bg: 'bg-blue-50' },
  { grade: 4, title: 'Lớp 4', icon: '⭐', desc: 'Phân số & Số lớn', color: 'from-indigo-400 to-purple-500', text: 'text-indigo-600', bg: 'bg-indigo-50' },
  { grade: 5, title: 'Lớp 5', icon: '🏆', desc: 'Hỗn số & Tỉ số', color: 'from-rose-400 to-pink-500', text: 'text-rose-600', bg: 'bg-rose-50' },
  // Secondary
  { grade: 6, title: 'Lớp 6', icon: '📐', desc: 'Số nguyên & Hình', color: 'from-teal-500 to-emerald-600', text: 'text-teal-700', bg: 'bg-teal-50' },
  { grade: 7, title: 'Lớp 7', icon: '⚡', desc: 'Đại số & Hàm số', color: 'from-orange-500 to-red-600', text: 'text-orange-700', bg: 'bg-orange-50' },
  { grade: 8, title: 'Lớp 8', icon: '🧬', desc: 'Hóa học & Đa thức', color: 'from-violet-500 to-fuchsia-600', text: 'text-violet-700', bg: 'bg-violet-50' },
  { grade: 9, title: 'Lớp 9', icon: '🎓', desc: 'Luyện thi vào 10', color: 'from-slate-600 to-slate-800', text: 'text-slate-700', bg: 'bg-slate-50' },
  // High School
  { grade: 10, title: 'Lớp 10', icon: '🌌', desc: 'Vectơ & Tập hợp', color: 'from-cyan-600 to-blue-700', text: 'text-cyan-800', bg: 'bg-cyan-50' },
  { grade: 11, title: 'Lớp 11', icon: '📊', desc: 'Lượng giác & Tổ hợp', color: 'from-fuchsia-600 to-purple-800', text: 'text-fuchsia-800', bg: 'bg-fuchsia-50' },
  { grade: 12, title: 'Lớp 12', icon: '🔥', desc: 'Tích phân & Oxyz', color: 'from-red-600 to-rose-800', text: 'text-red-800', bg: 'bg-red-50' },
];

const THEME_OPTIONS = [
    { id: 'DEFAULT', name: 'Mặc định', icon: '🌞' },
    { id: 'NOEL', name: 'Giáng Sinh', icon: '🎄' },
    { id: 'TET', name: 'Tết Việt', icon: '🧧' },
    { id: 'SPACE', name: 'Vũ Trụ', icon: '🚀' },
    { id: 'OCEAN', name: 'Đại Dương', icon: '🌊' },
];

type LevelCategory = 'PRIMARY' | 'SECONDARY' | 'HIGH';
type SubjectView = 'MATH' | 'LIT' | 'ENG';

export const Home: React.FC<HomeProps> = ({ onNavigate, onStartGuest, onLogin, onRegister, onOpenHelp, onOpenDonation, bgTheme, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState<'GUEST' | 'AUTH'>('GUEST');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN'); // Sub-mode for AUTH
  const [activeLevelTab, setActiveLevelTab] = useState<LevelCategory>('PRIMARY');
  const [activeSubjectView, setActiveSubjectView] = useState<SubjectView>('MATH');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  // Form State
  const [guestName, setGuestName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Auto-rotate hero subject
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSubjectView(prev => {
        if (prev === 'MATH') return 'LIT';
        if (prev === 'LIT') return 'ENG';
        return 'MATH';
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartGuest = () => {
    if (guestName.trim() && selectedGrade) {
      onStartGuest(guestName, selectedGrade);
      onNavigate(AppRoute.DASHBOARD);
    }
  };

  const handleAuthSubmit = () => {
    if (authMode === 'LOGIN') {
        if (username.trim() && password.trim()) {
            onLogin(username, password);
        }
    } else {
        if (username.trim() && password.trim() && fullName.trim() && selectedGrade) {
            onRegister(username, password, fullName, selectedGrade);
        }
    }
  };

  const getFilteredGrades = () => {
    switch (activeLevelTab) {
      case 'PRIMARY': return GRADE_LEVELS.filter(g => g.grade >= 1 && g.grade <= 5);
      case 'SECONDARY': return GRADE_LEVELS.filter(g => g.grade >= 6 && g.grade <= 9);
      case 'HIGH': return GRADE_LEVELS.filter(g => g.grade >= 10 && g.grade <= 12);
      default: return [];
    }
  };

  // Determine Background Style based on Theme
  let mainBgClass = "bg-gradient-to-b from-white via-white to-slate-50";
  if (bgTheme === 'NOEL') mainBgClass = "bg-gradient-to-b from-slate-900 to-red-900";
  else if (bgTheme === 'TET') mainBgClass = "bg-gradient-to-br from-red-600 to-yellow-500";
  else if (bgTheme === 'SPACE') mainBgClass = "bg-slate-900";
  else if (bgTheme === 'OCEAN') mainBgClass = "bg-gradient-to-br from-cyan-100 to-blue-200";
  
  const isDarkTheme = ['NOEL', 'TET', 'SPACE'].includes(bgTheme);
  const textColor = isDarkTheme ? "text-white" : "text-slate-800";
  const subTextColor = isDarkTheme ? "text-slate-200" : "text-slate-500";

  // Dynamic Theme Button Style for better visibility
  const themeBtnStyle = isDarkTheme 
    ? "bg-white/20 text-white border-white/30 hover:bg-white/30" 
    : "bg-slate-800/10 text-slate-800 border-slate-200 hover:bg-slate-800/20";

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden relative ${mainBgClass} transition-colors duration-700`}>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes snowfall { 0% { transform: translateY(-10vh) translateX(0); opacity: 1; } 100% { transform: translateY(110vh) translateX(20px); opacity: 0.3; } }
        @keyframes leaf-fall { 0% { transform: translateY(-10vh) rotate(0deg); } 100% { transform: translateY(110vh) rotate(360deg); } }
        
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- FESTIVE OVERLAYS --- */}
      {bgTheme === 'NOEL' && (
         <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
             {[...Array(50)].map((_, i) => (
                <div key={i} className="absolute text-white opacity-80" 
                     style={{
                        left: `${Math.random() * 100}%`,
                        animation: `snowfall ${5 + Math.random() * 10}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${10 + Math.random() * 20}px`
                     }}>
                   ❄️
                </div>
             ))}
             <div className="absolute top-20 right-10 text-6xl animate-bounce hidden md:block" style={{animationDuration: '3s'}}>🎅</div>
             <div className="absolute top-32 left-10 text-4xl animate-bounce hidden md:block" style={{animationDuration: '4s'}}>🦌</div>
         </div>
      )}

      {bgTheme === 'TET' && (
         <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
             {[...Array(30)].map((_, i) => (
                <div key={i} className="absolute opacity-80" 
                     style={{
                        left: `${Math.random() * 100}%`,
                        animation: `leaf-fall ${6 + Math.random() * 4}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${15 + Math.random() * 15}px`
                     }}>
                   {i % 2 === 0 ? '🌸' : '🌼'}
                </div>
             ))}
             <div className="absolute top-20 left-4 text-6xl drop-shadow-md">🏮</div>
             <div className="absolute top-20 right-4 text-6xl drop-shadow-md">🏮</div>
             <div className="absolute top-40 right-20 text-6xl opacity-30 rotate-12 hidden md:block">🐲</div>
         </div>
      )}

      {/* Top Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full z-[100] px-4 py-4 md:px-8 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
               <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6 text-blue-600" />
               </div>
               <span className={`font-extrabold text-xl tracking-tight ${textColor} drop-shadow-sm`}>MathViet</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
               {/* Theme Selector Button (Desktop) - Enhanced Contrast */}
               <div className="relative">
                  <button 
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className={`flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full font-bold text-sm transition-all border shadow-sm ${themeBtnStyle}`}
                  >
                     <Palette className="w-4 h-4" /> {THEME_OPTIONS.find(t=>t.id===bgTheme)?.name}
                  </button>
                  {showThemeMenu && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[110] animate-in slide-in-from-top-2">
                        {THEME_OPTIONS.map(t => (
                           <button 
                              key={t.id} 
                              onClick={() => { onThemeChange(t.id as BgTheme); setShowThemeMenu(false); }}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors ${bgTheme === t.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                           >
                              <span>{t.icon}</span> {t.name}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               <button onClick={() => onNavigate(AppRoute.ABOUT)} className={`text-sm font-bold hover:opacity-80 transition-colors ${textColor}`}>Về chúng tôi</button>
               <button onClick={() => onNavigate(AppRoute.SITEMAP)} className={`text-sm font-bold hover:opacity-80 transition-colors ${textColor}`}>Sitemap</button>
               <button onClick={onOpenHelp} className={`text-sm font-bold hover:opacity-80 transition-colors ${textColor}`}>Hướng dẫn</button>
               <button onClick={onOpenDonation} className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-rose-500 font-bold text-sm shadow-sm hover:bg-white hover:shadow-md transition-all animate-pulse border border-rose-100">
                  <Heart className="w-4 h-4 fill-current" /> Ủng hộ
               </button>
            </div>

            {/* Mobile Menu Icons */}
            <div className="flex md:hidden items-center gap-2">
               {/* Mobile Theme Toggle (Cycle) - Enhanced Background */}
               <button 
                  onClick={() => {
                     const currentIndex = THEME_OPTIONS.findIndex(t => t.id === bgTheme);
                     const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
                     onThemeChange(THEME_OPTIONS[nextIndex].id as BgTheme);
                  }}
                  className="p-2 bg-white rounded-full text-blue-600 shadow-md border border-blue-50 relative z-[101] cursor-pointer active:scale-90"
                  title="Đổi giao diện"
               >
                  <Palette className="w-5 h-5" />
               </button>

               <button onClick={() => onNavigate(AppRoute.SITEMAP)} className="p-2 bg-white/80 rounded-full text-slate-600 shadow-sm relative z-[101] cursor-pointer active:scale-95"><Map className="w-5 h-5" /></button>
               <button onClick={() => onNavigate(AppRoute.ABOUT)} className="p-2 bg-white/80 rounded-full text-slate-600 shadow-sm relative z-[101] cursor-pointer active:scale-95"><Info className="w-5 h-5" /></button>
               <button onClick={onOpenHelp} className="p-2 bg-white/80 rounded-full text-slate-600 shadow-sm relative z-[101] cursor-pointer active:scale-95"><HelpCircle className="w-5 h-5" /></button>
               <button onClick={onOpenDonation} className="p-2 bg-white rounded-full text-rose-500 shadow-md border border-rose-10 relative z-[101] cursor-pointer active:scale-95"><Heart className="w-5 h-5 fill-current" /></button>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        
        {/* Only show blobs and clouds if default theme */}
        {bgTheme === 'DEFAULT' && (
          <>
            {/* Animated Clouds Backdrop */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-0 text-slate-200/40 animate-cloud-move" style={{ animationDuration: '45s' }}>
                    <Cloud size={120} fill="currentColor" />
                </div>
                <div className="absolute top-48 left-0 text-slate-200/30 animate-cloud-move" style={{ animationDuration: '65s', animationDelay: '-20s' }}>
                    <Cloud size={180} fill="currentColor" />
                </div>
                <div className="absolute top-10 left-0 text-slate-200/20 animate-cloud-move" style={{ animationDuration: '90s', animationDelay: '-45s' }}>
                    <Cloud size={240} fill="currentColor" />
                </div>
                <div className="absolute top-72 right-0 text-slate-200/10 animate-cloud-move" style={{ animationDuration: '55s', animationDelay: '-10s' }}>
                    <Cloud size={150} fill="currentColor" />
                </div>
            </div>

            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${
                activeSubjectView === 'MATH' ? 'bg-blue-400' : activeSubjectView === 'LIT' ? 'bg-rose-400' : 'bg-indigo-400'
            } -translate-y-1/2 translate-x-1/4`}></div>
            <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[80px] opacity-20 transition-colors duration-1000 ${
                activeSubjectView === 'MATH' ? 'bg-cyan-400' : activeSubjectView === 'LIT' ? 'bg-orange-400' : 'bg-purple-400'
            } translate-y-1/2 -translate-x-1/4`}></div>
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-2">
                 <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
                 <span className="text-sm font-bold text-gray-700">Học mà chơi, chơi mà học</span>
              </div>
              
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight ${textColor} drop-shadow-sm`}>
                Khám phá <br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-700 ${
                   bgTheme === 'NOEL' ? 'from-green-400 to-red-400' :
                   bgTheme === 'TET' ? 'from-yellow-300 to-red-500' :
                   activeSubjectView === 'MATH' ? 'from-blue-400 to-cyan-300' :
                   activeSubjectView === 'LIT' ? 'from-rose-400 to-orange-300' :
                   'from-indigo-400 to-purple-300'
                }`}>
                   {bgTheme === 'NOEL' ? 'Mùa Lễ Hội' : bgTheme === 'TET' ? 'Xuân Như Ý' : (activeSubjectView === 'MATH' ? 'Thế Giới Số' : activeSubjectView === 'LIT' ? 'Vườn Văn Học' : 'Vũ Trụ Anh Ngữ')}
                </span>
              </h1>
              
              <p className={`text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed ${subTextColor}`}>
                Nền tảng giáo dục Gamification số 1 Việt Nam dành cho học sinh lớp 1-12. 
                Rèn luyện tư duy mỗi ngày với AI thông minh.
              </p>

              {/* Subject Toggles */}
              <div className="flex justify-center lg:justify-start gap-3 pt-2">
                <button 
                  onClick={() => setActiveSubjectView('MATH')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${activeSubjectView === 'MATH' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm border'}`}
                >
                  <Calculator className="w-4 h-4 mr-2" /> Toán
                </button>
                <button 
                  onClick={() => setActiveSubjectView('LIT')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${activeSubjectView === 'LIT' ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500 shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm border'}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Văn
                </button>
                <button 
                  onClick={() => setActiveSubjectView('ENG')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${activeSubjectView === 'ENG' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm border'}`}
                >
                  <Languages className="w-4 h-4 mr-2" /> Anh
                </button>
              </div>
            </div>

            {/* Right Illustration (Dynamic) */}
            <div className="relative h-[400px] w-full hidden lg:block">
               {/* Math Illustration */}
               <div className={`absolute inset-0 transition-opacity duration-700 ${activeSubjectView === 'MATH' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-3xl rotate-12 shadow-2xl animate-float-slow flex items-center justify-center">
                      <Calculator size={100} className="text-white" />
                  </div>
                  <div className="absolute top-10 right-20 bg-white p-4 rounded-2xl shadow-lg animate-bounce">
                      <span className="text-2xl font-black text-blue-600">E = mc²</span>
                  </div>
                  <div className="absolute bottom-20 left-10 bg-yellow-400 p-4 rounded-full shadow-lg animate-float-delayed">
                      <Shapes size={40} className="text-white" />
                  </div>
                  <div className="absolute top-20 left-20 text-6xl font-black text-blue-200 rotate-[-15deg]">3.14</div>
                  <div className="absolute bottom-40 right-10 text-6xl font-black text-cyan-200 rotate-[15deg]">∑</div>
               </div>

               {/* Lit Illustration */}
               <div className={`absolute inset-0 transition-opacity duration-700 ${activeSubjectView === 'LIT' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500 rounded-full shadow-2xl animate-float-slow flex items-center justify-center border-4 border-white">
                      <BookOpen size={100} className="text-white" />
                  </div>
                  <div className="absolute top-20 left-10 bg-white p-4 rounded-2xl shadow-lg animate-float-delayed">
                      <span className="text-4xl">✒️</span>
                  </div>
                  <div className="absolute bottom-10 right-20 bg-orange-400 p-4 rounded-2xl shadow-lg animate-bounce">
                      <span className="text-2xl font-bold text-white">Ca Dao</span>
                  </div>
                  <div className="absolute top-10 right-10 text-6xl font-black text-rose-200">A</div>
                  <div className="absolute bottom-20 left-20 text-6xl font-black text-rose-200">Z</div>
               </div>

               {/* English Illustration */}
               <div className={`absolute inset-0 transition-opacity duration-700 ${activeSubjectView === 'ENG' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-[3rem] shadow-2xl animate-float-slow flex items-center justify-center">
                      <Globe size={100} className="text-white" />
                  </div>
                  <div className="absolute top-10 left-10 bg-white p-4 rounded-tr-3xl rounded-bl-3xl shadow-lg animate-bounce">
                      <MessageCircle size={32} className="text-indigo-600" />
                  </div>
                  <div className="absolute bottom-20 right-10 bg-purple-400 p-4 rounded-full shadow-lg animate-float-delayed">
                      <span className="text-xl font-bold text-white">Hello!</span>
                  </div>
                  <div className="absolute top-40 right-0 text-5xl opacity-50">🇬🇧</div>
                  <div className="absolute bottom-10 left-20 text-5xl opacity-50">🇺🇸</div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Action Area (Overlap) */}
      <section className="relative z-20 -mt-10 lg:-mt-20 px-4 mb-20">
         <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-6 md:p-10 flex flex-col md:flex-row gap-10">
            
            {/* Login / Register / Guest Form */}
            <div className="w-full md:w-1/2 relative">
                {/* z-index relative to input container in mobile */}
                <div className="bg-gray-100 p-1 rounded-xl flex mb-6 relative z-30">
                  <button 
                    onClick={() => setActiveTab('GUEST')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'GUEST' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Chơi Ngay (Khách)
                  </button>
                  <button 
                    onClick={() => setActiveTab('AUTH')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'AUTH' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Thành Viên (Lưu trữ)
                  </button>
                </div>

                <div className="space-y-4">
                  {activeTab === 'GUEST' ? (
                     <div className="animate-in fade-in slide-in-from-left-4">
                        <div className="relative z-30 mb-4">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                           <input 
                              type="text" 
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Nhập tên của bé..."
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-gray-800 font-bold text-lg transition-all relative z-40 shadow-inner"
                           />
                        </div>
                        <p className="text-xs text-gray-500 mb-4 text-center">
                           * Chế độ khách không lưu dữ liệu vĩnh viễn (Mất khi tải lại trang).
                        </p>
                        <button
                          onClick={handleStartGuest}
                          disabled={!guestName.trim() || !selectedGrade}
                          className={`w-full py-4 rounded-2xl font-extrabold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center relative z-30 ${
                             (!guestName.trim() || !selectedGrade) 
                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                             : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-200'
                          }`}
                        >
                           Bắt Đầu Ngay <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                     </div>
                  ) : (
                     <div className="animate-in fade-in slide-in-from-right-4">
                        {/* Sub-tabs for Login/Register */}
                        <div className="flex justify-center gap-6 mb-4 text-sm font-bold border-b border-gray-200 pb-2">
                            <button 
                                onClick={() => setAuthMode('LOGIN')}
                                className={`transition-colors ${authMode === 'LOGIN' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Đăng Nhập
                            </button>
                            <button 
                                onClick={() => setAuthMode('REGISTER')}
                                className={`transition-colors ${authMode === 'REGISTER' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Đăng Ký
                            </button>
                        </div>

                        <div className="relative z-30 space-y-3">
                           <div>
                               <div className="relative">
                                   <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                   <input 
                                      type="text" 
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                      placeholder="Tên đăng nhập (Username)"
                                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-gray-800 font-bold transition-all shadow-inner"
                                   />
                               </div>
                           </div>
                           
                           <div>
                               <div className="relative">
                                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                   <input 
                                      type="password" 
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      placeholder="Mật khẩu"
                                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-gray-800 font-bold transition-all shadow-inner"
                                   />
                               </div>
                           </div>

                           {authMode === 'REGISTER' && (
                               <div className="animate-in fade-in slide-in-from-top-2">
                                   <div className="relative">
                                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                       <input 
                                          type="text" 
                                          value={fullName}
                                          onChange={(e) => setFullName(e.target.value)}
                                          placeholder="Tên hiển thị (VD: Bé Bo)"
                                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-gray-800 font-bold transition-all shadow-inner"
                                       />
                                   </div>
                               </div>
                           )}
                        </div>

                        <button
                          onClick={handleAuthSubmit}
                          disabled={
                              authMode === 'LOGIN' 
                              ? (!username.trim() || !password.trim()) 
                              : (!username.trim() || !password.trim() || !fullName.trim() || !selectedGrade)
                          }
                          className={`w-full mt-4 py-4 rounded-2xl font-extrabold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center relative z-30 ${
                             (authMode === 'LOGIN' 
                                ? (!username.trim() || !password.trim()) 
                                : (!username.trim() || !password.trim() || !fullName.trim() || !selectedGrade)
                             )
                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                             : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-200'
                          }`}
                        >
                           {authMode === 'LOGIN' ? 'Đăng Nhập' : 'Đăng Ký Thành Viên'} 
                           {authMode === 'LOGIN' ? <LogIn className="w-5 h-5 ml-2" /> : <UserPlus className="w-5 h-5 ml-2" />}
                        </button>
                     </div>
                  )}
                  
                  {(!selectedGrade && (activeTab === 'GUEST' || authMode === 'REGISTER')) && (
                     <p className="text-center text-sm text-red-500 font-bold animate-pulse relative z-30 bg-red-50 py-1 rounded-full">
                        👇 Vui lòng chọn lớp học ở bên phải
                     </p>
                  )}
                </div>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden md:block w-px bg-gray-200"></div>

            {/* Grade Selection (Carousel) */}
            <div className="w-full md:w-1/2 flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <GraduationCap className="w-6 h-6 mr-2 text-primary" />
                    Chọn Lớp
                  </h3>
                  {selectedGrade && (
                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-in fade-in">
                        Đã chọn: Lớp {selectedGrade}
                     </span>
                  )}
               </div>

               {/* Level Tabs */}
               <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                  {[
                     { id: 'PRIMARY', label: 'Tiểu Học (1-5)', icon: School, color: 'blue' },
                     { id: 'SECONDARY', label: 'THCS (6-9)', icon: Book, color: 'orange' },
                     { id: 'HIGH', label: 'THPT (10-12)', icon: GraduationCap, color: 'rose' }
                  ].map((level) => (
                     <button
                        key={level.id}
                        onClick={() => setActiveLevelTab(level.id as LevelCategory)}
                        className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                           activeLevelTab === level.id
                           ? `bg-${level.color}-500 text-white shadow-md`
                           : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                     >
                        <level.icon className="w-3 h-3 mr-1.5" />
                        {level.label}
                     </button>
                  ))}
               </div>

               {/* Grade Carousel */}
               <div className="relative flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-200 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-50 to-transparent z-10"></div>
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
                  
                  <div className="flex flex-col gap-3 h-[300px] overflow-y-auto no-scrollbar snap-y snap-mandatory px-1 relative z-20">
                     {getFilteredGrades().map((level) => (
                        <button
                           key={level.grade}
                           onClick={() => setSelectedGrade(level.grade)}
                           className={`
                              flex items-center p-4 rounded-xl text-left transition-all duration-300 snap-center relative z-20
                              ${selectedGrade === level.grade
                                 ? `bg-white ring-2 ring-offset-2 ring-${level.color.split('-')[1]} shadow-lg transform scale-[1.02]`
                                 : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-300 shadow-sm'
                              }
                           `}
                        >
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm mr-4 bg-gradient-to-br ${level.color} text-white`}>
                              {level.icon}
                           </div>
                           <div>
                              <div className={`font-bold ${level.text}`}>{level.title}</div>
                              <div className="text-xs text-gray-400">{level.desc}</div>
                           </div>
                           {selectedGrade === level.grade && (
                              <div className="ml-auto bg-green-500 text-white rounded-full p-1">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                           )}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

         </div>
      </section>

      {/* Why Choose Us */}
      <section className={`py-12 px-4 ${isDarkTheme ? 'bg-black/20 text-white' : 'bg-white text-slate-800'}`}>
         <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-3xl font-extrabold mb-12">Tại sao chọn MathViet?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className={`text-center p-6 rounded-3xl transition-colors ${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-blue-50/50 hover:bg-blue-50 border'}`}>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">🤖</div>
                  <h3 className="font-bold text-xl mb-3">AI Thông Minh</h3>
                  <p className={`leading-relaxed ${subTextColor}`}>
                     Sử dụng Google Gemini để tạo ra hàng triệu câu hỏi độc nhất, phù hợp với trình độ của từng học sinh.
                  </p>
               </div>
               <div className={`text-center p-6 rounded-3xl transition-colors ${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-purple-50/50 hover:bg-purple-50 border'}`}>
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">🎮</div>
                  <h3 className="font-bold text-xl mb-3">Vừa Học Vừa Chơi</h3>
                  <p className={`leading-relaxed ${subTextColor}`}>
                     Hệ thống điểm thưởng, huy hiệu và bảng xếp hạng giúp việc học trở nên thú vị như chơi game.
                  </p>
               </div>
               <div className={`text-center p-6 rounded-3xl transition-colors ${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-green-50/50 hover:bg-green-50 border'}`}>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">🇻🇳</div>
                  <h3 className="font-bold text-xl mb-3">Đậm Chất Việt</h3>
                  <p className={`leading-relaxed ${subTextColor}`}>
                     Nội dung bám sát chương trình giáo dục Việt Nam, tích hợp văn hóa và lịch sử nước nhà.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className={`border-t border-gray-200 py-10 mt-auto ${isDarkTheme ? 'bg-black/30 border-white/10 text-slate-300' : 'bg-slate-50 text-gray-500'}`}>
         <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
               <div className="text-center md:text-left mb-6 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start mb-2">
                     <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                     <span className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-gray-700'}`}>MathViet</span> 
                  </div>
                  <p>Nền tảng học tập thông minh miễn phí.</p>
                  <p className="text-xs opacity-70 mt-1">© 2025. All rights reserved.</p>
               </div>
               
               <div className={`flex gap-6 font-bold ${isDarkTheme ? 'text-slate-300' : 'text-gray-600'}`}>
                  <button onClick={onOpenHelp} className="hover:text-primary transition-colors flex items-center"><HelpCircle className="w-4 h-4 mr-1"/> Hướng dẫn</button>
                  <button onClick={() => onNavigate(AppRoute.SITEMAP)} className="hover:text-primary transition-colors flex items-center"><Map className="w-4 h-4 mr-1"/> Sitemap</button>
                  <button onClick={() => onNavigate(AppRoute.ABOUT)} className="hover:text-primary transition-colors flex items-center"><User className="w-4 h-4 mr-1"/> Về chúng tôi</button>
               </div>
            </div>
            
            <div className="w-full max-w-xl border-t border-gray-200/50 my-4"></div>

            <div 
              className="text-xs text-center cursor-pointer hover:text-rose-500 transition-colors group" 
              onClick={onOpenDonation}
            >
               <span className="font-bold group-hover:underline">Ủng hộ tôi một ly cà phê tùy tâm ☕</span>
               <br/>
               <span className="opacity-70 mt-1 block">Phát triển bởi Lâm Phong - Cựu Học Sinh THPT Tĩnh Gia 3 (2007-2010)</span>
            </div>
            
            {/* Hidden Admin Link */}
            <div 
               onClick={() => onNavigate(AppRoute.ADMIN)} 
               className="mt-8 opacity-5 hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
            >
               Admin Portal
            </div>
         </div>
      </footer>
    </div>
  );
};
