import React, { useState, useEffect } from 'react';
import { AppRoute, UserProfile } from '../types';
import { userService } from '../services/userService';
import { 
  LayoutDashboard, Users, Activity, Settings, Lock, LogOut, 
  TrendingUp, AlertTriangle, ShieldCheck, Database, Server, RefreshCw
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (route: AppRoute) => void;
}

const TRAFFIC_DATA = [
  { name: '00:00', users: 120 },
  { name: '04:00', users: 80 },
  { name: '08:00', users: 450 },
  { name: '12:00', users: 980 },
  { name: '16:00', users: 850 },
  { name: '20:00', users: 1200 },
  { name: '23:59', users: 600 },
];

const SUBJECT_DISTRIBUTION = [
  { name: 'Toán Học', value: 45, color: '#3b82f6' },
  { name: 'Văn Học', value: 25, color: '#f43f5e' },
  { name: 'Tiếng Anh', value: 20, color: '#8b5cf6' },
  { name: 'Khoa Học', value: 10, color: '#10b981' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'ANALYTICS' | 'SETTINGS'>('OVERVIEW');
  
  // Real User Data State
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
      fetchUsers();
    } else {
      setError('Mật khẩu không đúng!');
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    const users = await userService.getAllUsers();
    setUserList(users);
    setIsLoadingUsers(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    onNavigate(AppRoute.HOME);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/50">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Quản Trị Viên</h1>
            <p className="text-slate-400 text-sm">Hệ thống MathViet Analytics</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Mật khẩu truy cập</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              Đăng Nhập Dashboard
            </button>
          </form>
          <button onClick={() => onNavigate(AppRoute.HOME)} className="w-full text-slate-500 text-sm mt-4 hover:text-slate-300">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-1.5 rounded-lg"><Activity className="w-5 h-5" /></div>
             <span className="font-extrabold text-lg tracking-tight">MathViet Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {['OVERVIEW', 'USERS', 'ANALYTICS', 'SETTINGS'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
             >
                {tab === 'OVERVIEW' && <LayoutDashboard className="w-5 h-5 mr-3" />}
                {tab === 'USERS' && <Users className="w-5 h-5 mr-3" />}
                {tab === 'ANALYTICS' && <TrendingUp className="w-5 h-5 mr-3" />}
                {tab === 'SETTINGS' && <Settings className="w-5 h-5 mr-3" />}
                {tab === 'OVERVIEW' ? 'Tổng Quan' : tab === 'USERS' ? 'Người Dùng' : tab === 'ANALYTICS' ? 'Phân Tích' : 'Cấu Hình'}
             </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5 mr-2" /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Lưu lượng truy cập (Real-time)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TRAFFIC_DATA}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               {/* Stats Card */}
               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-6 h-6" /></div>
                        <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">Database</span>
                     </div>
                     <div className="text-3xl font-black text-slate-800">{userList.length}</div>
                     <div className="text-slate-500 text-xs uppercase font-bold tracking-wide mt-1">Người dùng đã đăng ký</div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Danh Sách Người Dùng (Realtime DB)</h3>
                  <button onClick={fetchUsers} className="flex items-center text-sm text-blue-600 font-bold hover:bg-blue-50 px-3 py-1 rounded transition-colors">
                     <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} /> Làm mới
                  </button>
               </div>
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                     <tr>
                        <th className="p-4">Username</th>
                        <th className="p-4">Tên hiển thị</th>
                        <th className="p-4">Cấp lớp</th>
                        <th className="p-4">Điểm XP</th>
                        <th className="p-4">Trạng thái</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {userList.map((user, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                           <td className="p-4 font-mono text-slate-400">{user.username || user.id}</td>
                           <td className="p-4 font-bold text-slate-800">{user.name}</td>
                           <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold text-xs">Lớp {user.grade}</span></td>
                           <td className="p-4 text-blue-600 font-bold">{user.points.toLocaleString()}</td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isGuest ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                                 {user.isGuest ? 'Khách' : 'Thành viên'}
                              </span>
                           </td>
                        </tr>
                     ))}
                     {userList.length === 0 && !isLoadingUsers && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-400">Không có dữ liệu người dùng hoặc chưa kết nối Firebase.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Cấu Hình Kết Nối</h3>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
                   <h4 className="font-bold text-blue-800 mb-2 flex items-center"><Database className="w-4 h-4 mr-2"/> Trạng thái Database</h4>
                   <p className="text-sm text-blue-700">
                      Để kết nối với Firebase thật, hãy đảm bảo bạn đã thêm các biến môi trường (VITE_FIREBASE_...) vào cấu hình dự án (Vercel/Local).
                   </p>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};