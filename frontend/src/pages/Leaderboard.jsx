import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, User, Search, Crown, ArrowUpRight, Flame } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/leaderboard');
      setLeaders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-12 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-lavender/10 border border-primary-lavender/20 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-lavender">Global Hall of Fame</span>
               </div>
               <h1 className="text-5xl font-black text-text-primary tracking-tight mb-4">Campus Champions</h1>
               <p className="text-xl text-text-secondary font-medium">Recognizing the students who go above and beyond to help our community thrive.</p>
            </motion.div>
          </div>
          <div className="glass-card px-10 py-6 flex items-center gap-6 !bg-white/60">
             <div className="w-14 h-14 rounded-2xl bg-primary-blue/20 flex items-center justify-center text-primary-blue shadow-lg">
                <Trophy size={32} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted leading-none mb-1">Your Rank</p>
                <p className="text-2xl font-black text-text-primary">#42 <span className="text-sm font-bold text-emerald-500 ml-2">↑ 5</span></p>
             </div>
          </div>
        </div>

        {/* Top 3 Spotlight - Ultra Premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end mt-10 mb-8">
          {leaders.slice(0, 3).map((leader, i) => {
            const isFirst = i === 0;
            return (
              <motion.div
                key={leader._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={`relative flex flex-col items-center group ${isFirst ? 'md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
              >
                {isFirst && (
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-16 z-20"
                  >
                     <Crown size={64} className="text-amber-400 fill-amber-400 drop-shadow-[0_10px_20px_rgba(251,191,36,0.4)]" />
                  </motion.div>
                )}
                
                <div className={`relative glass-card p-10 w-full flex flex-col items-center text-center transition-all duration-500 ${
                  isFirst ? 'border-primary-blue/40 !bg-white/80 scale-110 pb-16 shadow-2xl shadow-primary-blue/10' : ''
                }`}>
                  <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl mb-8 relative ${
                    isFirst ? 'bg-primary-blue' : i === 1 ? 'bg-slate-300' : 'bg-primary-peach'
                  }`}>
                    {leader.name[0]}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-main shadow-xl border-2 border-slate-50">
                       <span className="font-black text-sm">{i + 1}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-text-primary mb-2 group-hover:text-primary-blue transition-colors">{leader.name}</h3>
                  <div className="flex items-center gap-2 mb-8">
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{leader.department || 'Campus Helper'}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 w-full border-t border-slate-200/50 pt-8">
                     <div>
                        <p className="text-2xl font-black text-text-primary">{leader.completedDeliveries}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Deliveries</p>
                     </div>
                     <div>
                        <p className="text-2xl font-black text-text-primary">{leader.trustScore}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Points</p>
                     </div>
                  </div>

                  {isFirst && (
                    <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-primary-blue/10 text-primary-blue text-[10px] font-black uppercase tracking-widest">
                       <Flame size={14} className="animate-pulse" /> Trending #1
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Table View - Clean and Spacious */}
        <div className="glass-card overflow-hidden !bg-white/60 mt-10">
           <div className="p-10 border-b border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <h3 className="text-3xl font-black text-text-primary tracking-tight">Full Standings</h3>
              <div className="relative w-full md:w-80">
                 <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                 <input 
                   type="text" 
                   placeholder="Find a champion..." 
                   className="w-full bg-bg-alt/50 border border-slate-200 rounded-full pl-14 pr-8 py-3.5 text-sm font-medium focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue outline-none transition-all" 
                 />
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-alt/30 text-left">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Rank</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Student</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Department</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Impact</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Trust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {leaders.map((leader, i) => (
                    <motion.tr 
                      key={leader._id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="group hover:bg-white/40 transition-colors"
                    >
                      <td className="px-10 py-8">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                           i < 3 ? 'bg-primary-blue/10 text-primary-blue' : 'text-text-muted'
                         }`}>
                           {i + 1}
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-bg-alt flex items-center justify-center text-text-secondary font-black group-hover:scale-110 transition-transform">
                             {leader.name[0]}
                           </div>
                           <div>
                              <p className="font-black text-text-primary group-hover:text-primary-blue transition-colors">{leader.name}</p>
                              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Active Member</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <span className="text-sm font-bold text-text-secondary">
                           {leader.department || 'General'}
                         </span>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col">
                            <span className="text-lg font-black text-text-primary">{leader.completedDeliveries}</span>
                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Jobs</span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <Star size={20} className="text-amber-400 fill-amber-400" />
                           <span className="font-black text-xl text-text-primary">{leader.trustScore}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
