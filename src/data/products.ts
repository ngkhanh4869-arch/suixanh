import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'combo-starter',
    name: 'Combo Khởi Động Sủi Xanh (Gói 3 Viên)',
    tagline: 'Gói 3 viên nén sủi tan chậm - Giá sinh viên chỉ ~6.300đ/viên',
    price: 19000,
    originalPrice: 25000,
    image: '/src/assets/images/sui_xanh_product_kit_1794034637823.jpg',
    description: 'Bộ sản phẩm khởi đầu hoàn hảo dành cho 1 bồn cầu sinh viên hoặc gia đình, đi kèm 3 viên sủi chiết xuất từ 1.5kg vỏ cam tươi tái chế.',
    duration: 'Sử dụng liên tục trong 45 - 60 ngày (khoảng 300 - 400 lần xả)',
    features: [
      'Khử sạch mùi hôi hầm cầu và cống thoát',
      'Hương cam dịu mát từ tinh dầu tự nhiên, không gắt hóa chất',
      'An toàn 100% với men sứ và hệ vi sinh hầm tự hoại',
      'Định lượng viên nén nhỏ gọn, dễ bảo quản và sử dụng'
    ],
    includes: [
      '03 Viên sủi nén Sủi Xanh (mỗi viên dùng 15-20 ngày)',
      '01 Hướng dẫn sử dụng và thông tin sản phẩm'
    ],
    isPopular: true,
    category: 'combo'
  },
  {
    id: 'pack-refill-6',
    name: 'Hộp Viên Nén Bổ Sung (Refill 6 Viên)',
    tagline: 'Gói nạp lại tiết kiệm rác thải - Dùng thoải mái 3-4 tháng',
    price: 36000,
    originalPrice: 45000,
    image: '/src/assets/images/sui_xanh_hero_1794034637185.jpg',
    description: 'Gói nạp bổ sung đóng gói trong hộp giấy kraft phân hủy sinh học, giúp giảm thiểu rác thải nhựa phát sinh từ chai lọ hóa chất tẩy rửa thông thường.',
    duration: 'Sử dụng liên tục trong 90 - 120 ngày',
    features: [
      'Công thức nén tan chậm cải tiến',
      'Tiết kiệm chi phí chỉ 6.000đ/viên',
      'Giải phóng axit citric và limonene làm sạch cặn canxi nhẹ',
      'Đóng gói giấy tái chế thân thiện với môi trường'
    ],
    includes: [
      '06 Viên nén sủi bọt Sủi Xanh bọc màng sáp đậu nành bảo quản',
      'Túi hút ẩm sinh học từ vỏ trấu'
    ],
    category: 'refill'
  },
  {
    id: 'combo-family-eco',
    name: 'Combo Tiết Kiệm (Gói 12 Viên)',
    tagline: 'Gói lớn 12 viên sủi nén - Giải pháp toàn diện 6 tháng',
    price: 69000,
    originalPrice: 85000,
    image: '/src/assets/images/sui_xanh_product_kit_1794034637823.jpg',
    description: 'Giải pháp kinh tế và bền vững cho căn hộ phòng trọ hoặc gia đình. Đảm bảo không gian vệ sinh luôn thơm mát suốt nửa năm mà không cần chạm tay cọ rửa bằng hóa chất độc hại.',
    duration: 'Sử dụng trong 6 tháng cho 2 phòng vệ sinh',
    features: [
      'Bảo vệ sức khỏe hô hấp cho trẻ nhỏ và người lớn tuổi',
      'Tái chế tương đương 6kg vỏ cam phế phẩm từ các quán nước ép',
      'Miễn phí vận chuyển toàn quốc',
      'Tặng kèm 01 viên sủi thử nghiệm cho cống sàn thoát nước'
    ],
    includes: [
      '12 Viên nén sủi nén Sủi Xanh hương cam tự nhiên',
      '01 Viên sủi cống sàn đặc trị mùi hôi cống'
    ],
    category: 'combo'
  },
  {
    id: 'pack-trial-mini',
    name: 'Gói Trải Nghiệm Dùng Thử (01 Viên)',
    tagline: '01 Viên nén sủi dùng thử trải nghiệm - Chỉ 7 nghìn đồng',
    price: 7000,
    originalPrice: 10000,
    image: '/src/assets/images/sui_xanh_upcycled_peel_1794034637939.jpg',
    description: 'Dành cho các bạn sinh viên lần đầu muốn kiểm chứng khả năng khử mùi và mùi hương tinh dầu cam thực tế trước khi mua bộ sản phẩm lớn.',
    duration: 'Sử dụng từ 15 đến 20 ngày',
    features: [
      'Thử nghiệm trực tiếp hiệu quả khử mùi hôi',
      'Cảm nhận hương thơm vỏ cam thật 100%',
      'Giá học sinh, sinh viên siêu bình dân: chỉ 7.000đ/viên'
    ],
    includes: [
      '01 Viên nén Sủi Xanh',
      '01 Hướng dẫn thử nghiệm thực tế'
    ],
    category: 'trial'
  }
];

export const SURVEY_STATS = {
  sampleSize: 75, // Số mẫu khảo sát thực tế tại khu vực Chùa Láng (FTU, DAV, VYA)
  badSmellIssue: 93.5, // % gặp vấn đề mùi hôi bồn cầu
  harshChemicalDislike: 88.2, // % khó chịu vì mùi hóa chất nồng
  ecoFriendlyPreference: 84.4, // % sẵn sàng chuyển sang sản phẩm sinh học
  acceptablePriceRange: '7.000đ/viên - 19.000đ/combo 3 viên', // Mức giá siêu bình dân phù hợp học sinh sinh viên
  slowDissolvingPreference: 91.0 // % ủng hộ cơ chế viên nén tan chậm tự nhiên
};
