
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppRoute, GameType, MathProblem, GameMode, BgTheme } from '../types';
import { generateGameProblems } from '../services/geminiService';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Timer, Loader2, Trophy, Home, RotateCcw, Zap, Sun, CloudRain, Sparkles, Star, Palette, Settings, X, Info, Lightbulb, HelpCircle, Fingerprint, Volume2, Cloud, Snowflake } from 'lucide-react';
import { Confetti } from '../components/Confetti';
import { MathRenderer } from '../components/MathRenderer';

interface GameArenaProps {
  gameType: GameType;
  userGrade: number;
  mode?: GameMode; 
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  questionCount?: number;
  topicFocus?: string;
  onNavigate: (route: AppRoute) => void;
  onGameComplete: (score: number) => void;
  bgTheme: BgTheme; // Prop from parent
}

// --- Theme Configurations ---
type CardTheme = 'CLASSIC' | 'WARM' | 'COOL' | 'DARK' | 'FESTIVE';

const BG_THEMES: Record<BgTheme, { class: string; name: string; icon: string }> = {
  DEFAULT: { class: 'bg-slate-100', name: 'Mặc định', icon: '⚪' },
  OCEAN: { class: 'bg-gradient-to-br from-cyan-200 to-blue-400', name: 'Đại dương', icon: '🌊' },
  FOREST: { class: 'bg-gradient-to-br from-green-200 to-emerald-500', name: 'Rừng xanh', icon: '🌲' },
  SPACE: { class: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white', name: 'Vũ trụ', icon: '🚀' },
  CANDY: { class: 'bg-gradient-to-br from-pink-200 to-purple-300', name: 'Kẹo ngọt', icon: '🍬' },
  SUNSET: { class: 'bg-gradient-to-br from-orange-200 to-rose-400', name: 'Hoàng hôn', icon: '🌅' },
  NOEL: { class: 'bg-gradient-to-b from-slate-800 to-red-900 text-white', name: 'Giáng Sinh', icon: '🎄' },
  TET: { class: 'bg-gradient-to-br from-red-600 to-yellow-500 text-white', name: 'Tết Việt', icon: '🧧' },
};

const CARD_THEMES: Record<CardTheme, { container: string; text: string; buttonDef: string; name: string }> = {
  CLASSIC: { 
    container: 'bg-white border-gray-200 shadow-xl', 
    text: 'text-slate-800', 
    buttonDef: 'bg-white border-b-4 border-gray-200 text-slate-700 active:border-b-0 active:translate-y-1 hover:bg-gray-50',
    name: 'Cổ điển' 
  },
  WARM: { 
    container: 'bg-[#fffbeb] border-[#fde68a] shadow-xl', 
    text: 'text-[#78350f]', 
    buttonDef: 'bg-white border-b-4 border-[#fde68a] text-slate-800 active:border-b-0 active:translate-y-1 hover:bg-[#fef3c7]',
    name: 'Ấm áp' 
  },
  COOL: { 
    container: 'bg-[#f0f9ff] border-[#bae6fd] shadow-xl', 
    text: 'text-[#0c4a6e]', 
    buttonDef: 'bg-white border-b-4 border-[#bae6fd] text-slate-800 active:border-b-0 active:translate-y-1 hover:bg-[#e0f2fe]',
    name: 'Mát mẻ' 
  },
  DARK: { 
    container: 'bg-[#1e293b] border-[#334155] shadow-2xl shadow-black/50', 
    text: 'text-white', 
    buttonDef: 'bg-[#0f172a] text-slate-200 border-b-4 border-[#334155] active:border-b-0 active:translate-y-1 hover:bg-[#334155]',
    name: 'Tối' 
  },
  FESTIVE: {
    container: 'bg-white/95 border-red-200 shadow-2xl shadow-red-900/20 backdrop-blur',
    text: 'text-red-900',
    buttonDef: 'bg-white border-b-4 border-red-200 text-red-900 active:border-b-0 active:translate-y-1 hover:bg-red-50',
    name: 'Lễ Hội'
  }
};

const HIGHLIGHT_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  return audioCtx;
};

const playSound = (type: 'correct' | 'incorrect' | 'click' | 'win' | 'fail' | 'pop') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const createOscillator = (freq: number, type: OscillatorType, startTime: number, duration: number, vol: number = 0.1) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    switch (type) {
      case 'correct': createOscillator(600, 'sine', now, 0.1, 0.1); createOscillator(1000, 'sine', now + 0.1, 0.4, 0.1); break;
      case 'incorrect': createOscillator(150, 'sawtooth', now, 0.3, 0.1); createOscillator(100, 'sawtooth', now + 0.1, 0.3, 0.1); break;
      case 'click': createOscillator(800, 'sine', now, 0.05, 0.05); break;
      case 'pop': createOscillator(1200, 'sine', now, 0.05, 0.05); break;
      case 'win': [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => createOscillator(freq, 'triangle', now + i * 0.15, 0.4, 0.1)); break;
      case 'fail': createOscillator(400, 'sawtooth', now, 0.3, 0.1); createOscillator(350, 'sawtooth', now + 0.3, 0.3, 0.1); createOscillator(300, 'sawtooth', now + 0.6, 0.8, 0.1); break;
    }
  } catch (e) { console.error("Audio play failed", e); }
};

