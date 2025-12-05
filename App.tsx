
import React, { useState, useEffect } from 'react';
import { AppRoute, UserProfile, GameType, AdventureLevel, GameMode, World, WorldId, BgTheme } from './types';
import { Navbar } from './components/Navbar';
import { HelpModal } from './components/HelpModal';
import { DonationModal } from './components/DonationModal';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { GameArena } from './pages/GameArena';
import { ParentDashboard } from './pages/ParentDashboard';
import { AdventureMap } from './pages/AdventureMap';
import { PracticeSetup } from './pages/PracticeSetup';
import { MasteryPeak } from './pages/MasteryPeak';
import { SiteMap } from './pages/SiteMap';
import { About } from './pages/About';
import { AdminDashboard } from './pages/AdminDashboard'; // Import new page

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
  const [showDonation, setShowDonation] = useState(false); // Donation Modal State
  
  // Theme State (Lifted Up)
  const [bgTheme, setBgTheme] = useState<BgTheme>(() => (localStorage.getItem('mathviet_bg_theme') as BgTheme) || 'DEFAULT');

  // User Data State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [adventureLevels, setAdventureLevels] = useState<AdventureLevel[]>(INITIAL_LEVELS);

  // Load User from LocalStorage on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mathviet_user_profile');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setCurrentRoute(AppRoute.DASHBOARD);
      } catch (e) {
        console.error("Failed to load user profile", e);
      }
    }
  }, []);

  // Save Registered User to LocalStorage whenever user state changes
  useEffect(() => {
    if (user && !user.isGuest) {
      localStorage.setItem('mathviet_user_profile', JSON.stringify(user));
    }
  }, [user]);

  // Persist Theme
  useEffect(() => {
    localStorage.setItem('mathviet_bg_theme', bgTheme);
  }, [bgTheme]);

  const navigateTo = (route: AppRoute, params?: any) => {
    setCurrentRoute(route);
    if (params) setRouteParams(params);
    window.scrollTo(0, 0);
  };

  // --- Auth Handlers ---

  const handleStartGuest = (name: string, grade: number) => {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      name: name,
      grade: grade,
      points: 0,
      completedGames: 0,
      streak: 0,
      badges: [],
      friends: [],
      progress: {},
      masteryHighScore: 0,
      isGuest: true
    };
    setUser(guestUser);
  };

  const handleLogin = (username: string, grade: number, fullName: string) => {
    const storageKey = `mathviet_user_${username}`;
    const existing = localStorage.getItem(storageKey);
    
    if (existing) {
        const existingUser = JSON.parse(existing);
        setUser(existingUser);
        localStorage.setItem('mathviet_user_profile', existing);
    } else {
        const newUser: UserProfile = {
            id: `user_${username}_${Date.now()}`,
            username: username,
            name: fullName,
            grade: grade,
            points: 0,
            completedGames: 0,
            streak: 0,
            badges: [],
            friends: [],
            progress: {},
            masteryHighScore: 0,
            isGuest: false
        };
        setUser(newUser);
        localStorage.setItem(storageKey, JSON.stringify(newUser));
        localStorage.setItem('mathviet_user_profile', JSON.stringify(newUser));
    }
  };

  const handleLogout = () => {
    if (user && !user.isGuest && user.username) {
        localStorage.setItem(`mathviet_user_${user.username}`, JSON.stringify(user));
    }
    localStorage.removeItem('mathviet_user_profile');
    setUser(null);
    setCurrentRoute(AppRoute.HOME);
  };

  const handleAddFriend = (friendId: string) => {
    if (user && !user.friends.includes(friendId) && friendId !== user.id) {
      setUser(prev => prev ? ({
        ...prev,
        friends: [...prev.friends, friendId]
      }) : null);
    }
  };

  const handleGameComplete = (score: number) => {
    if (!user) return;

    let newPoints = user.points + score;
    let newCompletedGames = user.completedGames + 1;
    let newBadges = [...user.badges];
    
    if (newPoints >= 500 && !newBadges.includes('Tập Sự')) newBadges.push('Tập Sự');
    if (newPoints >= 1000 && !newBadges.includes('Nhà Toán Học')) newBadges.push('Nhà Toán Học');

    if (currentRoute === AppRoute.GAME_PLAY && routeParams.levelId) {
      const levelId = routeParams.levelId;
      setAdventureLevels(prev => prev.map(lvl => {
        if (lvl.id === levelId) return { ...lvl, status: 'COMPLETED' };
        if (lvl.id === levelId + 1) return { ...lvl, status: 'UNLOCKED' };
        return lvl;
      }));
    }
    
    let newMasteryHighScore = user.masteryHighScore;
    if (currentRoute === AppRoute.MASTERY_PEAK && score > newMasteryHighScore) {
      newMasteryHighScore = score;
    }

    const gameType = routeParams.type as GameType;
    let currentStats = user.progress[gameType] || { stars: 0, highScore: 0, gamesPlayed: 0 };
    
    // Update Stats
    if (score > currentStats.highScore) {
       currentStats.highScore = score;
       if (score > 300) currentStats.stars = 3;
       else if (score > 200) currentStats.stars = 2;
       else if (score > 100) currentStats.stars = 1;
    }
    // Increment games played counter (vital for missions)
    currentStats.gamesPlayed = (currentStats.gamesPlayed || 0) + 1;

    const updatedUser = {
      ...user,
      points: newPoints,
      completedGames: newCompletedGames,
      badges: newBadges,
      masteryHighScore: newMasteryHighScore,
      progress: {
         ...user.progress,
         [gameType]: currentStats
      }
    };

    setUser(updatedUser);

    if (!updatedUser.isGuest && updatedUser.username) {
        localStorage.setItem(`mathviet_user_${updatedUser.username}`, JSON.stringify(updatedUser));
    }
    
    setTimeout(() => {
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
    // PUBLIC ROUTES (No Login Required)
    if (!user) {
         if (currentRoute === AppRoute.ABOUT) {
            return <About onNavigate={navigateTo} onOpenDonation={() => setShowDonation(true)} />;
         }
         if (currentRoute === AppRoute.SITEMAP) {
            return <SiteMap onNavigate={navigateTo} onOpenDonation={() => setShowDonation(true)} />;
         }
         if (currentRoute === AppRoute.ADMIN) { // Admin Access without user login
            return <AdminDashboard onNavigate={navigateTo} />;
         }
         // Default to Home for any other route if not logged in
         return (
            <Home 
                bgTheme={bgTheme} 
                onThemeChange={setBgTheme}
                onNavigate={navigateTo} 
                onStartGuest={handleStartGuest} 
                onLogin={handleLogin} 
                onOpenHelp={() => setShowHelp(true)} 
                onOpenDonation={() => setShowDonation(true)} 
            />
         );
    }

    // PROTECTED ROUTES
    switch (currentRoute) {
      case AppRoute.HOME:
        return <Dashboard user={user} onNavigate={navigateTo} onAddFriend={handleAddFriend} adventureLevels={adventureLevels} worlds={WORLDS} bgTheme={bgTheme} onThemeChange={setBgTheme} />;
      case AppRoute.DASHBOARD:
        return <Dashboard user={user} onNavigate={navigateTo} onAddFriend={handleAddFriend} adventureLevels={adventureLevels} worlds={WORLDS} bgTheme={bgTheme} onThemeChange={setBgTheme} />;
      case AppRoute.GAME_PLAY:
        return (
          <GameArena 
            gameType={routeParams.type} 
            userGrade={user.grade}
            mode={routeParams.mode}
            difficulty={routeParams.difficulty}
            questionCount={routeParams.questionCount}
            topicFocus={routeParams.topicFocus}
            bgTheme={bgTheme}
            onNavigate={navigateTo} 
            onGameComplete={handleGameComplete} 
          />
        );
      case AppRoute.PARENT_DASHBOARD:
        return <ParentDashboard user={user} onNavigate={navigateTo} />;
      case AppRoute.ADVENTURE_MAP:
        return <AdventureMap levels={adventureLevels} worlds={WORLDS} onNavigate={navigateTo} />;
      case AppRoute.PRACTICE_SETUP:
        return <PracticeSetup onNavigate={navigateTo} userGrade={user.grade} onOpenDonation={() => setShowDonation(true)} />;
      case AppRoute.MASTERY_PEAK:
        return <MasteryPeak userGrade={user.grade} onNavigate={navigateTo} onGameComplete={handleGameComplete} currentHighScore={user.masteryHighScore} />;
      case AppRoute.SITEMAP:
        return <SiteMap onNavigate={navigateTo} onOpenDonation={() => setShowDonation(true)} />;
      case AppRoute.ABOUT:
        return <About onNavigate={navigateTo} onOpenDonation={() => setShowDonation(true)} />;
      case AppRoute.ADMIN: // Registered users can also try to access admin
        return <AdminDashboard onNavigate={navigateTo} />;
      default:
        return <Dashboard user={user} onNavigate={navigateTo} onAddFriend={handleAddFriend} adventureLevels={adventureLevels} worlds={WORLDS} bgTheme={bgTheme} onThemeChange={setBgTheme} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      {user && currentRoute !== AppRoute.HOME && currentRoute !== AppRoute.ADMIN && (
        <Navbar 
          onNavigate={navigateTo} 
          currentRoute={currentRoute} 
          userPoints={user.points} 
          onOpenHelp={() => setShowHelp(true)}
          onOpenDonation={() => setShowDonation(true)} 
          isGuest={user.isGuest}
          username={user.name}
          onLogout={handleLogout}
        />
      )}
      
      <main className="min-h-screen">
        {renderContent()}
      </main>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <DonationModal isOpen={showDonation} onClose={() => setShowDonation(false)} />
    </div>
  );
};

export default App;
