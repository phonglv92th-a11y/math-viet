
import React from 'react';
import { X, Heart, Coffee, Copy, Mail, AlertCircle } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép số tài khoản!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-center relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Ủng Hộ Nhà Phát Triển</h2>
          <p className="text-pink-100 text-sm">Chung tay phát triển cộng đồng giáo dục miễn phí</p>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 text-center overflow-y-auto custom-scrollbar">
          <p className="text-gray-600 mb-6 leading-relaxed text-sm">
            <span className="font-bold text-gray-800">MathViet</span> là dự án giáo dục phi lợi nhuận. 
            Sự ủng hộ của bạn giúp mình duy trì server và phát triển thêm các tính năng mới cho các bé! ❤️
          </p>

          <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200 mb-6 flex flex-col items-center">
             <div className="bg-white p-2 rounded-xl shadow-sm mb-3">
                <img 
                  src="https://i.ibb.co/Z1GXD93t/IMG-1034.jpg" 
                  alt="Mã QR MB Bank" 
                  className="w-40 h-40 object-contain rounded-lg"
                />
             </div>
             
             {/* Bank Details Card */}
             <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-3 text-left relative group">
                <div className="flex items-center justify-between mb-1">
                   <span className="text-xs font-bold text-blue-500 uppercase">Ngân hàng MB Bank (Quân Đội)</span>
                   <img src="https://img.icons8.com/color/48/mb-bank.png" alt="MB" className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-lg font-mono font-black text-gray-800 tracking-wider">1992888688668</span>
                   <button 
                      onClick={() => handleCopy('1992888688668')}
                      className="p-1.5 bg-white rounded-md text-gray-500 hover:text-blue-600 shadow-sm transition-colors"
                      title="Sao chép"
                   >
                      <Copy className="w-4 h-4" />
                   </button>
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">Chủ TK: LAM VAN PHONG</div>
             </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-200 transition-transform active:scale-95 flex items-center justify-center mb-6"
          >
            <Coffee className="w-5 h-5 mr-2" /> Cảm ơn tấm lòng của bạn!
          </button>

          {/* Support Section */}
          <div className="pt-6 border-t border-gray-100">
             <div className="flex items-center justify-center text-gray-800 font-bold mb-2">
                <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                Báo lỗi & Góp ý
             </div>
             <p className="text-xs text-gray-500 mb-2">
                Gặp sự cố hoặc muốn yêu cầu thêm tính năng? Hãy gửi email cho mình nhé:
             </p>
             <a 
                href="mailto:phonglv92th@gmail.com" 
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
             >
                <Mail className="w-4 h-4 mr-2" /> phonglv92th@gmail.com
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};
