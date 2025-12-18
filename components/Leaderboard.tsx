
import React, { useState, useMemo } from 'react';
import { LeaderboardEntry } from '../types';
import { Crown, Search, UserPlus, ChevronDown, UserCheck, Trophy } from 'lucide-react';

// Expanded Mock Data for better pagination demo
const MOCK_USER_DATABASE: LeaderboardEntry[] = [
  { rank: 1, id: 'u1', name: 'Minh Anh', points: 2450, avatar: '🦊' },
  { rank: 2, id: 'u2', name: 'Hoàng Long', points: 2100, avatar: '🦁' },
  { rank: 3, id: 'u3', name: 'Thảo Nhi', points: 1950, avatar: '🐰' },
  { rank: 4, id: 'u4', name: 'Gia Bảo', points: 1800, avatar: '🐼' },
  { rank: 5, id: 'u5', name: 'Tuấn Kiệt', points: 1650, avatar: '🐨' },
  { rank: 6, id: 'u6', name: 'Linh Chi', points: 1500, avatar: '🐱' },
  { rank: 7, id: 'u7', name: 'Đức Anh', points: 1420, avatar: '🐯' },
  { rank: 8, id: 'u8', name: 'Hương Giang', points: 1380, avatar: '🦒' },
  { rank: 9, id: 'u9', name: 'Quốc Anh', points: 1250, avatar: '🐴' },
  { rank: 10, id: 'u10', name: 'Mai Phương', points: 1100, avatar: '🐧' },
  { rank: 11, id: 'u11', name: 'Thành Nam', points: 950, avatar: '🐙' },
  { rank: 12, id: 'u12', name: 'Bích Ngọc', points: 880, avatar: '🦄' },
];

interface LeaderboardProps {
  onAddFriend: (id: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onAddFriend }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(5);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_USER_DATABASE;
    return MOCK_USER_DATABASE.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.id?.toLowerCase() === searchQuery.toLowerCase()
    );
  }, [searchQuery]);

  const displayedUsers = filteredUsers.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredUsers.length;

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 5);
  };

  const handleAddFriendClick = (id: string) => {
    onAddFriend(id);
    setAddedFriends(prev => [...prev, id]);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Bảng Xếp Hạng</h3>
        </div>
        <div className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
          Top Tuần
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm bạn bè..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setItemsToShow(5); // Reset pagination on search
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="p-2 space-y-1">
        {displayedUsers.length > 0 ? (
          displayedUsers.map((u, i) => {
            const rankColor = u.rank === 1 ? 'text-yellow-500' : u.rank === 2 ? 'text-slate-400' : u.rank === 3 ? 'text-orange-400' : 'text-slate-300';
            
            return (
              <div key={u.id || i} className="flex items-center p-3 hover:bg-slate-50 rounded-2xl transition-all group/item">
                <div className={`w-6 text-center font-black text-xs mr-2 ${rankColor}`}>
                  {u.rank}
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl mr-3 group-hover/item:scale-110 transition-transform">
                  {u.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-slate-800 truncate">{u.name}</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{u.points.toLocaleString()} XP</div>
                </div>
                
                {u.id && addedFriends.includes(u.id) ? (
                  <div className="p-2 text-green-500" title="Đã kết bạn">
                    <UserCheck className="w-4 h-4" />
                  </div>
                ) : u.id ? (
                  <button 
                    onClick={() => handleAddFriendClick(u.id!)}
                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover/item:opacity-100"
                    title="Thêm bạn"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="bg-slate-50 p-3 rounded-full mb-2">
              <Search className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-400">Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <button 
          onClick={handleLoadMore}
          className="mx-4 mb-4 py-2 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
        >
          Xem thêm <ChevronDown className="w-3 h-3" />
        </button>
      )}

      {/* Footer Info */}
      <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100">
        <p className="text-[9px] font-bold text-slate-400 uppercase text-center tracking-tighter">
          Cập nhật mỗi 5 phút • Tham gia thi đấu để thăng hạng!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
