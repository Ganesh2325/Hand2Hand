import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Zap, RefreshCw, Flame, Navigation } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const CommunityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useNotifications();

  useEffect(() => {
    fetchActivities();

    // Listen to real-time additions if triggered by socket
    if (socket) {
      socket.on('new_activity', (act) => {
        setActivities((prev) => [act, ...prev].slice(0, 30));
      });
    }

    return () => {
      if (socket) {
        socket.off('new_activity');
      }
    };
  }, [socket]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'MISSION_COMPLETED':
        return <Trophy className="text-amber-500" size={16} />;
      case 'BADGE_EARNED':
        return <Flame className="text-orange-500" size={16} />;
      case 'RANK_UP':
        return <Sparkles className="text-primary-teal animate-pulse" size={16} />;
      case 'NEW_REQUEST':
        return <Navigation className="text-emerald-500" size={16} />;
      default:
        return <Zap className="text-primary-teal" size={16} />;
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case 'MISSION_COMPLETED':
        return 'bg-amber-50';
      case 'BADGE_EARNED':
        return 'bg-orange-50';
      case 'RANK_UP':
        return 'bg-accent-cyan/25';
      default:
        return 'bg-bg-alt';
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          Community Activity
          <div className="flex items-center gap-1.5 text-primary-teal bg-accent-cyan/15 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-accent-cyan/30">
            Live
          </div>
        </h2>
        <button
          onClick={fetchActivities}
          className="w-9 h-9 rounded-xl bg-white border border-muted-gray/20 flex items-center justify-center text-text-muted hover:text-primary-teal hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="glass-card p-6 !bg-white/60">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex items-center justify-center flex-col gap-2">
              <div className="w-8 h-8 border-3 border-primary-teal border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-text-placeholder uppercase tracking-wider">Syncing feed...</p>
            </div>
          ) : activities.length > 0 ? (
            <AnimatePresence initial={false}>
              {activities.map((act) => (
                <motion.div
                  key={act._id}
                  initial={{ opacity: 0, x: -10, y: -5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/40 transition-colors border border-transparent hover:border-muted-gray/10"
                >
                  {/* User Initial or Icon */}
                  <div className={`w-9 h-9 rounded-xl ${getActivityBg(act.type)} flex items-center justify-center shrink-0 shadow-sm border border-white`}>
                    {getActivityIcon(act.type)}
                  </div>
                  {/* Text */}
                  <div className="flex-1 leading-tight">
                    <p className="text-sm font-semibold text-text-primary">
                      <span className="font-bold text-deep-teal">{act.user?.name || 'Someone'}</span>{' '}
                      <span className="text-text-secondary font-medium">{act.text}</span>
                    </p>
                    <p className="text-[10px] font-bold text-text-placeholder uppercase tracking-widest mt-1">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-20 text-center text-text-placeholder font-semibold text-sm">
              No campus activities logged today.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommunityFeed;
