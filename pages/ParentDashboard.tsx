
import React, { useState } from 'react';
import { AppRoute, UserProfile, GameType } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend 
} from 'recharts';
import { ArrowLeft, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock, Award, ChevronDown, Activity, BookOpen, Brain, Zap } from 'lucide-react';

interface ParentDashboardProps {
  user: UserProfile;
  onNavigate: (route: AppRoute) => void;
}

// Mock Data Generators
const generateActivityData = (range: string) => {
  if (range === 'MONTH') {
    return Array.from({ length: 4 }, (_, i) => ({
      name: `Tuần ${i + 1}`,
      hours: +(Math.random() * 10 + 2).toFixed(1),
      score: Math.floor(Math.random() * 2000 + 1000)
    }));
  }
  return [
    { name: 'T2', hours: 0.5, score: 350 },
    { name: 'T3', hours: 1.2, score: 800 },
    { name: 'T4', hours: 0.8, score: 450 },
    { name: 'T5', hours: 1.5, score: 900 },
    { name: 'T6', hours: 0.2, score: 150 },
    { name: 'T7', hours: 2.0, score: 1200 },
    { name: 'CN', hours: 1.8, score: 1100 },
  ];
};

const SUBJECT_MASTERY_DATA = [
  { subject: 'Toán Học', A: 85, fullMark: 100 },
  { subject: 'Văn Học', A: 65, fullMark: 100 },
  { subject: 'Tiếng Anh', A: 75, fullMark: 100 },
  { subject: 'Tư Duy Logic', A: 90, fullMark: 100 },
  { subject: 'Khoa Học', A: 60, fullMark: 100 },
  { subject: 'Lịch Sử', A: 70, fullMark: 100 },
];

const RECENT_HISTORY = [
  { id: 1, game: 'Tính Nhẩm Thần Tốc', date: 'Hôm nay, 10:30', duration: '15p', score: 1200, status: 'Xuất sắc' },
  { id: 2, game: 'Vua Tiếng Việt', date: 'Hôm qua, 15:45', duration: '10p', score: 850, status: 'Đạt' },
  { id: 3, game: 'Ô Chữ Bí Ẩn', date: 'Hôm qua, 16:00', duration: '20p', score: 400, status: 'Cần cố gắng' },
  { id: 4, game: 'Mật Mã Logic', date: '2 ngày trước', duration: '25p', score: 1500, status: 'Xuất sắc' },
  { id: 5, game: 'Tiếng Anh (Vocab)', date: '3 ngày trước', duration: '12p', score: 920, status: 'Giỏi' },
];

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onNavigate }) => {
  const [timeRange, setTimeRange] = useState<'WEEK' | 'MONTH'>('WEEK');

  const activityData = generateActivityData(timeRange);

  // Calculate dynamic insights based on mock data
  const totalHours = activityData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);
  const avgScore = Math.round(activityData.reduce((acc, curr) => acc + curr.score, 0) / activityData.length);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
                onClick={() => onNavigate(AppRoute.DASHBOARD)}
                className="flex items-center text-gray-500 hover:text-gray-800 font-bold mb-2 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại góc học tập
            </button>
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center">
              <Activity className="w-8 h-8 mr-3 text-blue-600" />
              Báo Cáo Học Tập
            </h1>
            <p className="text-gray-500 text-sm mt-1">Theo dõi sự tiến bộ của <span className="font-bold text-blue-600">{user.name}</span></p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <button 
              onClick={() => setTimeRange('WEEK')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === 'WEEK' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Tuần Này
            </button>
            <button 
              onClick={() => setTimeRange('MONTH')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${timeRange === 'MONTH' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Tháng Này
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
             <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-4">
                <Award className="w-6 h-6" />
             </div>
             <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng Điểm XP</p>
                <p className="text-2xl font-black text-slate-800">{user.points.toLocaleString()}</p>
             </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Bài Hoàn Thành</p>
                <p className="text-2xl font-black text-slate-800">{user.completedGames}</p>
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
             <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                <Clock className="w-6 h-6" />
             </div>
             <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Thời Gian Học</p>
                <p className="text-2xl font-black text-slate-800">{totalHours} Giờ</p>
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
             <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-4">
                <Zap className="w-6 h-6" />
             </div>
             <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Chuỗi Ngày</p>
                <p className="text-2xl font-black text-slate-800">{user.streak} Ngày</p>
             </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Biểu Đồ Hoạt Động
               </h3>
               <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Giờ học</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Mastery Radar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  Kỹ Năng Thành Thạo
               </h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SUBJECT_MASTERY_DATA}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Trình độ"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="#a78bfa"
                    fillOpacity={0.5}
                  />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights & History Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           
           {/* Insights Column */}
           <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
                 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" /> Điểm Mạnh
                 </h4>
                 <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Tư duy logic & Toán IQ (90/100)</li>
                    <li>• Tốc độ tính nhẩm nhanh vượt trội.</li>
                    <li>• Từ vựng tiếng Anh phong phú.</li>
                 </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-500">
                 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" /> Cần Cải Thiện
                 </h4>
                 <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Kiến thức Khoa học tự nhiên còn mới.</li>
                    <li>• Cần rèn luyện thêm kỹ năng đọc hiểu văn.</li>
                 </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                 <h4 className="font-bold text-lg mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" /> Gợi Ý Tuần Này
                 </h4>
                 <p className="text-blue-100 text-sm mb-4">
                    Khuyến khích bé chơi thêm chế độ <strong>"Thám Tử Văn Học"</strong> và <strong>"Thế Giới Sinh Học"</strong> để cân bằng các kỹ năng.
                 </p>
                 <button 
                    onClick={() => onNavigate(AppRoute.PRACTICE_SETUP)}
                    className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                 >
                    Thiết lập bài tập ngay
                 </button>
              </div>
           </div>

           {/* History Table */}
           <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-slate-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-slate-500" />
                    Lịch Sử Hoạt Động Gần Đây
                 </h3>
                 <button className="text-blue-600 text-sm font-bold hover:underline">Xem tất cả</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase">
                       <tr>
                          <th className="px-6 py-4">Trò chơi</th>
                          <th className="px-6 py-4">Thời gian</th>
                          <th className="px-6 py-4">Điểm số</th>
                          <th className="px-6 py-4">Thời lượng</th>
                          <th className="px-6 py-4">Đánh giá</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {RECENT_HISTORY.map((session) => (
                          <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-slate-700">{session.game}</td>
                             <td className="px-6 py-4 text-gray-500">{session.date}</td>
                             <td className="px-6 py-4 font-bold text-blue-600">{session.score} XP</td>
                             <td className="px-6 py-4 text-gray-500">{session.duration}</td>
                             <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                   session.status === 'Xuất sắc' ? 'bg-green-100 text-green-700' :
                                   session.status === 'Giỏi' ? 'bg-blue-100 text-blue-700' :
                                   session.status === 'Đạt' ? 'bg-yellow-100 text-yellow-700' :
                                   'bg-red-100 text-red-700'
                                }`}>
                                   {session.status}
                                </span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};
