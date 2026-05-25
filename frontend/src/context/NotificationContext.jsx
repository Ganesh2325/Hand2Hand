import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (token && user) {
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket');
        newSocket.emit('join', user._id);
      });

      newSocket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.success(notification.message, {
          icon: '🔔',
          style: {
            borderRadius: '16px',
            background: '#ffffff',
            color: '#1E293B',
            fontWeight: 'bold',
            border: '1px solid rgba(124, 198, 254, 0.2)',
            boxShadow: '0 20px 40px -15px rgba(30, 41, 59, 0.1)'
          }
        });
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token, user]);

  return (
    <NotificationContext.Provider value={{ socket, notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
