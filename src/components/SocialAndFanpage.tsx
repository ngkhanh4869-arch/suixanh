import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, Video, CheckCircle, Eye, X, Send, Play } from 'lucide-react';

export const SocialAndFanpage: React.FC = () => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1842);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ title: string; views: string; desc: string } | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setIsMessageOpen(false);
      setInquiryText('');
    }, 2000);
  };

  const videoList = [
    {
      title: 'Series: 100g vỏ cam cứu được bao nhiêu vi sinh hầm cầu?',
      views: '185K lượt xem',
      desc: 'Phân tích khoa học: Tại sao axit hóa học diệt sạch vi sinh kỵ khí gây đầy hầm cầu, trong khi D-Limonene từ vỏ cam tự nhiên giữ nguyên hệ sinh thái.',
    },
    {
      title: 'Thử thách: Thả viên Sủi Xanh vào bồn cầu 30 ngày',
      views: '142K lượt xem',
      desc: 'Quay timelapse thực tế: Viên sủi tan chậm qua hơn 400 lần xả nước, bồn cầu không bị bám ố vàng và luôn thoang thoảng hương cam.',
    },
    {
      title: 'Review phòng trọ sinh viên thơm thoang thoảng hương cam',
      views: '124K lượt xem',
      desc: 'Trải nghiệm của các bạn sinh viên Chùa Láng & Cầu Giấy khi dùng thử gói mini: Dễ chịu, không bị nồng sặc như nước tẩy thông thường.',
    },
  ];

  return (
    <section id="media-section" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight text-balance">
            Kết Nối Cùng Cộng Đồng Sống Xanh
          </h2>
          <p className="text-[13px] text-stone-600 mt-2">
            Định vị thông điệp: "Hương cam tươi mát · Sạch lành tự nhiên · Vì hành tinh không rác thải",
            chia sẻ kiến thức chăm sóc nhà vệ sinh an toàn và đồng hành cùng các bạn trẻ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Fanpage Facebook Mockup */}
          <div className="lg:col-span-7 rounded-2xl border border-stone-200 shadow-xs overflow-hidden bg-white">
            {/* Fanpage Cover */}
            <div className="h-36 sm:h-44 bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-900 relative p-4 flex items-end justify-between">
              <div className="text-white">
                <span className="text-[11px] font-medium tracking-wide uppercase text-amber-300">
                  Kênh truyền thông chính thức
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold">Sủi Xanh - Eco Fizz Vietnam</h3>
              </div>
              <span className="text-white/80 text-[11px] font-mono">
                @suixanh.ecofizz
              </span>
            </div>

            {/* Fanpage Header Profile */}
            <div className="px-6 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-800 to-orange-600 border-2 border-white shadow-xs -mt-10 sm:-mt-8 flex items-center justify-center text-white font-extrabold text-lg">
                  SX
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                    <span>Sủi Xanh - Viên Nén Khử Mùi Từ Vỏ Cam</span>
                    <CheckCircle className="w-4 h-4 text-emerald-700 fill-current" />
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-stone-500 mt-0.5">
                    <span>{isFollowed ? '12.5K người theo dõi' : '12.4K người theo dõi'}</span>
                    <span aria-hidden="true">·</span>
                    <span>Dự án Khởi nghiệp Xanh 2026</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold text-[12px] flex items-center gap-1.5 transition-colors ${
                    isFollowed
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                      : 'bg-emerald-900 text-white hover:bg-emerald-850'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{isFollowed ? 'Đã Theo Dõi' : 'Theo Dõi'}</span>
                </button>
                <button
                  onClick={() => setIsMessageOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-semibold text-[12px] hover:bg-stone-200 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Nhắn Tin</span>
                </button>
              </div>
            </div>

            {/* Fanpage Pinned Viral Post */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-850">Bài viết ghim</span>
                  <span aria-hidden="true">·</span>
                  <span>Đăng ngày 02/11/2026</span>
                </div>
                <span className="text-amber-800 font-semibold">Chiến dịch dùng thử 1.000 mẫu</span>
              </div>

              <p className="text-[13px] text-stone-700 leading-relaxed">
                <strong>ĐỪNG VỨT VỎ CAM NỮA!</strong> Đã bao giờ bạn bước vào nhà vệ sinh và thấy khó thở vì mùi
                hóa chất tẩy rửa nồng nặc? Nhóm Sủi Xanh mang đến giải pháp hoàn toàn từ thiên nhiên: Viên nén sủi
                từ vỏ cam tươi tái chế, khử mùi hôi bồn cầu sau từng lần xả nước.
                <br /><br />
                Đăng ký nhận ngay <strong>Gói Trải Nghiệm 01 Viên Dùng Thử</strong> dành cho sinh viên và cư dân chung cư hôm nay!
              </p>

              {/* Engagement metrics */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-[12px] text-stone-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      isLiked ? 'text-emerald-800 font-bold' : 'text-stone-600 hover:text-emerald-800'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{likeCount.toLocaleString('vi-VN')} lượt thích</span>
                  </button>
                  <button
                    onClick={() => setIsMessageOpen(true)}
                    className="flex items-center gap-1 text-stone-600 hover:text-stone-900"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>342 bình luận</span>
                  </button>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Đã sao chép link!' : '219 chia sẻ'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* TikTok Channel Right Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-sm">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold">TikTok: @suixanh.official</h4>
                    <span className="text-[12px] text-stone-400">Short Video &amp; Thử Nghiệm Thực Tế</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  450K+ Lượt Xem
                </span>
              </div>

              <p className="text-[12px] text-stone-300 leading-relaxed">
                Nơi đăng tải các video ngắn về phản ứng sủi bọt, quy trình thu gom vỏ cam từ các quán nước ép
                và mẹo chăm sóc không gian vệ sinh an toàn cho sức khỏe.
              </p>

              <div className="space-y-2 text-[12px] text-stone-200 pt-2">
                {videoList.map((video, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideo(video)}
                    className="w-full text-left p-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="space-y-0.5 pr-2">
                      <span className="font-medium text-stone-200 group-hover:text-amber-300 transition-colors block line-clamp-1">
                        {video.title}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">{video.views}</span>
                    </div>
                    <Eye className="w-4 h-4 text-stone-400 shrink-0 group-hover:text-amber-300 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Consultation Message Modal */}
      {isMessageOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Gửi Tin Nhắn Cho Sủi Xanh</h3>
              </div>
              <button
                onClick={() => setIsMessageOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900">Đã gửi tin nhắn thành công!</h4>
                <p className="text-[12px] text-stone-500">
                  Đội ngũ truyền thông Sủi Xanh sẽ phản hồi trong vòng 15 phút.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <p className="text-[12px] text-stone-600">
                  Đặt câu hỏi về thành phần viên sủi, chính sách sỉ/lẻ hoặc yêu cầu dùng thử:
                </p>
                <textarea
                  required
                  rows={3}
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  placeholder="Nhập nội dung bạn muốn tư vấn..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-850 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Tin Nhắn Ngay</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-800 space-y-4">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-emerald-400">{activeVideo.views}</span>
                <h3 className="text-base font-bold text-white mt-1">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Video Viewport */}
            <div className="aspect-video bg-stone-950 rounded-xl border border-stone-800 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg mb-2">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
              <span className="text-[12px] font-semibold text-stone-300">
                [ Video TikTok: {activeVideo.title} ]
              </span>
              <span className="text-[10px] text-stone-500 mt-1">
                Kênh @suixanh.official · Thời lượng: 45 giây
              </span>
            </div>

            <p className="text-[12px] text-stone-300 leading-relaxed">
              {activeVideo.desc}
            </p>

            <button
              onClick={() => setActiveVideo(null)}
              className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl font-medium text-[12px] transition-colors"
            >
              Đóng Xem Trước
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
