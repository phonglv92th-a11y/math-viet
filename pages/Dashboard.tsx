
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { AppRoute, GameType, UserProfile, GameMode, Subject as SubjectEnum, AdventureLevel, World, GameCardStyle, BgTheme } from '../types';
import { Brain, Puzzle, ShoppingCart, Shapes, PlayCircle, Zap, Palette, Swords, Search, BookOpen, PenTool, Hammer, ScanEye, X, ChevronRight, Trophy, Loader2, Layers, Feather, Quote, Globe, Languages, Type, MessageCircle, Calculator, BarChart3, Grid3X3, Grid, Atom, FlaskConical, Dna, Hourglass, Map, Star, Settings, Sliders, Sparkles, UserPlus, Flame, Target, TrendingUp } from 'lucide-react';
import { GameCard } from '../components/GameCard';
import { FriendInviteModal } from '../components/FriendInviteModal';

// Lazy load heavy components
const Leaderboard = React.lazy(() => import('../components/Leaderboard'));
const DailyMissions = React.lazy(() => import('../components/DailyMissions'));

interface DashboardProps {
  user: UserProfile;
  onNavigate: (route: AppRoute, params?: any) => void;
  onAddFriend: (id: string) => void;
  adventureLevels: AdventureLevel[];
  worlds: World[];
  bgTheme: BgTheme;
  onThemeChange: (theme: BgTheme) => void;
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

const BG_THEME_OPTIONS = [
  { id: 'DEFAULT', name: 'Mặc định', color: 'bg-slate-100', border: 'border-slate-200' },
  { id: 'OCEAN', name: 'Đại dương', color: 'bg-blue-300', border: 'border-blue-400' },
  { id: 'FOREST', name: 'Rừng xanh', color: 'bg-green-300', border: 'border-green-400' },
  { id: 'SPACE', name: 'Vũ trụ', color: 'bg-slate-800', border: 'border-slate-900' },
  { id: 'CANDY', name: 'Kẹo ngọt', color: 'bg-pink-200', border: 'border-pink-300' },
  { id: 'SUNSET', name: 'Hoàng hôn', color: 'bg-orange-300', border: 'border-orange-400' },
  { id: 'NOEL', name: 'Giáng Sinh', color: 'bg-red-800', border: 'border-red-900' },
  { id: 'TET', name: 'Tết Việt', color: 'bg-yellow-500', border: 'border-yellow-600' },
];

const ICON_STYLES = [
  { id: 'SIMPLE', name: 'Đơn giản' },
  { id: 'BUBBLE', name: 'Bong bóng' },
  { id: 'GLASS', name: 'Kính mờ' },
  { id: 'NEON', name: 'Neon' },
];

const CUTE_LOGIC_STYLE: GameCardStyle = {
  id: 'cute-logic',
  name: 'Hoạt hình',
  gradient: 'bg-purple-100',
  text: 'text-purple-500',
  iconStyle: 'BUBBLE'
};

const CardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 h-40 animate-pulse flex items-center justify-center">
    <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
  </div>
);

// New StatCard component for consistency
const StatCard = ({ icon: Icon, label, value, subValue, colorClass, shadowClass }: any) => (
  <div className={`bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group overflow-hidden relative`}>
    <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${colorClass} flex items-center justify-center text-white shadow-lg ${shadowClass} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 md:w-7 md:h-7" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl md:text-2xl font-black text-slate-800 truncate">{value}</p>
        {subValue && <span className="text-[10px] md:text-xs font-bold text-slate-400">{subValue}</span>}
      </div>
    </div>
    {/* Decorative element */}
    <div className={`absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`}>
      <Icon size={64} />
    </div>
  </div>
);

