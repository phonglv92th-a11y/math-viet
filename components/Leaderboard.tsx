
import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { Crown } from 'lucide-react';

// Mock Data (could be fetched from API in real app)
const MOCK_USER_DATABASE: LeaderboardEntry[] = [
  { rank: 1, id: 'u1', name: 'Minh Anh', points: 2450, avatar: '🦊' },
  { rank: 2, id: 'u2', name: 'Hoàng Long', points: 2100, avatar: '🦁' },
  { rank: 3, id: 'u3', name: 'Thảo Nhi', points: 1950, avatar: '🐰' },
  { rank: 4, id: 'u4', name: 'Gia Bảo', points: 1800, avatar: '🐼' },
  { rank: 5, id: 'u5', name: 'Tuấn Kiệt', points: 1650, avatar: '🐨' },
];

interface LeaderboardProps {
  onAddFriend: (id: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onAddFriend }) => {
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LeaderboardEntry[]>([]);

  const handleSearchFriend = () => {
    if (!searchQuery.trim()) return;
    const results = MOCK_USER_DATABASE.filter(u => (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.id === searchQuery));
    setSearchResults(results);
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm p-0 border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Bảng Xếp Hạng</h3>
            <Crown className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="p-2">
            {MOCK_USER_DATABASE.slice(0, 5).map((u, i) => (
            <div key={i} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <span className={`w-5 text-center font-bold text-xs mr-2 ${i===0?'text-yellow-500':i===1?'text-gray-400':'text-orange-400'}`}>{i+1}</span>
                <span className="mr-2 text-lg">{u.avatar}</span>
                <span className="text-xs font-bold text-gray-700 flex-1 truncate">{u.name}</span>
                <span className="text-xs font-bold text-blue-600">{u.points}</span>
            </div>
            ))}
            <button onClick={() => setIsAddFriendModalOpen(true)} className="w-full text-center text-xs text-blue-500 font-bold py-2 hover:underline mt-1">
            + Thêm bạn bè
            </button>
        </div>
      </div>

       {/* Add Friend Modal */}
       {isAddFriendModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddFriendModalOpen(false)}></div>
            <div className="relative bg-white rounded-2xl w-full max-w-sm p-4 animate-in zoom-in-95">
               <h3 className="font-bold mb-4">Kết bạn</h3>
               <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full border p-2 rounded-lg mb-2" placeholder="Nhập ID..." />
               <button onClick={handleSearchFriend} className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mb-4">Tìm</button>
               <div>{searchResults.map(r => <div key={r.id} className="flex justify-between items-center p-2 border-b"><span className="font-bold">{r.name}</span><button onClick={()=>{onAddFriend(r.id!); setIsAddFriendModalOpen(false)}} className="text-blue-500 font-bold">+</button></div>)}</div>
            </div>
         </div>
      )}
    </>
  );
};

export default Leaderboard;
