import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'pack-trial-mini',
    name: 'Viên bán lẻ (1 viên)',
    tagline: '01 Viên nén sủi dùng thử trải nghiệm - Chỉ 6.000đ/viên',
    price: 6000,
    originalPrice: 6000,
    image: '/src/assets/images/sui_xanh_upcycled_peel_1794034637939.jpg',
    description: 'Quy cách bán lẻ 01 viên nén sủi sinh học từ vỏ cam, phù hợp cho khách hàng lần đầu dùng thử để kiểm chứng khả năng khử mùi và hương cam thực tế.',
    duration: 'Sử dụng từ 15 - 20 ngày (300 - 400 lần xả)',
    features: [
      'Thử nghiệm trực tiếp hiệu quả khử mùi hôi bồn cầu',
      'Cảm nhận hương thơm tinh dầu vỏ cam tự nhiên 100%',
      'Giá bán lẻ bình dân chỉ 6.000đ/viên'
    ],
    includes: [
      '01 Viên nén Sủi Xanh',
      '01 Hướng dẫn sử dụng thực tế'
    ],
    category: 'trial'
  },
  {
    id: 'combo-starter',
    name: 'Bộ Khởi Động (Hộp treo + 4 lõi)',
    tagline: 'Trọn bộ hộp treo bồn cầu kèm 04 lõi viên sủi vỏ cam',
    price: 35000,
    originalPrice: 35000,
    image: '/src/assets/images/sui_xanh_product_kit_1794034637823.jpg',
    description: 'Bộ sản phẩm khởi đầu hoàn chỉnh gồm 01 hộp treo gắn thành bồn cầu tiện lợi cùng 04 lõi viên nén sủi chiết xuất từ phụ phẩm vỏ cam tươi tái chế.',
    duration: 'Sử dụng liên tục trong 60 - 80 ngày',
    features: [
      'Gồm 01 hộp treo cố định + 04 lõi viên nén sủi thay thế',
      'Khử sạch mùi hôi hầm cầu với hương cam dịu mát',
      'An toàn 100% với men sứ và hệ vi sinh hầm tự hoại'
    ],
    includes: [
      '01 Hộp treo Sủi Xanh gắn bồn cầu',
      '04 Lõi viên nén sủi Sủi Xanh (mỗi lõi dùng 15-20 ngày)',
      '01 Hướng dẫn lắp đặt và sử dụng'
    ],
    isPopular: true,
    category: 'combo'
  },
  {
    id: 'pack-refill-6',
    name: 'Hộp 6 viên',
    tagline: 'Hộp nạp bổ sung 06 viên nén sủi - Chỉ ~4.660đ/viên',
    price: 28000,
    originalPrice: 28000,
    image: '/src/assets/images/sui_xanh_hero_1794034637185.jpg',
    description: 'Hộp 06 viên nén sủi bổ sung đóng gói giấy kraft phân hủy sinh học, dùng thay lõi cho hộp treo hoặc thả trực tiếp giúp giảm thiểu rác thải nhựa.',
    duration: 'Sử dụng liên tục trong 90 - 120 ngày',
    features: [
      'Công thức nén tan chậm tiết kiệm chỉ ~4.660đ/viên',
      'Giải phóng axit citric và limonene làm sạch cặn canxi nhẹ',
      'Đóng gói hộp giấy tái chế thân thiện môi trường'
    ],
    includes: [
      '06 Viên nén sủi bọt Sủi Xanh bọc màng sáp đậu nành bảo quản',
      'Túi hút ẩm sinh học từ vỏ trấu'
    ],
    category: 'refill'
  },
  {
    id: 'pack-refill-10',
    name: 'Hộp 10 viên',
    tagline: 'Hộp lớn tiết kiệm 10 viên sủi nén - Chỉ 4.500đ/viên',
    price: 45000,
    originalPrice: 45000,
    image: '/src/assets/images/sui_xanh_product_kit_1794034637823.jpg',
    description: 'Giải pháp kinh tế và bền vững cho gia đình hoặc phòng trọ đông người với 10 viên nén sủi vỏ cam tan chậm, giữ bồn cầu thơm sạch suốt 5 - 6 tháng.',
    duration: 'Sử dụng liên tục trong 5 - 6 tháng',
    features: [
      'Chi phí tối ưu nhất: chỉ 4.500đ/viên',
      'Bảo vệ sức khỏe hô hấp, không chứa hóa chất tẩy độc hại',
      'Tái chế tương đương 5kg vỏ cam phế phẩm từ quán nước ép'
    ],
    includes: [
      '10 Viên nén sủi Sủi Xanh hương cam tự nhiên',
      '01 Hướng dẫn bảo quản sử dụng dài lâu'
    ],
    category: 'refill'
  }
];

export const SURVEY_STATS = {
  sampleSize: 75, // Số mẫu khảo sát thực tế tại khu vực Chùa Láng (FTU, DAV, VYA)
  badSmellIssue: 93.5, // % gặp vấn đề mùi hôi bồn cầu
  harshChemicalDislike: 88.2, // % khó chịu vì mùi hóa chất nồng
  ecoFriendlyPreference: 84.4, // % sẵn sàng chuyển sang sản phẩm sinh học
  acceptablePriceRange: '6.000đ/viên - 45.000đ/hộp 10 viên', // Mức giá siêu bình dân phù hợp học sinh sinh viên
  slowDissolvingPreference: 91.0 // % ủng hộ cơ chế viên nén tan chậm tự nhiên
};
