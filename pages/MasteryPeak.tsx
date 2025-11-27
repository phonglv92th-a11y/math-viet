
import React, { useState, useEffect } from 'react';
import { AppRoute, GameType, MathProblem } from '../types';
import { generateGameProblems } from '../services/geminiService';
import { ArrowLeft, Heart, Zap, Trophy, Loader2, CheckCircle, XCircle, Flag, MapPin, Home, Play } from 'lucide-react';
import { Confetti } from '../components/Confetti';
import { MathRenderer } from '../components/MathRenderer';

interface MasteryPeakProps {
  userGrade: number;
  onNavigate: (route: AppRoute) => void;
  onGameComplete: (score: number) => void;
  currentHighScore: number;
}

// Map Configuration: 18 Steps (Added 3 points at base, capped peak at 90%)
// Coordinates: { left: %, bottom: % } relative to the MOUNTAIN CONTAINER
// Designed to fit strictly within the SVG triangle (Peak at y=10 -> bottom 90%)
const MOUNTAIN_PATH = [
  { left: 30, bottom: 5 },    // 1. Base Start (Narrower)
  { left: 70, bottom: 9 },    // 2.
  { left: 35, bottom: 14 },   // 3.
  { left: 65, bottom: 19 },   // 4.
  { left: 40, bottom: 24 },   // 5.
  { left: 60, bottom: 29 },   // 6. Checkpoint 1
  { left: 38, bottom: 34 },   // 7.
  { left: 62, bottom: 39 },   // 8.
  { left: 42, bottom: 44 },   // 9.
  { left: 58, bottom: 49 },   // 10.
  { left: 44, bottom: 54 },   // 11. Checkpoint 2
  { left: 56, bottom: 59 },   // 12.
  { left: 46, bottom: 64 },   // 13.
  { left: 54, bottom: 69 },   // 14.
  { left: 48, bottom: 74 },   // 15.
  { left: 52, bottom: 79 },   // 16. Checkpoint 3
  { left: 50, bottom: 84 },   // 17.
  { left: 50, bottom: 90 },   // 18. THE PEAK (Exactly at SVG tip y=10)
];

const CHECKPOINTS = [5, 10, 15]; // Indices of checkpoints (0-based) for 18 steps

