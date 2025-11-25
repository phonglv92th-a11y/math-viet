
import React, { useState } from 'react';
import { AppRoute, UserProfile, GameType, AdventureLevel, GameMode, World, WorldId } from './types';
import { Navbar } from './components/Navbar';
import { HelpModal } from './components/HelpModal';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { GameArena } from './pages/GameArena';
import { ParentDashboard } from './pages/ParentDashboard';
import { AdventureMap } from './pages/AdventureMap';
import { PracticeSetup } from './pages/PracticeSetup';
import { MasteryPeak } from './pages/MasteryPeak';
import { SiteMap } from './pages/SiteMap';

// Define Worlds
const WORLDS: World[] = [
  { 
    id: 'MATH_ISLAND', 
    name: 'Đảo Số Học', 
    description: 'Khám phá bí ẩn của những con số', 
    icon: '🏝️',
    themeColor: 'teal',
    bgGradient: 'from-teal-100 to-emerald-200'
  },
  { 
    id: 'WORD_KINGDOM', 
    name: 'Vương Quốc Chữ', 
    description: 'Chinh phục ngôn ngữ và thơ ca', 
    icon: '🏰',
    themeColor: 'rose',
    bgGradient: 'from-rose-100 to-pink-200'
  },
  { 
    id: 'LOGIC_GALAXY', 
    name: 'Vũ Trụ Logic', 
    description: 'Thử thách trí tuệ siêu việt', 
    icon: '🌌',
    themeColor: 'indigo',
    bgGradient: 'from-indigo-100 to-purple-200'
  }
];

