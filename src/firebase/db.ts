import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { OrderInfo, OrderStatus, UserProfile } from '../types';

/**
 * ==========================================
 * FIRESTORE SCHEMA DEFINITIONS & STRUCTURE
 * ==========================================
 */
export const FIRESTORE_COLLECTIONS = {
  ORDERS: 'orders',
  USERS: 'users',
  ADMINS: 'admins',
} as const;

export interface FirestoreOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface FirestoreOrderDocument {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  paymentMethod: 'cod' | 'vietqr';
  items: FirestoreOrderItem[];
  totalAmount: number;
  total: number;
  status: OrderStatus;
  estimatedDeliveryDays?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreUserDocument {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
}

/**
 * ==========================================
 * FIRESTORE HELPER FUNCTIONS: ORDERS
 * ==========================================
 */

/**
 * Saves a new order into Firestore with items, contact details, and initial status ('pending').
 *
 * @param order - The order details to persist
 */
export async function saveOrder(order: OrderInfo): Promise<void> {
  const path = `${FIRESTORE_COLLECTIONS.ORDERS}/${order.id}`;
  try {
    const orderDocRef = doc(db, FIRESTORE_COLLECTIONS.ORDERS, order.id);

    // Normalize order items
    const normalizedItems: FirestoreOrderItem[] = (order.items || []).map((it: any) => {
      const prod = it.product || it;
      const price = Number(prod.price) || 0;
      const quantity = Number(it.quantity) || 1;
      return {
        id: prod.id || it.id || 'sx-item',
        name: prod.name || it.name || 'Sản phẩm Sủi Xanh',
        price,
        quantity,
        total: price * quantity,
      };
    });

    const finalTotal = Number(order.totalAmount ?? order.total) || 0;

    const documentData: FirestoreOrderDocument = {
      id: order.id,
      customerName: (order.customerName || '').trim(),
      phone: (order.phone || '').trim(),
      address: (order.address || '').trim(),
      items: normalizedItems,
      totalAmount: finalTotal,
      total: finalTotal,
      status: order.status || 'pending',
      estimatedDeliveryDays: order.estimatedDeliveryDays || '3 - 5 ngày',
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || new Date().toISOString(),
      paymentMethod: order.paymentMethod || 'cod',
    };

    if (order.userId) {
      documentData.userId = order.userId;
    }
    if (order.email) {
      documentData.email = order.email.trim();
    }
    if (order.note) {
      documentData.note = order.note.trim();
    }

    await setDoc(orderDocRef, documentData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Retrieves all customer orders for Admin view.
 * Requires admin authorization in Firestore security rules.
 *
 * @returns Array of OrderInfo sorted newest first
 */
export async function getAllOrders(): Promise<OrderInfo[]> {
  const path = FIRESTORE_COLLECTIONS.ORDERS;
  try {
    const ordersColRef = collection(db, FIRESTORE_COLLECTIONS.ORDERS);
    const q = query(ordersColRef);
    const snapshot = await getDocs(q);

    const orders: OrderInfo[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as FirestoreOrderDocument;
      orders.push({
        id: data.id || d.id,
        userId: data.userId,
        customerName: data.customerName || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        note: data.note || '',
        paymentMethod: data.paymentMethod || 'cod',
        items: data.items as any,
        total: data.totalAmount ?? data.total ?? 0,
        totalAmount: data.totalAmount ?? data.total ?? 0,
        status: data.status || 'pending',
        estimatedDeliveryDays: data.estimatedDeliveryDays || '3 - 5 ngày',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      });
    });

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Updates the fulfillment status and optional shipping estimate of an order.
 * Requires admin authorization in Firestore security rules.
 *
 * @param orderId - The target Order ID
 * @param status - The new order status ('pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled')
 * @param estimatedDeliveryDays - Optional shipping duration string (e.g. '3 - 5 ngày')
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  estimatedDeliveryDays?: string
): Promise<void> {
  const path = `${FIRESTORE_COLLECTIONS.ORDERS}/${orderId}`;
  try {
    const orderDocRef = doc(db, FIRESTORE_COLLECTIONS.ORDERS, orderId);
    const updates: Partial<FirestoreOrderDocument> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (estimatedDeliveryDays !== undefined) {
      updates.estimatedDeliveryDays = estimatedDeliveryDays;
    }

    await updateDoc(orderDocRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Subscribes to real-time updates for all orders (Admin listener)
 */
export function subscribeAllOrders(
  onSuccess: (orders: OrderInfo[]) => void,
  onError?: (error: any) => void
) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.ORDERS);
  const q = query(colRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: OrderInfo[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as FirestoreOrderDocument;
        orders.push({
          id: data.id || d.id,
          userId: data.userId,
          customerName: data.customerName || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          note: data.note || '',
          paymentMethod: data.paymentMethod || 'cod',
          items: data.items as any,
          total: data.totalAmount ?? data.total ?? 0,
          totalAmount: data.totalAmount ?? data.total ?? 0,
          status: data.status || 'pending',
          estimatedDeliveryDays: data.estimatedDeliveryDays || '3 - 5 ngày',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onSuccess(orders);
    },
    (err) => {
      console.error('Snapshot error listening to all orders:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.ORDERS);
    }
  );
}

/**
 * ==========================================
 * FIRESTORE HELPER FUNCTIONS: USERS / MEMBERS
 * ==========================================
 */

/**
 * Saves or updates a registered user profile in Firestore (/users/{userId}).
 * Preserves the original `createdAt` timestamp if user already registered.
 */
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<UserProfile | null> {
  if (!user.uid || !user.email) return null;

  const path = `${FIRESTORE_COLLECTIONS.USERS}/${user.uid}`;
  try {
    const userDocRef = doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid);
    const existingSnap = await getDoc(userDocRef);

    const nowIso = new Date().toISOString();
    let createdAt = nowIso;

    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as FirestoreUserDocument;
      if (existingData.createdAt) {
        createdAt = existingData.createdAt;
      }
    }

    const userData: FirestoreUserDocument = {
      uid: user.uid,
      email: user.email.toLowerCase().trim(),
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt,
      lastLoginAt: nowIso,
    };

    await setDoc(userDocRef, userData, { merge: true });

    return {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      createdAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return null;
  }
}

/**
 * Retrieves all registered users for the Admin panel.
 * Requires admin authorization.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const path = FIRESTORE_COLLECTIONS.USERS;
  try {
    const usersColRef = collection(db, FIRESTORE_COLLECTIONS.USERS);
    const q = query(usersColRef);
    const snapshot = await getDocs(q);

    const users: UserProfile[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as FirestoreUserDocument;
      users.push({
        uid: data.uid || d.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        createdAt: data.createdAt || '',
        lastLoginAt: data.lastLoginAt || '',
      });
    });

    // Sort newest registered users first
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Subscribes to real-time updates for all registered members (Admin listener)
 */
export function subscribeAllUsers(
  onSuccess: (users: UserProfile[]) => void,
  onError?: (error: any) => void
) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.USERS);
  const q = query(colRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as FirestoreUserDocument;
        users.push({
          uid: data.uid || d.id,
          email: data.email || '',
          displayName: data.displayName || '',
          photoURL: data.photoURL || '',
          createdAt: data.createdAt || '',
          lastLoginAt: data.lastLoginAt || '',
        });
      });
      users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onSuccess(users);
    },
    (err) => {
      console.error('Snapshot error listening to all users:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.USERS);
    }
  );
}
