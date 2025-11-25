
import React, { useState } from 'react';
import { AppRoute, GameType, GameMode } from '../types';
import { Brain, Puzzle, ShoppingCart, Layers, Shapes, ArrowLeft, Settings, Check, Target, PenTool, Feather, Search, Quote, Hammer, ScanEye, Globe, Languages, Type, MessageCircle, RotateCcw } from 'lucide-react';

interface PracticeSetupProps {
  onNavigate: (route: AppRoute, params?: any) => void;
  userGrade: number;
}

const GameTypeOption = ({ 
  type, 
  selected, 
  onClick, 
  icon: Icon, 
  color 
}: { 
  type: GameType, 
  selected: boolean, 
  onClick: () => void, 
  icon: any, 
  color: string 
}) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
      selected 
        ? `border-${color}-500 bg-${color}-50 text-${color}-700 shadow-md transform scale-105` 
        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
    }`}
  >
    <Icon className={`w-8 h-8 mb-2 ${selected ? `text-${color}-600` : 'text-gray-400'}`} />
    <span className="text-xs font-bold text-center">{type}</span>
    {selected && (
      <div className={`absolute top-2 right-2 w-5 h-5 bg-${color}-500 rounded-full flex items-center justify-center text-white`}>
        <Check className="w-3 h-3" />
      </div>
    )}
  </button>
);

export const PracticeSetup: React.FC<PracticeSetupProps> = ({ onNavigate, userGrade }) => {
  const [selectedType, setSelectedType] = useState<GameType>(GameType.MENTAL_MATH);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | undefined>(undefined);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [topicFocus, setTopicFocus] = useState<string>('');
  const [isReviewMode, setIsReviewMode] = useState(false);

  const handleStart = () => {
    onNavigate(AppRoute.GAME_PLAY, {
      type: isReviewMode ? GameType.MIXED_CHALLENGE : selectedType,
      difficulty: isReviewMode ? undefined : difficulty,
      questionCount,
      topicFocus: isReviewMode ? '' : topicFocus,
      mode: isReviewMode ? GameMode.REVIEW : GameMode.STANDARD
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="flex items-center text-gray-600 hover:text-gray-800 font-bold mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-fuchsia-600 p-8 text-white">
            <h1 className="text-2xl font-extrabold flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              Luyện Tập Tùy Chỉnh
            </h1>
            <p className="text-violet-100 mt-2">
              Tạo bài tập riêng phù hợp với nhu cầu của bạn.
            </p>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Step 0: Review Mode Toggle */}
            <section>
              <div 
                onClick={() => setIsReviewMode(!isReviewMode)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isReviewMode 
                    ? 'bg-orange-50 border-orange-400 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${isReviewMode ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isReviewMode ? 'text-orange-700' : 'text-gray-700'}`}>Chế độ Ôn tập (Review Mode)</h3>
                    <p className="text-sm text-gray-500">
                      Hệ thống sẽ tự động tạo câu hỏi dựa trên những chủ đề bạn đã làm sai trong lịch sử đấu.
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isReviewMode ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300'}`}>
                   {isReviewMode && <Check className="w-4 h-4" />}
                </div>
              </div>
            </section>

            {/* Steps 1, 2, 4 are conditional based on Review Mode */}
            {!isReviewMode && (
              <>
                {/* Step 1: Game Type */}
                <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                    Chọn dạng bài
                  </h3>
                  
                  <div className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">Môn Toán</div>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                    <GameTypeOption 
                      type={GameType.MENTAL_MATH} 
                      selected={selectedType === GameType.MENTAL_MATH} 
                      onClick={() => setSelectedType(GameType.MENTAL_MATH)} 
                      icon={Brain} 
                      color="blue" 
                    />
                    <GameTypeOption 
                      type={GameType.LOGIC_PUZZLE} 
                      selected={selectedType === GameType.LOGIC_PUZZLE} 
                      onClick={() => setSelectedType(GameType.LOGIC_PUZZLE)} 
                      icon={Puzzle} 
                      color="purple" 
                    />
                    <GameTypeOption 
                      type={GameType.REAL_WORLD} 
                      selected={selectedType === GameType.REAL_WORLD} 
                      onClick={() => setSelectedType(GameType.REAL_WORLD)} 
                      icon={ShoppingCart} 
                      color="green" 
                    />
                    <GameTypeOption 
                      type={GameType.TOWER_STACK} 
                      selected={selectedType === GameType.TOWER_STACK} 
                      onClick={() => setSelectedType(GameType.TOWER_STACK)} 
                      icon={Layers} 
                      color="pink" 
                    />
                    <GameTypeOption 
                      type={GameType.VISUAL_COUNT} 
                      selected={selectedType === GameType.VISUAL_COUNT} 
                      onClick={() => setSelectedType(GameType.VISUAL_COUNT)} 
                      icon={Shapes} 
                      color="teal" 
                    />
                  </div>

                  <div className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">Môn Tiếng Việt / Văn Học</div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <GameTypeOption 
                      type={GameType.WORD_MATCH} 
                      selected={selectedType === GameType.WORD_MATCH} 
                      onClick={() => setSelectedType(GameType.WORD_MATCH)} 
                      icon={PenTool} 
                      color="rose" 
                    />
                    <GameTypeOption 
                      type={GameType.POETRY_PUZZLE} 
                      selected={selectedType === GameType.POETRY_PUZZLE} 
                      onClick={() => setSelectedType(GameType.POETRY_PUZZLE)} 
                      icon={Feather} 
                      color="amber" 
                    />
                    <GameTypeOption 
                      type={GameType.SPELLING_BEE} 
                      selected={selectedType === GameType.SPELLING_BEE} 
                      onClick={() => setSelectedType(GameType.SPELLING_BEE)} 
                      icon={Search} 
                      color="cyan" 
                    />
                    <GameTypeOption 
                      type={GameType.LITERATURE_QUIZ} 
                      selected={selectedType === GameType.LITERATURE_QUIZ} 
                      onClick={() => setSelectedType(GameType.LITERATURE_QUIZ)} 
                      icon={Quote} 
                      color="indigo" 
                    />
                    <GameTypeOption 
                      type={GameType.SENTENCE_BUILDER} 
                      selected={selectedType === GameType.SENTENCE_BUILDER} 
                      onClick={() => setSelectedType(GameType.SENTENCE_BUILDER)} 
                      icon={Hammer} 
                      color="orange" 
                    />
                    <GameTypeOption 
                      type={GameType.LITERARY_DETECTIVE} 
                      selected={selectedType === GameType.LITERARY_DETECTIVE} 
                      onClick={() => setSelectedType(GameType.LITERARY_DETECTIVE)} 
                      icon={ScanEye} 
                      color="indigo" 
                    />
                  </div>

                  <div className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">Môn Tiếng Anh</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <GameTypeOption 
                      type={GameType.ENGLISH_VOCAB} 
                      selected={selectedType === GameType.ENGLISH_VOCAB} 
                      onClick={() => setSelectedType(GameType.ENGLISH_VOCAB)} 
                      icon={Globe} 
                      color="indigo" 
                    />
                    <GameTypeOption 
                      type={GameType.ENGLISH_GRAMMAR} 
                      selected={selectedType === GameType.ENGLISH_GRAMMAR} 
                      onClick={() => setSelectedType(GameType.ENGLISH_GRAMMAR)} 
                      icon={Languages} 
                      color="violet" 
                    />
                    <GameTypeOption 
                      type={GameType.ENGLISH_SPELLING} 
                      selected={selectedType === GameType.ENGLISH_SPELLING} 
                      onClick={() => setSelectedType(GameType.ENGLISH_SPELLING)} 
                      icon={Type} 
                      color="fuchsia" 
                    />
                    <GameTypeOption 
                      type={GameType.ENGLISH_QUIZ} 
                      selected={selectedType === GameType.ENGLISH_QUIZ} 
                      onClick={() => setSelectedType(GameType.ENGLISH_QUIZ)} 
                      icon={MessageCircle} 
                      color="sky" 
                    />
                  </div>
                </section>

                {/* Step 2: Difficulty */}
                <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                    Độ khó
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${difficulty === undefined ? 'bg-violet-50 border-violet-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="diff" className="mr-3" checked={difficulty === undefined} onChange={() => setDifficulty(undefined)} />
                        <span className="font-semibold text-sm">Hỗn hợp (Mặc định)</span>
                      </label>
                      <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${difficulty === 'Easy' ? 'bg-green-50 border-green-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="diff" className="mr-3" checked={difficulty === 'Easy'} onChange={() => setDifficulty('Easy')} />
                        <span className="font-semibold text-sm text-green-700">Dễ</span>
                      </label>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${difficulty === 'Medium' ? 'bg-yellow-50 border-yellow-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="diff" className="mr-3" checked={difficulty === 'Medium'} onChange={() => setDifficulty('Medium')} />
                        <span className="font-semibold text-sm text-yellow-700">Trung bình</span>
                      </label>
                      <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${difficulty === 'Hard' ? 'bg-red-50 border-red-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="diff" className="mr-3" checked={difficulty === 'Hard'} onChange={() => setDifficulty('Hard')} />
                        <span className="font-semibold text-sm text-red-700">Khó</span>
                      </label>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Step 3: Question Count (Always visible) */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs mr-2">{isReviewMode ? '1' : '3'}</span>
                Số lượng câu hỏi
              </h3>
              <div className="flex space-x-2">
                {[5, 10, 20].map(count => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${
                      questionCount === count 
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 4: Topic Focus (Hidden in Review Mode) */}
            {!isReviewMode && (
              <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs mr-2">4</span>
                    Chủ đề cụ thể (Tùy chọn)
                  </h3>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        value={topicFocus}
                        onChange={(e) => setTopicFocus(e.target.value)}
                        placeholder="VD: Truyện Kiều, Dế Mèn, Animals, Family, Past Tense..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    AI sẽ cố gắng tạo câu hỏi tập trung vào chủ đề bạn nhập.
                  </p>
              </section>
            )}

            <button
              onClick={handleStart}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-violet-200 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              {isReviewMode ? 'Bắt Đầu Ôn Tập 🔄' : 'Bắt Đầu Luyện Tập 🚀'}
            </button>

          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-400 text-xs font-mono">
           Owner of this website all information signature is Lamphong.1992
        </div>
      </div>
    </div>
  );
};