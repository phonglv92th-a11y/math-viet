
import React, { useState, useEffect, useRef } from 'react';
import { AppRoute, GameType, MathProblem, GameMode } from '../types';
import { generateGameProblems } from '../services/geminiService';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Timer, Loader2, Trophy, Home, RotateCcw, Zap, Sun, CloudRain, Sparkles, Star, Palette, Settings, X, Info, Lightbulb, HelpCircle } from 'lucide-react';
import { Confetti } from '../components/Confetti';

interface GameArenaProps {
  gameType: GameType;
  userGrade: number;
  mode?: GameMode; 
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  questionCount?: number;
  topicFocus?: string;
  onNavigate: (route: AppRoute) => void;
  onGameComplete: (score: number) => void;
}

// --- Theme Configurations ---
type BgTheme = 'DEFAULT' | 'OCEAN' | 'FOREST' | 'SPACE' | 'CANDY' | 'SUNSET';
type CardTheme = 'CLASSIC' | 'WARM' | 'COOL' | 'DARK';

const BG_THEMES: Record<BgTheme, { class: string; name: string; icon: string }> = {
  DEFAULT: { class: 'bg-slate-100', name: 'Mặc định', icon: '⚪' },
  OCEAN: { class: 'bg-gradient-to-br from-cyan-200 to-blue-400', name: 'Đại dương', icon: '🌊' },
  FOREST: { class: 'bg-gradient-to-br from-green-200 to-emerald-500', name: 'Rừng xanh', icon: '🌲' },
  SPACE: { class: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white', name: 'Vũ trụ', icon: '🚀' },
  CANDY: { class: 'bg-gradient-to-br from-pink-200 to-purple-300', name: 'Kẹo ngọt', icon: '🍬' },
  SUNSET: { class: 'bg-gradient-to-br from-orange-200 to-rose-400', name: 'Hoàng hôn', icon: '🌅' },
};

const CARD_THEMES: Record<CardTheme, { container: string; text: string; buttonDef: string; name: string }> = {
  CLASSIC: { 
    container: 'bg-white border-gray-200', 
    text: 'text-gray-800', 
    buttonDef: 'border-gray-200 hover:bg-blue-50 hover:border-blue-400',
    name: 'Cổ điển' 
  },
  WARM: { 
    container: 'bg-[#fffbeb] border-[#fde68a]', 
    text: 'text-[#78350f]', 
    buttonDef: 'border-[#fde68a] bg-white hover:bg-[#fef3c7] hover:border-[#d97706]',
    name: 'Ấm áp' 
  },
  COOL: { 
    container: 'bg-[#f0f9ff] border-[#bae6fd]', 
    text: 'text-[#0c4a6e]', 
    buttonDef: 'border-[#bae6fd] bg-white hover:bg-[#e0f2fe] hover:border-[#0284c7]',
    name: 'Mát mẻ' 
  },
  DARK: { 
    container: 'bg-[#1e293b] border-[#334155]', 
    text: 'text-white', 
    buttonDef: 'border-[#334155] bg-[#0f172a] text-gray-200 hover:bg-[#334155] hover:border-blue-500',
    name: 'Tối' 
  },
};

// --- Sound Utility (Singleton Pattern) ---
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  return audioCtx;
};

const playSound = (type: 'correct' | 'incorrect' | 'click' | 'win' | 'fail') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

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
      case 'correct':
        createOscillator(600, 'sine', now, 0.1, 0.1);
        createOscillator(1000, 'sine', now + 0.1, 0.4, 0.1);
        break;
      case 'incorrect':
        createOscillator(150, 'sawtooth', now, 0.3, 0.1);
        createOscillator(100, 'sawtooth', now + 0.1, 0.3, 0.1);
        break;
      case 'click':
        createOscillator(800, 'sine', now, 0.05, 0.05);
        break;
      case 'win':
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          createOscillator(freq, 'triangle', now + i * 0.15, 0.4, 0.1);
        });
        setTimeout(() => {
             createOscillator(523.25, 'triangle', ctx.currentTime, 1.0, 0.1);
             createOscillator(783.99, 'triangle', ctx.currentTime, 1.0, 0.1);
             createOscillator(1046.50, 'triangle', ctx.currentTime, 1.0, 0.1);
        }, 600);
        break;
       case 'fail':
        createOscillator(400, 'sawtooth', now, 0.3, 0.1);
        createOscillator(350, 'sawtooth', now + 0.3, 0.3, 0.1);
        createOscillator(300, 'sawtooth', now + 0.6, 0.8, 0.1);
        break;
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

