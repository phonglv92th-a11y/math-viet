
import React, { useState } from 'react';
import { X, Search, UserPlus, Link, Send, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface FriendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

// Mock Friends Database for demo (in real app, fetch from DB)
const MOCK_FRIENDS_DB = [
  { id: 'u1', name: 'Minh Anh', avatar: '🦊', status: 'Online' },
  { id: 'u2', name: 'Hoàng Long', avatar: '🦁', status: 'Offline' },
  { id: 'u3', name: 'Thảo Nhi', avatar: '🐰', status: 'Playing' },
];

export const FriendInviteModal: React.FC<FriendInviteModalProps> = ({ isOpen, onClose, user }) => {
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter friends: Real logic would use user.friends IDs to fetch details.
  // Here we mock it by assuming user has added some friends from the mock DB.
  // If user.friends is empty, we show a message.
  const myFriends = MOCK_FRIENDS_DB; // In real app: MOCK_FRIENDS_DB.filter(f => user.friends.includes(f.id));

  const handleInvite = (id: string) => {
    setInvitedIds([...invitedIds, id]);
    // Simulate API call
    setTimeout(() => {
        // Toast or notification could go here
    }, 500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://mathviet.app/play?invite=${user.id}`);
    alert('Đã sao chép đường dẫn mời chơi!');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
           <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold flex items-center">
                 <UserPlus className="w-6 h-6 mr-2" /> Mời Bạn Bè
              </h2>
              <button onClick={onClose} className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
           </div>
           <p className="text-blue-100 text-sm">Cùng thi đấu xem ai giỏi hơn nào!</p>
        </div>

        <div className="p-6">
           {/* Copy Link Section */}
           <div className="flex items-center gap-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="bg-white p-2 rounded-lg border border-gray-200 text-gray-400">
                 <Link className="w-4 h-4" />
              </div>
              <div className="flex-1 truncate text-sm text-gray-500 font-mono">
                 mathviet.app/play?invite={user.id.substring(0,6)}...
              </div>
              <button 
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-200 transition-colors"
              >
                 Sao chép
              </button>
           </div>

           {/* Search */}
           <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                 type="text" 
                 placeholder="Tìm tên bạn bè..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm"
              />
           </div>

           {/* Friends List */}
           <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {myFriends.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(friend => (
                 <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                       <span className="text-2xl">{friend.avatar}</span>
                       <div>
                          <div className="font-bold text-gray-800 text-sm">{friend.name}</div>
                          <div className="flex items-center">
                             <span className={`w-2 h-2 rounded-full mr-1.5 ${friend.status === 'Online' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                             <span className="text-xs text-gray-500">{friend.status}</span>
                          </div>
                       </div>
                    </div>
                    
                    {invitedIds.includes(friend.id) ? (
                        <button disabled className="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg text-xs font-bold flex items-center">
                           <Check className="w-3 h-3 mr-1" /> Đã mời
                        </button>
                    ) : (
                        <button 
                           onClick={() => handleInvite(friend.id)}
                           className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                        >
                           <Send className="w-3 h-3 mr-1" /> Mời
                        </button>
                    )}
                 </div>
              ))}
              
              {myFriends.length === 0 && (
                 <div className="text-center text-gray-400 py-8 text-sm">
                    Chưa có bạn bè nào. Hãy kết bạn từ Bảng Xếp Hạng nhé!
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
