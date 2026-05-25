import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
   User,
   Mail,
   IdCard,
   GraduationCap,
   Star,
   ShieldCheck,
   Settings,
   MapPin,
   Camera,
   BadgeCheck,
   Zap,
   TrendingUp,
   Heart,
   Flame,
   Sparkles,
   Trophy,
   Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
   const { user } = useAuth();
   const [profile, setProfile] = useState(null);
   const [isEditMode, setIsEditMode] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [formData, setFormData] = useState({ name: '', department: '' });

   useEffect(() => {
      if (user) {
         setProfile(user);
         setFormData({ name: user.name || '', department: user.department || '' });
      }
   }, [user]);

   const handleUpdateProfile = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
         const res = await axios.put('http://localhost:5000/api/users/profile', formData);
         setProfile(res.data);
         setIsEditMode(false);
         toast.success('Identity profile updated! ✨');
      } catch (error) {
         console.error(error);
         toast.error('Failed to save profile changes.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const BadgeItem = ({ name, unlocked }) => {
      const getBadgeIcon = (badgeName) => {
         switch (badgeName) {
            case 'Newcomer': return <Sparkles size={16} />;
            case 'Speed Hero': return <Zap size={16} />;
            case 'Trusted Student': return <ShieldCheck size={16} />;
            case 'Emergency Responder': return <Trophy size={16} />;
            default: return <Heart size={16} />;
         }
      };

      const getBadgeBg = (unlocked) => {
         return unlocked 
            ? 'bg-accent-cyan/20 border-accent-cyan text-primary-teal'
            : 'bg-bg-alt/50 border-muted-gray/10 text-text-placeholder opacity-60';
      };

      return (
         <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border shadow-sm transition-all ${getBadgeBg(unlocked)}`}>
            {getBadgeIcon(name)}
            <span className="text-xs font-black uppercase tracking-widest">{name}</span>
         </div>
      );
   };

   // Level Calculator
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

   const xpProgress = getLevelProgress(profile?.xp || 0);

   // Defined badges for LPU campus runners
   const allBadges = [
      'Newcomer',
      'Speed Hero', 
      'Trusted Student', 
      'Night Delivery Expert', 
      'Emergency Responder', 
      'Community Champion'
   ];

   return (
      <MainLayout>
         <div className="flex flex-col gap-12 max-w-7xl mx-auto">

            {/* Profile Header */}
            <div className="relative">
               {/* Cover Area */}
               <div className="h-48 rounded-[3rem] bg-gradient-to-r from-primary-teal via-muted-gray to-accent-cyan shadow-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
               </div>

               {/* Profile Info Overlay */}
               <div className="px-12 -mt-16 flex flex-col md:flex-row items-end gap-8 relative z-10">
                  <div className="relative group">
                     <div className="w-40 h-40 rounded-[3rem] bg-white p-3 shadow-2xl border-4 border-white">
                        <div className="w-full h-full rounded-[2.5rem] bg-primary-teal flex items-center justify-center text-white font-black text-6xl shadow-inner relative overflow-hidden">
                           {profile?.name?.[0] || 'C'}
                           <div className="absolute inset-0 bg-white/20 blur-xl translate-y-full" />
                        </div>
                     </div>
                     <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-primary-teal hover:scale-110 transition-transform">
                        <Camera size={20} />
                      </button>
                  </div>

                  <div className="flex-1 pb-4 text-center md:text-left">
                     <h1 className="text-5xl font-black text-text-primary tracking-tight mb-2 flex items-center justify-center md:justify-start gap-3">
                        {profile?.name} <BadgeCheck className="text-primary-teal" size={32} />
                     </h1>
                     <p className="text-lg text-text-secondary font-medium">Verified Campus Member • {profile?.department || 'General Department'}</p>
                     <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1.5 flex items-center justify-center md:justify-start gap-1">
                        Level: <span className="text-primary-teal">{profile?.level || 'Beginner Helper'}</span> • {profile?.xp || 0} XP
                     </p>
                  </div>

                  <div className="pb-4 flex gap-4">
                     <button onClick={() => setIsEditMode(true)} className="btn-secondary px-8">Edit Profile</button>
                     <div className="w-14 h-14 rounded-2xl bg-white border border-muted-gray/20 flex items-center justify-center text-text-muted hover:text-primary-teal transition-colors shadow-sm">
                        <Settings size={24} />
                     </div>
                  </div>
               </div>
            </div>

            {isEditMode && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-deep-teal/30 backdrop-blur-md">
                  <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white">
                     <h2 className="text-3xl font-black mb-6 text-text-primary tracking-tight">Edit Profile</h2>
                     <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Name</label>
                           <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Department</label>
                           <input type="text" className="input-field" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-muted-gray/10">
                           <button type="button" onClick={() => setIsEditMode(false)} className="btn-secondary px-6">Cancel</button>
                           <button type="submit" disabled={isSubmitting} className="btn-primary px-6">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                     </form>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

               {/* Left Column - Stats & Badges */}
               <div className="space-y-10">
                  
                  {/* Streak & Level Milestone Card */}
                  <div className="glass-card p-8 space-y-6 border border-white bg-white/95">
                     <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-text-placeholder uppercase tracking-widest">Level Progress</p>
                        <p className="text-[10px] font-bold text-primary-teal uppercase tracking-widest">
                           {xpProgress.percentage}%
                        </p>
                     </div>
                     
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-deep-teal flex items-center justify-center text-white shadow-xl shadow-deep-teal/10">
                           <Trophy size={28} className="text-accent-cyan" />
                        </div>
                        <div>
                           <p className="text-base font-black text-text-primary">{profile?.level || 'Beginner Helper'}</p>
                           {xpProgress.percentage === 100 ? (
                             <p className="text-xs text-text-secondary font-medium">Ultimate guild rank!</p>
                           ) : (
                             <p className="text-xs text-text-secondary font-medium">
                               {xpProgress.remaining} XP left to <span className="font-bold text-primary-teal">{xpProgress.nextLevel}</span>
                             </p>
                           )}
                        </div>
                     </div>

                     <div className="h-2.5 bg-bg-alt rounded-full overflow-hidden border border-muted-gray/10 relative">
                        <div 
                          className="h-full bg-primary-teal rounded-full shadow-inner transition-all duration-500" 
                          style={{ width: `${xpProgress.percentage}%` }}
                        />
                     </div>
                  </div>

                  {/* Helper Metrics */}
                  <div className="glass-card p-8 space-y-6 border border-white bg-white/95">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">Guild Statistics</h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 rounded-2xl bg-bg-alt/50 border border-muted-gray/10">
                           <p className="text-[9px] font-black text-text-placeholder uppercase tracking-widest mb-1 leading-none">Trust Score</p>
                           <div className="flex items-center gap-1 text-primary-teal font-black text-xl">
                              <Star size={16} className="fill-current" />
                              <span>{profile?.trustScore}%</span>
                           </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-bg-alt/50 border border-muted-gray/10">
                           <p className="text-[9px] font-black text-text-placeholder uppercase tracking-widest mb-1 leading-none">Deliveries</p>
                           <div className="flex items-center gap-1.5 text-deep-teal font-black text-xl">
                              <TrendingUp size={16} />
                              <span>{profile?.completedDeliveries}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Badges Widget */}
                  <div className="glass-card p-8 space-y-5 border border-white bg-white/95">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight">Earned Badges</h3>
                     <div className="flex flex-wrap gap-3">
                        {allBadges.map((badgeName) => {
                           const isUnlocked = profile?.badges?.includes(badgeName) || badgeName === 'Newcomer';
                           return (
                              <BadgeItem key={badgeName} name={badgeName} unlocked={isUnlocked} />
                           );
                        })}
                     </div>
                  </div>
               </div>

               {/* Right Column - Account Details */}
               <div className="lg:col-span-2 space-y-10">
                  <div className="glass-card p-10 !bg-white/60">
                     <h3 className="text-2xl font-black text-text-primary mb-10 tracking-tight">Identity Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="flex items-start gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-bg-alt flex items-center justify-center text-text-muted shrink-0 border border-muted-gray/10">
                              <Mail size={22} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-text-placeholder uppercase tracking-widest mb-1">Email Address</p>
                              <p className="text-base font-bold text-text-primary break-all">{profile?.email}</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-bg-alt flex items-center justify-center text-text-muted shrink-0 border border-muted-gray/10">
                              <IdCard size={22} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-text-placeholder uppercase tracking-widest mb-1">Student Identification ID</p>
                              <p className="text-base font-bold text-text-primary">{profile?.studentId || 'Not set'}</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-bg-alt flex items-center justify-center text-text-muted shrink-0 border border-muted-gray/10">
                              <GraduationCap size={22} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-text-placeholder uppercase tracking-widest mb-1">Department / Branch</p>
                              <p className="text-base font-bold text-text-primary">{profile?.department || 'General'}</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-bg-alt flex items-center justify-center text-text-muted shrink-0 border border-muted-gray/10">
                              <MapPin size={22} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-text-placeholder uppercase tracking-widest mb-1">Guild Campus Location</p>
                              <p className="text-base font-bold text-text-primary">Main Campus Central</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Streak & Active Records */}
                  <div className="glass-card p-10 !bg-white/60">
                     <h3 className="text-2xl font-black text-text-primary mb-8 tracking-tight">Active Guild Streaks</h3>
                     <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-orange-50/50 flex items-center justify-between border border-orange-100">
                           <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                 <Flame size={20} className="fill-current animate-pulse" />
                              </div>
                              <div>
                                 <p className="font-bold text-text-primary leading-snug">Daily Streak: {profile?.streak || 3} Days Active</p>
                                 <p className="text-[10px] text-text-muted font-medium">Earn +20 points every consecutive day you log in.</p>
                              </div>
                           </div>
                           <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="p-5 rounded-2xl bg-accent-cyan/15 flex items-center justify-between border border-accent-cyan/35">
                           <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-accent-cyan/35 flex items-center justify-center text-primary-teal">
                                 <Sparkles size={20} />
                              </div>
                              <div>
                                 <p className="font-bold text-text-primary leading-snug">Beginner Guild Helper</p>
                                 <p className="text-[10px] text-text-muted font-medium">Complete more missions to unlock advanced Level ranks.</p>
                              </div>
                           </div>
                           <span className="text-xs font-black text-primary-teal uppercase tracking-widest">Active</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </MainLayout>
   );
};

export default Profile;
