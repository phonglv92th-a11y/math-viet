
import React, { useState } from 'react';
// Added missing icons: Sparkles, Calculator, GraduationCap, Crown, Coffee
import { X, Brain, Puzzle, ShoppingBag, Layers, Shapes, Map, Trophy, Star, Zap, LayoutDashboard, User, Users, Award, BookOpen, Compass, Gamepad2, Target, Atom, FlaskConical, Dna, Hourglass, Globe, PenTool, Search, Grid, Grid3X3, Hammer, HelpCircle, Flame, Rocket, MousePointer2, Settings2, ShieldCheck, Heart, Info, ChevronRight, Sparkles, Calculator, GraduationCap, Crown, Coffee } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'START' | 'SUBJECTS' | 'MODES' | 'REWARDS' | 'FAQ';

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('START');

  if (!isOpen) return null;

  const NavButton = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all font-black whitespace-nowrap md:w-full text-left flex-shrink-0 border-2 ${
        activeTab === tab 
          ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 translate-x-1' 
          : 'bg-white text-slate-500 border-transparent hover:bg-slate-50 hover:border-slate-100'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm uppercase tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl h-[95vh] md:h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Left Sidebar (Desktop) / Top Nav (Mobile) */}
        <div className="w-full md:w-72 bg-slate-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-6 flex justify-between items-center md:block">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
                   <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-xl font-black text-slate-800 leading-none">TRỢ GIÚP</h2>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Trung tâm hỗ trợ</p>
                </div>
             </div>
             <button onClick={onClose} className="md:hidden p-2 bg-white rounded-full text-gray-400 shadow-sm border border-slate-100"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible px-4 pb-6 space-x-3 md:space-x-0 md:space-y-2 no-scrollbar">
             <NavButton tab="START" label="Khởi đầu" icon={Rocket} />
             <NavButton tab="SUBJECTS" label="Chương trình" icon={BookOpen} />
             <NavButton tab="MODES" label="Chế độ chơi" icon={Gamepad2} />
             <NavButton tab="REWARDS" label="Thành tích" icon={Trophy} />
             <NavButton tab="FAQ" label="Hỏi đáp" icon={Info} />
          </div>

          <div className="mt-auto p-6 hidden md:block border-t border-slate-100">
             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 border border-blue-100/50">
                <div className="flex items-center gap-2 mb-2">
                   <ShieldCheck className="w-4 h-4 text-blue-600" />
                   <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Dự án cộng đồng</span>
                </div>
                <p className="text-[11px] text-blue-800 font-bold leading-relaxed">
                   MathViet cam kết miễn phí và an toàn cho trẻ em 100%.
                </p>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
          {/* Desktop Close Button */}
          <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 p-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all z-20 border border-slate-100 shadow-sm"><X className="w-6 h-6" /></button>

          <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
            
            {/* --- TAB: START --- */}
            {activeTab === 'START' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                 <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                       <Sparkles className="w-3 h-3" /> Đã cập nhật phiên bản 1.2
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">Khám phá thế giới <span className="text-blue-600">MathViet</span></h1>
                    <p className="text-lg text-slate-500 font-medium mt-4">Chào mừng bạn! Hãy để AI dẫn dắt hành trình chinh phục tri thức của bạn một cách thú vị nhất.</p>
                 </div>

                 <div className="space-y-6">
                    <h3 className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                       <Target className="text-red-500" /> 4 Bước để trở thành "Siêu nhân"
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {[
                         { id: '01', title: 'Cấu hình Profile', desc: 'Chọn cấp lớp chính xác. AI sẽ tự động điều chỉnh ngôn ngữ và độ khó phù hợp với chương trình GDPT của Việt Nam.', bg: 'bg-blue-50', icon: '👤' },
                         { id: '02', title: 'Thực hiện Nhiệm vụ', desc: 'Mỗi ngày có 3 nhiệm vụ mới. Hoàn thành để nhận Bonus XP và duy trì ngọn lửa Streak rực cháy!', bg: 'bg-purple-50', icon: '📅' },
                         { id: '03', title: 'Chinh phục Game', desc: 'Lựa chọn giữa hàng chục mini-game đa dạng từ Tính nhẩm, Đố chữ đến Giải mã Logic.', bg: 'bg-emerald-50', icon: '🎮' },
                         { id: '04', title: 'Leo Bảng Xếp Hạng', desc: 'Tích lũy XP để thăng hạng trong Top Tuần. Hãy kết bạn để cùng thi đấu và so tài!', bg: 'bg-orange-50', icon: '🏆' }
                       ].map(step => (
                          <div key={step.id} className={`${step.bg} p-6 rounded-[2rem] border border-white shadow-sm flex gap-4 transition-transform hover:-translate-y-1`}>
                             <div className="bg-white/80 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">{step.icon}</div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <span className="text-[10px] font-black text-slate-400 uppercase">Bước {step.id}</span>
                                   <h4 className="font-black text-slate-800">{step.title}</h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{step.desc}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {/* --- TAB: SUBJECTS --- */}
            {activeTab === 'SUBJECTS' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-4xl font-black text-slate-800 flex items-center gap-3">
                     <BookOpen className="text-blue-600 w-10 h-10" /> Lộ trình học tập
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {/* Primary */}
                    <div className="relative p-8 bg-emerald-50/50 rounded-[2.5rem] border-2 border-emerald-100">
                       <div className="absolute -top-4 -left-4 bg-emerald-500 text-white px-4 py-2 rounded-2xl font-black text-xs shadow-lg uppercase tracking-wider">Tiểu Học (Lớp 1-5)</div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <h4 className="font-black text-emerald-800 flex items-center gap-2 text-lg"><Calculator className="w-5 h-5" /> TOÁN HỌC</h4>
                             <ul className="space-y-2">
                                {['Bảng cửu chương & 4 phép tính', 'So sánh, đếm hình & chu vi', 'Tỉ số, phân số & số thập phân', 'Giải toán có lời văn thực tế'].map((item, i) => (
                                   <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 font-bold">
                                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> {item}
                                   </li>
                                ))}
                             </ul>
                          </div>
                          <div className="space-y-4">
                             <h4 className="font-black text-emerald-800 flex items-center gap-2 text-lg"><PenTool className="w-5 h-5" /> TIẾNG VIỆT</h4>
                             <ul className="space-y-2">
                                {['Quy tắc chính tả, ch/tr, s/x...', 'Giải nghĩa từ, thành ngữ, tục ngữ', 'Phân tích câu, chủ ngữ - vị ngữ', 'Sắp xếp câu & hoàn thiện bài thơ'].map((item, i) => (
                                   <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 font-bold">
                                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> {item}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>

                    {/* Secondary & High */}
                    <div className="relative p-8 bg-blue-50/50 rounded-[2.5rem] border-2 border-blue-100">
                       <div className="absolute -top-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-2xl font-black text-xs shadow-lg uppercase tracking-wider">Trung Học (Lớp 6-12)</div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-4">
                             <h4 className="font-black text-blue-800 flex items-center gap-2 text-lg"><Atom className="w-5 h-5" /> KHOA HỌC</h4>
                             <p className="text-xs text-blue-600 font-bold leading-relaxed">
                                Vật lý (Cơ, Điện, Quang), Hóa học (Bảng tuần hoàn, Phản ứng), Sinh học (Tế bào, Di truyền).
                             </p>
                          </div>
                          <div className="space-y-4">
                             <h4 className="font-black text-blue-800 flex items-center gap-2 text-lg"><Globe className="w-5 h-5" /> TIẾNG ANH</h4>
                             <p className="text-xs text-blue-600 font-bold leading-relaxed">
                                Ngữ pháp nâng cao, Từ vựng IELTS/Academic, Đọc hiểu văn hóa quốc tế, Kiểm tra Spelling.
                             </p>
                          </div>
                          <div className="space-y-4">
                             <h4 className="font-black text-blue-800 flex items-center gap-2 text-lg"><GraduationCap className="w-5 h-5" /> THPT</h4>
                             <p className="text-xs text-blue-600 font-bold leading-relaxed">
                                Tích phân, Đạo hàm, Oxyz, Phân tích Ngữ Văn Trung đại & Hiện đại, Nghị luận xã hội.
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200 flex flex-col md:flex-row gap-6 items-center">
                     <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-4xl shrink-0 border-4 border-amber-100 shadow-sm animate-float-slow">🤖</div>
                     <div>
                        <h4 className="font-black text-amber-800 text-xl mb-1">Cơ chế Sáng tạo đề của Gemini AI</h4>
                        <p className="text-sm text-amber-700 font-bold leading-relaxed">
                           MathViet không sử dụng ngân hàng câu hỏi có sẵn. Mỗi khi bạn nhấn "Chơi", Gemini AI sẽ tổng hợp kiến thức từ chương trình học chuẩn để soạn bộ đề hoàn toàn mới. Điều này giúp bạn luyện tập mãi mãi mà không bao giờ chán!
                        </p>
                     </div>
                  </div>
               </div>
            )}

            {/* --- TAB: MODES --- */}
            {activeTab === 'MODES' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                 <h2 className="text-4xl font-black text-slate-800">Cơ chế các Chế độ chơi</h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-blue-50 border-2 border-slate-100 hover:border-blue-500 transition-all shadow-sm group">
                       <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm"><MousePointer2 size={28} /></div>
                       <h4 className="font-black text-xl text-slate-800 mb-3">Luyện Tập Nhanh</h4>
                       <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          Phù hợp cho những lúc rảnh rỗi 5-10 phút. Tự do tùy chọn môn học và độ khó. 
                          <br/><span className="text-blue-600 font-bold mt-2 inline-block">Mục tiêu: Ôn tập kiến thức cũ.</span>
                       </p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-red-50 border-2 border-slate-100 hover:border-red-500 transition-all shadow-sm group">
                       <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm"><Zap size={28} /></div>
                       <h4 className="font-black text-xl text-slate-800 mb-3">Speed Run (Tốc Độ)</h4>
                       <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          Thời gian giới hạn cho mỗi câu. <strong>Sai 1 câu = Game Over</strong>. Bù lại bạn sẽ nhận được <strong>x2 XP</strong> cho mỗi câu đúng.
                          <br/><span className="text-red-600 font-bold mt-2 inline-block">Thử thách: Khả năng phản xạ nhanh.</span>
                       </p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-emerald-50 border-2 border-slate-100 hover:border-emerald-500 transition-all shadow-sm group">
                       <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm"><Map size={28} /></div>
                       <h4 className="font-black text-xl text-slate-800 mb-3">Chế Độ Phiêu Lưu</h4>
                       <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          Theo lộ trình qua 3 thế giới thần thoại. Cần hoàn thành cấp độ trước để mở khóa cấp độ sau.
                          <br/><span className="text-emerald-600 font-bold mt-2 inline-block">Mục tiêu: Chinh phục cốt truyện.</span>
                       </p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-amber-50 border-2 border-slate-100 hover:border-amber-500 transition-all shadow-sm group">
                       <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm"><Crown size={28} /></div>
                       <h4 className="font-black text-xl text-slate-800 mb-3">Đỉnh Cao Tri Thức</h4>
                       <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          Vượt qua 18 bước leo núi. Có <strong>3 mạng</strong> và các điểm lưu (Checkpoint). Càng lên cao độ khó càng tăng kinh khủng.
                          <br/><span className="text-amber-600 font-bold mt-2 inline-block">Phần thưởng: Huy hiệu Thần Đồng.</span>
                       </p>
                    </div>
                 </div>
              </div>
            )}

            {/* --- TAB: REWARDS --- */}
            {activeTab === 'REWARDS' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-4xl font-black text-slate-800">Hệ thống danh hiệu</h2>
                  
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
                     <h4 className="text-2xl font-black mb-8 flex items-center gap-3"><Award className="text-yellow-400 w-8 h-8" /> Huy hiệu danh giá</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                          { emoji: '🥉', name: 'Tập Sự', xp: '500 XP', color: 'text-orange-400' },
                          { emoji: '🥈', name: 'Chuyên Gia', xp: '2.000 XP', color: 'text-slate-400' },
                          { emoji: '🥇', name: 'Bậc Thầy', xp: '5.000 XP', color: 'text-yellow-400' },
                          { emoji: '👑', name: 'Thần Đồng', xp: '10.000 XP', color: 'text-purple-400' }
                        ].map((badge, i) => (
                           <div key={i} className="text-center group cursor-help">
                              <div className="text-6xl mb-4 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500 drop-shadow-lg">{badge.emoji}</div>
                              <p className={`font-black text-lg ${badge.color}`}>{badge.name}</p>
                              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{badge.xp}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-xl font-black text-slate-800 uppercase tracking-wide">Cơ chế tính điểm thưởng</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-center text-center group hover:border-green-400 transition-colors shadow-sm">
                           <div className="bg-green-100 p-4 rounded-2xl text-green-600 font-black text-2xl mb-4 group-hover:scale-110 transition-transform">100</div>
                           <div className="text-sm font-black text-slate-700">XP cơ bản</div>
                           <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Mỗi câu trả lời đúng</p>
                        </div>
                        <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-center text-center group hover:border-blue-400 transition-colors shadow-sm">
                           <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 font-black text-2xl mb-4 group-hover:scale-110 transition-transform">+2</div>
                           <div className="text-sm font-black text-slate-700">Bonus giây</div>
                           <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Thưởng cho mỗi giây còn lại</p>
                        </div>
                        <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-center text-center group hover:border-orange-400 transition-colors shadow-sm">
                           <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 font-black text-2xl mb-4 group-hover:scale-110 transition-transform">X2</div>
                           <div className="text-sm font-black text-slate-700">Speed Multiplier</div>
                           <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Chỉ trong chế độ Tốc Độ</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* --- TAB: FAQ --- */}
            {activeTab === 'FAQ' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-4xl font-black text-slate-800">Giải đáp thắc mắc</h2>
                  
                  <div className="space-y-4">
                     {[
                        { q: "MathViet có thu phí trong tương lai không?", a: "MathViet là dự án cộng đồng phi lợi nhuận của Lâm Phong. Hệ thống sẽ luôn MIỄN PHÍ vĩnh viễn cho tất cả học sinh Việt Nam." },
                        { q: "Làm sao để con tôi học tập an toàn?", a: "MathViet không yêu cầu thông tin cá nhân nhạy cảm, không có chat room công khai (tránh bắt nạt) và nội dung được lọc kỹ bởi thuật toán AI an toàn." },
                        { q: "Dữ liệu Chế độ khách (Guest) lưu trữ ở đâu?", a: "Dữ liệu khách chỉ lưu tại bộ nhớ tạm trình duyệt của bạn. Để đảm bảo không mất XP và Badges khi đổi máy, bạn nên đăng ký một tài khoản thành viên." },
                        { q: "Tôi muốn đóng góp thêm câu hỏi hoặc báo lỗi AI?", a: "Chúng tôi rất trân trọng! Hãy nhấn vào mục 'Về chúng tôi' để lấy email liên hệ hoặc gửi góp ý trực tiếp trong mục Phụ huynh." }
                     ].map((faq, i) => (
                        <details key={i} className="group bg-slate-50 rounded-[2rem] border-2 border-transparent p-6 transition-all hover:bg-white hover:border-blue-100 hover:shadow-xl cursor-pointer">
                           <summary className="font-black text-slate-800 list-none flex justify-between items-center text-lg">
                              {faq.q}
                              <div className="bg-white p-2 rounded-full shadow-sm group-open:rotate-180 transition-transform">
                                 <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                           </summary>
                           <p className="text-base text-slate-600 mt-4 leading-relaxed font-medium pl-2 border-l-4 border-blue-500">
                              {faq.a}
                           </p>
                        </details>
                     ))}
                  </div>
                  
                  <div className="bg-rose-50 p-8 rounded-[3rem] border-2 border-rose-100 text-center">
                     <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-pulse fill-rose-100" />
                     <h4 className="text-2xl font-black text-rose-800 mb-2">Bạn muốn ủng hộ dự án?</h4>
                     <p className="text-sm text-rose-600 font-bold mb-6">Mỗi ly cà phê của bạn là động lực để mình duy trì Server AI mỗi tháng.</p>
                     <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-donation')); }} className="bg-rose-500 hover:bg-rose-600 text-white font-black py-4 px-10 rounded-2xl shadow-lg shadow-rose-200 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto">
                        <Coffee className="w-5 h-5 mr-2" /> Ủng hộ nhà phát triển
                     </button>
                  </div>
               </div>
            )}

          </div>
          
          {/* Bottom Sticky Action */}
          <div className="p-6 bg-slate-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
             <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs">👶</div>)}
                </div>
                <span className="text-slate-500 text-xs font-black uppercase tracking-wider">Hơn 5,000 học sinh đang tham gia!</span>
             </div>
             <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-blue-200 transition-all transform active:scale-95 w-full md:w-auto">BẮT ĐẦU HỌC NGAY</button>
          </div>
        </div>
      </div>
    </div>
  );
};
