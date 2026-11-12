import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { OrderInfo } from '../types';
import {
  saveOrder,
  getAllOrders,
  updateOrderStatus as dbUpdateOrderStatus,
  getAllUsers,
  subscribeAllUsers,
  subscribeAllOrders,
  appointAdmin,
  revokeAdmin,
  getAllAdmins,
  subscribeAllAdmins,
} from '../firebase/db';

const ORDERS_COLLECTION = 'orders';

export {
  saveOrder,
  getAllOrders,
  getAllUsers,
  subscribeAllUsers,
  subscribeAllOrders,
  appointAdmin,
  revokeAdmin,
  getAllAdmins,
  subscribeAllAdmins,
};

export const createOrder = saveOrder;
export const updateOrderStatus = dbUpdateOrderStatus;

/**
 * Subscribes to live order updates in Firestore (Admin only)
 */
export function subscribeToOrders(
  onSuccess: (orders: OrderInfo[]) => void,
  onError?: (error: any) => void
) {
  const colRef = collection(db, ORDERS_COLLECTION);
  const q = query(colRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: OrderInfo[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as any;
        orders.push({
          id: data.id || d.id,
          userId: data.userId,
          customerName: data.customerName || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          note: data.note || '',
          paymentMethod: data.paymentMethod || 'cod',
          items: data.items || [],
          total: data.totalAmount || data.total || 0,
          totalAmount: data.totalAmount || data.total || 0,
          status: data.status || 'pending',
          estimatedDeliveryDays: data.estimatedDeliveryDays || '3-5 ngày',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
      });
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onSuccess(orders);
    },
    (err) => {
      console.error('Snapshot error listening to orders:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, ORDERS_COLLECTION);
    }
  );
}

/**
 * Look up a single order by ID for customer tracking
 */
export async function getOrderById(orderId: string): Promise<OrderInfo | null> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data() as any;
    return {
      id: data.id || snap.id,
      userId: data.userId,
      customerName: data.customerName || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      note: data.note || '',
      paymentMethod: data.paymentMethod || 'cod',
      items: data.items || [],
      total: data.totalAmount || data.total || 0,
      totalAmount: data.totalAmount || data.total || 0,
      status: data.status || 'pending',
      estimatedDeliveryDays: data.estimatedDeliveryDays || '3-5 ngày',
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}
