import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db, requestNotificationPermission, onMessageListener } from '@/config/firebase';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  userId: string;
  isRead: boolean;
  createdAt: Timestamp;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Initialize Firebase messaging
    requestNotificationPermission();

    // Listen for foreground messages
    onMessageListener()
      .then((payload: any) => {
        toast({
          title: payload.notification?.title || 'New Notification',
          description: payload.notification?.body,
        });
      })
      .catch((err) => console.log('Failed to receive message: ', err));

    // Listen for notifications from Firestore
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationData: Notification[] = [];
      querySnapshot.forEach((doc) => {
        notificationData.push({ id: doc.id, ...doc.data() } as Notification);
      });
      setNotifications(notificationData);
    });

    return () => unsubscribe();
  }, [user]);

  const sendNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        isRead: false,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = notifications
        .filter(n => !n.isRead)
        .map(n => updateDoc(doc(db, 'notifications', n.id), { isRead: true }));
      
      await Promise.all(batch);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = async () => {
    // Implementation would depend on your cleanup strategy
    console.log('Clear notifications not implemented');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const value = {
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};