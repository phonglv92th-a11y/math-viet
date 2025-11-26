
export enum GradeLevel {
  PRIMARY = 'Tiểu học (Lớp 1-5)',
  SECONDARY = 'Trung học cơ sở (Lớp 6-9)',
  HIGH_SCHOOL = 'Trung học phổ thông (Lớp 10-12)'
}

export enum Subject {
  MATH = 'Toán Học',
  LITERATURE = 'Văn Học',
  ENGLISH = 'Tiếng Anh'
}

export enum GameType {
  // Math
  MENTAL_MATH = 'Tính Nhẩm Thần Tốc',
  LOGIC_PUZZLE = 'Mật Mã Logic',
  REAL_WORLD = 'Toán Thực Tế',
  TOWER_STACK = 'Xây Tháp Trí Tuệ',
  VISUAL_COUNT = 'Đếm Hình Đoán Số',
  
  // Literature
  WORD_MATCH = 'Vua Tiếng Việt',
  POETRY_PUZZLE = 'Nhà Thơ Tài Ba',
  SPELLING_BEE = 'Cảnh Sát Chính Tả',
  LITERATURE_QUIZ = 'Hiểu Biết Văn Học',
  SENTENCE_BUILDER = 'Thợ Xây Câu',
  LITERARY_DETECTIVE = 'Thám Tử Văn Học',
  WORD_SEARCH = 'Truy Tìm Từ Vựng',
  CROSSWORD = 'Ô Chữ Bí Ẩn',

  // English
  ENGLISH_VOCAB = 'Vua Từ Vựng (Vocab)',
  ENGLISH_GRAMMAR = 'Ngữ Pháp (Grammar)',
  ENGLISH_SPELLING = 'Đánh Vần (Spelling)',
  ENGLISH_QUIZ = 'Đố Vui (Quiz)',

  // Special
  MIXED_CHALLENGE = 'Thử Thách Hỗn Hợp'
}

export enum GameMode {
  STANDARD = 'STANDARD',
  SPEED_RUN = 'SPEED_RUN',
  REVIEW = 'REVIEW'
}

export interface GameStats {
  stars: number; // 0-3
  highScore: number;
}

export interface UserProfile {
  id: string; // Unique ID
  username?: string; // For registered users
  name: string;
  grade: number; // 1-12
  points: number;
  completedGames: number;
  streak: number;
  badges: string[];
  friends: string[]; // List of friend IDs
  progress: Record<string, GameStats>; // Map GameType to Stats
  masteryHighScore: number; // For Mastery Peak
  isGuest: boolean; // Flag to identify guest mode
}

export interface LeaderboardEntry {
  rank: number;
  id?: string;
  name: string;
  points: number;
  avatar: string; // Emoji
  isUser?: boolean;
}

export interface MathProblem {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GameResult {
  score: number;
  correctCount: number;
  totalTime: number; // seconds
}

export type WorldId = 'MATH_ISLAND' | 'WORD_KINGDOM' | 'LOGIC_GALAXY';

export interface World {
  id: WorldId;
  name: string;
  description: string;
  icon: string;
  themeColor: string;
  bgGradient: string;
}

export interface AdventureLevel {
  id: number;
  worldId: WorldId;
  title: string;
  description: string;
  type: GameType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'LOCKED' | 'UNLOCKED' | 'COMPLETED';
  icon: string; // Emoji
}

export enum AppRoute {
  HOME = 'home',
  DASHBOARD = 'dashboard',
  ADVENTURE_MAP = 'adventure_map',
  GAME_SELECT = 'game_select',
  GAME_PLAY = 'game_play',
  PARENT_DASHBOARD = 'parent_dashboard',
  PRACTICE_SETUP = 'practice_setup',
  MASTERY_PEAK = 'mastery_peak',
  SITEMAP = 'sitemap',
  ABOUT = 'about'
}

// Navigation Context Type
export interface NavContextType {
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute, params?: any) => void;
  routeParams: any;
}

// Visual Customization Types
export interface GameCardStyle {
  id: string;
  name: string;
  gradient: string;
  text: string;
  iconStyle: 'SIMPLE' | 'BUBBLE' | 'GLASS' | 'NEON';
}