export const MasteryPeak: React.FC<MasteryPeakProps> = ({ userGrade, onNavigate, onGameComplete, currentHighScore }) => {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'LOADING' | 'PLAYING' | 'GAMEOVER_WIN' | 'GAMEOVER_LOSE'>('LOADING');
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<'NONE' | 'CORRECT' | 'INCORRECT'>('NONE');
  const [avatarDirection, setAvatarDirection] = useState<'left' | 'right'>('right');

  // Load exactly number of questions to match steps
  useEffect(() => {
    const initGame = async () => {
      setLoading(true);
      const data = await generateGameProblems(userGrade, GameType.MIXED_CHALLENGE, MOUNTAIN_PATH.length, 'Medium', 'Increasing difficulty');
      setProblems(data);
      setLoading(false);
      setGameState('PLAYING');
    };
    initGame();
  }, [userGrade]);

  // Determine avatar face direction
  useEffect(() => {
    if (currentStep < MOUNTAIN_PATH.length - 1) {
      const currentX = MOUNTAIN_PATH[currentStep].left;
      const nextX = MOUNTAIN_PATH[currentStep + 1].left;
      setAvatarDirection(nextX > currentX ? 'right' : 'left');
    }
  }, [currentStep]);

  const handleAnswer = (index: number) => {
    if (feedbackState !== 'NONE') return;
    
    setSelectedOption(index);
    const isCorrect = index === problems[currentStep].correctAnswerIndex; 
    setFeedbackState(isCorrect ? 'CORRECT' : 'INCORRECT');

    setTimeout(() => {
      if (isCorrect) {
        // CORRECT ANSWER
        const stepScore = 100 + (streak * 20);
        setScore(prev => prev + stepScore);
        setStreak(prev => prev + 1);

        // Check if reached the peak (Last Step)
        if (currentStep >= MOUNTAIN_PATH.length - 1) {
          setGameState('GAMEOVER_WIN');
        } else {
          setCurrentStep(prev => prev + 1);
        }
      } else {
        // WRONG ANSWER
        setStreak(0);
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('GAMEOVER_LOSE');
            return 0;
          }
          return newLives;
        });
        
        // Fallback logic
        const nearestCheckpoint = CHECKPOINTS.filter(cp => cp <= currentStep).pop() || 0;
        // Don't fall back if we are safe at a checkpoint, otherwise fall back 1 step (but not below checkpoint)
        let nextStep = currentStep;
        if (!CHECKPOINTS.includes(currentStep)) {
           nextStep = Math.max(nearestCheckpoint, currentStep - 1);
        }
        setCurrentStep(nextStep);
      }

      setSelectedOption(null);
      setFeedbackState('NONE');

    }, 1500);
  };

  if (gameState === 'LOADING') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold">Đang kiến tạo ngọn núi tri thức...</h2>
      </div>
    );
  }

  // GAME OVER SCREEN
  if (gameState === 'GAMEOVER_WIN' || gameState === 'GAMEOVER_LOSE') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {gameState === 'GAMEOVER_WIN' && <Confetti />}
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full text-center relative z-10 animate-in zoom-in-95">
          <div className="mb-6 flex justify-center -mt-20">
             {gameState === 'GAMEOVER_WIN' ? (
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center border-8 border-white shadow-xl animate-bounce">
                   <Trophy className="w-16 h-16 text-yellow-900" />
                </div>
             ) : (
                <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center border-8 border-white shadow-xl">
                   <XCircle className="w-16 h-16 text-white" />
                </div>
             )}
          </div>
          <h2 className={`text-3xl font-extrabold mb-2 ${gameState === 'GAMEOVER_WIN' ? 'text-yellow-600' : 'text-red-600'}`}>
             {gameState === 'GAMEOVER_WIN' ? 'CHINH PHỤC ĐỈNH CAO!' : 'HẾT MẠNG RỒI!'}
          </h2>
          <p className="text-gray-500 mb-6 font-medium">
             {gameState === 'GAMEOVER_WIN' 
                ? 'Bạn đã cắm cờ chiến thắng trên đỉnh MathViet!' 
                : `Bạn đã dừng chân ở bước ${currentStep + 1}. Hãy thử lại nhé!`}
          </p>
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 grid grid-cols-2 gap-4">
             <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng Điểm</div>
                <div className="text-3xl font-black text-slate-800">{score}</div>
             </div>
             <div>
                 <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Kỷ lục</div>
                 <div className="text-3xl font-black text-yellow-500">{Math.max(score, currentHighScore)}</div>
             </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => onNavigate(AppRoute.DASHBOARD)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"><Home className="w-5 h-5 mx-auto" /></button>
             <button onClick={() => onGameComplete(score)} className={`flex-[3] text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center ${gameState === 'GAMEOVER_WIN' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'}`}>Hoàn tất</button>
          </div>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentStep] || problems[problems.length - 1];

  return (
    <div className="h-screen w-full bg-white overflow-hidden font-sans flex flex-col md:flex-row">
      
      {/* 
        ========================================
        LEFT SIDE (Desktop) / TOP SIDE (Mobile)
        MOUNTAIN MAP AREA
        ========================================
      */}
      <div className="relative w-full md:w-[60%] h-[55%] md:h-full bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden shadow-2xl md:shadow-none z-10 md:order-1">
          
          {/* Header Controls (Absolute) */}
          <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
             <button onClick={() => onNavigate(AppRoute.DASHBOARD)} className="bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
             </button>
             <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full flex gap-1">
                {[1,2,3].map(i => (
                  <Heart key={i} className={`w-5 h-5 transition-all ${i <= lives ? 'text-red-500 fill-red-500' : 'text-white/30'}`} />
                ))}
             </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full blur-xl opacity-80 animate-pulse"></div>
          <div className="absolute top-1/4 left-10 text-6xl opacity-30 animate-pulse">☁️</div>
          <div className="absolute top-1/3 right-1/4 text-5xl opacity-20 animate-bounce">☁️</div>

          {/* Mountain Vector Graphic - STANDARD (0,100 to 100,100) */}
          <div className="absolute bottom-0 w-full h-[85%] pointer-events-none">
             <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Main Mountain Shape */}
                <path d="M0,100 L50,10 L100,100 Z" fill="url(#mainGrad)" /> 
                
                {/* Depth Layers (Stylized) */}
                <path d="M0,100 L30,60 L50,100 Z" fill="#60a5fa" opacity="0.4" />
                <path d="M70,100 L85,60 L100,100 Z" fill="#3b82f6" opacity="0.4" />
                
                <defs>
                   <linearGradient id="mainGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#a8e6cf"/>
                      <stop offset="50%" stopColor="#3498db"/>
                      <stop offset="100%" stopColor="#2c3e50"/>
                   </linearGradient>
                </defs>
                {/* Snow Cap */}
                <path d="M50,10 L60,30 L55,25 L50,35 L45,25 L40,30 Z" fill="white" />
             </svg>
          </div>

          {/* PATH VISUALIZATION */}
          <div className="absolute inset-0 w-full h-full">
             {/* Connecting Lines SVG */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline 
                   points={MOUNTAIN_PATH.map(p => `${p.left},${100 - p.bottom}`).join(' ')}
                   fill="none"
                   stroke="#fbbf24" // Bright Amber
                   strokeWidth="1"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   vectorEffect="non-scaling-stroke" // Ensure stroke width looks constant
                   style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}
                />
             </svg>

             {/* Nodes */}
             {MOUNTAIN_PATH.map((pos, idx) => {
                const isCheckpoint = CHECKPOINTS.includes(idx);
                const isCurrent = currentStep === idx;
                const isPassed = currentStep > idx;
                const isPeak = idx === MOUNTAIN_PATH.length - 1;

                return (
                   <div 
                      key={idx}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
                      style={{ left: `${pos.left}%`, bottom: `${pos.bottom}%` }}
                   >
                      {isPeak ? (
                         <div className="relative">
                            <Flag className={`w-8 h-8 ${isPassed || isCurrent ? 'text-yellow-300 fill-yellow-500 animate-bounce' : 'text-slate-600'}`} />
                         </div>
                      ) : (
                         <div className={`
                            rounded-full border-2 shadow-md flex items-center justify-center transition-all duration-500
                            ${isCurrent ? 'w-6 h-6 bg-white border-blue-500 ring-4 ring-blue-200' : 
                              isPassed ? 'w-4 h-4 bg-yellow-400 border-yellow-600' : 
                              isCheckpoint ? 'w-5 h-5 bg-slate-200 border-slate-400' : 'w-3 h-3 bg-slate-300 border-slate-400'}
                         `}>
                            {isCheckpoint && !isPassed && !isCurrent && <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>}
                         </div>
                      )}
                      
                      {/* Checkpoint Label */}
                      {isCheckpoint && !isPeak && (
                         <span className="absolute top-full left-1/2 -translate-x-1/2 text-[8px] font-black text-white bg-black/50 px-1 rounded mt-1 whitespace-nowrap">
                            CP {CHECKPOINTS.indexOf(idx) + 1}
                         </span>
                      )}
                   </div>
                );
             })}

             {/* AVATAR */}
             <div 
                className="absolute transform -translate-x-1/2 -translate-y-[80%] z-30 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ 
                   left: `${MOUNTAIN_PATH[currentStep].left}%`, 
                   bottom: `${MOUNTAIN_PATH[currentStep].bottom}%` 
                }}
             >
                <div className={`text-4xl filter drop-shadow-xl ${avatarDirection === 'left' ? '-scale-x-100' : ''} ${feedbackState === 'INCORRECT' ? 'animate-shake text-red-500' : ''}`}>
                   🧗
                </div>
                <div className="bg-white/90 text-[8px] font-black px-1.5 py-0.5 rounded text-center shadow-sm -mt-1 mx-auto w-fit">
                   BẠN
                </div>
             </div>
          </div>
      </div>

      {/* 
        ========================================
        RIGHT SIDE (Desktop) / BOTTOM SIDE (Mobile)
        QUESTION & INTERACTION AREA
        ========================================
      */}
      <div className="w-full md:w-[40%] h-[45%] md:h-full bg-white relative z-20 flex flex-col border-l border-gray-100 md:order-2">
         
         {/* Top Info Bar */}
         <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                  <Trophy className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Điểm số</div>
                  <div className="text-xl font-black text-slate-800">{score}</div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                  <Zap className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Chuỗi</div>
                  <div className="text-xl font-black text-slate-800">{streak}</div>
               </div>
            </div>
         </div>

         {/* Question Area - Scrollable if needed */}
         <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
             <div className="mb-2 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                   <MapPin className="w-3 h-3" /> Bước {currentStep + 1} / {MOUNTAIN_PATH.length}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${currentProblem?.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                   {currentProblem?.difficulty || 'Normal'}
                </span>
             </div>

             <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-tight">
                <MathRenderer text={currentProblem?.question || "Đang tải..."} />
             </h3>

             {/* Feedback Overlay inside panel */}
             {feedbackState !== 'NONE' && (
                <div className={`mb-4 p-3 rounded-xl text-center font-bold text-white animate-in zoom-in ${feedbackState === 'CORRECT' ? 'bg-green-500' : 'bg-red-500'}`}>
                   {feedbackState === 'CORRECT' ? 'Chính xác! Leo lên nào!' : 'Ôi không! Trượt chân rồi!'}
                </div>
             )}

             <div className="space-y-3">
                {currentProblem?.options.map((opt, idx) => {
                   let stateStyle = "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
                   
                   if (selectedOption !== null) {
                      if (idx === currentProblem.correctAnswerIndex) {
                         stateStyle = "bg-green-100 border-green-500 text-green-800 shadow-md ring-1 ring-green-500";
                      } else if (idx === selectedOption) {
                         stateStyle = "bg-red-50 border-red-200 text-red-400 opacity-60";
                      } else {
                         stateStyle = "opacity-40 border-transparent bg-gray-50";
                      }
                   }

                   return (
                      <button
                         key={idx}
                         onClick={() => handleAnswer(idx)}
                         disabled={selectedOption !== null}
                         className={`w-full p-4 rounded-xl border-2 text-left font-bold text-lg transition-all flex justify-between items-center ${stateStyle}`}
                      >
                         <MathRenderer text={opt} inline />
                         {selectedOption !== null && idx === currentProblem.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                         {selectedOption === idx && idx !== currentProblem.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-500" />}
                      </button>
                   );
                })}
             </div>
         </div>
      </div>

    </div>
  );
};
