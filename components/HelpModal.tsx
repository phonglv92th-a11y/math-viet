import React, { useState } from 'react';
import { X, Brain, Puzzle, ShoppingBag, Layers, Shapes, Map, Trophy, Star, Zap, LayoutDashboard, User, Users, Award, BookOpen, Compass, Gamepad2, Target } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'OVERVIEW' | 'GAMES' | 'REWARDS' | 'NAV';

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');

  if (!isOpen) return null;

  const NavButton = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all w-full text-left font-bold ${
        activeTab === tab 
          ? 'bg-blue-100 text-primary' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden animate-in zoom-in-95 duration-200 flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 flex flex-col p-4">
          <div className="mb-6 px-2 pt-2">
             <h2 className="text-xl font-extrabold text-gray-800 flex items-center">
               <BookOpen className="w-6 h-6 mr-2 text-primary" />
               Hướng Dẫn
             </h2>
          </div>
          
          <div className="space-y-2 flex-1 overflow-y-auto">
             <NavButton tab="OVERVIEW" label="Tổng Quan" icon={Compass} />
             <NavButton tab="GAMES" label="Các Trò Chơi" icon={Gamepad2} />
             <NavButton tab="REWARDS" label="Điểm & Thưởng" icon={Award} />
             <NavButton tab="NAV" label="Điều Hướng" icon={LayoutDashboard} />
          </div>

          <div className="pt-4 border-t border-gray-200 mt-2 text-xs text-gray-400 text-center">
             Phiên bản 1.0.0
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
            
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-8">
                   <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                     Chào mừng đến với MathViet! 🇻🇳
                   </h1>
                   <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                     Nền tảng học toán thông minh kết hợp trò chơi, giúp các bạn học sinh từ lớp 1 đến lớp 9 rèn luyện tư duy một cách vui vẻ và hiệu quả.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-blue-50 p-6 rounded-2xl">
                      <h3 className="font-bold text-blue-800 mb-2 flex items-center"><User className="w-5 h-5 mr-2" /> Hồ Sơ Của Bạn</h3>
                      <p className="text-sm text-gray-600">
                        Tại đây bạn có thể chọn lớp học phù hợp. Hệ thống AI sẽ tự động điều chỉnh độ khó của câu hỏi dựa trên lớp học và trình độ của bạn.
                      </p>
                   </div>
                   <div className="bg-purple-50 p-6 rounded-2xl">
                      <h3 className="font-bold text-purple-800 mb-2 flex items-center"><Target className="w-5 h-5 mr-2" /> Mục Tiêu</h3>
                      <p className="text-sm text-gray-600">
                        Mỗi ngày hãy dành 15-30 phút để luyện tập. Duy trì chuỗi ngày học tập (Streak) để nhận thêm nhiều phần thưởng đặc biệt!
                      </p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'GAMES' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Các Chế Độ Chơi</h2>
                  
                  <div className="space-y-4">
                    <div className="flex p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      <div className="bg-blue-100 p-3 rounded-lg h-fit mr-4 text-blue-600"><Brain size={24} /></div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">Tính Nhẩm Thần Tốc</h4>
                        <p className="text-sm text-gray-500 mb-1 italic">Kỹ năng: Số học, Tốc độ</p>
                        <p className="text-gray-600">Rèn luyện phản xạ với các phép tính cộng, trừ, nhân, chia cơ bản. Bạn cần đưa ra đáp án chính xác trong thời gian ngắn nhất.</p>
                      </div>
                    </div>

                    <div className="flex p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      <div className="bg-purple-100 p-3 rounded-lg h-fit mr-4 text-purple-600"><Puzzle size={24} /></div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">Mật Mã Logic</h4>
                        <p className="text-sm text-gray-500 mb-1 italic">Kỹ năng: Tư duy logic, Quy luật</p>
                        <p className="text-gray-600">Tìm số còn thiếu trong dãy số, hoặc giải các câu đố IQ toán học. Giúp phát triển tư duy trừu tượng.</p>
                      </div>
                    </div>

                    <div className="flex p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      <div className="bg-green-100 p-3 rounded-lg h-fit mr-4 text-green-600"><ShoppingBag size={24} /></div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">Toán Thực Tế</h4>
                        <p className="text-sm text-gray-500 mb-1 italic">Kỹ năng: Ứng dụng, Giải quyết vấn đề</p>
                        <p className="text-gray-600">Giải quyết các bài toán có lời văn gắn liền với đời sống như: tính tiền đi chợ, xem đồng hồ, chia kẹo cho bạn bè.</p>
                      </div>
                    </div>

                    <div className="flex p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      <div className="bg-pink-100 p-3 rounded-lg h-fit mr-4 text-pink-600"><Layers size={24} /></div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">Xây Tháp Trí Tuệ</h4>
                        <p className="text-sm text-gray-500 mb-1 italic">Kỹ năng: So sánh, Sắp xếp</p>
                        <p className="text-gray-600">Nhiệm vụ của bạn là sắp xếp các con số theo thứ tự hoặc điền số vào thang leo. Phù hợp để ôn tập về giá trị của các số.</p>
                      </div>
                    </div>

                    <div className="flex p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      <div className="bg-teal-100 p-3 rounded-lg h-fit mr-4 text-teal-600"><Shapes size={24} /></div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">Đếm Hình Đoán Số</h4>
                        <p className="text-sm text-gray-500 mb-1 italic">Kỹ năng: Quan sát, Hình học</p>
                        <p className="text-gray-600">Sử dụng hình ảnh vui nhộn (trái cây, động vật) để thực hiện phép tính. Rất tốt cho các bạn học sinh tiểu học.</p>
                      </div>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'REWARDS' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Award className="text-yellow-500 mr-2" /> Hệ Thống Điểm Thưởng</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between">
                         <span className="font-bold text-gray-700">Trả lời đúng</span>
                         <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">+100 điểm</span>
                      </li>
                      <li className="flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="font-bold text-gray-700">Thưởng thời gian</span>
                            <span className="text-xs text-gray-500">Chỉ áp dụng ở chế độ Cơ bản</span>
                         </div>
                         <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">+2 điểm / giây còn lại</span>
                      </li>
                      <li className="flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="font-bold text-gray-700 flex items-center"><Zap className="w-4 h-4 text-red-500 mr-1" /> Chế độ Tốc độ (Speed Run)</span>
                            <span className="text-xs text-gray-500">Độ khó cao hơn, rủi ro cao hơn</span>
                         </div>
                         <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full">Nhân đôi (x2) tổng điểm</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                   <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Trophy className="text-orange-500 mr-2" /> Huy Hiệu (Badges)</h2>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="border p-4 rounded-xl flex flex-col items-center text-center">
                         <div className="text-3xl mb-2">🏅</div>
                         <div className="font-bold text-sm">Tập Sự</div>
                         <div className="text-xs text-gray-500">Đạt 500 điểm</div>
                      </div>
                      <div className="border p-4 rounded-xl flex flex-col items-center text-center bg-yellow-50 border-yellow-200">
                         <div className="text-3xl mb-2">🎓</div>
                         <div className="font-bold text-sm">Nhà Toán Học</div>
                         <div className="text-xs text-gray-500">Đạt 1000 điểm</div>
                      </div>
                      <div className="border p-4 rounded-xl flex flex-col items-center text-center opacity-50">
                         <div className="text-3xl mb-2">👑</div>
                         <div className="font-bold text-sm">Thần Đồng</div>
                         <div className="text-xs text-gray-500">???</div>
                      </div>
                   </div>
                </section>

                <section>
                   <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Star className="text-purple-500 mr-2" /> Chuỗi Ngày (Streak)</h2>
                   <p className="text-gray-600 mb-4">
                     Chuỗi ngày thể hiện sự chăm chỉ của bạn. Hãy vào ứng dụng và hoàn thành ít nhất 1 bài học mỗi ngày để duy trì ngọn lửa này nhé! 🔥
                   </p>
                </section>
              </div>
            )}

            {activeTab === 'NAV' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Điều Hướng Ứng Dụng</h2>
                 
                 <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start">
                       <LayoutDashboard className="w-8 h-8 text-blue-500 mr-4 mt-1" />
                       <div>
                          <h4 className="font-bold text-lg">Góc Học Tập (Dashboard)</h4>
                          <p className="text-gray-600 text-sm">Trung tâm chính của bạn. Tại đây bạn có thể chọn trò chơi, xem bảng xếp hạng bạn bè và theo dõi tiến độ cá nhân.</p>
                       </div>
                    </div>

                    <div className="flex items-start">
                       <Map className="w-8 h-8 text-emerald-500 mr-4 mt-1" />
                       <div>
                          <h4 className="font-bold text-lg">Hành Trình Tri Thức (Adventure Map)</h4>
                          <p className="text-gray-600 text-sm">Chế độ chơi theo cốt truyện. Bạn sẽ đi qua các vùng đất khác nhau, mỗi vùng đất là một thử thách mới cần mở khóa.</p>
                       </div>
                    </div>

                    <div className="flex items-start">
                       <Users className="w-8 h-8 text-indigo-500 mr-4 mt-1" />
                       <div>
                          <h4 className="font-bold text-lg">Bảng Xếp Hạng & Bạn Bè</h4>
                          <p className="text-gray-600 text-sm">Thi đua cùng các bạn học sinh khác trên toàn quốc hoặc thêm bạn bè để cùng nhau tiến bộ.</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

          </div>

          <div className="p-4 bg-gray-50 text-center border-t border-gray-200">
            <button 
              onClick={onClose}
              className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Đã Hiểu!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};