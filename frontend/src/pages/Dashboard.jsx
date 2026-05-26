import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Package,
  MapPin,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
  Plus,
  Zap,
  Bell,
  ArrowUpRight,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Flame,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import NewMissionModal from '../components/NewMissionModal';
import CommunityFeed from '../components/CommunityFeed';

const Dashboard = () => {
  const { user } = useAuth();
  const { socket } = useNotifications();

  const [stats, setStats] = useState({
    activeMissions: 0,
    completedDeliveries: 0,
    trustScore: 0,
  });
  const [activeMissions, setActiveMissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setStats(prev => ({
        ...prev,
        completedDeliveries: user.completedDeliveries || 0,
        trustScore: user.trustScore || 100
      }));
      fetchDashboardData();
    }
  }, [user]);

  // Real-time complete celebration socket hook
  useEffect(() => {
    if (socket) {
      socket.on('mission_completed', ({ xp, levelUp }) => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        toast.success(`🎉 Mission complete! Gained +${xp} XP.`);
        if (levelUp) {
          toast.success(`⭐ RANK UP! You reached ${levelUp}!`);
        }
        fetchDashboardData();
      });
    }
    return () => {
      if (socket) socket.off('mission_completed');
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      const [missionRes, myRequestsRes, leaderRes] = await Promise.all([
        axios.get('http://localhost:5000/api/requests/my-missions'),
        axios.get('http://localhost:5000/api/requests/my-requests'),
        axios.get('http://localhost:5000/api/users/leaderboard')
      ]);

      const ongoingMissions = missionRes.data.filter(m => m.status !== 'delivered' && m.status !== 'cancelled');
      const myOngoingRequests = myRequestsRes.data.filter(m => m.status === 'picked_up' || m.status === 'accepted');

      const combinedActive = [
        ...ongoingMissions.map(m => ({ ...m, role: 'helper' })),
        ...myOngoingRequests.map(m => ({ ...m, role: 'sender' }))
      ];

      setActiveMissions(combinedActive);
      setStats(prev => ({ ...prev, activeMissions: ongoingMissions.length }));

      setLeaderboard(leaderRes.data.slice(0, 3).map((u, i) => ({
        name: u.name,
        score: u.trustScore,
        xp: u.xp || 0,
        level: u.level || 'Beginner Helper',
        color: i === 0 ? 'bg-primary-teal' : i === 1 ? 'bg-muted-gray' : 'bg-deep-teal'
      })));
    } catch (err) {
      console.error(err);
    }
  };

  // XP level calculation helper
  const getLevelProgress = (xp) => {
    let minXP = 0;
    let maxXP = 500;
    let nextLevelName = 'Campus Carrier';

    if (xp >= 10000) {
      return { percentage: 100, remaining: 0, nextLevel: 'Campus Legend' };
    } else if (xp >= 5000) {
      minXP = 5000;
      maxXP = 10000;
      nextLevelName = 'Campus Legend';
    } else if (xp >= 2000) {
      minXP = 2000;
      maxXP = 5000;
      nextLevelName = 'Elite Courier';
    } else if (xp >= 500) {
      minXP = 500;
      maxXP = 2000;
      nextLevelName = 'Trusted Runner';
    }

    const totalNeeded = maxXP - minXP;
    const progressMade = xp - minXP;
    const percentage = Math.max(0, Math.min(100, (progressMade / totalNeeded) * 100));

    return {
      percentage: Math.round(percentage),
      remaining: maxXP - xp,
      nextLevel: nextLevelName
    };
  };

  const xpStats = getLevelProgress(user?.xp || 0);

  const StatCard = ({ icon: Icon, label, value, trend, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card p-6 flex flex-col gap-5 border border-white bg-white/95"
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-md shadow-primary-teal/10`}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-primary-teal bg-accent-cyan/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-cyan/25">
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-text-primary tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-deep-teal text-white mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={11} className="text-accent-cyan" /> Campus Runner Guild
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold text-text-primary">Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-base text-text-secondary font-medium tracking-tight">Level: <span className="font-bold text-primary-teal">{user?.level || 'Beginner Helper'}</span> • XP: {user?.xp || 0}</p>
          </motion.div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="btn-primary h-12 px-8 text-sm uppercase tracking-wider font-bold"
            >
              <Plus size={20} /> Post Mission
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard icon={Navigation} label="Active Missions" value={stats.activeMissions} trend={`${stats.activeMissions} Ongoing`} color="bg-primary-teal" delay={0.1} />
          <StatCard icon={Star} label="Trust Score" value={`${stats.trustScore}`} color="bg-deep-teal" delay={0.2} />
          <StatCard icon={TrendingUp} label="Missions Completed" value={stats.completedDeliveries} color="bg-primary-teal" delay={0.3} />
          <StatCard icon={Trophy} label="Rank Points" value={`${user?.xp || 0} XP`} trend={user?.level || 'Guild Member'} color="bg-deep-teal" delay={0.4} />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column: Ongoing Missions & Community Feed */}
          <div className="lg:col-span-2 space-y-10">

            {/* Ongoing Tasks */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">Ongoing Missions</h2>
                <div className="flex items-center gap-2 text-primary-teal font-bold text-[10px] uppercase tracking-widest bg-accent-cyan/20 px-3 py-1 rounded-full border border-accent-cyan/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-teal animate-ping" />
                  Tracking
                </div>
              </div>

              <div className="space-y-4">
                {activeMissions.length > 0 ? (
                  activeMissions.map((mission) => (
                    <div key={mission._id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-white bg-white/95 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-accent-cyan/15 flex items-center justify-center text-primary-teal border border-border-subtle shadow-inner">
                          <Package size={22} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-text-primary mb-0.5">{mission.itemName}</h4>
                          <p className="text-xs text-text-secondary font-medium">{mission.pickupLocation} → {mission.dropLocation}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
                              {mission.status.replace('_', ' ')}
                            </span>
                            {mission.role === 'sender' && mission.status === 'picked_up' && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                🔑 Share OTP: {mission.otp || '----'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link to="/requests" className="btn-secondary h-9 px-6 text-xs uppercase tracking-widest font-bold">Manage</Link>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left border border-white bg-white/95">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-bg-alt flex items-center justify-center text-text-placeholder border border-dashed border-border-subtle shrink-0">
                        <Package size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-text-primary mb-1">No ongoing missions</h4>
                        <p className="text-sm text-text-secondary font-medium">Coordinate a shipment to build your trust ranking!</p>
                      </div>
                    </div>
                    <Link to="/requests" className="btn-secondary h-10 px-6 py-2 text-xs align-center uppercase tracking-widest font-bold shrink-0">Guild Board</Link>
                  </div>
                )}
              </div>
            </section>

            {/* Real-time Community Feed */}
            <CommunityFeed />
          </div>

          {/* Right Column: Gamification Milestones & Leaderboards */}
          <div className="space-y-10">

            {/* Gamification Progress */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">Guild Rank</h2>
              <div className="glass-card p-8 space-y-6 border border-white bg-white/95">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-text-placeholder uppercase tracking-widest">Rank Progression</p>
                  <p className="text-[10px] font-bold text-primary-teal uppercase tracking-widest">
                    Level Up: {xpStats.percentage}%
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-deep-teal flex items-center justify-center text-white shadow-xl shadow-deep-teal/10">
                    <ShieldCheck size={28} className="text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-base font-black text-text-primary">{user?.level || 'Beginner Helper'}</p>
                    {xpStats.percentage === 100 ? (
                      <p className="text-xs text-text-secondary font-medium">Ultimate guild rank achieved!</p>
                    ) : (
                      <p className="text-xs text-text-secondary font-medium">
                        {xpStats.remaining} XP left to <span className="font-bold text-primary-teal">{xpStats.nextLevel}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="h-2.5 bg-bg-alt rounded-full overflow-hidden border border-muted-gray/10 relative">
                  <div
                    className="h-full bg-primary-teal rounded-full shadow-inner transition-all duration-500"
                    style={{ width: `${xpStats.percentage}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Standing/Leaderboard */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">Guild Leaderboard</h2>
              <div className="glass-card p-8 space-y-5 border border-white bg-white/95">
                {leaderboard.length > 0 ? leaderboard.map((leader, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl ${leader.color} flex items-center justify-center text-white font-black text-xs shadow-sm`}>
                        {i === 0 ? '👑' : leader.name[0]}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-text-primary group-hover:text-primary-teal transition-colors block leading-tight">{leader.name}</span>
                        <span className="text-[10px] text-text-muted font-semibold">{leader.level}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-text-primary leading-tight">{leader.score}</p>
                      <p className="text-[9px] text-text-placeholder font-bold uppercase tracking-widest leading-none">Trust</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-text-secondary">Standings are loading...</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Unified Mission Creation Modal */}
      <NewMissionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </MainLayout>
  );
};

export default Dashboard;
