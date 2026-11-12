import React, { useState, useEffect } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../firebase/authContext';
import {
  subscribeToOrders,
  updateOrderStatus,
  subscribeAllUsers,
  subscribeAllAdmins,
  appointAdmin,
  revokeAdmin,
} from '../services/orderService';
import { OrderInfo, OrderStatus, UserProfile, AdminProfile } from '../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  LogOut,
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  User,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  Mail,
  ShoppingBag,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
} from 'lucide-react';

interface AdminPanelProps {
  onBackToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore }) => {
  const { currentUser, isAdmin, isSuperAdmin, isLoading, loginWithGoogle, logout } = useAuth();

  // Navigation tab between Orders, Registered Users, and Admins List
  const [adminTab, setAdminTab] = useState<'orders' | 'users' | 'admins'>('orders');

  // Orders state
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Registered Users state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [expandedUserUid, setExpandedUserUid] = useState<string | null>(null);

  // Admins state
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [isProcessingAdminUid, setIsProcessingAdminUid] = useState<string | null>(null);
  const [selectedUserToAppoint, setSelectedUserToAppoint] = useState<string>('');

  // Subscribe to live orders, users, and admins when admin is logged in
  useEffect(() => {
    if (!isAdmin) return;

    setIsLoadingOrders(true);
    const unsubscribeOrders = subscribeToOrders(
      (data) => {
        setOrders(data);
        setIsLoadingOrders(false);
      },
      (err) => {
        console.error('Error fetching orders:', err);
        setIsLoadingOrders(false);
      }
    );

    // Subscribe to registered users
    setIsLoadingUsers(true);
    const unsubscribeUsers = subscribeAllUsers(
      (usersData) => {
        setUsers(usersData);
        setIsLoadingUsers(false);
      },
      (err) => {
        console.error('Error fetching users:', err);
        setIsLoadingUsers(false);
      }
    );

    // Subscribe to admins list
    setIsLoadingAdmins(true);
    const unsubscribeAdmins = subscribeAllAdmins(
      (adminsData) => {
        setAdmins(adminsData);
        setIsLoadingAdmins(false);
      },
      (err) => {
        console.error('Error fetching admins:', err);
        setIsLoadingAdmins(false);
      }
    );

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeAdmins();
    };
  }, [isAdmin]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const estimate = newStatus === 'shipping' ? '3 - 5 ngày' : undefined;
      await updateOrderStatus(orderId, newStatus, estimate);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng kiểm tra kết nối.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleEstimateChange = async (orderId: string, estimate: string) => {
    try {
      setUpdatingOrderId(orderId);
      const currentOrder = orders.find((o) => o.id === orderId);
      if (currentOrder) {
        await updateOrderStatus(orderId, currentOrder.status, estimate);
      }
    } catch (err) {
      console.error('Failed to update estimate:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Appoint Admin (Super Admin only)
  const handleAppointAdmin = async (targetUser: UserProfile) => {
    if (!isSuperAdmin) {
      alert('Chỉ Super Admin mới có quyền chỉ định quản trị viên.');
      return;
    }

    const confirmMsg = `Bạn có chắc chắn muốn cấp quyền Quản Trị Viên (Admin) cho tài khoản ${targetUser.email}?`;
    if (!window.confirm(confirmMsg)) return;

    setIsProcessingAdminUid(targetUser.uid);
    try {
      await appointAdmin({
        uid: targetUser.uid,
        email: targetUser.email,
        displayName: targetUser.displayName,
      });
      setSelectedUserToAppoint('');
    } catch (err) {
      console.error('Failed to appoint admin:', err);
      alert('Không thể bổ nhiệm quản trị viên. Vui lòng thử lại.');
    } finally {
      setIsProcessingAdminUid(null);
    }
  };

  // Revoke Admin (Super Admin only)
  const handleRevokeAdmin = async (adminUid: string, adminEmail: string) => {
    if (!isSuperAdmin) {
      alert('Chỉ Super Admin mới có quyền thu hồi quyền quản trị viên.');
      return;
    }

    if (adminEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('Không thể thu hồi quyền của Super Admin gốc.');
      return;
    }

    const confirmMsg = `Bạn có chắc chắn muốn thu hồi quyền Quản Trị Viên của tài khoản ${adminEmail}?`;
    if (!window.confirm(confirmMsg)) return;

    setIsProcessingAdminUid(adminUid);
    try {
      await revokeAdmin(adminUid);
    } catch (err) {
      console.error('Failed to revoke admin:', err);
      alert('Không thể thu hồi quyền quản trị viên. Vui lòng thử lại.');
    } finally {
      setIsProcessingAdminUid(null);
    }
  };

  const formatCurrency = (val: number) => val.toLocaleString('vi-VN') + ' đ';

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
  const shippingOrders = orders.filter((o) => o.status === 'shipping').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Helper: Get all orders placed by a specific user
  const getUserOrders = (user: UserProfile) => {
    const userEmail = (user.email || '').toLowerCase().trim();
    return orders.filter((o) => {
      if (o.userId && o.userId === user.uid) return true;
      if (userEmail && o.email && o.email.toLowerCase().trim() === userEmail) return true;
      return false;
    });
  };

  // Check if a user is an admin or super admin
  const isUserAnAdmin = (user: UserProfile) => {
    if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) return true;
    return admins.some((a) => a.uid === user.uid || a.email.toLowerCase() === user.email.toLowerCase());
  };

  // Orders Filtering
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      (o.email && o.email.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // Users Filtering
  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      u.uid.toLowerCase().includes(q)
    );
  });

  // Admins List combining Root Super Admin and Appointed Admins
  const allAdminsCombined: AdminProfile[] = [];
  // Ensure Super Admin is always first
  allAdminsCombined.push({
    uid: 'super-admin-root',
    email: SUPER_ADMIN_EMAIL,
    displayName: 'Quản Trị Viên Cấp Cao (Super Admin)',
    role: 'superadmin',
    assignedBy: 'Hệ Thống Gốc',
    createdAt: 'Tài khoản gốc',
  });

  admins.forEach((adm) => {
    if (adm.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      allAdminsCombined.push(adm);
    }
  });

  const filteredAdmins = allAdminsCombined.filter((a) => {
    const q = adminSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.email.toLowerCase().includes(q) ||
      (a.displayName && a.displayName.toLowerCase().includes(q))
    );
  });

  // Non-admin registered users available to be appointed
  const nonAdminUsers = users.filter(
    (u) =>
      u.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase() &&
      !admins.some((a) => a.uid === u.uid || a.email.toLowerCase() === u.email.toLowerCase())
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Package className="w-3.5 h-3.5" /> Đang chuẩn bị hàng
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3.5 h-3.5" /> Đang giao hàng
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã giao thành công
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
            <AlertCircle className="w-3.5 h-3.5" /> Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateDisplay = (isoStr?: string) => {
    if (!isoStr) return 'Chưa ghi nhận';
    if (isoStr === 'Tài khoản gốc') return 'Tài khoản khởi tạo gốc';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  // Case 1: Loading Auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBF7] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-stone-600 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-700" />
          <span>Đang kiểm tra quyền quản trị...</span>
        </div>
      </div>
    );
  }

  // Case 2: Not Admin or Not Logged In
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FBFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Cổng Quản Trị Hệ Thống Sủi Xanh
            </h2>
            <p className="text-[13px] text-stone-600 leading-relaxed">
              Khu vực bảo mật dành cho Super Admin và các Quản trị viên được phân quyền. Vui lòng đăng nhập bằng tài khoản Google để tiếp tục.
            </p>
          </div>

          {currentUser && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[12px] text-left">
              Bạn đang đăng nhập với tài khoản <strong>{currentUser.email}</strong>, tài khoản này hiện chưa được Super Admin cấp quyền quản trị.
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={loginWithGoogle}
              className="w-full py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-850 text-white font-bold text-[13px] flex items-center justify-center gap-2.5 shadow-sm transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
              </svg>
              <span>Đăng Nhập Quản Trị Viên Google</span>
            </button>

            <button
              onClick={onBackToStore}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Trang Bán Hàng</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Admin is Authenticated -> Full Dashboard
  return (
    <div className="min-h-screen bg-[#FBFBF7] text-[#1C1917] pb-16">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Quay lại giao diện cửa hàng"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-stone-900 tracking-tight">
                  Bảng Quản Trị Hệ Thống Sủi Xanh
                </h1>
                {isSuperAdmin ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold uppercase flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-700" /> Super Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-700" /> Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                {isSuperAdmin
                  ? 'Quyền hạn cao nhất: Quản lý đơn hàng, thành viên & phân quyền quản trị viên'
                  : 'Quyền hạn quản trị: Xử lý đơn hàng & theo dõi thành viên hệ thống'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto text-[12px]">
            <div className="flex items-center gap-2 text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/70">
              <User className="w-3.5 h-3.5 text-emerald-800" />
              <span className="font-medium">{currentUser?.email}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-stone-500 hover:text-rose-700 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Navigation Switcher: Orders vs Registered Users vs Admins List */}
        <div className="flex items-center border-b border-stone-200 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setAdminTab('orders')}
            className={`pb-3 px-3 text-[13px] font-bold border-b-2 shrink-0 flex items-center gap-2 transition-colors ${
              adminTab === 'orders'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Quản Lý Đơn Hàng</span>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-mono font-bold">
              {totalOrders}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`pb-3 px-3 text-[13px] font-bold border-b-2 shrink-0 flex items-center gap-2 transition-colors ${
              adminTab === 'users'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Thành Viên Đã Đăng Ký</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-mono font-bold">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('admins')}
            className={`pb-3 px-3 text-[13px] font-bold border-b-2 shrink-0 flex items-center gap-2 transition-colors ${
              adminTab === 'admins'
                ? 'border-emerald-800 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Danh Sách Quản Trị Viên</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-mono font-bold">
              {allAdminsCombined.length}
            </span>
          </button>
        </div>

        {adminTab === 'orders' ? (
          /* ======================================================== */
          /* TAB 1: ORDERS DASHBOARD                                  */
          /* ======================================================== */
          <div className="space-y-6">
            {/* KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-medium text-stone-500">Tổng Đơn Hàng</span>
                <div className="text-2xl font-black text-stone-900 tabular-nums">{totalOrders}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-amber-800">Chờ Xác Nhận</span>
                <div className="text-2xl font-black text-amber-900 tabular-nums">{pendingOrders}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-200/80 bg-blue-50/20 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-blue-800">Đang Chuẩn Bị</span>
                <div className="text-2xl font-black text-blue-900 tabular-nums">{preparingOrders}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-200/80 bg-purple-50/20 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-purple-800">Đang Giao Hàng</span>
                <div className="text-2xl font-black text-purple-900 tabular-nums">{shippingOrders}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-800">Đã Hoàn Tất</span>
                <div className="text-2xl font-black text-emerald-900 tabular-nums">{deliveredOrders}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Doanh Thu Tạm Tính</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-emerald-950 tabular-nums">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>
            </div>

            {/* Toolbar: Search & Filter Tabs */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên, điện thoại, email, địa chỉ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-[12px]">
                {(
                  [
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: 'Chờ xác nhận' },
                    { id: 'preparing', label: 'Đang chuẩn bị' },
                    { id: 'shipping', label: 'Đang giao' },
                    { id: 'delivered', label: 'Đã hoàn tất' },
                    { id: 'cancelled', label: 'Đã hủy' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                      statusFilter === tab.id
                        ? 'bg-emerald-900 text-white shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List View */}
            {isLoadingOrders ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-800" />
                <span>Đang tải danh sách đơn hàng từ Firestore...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-2">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-bold text-stone-800">Chưa có đơn hàng nào</h3>
                <p className="text-[12px] text-stone-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc.'
                    : 'Khi khách hàng đặt hàng trên website, đơn hàng sẽ ngay lập tức xuất hiện tại đây.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all hover:border-stone-300"
                    >
                      {/* Order Card Header */}
                      <div className="px-5 py-3.5 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-sm font-extrabold text-stone-900 font-mono tracking-wide">
                              {order.id}
                            </strong>
                            <button
                              onClick={() => handleCopy(order.id)}
                              className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition-colors"
                              title="Sao chép mã đơn"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{order.createdAt}</span>
                          </div>

                          {order.userId && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                              Thành viên đặt hàng
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <div className="text-right">
                            <span className="text-base font-black text-emerald-950 tabular-nums">
                              {formatCurrency(order.total || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Card Body */}
                      <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Customer & Shipping Destination Info */}
                        <div className="md:col-span-5 space-y-3">
                          <h4 className="text-[12px] font-bold text-stone-400 uppercase tracking-wider">
                            Thông Tin Giao Nhận
                          </h4>

                          <div className="space-y-2 text-[12px]">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-stone-400 shrink-0" />
                              <span className="font-bold text-stone-900">{order.customerName}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                              <a
                                href={`tel:${order.phone}`}
                                className="font-mono text-emerald-800 hover:underline font-bold"
                              >
                                {order.phone}
                              </a>
                              <button
                                onClick={() => handleCopy(order.phone)}
                                className="text-[10px] text-stone-400 hover:text-stone-700"
                              >
                                (sao chép)
                              </button>
                            </div>

                            {order.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                                <span className="text-stone-700 font-mono text-[11px]">{order.email}</span>
                              </div>
                            )}

                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                              <span className="text-stone-700 leading-relaxed">{order.address}</span>
                            </div>

                            {order.note && (
                              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-900 text-[11px] leading-relaxed">
                                <strong>Ghi chú:</strong> {order.note}
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                              <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                              <span>Phương thức: </span>
                              <strong className="text-stone-800 uppercase">
                                {order.paymentMethod === 'cod'
                                  ? 'Thanh toán COD khi nhận hàng'
                                  : 'Chuyển khoản VietQR'}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Order Line Items */}
                        <div className="md:col-span-4 space-y-3">
                          <h4 className="text-[12px] font-bold text-stone-400 uppercase tracking-wider">
                            Chi Tiết Sản Phẩm ({order.items?.length || 0})
                          </h4>

                          <div className="space-y-2">
                            {order.items?.map((item: any, idx: number) => {
                              const itemName = item.name || item.product?.name || 'Sản phẩm Sủi Xanh';
                              const itemQty = item.quantity || 1;
                              const itemPrice = item.price || item.product?.price || 0;

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-[12px] p-2 rounded-lg bg-stone-50 border border-stone-200/60"
                                >
                                  <div className="space-y-0.5">
                                    <p className="font-semibold text-stone-900">{itemName}</p>
                                    <p className="text-[11px] text-stone-500">
                                      {formatCurrency(itemPrice)} × {itemQty}
                                    </p>
                                  </div>
                                  <span className="font-bold text-stone-900 tabular-nums">
                                    {formatCurrency(itemPrice * itemQty)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Status Management & Delivery Estimation */}
                        <div className="md:col-span-3 space-y-3 bg-stone-50/60 p-4 rounded-xl border border-stone-200/70 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[12px] font-bold text-stone-400 uppercase tracking-wider">
                                Cập Nhật Trạng Thái
                              </h4>
                              {isUpdating && (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                              )}
                            </div>

                            {/* Status Select Box */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-medium text-stone-600 block">
                                Tiến độ đơn hàng:
                              </label>
                              <select
                                value={order.status}
                                disabled={isUpdating}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value as OrderStatus)
                                }
                                className="w-full px-2.5 py-2 bg-white border border-stone-300 rounded-lg text-[12px] font-semibold text-stone-800 focus:outline-none focus:border-emerald-700 cursor-pointer"
                              >
                                <option value="pending">Chờ xác nhận (Pending)</option>
                                <option value="preparing">Đang chuẩn bị hàng (Preparing)</option>
                                <option value="shipping">Đang giao hàng (Shipping)</option>
                                <option value="delivered">Đã giao thành công (Delivered)</option>
                                <option value="cancelled">Đã hủy (Cancelled)</option>
                              </select>
                            </div>

                            {/* Estimated delivery time */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-medium text-stone-600 block">
                                Dự kiến giao hàng:
                              </label>
                              <input
                                type="text"
                                placeholder="Ví dụ: 3 - 5 ngày"
                                value={order.estimatedDeliveryDays || ''}
                                disabled={isUpdating}
                                onChange={(e) => handleEstimateChange(order.id, e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-[12px] text-stone-800 focus:outline-none focus:border-emerald-700"
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-stone-200/70 text-[11px] text-stone-500">
                            <span>Cập nhật gần nhất: </span>
                            <strong className="text-stone-700">
                              {order.updatedAt ? new Date(order.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : adminTab === 'users' ? (
          /* ======================================================== */
          /* TAB 2: REGISTERED USERS DATABASE                         */
          /* ======================================================== */
          <div className="space-y-6">
            {/* Registered Users Header & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-medium text-stone-500">Tổng Thành Viên Đăng Ký</span>
                <div className="text-2xl font-black text-stone-900 tabular-nums">{users.length}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-800">Thành Viên Đã Đặt Đơn</span>
                <div className="text-2xl font-black text-emerald-900 tabular-nums">
                  {users.filter((u) => getUserOrders(u).length > 0).length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-200/80 bg-purple-50/20 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-purple-900">Quản Trị Viên Hiện Tại</span>
                <div className="text-2xl font-black text-purple-950 tabular-nums">
                  {allAdminsCombined.length}
                </div>
              </div>
            </div>

            {/* User Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm thành viên theo email, họ tên, UID..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700 transition-colors"
                />
              </div>

              <div className="text-[12px] text-stone-500">
                Hiển thị <strong>{filteredUsers.length}</strong> / {users.length} tài khoản
              </div>
            </div>

            {/* Users List */}
            {isLoadingUsers ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-800" />
                <span>Đang tải cơ sở dữ liệu thành viên từ Firestore...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-2">
                <Users className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-bold text-stone-800">Không tìm thấy thành viên nào</h3>
                <p className="text-[12px] text-stone-500">
                  {userSearchQuery
                    ? 'Không có thành viên nào trùng khớp với từ khóa tìm kiếm.'
                    : 'Khi khách hàng đăng nhập Google tại modal Thành viên, tài khoản sẽ tự động lưu vào đây.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => {
                  const userOrders = getUserOrders(user);
                  const isExpanded = expandedUserUid === user.uid;
                  const totalSpent = userOrders
                    .filter((o) => o.status !== 'cancelled')
                    .reduce((sum, o) => sum + (o.total || 0), 0);
                  const isRootSuper = user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                  const isAdminUser = isUserAnAdmin(user);
                  const isProcessingThisUser = isProcessingAdminUid === user.uid;

                  return (
                    <div
                      key={user.uid}
                      className="bg-white rounded-xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all hover:border-stone-300"
                    >
                      {/* User Row Header */}
                      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || user.email}
                              className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-base shrink-0 border border-emerald-200">
                              {(user.displayName || user.email).charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-stone-900">
                                {user.displayName || 'Thành viên Sủi Xanh'}
                              </h4>
                              {isRootSuper ? (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold uppercase flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3 text-rose-700" /> Super Admin
                                </span>
                              ) : isAdminUser ? (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold uppercase flex items-center gap-1">
                                  <Shield className="w-3 h-3 text-purple-700" /> Quản Trị Viên
                                </span>
                              ) : null}
                            </div>

                            <div className="flex items-center gap-2 text-[12px] text-stone-600">
                              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span className="font-mono">{user.email}</span>
                              <button
                                onClick={() => handleCopy(user.email)}
                                className="text-[10px] text-stone-400 hover:text-stone-700"
                                title="Sao chép email"
                              >
                                (sao chép)
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Registration dates & Order metrics & Admin toggle button */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[12px] border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                          <div>
                            <span className="text-[11px] text-stone-400 block">Ngày đăng ký</span>
                            <span className="font-medium text-stone-800">
                              {formatDateDisplay(user.createdAt)}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-stone-400 block">Đơn đặt</span>
                            <span className="font-extrabold text-stone-900 tabular-nums">
                              {userOrders.length} đơn
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-stone-400 block">Chi tiêu</span>
                            <span className="font-black text-emerald-950 tabular-nums">
                              {formatCurrency(totalSpent)}
                            </span>
                          </div>

                          {/* Super Admin Action: Appoint or Revoke Admin */}
                          {isSuperAdmin && !isRootSuper && (
                            <div>
                              {isAdminUser ? (
                                <button
                                  onClick={() => handleRevokeAdmin(user.uid, user.email)}
                                  disabled={isProcessingThisUser}
                                  className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1.5 transition-colors disabled:opacity-60"
                                  title="Thu hồi quyền Admin của người này"
                                >
                                  {isProcessingThisUser ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <UserX className="w-3.5 h-3.5" />
                                  )}
                                  <span>Thu Hồi Admin</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAppointAdmin(user)}
                                  disabled={isProcessingThisUser}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-850 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-60"
                                  title="Cấp quyền Admin cho tài khoản này"
                                >
                                  {isProcessingThisUser ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <UserCheck className="w-3.5 h-3.5" />
                                  )}
                                  <span>Cấp Quyền Admin</span>
                                </button>
                              )}
                            </div>
                          )}

                          <button
                            onClick={() =>
                              setExpandedUserUid(isExpanded ? null : user.uid)
                            }
                            className={`px-3 py-1.5 rounded-lg border text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                              isExpanded
                                ? 'bg-stone-100 text-stone-900 border-stone-300'
                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            <span>{isExpanded ? 'Đóng chi tiết' : 'Xem đơn hàng'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Order History for this user */}
                      {isExpanded && (
                        <div className="bg-stone-50/80 border-t border-stone-200 p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-[12px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                              <ShoppingBag className="w-3.5 h-3.5 text-emerald-800" />
                              <span>Lịch Sử Đơn Hàng Của {user.email}</span>
                            </h5>
                            <span className="text-[11px] text-stone-500">
                              Tổng cộng: <strong>{userOrders.length}</strong> đơn hàng
                            </span>
                          </div>

                          {userOrders.length === 0 ? (
                            <div className="p-4 bg-white rounded-xl border border-stone-200 text-center text-[12px] text-stone-500">
                              Thành viên này chưa đặt đơn hàng nào.
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              {userOrders.map((uo) => (
                                <div
                                  key={uo.id}
                                  className="p-3.5 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <strong className="font-mono text-stone-900 font-bold">
                                        {uo.id}
                                      </strong>
                                      {getStatusBadge(uo.status)}
                                      <span className="text-[11px] text-stone-400">
                                        · {uo.createdAt}
                                      </span>
                                    </div>

                                    <div className="text-stone-600 text-[11px]">
                                      <span>Người nhận: <strong>{uo.customerName}</strong> ({uo.phone})</span>
                                      <span className="mx-1.5">·</span>
                                      <span>Địa chỉ: {uo.address}</span>
                                    </div>

                                    <div className="text-stone-500 text-[11px]">
                                      Sản phẩm:{' '}
                                      {uo.items
                                        ?.map(
                                          (it: any) =>
                                            `${it.name || it.product?.name || 'Sản phẩm'} (${it.quantity || 1})`
                                        )
                                        .join(', ')}
                                    </div>
                                  </div>

                                  <div className="text-right sm:shrink-0">
                                    <span className="text-[11px] text-stone-400 block">Tổng tiền</span>
                                    <strong className="text-sm font-extrabold text-emerald-950 tabular-nums">
                                      {formatCurrency(uo.total || 0)}
                                    </strong>
                                    <span className="text-[10px] text-stone-500 block uppercase">
                                      {uo.paymentMethod === 'cod' ? 'COD' : 'VietQR'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* TAB 3: ADMINS LIST & RBAC PERMISSIONS                    */
          /* ======================================================== */
          <div className="space-y-6">
            {/* RBAC Info Card */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-800" />
                    <h3 className="text-base font-extrabold text-stone-900">
                      Phân Quyền Quản Trị Hệ Thống Sủi Xanh
                    </h3>
                  </div>
                  <p className="text-[12px] text-stone-600 max-w-2xl leading-relaxed">
                    Hệ thống phân cấp bảo mật: <strong>Super Admin</strong> ({SUPER_ADMIN_EMAIL}) có toàn quyền chỉ định hoặc thu hồi quyền quản trị viên. Các <strong>Quản Trị Viên (Admin)</strong> khác có thể theo dõi và cập nhật trạng thái đơn hàng nhưng <strong>không thể</strong> bổ nhiệm hoặc thu hồi quyền của người khác.
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[12px] space-y-1 shrink-0">
                  <span className="text-stone-500 block text-[11px]">Vai trò tài khoản hiện tại:</span>
                  {isSuperAdmin ? (
                    <span className="font-bold text-rose-800 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-700" />
                      Super Admin (Toàn Quyền)
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-700" />
                      Quản Trị Viên (Admin)
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Appoint Section (Visible ONLY for Super Admin) */}
              {isSuperAdmin && (
                <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
                  <h4 className="text-[12px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-800" />
                    <span>Bổ Nhiệm Quản Trị Viên Mới</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select
                      value={selectedUserToAppoint}
                      onChange={(e) => setSelectedUserToAppoint(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-lg text-[13px] text-stone-800 focus:outline-none focus:border-emerald-700"
                    >
                      <option value="">-- Chọn thành viên đã đăng nhập Google để cấp quyền Admin --</option>
                      {nonAdminUsers.map((u) => (
                        <option key={u.uid} value={u.uid}>
                          {u.email} {u.displayName ? `(${u.displayName})` : ''}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const target = nonAdminUsers.find((u) => u.uid === selectedUserToAppoint);
                        if (target) handleAppointAdmin(target);
                      }}
                      disabled={!selectedUserToAppoint || isProcessingAdminUid !== null}
                      className="px-4 py-2 bg-emerald-900 hover:bg-emerald-850 disabled:opacity-60 text-white rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors shadow-2xs shrink-0"
                    >
                      {isProcessingAdminUid ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                      <span>Xác Nhận Cấp Quyền Admin</span>
                    </button>
                  </div>

                  {nonAdminUsers.length === 0 && (
                    <p className="text-[11px] text-stone-500">
                      Tất cả thành viên đã đăng nhập hiện tại đều đã là quản trị viên hoặc chưa có thành viên mới đăng nhập tài khoản Google.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Admins Search & Filter */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Tìm quản trị viên theo email, tên..."
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-[13px] focus:bg-white focus:outline-none focus:border-emerald-700 transition-colors"
                />
              </div>

              <div className="text-[12px] text-stone-500">
                Tổng cộng: <strong>{filteredAdmins.length}</strong> quản trị viên
              </div>
            </div>

            {/* Admins List View */}
            {isLoadingAdmins ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-800" />
                <span>Đang tải danh sách quản trị viên từ Firestore...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAdmins.map((adm) => {
                  const isRoot = adm.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                  const isProcessing = isProcessingAdminUid === adm.uid;

                  return (
                    <div
                      key={adm.uid}
                      className={`p-4 sm:p-5 bg-white rounded-xl border transition-all ${
                        isRoot
                          ? 'border-rose-200/90 bg-rose-50/10'
                          : 'border-stone-200/90 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-full font-bold flex items-center justify-center text-base shrink-0 border ${
                              isRoot
                                ? 'bg-rose-100 text-rose-900 border-rose-200'
                                : 'bg-purple-100 text-purple-900 border-purple-200'
                            }`}
                          >
                            {isRoot ? 'SA' : adm.email.charAt(0).toUpperCase()}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-stone-900">
                                {adm.displayName || adm.email}
                              </h4>
                              {isRoot ? (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold uppercase flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3 text-rose-700" /> Super Admin
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold uppercase flex items-center gap-1">
                                  <Shield className="w-3 h-3 text-purple-700" /> Admin
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[12px] text-stone-600">
                              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span className="font-mono">{adm.email}</span>
                              <button
                                onClick={() => handleCopy(adm.email)}
                                className="text-[10px] text-stone-400 hover:text-stone-700"
                                title="Sao chép email"
                              >
                                (sao chép)
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[12px] border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                          <div>
                            <span className="text-[11px] text-stone-400 block">Thời điểm cấp quyền</span>
                            <span className="font-medium text-stone-800">
                              {formatDateDisplay(adm.createdAt)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-stone-400 block">Người bổ nhiệm</span>
                            <span className="font-medium text-stone-700">
                              {adm.assignedBy || SUPER_ADMIN_EMAIL}
                            </span>
                          </div>

                          {/* Action Button */}
                          <div>
                            {isRoot ? (
                              <span className="text-[11px] font-semibold text-stone-400 px-3 py-1.5 rounded-lg bg-stone-100 block text-center">
                                Tài khoản gốc
                              </span>
                            ) : isSuperAdmin ? (
                              <button
                                onClick={() => handleRevokeAdmin(adm.uid, adm.email)}
                                disabled={isProcessing}
                                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1.5 transition-colors disabled:opacity-60"
                                title="Thu hồi quyền quản trị viên"
                              >
                                {isProcessing ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <UserX className="w-3.5 h-3.5" />
                                )}
                                <span>Thu Hồi Quyền</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-stone-400">
                                Quản trị viên
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
