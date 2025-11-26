
import React from 'react';
import { AppRoute } from '../types';
import { Calculator, LayoutDashboard, Users, HelpCircle, Map, LogOut, UserCircle, Heart, Info } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: AppRoute) => void;
  currentRoute: AppRoute;
  userPoints: number;
  onOpenHelp: () => void;
  onOpenDonation: () => void; // New prop
  isGuest: boolean;
  username?: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  currentRoute, 
  userPoints, 
  onOpenHelp,
  onOpenDonation,
  isGuest,
  username,
  onLogout
}) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(AppRoute.HOME)}>
            <div className="flex-shrink-0 flex items-center text-primary font-extrabold text-2xl">
              <Calculator className="h-8 w-8 mr-2 text-secondary" />
              MathViet
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
             {/* Guest/User Indicator */}
             <div className="hidden lg:flex items-center px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                <UserCircle className={`w-4 h-4 mr-2 ${isGuest ? 'text-gray-400' : 'text-green-500'}`} />
                <span className="text-xs font-bold text-gray-600">
                  {isGuest ? 'Khách (Không lưu)' : `Hi, ${username || 'User'}`}
                </span>
             </div>

             {/* Points Badge */}
             <div className="hidden md:flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold border border-yellow-300">
                <span className="mr-1">🏆</span> {userPoints} Điểm
             </div>

             {/* Support Button (New) */}
             <button
              onClick={onOpenDonation}
              className="p-2 rounded-md text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 transition-colors animate-pulse"
              title="Ủng hộ tác giả"
            >
              <Heart className="h-6 w-6 fill-rose-200" />
            </button>

             <button
              onClick={() => onNavigate(AppRoute.SITEMAP)}
              className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-blue-50 transition-colors"
              title="Sitemap"
            >
              <Map className="h-6 w-6" />
            </button>

             <button
              onClick={() => onNavigate(AppRoute.ABOUT)}
              className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-blue-50 transition-colors"
              title="Về MathViet"
            >
              <Info className="h-6 w-6" />
            </button>

             <button
              onClick={onOpenHelp}
              className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-blue-50 transition-colors"
              title="Hướng dẫn"
            >
              <HelpCircle className="h-6 w-6" />
            </button>

             <button
              onClick={() => onNavigate(AppRoute.DASHBOARD)}
              className={`p-2 rounded-md ${currentRoute === AppRoute.DASHBOARD ? 'text-primary bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
              title="Góc học tập"
            >
              <LayoutDashboard className="h-6 w-6" />
            </button>

            <button
              onClick={() => onNavigate(AppRoute.PARENT_DASHBOARD)}
              className={`p-2 rounded-md ${currentRoute === AppRoute.PARENT_DASHBOARD ? 'text-primary bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
              title="Phụ huynh"
            >
              <Users className="h-6 w-6" />
            </button>
            
            <button
              onClick={onLogout}
              className="p-2 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title={isGuest ? "Thoát chế độ khách" : "Đăng xuất"}
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