export const Dashboard = ({ user, onNavigate, onAddFriend, adventureLevels, worlds, bgTheme, onThemeChange }: DashboardProps) => {
  const [subject, setSubject] = useState<SubjectEnum>(SubjectEnum.MATH);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.STANDARD);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | undefined>(undefined);
  const [gameStyles, setGameStyles] = useState<Record<string, GameCardStyle>>({});
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingGameType, setEditingGameType] = useState<GameType>(GameType.MENTAL_MATH);
  const [tempStyle, setTempStyle] = useState<GameCardStyle | null>(null);
  const [liveUsers, setLiveUsers] = useState(0);
  
  const currentAdventureLevel = useMemo(() => adventureLevels.find(l => l.status === 'UNLOCKED') || adventureLevels[adventureLevels.length - 1], [adventureLevels]);
  const currentWorld = useMemo(() => worlds.find(w => w.id === currentAdventureLevel.worldId) || worlds[0], [currentAdventureLevel, worlds]);

  useEffect(() => {
    try {
      const savedStyles = localStorage.getItem('dashboard_game_styles');
      if (savedStyles) setGameStyles(JSON.parse(savedStyles));
    } catch (e) { console.error("Failed to load styles", e); }
    
    setLiveUsers(Math.floor(Math.random() * (1000 - 600 + 1)) + 600);
    const interval = setInterval(() => {
       setLiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 5000);
    return () => clearInterval(interval);
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
    const defaultGame = GameType.MENTAL_MATH;
    setEditingGameType(defaultGame);
    const existing = gameStyles[defaultGame];
    setTempStyle(existing || { id: 'blue', name: 'Đại Dương', gradient: 'bg-gradient-to-br from-blue-50 to-blue-100', text: 'text-blue-600', iconStyle: 'SIMPLE' });
    setIsStyleModalOpen(true);
  };

  const isPrimary = user.grade <= 5;

  const renderGameCards = () => {
    switch(subject) {
      case SubjectEnum.MATH:
        return (
          <>
             <GameCard title="Tính Nhẩm" description="Cộng trừ nhân chia" icon={Calculator} color="blue" type={GameType.MENTAL_MATH} mode={gameMode} stats={user.progress[GameType.MENTAL_MATH]} customStyle={gameStyles[GameType.MENTAL_MATH]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.MENTAL_MATH, mode: gameMode, difficulty })} />
             <GameCard title="Mật Mã Logic" description="Tìm quy luật số" icon={Puzzle} color="violet" type={GameType.LOGIC_PUZZLE} mode={gameMode} stats={user.progress[GameType.LOGIC_PUZZLE]} customStyle={gameStyles[GameType.LOGIC_PUZZLE] || (isPrimary ? CUTE_LOGIC_STYLE : undefined)} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.LOGIC_PUZZLE, mode: gameMode, difficulty })} />
             <GameCard title="Toán Thực Tế" description="Đi chợ, tính tiền" icon={ShoppingCart} color="emerald" type={GameType.REAL_WORLD} mode={gameMode} stats={user.progress[GameType.REAL_WORLD]} customStyle={gameStyles[GameType.REAL_WORLD]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.REAL_WORLD, mode: gameMode, difficulty })} />
             <GameCard title="Đếm Hình" description="Đếm vật thể vui nhộn" icon={Shapes} color="cyan" type={GameType.VISUAL_COUNT} mode={gameMode} stats={user.progress[GameType.VISUAL_COUNT]} customStyle={gameStyles[GameType.VISUAL_COUNT]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.VISUAL_COUNT, mode: gameMode, difficulty })} />
             <GameCard title="Xây Tháp Trí Tuệ" description="Sắp xếp số, điền số" icon={Layers} color="pink" type={GameType.TOWER_STACK} mode={gameMode} stats={user.progress[GameType.TOWER_STACK]} customStyle={gameStyles[GameType.TOWER_STACK]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.TOWER_STACK, mode: gameMode, difficulty })} />
          </>
        );
      case SubjectEnum.LITERATURE:
        return (
          <>
             <GameCard title="Truy Tìm Từ Vựng" description="Trò chơi ô chữ" icon={Grid3X3} color="fuchsia" type={GameType.WORD_SEARCH} mode={gameMode} stats={user.progress[GameType.WORD_SEARCH]} customStyle={gameStyles[GameType.WORD_SEARCH]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.WORD_SEARCH, mode: gameMode, difficulty })} />
             <GameCard title="Ô Chữ Bí Ẩn" description="Giải mã ô chữ" icon={Grid} color="indigo" type={GameType.CROSSWORD} mode={gameMode} stats={user.progress[GameType.CROSSWORD]} customStyle={gameStyles[GameType.CROSSWORD]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.CROSSWORD, mode: gameMode, difficulty })} />
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
             <GameCard title="Ngữ Pháp" description="Grammar & Tenses" icon={Languages} color="purple" type={GameType.ENGLISH_GRAMMAR} mode={gameMode} stats={user.progress[GameType.ENGLISH_GRAMMAR]} customStyle={gameStyles[GameType.ENGLISH_GRAMMAR]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.ENGLISH_GRAMMAR, mode: gameMode, difficulty })} />
             <GameCard title="Đánh Vần" description="Spelling Challenge" icon={Type} color="red" type={GameType.ENGLISH_SPELLING} mode={gameMode} stats={user.progress[GameType.ENGLISH_SPELLING]} customStyle={gameStyles[GameType.ENGLISH_SPELLING]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.ENGLISH_SPELLING, mode: gameMode, difficulty })} />
             <GameCard title="Đố Vui Tiếng Anh" description="General Knowledge" icon={MessageCircle} color="sky" type={GameType.ENGLISH_QUIZ} mode={gameMode} stats={user.progress[GameType.ENGLISH_QUIZ]} customStyle={gameStyles[GameType.ENGLISH_QUIZ]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.ENGLISH_QUIZ, mode: gameMode, difficulty })} />
          </>
        );
      case SubjectEnum.PHYSICS:
        return <GameCard title="Nhà Vật Lý" description="Chuyển động & Lực" icon={Atom} color="indigo" type={GameType.PHYSICS_QUIZ} mode={gameMode} stats={user.progress[GameType.PHYSICS_QUIZ]} customStyle={gameStyles[GameType.PHYSICS_QUIZ]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.PHYSICS_QUIZ, mode: gameMode, difficulty })} />;
      case SubjectEnum.CHEMISTRY:
        return <GameCard title="Hóa Học" description="Phản ứng & Nguyên tố" icon={FlaskConical} color="violet" type={GameType.CHEMISTRY_LAB} mode={gameMode} stats={user.progress[GameType.CHEMISTRY_LAB]} customStyle={gameStyles[GameType.CHEMISTRY_LAB]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.CHEMISTRY_LAB, mode: gameMode, difficulty })} />;
      case SubjectEnum.BIOLOGY:
        return <GameCard title="Sinh Học" description="Thế giới tự nhiên" icon={Dna} color="green" type={GameType.BIOLOGY_LIFE} mode={gameMode} stats={user.progress[GameType.BIOLOGY_LIFE]} customStyle={gameStyles[GameType.BIOLOGY_LIFE]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.BIOLOGY_LIFE, mode: gameMode, difficulty })} />;
      case SubjectEnum.HISTORY:
        return <GameCard title="Lịch Sử" description="Dòng chảy thời gian" icon={Hourglass} color="amber" type={GameType.HISTORY_TIMELINE} mode={gameMode} stats={user.progress[GameType.HISTORY_TIMELINE]} customStyle={gameStyles[GameType.HISTORY_TIMELINE]} onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.HISTORY_TIMELINE, mode: gameMode, difficulty })} />;
      default:
        return null;
    }
  }
  
  const isAdvancedGrade = user.grade >= 6;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative">
      
      {/* 1. TOP STATS BAR - CLEARER DISPLAY OF INDICES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        <StatCard 
          icon={Trophy} 
          label="Tổng Điểm XP" 
          value={user.points.toLocaleString()} 
          subValue="EXP"
          colorClass="bg-gradient-to-br from-yellow-400 to-amber-600" 
          shadowClass="shadow-yellow-200"
        />
        <StatCard 
          icon={Flame} 
          label="Chuỗi Ngày" 
          value={`${user.streak} ngày`} 
          subValue="FIRE"
          colorClass="bg-gradient-to-br from-orange-400 to-rose-600" 
          shadowClass="shadow-orange-200"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Học Lực" 
          value={`Lớp ${user.grade}`} 
          subValue="RANK"
          colorClass="bg-gradient-to-br from-blue-400 to-indigo-600" 
          shadowClass="shadow-blue-200"
        />
        <StatCard 
          icon={Target} 
          label="Bài Đã Làm" 
          value={user.completedGames} 
          subValue="GAMES"
          colorClass="bg-gradient-to-br from-emerald-400 to-teal-600" 
          shadowClass="shadow-emerald-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (3 spans) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Enhanced Profile Summary Card */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 flex flex-col items-center">
             <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 rounded-full p-1 animate-[spin_10s_linear_infinite]">
                   <div className="w-full h-full bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-1.5 bg-white rounded-full flex items-center justify-center text-4xl shadow-inner">
                   {isPrimary ? '🦁' : '🎓'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-white w-6 h-6 rounded-full shadow-sm"></div>
             </div>
             <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {user.id.substring(0, 8)}</p>
             
             {/* Dynamic Level Bar */}
             <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tiến trình Level</span>
                   <span className="text-xs font-bold text-blue-600">LV.{Math.floor(user.points/1000) + 1}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000" style={{width: `${(user.points % 1000) / 10}%`}}></div>
                </div>
             </div>

             <div className="mt-6 flex items-center justify-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100 w-full">
                <div className="relative w-2 h-2">
                   <span className="absolute inset-0 bg-green-500 rounded-full animate-ping"></span>
                   <span className="relative block w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <span className="text-[10px] font-black text-green-700">{liveUsers} ĐANG HỌC</span>
             </div>
          </div>

          <Suspense fallback={<CardSkeleton />}>
             <DailyMissions user={user} />
          </Suspense>
        </div>

        {/* Center Column (6 spans) */}
        <div className="lg:col-span-6 space-y-6">
           
           {/* Featured Game Banner */}
           <div 
             onClick={() => onNavigate(AppRoute.GAME_PLAY, { type: GameType.CROSSWORD, mode: GameMode.STANDARD })}
             className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 cursor-pointer group shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1"
           >
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-[20px] flex items-center justify-between relative z-10">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-yellow-200 flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-current" /> Nổi Bật
                       </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-2">Ô Chữ Bí Ẩn</h3>
                    <p className="text-indigo-100 text-sm mb-4">Thử thách trí tuệ với các câu đố ô chữ đa dạng chủ đề.</p>
                    <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full text-sm shadow-sm hover:bg-indigo-50 transition-colors">
                       Khám phá ngay
                    </button>
                 </div>
                 <div className="bg-white/20 p-4 rounded-2xl text-white group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-inner transform rotate-3 group-hover:rotate-6">
                    <Grid className="w-10 h-10" />
                 </div>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
           </div>

           {/* Adventure Mode Banner */}
           <div 
             onClick={() => onNavigate(AppRoute.ADVENTURE_MAP)}
             className={`relative overflow-hidden rounded-3xl shadow-xl cursor-pointer group mb-6 bg-gradient-to-r ${currentWorld.bgGradient.replace('100', '500').replace('200', '600')}`}
           >
              <div className="absolute top-0 right-0 p-4 opacity-20 text-9xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700 rotate-12">
                {currentWorld.icon}
              </div>
              <div className="p-8 relative z-10 text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Chế độ Cốt truyện</span>
                  <span className="text-white/90 text-xs font-bold flex items-center"><Map className="w-3 h-3 mr-1" /> {currentWorld.name}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-md">Hành Trình Tri Thức</h2>
                <div className="flex items-center text-white/90 mb-6 bg-black/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                   <Star className="w-5 h-5 mr-2 text-yellow-300 fill-yellow-300" />
                   <span className="font-bold text-lg">Cấp độ {currentAdventureLevel.id}: {currentAdventureLevel.title}</span>
                </div>
                <button className="bg-white text-slate-900 font-extrabold py-3 px-8 rounded-2xl shadow-lg hover:bg-slate-50 transition-colors flex items-center transform group-hover:translate-x-2 duration-300">
                   {currentAdventureLevel.id === 1 ? 'Bắt đầu' : 'Tiếp tục hành trình'} <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
           </div>

           {/* Mastery Peak Banner */}
           <div 
             onClick={() => onNavigate(AppRoute.MASTERY_PEAK)}
             className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl cursor-pointer group h-64 flex flex-col justify-center px-8 border-4 border-slate-800 hover:border-purple-500 transition-all mb-6"
           >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <div className="relative z-10">
                 <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Sự kiện mới</span>
                 </div>
                 <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm">Đỉnh Cao Tri Thức</h1>
                 <p className="text-slate-300 max-w-sm mb-6 text-sm md:text-base">Chinh phục ngọn núi kiến thức. Trả lời đúng liên tiếp để leo cao hơn.</p>
                 <div className="flex items-center gap-4">
                    <button className="bg-white text-slate-900 font-bold py-2 px-6 rounded-full flex items-center hover:bg-purple-50 transition-colors"><PlayCircle className="w-5 h-5 mr-2" /> Leo núi ngay</button>
                    {user.masteryHighScore > 0 && <div className="text-sm font-bold text-yellow-400 flex items-center"><Trophy className="w-4 h-4 mr-1" /> Kỷ lục: {user.masteryHighScore}</div>}
                 </div>
              </div>
           </div>

           {/* Practice Grid Toolbar */}
           <div>
              <div className="flex flex-col gap-3 mb-4">
                 <h3 className="font-bold text-gray-800 text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Luyện tập nhanh
                 </h3>
                 <div className="flex flex-col gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider">
                        <button onClick={() => setSubject(SubjectEnum.MATH)} className={`px-3 py-1.5 rounded-lg transition-all ${subject === SubjectEnum.MATH ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Toán</button>
                        <button onClick={() => setSubject(SubjectEnum.LITERATURE)} className={`px-3 py-1.5 rounded-lg transition-all ${subject === SubjectEnum.LITERATURE ? 'bg-white shadow text-rose-600' : 'text-gray-500'}`}>Văn</button>
                        <button onClick={() => setSubject(SubjectEnum.ENGLISH)} className={`px-3 py-1.5 rounded-lg transition-all ${subject === SubjectEnum.ENGLISH ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>Anh</button>
                        {isAdvancedGrade && (
                            <>
                                <button onClick={() => setSubject(SubjectEnum.PHYSICS)} className={`px-3 py-1.5 rounded-lg transition-all ${subject === SubjectEnum.PHYSICS ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Lý</button>
                                <button onClick={() => setSubject(SubjectEnum.CHEMISTRY)} className={`px-3 py-1.5 rounded-lg transition-all ${subject === SubjectEnum.CHEMISTRY ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}>Hóa</button>
                                <button onClick={() => setSubject(SubjectEnum.BIOLOGY)} className={`px-3 py-1.5 rounded-lg transition-all ${subject === SubjectEnum.BIOLOGY ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>Sinh</button>
                                <button onClick={() => setSubject(SubjectEnum.HISTORY)} className={`px-3 py-1.5 rounded-lg transition-all ${subject === SubjectEnum.HISTORY ? 'bg-white shadow text-amber-600' : 'text-gray-500'}`}>Sử</button>
                            </>
                        )}
                     </div>
                     <div className="flex flex-wrap items-center gap-2">
                        <div className="flex bg-gray-100 p-1 rounded-lg text-[10px] font-bold">
                            <button onClick={() => setDifficulty(undefined)} className={`px-2 py-1 rounded-md transition-all ${difficulty === undefined ? 'bg-white shadow text-gray-700' : 'text-gray-500'}`}>Ngẫu nhiên</button>
                            <button onClick={() => setDifficulty('Easy')} className={`px-2 py-1 rounded-md transition-all ${difficulty === 'Easy' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500'}`}>Dễ</button>
                            <button onClick={() => setDifficulty('Medium')} className={`px-2 py-1 rounded-md transition-all ${difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 shadow-sm' : 'text-gray-500'}`}>Vừa</button>
                            <button onClick={() => setDifficulty('Hard')} className={`px-2 py-1 rounded-md transition-all ${difficulty === 'Hard' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-gray-500'}`}>Khó</button>
                        </div>
                         <div className="flex bg-gray-100 p-1 rounded-lg text-[10px] font-bold ml-auto">
                            <button onClick={() => setGameMode(GameMode.STANDARD)} className={`px-2 py-1 rounded-md transition-all ${gameMode === GameMode.STANDARD ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Cơ bản</button>
                            <button onClick={() => setGameMode(GameMode.SPEED_RUN)} className={`px-2 py-1 rounded-md transition-all flex items-center ${gameMode === GameMode.SPEED_RUN ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow text-white' : 'text-gray-500'}`}><Zap className="w-3 h-3 mr-1" /> Speed</button>
                         </div>
                         <button onClick={openStyleModal} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 relative" title="Tùy chỉnh"><Palette className="w-4 h-4" /></button>
                     </div>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderGameCards()}</div>
           </div>
        </div>

        {/* Right Column (3 spans) */}
        <div className="lg:col-span-3 space-y-6">
           <Suspense fallback={<CardSkeleton />}>
              <Leaderboard onAddFriend={onAddFriend} />
           </Suspense>
           <button onClick={() => setIsInviteModalOpen(true)} className="w-full py-4 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-extrabold text-lg shadow-lg hover:shadow-cyan-200 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center group">
              <Swords className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" /> Thách Đấu Bạn Bè
           </button>
        </div>
      </div>

      {isStyleModalOpen && tempStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsStyleModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
             <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center"><Palette className="mr-2 text-blue-500"/> Giao diện học tập</h3>
                <X className="cursor-pointer text-gray-400 hover:text-gray-800" onClick={() => setIsStyleModalOpen(false)} />
             </div>
             <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Chủ đề nền ứng dụng</h4>
                <div className="grid grid-cols-2 gap-3">
                   {BG_THEME_OPTIONS.map(theme => (
                      <button key={theme.id} onClick={() => onThemeChange(theme.id as BgTheme)} className={`flex items-center p-3 rounded-xl border-2 transition-all shadow-sm ${bgTheme === theme.id ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-100' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 text-gray-700'}`}>
                         <div className={`w-5 h-5 rounded-full mr-2 border shadow-inner ${theme.color} ${theme.border}`}></div>
                         <span className="text-xs font-black">{theme.name}</span>
                      </button>
                   ))}
                </div>
             </div>
             <hr className="border-gray-100 my-4" />
             <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Màu sắc thẻ bài (Games)</h4>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {COLOR_THEMES.map(t => (
                    <button key={t.id} onClick={() => setTempStyle({...tempStyle, ...t})} className={`w-10 h-10 rounded-xl border transition-all ${t.gradient} ${tempStyle.id === t.id ? 'ring-2 ring-blue-600 scale-110 shadow-md' : 'border-gray-200'}`}></button>
                    ))}
                </div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Kiểu Icon</h4>
                <div className="flex gap-2 mb-6">
                   {ICON_STYLES.map(s => (
                      <button key={s.id} onClick={() => setTempStyle({...tempStyle, iconStyle: s.id as any})} className={`flex-1 text-xs border-2 py-2 px-1 rounded-lg font-bold transition-all ${tempStyle.iconStyle === s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{s.name}</button>
                   ))}
                </div>
             </div>
             <button onClick={handleSaveStyle} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95">Áp Dụng Thay Đổi</button>
          </div>
        </div>
      )}
      <FriendInviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} user={user} />
    </div>
  );
};
