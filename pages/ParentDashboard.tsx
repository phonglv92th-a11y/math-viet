import React from 'react';
import { AppRoute, UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft } from 'lucide-react';

interface ParentDashboardProps {
  user: UserProfile;
  onNavigate: (route: AppRoute) => void;
}

const dataActivity = [
  { name: 'T2', hours: 0.5 },
  { name: 'T3', hours: 1.2 },
  { name: 'T4', hours: 0.8 },
  { name: 'T5', hours: 1.5 },
  { name: 'T6', hours: 0.2 },
  { name: 'T7', hours: 2.0 },
  { name: 'CN', hours: 1.8 },
];

const dataSkills = [
  { name: 'Tính nhẩm', value: 400, color: '#3b82f6' },
  { name: 'Logic', value: 300, color: '#a855f7' },
  { name: 'Thực tế', value: 300, color: '#22c55e' },
];

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
       <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="flex items-center text-gray-600 hover:text-gray-800 font-bold mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
        </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bảng Theo Dõi Phụ Huynh</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Tổng Điểm</h3>
          <p className="text-4xl font-bold text-primary">{user.points}</p>
          <p className="text-green-500 text-sm mt-2 flex items-center">↑ 12% so với tuần trước</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Bài Học Hoàn Thành</h3>
           <p className="text-4xl font-bold text-secondary">{user.completedGames}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Thời gian học (Tuần này)</h3>
           <p className="text-4xl font-bold text-accent">8.0 Giờ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Thời gian học tập (Giờ)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="hours" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Phân bố kỹ năng</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={dataSkills}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {dataSkills.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col space-y-2 ml-4">
                {dataSkills.map((item) => (
                  <div key={item.name} className="flex items-center text-sm">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};