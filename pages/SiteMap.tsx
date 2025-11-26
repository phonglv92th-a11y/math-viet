
import React from 'react';
import { AppRoute } from '../types';
import { ArrowLeft, Map as MapIcon, Layout, Gamepad2, Users, Settings, Sparkles, Brain, Target, Shield, BookOpen, Crown, Zap, Home, Calculator, PenTool, GraduationCap, Globe, Grid } from 'lucide-react';

interface SiteMapProps {
  onNavigate: (route: AppRoute) => void;
}

const FeatureItem = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
  <div className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600 mr-4 shrink-0`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SitemapNode = ({ title, route, children, onNavigate, icon: Icon, color = 'gray' }: { title: string, route?: AppRoute, children?: React.ReactNode, onNavigate?: (r: AppRoute) => void, icon?: any, color?: string }) => (
  <div className="ml-6 relative border-l-2 border-gray-200 pl-6 py-3">
    <div className="absolute top-6 left-0 w-6 h-0.5 bg-gray-200"></div>
    <div 
        onClick={() => route && onNavigate && onNavigate(route)}
        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${route ? 'bg-white shadow-sm border border-gray-100 cursor-pointer hover:text-blue-600 hover:border-blue-300 hover:shadow-md' : 'bg-gray-50 text-gray-700'}`}
    >
      {Icon && <Icon className={`w-4 h-4 mr-2 text-${color}-500`} />}
      {title}
    </div>
    {children && <div className="mt-2">{children}</div>}
  </div>
);