// Expanded Adventure Data with World IDs
const INITIAL_LEVELS: AdventureLevel[] = [
  // Math Island
  { id: 1, worldId: 'MATH_ISLAND', title: 'Khu Rừng Số Học', description: 'Cộng trừ cơ bản', type: GameType.MENTAL_MATH, difficulty: 'Easy', status: 'UNLOCKED', icon: '🌲' },
  { id: 2, worldId: 'MATH_ISLAND', title: 'Thung Lũng Táo Đỏ', description: 'Đếm số lượng', type: GameType.VISUAL_COUNT, difficulty: 'Easy', status: 'LOCKED', icon: '🍎' },
  { id: 3, worldId: 'MATH_ISLAND', title: 'Chợ Phiên', description: 'Tính toán mua sắm', type: GameType.REAL_WORLD, difficulty: 'Medium', status: 'LOCKED', icon: '⛺' },
  { id: 4, worldId: 'MATH_ISLAND', title: 'Đỉnh Núi Lửa', description: 'Tính nhẩm siêu tốc', type: GameType.MENTAL_MATH, difficulty: 'Hard', status: 'LOCKED', icon: '🌋' },
  
  // Word Kingdom
  { id: 5, worldId: 'WORD_KINGDOM', title: 'Làng Chữ Cái', description: 'Ghép từ vựng', type: GameType.WORD_MATCH, difficulty: 'Easy', status: 'UNLOCKED', icon: '🏡' },
  { id: 6, worldId: 'WORD_KINGDOM', title: 'Trạm Kiểm Soát', description: 'Chính tả', type: GameType.SPELLING_BEE, difficulty: 'Medium', status: 'LOCKED', icon: '🚧' },
  { id: 7, worldId: 'WORD_KINGDOM', title: 'Văn Miếu', description: 'Hiểu biết văn học', type: GameType.LITERATURE_QUIZ, difficulty: 'Hard', status: 'LOCKED', icon: '⛩️' },

  // Logic Galaxy
  { id: 8, worldId: 'LOGIC_GALAXY', title: 'Tháp Cổ Đại', description: 'Sắp xếp số', type: GameType.TOWER_STACK, difficulty: 'Medium', status: 'UNLOCKED', icon: '🏯' },
  { id: 9, worldId: 'LOGIC_GALAXY', title: 'Hang Động Bí Ẩn', description: 'Giải mã quy luật', type: GameType.LOGIC_PUZZLE, difficulty: 'Medium', status: 'LOCKED', icon: '🦇' },
  { id: 10, worldId: 'LOGIC_GALAXY', title: 'Kinh Đô Ánh Sáng', description: 'Thử thách tổng hợp', type: GameType.LOGIC_PUZZLE, difficulty: 'Hard', status: 'LOCKED', icon: '👑' },
];

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  const [routeParams, setRouteParams] = useState<any>({});
  const [showHelp, setShowHelp] = useState(false);
  
  // Mock User Data
  const [user, setUser] = useState<UserProfile>({
    id: 'user_me_123',
    name: 'Bé Yêu',
    grade: 3,
    points: 0,
    completedGames: 0,
    streak: 0,
    badges: [],
    friends: [],
    progress: {},
    masteryHighScore: 0
  });

  const [adventureLevels, setAdventureLevels] = useState<AdventureLevel[]>(INITIAL_LEVELS);

  const navigateTo = (route: AppRoute, params?: any) => {
    setCurrentRoute(route);
    if (params) setRouteParams(params);
    window.scrollTo(0, 0);
  };

  const handleStart = (name: string, grade: number) => {
    setUser(prev => ({
      ...prev,
      name: name,
      grade: grade
    }));
  };

  const handleAddFriend = (friendId: string) => {
    if (!user.friends.includes(friendId) && friendId !== user.id) {
      setUser(prev => ({
        ...prev,
        friends: [...prev.friends, friendId]
      }));
    }
  };

  const handleGameComplete = (score: number) => {
    let newPoints = user.points + score;
    let newCompletedGames = user.completedGames + 1;
    let newBadges = [...user.badges];
    
    // Simple badge logic
    if (newPoints >= 500 && !newBadges.includes('Tập Sự')) newBadges.push('Tập Sự');
    if (newPoints >= 1000 && !newBadges.includes('Nhà Toán Học')) newBadges.push('Nhà Toán Học');

    // Update Adventure Progress if applicable
    if (currentRoute === AppRoute.GAME_PLAY && routeParams.levelId) {
      const levelId = routeParams.levelId;
      setAdventureLevels(prev => prev.map(lvl => {
        if (lvl.id === levelId) return { ...lvl, status: 'COMPLETED' };
        // Unlock next level
        if (lvl.id === levelId + 1) return { ...lvl, status: 'UNLOCKED' };
        return lvl;
      }));
    }
    
    // Update Mastery High Score
    let newMasteryHighScore = user.masteryHighScore;
    if (currentRoute === AppRoute.MASTERY_PEAK && score > newMasteryHighScore) {
      newMasteryHighScore = score;
    }

    // Update Stats for specific game type
    const gameType = routeParams.type as GameType;
    let currentStats = user.progress[gameType] || { stars: 0, highScore: 0 };
    if (score > currentStats.highScore) {
       currentStats.highScore = score;
       if (score > 300) currentStats.stars = 3;
       else if (score > 200) currentStats.stars = 2;
       else if (score > 100) currentStats.stars = 1;
    }

    setUser(prev => ({
      ...prev,
      points: newPoints,
      completedGames: newCompletedGames,
      badges: newBadges,
      masteryHighScore: newMasteryHighScore,
      progress: {
         ...prev.progress,
         [gameType]: currentStats
      }
    }));
    
    // Slight delay before navigating back to show confetti in GameArena
    setTimeout(() => {
       // If in Adventure mode, go back to map, else dashboard
       if (routeParams.levelId) {
         navigateTo(AppRoute.ADVENTURE_MAP);
       } else if (currentRoute === AppRoute.MASTERY_PEAK) {
         navigateTo(AppRoute.DASHBOARD);
       } else {
         navigateTo(AppRoute.DASHBOARD);
       }
    }, 2000);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.HOME:
        return <Home onNavigate={navigateTo} onStart={handleStart} onOpenHelp={() => setShowHelp(true)} />;
      case AppRoute.DASHBOARD:
        return <Dashboard user={user} onNavigate={navigateTo} onAddFriend={handleAddFriend} adventureLevels={adventureLevels} worlds={WORLDS} />;
      case AppRoute.GAME_PLAY:
        return (
          <GameArena 
            gameType={routeParams.type} 
            userGrade={user.grade}
            mode={routeParams.mode}
            difficulty={routeParams.difficulty}
            questionCount={routeParams.questionCount}
            topicFocus={routeParams.topicFocus}
            onNavigate={navigateTo} 
            onGameComplete={handleGameComplete} 
          />
        );
      case AppRoute.PARENT_DASHBOARD:
        return <ParentDashboard user={user} onNavigate={navigateTo} />;
      case AppRoute.ADVENTURE_MAP:
        return <AdventureMap levels={adventureLevels} worlds={WORLDS} onNavigate={navigateTo} />;
      case AppRoute.PRACTICE_SETUP:
        return <PracticeSetup onNavigate={navigateTo} userGrade={user.grade} />;
      case AppRoute.MASTERY_PEAK:
        return <MasteryPeak userGrade={user.grade} onNavigate={navigateTo} onGameComplete={handleGameComplete} currentHighScore={user.masteryHighScore} />;
      case AppRoute.SITEMAP:
        return <SiteMap onNavigate={navigateTo} />;
      default:
        return <Home onNavigate={navigateTo} onStart={handleStart} onOpenHelp={() => setShowHelp(true)} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      {currentRoute !== AppRoute.HOME && (
        <Navbar 
          onNavigate={navigateTo} 
          currentRoute={currentRoute} 
          userPoints={user.points} 
          onOpenHelp={() => setShowHelp(true)}
        />
      )}
      
      <main className="min-h-screen">
        {renderContent()}
      </main>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default App;
