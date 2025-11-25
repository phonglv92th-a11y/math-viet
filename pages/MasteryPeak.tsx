
import React, { useState, useEffect, useRef } from 'react';
import { AppRoute, GameType, MathProblem } from '../types';
import { generateGameProblems } from '../services/geminiService';
import { ArrowLeft, Heart, Zap, Mountain, Trophy, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Confetti } from '../components/Confetti';

interface MasteryPeakProps {
  userGrade: number;
  onNavigate: (route: AppRoute) => void;
  onGameComplete: (score: number) => void;
  currentHighScore: number;
}

const TOTAL_STEPS = 20;

export const MasteryPeak: React.FC<MasteryPeakProps> = ({ userGrade, onNavigate, onGameComplete, currentHighScore }) => {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentStep, setCurrentStep] = useState(0); // 0 to TOTAL_STEPS
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'LOADING' | 'PLAYING' | 'GAMEOVER_WIN' | 'GAMEOVER_LOSE'>('LOADING');
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize Game
  useEffect(() => {
    const initGame = async () => {
      setLoading(true);
      // Request more problems than steps to account for difficulty scaling logic or fallbacks
      const data = await generateGameProblems(userGrade, GameType.MENTAL_MATH, TOTAL_STEPS + 5, 'Medium', 'Increasing difficulty');
      setProblems(data);
      setLoading(false);
      setGameState('PLAYING');
    };
    initGame();
  }, [userGrade]);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    const isCorrect = index === problems[currentStep].correctAnswerIndex;

    setTimeout(() => {
      if (isCorrect) {
        // Correct Logic
        const stepScore = 100 + (streak * 10); // Base + Streak Bonus
        setScore(prev => prev + stepScore);
        setStreak(prev => prev + 1);
        
        if (currentStep + 1 >= TOTAL_STEPS) {
          setGameState('GAMEOVER_WIN');
        } else {
          setCurrentStep(prev => prev + 1);
          setSelectedOption(null);
          setShowFeedback(false);
        }
      } else {
        // Incorrect Logic
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('GAMEOVER_LOSE');
            return 0;
          }
          return newLives;
        });
        setStreak(0);
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, 1500); // Delay to show feedback
  };

  if (gameState === 'LOADING') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold">Đang kiến tạo ngọn núi...</h2>
      </div>
    );
  }

  if (gameState === 'GAMEOVER_WIN' || gameState === 'GAMEOVER_LOSE') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {gameState === 'GAMEOVER_WIN' && <Confetti />}
        
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl relative z-10">
          <div className="mb-6 flex justify-center">
             {gameState === 'GAMEOVER_WIN' ? (
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                   <Trophy className="w-12 h-12 text-yellow-800" />
                </div>
             ) : (
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
                   <Mountain className="w-12 h-12 text-white" />
                </div>
             )}
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-2">
             {gameState === 'GAMEOVER_WIN' ? 'Chinh Phục Thành Công!' : 'Hành Trình Kết Thúc'}
          </h2>
          <p className="text-slate-400 mb-6">
             {gameState === 'GAMEOVER_WIN' 
                ? 'Bạn đã leo lên đến đỉnh vinh quang.' 
                : `Bạn dừng chân tại bước thứ ${currentStep + 1}.`}
          </p>
          
          <div className="bg-slate-900 rounded-xl p-4 mb-8 border border-slate-700">
             <div className="text-slate-400 text-xs font-bold uppercase">Tổng Điểm</div>
             <div className="text-4xl font-extrabold text-purple-400">{score}</div>
             {score > currentHighScore && (
                <div className="text-yellow-400 text-xs mt-1 font-bold animate-pulse">Kỷ lục mới! 🏆</div>
             )}
          </div>

          <button 
             onClick={() => onGameComplete(score)}
             className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
             Hoàn tất
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;
  // Dynamic background gradient based on height
  const bgGradient = currentStep < 5 
      ? 'from-green-800 to-slate-900' 
      : currentStep < 10 
         ? 'from-slate-700 to-slate-900'
         : currentStep < 15
            ? 'from-indigo-900 to-black'
            : 'from-purple-900 to-black';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} text-white flex flex-col transition-colors duration-1000`}>
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md">
         <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate(AppRoute.DASHBOARD)} className="p-2 hover:bg-white/10 rounded-full">
               <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-1">
               {[1,2,3].map(i => (
                  <Heart key={i} className={`w-6 h-6 ${i <= lives ? 'text-red-500 fill-red-500' : 'text-slate-700'}`} />
               ))}
            </div>
         </div>
         <div className="flex items-center space-x-4">
             <div className="flex items-center text-yellow-400">
                <Zap className="w-5 h-5 mr-1" />
                <span className="font-bold text-xl">x{streak}</span>
             </div>
             <div className="bg-white/10 px-4 py-1 rounded-full font-bold">
                {score} pts
             </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-4 gap-8">
         
         {/* Visual Mountain Progress (Left Side - Desktop) */}
         <div className="hidden md:flex flex-col items-center justify-end w-24 bg-white/5 rounded-full py-8 relative">
            <div className="absolute bottom-0 w-4 bg-slate-700 h-full rounded-full overflow-hidden">
               <div className="w-full bg-purple-500 transition-all duration-500" style={{ height: `${progressPercent}%` }}></div>
            </div>
            {/* Markers */}
            {[0, 5, 10, 15, 20].map(step => (
               <div key={step} className="absolute w-8 h-1 bg-white/50" style={{ bottom: `${(step/TOTAL_STEPS)*100}%` }}></div>
            ))}
            <div className="absolute w-12 h-12 bg-white rounded-full border-4 border-purple-600 shadow-lg flex items-center justify-center transition-all duration-500" style={{ bottom: `${progressPercent}%` }}>
               <span className="text-purple-900 font-bold">{currentStep}</span>
            </div>
         </div>

         {/* Question Area */}
         <div className="flex-1 flex flex-col justify-center">
            
            {/* Mobile Progress Bar */}
            <div className="md:hidden w-full h-4 bg-slate-800 rounded-full mb-8 relative">
               <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
               <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Bước {currentStep}/{TOTAL_STEPS}
               </div>
            </div>

            <div className="text-center mb-10">
               <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-purple-300 mb-4 border border-white/20">
                  Câu hỏi {currentStep + 1}
               </div>
               <h2 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                  {problems[currentStep]?.question}
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
               {problems[currentStep]?.options.map((option, idx) => {
                  let btnClass = "bg-white/10 border-white/20 hover:bg-white/20 text-white";
                  if (selectedOption !== null) {
                     if (idx === problems[currentStep].correctAnswerIndex) btnClass = "bg-green-500 border-green-600 text-white";
                     else if (idx === selectedOption) btnClass = "bg-red-500 border-red-600 text-white";
                     else btnClass = "opacity-50 cursor-not-allowed";
                  }

                  return (
                     <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={selectedOption !== null}
                        className={`p-6 rounded-2xl border-2 font-bold text-xl transition-all transform hover:scale-105 active:scale-95 flex justify-between items-center ${btnClass}`}
                     >
                        <span>{option}</span>
                        {selectedOption !== null && idx === problems[currentStep].correctAnswerIndex && <CheckCircle className="w-6 h-6" />}
                        {selectedOption === idx && idx !== problems[currentStep].correctAnswerIndex && <XCircle className="w-6 h-6" />}
                     </button>
                  );
               })}
            </div>

            {/* Quote/Motivation */}
            <div className="mt-12 text-center opacity-60 text-sm font-italic">
               "Kiên trì là chìa khóa của thành công."
            </div>
         </div>
      </div>
    </div>
  );
};
