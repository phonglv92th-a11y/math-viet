
import React from 'react';
import { AppRoute } from '../types';
import { ArrowLeft, Heart, Zap, Shield, Users, Globe, Coffee, Rocket, Code, Star, Mail } from 'lucide-react';

interface AboutProps {
  onNavigate: (route: AppRoute) => void;
  onOpenDonation: () => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate, onOpenDonation }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="flex items-center text-gray-600 hover:text-gray-800 font-bold mb-8 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 text-6xl animate-pulse">✨</div>
                <div className="absolute bottom-10 right-10 text-8xl animate-bounce">🚀</div>
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative z-10">Về MathViet</h1>
             <p className="text-blue-100 text-lg max-w-2xl mx-auto relative z-10">
               Hành trình kiến tạo nền tảng học tập thông minh, miễn phí và vui nhộn cho học sinh Việt Nam.
             </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
             
             {/* Mission Section */}
             <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                   <Rocket className="w-6 h-6 mr-3 text-red-500" /> Sứ Mệnh Của Chúng Tôi
                </h2>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-gray-700 leading-relaxed">
                   <p className="mb-4">
                      Chúng tôi tin rằng việc học không nên là một gánh nặng mà phải là một niềm vui. 
                      <strong> MathViet</strong> ra đời với mong muốn biến những con số khô khan, những bài văn dài dòng trở thành những thử thách thú vị trong một thế giới đầy màu sắc.
                   </p>
                   <p>
                      Bằng cách kết hợp công nghệ AI tiên tiến (Google Gemini) và phương pháp Gamification (Học mà chơi), chúng tôi hy vọng sẽ khơi dậy niềm đam mê học tập tự nhiên bên trong mỗi em học sinh.
                   </p>
                </div>
             </section>

             {/* Features Grid */}
             <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                   <Star className="w-6 h-6 mr-3 text-yellow-500" /> Giá Trị Cốt Lõi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 border rounded-2xl hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                         <Globe className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Miễn Phí Vĩnh Viễn</h3>
                      <p className="text-sm text-gray-500">Tiếp cận tri thức là quyền của mọi người. Ứng dụng hoạt động phi lợi nhuận.</p>
                   </div>
                   <div className="p-6 border rounded-2xl hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                         <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Công Nghệ AI</h3>
                      <p className="text-sm text-gray-500">Bài tập không bao giờ trùng lặp nhờ sức mạnh của trí tuệ nhân tạo.</p>
                   </div>
                   <div className="p-6 border rounded-2xl hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                         <Shield className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">An Toàn & Riêng Tư</h3>
                      <p className="text-sm text-gray-500">Không thu thập dữ liệu cá nhân nhạy cảm, an toàn tuyệt đối cho trẻ em.</p>
                   </div>
                </div>
             </section>

             {/* Team Section */}
             <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                   <Users className="w-6 h-6 mr-3 text-indigo-500" /> Đội Ngũ Phát Triển
                </h2>
                <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
                   <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 md:mb-0 md:mr-6 shadow-lg">
                      LP
                   </div>
                   <div className="text-center md:text-left flex-1">
                      <h3 className="text-xl font-bold text-gray-900">Lâm Phong</h3>
                      <p className="text-indigo-600 font-medium mb-2">Nhà Sáng Lập & Lập Trình Viên Chính</p>
                      <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 mb-1">
                         <Code className="w-4 h-4 mr-1" /> Fullstack Developer
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">
                         "Cựu Học Sinh THPT Tĩnh Gia 3 (2007-2010)"
                      </p>
                   </div>
                   
                   <div className="mt-4 md:mt-0 md:pl-6 md:border-l border-gray-200 text-center md:text-left">
                       <p className="text-sm font-bold text-gray-600 mb-1">Liên hệ & Hỗ trợ:</p>
                       <a href="mailto:phonglv92th@gmail.com" className="flex items-center text-blue-600 hover:underline">
                          <Mail className="w-4 h-4 mr-2" /> phonglv92th@gmail.com
                       </a>
                   </div>
                </div>
             </section>

          </div>

          {/* Footer CTA */}
          <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
             <h3 className="font-bold text-gray-700 mb-4">Bạn yêu thích MathViet?</h3>
             <button 
                onClick={onOpenDonation}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-rose-200 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto"
             >
                <Coffee className="w-5 h-5 mr-2" /> Ủng hộ tôi một ly cà phê
             </button>
             <p className="text-xs text-gray-400 mt-4">
                Mọi sự ủng hộ của bạn đều là động lực to lớn để mình duy trì và phát triển ứng dụng.
             </p>
          </div>
        </div>

        <div className="text-center text-gray-400 text-xs font-mono">
           © 2025 MathViet. All rights reserved.
        </div>
      </div>
    </div>
  );
};
