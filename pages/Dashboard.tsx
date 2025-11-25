
import React, { useState, useEffect, Suspense } from 'react';
import { AppRoute, GameType, UserProfile, GameMode, GameStats, Subject as SubjectEnum, AdventureLevel, World, GameCardStyle } from '../types';
import { Brain, Puzzle, ShoppingCart, Shapes, PlayCircle, Zap, Palette, Swords, Search, BookOpen, PenTool, Hammer, ScanEye, X, ChevronRight, Trophy, Loader2, Layers, Feather, Quote, Globe, Languages, Type, MessageCircle, Calculator, BarChart3 } from 'lucide-react';
import { GameCard } from '../components/GameCard';

// Lazy load heavy components
const Leaderboard = React.lazy(() => import('../components/Leaderboard'));
const DailyMissions = React.lazy(() => import('../components/DailyMissions'));

interface DashboardProps {
  user: UserProfile;
  onNavigate: (route: AppRoute, params?: any) => void;
  onAddFriend: (id: string) => void;
  adventureLevels: AdventureLevel[];
  worlds: World[];
}

const COLOR_THEMES = [
  { id: 'blue', name: 'Đại Dương', gradient: 'bg-gradient-to-br from-blue-50 to-blue-100', text: 'text-blue-600' },
  { id: 'purple', name: 'Mộng Mơ', gradient: 'bg-gradient-to-br from-purple-50 to-purple-100', text: 'text-purple-600' },
  { id: 'green', name: 'Rừng Xanh', gradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100', text: 'text-emerald-600' },
  { id: 'orange', name: 'Năng Lượng', gradient: 'bg-gradient-to-br from-orange-50 to-orange-100', text: 'text-orange-600' },
  { id: 'pink', name: 'Kẹo Ngọt', gradient: 'bg-gradient-to-br from-pink-50 to-pink-100', text: 'text-pink-600' },
  { id: 'teal', name: 'Bạc Hà', gradient: 'bg-gradient-to-br from-teal-50 to-teal-100', text: 'text-teal-600' },
  { id: 'indigo', name: 'Huyền Bí', gradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100', text: 'text-indigo-600' },
  { id: 'dark', name: 'Bóng Đêm', gradient: 'bg-gradient-to-br from-slate-700 to-slate-800', text: 'text-white' },
];

const ICON_STYLES = [
  { id: 'SIMPLE', name: 'Đơn giản' },
  { id: 'BUBBLE', name: 'Bong bóng' },
  { id: 'GLASS', name: 'Kính mờ' },
  { id: 'NEON', name: 'Neon' },
];

// Loading Skeleton
const CardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 h-40 animate-pulse flex items-center justify-center">
    <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
  </div>
);

export const Dashboard = ({ user, onNavigate, onAddFriend, adventureLevels, worlds }: DashboardProps) => {
  const [subject, setSubject] = useState<SubjectEnum>(SubjectEnum.MATH);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.STANDARD);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | undefined>(undefined);
  const [gameStyles, setGameStyles] = useState<Record<string, GameCardStyle>>({});
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [editingGameType, setEditingGameType] = useState<GameType>(GameType.MENTAL_MATH);
  const [tempStyle, setTempStyle] = useState<GameCardStyle | null>(null);

  // Determine current adventure level (first UNLOCKED)
  const currentAdventureLevel = adventureLevels.find(l => l.status === 'UNLOCKED') || adventureLevels[adventureLevels.length - 1];
  const currentWorld = worlds.find(w => w.id === currentAdventureLevel.worldId) || worlds[0];

  useEffect(() => {
    try {
      const savedStyles = localStorage.getItem('dashboard_game_styles');
      if (savedStyles) setGameStyles(JSON.parse(savedStyles));
    } catch (e) { console.error("Failed to load styles", e); }
  }, []);

  const handleSaveStyle = () => {
    if (tempStyle) {
      const newStyles = { ...gameStyles, [editingGameType]: tempStyle };
      setGameStyles(newStyles);
      localStorage.setItem('dashboard_game_styles', JSON.stringify(newStyles));
      setIsStyleModalOpen(false);
    }
  };

  const openStyleModal = () => {
    const defaultGame = subject === SubjectEnum.MATH ? GameType.MENTAL_MATH : (subject === SubjectEnum.LITERATURE ? GameType.WORD_MATCH : GameType.ENGLISH_VOCAB);
    setEditingGameType(defaultGame);
    const existing = gameStyles[defaultGame];
    setTempStyle(existing || { id: 'blue', name: 'Đại Dương', gradient: 'bg-gradient-to-br from-blue-50 to-blue-100', text: 'text-blue-600', iconStyle: 'SIMPLE' });
    setIsStyleModalOpen(true);
  };

  const renderGameCards = () => {
    switch(subject) {
      case SubjectEnum.MATH:
        return (
          <>
             <GameCard title="Tính Nhẩm" description="Cộng trừ nhân chia" icon={Calculator} color="blue" type={GameType.MENTAL_MATH} mode={gameMode} stats={user.progress[GameType.MENTAL_MATH]} customStyle={gameStyles[GameType.MENTAL_MATH]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.MENTAL_MATH, mode: gameMode, difficulty })} />
             <GameCard title="Mật Mã Logic" description="Tìm quy luật số" icon={Puzzle} color="purple" type={GameType.LOGIC_PUZZLE} mode={gameMode} stats={user.progress[GameType.LOGIC_PUZZLE]} customStyle={gameStyles[GameType.LOGIC_PUZZLE]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.LOGIC_PUZZLE, mode: gameMode, difficulty })} />
             <GameCard title="Toán Thực Tế" description="Đi chợ, tính tiền" icon={ShoppingCart} color="emerald" type={GameType.REAL_WORLD} mode={gameMode} stats={user.progress[GameType.REAL_WORLD]} customStyle={gameStyles[GameType.REAL_WORLD]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.REAL_WORLD, mode: gameMode, difficulty })} />
             <GameCard title="Đếm Hình" description="Đếm vật thể vui nhộn" icon={Shapes} color="cyan" type={GameType.VISUAL_COUNT} mode={gameMode} stats={user.progress[GameType.VISUAL_COUNT]} customStyle={gameStyles[GameType.VISUAL_COUNT]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.VISUAL_COUNT, mode: gameMode, difficulty })} />
             <GameCard title="Xây Tháp Trí Tuệ" description="Sắp xếp số, điền số" icon={Layers} color="pink" type={GameType.TOWER_STACK} mode={gameMode} stats={user.progress[GameType.TOWER_STACK]} customStyle={gameStyles[GameType.TOWER_STACK]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.TOWER_STACK, mode: gameMode, difficulty })} />
          </>
        );
      case SubjectEnum.LITERATURE:
        return (
          <>
             <GameCard title="Vua Tiếng Việt" description="Ghép từ, đồng nghĩa" icon={BookOpen} color="rose" type={GameType.WORD_MATCH} mode={gameMode} stats={user.progress[GameType.WORD_MATCH]} customStyle={gameStyles[GameType.WORD_MATCH]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.WORD_MATCH, mode: gameMode, difficulty })} />
             <GameCard title="Chính Tả" description="Sửa lỗi sai" icon={Search} color="orange" type={GameType.SPELLING_BEE} mode={gameMode} stats={user.progress[GameType.SPELLING_BEE]} customStyle={gameStyles[GameType.SPELLING_BEE]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.SPELLING_BEE, mode: gameMode, difficulty })} />
             <GameCard title="Thợ Xây Câu" description="Sắp xếp câu đúng ngữ pháp" icon={Hammer} color="amber" type={GameType.SENTENCE_BUILDER} mode={gameMode} stats={user.progress[GameType.SENTENCE_BUILDER]} customStyle={gameStyles[GameType.SENTENCE_BUILDER]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.SENTENCE_BUILDER, mode: gameMode, difficulty })} />
             <GameCard title="Thám Tử Văn Học" description="Biện pháp tu từ, ẩn dụ" icon={ScanEye} color="slate" type={GameType.LITERARY_DETECTIVE} mode={gameMode} stats={user.progress[GameType.LITERARY_DETECTIVE]} customStyle={gameStyles[GameType.LITERARY_DETECTIVE]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.LITERARY_DETECTIVE, mode: gameMode, difficulty })} />
             <GameCard title="Nhà Thơ Tài Ba" description="Điền từ vào thơ" icon={Feather} color="yellow" type={GameType.POETRY_PUZZLE} mode={gameMode} stats={user.progress[GameType.POETRY_PUZZLE]} customStyle={gameStyles[GameType.POETRY_PUZZLE]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.POETRY_PUZZLE, mode: gameMode, difficulty })} />
             <GameCard title="Hiểu Biết Văn Học" description="Kiến thức văn học" icon={Quote} color="lime" type={GameType.LITERATURE_QUIZ} mode={gameMode} stats={user.progress[GameType.LITERATURE_QUIZ]} customStyle={gameStyles[GameType.LITERATURE_QUIZ]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.LITERATURE_QUIZ, mode: gameMode, difficulty })} />
          </>
        );
      case SubjectEnum.ENGLISH:
        return (
          <>
             <GameCard title="Vua Từ Vựng" description="Vocabulary & Meaning" icon={Globe} color="teal" type={GameType.ENGLISH_VOCAB} mode={gameMode} stats={user.progress[GameType.ENGLISH_VOCAB]} customStyle={gameStyles[GameType.ENGLISH_VOCAB]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.ENGLISH_VOCAB, mode: gameMode, difficulty })} />
             <GameCard title="Ngữ Pháp" description="Grammar & Tenses" icon={Languages} color="violet" type={GameType.ENGLISH_GRAMMAR} mode={gameMode} stats={user.progress[GameType.ENGLISH_GRAMMAR]} customStyle={gameStyles[GameType.ENGLISH_GRAMMAR]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.ENGLISH_GRAMMAR, mode: gameMode, difficulty })} />
             <GameCard title="Đánh Vần" description="Spelling Challenge" icon={Type} color="fuchsia" type={GameType.ENGLISH_SPELLING} mode={gameMode} stats={user.progress[GameType.ENGLISH_SPELLING]} customStyle={gameStyles[GameType.ENGLISH_SPELLING]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.ENGLISH_SPELLING, mode: gameMode, difficulty })} />
             <GameCard title="Đố Vui Tiếng Anh" description="General Knowledge" icon={MessageCircle} color="sky" type={GameType.ENGLISH_QUIZ} mode={gameMode} stats={user.progress[GameType.ENGLISH_QUIZ]} customStyle={gameStyles[GameType.ENGLISH_QUIZ]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.ENGLISH_QUIZ, mode: gameMode, difficulty })} />
          </>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      {/* 3-Column Layout: Profile/Missions | Main Content | Social/Quick */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (3 spans) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mini Profile Card */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 text-center">
             <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full mx-auto mb-4 p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl">
                   🤖
                </div>
             </div>
             <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
             <p className="text-sm text-gray-500 mb-4">Lớp {user.grade} • ID: {user.id}</p>
             
             <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-yellow-50 p-2 rounded-xl border border-yellow-100">
                   <div className="text-xl font-bold text-yellow-700">{user.points}</div>
                   <div className="text-[10px] text-yellow-600 uppercase font-bold">Điểm XP</div>
                </div>
                <div className="bg-orange-50 p-2 rounded-xl border border-orange-100">
                   <div className="text-xl font-bold text-orange-700">{user.streak} 🔥</div>
                   <div className="text-[10px] text-orange-600 uppercase font-bold">Chuỗi ngày</div>
                </div>
             </div>
             
             <div className="text-left">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-gray-500 uppercase">Huy hiệu gần nhất</span>
                   <span className="text-xs text-blue-500 cursor-pointer hover:underline">Xem tất cả</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                   {user.badges.length > 0 ? user.badges.slice(0, 3).map((b, i) => (
                      <span key={i} className="text-xl" title={b}>🏅</span>
                   )) : <span className="text-xs text-gray-400 italic">Chưa có huy hiệu</span>}
                </div>
             </div>
          </div>

          {/* Daily Missions - Lazy Loaded */}
          <Suspense fallback={<CardSkeleton />}>
             <DailyMissions user={user} />
          </Suspense>
        </div>

        {/* Center Column (6 spans) */}
        <div className="lg:col-span-6 space-y-6">
           
           {/* Mastery Peak Banner (Hero) */}
           <div 
             onClick={() => onNavigate(AppRoute.MASTERY_PEAK)}
             className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl cursor-pointer group h-64 flex flex-col justify-center px-8 border-4 border-slate-800 hover:border-purple-500 transition-all"
           >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              
              <div className="relative z-10">
                 <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Sự kiện mới</span>
                 </div>
                 <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm">
                    Đỉnh Cao Tri Thức
                 </h1>
                 <p className="text-slate-300 max-w-sm mb-6 text-sm md:text-base">
                    Chinh phục ngọn núi kiến thức. Trả lời đúng liên tiếp để leo cao hơn.
                 </p>
                 <div className="flex items-center gap-4">
                    <button className="bg-white text-slate-900 font-bold py-2 px-6 rounded-full flex items-center hover:bg-purple-50 transition-colors">
                       <PlayCircle className="w-5 h-5 mr-2" /> Bắt đầu leo núi
                    </button>
                    {user.masteryHighScore > 0 && (
                       <div className="text-sm font-bold text-yellow-400 flex items-center">
                          <Trophy className="w-4 h-4 mr-1" /> Kỷ lục: {user.masteryHighScore}
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Adventure Progress Card */}
           <div className="bg-white rounded-3xl shadow-sm p-1 border border-gray-100 flex items-center">
              <div className={`w-32 h-32 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center text-white bg-gradient-to-br ${currentWorld.bgGradient}`}>
                 <div className="text-4xl mb-1">{currentWorld.icon}</div>
              </div>
              <div className="p-4 flex-1">
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hành trình hiện tại</div>
                       <h3 className="text-xl font-bold text-gray-800">{currentWorld.name}</h3>
                    </div>
                    <button 
                       onClick={() => onNavigate(AppRoute.ADVENTURE_MAP)}
                       className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                    >
                       <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>
                 <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                       <span className="font-bold text-gray-600">{currentAdventureLevel.title}</span>
                       <span className="text-gray-400">Cấp {currentAdventureLevel.id}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Quick Game Grid */}
           <div>
              <div className="flex flex-col gap-3 mb-4">
                 <h3 className="font-bold text-gray-800 text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Luyện tập nhanh
                 </h3>
                 
                 {/* Toolbar Row */}
                 <div className="flex flex-col md:flex-row items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                     
                     {/* Subject Toggle */}
                     <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold w-full md:w-auto">
                        <button 
                           onClick={() => setSubject(SubjectEnum.MATH)}
                           className={`flex-1 md:flex-none px-3 py-1 rounded-md transition-all ${subject === SubjectEnum.MATH ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        >Toán</button>
                        <button 
                           onClick={() => setSubject(SubjectEnum.LITERATURE)}
                           className={`flex-1 md:flex-none px-3 py-1 rounded-md transition-all ${subject === SubjectEnum.LITERATURE ? 'bg-white shadow text-rose-600' : 'text-gray-500'}`}
                        >Văn</button>
                         <button 
                           onClick={() => setSubject(SubjectEnum.ENGLISH)}
                           className={`flex-1 md:flex-none px-3 py-1 rounded-md transition-all ${subject === SubjectEnum.ENGLISH ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                        >Anh</button>
                     </div>

                     <div className="hidden md:block h-6 w-px bg-gray-200"></div>

                     {/* Difficulty Toggle */}
                     <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold w-full md:w-auto">
                        <button 
                           onClick={() => setDifficulty(undefined)}
                           className={`flex-1 md:flex-none px-3 py-1 rounded-md transition-all ${difficulty === undefined ? 'bg-white shadow text-gray-700' : 'text-gray-500'}`}
                        >Ngẫu nhiên</button>
                        <button 
                           onClick={() => setDifficulty('Easy')}
                           className={`flex-1 md:flex-none px-3 py-1 rounded-md transition-all ${difficulty === 'Easy' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500 hover:text-green-600'}`}
                        >Dễ</button>
                        <button 
                           onClick={() => setDifficulty('Medium')}
                           className={`flex-1 md:flex-none px-3 py-1 rounded-md transition-all ${difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 shadow-sm' : 'text-gray-500 hover:text-yellow-600'}`}
                        >Vừa</button>
                        <button 
                           onClick={() => setDifficulty('Hard')}
                           className={`flex-1 md:flex-none px-3 py-1 rounded-md transition-all ${difficulty === 'Hard' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-gray-500 hover:text-red-600'}`}
                        >Khó</button>
                     </div>

                     <div className="hidden md:block h-6 w-px bg-gray-200"></div>

                     {/* Mode Toggle */}
                     <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold w-full md:w-auto">
                        <button 
                           onClick={() => setGameMode(GameMode.STANDARD)}
                           className={`flex-1 md:flex-none px-3 py-1.5 rounded-md transition-all flex items-center justify-center ${gameMode === GameMode.STANDARD ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                        >
                            Cơ bản
                        </button>
                        <button 
                           onClick={() => setGameMode(GameMode.SPEED_RUN)}
                           className={`flex-1 md:flex-none px-3 py-1.5 rounded-md transition-all flex items-center justify-center ${gameMode === GameMode.SPEED_RUN ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow text-white' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            <Zap className="w-3 h-3 mr-1" /> Speed Run
                        </button>
                     </div>
                     
                     {/* Style Button */}
                     <button onClick={openStyleModal} className="hidden md:block p-2 hover:bg-gray-100 rounded-lg text-gray-500 ml-auto" title="Tùy chỉnh">
                        <Palette className="w-4 h-4" />
                     </button>
                 </div>
              </div>
              
              {/* Special Challenge Mode Card */}
              <div className="mb-4">
                 <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-4 text-white flex items-center justify-between shadow-lg cursor-pointer transform transition-transform hover:scale-[1.02]"
                      onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.MIXED_CHALLENGE, mode: GameMode.STANDARD, difficulty: difficulty })}
                 >
                    <div className="flex items-center">
                       <div className="bg-white/20 p-3 rounded-full mr-4">
                          <Swords className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <h3 className="font-bold text-lg">Thử Thách Hỗn Hợp</h3>
                          <p className="text-pink-100 text-sm">Toán, Văn & Anh • {difficulty === undefined ? 'Độ khó tăng dần' : `Độ khó: ${difficulty}`}</p>
                       </div>
                    </div>
                    <div className="bg-white text-pink-600 px-4 py-2 rounded-lg font-bold text-sm">
                       Chơi Ngay
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {renderGameCards()}
              </div>
              <button onClick={() => onNavigate(AppRoute.PRACTICE_SETUP)} className="w-full mt-4 text-center text-sm text-gray-500 hover:text-blue-600 font-bold py-2 border border-dashed border-gray-300 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
                  + Tùy chỉnh bài luyện tập riêng
              </button>
           </div>
        </div>

        {/* Right Column (3 spans) */}
        <div className="lg:col-span-3 space-y-6">
           {/* Leaderboard - Lazy Loaded */}
           <Suspense fallback={<CardSkeleton />}>
              <Leaderboard onAddFriend={onAddFriend} />
           </Suspense>

           {/* Ad / Info Box */}
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-bold mb-2">Mở khóa Premium?</h3>
                  <p className="text-xs opacity-90 mb-4">Nhận thêm bài học nâng cao và huy hiệu độc quyền.</p>
                  <button className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-4 rounded-lg backdrop-blur-sm transition-colors border border-white/40">
                     Tìm hiểu thêm
                  </button>
               </div>
               <div className="absolute -bottom-4 -right-4 text-8xl opacity-20">💎</div>
           </div>
        </div>

      </div>

      {/* Style Modal */}
      {isStyleModalOpen && tempStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsStyleModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
             <div className="flex justify-between mb-4">
                <h3 className="font-bold">Tùy chỉnh thẻ</h3>
                <X className="cursor-pointer" onClick={() => setIsStyleModalOpen(false)} />
             </div>
             {/* Simple list of themes for demo */}
             <div className="grid grid-cols-4 gap-2 mb-6">
                {COLOR_THEMES.map(t => (
                   <button key={t.id} onClick={() => setTempStyle({...tempStyle, ...t})} className={`w-8 h-8 rounded-full ${t.gradient} ${tempStyle.id === t.id ? 'ring-2 ring-black' : ''}`}></button>
                ))}
             </div>
             <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Kiểu Icon</h4>
                <div className="flex gap-2">
                   {ICON_STYLES.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setTempStyle({...tempStyle, iconStyle: s.id as any})}
                        className={`text-xs border px-2 py-1 rounded ${tempStyle.iconStyle === s.id ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50'}`}
                      >
                         {s.name}
                      </button>
                   ))}
                </div>
             </div>
             <button onClick={handleSaveStyle} className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl">Lưu</button>
          </div>
        </div>
      )}
    </div>
  );
};
