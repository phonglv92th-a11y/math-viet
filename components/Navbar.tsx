
import React from 'react';
import { AppRoute } from '../types';
import { Calculator, LayoutDashboard, Users, HelpCircle, Map } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: AppRoute) => void;
  currentRoute: AppRoute;
  userPoints: number;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentRoute, userPoints, onOpenHelp }) => {
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
             {/* Points Badge */}
             <div className="hidden md:flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold border border-yellow-300">
                <span className="mr-1">🏆</span> {userPoints} Điểm
             </div>

             <button
              onClick={() => onNavigate(AppRoute.SITEMAP)}
              className="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-blue-50 transition-colors"
              title="Sitemap"
            >
              <Map className="h-6 w-6" />
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
          </div>
        </div>
      </div>
    </nav>
  );
};