const TUTORIALS: Record<GameType, { title: string; desc: string; tip: string }> = {
  [GameType.MENTAL_MATH]: { title: "Tính Nhẩm Thần Tốc", desc: "Thực hiện các phép tính Cộng, Trừ, Nhân, Chia nhanh nhất có thể.", tip: "Mẹo: Đừng suy nghĩ quá lâu, hãy tin vào trực giác số học của bạn!" },
  [GameType.LOGIC_PUZZLE]: { title: "Mật Mã Logic", desc: "Tìm quy luật ẩn sau các dãy số hoặc hình ảnh.", tip: "Mẹo: Quan sát sự tăng/giảm giữa các số liền kề." },
  [GameType.REAL_WORLD]: { title: "Toán Thực Tế", desc: "Giải quyết các bài toán có lời văn gắn liền với cuộc sống hàng ngày.", tip: "Mẹo: Đọc kỹ câu hỏi để tìm các dữ kiện quan trọng." },
  [GameType.TOWER_STACK]: { title: "Xây Tháp Trí Tuệ", desc: "Sắp xếp các con số theo thứ tự hoặc điền số còn thiếu vào thang leo.", tip: "Mẹo: Chú ý yêu cầu 'Tăng dần' hay 'Giảm dần'." },
  [GameType.VISUAL_COUNT]: { title: "Đếm Hình Đoán Số", desc: "Đếm số lượng vật thể trong hình và thực hiện phép tính.", tip: "Mẹo: Đếm theo nhóm để nhanh hơn." },
  [GameType.WORD_MATCH]: { title: "Vua Tiếng Việt", desc: "Tìm từ đồng nghĩa, trái nghĩa, hoặc ghép các từ thành câu.", tip: "Mẹo: Đọc kỹ ngữ cảnh của câu." },
  [GameType.POETRY_PUZZLE]: { title: "Nhà Thơ Tài Ba", desc: "Điền từ còn thiếu vào các câu thơ, ca dao, tục ngữ quen thuộc.", tip: "Mẹo: Nhớ lại các bài thơ đã học." },
  [GameType.SPELLING_BEE]: { title: "Cảnh Sát Chính Tả", desc: "Tìm từ viết đúng chính tả hoặc sửa lỗi sai trong câu.", tip: "Mẹo: Chú ý các cặp từ dễ nhầm lẫn." },
  [GameType.LITERATURE_QUIZ]: { title: "Hiểu Biết Văn Học", desc: "Trả lời câu hỏi về tác giả, tác phẩm và nhân vật văn học.", tip: "Mẹo: Nhớ lại tên các nhân vật trong truyện." },
  [GameType.SENTENCE_BUILDER]: { title: "Thợ Xây Câu", desc: "Sắp xếp các từ ngữ bị đảo lộn thành một câu hoàn chỉnh.", tip: "Mẹo: Xác định chủ ngữ và vị ngữ trước." },
  [GameType.LITERARY_DETECTIVE]: { title: "Thám Tử Văn Học", desc: "Xác định các biện pháp tu từ được sử dụng trong câu.", tip: "Mẹo: Tìm các từ khóa so sánh." },
  [GameType.WORD_SEARCH]: { title: "Truy Tìm Từ Vựng", desc: "Tìm các từ vựng ẩn trong bảng chữ cái.", tip: "Mẹo: Tìm chữ cái đầu tiên của từ cần tìm trước." },
  [GameType.CROSSWORD]: { title: "Ô Chữ Bí Ẩn", desc: "Giải ô chữ dựa trên gợi ý hàng ngang và hàng dọc.", tip: "Mẹo: Bắt đầu với những từ bạn chắc chắn nhất." },
  [GameType.ENGLISH_VOCAB]: { title: "Vua Từ Vựng (Vocabulary)", desc: "Chọn nghĩa đúng cho từ vựng.", tip: "Mẹo: Đoán nghĩa dựa trên từ gốc." },
  [GameType.ENGLISH_GRAMMAR]: { title: "Ngữ Pháp (Grammar)", desc: "Chọn đáp án đúng để hoàn thành câu.", tip: "Mẹo: Chú ý thì của động từ." },
  [GameType.ENGLISH_SPELLING]: { title: "Đánh Vần (Spelling)", desc: "Chọn từ tiếng Anh được viết đúng chính tả.", tip: "Mẹo: Đọc to từ đó lên." },
  [GameType.ENGLISH_QUIZ]: { title: "Đố Vui Tiếng Anh", desc: "Trả lời câu hỏi kiến thức chung.", tip: "Mẹo: Loại trừ đáp án sai trước." },
  [GameType.MIXED_CHALLENGE]: { title: "Thử Thách Hỗn Hợp", desc: "Kiểm tra toàn diện Toán, Văn, Anh.", tip: "Mẹo: Sẵn sàng chuyển đổi tư duy liên tục." },
  [GameType.PHYSICS_QUIZ]: { title: "Nhà Vật Lý Tài Ba", desc: "Trả lời các câu hỏi về vật lý.", tip: "Mẹo: Nhớ kỹ các đơn vị đo lường." },
  [GameType.CHEMISTRY_LAB]: { title: "Phòng Thí Nghiệm Hóa", desc: "Kiểm tra kiến thức hóa học.", tip: "Mẹo: Chú ý hóa trị nguyên tố." },
  [GameType.BIOLOGY_LIFE]: { title: "Thế Giới Sinh Học", desc: "Khám phá thế giới tự nhiên.", tip: "Mẹo: Liên hệ thực tế." },
  [GameType.HISTORY_TIMELINE]: { title: "Dòng Chảy Lịch Sử", desc: "Câu hỏi về sự kiện lịch sử.", tip: "Mẹo: Nhớ các mốc thời gian." },
};

// --- MEMOIZED SUB-COMPONENTS ---

