export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  features: string[];
  duration: string;
  includes: string[];
  isPopular?: boolean;
  category: 'combo' | 'refill' | 'trial';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderInfo {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  paymentMethod: 'cod' | 'vietqr';
  items: CartItem[];
  total: number;
  totalAmount?: number;
  status: OrderStatus;
  estimatedDeliveryDays?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'superadmin';
  assignedBy?: string;
  createdAt: string;
}

export type ActiveTab = 'store' | 'admin' | 'tracking';
