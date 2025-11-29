
import React, { useState } from 'react';
import { AppRoute } from '../types';
import { 
  LayoutDashboard, Users, Activity, Settings, Lock, LogOut, 
  TrendingUp, AlertTriangle, ShieldCheck, Database, Server
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (route: AppRoute) => void;
}

// --- MOCK DATA FOR ANALYTICS ---
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

const USER_TABLE_DATA = [
  { id: 'U001', name: 'Nguyễn Văn A', grade: 5, xp: 12500, status: 'Online', lastActive: 'Vừa xong' },
  { id: 'U002', name: 'Trần Thị B', grade: 9, xp: 8400, status: 'Offline', lastActive: '2 giờ trước' },
  { id: 'U003', name: 'Lê Hoàng C', grade: 12, xp: 21000, status: 'Online', lastActive: '5 phút trước' },
  { id: 'U004', name: 'Phạm Minh D', grade: 3, xp: 4500, status: 'Offline', lastActive: '1 ngày trước' },
  { id: 'U005', name: 'Vũ Thu E', grade: 7, xp: 9200, status: 'Online', lastActive: 'Vừa xong' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'ANALYTICS' | 'SETTINGS'>('OVERVIEW');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded password for demo
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mật khẩu không đúng!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    onNavigate(AppRoute.HOME);
  };

  // --- LOGIN VIEW ---
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

  // --- DASHBOARD VIEW ---
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
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'OVERVIEW' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Tổng Quan
          </button>
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'USERS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5 mr-3" /> Người Dùng
          </button>
          <button 
            onClick={() => setActiveTab('ANALYTICS')}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'ANALYTICS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <TrendingUp className="w-5 h-5 mr-3" /> Phân Tích
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'SETTINGS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5 mr-3" /> Cấu Hình
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5 mr-2" /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:hidden flex justify-between items-center">
           <span className="font-bold text-slate-800">Admin Dashboard</span>
           <button onClick={handleLogout}><LogOut className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-6 h-6" /></div>
                  <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">+12%</span>
               </div>
               <div className="text-3xl font-black text-slate-800">1,240</div>
               <div className="text-slate-500 text-xs uppercase font-bold tracking-wide mt-1">Người dùng Active</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Activity className="w-6 h-6" /></div>
                  <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">+24%</span>
               </div>
               <div className="text-3xl font-black text-slate-800">850</div>
               <div className="text-slate-500 text-xs uppercase font-bold tracking-wide mt-1">Đang Online (Giả lập)</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Database className="w-6 h-6" /></div>
               </div>
               <div className="text-3xl font-black text-slate-800">15.2K</div>
               <div className="text-slate-500 text-xs uppercase font-bold tracking-wide mt-1">Bài tập đã tạo</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600"><Server className="w-6 h-6" /></div>
                  <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">Ổn định</span>
               </div>
               <div className="text-3xl font-black text-slate-800">99.9%</div>
               <div className="text-slate-500 text-xs uppercase font-bold tracking-wide mt-1">Uptime Hệ Thống</div>
            </div>
          </div>

          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Traffic Chart */}
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

               {/* Subject Distribution */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Tỷ lệ Môn học</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SUBJECT_DISTRIBUTION}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {SUBJECT_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                     {SUBJECT_DISTRIBUTION.map((item) => (
                       <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                             <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: item.color}}></div>
                             <span className="text-slate-600 font-medium">{item.name}</span>
                          </div>
                          <span className="font-bold text-slate-800">{item.value}%</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Danh Sách Người Dùng Gần Đây</h3>
                  <button className="text-sm text-blue-600 font-bold hover:underline">Xuất báo cáo</button>
               </div>
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                     <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Tên hiển thị</th>
                        <th className="p-4">Cấp lớp</th>
                        <th className="p-4">Điểm XP</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4">Hoạt động</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {USER_TABLE_DATA.map((user, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                           <td className="p-4 font-mono text-slate-400">{user.id}</td>
                           <td className="p-4 font-bold text-slate-800">{user.name}</td>
                           <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold text-xs">Lớp {user.grade}</span></td>
                           <td className="p-4 text-blue-600 font-bold">{user.xp.toLocaleString()}</td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Online' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                 {user.status}
                              </span>
                           </td>
                           <td className="p-4 text-slate-500">{user.lastActive}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               <div className="p-4 bg-slate-50 text-center text-slate-500 text-xs italic">
                  * Dữ liệu hiển thị là dữ liệu giả lập vì ứng dụng chưa có Database tập trung.
               </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Cấu Hình Hệ Thống</h3>
                
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                         <h4 className="font-bold text-slate-800">Chế độ Bảo Trì</h4>
                         <p className="text-sm text-slate-500">Tạm dừng truy cập để nâng cấp hệ thống</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                         <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-all"></div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                         <h4 className="font-bold text-slate-800">Thông báo toàn hệ thống</h4>
                         <p className="text-sm text-slate-500">Hiển thị banner thông báo cho tất cả người dùng</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                         <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 right-0.5 transition-all"></div>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">API Key (Gemini)</label>
                      <div className="flex gap-2">
                         <input type="password" value="**************************" disabled className="flex-1 bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-slate-500" />
                         <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg">Thay đổi</button>
                      </div>
                   </div>

                   <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                         <h4 className="font-bold text-yellow-800 text-sm">Lưu ý quan trọng</h4>
                         <p className="text-xs text-yellow-700 mt-1">
                            Các cài đặt này hiện tại chỉ có hiệu lực trên phiên làm việc của Admin vì chưa có Backend Server.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