const BackgroundEffects = React.memo(({ bgTheme, isPrimary, isCuteLogic }: { bgTheme: BgTheme, isPrimary: boolean, isCuteLogic: boolean }) => {
  const starsRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const planetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bgTheme !== 'SPACE') return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2);
      requestAnimationFrame(() => {
        if (starsRef.current) starsRef.current.style.transform = `translate(${x * -0.02}px, ${y * -0.02}px)`;
        if (nebulaRef.current) nebulaRef.current.style.transform = `translate(${x * -0.04}px, ${y * -0.04}px)`;
        if (planetsRef.current) planetsRef.current.style.transform = `translate(${x * -0.08}px, ${y * -0.08}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [bgTheme]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes pop-answer { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes shake-answer { 0%, 100% { translateX(0); } 25% { translateX(-5px); } 75% { translateX(5px); } }
        @keyframes snowfall { 0% { transform: translateY(-10vh) translateX(0); opacity: 1; } 100% { transform: translateY(110vh) translateX(20px); opacity: 0.3; } }
        @keyframes leaf-fall { 0% { transform: translateY(-10vh) rotate(0deg); } 100% { transform: translateY(110vh) rotate(360deg); } }
        @keyframes bubbleRise { 0% { transform: translateY(110vh) scale(0.5); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(-20vh) scale(1.5); opacity: 0; } }
        @keyframes fishSwim { 0% { left: -20%; } 100% { left: 120%; } }
        @keyframes birdFly { 0% { left: -10%; transform: translateY(0); } 100% { left: 110%; transform: translateY(-30px); } }
        .animate-pop-answer { animation: pop-answer 0.4s ease; } .animate-shake-answer { animation: shake-answer 0.5s ease; }
      `}</style>

      {/* NOEL THEME */}
      {bgTheme === 'NOEL' && (
         <>
             {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute text-white opacity-80" 
                     style={{
                        left: `${Math.random() * 100}%`,
                        animation: `snowfall ${5 + Math.random() * 5}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${10 + Math.random() * 20}px`
                     }}>
                   ❄️
                </div>
             ))}
             <div className="absolute top-0 right-10 text-6xl animate-bounce" style={{animationDuration: '3s'}}>🎅</div>
             <div className="absolute bottom-0 left-0 text-8xl opacity-30">🎄</div>
             <div className="absolute bottom-0 right-0 text-8xl opacity-30">🎄</div>
         </>
      )}

      {/* TET THEME */}
      {bgTheme === 'TET' && (
         <>
             {[...Array(15)].map((_, i) => (
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
             <div className="absolute top-0 left-4 text-6xl drop-shadow-md">🏮</div>
             <div className="absolute top-0 right-4 text-6xl drop-shadow-md">🏮</div>
             <div className="absolute bottom-10 left-10 text-6xl opacity-40 rotate-12">🧧</div>
             <div className="absolute bottom-10 right-10 text-6xl opacity-40 -rotate-12">🎋</div>
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-yellow-200 font-bold text-4xl opacity-20 whitespace-nowrap">CHÚC MỪNG NĂM MỚI</div>
         </>
      )}

      {/* OCEAN THEME */}
      {bgTheme === 'OCEAN' && (
         <>
             {[...Array(15)].map((_, i) => (
                <div key={i} className="absolute text-blue-100 opacity-40" 
                     style={{
                        left: `${Math.random() * 100}%`,
                        animation: `bubbleRise ${8 + Math.random() * 12}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${10 + Math.random() * 20}px`
                     }}>
                   🫧
                </div>
             ))}
             <div className="absolute top-1/4 left-0 text-6xl opacity-20 animate-[fishSwim_20s_linear_infinite]" style={{animationDuration: '25s'}}>🐟</div>
             <div className="absolute bottom-1/3 left-0 text-4xl opacity-20 animate-[fishSwim_15s_linear_infinite]" style={{animationDuration: '18s', animationDelay: '5s'}}>🐠</div>
         </>
      )}

      {/* FOREST THEME */}
      {bgTheme === 'FOREST' && (
         <>
             {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute bg-yellow-300 rounded-full opacity-60 animate-pulse" 
                     style={{
                        width: '4px',
                        height: '4px',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                        boxShadow: '0 0 10px #fde047'
                     }}>
                </div>
             ))}
             <div className="absolute bottom-0 left-0 text-9xl opacity-10 pointer-events-none">🌿</div>
             <div className="absolute bottom-0 right-0 text-9xl opacity-10 pointer-events-none transform -scale-x-100">🌿</div>
         </>
      )}
      
      {/* CANDY THEME */}
      {bgTheme === 'CANDY' && (
         <>
             {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute opacity-40 animate-bounce" 
                     style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${3 + Math.random() * 5}s`,
                        animationDelay: `${Math.random() * 5}s`,
                        fontSize: `${20 + Math.random() * 20}px`
                     }}>
                   {['🍬', '🍭', '🧁', '🍩'][Math.floor(Math.random() * 4)]}
                </div>
             ))}
         </>
      )}

      {/* SUNSET THEME */}
      {bgTheme === 'SUNSET' && (
         <>
             <div className="absolute bottom-10 left-10 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-40 mix-blend-screen animate-pulse"></div>
             {[...Array(3)].map((_, i) => (
                <div key={i} className="absolute text-orange-900 opacity-20"
                   style={{
                      top: `${10 + Math.random() * 20}%`,
                      fontSize: '24px',
                      animation: `birdFly ${15 + Math.random() * 10}s linear infinite`,
                      animationDelay: `${i * 7}s`
                   }}
                >
                   🦅
                </div>
             ))}
         </>
      )}

      {isPrimary && bgTheme === 'DEFAULT' && (
         <>
             <div className="absolute top-10 right-10 text-yellow-400 animate-spin-slow opacity-80"><Sun size={80} /></div>
             <div className="absolute top-20 left-[-100px] text-white opacity-60 animate-[cloudMove_30s_linear_infinite]"><Cloud size={100} fill="white" /></div>
             <div className="absolute top-40 left-[-200px] text-white opacity-40 animate-[cloudMove_45s_linear_infinite_5s]"><Cloud size={80} fill="white" /></div>
             <div className={`absolute bottom-0 w-full h-32 ${isCuteLogic ? 'bg-purple-200' : 'bg-green-200'} rounded-t-[50%] scale-150`}></div>
         </>
      )}

      {!isPrimary && bgTheme === 'SPACE' && (
          <>
              <div ref={starsRef} className="absolute inset-[-10%] w-[120%] h-[120%] z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(white,transparent_1px)] [background-size:50px_50px] opacity-20"></div>
                  <div className="absolute top-1/4 left-1/4 text-white text-xs opacity-40">✨</div>
                  <div className="absolute bottom-1/3 right-1/3 text-white text-xs opacity-60">✨</div>
              </div>
              <div ref={nebulaRef} className="absolute inset-[-15%] w-[130%] h-[130%] z-0">
                   <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
              </div>
              <div ref={planetsRef} className="absolute inset-[-20%] w-[140%] h-[140%] z-0">
                  <div className="absolute top-[20%] right-[15%] text-4xl opacity-80 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">🪐</div>
                  <div className="absolute bottom-[20%] left-[10%] text-6xl opacity-40 blur-[1px]">🌑</div>
              </div>
          </>
      )}
    </div>
  );
});

const GameHeader = React.memo(({ timeLeft, score, onNavigate }: { timeLeft: number, score: number, onNavigate: (r: AppRoute) => void }) => {
  return (
    <div className="relative z-10 p-4 flex justify-between items-center">
      <button onClick={() => onNavigate(AppRoute.DASHBOARD)} className="bg-white/80 p-2 rounded-full shadow-sm hover:bg-white"><ArrowLeft/></button>
      <div className="flex gap-2">
         <span className="bg-white/80 px-3 py-1 rounded-full font-bold flex items-center shadow-sm"><Timer className="w-4 h-4 mr-1"/>{timeLeft}s</span>
         <span className="bg-white/80 px-3 py-1 rounded-full font-bold text-blue-600 shadow-sm">{score} pts</span>
      </div>
    </div>
  );
});

const LogicPuzzleDisplay = React.memo(({ question, isCuteLogic }: { question: string, isCuteLogic: boolean }) => {
    const lines = question.split('\n').filter(line => line.trim() !== '');
    const hasText = /[a-zA-Zà-ỹÀ-Ỹ]/.test(lines[0]);
    const title = (lines.length > 1 && hasText) ? lines[0] : '';
    const puzzleLines = (lines.length > 1 && hasText) ? lines.slice(1) : lines;
    
    const lineContainerStyle = isCuteLogic 
        ? 'rounded-3xl p-4 w-full max-w-lg flex flex-wrap items-center justify-center gap-3 bg-white/70 border-2 border-purple-100 shadow-sm'
        : 'rounded-2xl p-3 w-full max-w-lg flex flex-wrap items-center justify-center gap-2 bg-white/60 border border-gray-200';

    return (
        <div className="w-full flex flex-col items-center mb-8">
            {title && (
                <div className={`${isCuteLogic ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-blue-50 border-blue-100 text-blue-800'} px-6 py-3 rounded-full border shadow-sm mb-6 flex items-center`}>
                    <HelpCircle className={`w-5 h-5 mr-2 ${isCuteLogic ? 'text-purple-500' : 'text-blue-500'}`} />
                    <h3 className="text-lg font-bold">{title}</h3>
                </div>
            )}
            
            <div className="flex flex-col gap-4 items-center w-full">
                {puzzleLines.map((line, i) => {
                    const tokens = line.split(/([+\-=?:])/g).map(p => p.trim()).filter(p => p.length > 0);
                    const isQ = line.includes('?');
                    
                    const currentLineStyle = isCuteLogic && isQ
                        ? 'bg-yellow-50 border-4 border-dashed border-yellow-300 shadow-[0_4px_0_0_#fde047]'
                        : isQ ? 'bg-yellow-50 border-2 border-dashed border-yellow-400' : lineContainerStyle;

                    return (
                        <div key={i} className={currentLineStyle}>
                            {tokens.map((token, idx) => {
                                const isOperator = ['+', '-', '=', '?', ':'].includes(token);
                                
                                if (isOperator) {
                                    if (isCuteLogic) {
                                        let opColor = 'bg-gray-200 text-gray-600';
                                        if (token === '+') opColor = 'bg-green-100 text-green-600 border border-green-200';
                                        if (token === '-') opColor = 'bg-red-100 text-red-600 border border-red-200';
                                        if (token === '=') opColor = 'bg-blue-100 text-blue-600 border border-blue-200';
                                        if (token === '?') opColor = 'bg-yellow-400 text-white animate-bounce';
                                        
                                        return <div key={idx} className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-black shadow-sm ${opColor}`}>{token}</div>;
                                    }
                                    return <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center text-xl font-black ${token === '?' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>{token}</div>;
                                }
                                
                                return (
                                    <div key={idx} className={`${isCuteLogic ? 'bg-white rounded-2xl shadow-md border-b-4 border-purple-100 px-4 py-3 min-w-[70px] transform hover:scale-110 transition-transform' : 'bg-white rounded-xl shadow-sm border-b-4 border-gray-200 px-3 py-2 min-w-[50px]'} flex items-center justify-center`}>
                                        <span className={`${isCuteLogic ? 'text-5xl drop-shadow-sm' : 'text-4xl'} leading-none`}>{token}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

const WordSearchGrid = React.memo(({ question, gridState, foundWords, isSelecting, selectionStart, currentSelection, options, onMouseDown, onMouseEnter, onMouseUp }: any) => {
    return (
       <div className="w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">{question}</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
              <div className="relative bg-white rounded-3xl p-3 border-4 border-purple-100 shadow-xl touch-none mx-auto md:mx-0"
                   style={{ display: 'grid', gridTemplateColumns: `repeat(10, 1fr)`, gap: '2px', maxWidth: '400px' }}
                   onMouseUp={onMouseUp} onTouchEnd={onMouseUp}>
                   <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{overflow: 'visible'}}>
                       {foundWords.map((fw: any, i: number) => <line key={i} x1={(fw.start.col*10)+5+'%'} y1={(fw.start.row*10)+5+'%'} x2={(fw.end.col*10)+5+'%'} y2={(fw.end.row*10)+5+'%'} stroke={fw.color} strokeWidth="7%" opacity="0.5" strokeLinecap="round"/>)}
                       {isSelecting && selectionStart && <line x1={(selectionStart.col*10)+5+'%'} y1={(selectionStart.row*10)+5+'%'} x2={(currentSelection[currentSelection.length-1].col*10)+5+'%'} y2={(currentSelection[currentSelection.length-1].row*10)+5+'%'} stroke="purple" strokeWidth="7%" opacity="0.5" strokeLinecap="round"/>}
                   </svg>
                   {gridState.map((r: string[], ri: number) => r.map((c, ci) => (
                       <div key={`${ri}-${ci}`} onMouseDown={() => onMouseDown(ri, ci)} onMouseEnter={() => onMouseEnter(ri, ci)} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center font-bold text-slate-700 bg-purple-50 rounded-full cursor-pointer select-none text-sm md:text-base">{c}</div>
                   )))}
              </div>
              <div className="bg-yellow-50 p-6 rounded-2xl min-w-[200px]">
                  <h3 className="font-bold text-yellow-800 mb-4 flex items-center"><Fingerprint className="w-4 h-4 mr-2"/> Từ vựng</h3>
                  <div className="flex flex-col gap-2">
                    {options && options.map((w: string, i: number) => (
                      <div key={i} className={`px-3 py-2 rounded-lg font-bold text-sm border border-transparent ${foundWords.some((f: any)=>f.word===w.toUpperCase()) ? 'bg-white text-green-600 line-through border-green-200' : 'text-slate-500 bg-white/50'}`}>
                        {w}
                      </div>
                    ))}
                  </div>
              </div>
          </div>
       </div>
    );
});

const CrosswordBoard = React.memo(({ question, cwClues, cwUserInputs, cwSelectedClue, setCwSelectedClue, onInput }: any) => {
    return (
       <div className="w-full flex flex-col items-center">
           <h2 className="text-2xl font-bold mb-6 text-indigo-700">{question}</h2>
           <div className="flex flex-col md:flex-row gap-8 w-full">
               <div className="flex-1 bg-indigo-50 p-4 rounded-xl space-y-2 max-h-[400px] overflow-y-auto">
                   {cwClues.map((clue: any, idx: number) => (
                       <div key={idx} onClick={()=>setCwSelectedClue(idx)} className={`p-3 rounded-lg border-2 cursor-pointer ${cwSelectedClue===idx ? 'border-indigo-400 bg-white' : 'border-transparent'}`}>
                           <span className="font-bold text-indigo-600 mr-2">#{idx+1}</span>
                           <span className="text-sm">{clue.clue}</span>
                       </div>
                   ))}
               </div>
               <div className="flex-[2] bg-white p-4 rounded-xl border-2 border-indigo-100 flex flex-col gap-2">
                   {cwClues.map((clue: any, idx: number) => (
                       <div key={idx} className="flex items-center gap-2">
                           <span className="font-bold w-6">#{idx+1}</span>
                           {clue.word.split('').map((char:string, ci:number) => (
                               <input key={ci} maxLength={1} value={cwUserInputs[`${clue.row}-${clue.col+ci}`]||''} onChange={e=>onInput(clue.row, clue.col+ci, e.target.value)} className="w-8 h-8 border rounded text-center font-bold uppercase"/>
                           ))}
                       </div>
                   ))}
               </div>
           </div>
       </div>
    );
});

const AnswerGrid = React.memo(({ options, selectedOption, correctAnswerIndex, handleAnswer, handleSpeak, isLogicPuzzle, isPrimary, bgTheme, currentCardTheme, isCuteLogic, ttsEnabled }: any) => {
    return (
      <div className={`grid gap-4 w-full ${isLogicPuzzle ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
        {options.map((opt: string, idx: number) => {
           let style = currentCardTheme.buttonDef;
           if (isPrimary && bgTheme === 'DEFAULT') style = "bg-white border-b-4 border-sky-200 text-sky-800 hover:bg-sky-50 active:border-b-0 active:translate-y-1 shadow-sm rounded-3xl";
           if (isCuteLogic) style = "bg-white border-2 border-b-8 border-purple-200 text-purple-800 rounded-3xl shadow-sm hover:-translate-y-2 hover:border-purple-300 hover:shadow-lg active:border-b-2 active:translate-y-1 transition-all duration-200";

           if (selectedOption !== null) {
               if (idx === correctAnswerIndex) style = isPrimary ? "bg-green-100 border-green-500 text-green-800 animate-pop-answer rounded-3xl" : "bg-green-100 border-green-500 text-green-900 animate-pop-answer";
               else if (idx === selectedOption) style = isPrimary ? "bg-red-100 border-red-500 text-red-800 animate-shake-answer rounded-3xl" : "bg-red-100 border-red-500 text-red-900 animate-shake-answer";
               else style = "bg-gray-50 text-gray-400 border-gray-200 opacity-50";
           }
           return (
             <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedOption !== null} className={`font-bold transition-all relative group flex items-center ${style} ${isLogicPuzzle ? 'aspect-square text-6xl justify-center' : 'p-4 md:p-6 text-xl rounded-2xl'}`}>
                {!isLogicPuzzle && (
                   <div className="flex items-center w-full">
                       <span className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-sm md:text-base font-extrabold mr-4 ${isPrimary && bgTheme === 'DEFAULT' ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-600'}`}>
                          {String.fromCharCode(65+idx)}
                       </span>
                       <span className="flex-1 break-words text-left">
                          <MathRenderer text={opt} inline />
                       </span>
                   </div>
                )}
                {isLogicPuzzle && <MathRenderer text={opt} inline />}
                
                {ttsEnabled && (
                   <div onClick={(e) => handleSpeak(opt, 'vi-VN', e)} className="absolute right-2 bottom-2 md:right-12 md:top-1/2 md:-translate-y-1/2 p-2 rounded-full hover:bg-black/5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer z-20" title="Nghe">
                     <Volume2 size={16} />
                   </div>
                )}
                {selectedOption === idx && idx === correctAnswerIndex && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-6 h-6"/>}
                {selectedOption === idx && idx !== correctAnswerIndex && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 w-6 h-6"/>}
             </button>
           );
        })}
      </div>
    );
});

export const GameArena: React.FC<GameArenaProps> = ({ gameType, userGrade, mode = GameMode.STANDARD, difficulty, questionCount = 5, topicFocus, onNavigate, onGameComplete, bgTheme }) => {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [gameActive, setGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResultState, setGameResultState] = useState<'WIN' | 'LOSE'>('WIN');
  
  // Ref for time to use in stable callbacks without re-creating them
  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Word Search & Crossword State
  const [gridState, setGridState] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<{word: string, start: {row:number, col:number}, end: {row:number, col:number}, color: string}[]>([]);
  const [currentSelection, setCurrentSelection] = useState<{row: number, col: number}[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{row: number, col: number} | null>(null);
  const [cwClues, setCwClues] = useState<any[]>([]);
  const [cwUserInputs, setCwUserInputs] = useState<Record<string, string>>({});
  const [cwSelectedClue, setCwSelectedClue] = useState<number | null>(null);

  const [cardTheme, setCardTheme] = useState<CardTheme>(() => (localStorage.getItem('mathviet_card_theme') as CardTheme) || 'CLASSIC');
  const [showTutorial, setShowTutorial] = useState(false);

  const isPrimary = userGrade <= 5;
  const isEnglishGame = [GameType.ENGLISH_VOCAB, GameType.ENGLISH_GRAMMAR, GameType.ENGLISH_SPELLING, GameType.ENGLISH_QUIZ].includes(gameType);
  const isLogicPuzzle = gameType === GameType.LOGIC_PUZZLE;
  const isCuteLogic = isPrimary && isLogicPuzzle;
  const ttsConfig = { enabled: true };

  useEffect(() => { localStorage.setItem('mathviet_card_theme', cardTheme); }, [cardTheme]);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      let reviewContext = mode === GameMode.REVIEW ? (JSON.parse(localStorage.getItem('mathviet_mistakes') || '[]').slice(-15).map((m: any) => m.topic).join(', ')) || "General Review" : undefined;
      const data = await generateGameProblems(userGrade, gameType, questionCount, difficulty, topicFocus, reviewContext);
      setProblems(data);
      setLoading(false);
      setGameActive(true);
      if (!sessionStorage.getItem(`tutorial_seen_${gameType}`)) { setShowTutorial(true); sessionStorage.setItem(`tutorial_seen_${gameType}`, 'true'); }
      setTimeLeft(mode === GameMode.SPEED_RUN ? questionCount * 15 : 60);
    };
    fetchProblems();
  }, [gameType, userGrade, mode, difficulty, topicFocus, questionCount]);

  useEffect(() => {
    if (gameType === GameType.WORD_SEARCH && problems.length > 0 && problems[currentIndex]?.options) {
      const words = problems[currentIndex].options.map(w => w.toUpperCase());
      const size = 10;
      const grid = Array(size).fill('').map(() => Array(size).fill(''));
      words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
          attempts++;
          const dir = Math.floor(Math.random() * 3);
          const r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size);
          let fits = true;
          for (let i=0; i<word.length; i++) {
             let nr = r + (dir === 1 || dir === 2 ? i : 0);
             let nc = c + (dir === 0 || dir === 2 ? i : 0);
             if (nr >= size || nc >= size || (grid[nr][nc] && grid[nr][nc] !== word[i])) { fits = false; break; }
          }
          if (fits) {
             for (let i=0; i<word.length; i++) {
                grid[r + (dir === 1 || dir === 2 ? i : 0)][c + (dir === 0 || dir === 2 ? i : 0)] = word[i];
             }
             placed = true;
          }
        }
      });
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for(let r=0; r<size; r++) for(let c=0; c<size; c++) if (!grid[r][c]) grid[r][c] = chars.charAt(Math.floor(Math.random() * chars.length));
      setGridState(grid); setFoundWords([]); setCurrentSelection([]); setSelectionStart(null);
    }
    if (gameType === GameType.CROSSWORD && problems.length > 0 && problems[currentIndex]?.options) {
       const parsedItems = problems[currentIndex].options.map((opt, id) => {
         const [word, clue] = opt.split('|');
         return { id, word: (word||'').toUpperCase(), clue: clue||'', len: (word||'').length, direction: 'across', row: id * 2, col: 1 };
       });
       setCwClues(parsedItems); setCwUserInputs({}); setCwSelectedClue(null);
    }
  }, [currentIndex, problems, gameType]);

  // STABLE CALLBACKS
  const handleTimeOut = useCallback(() => { 
      if (mode === GameMode.SPEED_RUN) { setGameActive(false); setGameResultState('LOSE'); setIsGameOver(true); } 
      else { 
          // Check current option ref if needed, or pass logic
          // But since handleTimeOut is called from effect interval, we need to handle "timeout answer"
          // We can't call handleAnswer(-1) directly if it expects user interaction flow, but logic is same
          // Duplicating handleAnswer logic here slightly or ensuring handleAnswer handles -1 correctly
          setSelectedOption(-1); setShowExplanation(true); playSound('incorrect');
      } 
  }, [mode]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0 || showExplanation || isGameOver || showTutorial) return;
    const timer = setInterval(() => setTimeLeft(prev => { 
        if (prev <= 1) { 
            clearInterval(timer); 
            handleTimeOut(); 
            return 0; 
        } 
        return prev - 1; 
    }), 1000);
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, showExplanation, isGameOver, showTutorial, handleTimeOut]);

  useEffect(() => { if (isGameOver) playSound(gameResultState === 'WIN' ? 'win' : 'fail'); }, [isGameOver, gameResultState]);

  const handleAnswer = useCallback((index: number) => {
    if (showExplanation) return; 
    // Use Ref for Time to prevent re-render dependency
    const currentT = timeLeftRef.current;
    
    setSelectedOption(index); setShowExplanation(true);
    const isCorrect = index === problems[currentIndex].correctAnswerIndex;
    
    if (gameType === GameType.WORD_SEARCH || gameType === GameType.CROSSWORD) { 
        setScore(prev => prev + 50); 
    } else if (isCorrect) { 
        playSound('correct'); 
        setScore(prev => prev + (100 + (mode === GameMode.STANDARD ? currentT * 2 : 0)) * (mode === GameMode.SPEED_RUN ? 2 : 1)); 
    } else { 
        playSound('incorrect'); 
    }
  }, [showExplanation, problems, currentIndex, gameType, mode]);

  const nextQuestion = useCallback(() => {
    playSound('click');
    if (currentIndex < problems.length - 1) { 
        setCurrentIndex(prev => prev + 1); setSelectedOption(null); setShowExplanation(false); 
        if (mode !== GameMode.SPEED_RUN) setTimeLeft(60); 
    } else { 
        setGameActive(false); setIsGameOver(true); setGameResultState('WIN'); 
        if (mode === GameMode.SPEED_RUN) {
            const finalTime = timeLeftRef.current;
            setScore(prev => prev + (finalTime * 5)); 
        }
    }
  }, [currentIndex, problems.length, mode]);

  const handleSpeak = useCallback((text: string, _lang: string = 'vi-VN', e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const hasVietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = hasVietnameseChars ? 'vi-VN' : (isEnglishGame ? 'en-US' : 'vi-VN');
      if (isEnglishGame && !hasVietnameseChars) utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [isEnglishGame]);

  const handleGridMouseDown = useCallback((row: number, col: number) => { playSound('pop'); setIsSelecting(true); setSelectionStart({row, col}); setCurrentSelection([{row, col}]); }, []);
  
  const handleGridMouseEnter = useCallback((row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;
    const dx = row - selectionStart.row, dy = col - selectionStart.col;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
       const newSelection = [];
       for(let i=0; i<=steps; i++) newSelection.push({ row: selectionStart.row + Math.round(i * (dx/steps) || 0), col: selectionStart.col + Math.round(i * (dy/steps) || 0) });
       setCurrentSelection(newSelection);
    }
  }, [isSelecting, selectionStart]);

  const handleGridMouseUp = useCallback(() => {
    setIsSelecting(false);
    if (currentSelection.length < 2) { setCurrentSelection([]); setSelectionStart(null); return; }
    const selectedWord = currentSelection.map(c => gridState[c.row][c.col]).join('');
    const targetWords = problems[currentIndex].options.map(w => w.toUpperCase());
    if (targetWords.includes(selectedWord) && !foundWords.some(f => f.word === selectedWord)) {
      playSound('correct');
      const newFound = [...foundWords, { word: selectedWord, start: currentSelection[0], end: currentSelection[currentSelection.length - 1], color: HIGHLIGHT_COLORS[foundWords.length % HIGHLIGHT_COLORS.length] }];
      setFoundWords(newFound); setScore(prev => prev + 100);
      if (newFound.length + 1 === targetWords.length) { playSound('win'); setTimeout(() => handleAnswer(0), 1500); }
    } else { playSound('incorrect'); }
    setCurrentSelection([]); setSelectionStart(null);
  }, [currentSelection, gridState, problems, currentIndex, foundWords, handleAnswer]);

  const handleCrosswordInput = useCallback((row: number, col: number, val: string) => {
      const key = `${row}-${col}`;
      const newInputs = {...cwUserInputs, [key]: val.toUpperCase()};
      setCwUserInputs(newInputs);
      const total = cwClues.reduce((acc: number, curr: any) => acc + curr.word.length, 0);
      const filled = Object.keys(newInputs).length + (val ? 0 : -1); 
      if (filled >= total) {
          let allCorrect = true;
          cwClues.forEach((clue: any) => {
             for(let i=0; i<clue.word.length; i++) {
                 if ((newInputs[`${clue.row}-${clue.col + i}`] || '') !== clue.word[i]) allCorrect = false;
             }
          });
          if (allCorrect) { playSound('win'); setTimeout(() => handleAnswer(0), 1000); }
      }
  }, [cwUserInputs, cwClues, handleAnswer]);

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><Loader2 className="w-12 h-12 text-primary animate-spin mb-4" /><h2 className="text-xl font-bold">Đang chuẩn bị đề bài từ AI...</h2></div>;

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        {gameResultState === 'WIN' && <Confetti />}
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-lg w-full text-center relative z-10">
          <div className="relative w-40 h-40 mx-auto -mt-24 mb-6 flex items-center justify-center">
             {gameResultState === 'WIN' ? <div className="w-32 h-32 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-white shadow-xl"><Trophy className="w-16 h-16 text-white" /></div> : <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl"><XCircle className="w-16 h-16 text-red-500" /></div>}
          </div>
          <h2 className="text-4xl font-extrabold mb-2 text-gray-800">{gameResultState === 'WIN' ? 'Tuyệt Vời!' : 'Hết Giờ!'}</h2>
          <div className="text-6xl font-black text-blue-600 mb-8">{score}</div>
          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => window.location.reload()} className="bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center"><RotateCcw className="mr-2"/> Chơi Lại</button>
             <button onClick={() => onGameComplete(score)} className="bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl flex items-center justify-center"><Home className="mr-2"/> Trang Chủ</button>
          </div>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentIndex];
  if (!currentProblem) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center"><h2 className="text-xl font-bold mb-4">Có lỗi xảy ra khi tải câu hỏi</h2><button onClick={() => window.location.reload()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Thử lại</button></div>;

  const isVisualGame = gameType === GameType.VISUAL_COUNT || gameType === GameType.LOGIC_PUZZLE;
  const isWordSearch = gameType === GameType.WORD_SEARCH;
  const isCrossword = gameType === GameType.CROSSWORD;
  
  const backgroundClass = isPrimary 
    ? (bgTheme === 'DEFAULT' ? 'bg-sky-100 font-cute' : BG_THEMES[bgTheme].class) 
    : (bgTheme !== 'DEFAULT' ? BG_THEMES[bgTheme].class : (mode === GameMode.SPEED_RUN ? 'bg-red-50' : 'bg-slate-100'));
  
  let currentCardTheme = CARD_THEMES[cardTheme];
  if (bgTheme === 'TET' && cardTheme === 'CLASSIC') currentCardTheme = CARD_THEMES['FESTIVE'];
  if (bgTheme === 'NOEL' && cardTheme === 'CLASSIC') currentCardTheme = CARD_THEMES['COOL'];

  let containerClasses = `${currentCardTheme.container} rounded-[2.5rem]`;
  if (isPrimary && bgTheme === 'DEFAULT' && !isCuteLogic) {
      containerClasses = 'bg-white/90 border-4 border-sky-300 rounded-[3rem] shadow-[0_10px_0_0_rgba(14,165,233,0.2)]';
  } else if (isCuteLogic) {
      containerClasses = 'bg-white/90 border-4 border-pink-300 rounded-[3rem] shadow-[0_10px_0_0_#f472b6]';
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${backgroundClass}`}>
      <BackgroundEffects bgTheme={bgTheme} isPrimary={isPrimary} isCuteLogic={isCuteLogic} />

      {showTutorial && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div className="bg-white p-6 rounded-xl max-w-sm"><h3 className="font-bold text-xl mb-2">{TUTORIALS[gameType].title}</h3><p className="mb-4">{TUTORIALS[gameType].desc}</p><button onClick={() => setShowTutorial(false)} className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold">OK</button></div></div>}
      
      <GameHeader timeLeft={timeLeft} score={score} onNavigate={onNavigate} />
      
      <div className="h-1.5 w-full bg-gray-200/50"><div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${((currentIndex+1)/problems.length)*100}%`}}></div></div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full relative z-10">
        <div className={`w-full ${containerClasses} p-8 md:p-12 relative overflow-hidden transition-all duration-300`}>
           
           {!isPrimary && <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue-400">{currentProblem.difficulty}</div>}
           <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Câu hỏi {currentIndex+1}/{problems.length}</div>
           
           {isLogicPuzzle ? (
                <LogicPuzzleDisplay question={currentProblem.question} isCuteLogic={isCuteLogic} />
           ) : isWordSearch ? (
                <WordSearchGrid 
                    question={currentProblem.question}
                    gridState={gridState}
                    foundWords={foundWords}
                    isSelecting={isSelecting}
                    selectionStart={selectionStart}
                    currentSelection={currentSelection}
                    options={currentProblem.options}
                    onMouseDown={handleGridMouseDown}
                    onMouseEnter={handleGridMouseEnter}
                    onMouseUp={handleGridMouseUp}
                />
           ) : isCrossword ? (
                <CrosswordBoard 
                    question={currentProblem.question}
                    cwClues={cwClues}
                    cwUserInputs={cwUserInputs}
                    cwSelectedClue={cwSelectedClue}
                    setCwSelectedClue={setCwSelectedClue}
                    onInput={handleCrosswordInput}
                />
           ) : (
                <div className="text-center mb-8 relative group">
                   <div className="flex items-center justify-center gap-2">
                     <h2 className={`${isVisualGame ? 'text-6xl' : 'text-3xl md:text-5xl'} font-extrabold leading-tight ${currentCardTheme.text} pb-2`}>
                        <MathRenderer text={currentProblem.question} />
                     </h2>
                     {ttsConfig.enabled && (
                        <button 
                          onClick={(e) => handleSpeak(currentProblem.question, 'vi-VN', e)}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Nghe"
                        >
                           <Volume2 className="w-6 h-6" />
                        </button>
                     )}
                   </div>
                </div>
            )}

            {!isWordSearch && !isCrossword && currentProblem.options && (
                <AnswerGrid 
                    options={currentProblem.options}
                    selectedOption={selectedOption}
                    correctAnswerIndex={currentProblem.correctAnswerIndex}
                    handleAnswer={handleAnswer}
                    handleSpeak={handleSpeak}
                    isLogicPuzzle={isLogicPuzzle}
                    isPrimary={isPrimary}
                    bgTheme={bgTheme}
                    currentCardTheme={currentCardTheme}
                    isCuteLogic={isCuteLogic}
                    ttsEnabled={ttsConfig.enabled}
                />
            )}
           
           {showExplanation && (
              <div className={`mt-8 p-6 ${isCuteLogic ? 'bg-purple-50 border-purple-200' : 'bg-blue-50/80 border-blue-100'} backdrop-blur-md rounded-2xl border animate-in slide-in-from-bottom-4`}>
                 <div className={`flex items-center mb-2 font-bold ${isCuteLogic ? 'text-purple-700' : 'text-blue-700'} text-xs uppercase`}>
                    <Lightbulb className="w-4 h-4 mr-2"/> Giải thích
                 </div>
                 <div className="text-lg text-slate-800 leading-relaxed mb-6"><MathRenderer text={currentProblem.explanation} /></div>
                 <button onClick={nextQuestion} className={`w-full ${isCuteLogic ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-600'} text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center`}>Tiếp theo <ArrowRight className="ml-2"/></button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