// --- Tutorial Content ---
const TUTORIALS: Record<GameType, { title: string; desc: string; tip: string }> = {
  [GameType.MENTAL_MATH]: {
    title: "Tính Nhẩm Thần Tốc",
    desc: "Thực hiện các phép tính Cộng, Trừ, Nhân, Chia nhanh nhất có thể.",
    tip: "Mẹo: Đừng suy nghĩ quá lâu, hãy tin vào trực giác số học của bạn!"
  },
  [GameType.LOGIC_PUZZLE]: {
    title: "Mật Mã Logic",
    desc: "Tìm quy luật ẩn sau các dãy số hoặc hình ảnh.",
    tip: "Mẹo: Quan sát sự tăng/giảm giữa các số liền kề."
  },
  [GameType.REAL_WORLD]: {
    title: "Toán Thực Tế",
    desc: "Giải quyết các bài toán có lời văn gắn liền với cuộc sống hàng ngày.",
    tip: "Mẹo: Đọc kỹ câu hỏi để tìm các dữ kiện quan trọng (số tiền, số lượng)."
  },
  [GameType.TOWER_STACK]: {
    title: "Xây Tháp Trí Tuệ",
    desc: "Sắp xếp các con số theo thứ tự hoặc điền số còn thiếu vào thang leo.",
    tip: "Mẹo: Chú ý yêu cầu 'Tăng dần' hay 'Giảm dần'."
  },
  [GameType.VISUAL_COUNT]: {
    title: "Đếm Hình Đoán Số",
    desc: "Đếm số lượng vật thể trong hình và thực hiện phép tính.",
    tip: "Mẹo: Đếm theo nhóm để nhanh hơn."
  },
  [GameType.WORD_MATCH]: {
    title: "Vua Tiếng Việt",
    desc: "Tìm từ đồng nghĩa, trái nghĩa, hoặc ghép các từ thành câu có nghĩa.",
    tip: "Mẹo: Đọc kỹ ngữ cảnh của câu để chọn từ phù hợp nhất."
  },
  [GameType.POETRY_PUZZLE]: {
    title: "Nhà Thơ Tài Ba",
    desc: "Điền từ còn thiếu vào các câu thơ, ca dao, tục ngữ quen thuộc.",
    tip: "Mẹo: Nhớ lại các bài thơ đã học trong sách giáo khoa."
  },
  [GameType.SPELLING_BEE]: {
    title: "Cảnh Sát Chính Tả",
    desc: "Tìm từ viết đúng chính tả hoặc sửa lỗi sai trong câu.",
    tip: "Mẹo: Chú ý các cặp từ dễ nhầm lẫn như ch/tr, s/x, l/n."
  },
  [GameType.LITERATURE_QUIZ]: {
    title: "Hiểu Biết Văn Học",
    desc: "Trả lời câu hỏi về tác giả, tác phẩm và nhân vật văn học.",
    tip: "Mẹo: Nhớ lại tên các nhân vật trong truyện cổ tích và truyền thuyết."
  },
  [GameType.SENTENCE_BUILDER]: {
    title: "Thợ Xây Câu",
    desc: "Sắp xếp các từ ngữ bị đảo lộn thành một câu hoàn chỉnh và đúng ngữ pháp.",
    tip: "Mẹo: Xác định chủ ngữ và vị ngữ trước khi sắp xếp."
  },
  [GameType.LITERARY_DETECTIVE]: {
    title: "Thám Tử Văn Học",
    desc: "Xác định các biện pháp tu từ (so sánh, nhân hóa, ẩn dụ...) được sử dụng trong câu.",
    tip: "Mẹo: Tìm các từ khóa như 'như', 'là' (so sánh) hoặc các hành động của người gán cho vật (nhân hóa)."
  },
  // ENGLISH TUTORIALS
  [GameType.ENGLISH_VOCAB]: {
    title: "Vua Từ Vựng (Vocabulary)",
    desc: "Chọn nghĩa tiếng Việt đúng cho từ tiếng Anh, hoặc ngược lại. Học từ mới mỗi ngày!",
    tip: "Mẹo: Hãy thử đoán nghĩa dựa trên các từ gốc (root words) nếu bạn không chắc chắn."
  },
  [GameType.ENGLISH_GRAMMAR]: {
    title: "Ngữ Pháp (Grammar)",
    desc: "Chọn đáp án đúng để hoàn thành câu, sử dụng đúng thì và cấu trúc ngữ pháp.",
    tip: "Mẹo: Chú ý đến các dấu hiệu thời gian (yesterday, tomorrow) để chia thì động từ."
  },
  [GameType.ENGLISH_SPELLING]: {
    title: "Đánh Vần (Spelling)",
    desc: "Chọn từ tiếng Anh được viết đúng chính tả trong các lựa chọn.",
    tip: "Mẹo: Đọc to từ đó lên để hình dung cách viết."
  },
  [GameType.ENGLISH_QUIZ]: {
    title: "Đố Vui Tiếng Anh (Quiz)",
    desc: "Trả lời các câu hỏi về kiến thức chung, văn hóa hoặc đọc hiểu ngắn bằng tiếng Anh.",
    tip: "Mẹo: Đọc kỹ câu hỏi và loại trừ các đáp án sai trước."
  },
  [GameType.MIXED_CHALLENGE]: {
    title: "Thử Thách Hỗn Hợp",
    desc: "Một bài kiểm tra toàn diện gồm cả Toán, Tiếng Việt và Tiếng Anh. Độ khó sẽ tăng dần từ Dễ đến Khó!",
    tip: "Mẹo: Hãy sẵn sàng chuyển đổi tư duy giữa tính toán và ngôn ngữ liên tục."
  }
};

