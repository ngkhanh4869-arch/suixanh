import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { OrderInfo, OrderStatus, UserProfile, AdminProfile } from '../types';

export const SUPER_ADMIN_EMAIL = 'ngkhanh4869@gmail.com';

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

export interface FirestoreAdminDocument {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'superadmin';
  assignedBy?: string;
  createdAt: string;
}

/**
 * ==========================================
 * FIRESTORE HELPER FUNCTIONS: ORDERS
 * ==========================================
 */

/**
 * Saves a new order into Firestore with items, contact details, and initial status ('pending').
 */
export async function saveOrder(order: OrderInfo): Promise<void> {
  const path = `${FIRESTORE_COLLECTIONS.ORDERS}/${order.id}`;
  try {
    const orderDocRef = doc(db, FIRESTORE_COLLECTIONS.ORDERS, order.id);

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

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Updates the fulfillment status and optional shipping estimate of an order.
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

    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Subscribes to real-time updates for all registered members
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

/**
 * ==========================================
 * FIRESTORE HELPER FUNCTIONS: ADMIN MANAGEMENT
 * ==========================================
 */

/**
 * Checks if a specific UID has active admin authorization in /admins/{uid}
 */
export async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  const path = `${FIRESTORE_COLLECTIONS.ADMINS}/${uid}`;
  try {
    const adminDocRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, uid);
    const snap = await getDoc(adminDocRef);
    return snap.exists();
  } catch (error) {
    // If not admin, security rules may return permission-denied
    return false;
  }
}

/**
 * Appoints a registered user as an Admin in /admins/{uid}.
 * Only Super Admin (ngkhanh4869@gmail.com) is permitted by Firestore rules.
 */
export async function appointAdmin(user: {
  uid: string;
  email: string;
  displayName?: string;
}): Promise<void> {
  const path = `${FIRESTORE_COLLECTIONS.ADMINS}/${user.uid}`;
  try {
    const adminDocRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, user.uid);
    const adminData: FirestoreAdminDocument = {
      uid: user.uid,
      email: user.email.toLowerCase().trim(),
      displayName: user.displayName || '',
      role: 'admin',
      assignedBy: SUPER_ADMIN_EMAIL,
      createdAt: new Date().toISOString(),
    };
    await setDoc(adminDocRef, adminData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Revokes admin privileges from a user.
 * Only Super Admin is permitted by Firestore rules.
 */
export async function revokeAdmin(adminUid: string): Promise<void> {
  const path = `${FIRESTORE_COLLECTIONS.ADMINS}/${adminUid}`;
  try {
    const adminDocRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, adminUid);
    await deleteDoc(adminDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Retrieves the full list of admins.
 */
export async function getAllAdmins(): Promise<AdminProfile[]> {
  const path = FIRESTORE_COLLECTIONS.ADMINS;
  try {
    const adminsColRef = collection(db, FIRESTORE_COLLECTIONS.ADMINS);
    const q = query(adminsColRef);
    const snapshot = await getDocs(q);

    const admins: AdminProfile[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as FirestoreAdminDocument;
      admins.push({
        uid: data.uid || d.id,
        email: data.email || '',
        displayName: data.displayName || '',
        role: data.role || 'admin',
        assignedBy: data.assignedBy || SUPER_ADMIN_EMAIL,
        createdAt: data.createdAt || '',
      });
    });

    return admins;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Subscribes to live updates of the Admins collection
 */
export function subscribeAllAdmins(
  onSuccess: (admins: AdminProfile[]) => void,
  onError?: (error: any) => void
) {
  const colRef = collection(db, FIRESTORE_COLLECTIONS.ADMINS);
  const q = query(colRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const admins: AdminProfile[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as FirestoreAdminDocument;
        admins.push({
          uid: data.uid || d.id,
          email: data.email || '',
          displayName: data.displayName || '',
          role: data.role || 'admin',
          assignedBy: data.assignedBy || SUPER_ADMIN_EMAIL,
          createdAt: data.createdAt || '',
        });
      });
      onSuccess(admins);
    },
    (err) => {
      console.error('Snapshot error listening to admins:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, FIRESTORE_COLLECTIONS.ADMINS);
    }
  );
}
