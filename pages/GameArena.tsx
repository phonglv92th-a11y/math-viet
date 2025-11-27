
import React, { useState, useEffect, useRef } from 'react';
import { AppRoute, GameType, MathProblem, GameMode } from '../types';
import { generateGameProblems } from '../services/geminiService';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Timer, Loader2, Trophy, Home, RotateCcw, Zap, Sun, CloudRain, Sparkles, Star, Palette, Settings, X, Info, Lightbulb, HelpCircle, Volume2, VolumeX, Grid, Fingerprint, Eraser } from 'lucide-react';
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
    container: 'bg-white border-gray-200 shadow-xl', 
    text: 'text-gray-800', 
    buttonDef: 'bg-white border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 hover:bg-gray-50',
    name: 'Cổ điển' 
  },
  WARM: { 
    container: 'bg-[#fffbeb] border-[#fde68a] shadow-xl', 
    text: 'text-[#78350f]', 
    buttonDef: 'bg-white border-b-4 border-[#fde68a] active:border-b-0 active:translate-y-1 hover:bg-[#fef3c7]',
    name: 'Ấm áp' 
  },
  COOL: { 
    container: 'bg-[#f0f9ff] border-[#bae6fd] shadow-xl', 
    text: 'text-[#0c4a6e]', 
    buttonDef: 'bg-white border-b-4 border-[#bae6fd] active:border-b-0 active:translate-y-1 hover:bg-[#e0f2fe]',
    name: 'Mát mẻ' 
  },
  DARK: { 
    container: 'bg-[#1e293b] border-[#334155] shadow-2xl shadow-black/50', 
    text: 'text-white', 
    buttonDef: 'bg-[#0f172a] text-gray-200 border-b-4 border-[#334155] active:border-b-0 active:translate-y-1 hover:bg-[#334155]',
    name: 'Tối' 
  },
};

// Word Search Highlight Colors
const HIGHLIGHT_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#f43f5e', // Rose
];

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