export const GameArena: React.FC<GameArenaProps> = ({ 
  gameType, 
  userGrade, 
  mode = GameMode.STANDARD, 
  difficulty,
  questionCount = 5,
  topicFocus,
  onNavigate, 
  onGameComplete 
}) => {
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
  
  // Theme State - Initialize from LocalStorage
  const [bgTheme, setBgTheme] = useState<BgTheme>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('mathviet_bg_theme');
        if (saved && Object.keys(BG_THEMES).includes(saved)) {
          return saved as BgTheme;
        }
      }
    } catch (e) { console.error(e); }
    return 'DEFAULT';
  });

  const [cardTheme, setCardTheme] = useState<CardTheme>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('mathviet_card_theme');
        if (saved && Object.keys(CARD_THEMES).includes(saved)) {
          return saved as CardTheme;
        }
      }
    } catch (e) { console.error(e); }
    return 'CLASSIC';
  });

  const [showAppearanceSettings, setShowAppearanceSettings] = useState(false);
  
  // Refs for Parallax Layers (Performance Optimization)
  const starsRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const planetsRef = useRef<HTMLDivElement>(null);
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  const QUESTION_COUNT = questionCount; // Use prop
  const SPEED_RUN_TIME_PER_Q = 15; // 15 seconds per question average for global timer

  // Persist Themes when changed
  useEffect(() => {
    localStorage.setItem('mathviet_bg_theme', bgTheme);
  }, [bgTheme]);

  useEffect(() => {
    localStorage.setItem('mathviet_card_theme', cardTheme);
  }, [cardTheme]);

  // Initialize game
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      
      // Review Mode Logic
      let reviewContext = undefined;
      if (mode === GameMode.REVIEW) {
        try {
          const mistakes = JSON.parse(localStorage.getItem('mathviet_mistakes') || '[]');
          if (mistakes.length > 0) {
            // Get last 15 mistakes unique by type
            const uniqueTypes = [...new Set(mistakes.slice(-15).map((m: any) => m.topic))];
            reviewContext = uniqueTypes.join(', ');
          } else {
             reviewContext = "General Review (No history found, focus on Grade appropriate mixed review)";
          }
        } catch (e) {
           console.error("Failed to load review data", e);
           reviewContext = "General Mixed Review";
        }
      }

      // Generate questions with enhanced parameters
      const data = await generateGameProblems(userGrade, gameType, QUESTION_COUNT, difficulty, topicFocus, reviewContext);
      setProblems(data);
      setLoading(false);
      setGameActive(true);
      
      const tutorialKey = `tutorial_seen_${gameType}`;
      if (!sessionStorage.getItem(tutorialKey)) {
        setShowTutorial(true);
        sessionStorage.setItem(tutorialKey, 'true');
      }
      
      // Init Timer based on Mode
      if (mode === GameMode.SPEED_RUN) {
        setTimeLeft(QUESTION_COUNT * SPEED_RUN_TIME_PER_Q); 
      } else {
        setTimeLeft(60); 
      }
    };
    fetchProblems();
  }, [gameType, userGrade, mode, difficulty, topicFocus, QUESTION_COUNT]);

  // Timer logic
  useEffect(() => {
    if (!gameActive || timeLeft <= 0 || (mode === GameMode.STANDARD && showExplanation) || (mode === GameMode.REVIEW && showExplanation) || isGameOver || showTutorial) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, showExplanation, isGameOver, mode, showTutorial]);

  // Optimized Mouse Move Parallax Effect
  useEffect(() => {
    if (bgTheme !== 'SPACE') return;

    const handleMouseMove = (e: MouseEvent) => {
      // Direct DOM manipulation avoids React re-renders for high-frequency events
      if (!starsRef.current || !nebulaRef.current || !planetsRef.current) return;

      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      requestAnimationFrame(() => {
        if (starsRef.current) starsRef.current.style.transform = `translate(${x * -0.01}px, ${y * -0.01}px)`; // Far
        if (nebulaRef.current) nebulaRef.current.style.transform = `translate(${x * -0.03}px, ${y * -0.03}px)`; // Mid
        if (planetsRef.current) planetsRef.current.style.transform = `translate(${x * -0.06}px, ${y * -0.06}px)`; // Near
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [bgTheme]);

  // Play win sound when game is over
  useEffect(() => {
    if (isGameOver) {
      if (gameResultState === 'WIN') playSound('win');
      else playSound('fail');
    }
  }, [isGameOver, gameResultState]);

  const handleTimeOut = () => {
    if (mode === GameMode.SPEED_RUN) {
        setGameActive(false);
        setGameResultState('LOSE');
        setIsGameOver(true);
    } else {
        if (!selectedOption) {
            handleAnswer(-1); 
        }
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return; 
    setSelectedOption(index);
    setShowExplanation(true);

    const isCorrect = index === problems[currentIndex].correctAnswerIndex;
    
    if (isCorrect) {
      playSound('correct');
      let points = 100;
      
      const multiplier = mode === GameMode.SPEED_RUN ? 2 : 1;
      const timeBonus = mode === GameMode.STANDARD ? timeLeft * 2 : 0;

      setScore(prev => prev + (points + timeBonus) * multiplier); 
    } else {
      playSound('incorrect');
      // Save Mistake for Review Mode
      try {
        const mistakeEntry = {
            topic: `${gameType} - ${difficulty || 'General'}`,
            timestamp: Date.now()
        };
        const existingMistakes = JSON.parse(localStorage.getItem('mathviet_mistakes') || '[]');
        existingMistakes.push(mistakeEntry);
        // Keep only last 50 mistakes
        if (existingMistakes.length > 50) existingMistakes.shift();
        localStorage.setItem('mathviet_mistakes', JSON.stringify(existingMistakes));
      } catch (e) {
          console.error("Failed to save mistake", e);
      }
    }
  };

  const nextQuestion = () => {
    playSound('click');
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      
      if (mode === GameMode.STANDARD || mode === GameMode.REVIEW) {
        setTimeLeft(60); 
      }
    } else {
      setGameActive(false);
      setIsGameOver(true);
      setGameResultState('WIN');
      
      if (mode === GameMode.SPEED_RUN) {
          setScore(prev => prev + (timeLeft * 5)); 
      }
    }
  };

  const handleFinishGame = () => {
    playSound('click');
    onGameComplete(score);
  };

  // Helper to Render Logic Puzzles visually
  const renderLogicPuzzleContent = (question: string) => {
    const lines = question.split('\n').filter(line => line.trim() !== '');
    
    // Check if the first line is text (contains Vietnamese letters)
    const hasText = /[a-zA-Zà-ỹÀ-Ỹ]/.test(lines[0]);
    let title = '';
    let puzzleLines = lines;

    if (lines.length > 1 && hasText) {
        title = lines[0];
        puzzleLines = lines.slice(1);
    }

    // Parse a single line into visual tokens
    const parseLine = (line: string) => {
        // Split by operators +, -, =, ?, : but keep the delimiters
        // Also trim extra spaces
        return line.split(/([+\-=?:])/g)
            .map(part => part.trim())
            .filter(part => part.length > 0);
    };

    return (
        <div className="w-full flex flex-col items-center mb-8">
            {/* Instruction Banner */}
            {title && (
                <div className="bg-blue-50 px-6 py-3 rounded-full border border-blue-100 shadow-sm mb-6 flex items-center animate-in slide-in-from-top-4">
                   <HelpCircle className="w-5 h-5 text-blue-500 mr-2" />
                   <h3 className="text-lg md:text-xl font-bold text-blue-800 leading-snug">
                      {title}
                   </h3>
                </div>
            )}
            
            {/* Visual Puzzle Area */}
            <div className="flex flex-col gap-4 items-center w-full">
                {puzzleLines.map((line, i) => {
                    const tokens = parseLine(line);
                    const isQuestionRow = line.includes('?');

                    return (
                        <div 
                           key={i} 
                           className={`
                             rounded-2xl p-3 w-full max-w-lg flex flex-wrap items-center justify-center gap-2 md:gap-4 transition-all duration-300
                             ${isQuestionRow 
                               ? 'bg-yellow-50 border-2 border-dashed border-yellow-400 shadow-md scale-105' 
                               : 'bg-white/60 border border-gray-200'
                             }
                           `}
                        >
                            {tokens.map((token, idx) => {
                                // Determine style based on token type
                                const isOperator = ['+', '-', '=', '?', ':'].includes(token);
                                
                                if (isOperator) {
                                   return (
                                     <div key={idx} className={`
                                       w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xl md:text-2xl font-black shadow-inner
                                       ${token === '?' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'}
                                     `}>
                                        {token}
                                     </div>
                                   );
                                } 
                                
                                // Content Tile (Emoji or Number)
                                return (
                                   <div key={idx} className="
                                      bg-white rounded-xl shadow-sm border-b-4 border-gray-200 px-3 py-2 md:px-5 md:py-3
                                      flex items-center justify-center min-w-[50px] md:min-w-[70px]
                                   ">
                                      <span className="text-3xl md:text-5xl leading-none select-none transform hover:scale-110 transition-transform cursor-default">
                                         {token}
                                      </span>
                                   </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  const renderFormattedExplanation = (text: string) => {
    if (gameType === GameType.LOGIC_PUZZLE || gameType === GameType.VISUAL_COUNT) {
      try {
        // Split by common Emoji ranges
        // Note: Using broad ranges for simplicity and robustness in diverse environments
        const parts = text.split(/([\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}])/gu);
        return (
          <span className="block leading-relaxed whitespace-pre-line text-lg">
            {parts.map((part, index) => {
              if (/([\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}])/u.test(part)) {
                return (
                  <span key={index} className="text-3xl inline-block align-middle mx-1 px-1 bg-white/50 rounded-md border border-gray-100 shadow-sm">
                    {part}
                  </span>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </span>
        );
      } catch (e) {
        return text;
      }
    }
    return text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Đang chuẩn bị đề bài từ AI...</h2>
        {mode === GameMode.REVIEW && <p className="text-orange-600 font-semibold mt-2">Chế độ Ôn tập: Đang phân tích lỗi sai cũ...</p>}
        {topicFocus && <p className="text-violet-600 font-semibold mt-2">Chủ đề: {topicFocus}</p>}
        <p className="text-gray-500 mt-1">Vui lòng đợi một chút nhé!</p>
      </div>
    );
  }

  // Result Screen
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 overflow-hidden relative">
        {gameResultState === 'WIN' && <Confetti />}
        
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse-sad {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(0.95); }
          }
        `}</style>

        <div 
          className={`bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center relative z-10
            ${gameResultState === 'WIN' ? 'animate-[popIn_0.6s_ease-out]' : 'animate-[shake_0.5s_ease-in-out]'}
          `}
        >
          <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
             {gameResultState === 'WIN' ? (
                 <>
                     <Sun className="absolute w-full h-full text-yellow-100 animate-[spin-slow_10s_linear_infinite] scale-150" />
                     <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center shadow-lg animate-[float_3s_ease-in-out_infinite] border-4 border-white">
                         <Trophy className="w-12 h-12 text-yellow-600 fill-yellow-100 drop-shadow-sm" />
                     </div>
                     <Sparkles className="absolute -top-2 -right-4 text-yellow-400 w-8 h-8 animate-bounce delay-100" />
                     <Star className="absolute bottom-0 left-0 text-orange-300 w-6 h-6 animate-pulse delay-300 fill-orange-200" />
                 </>
             ) : (
                 <>
                      <CloudRain className="absolute -top-4 -right-4 w-16 h-16 text-gray-300 animate-[float_4s_ease-in-out_infinite]" />
                      <div className="relative z-10 w-24 h-24 bg-red-50 rounded-full flex items-center justify-center shadow-inner animate-[pulse-sad_2s_infinite] border-4 border-white">
                          <XCircle className="w-12 h-12 text-red-500" />
                      </div>
                 </>
             )}
          </div>
          
          {gameResultState === 'WIN' ? (
             <>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-2">Tuyệt Vời!</h2>
                <p className="text-gray-500 mb-6">Bạn đã hoàn thành bài luyện tập xuất sắc.</p>
             </>
          ) : (
             <>
                <h2 className="text-3xl font-extrabold text-gray-700 mb-2">Hết Giờ!</h2>
                <p className="text-gray-500 mb-6">Đừng nản chí, hãy thử lại nhanh hơn nhé!</p>
             </>
          )}
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8 transform hover:scale-105 transition-transform border border-blue-100">
            <div className="text-sm text-blue-600 font-bold uppercase tracking-wide mb-1">Tổng điểm</div>
            <div className="text-4xl font-extrabold text-primary">{score}</div>
            {mode === GameMode.SPEED_RUN && (
                <div className="mt-2 inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
                    ⚡ SPEED RUN x2
                </div>
            )}
            {mode === GameMode.REVIEW && (
                <div className="mt-2 inline-block bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded font-bold">
                    🔄 REVIEW MODE
                </div>
            )}
            {difficulty && mode !== GameMode.REVIEW && (
                <div className="mt-2 text-gray-500 text-xs font-semibold">
                    Độ khó: {difficulty === 'Easy' ? 'Dễ' : difficulty === 'Medium' ? 'Trung bình' : 'Khó'}
                </div>
            )}
          </div>

          <div className="flex gap-3">
             <button 
                onClick={() => window.location.reload()} 
                className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 px-4 rounded-xl transition-all"
             >
                <RotateCcw className="w-5 h-5 mx-auto" />
             </button>
             <button 
                onClick={handleFinishGame}
                className="flex-[3] bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
             >
                <Home className="w-5 h-5 mr-2" /> Về Trang Chủ
             </button>
          </div>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentIndex];
  // Modified to include Logic Puzzle as a Visual Game
  const isVisualGame = gameType === GameType.VISUAL_COUNT || gameType === GameType.LOGIC_PUZZLE;
  const isLogicPuzzle = gameType === GameType.LOGIC_PUZZLE;
  const isSpeedRun = mode === GameMode.SPEED_RUN;
  const isReview = mode === GameMode.REVIEW;

  let backgroundClass = bgTheme !== 'DEFAULT' ? BG_THEMES[bgTheme].class : (isSpeedRun ? 'bg-red-50' : 'bg-slate-100');
  const currentCardTheme = CARD_THEMES[cardTheme];

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden ${backgroundClass}`}>
      
      <style>{`
        @keyframes pop-answer {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
          100% { transform: scale(1); }
        }
        @keyframes shake-answer {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-4px) rotate(-1deg); }
          30% { transform: translateX(4px) rotate(1deg); }
          45% { transform: translateX(-2px) rotate(-1deg); }
          60% { transform: translateX(2px) rotate(1deg); }
          75% { transform: translateX(-1px); }
        }
        .animate-pop-answer { animation: pop-answer 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-shake-answer { animation: shake-answer 0.5s ease-in-out; }
      `}</style>

      {/* Parallax Space Background */}
      {bgTheme === 'SPACE' && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <style>{`
                @keyframes twinkle {
                  0%, 100% { opacity: 0.3; transform: scale(0.8); }
                  50% { opacity: 1; transform: scale(1.2); }
                }
              `}</style>
              
              {/* Layer 1: Stars (Far - Moves slowest) */}
              <div 
                  ref={starsRef}
                  className="absolute inset-0 will-change-transform transition-transform duration-75 ease-out"
              >
                    {[...Array(50)].map((_, i) => (
                      <div 
                          key={i}
                          className="absolute rounded-full bg-white"
                          style={{
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              width: `${Math.random() * 2 + 1}px`,
                              height: `${Math.random() * 2 + 1}px`,
                              opacity: Math.random() * 0.7 + 0.3,
                              animation: `twinkle ${Math.random() * 5 + 2}s infinite ${Math.random() * 2}s`
                          }}
                      />
                    ))}
              </div>

              {/* Layer 2: Nebula/Glows (Mid - Moves medium) */}
              <div 
                  ref={nebulaRef}
                  className="absolute inset-0 will-change-transform transition-transform duration-75 ease-out"
              >
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
              </div>

              {/* Layer 3: Planets/Objects (Front - Moves fastest) */}
              <div 
                  ref={planetsRef}
                  className="absolute inset-0 will-change-transform transition-transform duration-75 ease-out"
              >
                    <div className="absolute top-[15%] right-[10%] text-6xl opacity-40 blur-[1px]">🪐</div>
                    <div className="absolute bottom-[20%] left-[5%] text-4xl opacity-30 blur-[1px]">🌑</div>
                    <div className="absolute top-[60%] right-[20%] text-5xl opacity-20 rotate-12">🛸</div>
                    <div className="absolute top-[10%] left-[30%] text-2xl opacity-60 text-yellow-200">✨</div>
                    <div className="absolute bottom-[15%] right-[40%] w-2 h-2 bg-red-400 rounded-full blur-[2px] animate-pulse"></div>
              </div>
          </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-0 overflow-hidden animate-in zoom-in-95">
             <div className="bg-primary p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                <Info className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">{TUTORIALS[gameType].title}</h3>
                <p className="text-blue-100 text-sm">Hướng dẫn cách chơi</p>
             </div>
             
             <div className="p-8 text-center">
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {TUTORIALS[gameType].desc}
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-start text-left">
                   <Lightbulb className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                   <p className="text-sm text-yellow-800 italic font-medium">
                      {TUTORIALS[gameType].tip}
                   </p>
                </div>

                <button 
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105"
                >
                  Đã Hiểu, Bắt Đầu! 🚀
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showAppearanceSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAppearanceSettings(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
               <h3 className="text-xl font-bold flex items-center text-gray-800">
                 <Palette className="w-6 h-6 mr-2 text-primary" />
                 Tùy chỉnh giao diện
               </h3>
               <button onClick={() => setShowAppearanceSettings(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
             </div>

             <div className="space-y-6">
                <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Hình nền</h4>
                   <div className="grid grid-cols-3 gap-3">
                      {(Object.keys(BG_THEMES) as BgTheme[]).map(key => (
                         <button 
                            key={key}
                            onClick={() => setBgTheme(key)}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${bgTheme === key ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                         >
                            <span className="text-2xl mb-1">{BG_THEMES[key].icon}</span>
                            <span className="text-xs font-bold text-gray-700">{BG_THEMES[key].name}</span>
                         </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Màu sắc thẻ</h4>
                   <div className="grid grid-cols-2 gap-3">
                      {(Object.keys(CARD_THEMES) as CardTheme[]).map(key => (
                         <button 
                            key={key}
                            onClick={() => setCardTheme(key)}
                            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${cardTheme === key ? 'border-primary ring-2 ring-blue-100' : 'border-gray-200'}`}
                         >
                            <div className={`w-full h-8 rounded-md shadow-sm flex items-center justify-center text-xs font-bold ${CARD_THEMES[key].container} ${CARD_THEMES[key].text}`}>
                               {CARD_THEMES[key].name}
                            </div>
                         </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Game Header */}
      <div className={`relative z-10 shadow-sm p-4 flex justify-between items-center px-6 backdrop-blur-md ${cardTheme === 'DARK' ? 'bg-slate-900/80 text-white' : 'bg-white/90'}`}>
        <button 
          onClick={() => { playSound('click'); onNavigate(AppRoute.DASHBOARD); }}
          className={`flex items-center font-bold transition-colors ${cardTheme === 'DARK' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Thoát
        </button>
        
        <div className="flex flex-col items-center">
            <div className={`text-lg font-bold hidden md:block ${cardTheme === 'DARK' ? 'text-blue-400' : 'text-primary'}`}>{gameType}</div>
            {isSpeedRun && (
                <span className="text-xs font-bold text-red-500 animate-pulse flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> CHẾ ĐỘ TỐC ĐỘ
                </span>
            )}
             {isReview && (
                <span className="text-xs font-bold text-orange-500 flex items-center">
                    <RotateCcw className="w-3 h-3 mr-1" /> ÔN TẬP
                </span>
            )}
            {topicFocus && !isReview && (
                <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full mt-1">
                   {topicFocus}
                </span>
            )}
        </div>

        <div className="flex items-center space-x-3">
           <button 
            onClick={() => setShowTutorial(true)}
            className={`p-2 rounded-full transition-colors ${cardTheme === 'DARK' ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title="Hướng dẫn cách chơi"
          >
             <Info className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowAppearanceSettings(true)}
            className={`p-2 rounded-full transition-colors ${cardTheme === 'DARK' ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title="Đổi giao diện"
          >
             <Settings className="w-5 h-5" />
          </button>

          <div className={`flex items-center font-bold px-3 py-1 rounded-full transition-colors ${
              timeLeft < 10 && isSpeedRun ? 'bg-red-500 text-white animate-bounce' : 
              isSpeedRun ? 'bg-red-100 text-red-600' : 'bg-orange-50 text-orange-500'
          }`}>
            <Timer className="w-4 h-4 mr-2" /> {timeLeft}s
          </div>
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
            Điểm: {score}
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col justify-center">
        <div className="w-full bg-black/10 rounded-full h-2.5 mb-8 backdrop-blur-sm">
          <div 
            className={`h-2.5 rounded-full transition-all duration-300 ${isSpeedRun ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
          ></div>
        </div>

        <div className={`rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col border-b-8 transition-colors duration-300 ${currentCardTheme.container} ${currentCardTheme.text}`}>
          <div className="p-8 flex-1 flex flex-col items-center">
            <div className="w-full flex justify-between items-start mb-6">
              <span className="text-sm font-bold opacity-60 uppercase tracking-wider">Câu hỏi {currentIndex + 1}/{problems.length}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                currentProblem.difficulty === 'Easy' ? 'bg-green-400' : 
                currentProblem.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
              }`}>
                {currentProblem.difficulty === 'Easy' ? 'Dễ' : currentProblem.difficulty === 'Medium' ? 'Trung bình' : 'Khó'}
              </span>
            </div>
            
            {/* Logic for displaying content based on Game Type */}
            {isLogicPuzzle ? (
                renderLogicPuzzleContent(currentProblem.question)
            ) : (
                <h2 className={`${isVisualGame ? 'text-5xl md:text-7xl tracking-widest' : 'text-2xl md:text-3xl'} font-bold leading-snug mb-8 text-center`}>
                    {currentProblem.question}
                </h2>
            )}

            <div className={`grid gap-4 w-full ${isLogicPuzzle ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
              {currentProblem.options.map((option, idx) => {
                let btnClass = "";
                let animationClass = "";
                
                if (selectedOption !== null) {
                  if (idx === currentProblem.correctAnswerIndex) {
                    btnClass = "border-green-500 bg-green-50 text-green-700 z-10 ring-2 ring-green-200 ring-offset-2";
                    animationClass = "animate-pop-answer";
                  } else if (idx === selectedOption) {
                    btnClass = "border-red-500 bg-red-50 text-red-700 z-10";
                    animationClass = "animate-shake-answer";
                  } else {
                    btnClass = "border-gray-200 opacity-40 cursor-not-allowed scale-95";
                  }
                } else {
                  btnClass = currentCardTheme.buttonDef;
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`rounded-xl font-bold transition-all duration-200 relative border-2 ${btnClass} ${animationClass}
                      ${isLogicPuzzle 
                          ? 'aspect-square flex flex-col items-center justify-center text-6xl md:text-7xl p-4 hover:scale-105 shadow-md' 
                          : isVisualGame 
                              ? 'p-6 text-center text-4xl' 
                              : 'p-6 text-left text-lg'
                      }
                    `}
                  >
                     {!isVisualGame && !isLogicPuzzle && <span className="mr-3 opacity-60">{String.fromCharCode(65 + idx)}.</span>}
                     {option}
                     {selectedOption !== null && idx === currentProblem.correctAnswerIndex && (
                       <CheckCircle className="absolute right-2 top-2 text-green-500 w-6 h-6 animate-in zoom-in spin-in duration-300" />
                     )}
                     {selectedOption === idx && idx !== currentProblem.correctAnswerIndex && (
                       <XCircle className="absolute right-2 top-2 text-red-500 w-6 h-6 animate-in zoom-in" />
                     )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Footer */}
          {showExplanation && (
            <div className={`p-6 border-t animate-in slide-in-from-bottom-5 duration-300 ${cardTheme === 'DARK' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${cardTheme === 'DARK' ? 'text-gray-200' : 'text-gray-800'}`}>Giải thích:</h4>
                  <div className={`${cardTheme === 'DARK' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {renderFormattedExplanation(currentProblem.explanation)}
                  </div>
                </div>
                <button
                  onClick={nextQuestion}
                  className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 flex items-center shrink-0"
                >
                  Tiếp theo <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