export const SiteMap: React.FC<SiteMapProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="flex items-center text-gray-600 hover:text-gray-800 font-bold mb-8 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
        </button>

        <div className="text-center mb-12">
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Sitemap & Tính Năng</h1>
           <p className="text-gray-500 max-w-2xl mx-auto">
             Tổng quan về cấu trúc ứng dụng MathViet và danh sách các tính năng nổi bật giúp học sinh học tập hiệu quả.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
           
           {/* Column 1: Feature List */}
           <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                 <Sparkles className="w-6 h-6 mr-2 text-yellow-500" /> Tính Năng Nổi Bật
              </h2>
              <div className="space-y-4">
                 <FeatureItem 
                    icon={Brain} color="blue"
                    title="AI Thông Minh (Gemini)" 
                    desc="Hệ thống tự động tạo bài tập toán, văn và tiếng anh vô hạn, thích ứng với trình độ lớp 1-12 và chủ đề tùy chọn."
                 />
                 <FeatureItem 
                    icon={Target} color="purple"
                    title="Gamification Hấp Dẫn" 
                    desc="Hệ thống điểm thưởng (XP), Huy hiệu (Badges), Chuỗi ngày (Streak) và Bảng xếp hạng giúp duy trì động lực học tập."
                 />
                 <FeatureItem 
                    icon={MapIcon} color="green"
                    title="Chế Độ Phiêu Lưu" 
                    desc="Khám phá 3 thế giới: Đảo Số Học, Vương Quốc Chữ và Vũ Trụ Logic với lộ trình học tập theo cốt truyện."
                 />
                 <FeatureItem 
                    icon={Zap} color="red"
                    title="Speed Run & Thử Thách" 
                    desc="Chế độ chơi giới hạn thời gian và 'Thử Thách Hỗn Hợp' kết hợp cả Toán, Văn & Anh để kiểm tra kiến thức toàn diện."
                 />
                 <FeatureItem 
                    icon={Settings} color="orange"
                    title="Tùy Chỉnh Cá Nhân Hóa" 
                    desc="Học sinh có thể tùy chỉnh giao diện (Theme), cài đặt bài tập riêng (Custom Practice) theo nhu cầu."
                 />
                 <FeatureItem 
                    icon={Users} color="indigo"
                    title="Dành Cho Phụ Huynh" 
                    desc="Bảng điều khiển riêng để phụ huynh theo dõi tiến độ, thời gian học và các kỹ năng con còn yếu."
                 />
              </div>
           </div>

           {/* Column 2: Sitemap Tree & Curriculum */}
           <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                 <Layout className="w-6 h-6 mr-2 text-blue-500" /> Cấu Trúc & Chương Trình
              </h2>
              
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 overflow-x-auto">
                 <SitemapNode title="MathViet (Trang Chủ)" route={AppRoute.HOME} onNavigate={onNavigate} icon={Home} color="blue">
                    
                    <SitemapNode title="Góc Học Tập (Dashboard)" route={AppRoute.DASHBOARD} onNavigate={onNavigate} icon={Layout} color="indigo">
                       
                       <SitemapNode title="Tiểu Học (Lớp 1-5)" icon={GraduationCap} color="green">
                          <SitemapNode title="Toán Học" icon={Calculator} color="blue">
                             <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Lớp 1-2: Cộng, trừ, so sánh số, hình học cơ bản.</p>
                                <p>• Lớp 3: Nhân, chia, bảng cửu chương, đo lường.</p>
                                <p>• Lớp 4-5: Phân số, số thập phân, tỉ số phần trăm, hình học phẳng.</p>
                             </div>
                          </SitemapNode>
                          <SitemapNode title="Tiếng Việt" icon={PenTool} color="rose">
                              <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Chính tả (Phân biệt tr/ch, s/x...)</p>
                                <p>• Từ vựng (Từ đồng nghĩa, trái nghĩa, từ láy)</p>
                                <p>• Câu đố thơ ca, ca dao tục ngữ.</p>
                                <p>• Truy tìm từ vựng (Word Search).</p>
                                <p>• Ô chữ bí ẩn (Crossword).</p>
                             </div>
                          </SitemapNode>
                          <SitemapNode title="Tiếng Anh" icon={Globe} color="indigo">
                              <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Từ vựng theo chủ đề (Gia đình, Động vật...)</p>
                                <p>• Ngữ pháp cơ bản (Hiện tại đơn, Số nhiều)</p>
                             </div>
                          </SitemapNode>
                       </SitemapNode>

                       <SitemapNode title="Trung Học Cơ Sở (Lớp 6-9)" icon={GraduationCap} color="orange">
                          <SitemapNode title="Toán Học" icon={Calculator} color="blue">
                             <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Đại số: Số nguyên, phân thức, phương trình, hệ phương trình.</p>
                                <p>• Hình học: Góc, tam giác, đường tròn, hình học không gian.</p>
                                <p>• Xác suất thống kê cơ bản.</p>
                             </div>
                          </SitemapNode>
                          <SitemapNode title="Ngữ Văn" icon={BookOpen} color="rose">
                              <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Biện pháp tu từ (Ẩn dụ, hoán dụ, nhân hóa).</p>
                                <p>• Phân tích tác phẩm văn học, thơ.</p>
                                <p>• Ngữ pháp nâng cao và cấu trúc câu.</p>
                             </div>
                          </SitemapNode>
                          <SitemapNode title="Tiếng Anh" icon={Globe} color="indigo">
                              <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Ngữ pháp nâng cao (Các thì, Câu điều kiện).</p>
                                <p>• Đọc hiểu văn bản và văn hóa.</p>
                             </div>
                          </SitemapNode>
                       </SitemapNode>

                       <SitemapNode title="Trung Học Phổ Thông (Lớp 10-12)" icon={GraduationCap} color="red">
                          <SitemapNode title="Toán Học" icon={Calculator} color="blue">
                             <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Lớp 10: Tập hợp, Mệnh đề, Hàm số bậc 2, Vectơ.</p>
                                <p>• Lớp 11: Lượng giác, Dãy số, Giới hạn, Xác suất.</p>
                                <p>• Lớp 12: Khảo sát hàm số (Đạo hàm), Tích phân, Số phức, Oxyz.</p>
                             </div>
                          </SitemapNode>
                          <SitemapNode title="Ngữ Văn" icon={BookOpen} color="rose">
                              <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Văn học trung đại & hiện đại.</p>
                                <p>• Nghị luận xã hội & Nghị luận văn học.</p>
                                <p>• Phong cách ngôn ngữ.</p>
                             </div>
                          </SitemapNode>
                          <SitemapNode title="Tiếng Anh" icon={Globe} color="indigo">
                              <div className="ml-8 mt-2 text-sm text-gray-500 italic space-y-1">
                                <p>• Ngữ pháp chuyên sâu (Đảo ngữ, Mệnh đề quan hệ rút gọn).</p>
                                <p>• Từ vựng học thuật (Academic) & IELTS.</p>
                             </div>
                          </SitemapNode>
                       </SitemapNode>

                       <SitemapNode title="Các Chế Độ Chơi" icon={Gamepad2} color="purple">
                          <div className="grid grid-cols-2 gap-2 mt-2">
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Tính Nhẩm</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Logic</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Toán Thực Tế</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Vua Tiếng Việt</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">English Quiz</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Spelling Bee</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Visual Count</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Truy Tìm Từ Vựng</span>
                             <span className="text-xs bg-gray-50 px-2 py-1 rounded border">Ô Chữ Bí Ẩn</span>
                          </div>
                       </SitemapNode>

                    </SitemapNode>

                    <SitemapNode title="Bản Đồ Phiêu Lưu" route={AppRoute.ADVENTURE_MAP} onNavigate={onNavigate} icon={MapIcon} color="green" />
                    
                    <SitemapNode title="Đỉnh Cao Tri Thức" route={AppRoute.MASTERY_PEAK} onNavigate={onNavigate} icon={Crown} color="yellow" />
                    
                    <SitemapNode title="Dành Cho Phụ Huynh" route={AppRoute.PARENT_DASHBOARD} onNavigate={onNavigate} icon={Users} color="teal" />

                 </SitemapNode>
              </div>
           </div>

        </div>
        
        <div className="text-center mt-12 text-gray-400 text-xs font-mono border-t pt-4">
           Owner of this website all information signature is phonglam.1992
        </div>
      </div>
    </div>
  );
};
