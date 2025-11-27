
import React, { useState } from 'react';
import { X, Brain, Puzzle, ShoppingBag, Layers, Shapes, Map, Trophy, Star, Zap, LayoutDashboard, User, Users, Award, BookOpen, Compass, Gamepad2, Target, Atom, FlaskConical, Dna, Hourglass, Globe, PenTool, Search, Grid, Grid3X3, Hammer } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'OVERVIEW' | 'SUBJECTS' | 'MODES' | 'REWARDS';

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');

  if (!isOpen) return null;

  const NavButton = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-bold whitespace-nowrap md:w-full text-left flex-shrink-0 ${
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
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 md:px-6 md:pt-6 flex justify-between items-center md:block">
             <h2 className="text-lg md:text-xl font-extrabold text-gray-800 flex items-center">
               <BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-2 text-primary" />
               Hướng Dẫn
             </h2>
             <button onClick={onClose} className="md:hidden p-2 bg-white rounded-full text-gray-500 shadow-sm"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible px-2 pb-2 md:pb-0 md:px-4 space-x-2 md:space-x-0 md:space-y-2 no-scrollbar">
             <NavButton tab="OVERVIEW" label="Tổng Quan" icon={Compass} />
             <NavButton tab="SUBJECTS" label="Môn Học" icon={BookOpen} />
             <NavButton tab="MODES" label="Chế Độ Chơi" icon={Gamepad2} />
             <NavButton tab="REWARDS" label="Điểm & Thưởng" icon={Award} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
          <button onClick={onClose} className="hidden md:block absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10"><X className="w-5 h-5" /></button>

          <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar">
            
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                 <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Chào mừng đến với MathViet! 🇻🇳</h1>
                 <p className="text-gray-600 text-lg">
                    MathViet là nền tảng học tập thông minh sử dụng AI (Google Gemini) để tạo ra các bài tập toán, văn, anh, lý, hóa... không giới hạn, phù hợp cho học sinh từ lớp 1 đến lớp 12.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                       <h3 className="font-bold text-blue-800 mb-2">🤖 AI Powered</h3>
                       <p className="text-sm">Bài tập được tạo tự động, không bao giờ trùng lặp.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                       <h3 className="font-bold text-green-800 mb-2">📚 Đa Dạng</h3>
                       <p className="text-sm">Hỗ trợ Toán, Văn, Anh, Lý, Hóa, Sinh, Sử.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                       <h3 className="font-bold text-purple-800 mb-2">🎮 Gamification</h3>
                       <p className="text-sm">Học như chơi với điểm số, bảng xếp hạng và huy hiệu.</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'SUBJECTS' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi Tiết Các Môn Học</h2>
                  
                  {/* Toan Hoc */}
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                     <h3 className="font-bold text-xl text-blue-700 flex items-center mb-3"><Brain className="mr-2"/> Toán Học</h3>
                     <ul className="space-y-2 text-gray-700">
                        <li><strong>• Tính Nhẩm:</strong> Rèn luyện cộng trừ nhân chia tốc độ cao.</li>
                        <li><strong>• Mật Mã Logic:</strong> Tìm quy luật dãy số, hình ảnh (IQ).</li>
                        <li><strong>• Toán Thực Tế:</strong> Các bài toán có lời văn gắn với đời sống (mua bán, đo lường).</li>
                        <li><strong>• Xây Tháp / Đếm Hình:</strong> Các trò chơi tư duy không gian và sắp xếp dành cho tiểu học.</li>
                        <li><strong>• THPT (Lớp 10-12):</strong> Hỗ trợ công thức Toán cao cấp (Tích phân, Đạo hàm, Lượng giác) với hiển thị LaTeX chuẩn.</li>
                     </ul>
                  </div>

                  {/* Van Hoc */}
                  <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                     <h3 className="font-bold text-xl text-rose-700 flex items-center mb-3"><PenTool className="mr-2"/> Văn Học & Tiếng Việt</h3>
                     <ul className="space-y-2 text-gray-700">
                        <li><strong>• Truy Tìm Từ Vựng (Word Search):</strong> Tìm từ khóa ẩn trong bảng chữ cái.</li>
                        <li><strong>• Ô Chữ Bí Ẩn (Crossword):</strong> Giải ô chữ dựa trên gợi ý.</li>
                        <li><strong>• Vua Tiếng Việt:</strong> Trắc nghiệm từ đồng nghĩa, trái nghĩa, từ láy.</li>
                        <li><strong>• Thợ Xây Câu:</strong> Sắp xếp từ thành câu hoàn chỉnh đúng ngữ pháp.</li>
                        <li><strong>• Nhà Thơ Tài Ba:</strong> Điền từ còn thiếu vào thơ, ca dao.</li>
                     </ul>
                  </div>

                  {/* Khoa Hoc */}
                  <div className="bg-teal-50/50 p-5 rounded-2xl border border-teal-100">
                     <h3 className="font-bold text-xl text-teal-700 flex items-center mb-3"><Atom className="mr-2"/> Khoa Học Tự Nhiên & Xã Hội</h3>
                     <p className="text-sm italic text-gray-500 mb-2">(Dành cho học sinh từ lớp 6 trở lên)</p>
                     <ul className="space-y-2 text-gray-700">
                        <li><strong>• Vật Lý:</strong> Cơ học, Điện học, Quang học, Nhiệt học.</li>
                        <li><strong>• Hóa Học:</strong> Bảng tuần hoàn, Phản ứng hóa học, Hữu cơ/Vô cơ.</li>
                        <li><strong>• Sinh Học:</strong> Di truyền, Tế bào, Sinh thái.</li>
                        <li><strong>• Lịch Sử:</strong> Các sự kiện lịch sử Việt Nam và Thế giới.</li>
                     </ul>
                  </div>
               </div>
            )}

            {activeTab === 'MODES' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                 <h2 className="text-2xl font-bold text-gray-800">Các Chế Độ Chơi Đặc Biệt</h2>
                 
                 <div className="grid gap-4">
                    <div className="flex items-start bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                       <Zap className="w-8 h-8 text-yellow-600 mr-4 mt-1" />
                       <div>
                          <h4 className="font-bold text-lg text-gray-800">Speed Run (Tốc Độ)</h4>
                          <p className="text-sm text-gray-600">Trả lời câu hỏi trong thời gian cực ngắn (15s/câu). Điểm thưởng nhân đôi (x2) nhưng rủi ro cao hơn.</p>
                       </div>
                    </div>

                    <div className="flex items-start bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                       <Trophy className="w-8 h-8 text-indigo-600 mr-4 mt-1" />
                       <div>
                          <h4 className="font-bold text-lg text-gray-800">Đỉnh Cao Tri Thức (Leo Núi)</h4>
                          <p className="text-sm text-gray-600">Chế độ sinh tồn. Bạn có 3 mạng. Trả lời đúng liên tiếp để leo lên đỉnh núi. Độ khó tăng dần theo từng bậc.</p>
                       </div>
                    </div>

                    <div className="flex items-start bg-green-50 p-4 rounded-xl border border-green-100">
                       <Map className="w-8 h-8 text-green-600 mr-4 mt-1" />
                       <div>
                          <h4 className="font-bold text-lg text-gray-800">Hành Trình Tri Thức (Adventure)</h4>
                          <p className="text-sm text-gray-600">Khám phá các vùng đất: Đảo Số Học, Vương Quốc Chữ... Mỗi vùng đất là một chuỗi các bài học được sắp xếp logic.</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'REWARDS' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-2xl font-bold text-gray-800">Cách Tính Điểm & Phần Thưởng</h2>
                  
                  <div className="bg-white border rounded-xl overflow-hidden">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 font-bold text-gray-700">
                           <tr>
                              <th className="p-3">Hành động</th>
                              <th className="p-3">Điểm thưởng (XP)</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y">
                           <tr><td className="p-3">Trả lời đúng</td><td className="p-3 font-bold text-green-600">+100</td></tr>
                           <tr><td className="p-3">Tìm được 1 từ (Word Search)</td><td className="p-3 font-bold text-green-600">+50</td></tr>
                           <tr><td className="p-3">Bonus thời gian (Chế độ thường)</td><td className="p-3 text-blue-600">+2 điểm / giây còn lại</td></tr>
                           <tr><td className="p-3">Chế độ Speed Run</td><td className="p-3 text-red-600 font-bold">Nhân đôi (x2) tổng điểm</td></tr>
                           <tr><td className="p-3">Duy trì Streak (Chuỗi ngày)</td><td className="p-3 text-orange-600">+10 điểm / ngày</td></tr>
                        </tbody>
                     </table>
                  </div>

                  <div className="mt-6">
                     <h3 className="font-bold text-lg mb-3">Hệ Thống Huy Hiệu</h3>
                     <div className="flex gap-4">
                        <div className="text-center p-3 border rounded-lg bg-gray-50">
                           <div className="text-2xl">🏅</div>
                           <div className="font-bold text-xs mt-1">Tập Sự</div>
                           <div className="text-[10px] text-gray-500">500 điểm</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                           <div className="text-2xl">🎓</div>
                           <div className="font-bold text-xs mt-1">Nhà Toán Học</div>
                           <div className="text-[10px] text-gray-500">1000 điểm</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg bg-purple-50 border-purple-200">
                           <div className="text-2xl">👑</div>
                           <div className="font-bold text-xs mt-1">Thần Đồng</div>
                           <div className="text-[10px] text-gray-500">5000 điểm</div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
             <button onClick={onClose} className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform active:scale-95">Đã Hiểu</button>
          </div>
        </div>
      </div>
    </div>
  );
};