const playSound = (type: 'correct' | 'incorrect' | 'click' | 'win' | 'fail' | 'pop') => {
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
      case 'pop':
        createOscillator(1200, 'sine', now, 0.05, 0.05);
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
  [GameType.WORD_SEARCH]: {
    title: "Truy Tìm Từ Vựng",
    desc: "Tìm các từ vựng ẩn trong bảng chữ cái. Các từ có thể nằm ngang, dọc hoặc chéo. Kéo tay qua các chữ cái để nối chúng.",
    tip: "Mẹo: Tìm chữ cái đầu tiên của từ cần tìm trước."
  },
  [GameType.CROSSWORD]: {
    title: "Ô Chữ Bí Ẩn",
    desc: "Giải ô chữ dựa trên gợi ý hàng ngang và hàng dọc. Điền các chữ cái vào ô trống để hoàn thành.",
    tip: "Mẹo: Bắt đầu với những từ bạn chắc chắn nhất để mở khóa các từ giao nhau."
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
  },
  // SCIENCE & HISTORY
  [GameType.PHYSICS_QUIZ]: {
    title: "Nhà Vật Lý Tài Ba",
    desc: "Trả lời các câu hỏi trắc nghiệm về các hiện tượng vật lý, công thức và định luật.",
    tip: "Mẹo: Nhớ kỹ các đơn vị đo lường cơ bản."
  },
  [GameType.CHEMISTRY_LAB]: {
    title: "Phòng Thí Nghiệm Hóa Học",
    desc: "Kiểm tra kiến thức về các nguyên tố, phản ứng hóa học và bảng tuần hoàn.",
    tip: "Mẹo: Chú ý hóa trị của các nguyên tố."
  },
  [GameType.BIOLOGY_LIFE]: {
    title: "Thế Giới Sinh Học",
    desc: "Khám phá thế giới tự nhiên từ tế bào, thực vật, động vật đến cơ thể người.",
    tip: "Mẹo: Liên hệ các kiến thức với cơ thể của chính mình."
  },
  [GameType.HISTORY_TIMELINE]: {
    title: "Dòng Chảy Lịch Sử",
    desc: "Trả lời các câu hỏi về các sự kiện, nhân vật lịch sử Việt Nam và Thế giới.",
    tip: "Mẹo: Ghi nhớ các mốc thời gian quan trọng."
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
  
  // Word Search State
  const [gridState, setGridState] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<{word: string, start: {r:number, c:number}, end: {r:number, c:number}, color: string}[]>([]);
  const [currentSelection, setCurrentSelection] = useState<{row: number, col: number}[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{row: number, col: number} | null>(null);

  // Crossword State
  const [cwGrid, setCwGrid] = useState<{char: string, row: number, col: number, clueRef: number | null}[]>([]);
  const [cwClues, setCwClues] = useState<{id: number, word: string, clue: string, direction: 'across' | 'down', row: number, col: number}[]>([]);
  const [cwUserInputs, setCwUserInputs] = useState<Record<string, string>>({}); // "r-c": "A"
  const [cwSelectedClue, setCwSelectedClue] = useState<number | null>(null);

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

  // Word Search Grid Generation (When currentIndex changes)
  useEffect(() => {
    if (gameType === GameType.WORD_SEARCH && problems.length > 0) {
      const words = problems[currentIndex].options.map(w => w.toUpperCase());
      const size = 10;
      const grid = Array(size).fill('').map(() => Array(size).fill(''));

      // Place words
      words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
          const direction = Math.floor(Math.random() * 3); // 0: Horizontal, 1: Vertical, 2: Diagonal
          const row = Math.floor(Math.random() * size);
          const col = Math.floor(Math.random() * size);
          
          let fits = true;
          for (let i = 0; i < word.length; i++) {
            let r = row;
            let c = col;
            if (direction === 0) c += i;
            if (direction === 1) r += i;
            if (direction === 2) { r += i; c += i; }

            if (r >= size || c >= size || (grid[r][c] !== '' && grid[r][c] !== word[i])) {
              fits = false;
              break;
            }
          }

          if (fits) {
            for (let i = 0; i < word.length; i++) {
              let r = row;
              let c = col;
              if (direction === 0) c += i;
              if (direction === 1) r += i;
              if (direction === 2) { r += i; c += i; }
              grid[r][c] = word[i];
            }
            placed = true;
          }
          attempts++;
        }
      });

      // Fill empty with random
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
          if (grid[r][c] === '') grid[r][c] = chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      setGridState(grid);
      setFoundWords([]);
      setCurrentSelection([]);
      setSelectionStart(null);
    }
  }, [currentIndex, problems, gameType]);

  // Crossword Layout Generation (Simple Logic)
  useEffect(() => {
    if (gameType === GameType.CROSSWORD && problems.length > 0) {
      const rawOptions = problems[currentIndex].options; // "WORD|Clue"
      const parsedItems = rawOptions.map((opt, id) => {
        const [word, clue] = opt.split('|');
        return { id, word: word.toUpperCase(), clue, len: word.length };
      }).sort((a,b) => b.len - a.len); // Longest first

      // Simple Layout Algorithm
      // Updated Logic: Just list them as "Across" clues. 
      // This turns it into a "Fill the grid" game which is still playable.
      const simpleLayout = parsedItems.map((item, idx) => ({
         ...item,
         direction: 'across' as const,
         row: idx * 2,
         col: 1
      }));
      
      setCwClues(simpleLayout);
      setCwUserInputs({});
      setCwSelectedClue(null);
    }
  }, [currentIndex, problems, gameType]);


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
    
    // Logic for Word Search & Crossword handled separately
    if (gameType === GameType.WORD_SEARCH || gameType === GameType.CROSSWORD) {
       // Only used for "skipping" or finalizing
       setScore(prev => prev + 50); // Small consolation
    } else if (isCorrect) {
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

  // Word Search Selection Logic
  const handleGridMouseDown = (row: number, col: number) => {
    playSound('pop');
    setIsSelecting(true);
    setSelectionStart({row, col});
    setCurrentSelection([{row, col}]);
  };

  const handleGridMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;

    // Calculate line from start to current
    const dx = row - selectionStart.row;
    const dy = col - selectionStart.col;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    // Only allow horizontal, vertical, or perfect diagonal
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
       const newSelection = [];
       for(let i=0; i<=steps; i++) {
         newSelection.push({
           row: selectionStart.row + Math.round(i * (dx/steps) || 0),
           col: selectionStart.col + Math.round(i * (dy/steps) || 0)
         });
       }
       setCurrentSelection(newSelection);
    }
  };

  const handleGridMouseUp = () => {
    setIsSelecting(false);
    if (currentSelection.length < 2) {
       setCurrentSelection([]);
       setSelectionStart(null);
       return;
    }

    const selectedWord = currentSelection.map(c => gridState[c.row][c.col]).join('');
    const targetWords = problems[currentIndex].options.map(w => w.toUpperCase());
    
    // Check if word is valid and not already found
    if (targetWords.includes(selectedWord) && !foundWords.some(f => f.word === selectedWord)) {
      playSound('correct');
      // Calculate random distinct color
      const color = HIGHLIGHT_COLORS[foundWords.length % HIGHLIGHT_COLORS.length];
      
      const start = currentSelection[0];
      const end = currentSelection[currentSelection.length - 1];

      const newFound = [...foundWords, { 
          word: selectedWord, 
          start: { r: start.row, c: start.col },
          end: { r: end.row, c: end.col },
          color 
      }];
      setFoundWords(newFound);
      setScore(prev => prev + 100);

      // Check if all found
      if (newFound.length === targetWords.length) {
         playSound('win');
         setTimeout(() => {
             handleAnswer(0); // Mark problem as done
         }, 1500);
      }
    } else {
       playSound('incorrect');
    }
    setCurrentSelection([]);
    setSelectionStart(null);
  };
  
  // Mobile Touch Support for Grid
  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
      e.preventDefault(); // Prevent scroll
      handleGridMouseDown(row, col);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
     e.preventDefault();
     const touch = e.touches[0];
     const element = document.elementFromPoint(touch.clientX, touch.clientY);
     if (element && element.hasAttribute('data-row')) {
        const row = parseInt(element.getAttribute('data-row')!);
        const col = parseInt(element.getAttribute('data-col')!);
        handleGridMouseEnter(row, col);
     }
  };

  // Crossword Handlers
  const handleCrosswordInput = (row: number, col: number, val: string) => {
    const key = `${row}-${col}`;
    setCwUserInputs(prev => ({...prev, [key]: val.toUpperCase()}));
    
    // Auto check if whole word is filled
    // (Simplified check logic)
    // In a real app, verify whole grid
    
    // Check completion
    const totalCells = cwClues.reduce((acc, curr) => acc + curr.word.length, 0);
    const filledCells = Object.keys(cwUserInputs).length + (val ? 1 : 0);
    
    if (filledCells >= totalCells) {
       // Validate
       let allCorrect = true;
       cwClues.forEach(clue => {
          for(let i=0; i<clue.word.length; i++) {
             const r = clue.direction === 'across' ? clue.row : clue.row + i;
             const c = clue.direction === 'across' ? clue.col + i : clue.col;
             const input = val && (r===row && c===col) ? val.toUpperCase() : cwUserInputs[`${r}-${c}`];
             if (input !== clue.word[i]) allCorrect = false;
          }
       });
       
       if (allCorrect) {
          playSound('win');
          setTimeout(() => handleAnswer(0), 1000);
       }
    }
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
                                      <span className="text-4xl md:text-6xl leading-none select-none transform hover:scale-110 transition-transform cursor-default">
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
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-lg w-full text-center relative z-10 animate-[popIn_0.6s_ease-out]">
          {/* Badge / Icon */}
          <div className="relative w-40 h-40 mx-auto -mt-24 mb-6 flex items-center justify-center">
             {gameResultState === 'WIN' ? (
                 <>
                     <Sun className="absolute w-full h-full text-yellow-200 animate-[spin-slow_10s_linear_infinite] scale-150 opacity-60" />
                     <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-2xl animate-[float_3s_ease-in-out_infinite] border-4 border-white ring-4 ring-yellow-100">
                         <Trophy className="w-16 h-16 text-white drop-shadow-md" />
                     </div>
                     <Sparkles className="absolute -top-2 -right-4 text-yellow-400 w-10 h-10 animate-bounce delay-100" />
                     <Star className="absolute bottom-0 left-0 text-orange-300 w-8 h-8 animate-pulse delay-300 fill-orange-200" />
                 </>
             ) : (
                 <>
                      <CloudRain className="absolute -top-4 -right-4 w-20 h-20 text-gray-300 animate-[float_4s_ease-in-out_infinite]" />
                      <div className="relative z-10 w-32 h-32 bg-red-100 rounded-full flex items-center justify-center shadow-inner animate-pulse border-4 border-white ring-4 ring-red-50">
                          <XCircle className="w-16 h-16 text-red-500" />
                      </div>
                 </>
             )}
          </div>
          
          <h2 className={`text-4xl font-extrabold mb-2 ${gameResultState === 'WIN' ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600' : 'text-gray-700'}`}>
            {gameResultState === 'WIN' ? 'Tuyệt Vời!' : 'Hết Giờ!'}
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
             {gameResultState === 'WIN' ? 'Bạn đã hoàn thành bài luyện tập xuất sắc.' : 'Đừng nản chí, hãy thử lại nhanh hơn nhé!'}
          </p>
          
          {/* Score Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                <Trophy size={100} />
            </div>
            <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Tổng điểm nhận được</div>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 tracking-tight">
                {score}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {mode === GameMode.SPEED_RUN && (
                    <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-bold flex items-center border border-red-200">
                        ⚡ Speed Run x2
                    </span>
                )}
                {difficulty && (
                    <span className="bg-white text-gray-600 text-xs px-3 py-1 rounded-full font-bold border border-gray-200 shadow-sm">
                        {difficulty}
                    </span>
                )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
             <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center text-lg border-b-4 border-emerald-700 active:border-b-0 active:mt-1"
             >
                <RotateCcw className="w-6 h-6 mr-2" /> Chơi Lại
             </button>

             <button 
                onClick={handleFinishGame}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl border-2 border-gray-200 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center text-lg hover:border-blue-300 hover:text-blue-600"
             >
                <Home className="w-6 h-6 mr-2" /> Trang Chủ
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
  const isWordSearch = gameType === GameType.WORD_SEARCH;
  const isCrossword = gameType === GameType.CROSSWORD;
  const isSpeedRun = mode === GameMode.SPEED_RUN;
  const isReview = mode === GameMode.REVIEW;

  let backgroundClass = bgTheme !== 'DEFAULT' ? BG_THEMES[bgTheme].class : (isSpeedRun ? 'bg-red-50' : 'bg-slate-100');
  const currentCardTheme = CARD_THEMES[cardTheme];

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden ${backgroundClass}`}>
      
      <style>{`
        @keyframes pop-answer {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes shake-answer {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-2deg); }
          30% { transform: translateX(6px) rotate(2deg); }
          45% { transform: translateX(-4px) rotate(-2deg); }
          60% { transform: translateX(4px) rotate(2deg); }
          75% { transform: translateX(-2px); }
        }
        .animate-pop-answer { animation: pop-answer 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
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
      <div className={`relative z-10 p-4 flex justify-between items-center px-4 md:px-8`}>
        <button 
          onClick={() => { playSound('click'); onNavigate(AppRoute.DASHBOARD); }}
          className={`flex items-center font-bold px-4 py-2 rounded-full backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95 ${cardTheme === 'DARK' ? 'bg-slate-800/80 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
        </button>
        
        {/* Game Badge Center */}
        <div className="flex flex-col items-center">
            <div className={`text-xs md:text-sm font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-sm backdrop-blur-md ${cardTheme === 'DARK' ? 'bg-slate-800/80 text-blue-300' : 'bg-white/80 text-primary'}`}>
                {gameType}
            </div>
            {isSpeedRun && (
                <span className="mt-1 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full animate-pulse shadow-red-200 shadow-md">
                   ⚡ SPEED RUN
                </span>
            )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
           {/* Utility Buttons */}
           <div className="hidden md:flex gap-2">
             <button onClick={() => setShowTutorial(true)} className="p-2 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-md transition-all text-gray-600"><HelpCircle size={20}/></button>
             <button onClick={() => setShowAppearanceSettings(true)} className="p-2 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-md transition-all text-gray-600"><Settings size={20}/></button>
           </div>

           {/* Stats Pills */}
           <div className={`flex items-center font-bold px-4 py-2 rounded-full shadow-sm backdrop-blur-md border border-white/20 ${
              timeLeft < 10 && isSpeedRun ? 'bg-red-500 text-white animate-bounce' : 
              isSpeedRun ? 'bg-red-100/90 text-red-600' : 'bg-white/80 text-orange-500'
           }`}>
             <Timer className="w-4 h-4 mr-2" /> {timeLeft}s
           </div>
           
           <div className="bg-white/80 text-blue-600 px-4 py-2 rounded-full font-bold shadow-sm backdrop-blur-md border border-white/20">
             {score} pts
           </div>
        </div>
      </div>

      {/* Progress Bar Top */}
      <div className="absolute top-0 left-0 w-full h-1.5 z-20">
         <div className="w-full bg-gray-200/30 h-full backdrop-blur-sm">
            <div 
              className={`h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)] ${isSpeedRun ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`}
              style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
            ></div>
         </div>
      </div>

      {/* Game Content Container */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto p-4 flex flex-col justify-center items-center">
        
        <div className={`w-full rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-300 ${currentCardTheme.container} border-0`}>
          
          {/* Question Area */}
          <div className="p-8 md:p-12 flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-white/50 to-transparent">
             
             {/* Difficulty Badge */}
             <div className="absolute top-6 right-6 z-20">
                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white shadow-md ${
                  currentProblem.difficulty === 'Easy' ? 'bg-green-400' : 
                  currentProblem.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
                }`}>
                  {currentProblem.difficulty === 'Easy' ? 'Dễ' : currentProblem.difficulty === 'Medium' ? 'Trung bình' : 'Khó'}
                </span>
             </div>

             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Câu hỏi {currentIndex + 1} / {problems.length}</div>
            
            {/* Logic for displaying content based on Game Type */}
            {isLogicPuzzle ? (
                renderLogicPuzzleContent(currentProblem.question)
            ) : isWordSearch ? (
               // --- WORD SEARCH INTERFACE (OVERHAULED) ---
               <div className="w-full flex flex-col select-none relative">
                   <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600 pb-1">
                      {currentProblem.question}
                   </h2>

                   <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
                      {/* Grid Container */}
                      <div className="relative p-3 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)] border-4 border-purple-100">
                         
                         {/* Decorative Corner Elements */}
                         <div className="absolute -top-6 -left-6 text-4xl transform -rotate-12 animate-bounce">🥕</div>
                         <div className="absolute -bottom-6 -right-6 text-4xl transform rotate-12 animate-pulse">🍇</div>

                         <div 
                              className="relative touch-none"
                              style={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: `repeat(10, 1fr)`, 
                                  gap: '2px'
                              }}
                              onMouseUp={handleGridMouseUp}
                              onTouchEnd={handleGridMouseUp}
                          >
                             {/* SVG Overlay for Lines */}
                             <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                                {/* Found Words Lines */}
                                {foundWords.map((fw, idx) => {
                                    // Calculate coordinates based on percentages
                                    const x1 = (fw.start.c * 10) + 5 + '%';
                                    const y1 = (fw.start.r * 10) + 5 + '%';
                                    const x2 = (fw.end.c * 10) + 5 + '%';
                                    const y2 = (fw.end.r * 10) + 5 + '%';
                                    return (
                                        <line 
                                            key={idx} 
                                            x1={x1} y1={y1} x2={x2} y2={y2} 
                                            stroke={fw.color} 
                                            strokeWidth="7%" 
                                            strokeLinecap="round" 
                                            opacity="0.5" 
                                        />
                                    );
                                })}

                                {/* Current Selection Line */}
                                {isSelecting && selectionStart && currentSelection.length > 0 && (
                                    <line 
                                        x1={(selectionStart.col * 10) + 5 + '%'} 
                                        y1={(selectionStart.row * 10) + 5 + '%'} 
                                        x2={(currentSelection[currentSelection.length-1].col * 10) + 5 + '%'} 
                                        y2={(currentSelection[currentSelection.length-1].row * 10) + 5 + '%'} 
                                        stroke="#8b5cf6" 
                                        strokeWidth="7%" 
                                        strokeLinecap="round" 
                                        opacity="0.6"
                                    />
                                )}
                             </svg>

                             {gridState.map((row, rIdx) => 
                                row.map((cell, cIdx) => (
                                     <div
                                        key={`${rIdx}-${cIdx}`}
                                        data-row={rIdx}
                                        data-col={cIdx}
                                        onMouseDown={() => handleGridMouseDown(rIdx, cIdx)}
                                        onMouseEnter={() => handleGridMouseEnter(rIdx, cIdx)}
                                        onTouchStart={(e) => handleTouchStart(e, rIdx, cIdx)}
                                        onTouchMove={handleTouchMove}
                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-base md:text-xl uppercase text-slate-700 bg-purple-50/30 rounded-full cursor-pointer hover:bg-purple-100 transition-colors z-0 select-none"
                                     >
                                        {cell}
                                     </div>
                                ))
                             )}
                          </div>
                      </div>

                      {/* Word List Panel */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 shadow-lg min-w-[220px] relative overflow-hidden">
                          {/* Paper Texture Effect */}
                          <div className="absolute top-0 left-0 w-full h-4 bg-black/5 mask-image-teeth"></div>
                          
                          <h3 className="font-bold text-yellow-800 uppercase text-xs mb-4 flex items-center justify-center bg-white/50 py-1 rounded-full">
                             <Fingerprint className="w-4 h-4 mr-1" /> Danh sách từ
                          </h3>

                          <div className="flex flex-col gap-3">
                             {currentProblem.options.map((word, idx) => {
                                const foundData = foundWords.find(f => f.word === word.toUpperCase());
                                const isFound = !!foundData;
                                
                                return (
                                   <div 
                                      key={idx}
                                      className={`
                                        flex items-center justify-between px-3 py-2 rounded-lg font-bold text-sm border transition-all duration-300
                                        ${isFound 
                                            ? 'bg-white border-transparent shadow-sm scale-105' 
                                            : 'bg-white/40 border-yellow-100 text-gray-500'
                                        }
                                      `}
                                      style={isFound ? { color: foundData.color, borderColor: foundData.color } : {}}
                                   >
                                      <span className={isFound ? 'line-through decoration-2' : ''}>{word}</span>
                                      {isFound && <CheckCircle className="w-4 h-4" />}
                                   </div>
                                )
                             })}
                          </div>
                          
                          <div className="mt-8 text-center bg-white/60 rounded-xl p-3 backdrop-blur-sm">
                             <div className="text-[10px] text-gray-500 font-bold uppercase">Tiến độ</div>
                             <div className="text-3xl font-black text-gray-800 tracking-tighter">
                                {foundWords.length}<span className="text-lg text-gray-400">/{currentProblem.options.length}</span>
                             </div>
                             <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div 
                                    className="bg-green-500 h-full transition-all duration-500" 
                                    style={{ width: `${(foundWords.length / currentProblem.options.length) * 100}%` }}
                                ></div>
                             </div>
                          </div>
                      </div>
                   </div>
               </div>
            ) : isCrossword ? (
               // --- CROSSWORD INTERFACE ---
               <div className="w-full flex flex-col items-center">
                  <h2 className="text-2xl font-bold mb-6 text-indigo-700">{currentProblem.question}</h2>
                  
                  {/* Grid Area */}
                  <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
                      {/* Clue List */}
                      <div className="flex-1 space-y-3 bg-indigo-50 p-4 rounded-xl h-fit">
                         <h3 className="font-bold text-indigo-900 mb-2">Gợi ý</h3>
                         {cwClues.map((clue, idx) => {
                             const isComplete = clue.word.split('').every((char, i) => {
                                const r = clue.row;
                                const c = clue.col + i; // Assuming only horizontal for simplicity MVP
                                return cwUserInputs[`${r}-${c}`] === char;
                             });

                             return (
                               <div 
                                 key={idx} 
                                 className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isComplete ? 'bg-green-100 border-green-200 text-green-800' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
                                 onClick={() => setCwSelectedClue(idx)}
                               >
                                  <div className="flex justify-between">
                                     <span className="font-bold mr-2 text-indigo-500">#{idx + 1}</span>
                                     <span className="text-xs font-mono bg-gray-100 px-1 rounded self-start">{clue.word.length} ký tự</span>
                                  </div>
                                  <p className="text-sm mt-1">{clue.clue}</p>
                               </div>
                             );
                         })}
                      </div>

                      {/* The Grid (Simplified horizontal stack for MVP as per logic limitations) */}
                      <div className="flex-[2] bg-white p-6 rounded-xl shadow-inner border-2 border-indigo-100">
                          <div className="flex flex-col gap-4">
                             {cwClues.map((clue, idx) => (
                                <div key={idx} className={`flex items-center ${cwSelectedClue === idx ? 'bg-yellow-50 rounded-lg p-2 -mx-2' : 'p-2'}`}>
                                   <span className="font-bold text-indigo-400 w-8">#{idx+1}</span>
                                   <div className="flex gap-1">
                                      {clue.word.split('').map((char, charIdx) => {
                                         const key = `${clue.row}-${clue.col + charIdx}`; // Simplified mapping
                                         const val = cwUserInputs[key] || '';
                                         const isCorrect = val === char;
                                         
                                         return (
                                            <div key={charIdx} className="relative w-8 h-8 md:w-10 md:h-10">
                                              <input 
                                                type="text"
                                                maxLength={1}
                                                value={val}
                                                onChange={(e) => handleCrosswordInput(clue.row, clue.col + charIdx, e.target.value)}
                                                className={`w-full h-full text-center border-2 rounded-md font-bold text-lg uppercase outline-none focus:border-indigo-500 focus:border-2 focus:ring-2 focus:ring-indigo-200 ${isCorrect ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-300'}`}
                                              />
                                            </div>
                                         );
                                      })}
                                   </div>
                                </div>
                             ))}
                          </div>
                      </div>
                  </div>
               </div>
            ) : (
                <div className="w-full text-center">
                   <h2 className={`${isVisualGame ? 'text-6xl md:text-8xl tracking-wider' : 'text-3xl md:text-5xl'} font-extrabold leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-600 pb-2`}>
                       {currentProblem.question}
                   </h2>
                </div>
            )}

            {/* Answer Grid (Hidden for Word Search & Crossword) */}
            {!isWordSearch && !isCrossword && (
              <div className={`grid gap-4 md:gap-6 w-full ${isLogicPuzzle ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                {currentProblem.options.map((option, idx) => {
                  let btnClass = "";
                  let animationClass = "";
                  let statusIcon = null;
                  
                  if (selectedOption !== null) {
                    // Reveal Phase
                    if (idx === currentProblem.correctAnswerIndex) {
                      btnClass = "bg-green-100 border-green-400 text-green-800 scale-[1.02] shadow-green-200 shadow-lg border-b-4";
                      animationClass = "animate-pop-answer";
                      statusIcon = <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-6 h-6 animate-in zoom-in" />;
                    } else if (idx === selectedOption) {
                      btnClass = "bg-red-100 border-red-400 text-red-800 border-b-4";
                      animationClass = "animate-shake-answer";
                      statusIcon = <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 w-6 h-6 animate-in zoom-in" />;
                    } else {
                      btnClass = "bg-gray-50 border-gray-200 text-gray-400 opacity-50 border-b-2";
                    }
                  } else {
                    // Default Phase
                    btnClass = currentCardTheme.buttonDef;
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswer(idx)}
                      className={`rounded-2xl font-bold transition-all duration-200 relative text-left group
                        ${btnClass} ${animationClass}
                        ${isLogicPuzzle 
                            ? 'aspect-square flex flex-col items-center justify-center text-6xl md:text-7xl p-2 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:border-purple-300' 
                            : isVisualGame 
                                ? 'p-8 text-center text-4xl' 
                                : 'p-5 px-6 text-xl md:text-2xl'
                        }
                      `}
                    >
                       {/* ABC Label for standard text questions */}
                       {!isVisualGame && !isLogicPuzzle && (
                          <span className={`inline-block w-8 h-8 rounded-lg text-sm flex items-center justify-center mr-3 font-bold transition-colors ${
                               selectedOption === idx ? 'bg-black/10' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                          }`}>
                              {String.fromCharCode(65 + idx)}
                          </span>
                       )}
                       
                       <span className="relative z-10">{option}</span>
                       {statusIcon}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Explanation Footer (Animated Slide Up) */}
          {showExplanation && (
            <div className={`p-6 md:p-8 animate-in slide-in-from-bottom-10 duration-500 border-t ${cardTheme === 'DARK' ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50/80 border-blue-100'} backdrop-blur-md`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 w-full">
                  <div className="flex items-center mb-2">
                     <div className="bg-blue-100 p-1.5 rounded-lg mr-2"><Lightbulb className="w-4 h-4 text-blue-600" /></div>
                     <h4 className={`font-bold uppercase tracking-wider text-xs ${cardTheme === 'DARK' ? 'text-blue-300' : 'text-blue-700'}`}>Giải thích chi tiết</h4>
                  </div>
                  <div className={`text-lg leading-relaxed ${cardTheme === 'DARK' ? 'text-gray-200' : 'text-slate-700'}`}>
                    {renderFormattedExplanation(currentProblem.explanation)}
                  </div>
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center border-b-4 border-blue-700 active:border-b-0 active:mt-1"
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
