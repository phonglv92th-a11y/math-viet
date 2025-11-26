
import React, { useState, useEffect } from 'react';
import { AppRoute } from '../types';
import { 
  HelpCircle, GraduationCap, BookOpen, Calculator, Languages, 
  Smile, Map, User, LogIn, School, Book, ChevronRight, Star, 
  Zap, Shield, Globe, Sparkles, MessageCircle, Shapes, Rocket
} from 'lucide-react';

interface HomeProps {
  onNavigate: (route: AppRoute) => void;
  onStartGuest: (name: string, grade: number) => void;
  onLogin: (username: string, grade: number, name: string) => void;
  onOpenHelp: () => void;
  onOpenDonation: () => void;
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

type LevelCategory = 'PRIMARY' | 'SECONDARY' | 'HIGH';
type SubjectView = 'MATH' | 'LIT' | 'ENG';

export const Home: React.FC<HomeProps> = ({ onNavigate, onStartGuest, onLogin, onOpenHelp, onOpenDonation }) => {
  const [activeTab, setActiveTab] = useState<'GUEST' | 'AUTH'>('GUEST');
  const [activeLevelTab, setActiveLevelTab] = useState<LevelCategory>('PRIMARY');
  const [activeSubjectView, setActiveSubjectView] = useState<SubjectView>('MATH');
  
  // Form State
  const [guestName, setGuestName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [username, setUsername] = useState('');
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

  const handleAuthLogin = () => {
    if (username.trim() && fullName.trim() && selectedGrade) {
      onLogin(username, selectedGrade, fullName);
      onNavigate(AppRoute.DASHBOARD);
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
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

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 transition-colors duration-1000 bg-gradient-to-b from-white via-white to-slate-50">
           <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${
              activeSubjectView === 'MATH' ? 'bg-blue-400' : activeSubjectView === 'LIT' ? 'bg-rose-400' : 'bg-indigo-400'
           } -translate-y-1/2 translate-x-1/4`}></div>
           <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[80px] opacity-20 transition-colors duration-1000 ${
              activeSubjectView === 'MATH' ? 'bg-cyan-400' : activeSubjectView === 'LIT' ? 'bg-orange-400' : 'bg-purple-400'
           } translate-y-1/2 -translate-x-1/4`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-2">
                 <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
                 <span className="text-sm font-bold text-gray-700">Học mà chơi, chơi mà học</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 leading-[1.1] tracking-tight">
                Khám phá <br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-700 ${
                   activeSubjectView === 'MATH' ? 'from-blue-600 to-cyan-500' :
                   activeSubjectView === 'LIT' ? 'from-rose-600 to-orange-500' :
                   'from-indigo-600 to-purple-500'
                }`}>
                   {activeSubjectView === 'MATH' ? 'Thế Giới Số' : activeSubjectView === 'LIT' ? 'Vườn Văn Học' : 'Vũ Trụ Anh Ngữ'}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Nền tảng giáo dục Gamification số 1 Việt Nam dành cho học sinh lớp 1-12. 
                Rèn luyện tư duy mỗi ngày với AI thông minh.
              </p>

              {/* Subject Toggles */}
              <div className="flex justify-center lg:justify-start gap-3 pt-2">
                <button 
                  onClick={() => setActiveSubjectView('MATH')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${activeSubjectView === 'MATH' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <Calculator className="w-4 h-4 mr-2" /> Toán
                </button>
                <button 
                  onClick={() => setActiveSubjectView('LIT')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${activeSubjectView === 'LIT' ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Văn
                </button>
                <button 
                  onClick={() => setActiveSubjectView('ENG')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${activeSubjectView === 'ENG' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
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
            
            {/* Login / Register Form */}
            <div className="w-full md:w-1/2">
                <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                  <button 
                    onClick={() => setActiveTab('GUEST')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'GUEST' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Chơi Ngay (Khách)
                  </button>
                  <button 
                    onClick={() => setActiveTab('AUTH')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'AUTH' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Thành Viên (Lưu trữ)
                  </button>
                </div>

                <div className="space-y-4">
                  {activeTab === 'GUEST' ? (
                     <>
                        <div className="relative">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                           <input 
                              type="text" 
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Nhập tên của bé..."
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-gray-800 font-bold text-lg transition-all relative z-20"
                           />
                        </div>
                        <button
                          onClick={handleStartGuest}
                          disabled={!guestName.trim() || !selectedGrade}
                          className={`w-full py-4 rounded-2xl font-extrabold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center ${
                             (!guestName.trim() || !selectedGrade) 
                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                             : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-200'
                          }`}
                        >
                           Bắt Đầu Ngay <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                     </>
                  ) : (
                     <>
                        <div className="relative">
                           <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                           <input 
                              type="text" 
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Tên đăng nhập"
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-gray-800 font-bold transition-all relative z-20"
                           />
                        </div>
                        <div className="relative">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                           <input 
                              type="text" 
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Tên hiển thị (VD: Bé Bo)"
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none text-gray-800 font-bold transition-all relative z-20"
                           />
                        </div>
                        <button
                          onClick={handleAuthLogin}
                          disabled={!username.trim() || !fullName.trim() || !selectedGrade}
                          className={`w-full py-4 rounded-2xl font-extrabold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center ${
                             (!username.trim() || !fullName.trim() || !selectedGrade) 
                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                             : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-200'
                          }`}
                        >
                           Đăng Nhập / Đăng Ký
                        </button>
                     </>
                  )}
                  
                  {!selectedGrade && (
                     <p className="text-center text-sm text-red-500 font-medium animate-pulse">
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
               <div className="relative flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-50 to-transparent z-10"></div>
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
                  
                  <div className="flex flex-col gap-3 h-[300px] overflow-y-auto no-scrollbar snap-y snap-mandatory px-1">
                     {getFilteredGrades().map((level) => (
                        <button
                           key={level.grade}
                           onClick={() => setSelectedGrade(level.grade)}
                           className={`
                              flex items-center p-4 rounded-xl text-left transition-all duration-300 snap-center
                              ${selectedGrade === level.grade
                                 ? `bg-white ring-2 ring-offset-2 ring-${level.color.split('-')[1]} shadow-lg transform scale-[1.02]`
                                 : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-300'
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
      <section className="py-12 bg-white px-4">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-3xl font-extrabold text-slate-800 mb-12">Tại sao chọn MathViet?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="text-center p-6 rounded-3xl bg-blue-50/50 hover:bg-blue-50 transition-colors">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🤖</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-800">AI Thông Minh</h3>
                  <p className="text-gray-600 leading-relaxed">
                     Sử dụng Google Gemini để tạo ra hàng triệu câu hỏi độc nhất, phù hợp với trình độ của từng học sinh.
                  </p>
               </div>
               <div className="text-center p-6 rounded-3xl bg-purple-50/50 hover:bg-purple-50 transition-colors">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🎮</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-800">Vừa Học Vừa Chơi</h3>
                  <p className="text-gray-600 leading-relaxed">
                     Hệ thống điểm thưởng, huy hiệu và bảng xếp hạng giúp việc học trở nên thú vị như chơi game.
                  </p>
               </div>
               <div className="text-center p-6 rounded-3xl bg-green-50/50 hover:bg-green-50 transition-colors">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🇻🇳</div>
                  <h3 className="font-bold text-xl mb-3 text-gray-800">Đậm Chất Việt</h3>
                  <p className="text-gray-600 leading-relaxed">
                     Nội dung bám sát chương trình giáo dục Việt Nam, tích hợp văn hóa và lịch sử nước nhà.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-gray-200 py-10 mt-auto">
         <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-gray-500 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
               <div className="text-center md:text-left mb-6 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start mb-2">
                     <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                     <span className="font-bold text-gray-700 text-lg">MathViet</span> 
                  </div>
                  <p>Nền tảng học tập thông minh miễn phí.</p>
                  <p className="text-xs text-gray-400 mt-1">© 2025. All rights reserved.</p>
               </div>
               
               <div className="flex gap-6 font-bold text-gray-600">
                  <button onClick={onOpenHelp} className="hover:text-primary transition-colors flex items-center"><HelpCircle className="w-4 h-4 mr-1"/> Hướng dẫn</button>
                  <button onClick={() => onNavigate(AppRoute.SITEMAP)} className="hover:text-primary transition-colors flex items-center"><Map className="w-4 h-4 mr-1"/> Sitemap</button>
                  <button onClick={() => onNavigate(AppRoute.ABOUT)} className="hover:text-primary transition-colors flex items-center"><User className="w-4 h-4 mr-1"/> Về chúng tôi</button>
               </div>
            </div>
            
            <div className="w-full max-w-xl border-t border-gray-200 my-4"></div>

            <div 
              className="text-xs text-center cursor-pointer hover:text-rose-500 transition-colors group" 
              onClick={onOpenDonation}
            >
               <span className="font-bold group-hover:underline">Ủng hộ tôi một ly cà phê tùy tâm ☕</span>
               <br/>
               <span className="text-gray-400 opacity-70 mt-1 block">Phát triển bởi Lâm Phong - Cựu Học Sinh THPT Tĩnh Gia 3 (2007-2010)</span>
            </div>
         </div>
      </footer>
    </div>
  );
};
