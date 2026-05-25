import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const LiveChat = ({ isOpen, onClose, missionId, missionTitle }) => {
  const { user } = useAuth();
  const { socket } = useNotifications();
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch past messages and setup Socket
  useEffect(() => {
    if (!isOpen || !missionId) return;

    fetchChatHistory();

    if (socket) {
      socket.emit('join_mission', missionId);

      socket.on('receive_message', (msg) => {
        if (msg.missionId === missionId) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave_mission', missionId);
        socket.off('receive_message');
      }
    };
  }, [isOpen, missionId, socket]);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${missionId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load chat logs', err);
      toast.error('Could not restore chat history.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const payload = { message: typedMessage.trim() };
    setTypedMessage('');

    try {
      // POST also emits socket to others inside controller
      const res = await axios.post(`http://localhost:5000/api/chat/${missionId}`, payload);
      // Locally add the message to prevent race delay
      setMessages((prev) => {
        // Skip if message already added by Socket listener to avoid double display
        if (prev.find((m) => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });
    } catch (err) {
      toast.error('Message failed to transmit.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-deep-teal/30 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md h-full bg-white border-l border-muted-gray/25 shadow-2xl flex flex-col z-10"
      >
        {/* Header */}
        <div className="p-6 border-b border-muted-gray/15 flex items-center justify-between bg-bg-main/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-teal/15 flex items-center justify-center text-primary-teal shadow-inner">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg text-text-primary leading-tight">{missionTitle || 'Coordination'}</h3>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Secure Chat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-muted-gray/20 flex items-center justify-center text-text-muted hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#FAFCFC]">
          {loading ? (
            <div className="h-full flex items-center justify-center flex-col gap-3">
              <div className="w-10 h-10 border-4 border-primary-teal border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-text-placeholder uppercase tracking-wider">Syncing channel...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const isMe = msg.sender?._id === user?._id;
              return (
                <div key={msg._id} className={`flex gap-3.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  {/* Sender Avatar */}
                  <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-black text-xs text-white ${
                    isMe ? 'bg-primary-teal' : 'bg-deep-teal'
                  }`}>
                    {msg.sender?.name[0] || 'C'}
                  </div>
                  {/* Text Container */}
                  <div className="space-y-1">
                    <p className={`text-[10px] font-bold text-text-muted ${isMe ? 'text-right' : ''}`}>
                      {msg.sender?.name} <span className="font-medium text-text-placeholder">({msg.sender?.level || 'Beginner'})</span>
                    </p>
                    <div className={`p-3.5 rounded-2xl shadow-sm border ${
                      isMe 
                        ? 'bg-primary-teal text-white border-primary-teal/15 rounded-tr-none' 
                        : 'bg-white text-text-primary border-muted-gray/15 rounded-tl-none'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed break-words">{msg.message}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center flex-col gap-4 text-center p-6 border-2 border-dashed border-muted-gray/20 rounded-3xl m-2">
              <Sparkles size={32} className="text-primary-teal opacity-50 animate-pulse" />
              <div>
                <h4 className="text-sm font-black text-text-primary mb-1">Begin Coordination</h4>
                <p className="text-xs text-text-secondary font-medium">Say hi to coordinate parcel exchange locations!</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-5 border-t border-muted-gray/15 bg-white flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            className="input-field rounded-2xl h-12 flex-1"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-12 h-12 rounded-2xl bg-primary-teal flex items-center justify-center text-white hover:bg-deep-teal transition-colors active:scale-95 shadow-md shrink-0 cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LiveChat;
