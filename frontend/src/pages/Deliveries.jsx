import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  MapPin,
  User,
  Tag,
  ChevronRight,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  ShieldCheck,
  Check,
  MessageSquare,
  Gift,
  Eye,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import NewMissionModal from '../components/NewMissionModal';
import LiveChat from '../components/LiveChat';

const Deliveries = () => {
  const { user } = useAuth();

  // Tab states: 'active', 'accepted', 'completed', 'posted'
  const [activeTab, setActiveTab] = useState('active');
  const [availableMissions, setAvailableMissions] = useState([]);
  const [myMissions, setMyMissions] = useState([]); // Missions I've accepted
  const [myPostedRequests, setMyPostedRequests] = useState([]); // Requests I've created

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [availableRes, myMissionsRes, myPostedRes] = await Promise.all([
        axios.get('http://localhost:5000/api/requests/available'),
        axios.get('http://localhost:5000/api/requests/my-missions'),
        axios.get('http://localhost:5000/api/requests/my-requests')
      ]);

      setAvailableMissions(availableRes.data);
      setMyMissions(myMissionsRes.data);
      setMyPostedRequests(myPostedRes.data);
    } catch (err) {
      console.error('Failed to synchronize missions data', err);
      toast.error('Could not refresh mission board.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/requests/${id}/accept`);
      toast.success('Mission accepted! Navigate to Accepted tab to coordinate. 🚀');
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept mission.');
    }
  };

  const handleStatusUpdate = async (id, status, otp = null) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/requests/${id}/status`, { status, otp });

      if (status === 'delivered') {
        setIsOtpModalOpen(false);
        setOtpValue('');
        // Trigger amazing Confetti explosion!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        toast.success(`🎉 Mission completed! +${res.data.rewardPoints || 100} Reputation points earned.`);
      } else {
        toast.success(`Mission status updated: ${status.replace('_', ' ')}!`);
      }
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification or status update failed.');
    }
  };

  const openChatForMission = (mission) => {
    setSelectedRequest(mission);
    setIsChatOpen(true);
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'Important':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      default:
        return 'bg-accent-cyan/15 text-primary-teal border border-accent-cyan/35';
    }
  };

  // Filter requests based on tabs
  const getDisplayRequests = () => {
    switch (activeTab) {
      case 'active':
        // Show pending requests created by others
        return availableMissions.filter(req => req.sender?._id !== user?._id);
      case 'accepted':
        // Show requests where current user is helper and not finished yet
        return myMissions.filter(req => req.status !== 'delivered');
      case 'completed':
        // Show completed requests where current user is helper OR sender
        const completedHelper = myMissions.filter(req => req.status === 'delivered');
        const completedSender = myPostedRequests.filter(req => req.status === 'delivered');
        return [...completedHelper, ...completedSender];
      case 'posted':
        // Show all my created requests that are active
        return myPostedRequests.filter(req => req.status !== 'delivered');
      default:
        return [];
    }
  };

  const MissionCard = ({ request }) => {
    const isSender = request.sender?._id === user?._id || request.sender === user?._id;
    const oppositeUser = isSender ? request.helper : request.sender;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        whileHover={{ y: -6 }}
        className="glass-card p-8 group h-fit relative overflow-hidden bg-white/95 border border-white"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary-teal/5 rounded-bl-[3rem] group-hover:scale-105 transition-transform duration-500" />

        {/* Category & Urgency */}
        <div className="flex items-start justify-between mb-6 relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-primary-teal shadow-inner">
              <Package size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg text-text-primary tracking-tight">{request.itemName}</h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">
                {request.parcelType || 'General Parcel'}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getUrgencyStyle(request.urgency)}`}>
            {request.urgency}
          </span>
        </div>

        {/* Route Vectors */}
        <div className="space-y-4 mb-6 relative pl-3">
          <div className="absolute left-[3px] top-2 bottom-2 w-[1.5px] bg-dashed border-l border-muted-gray/40" />

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[8px] font-black text-text-placeholder uppercase tracking-wider leading-none mb-0.5">Pickup Point</p>
              <p className="text-xs font-bold text-text-secondary leading-tight">{request.pickupLocation}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan shrink-0 relative z-10" />
            <div className="flex-1">
              <p className="text-[8px] font-black text-text-placeholder uppercase tracking-wider leading-none mb-0.5">Drop Destination</p>
              <p className="text-xs font-bold text-text-secondary leading-tight">{request.dropLocation}</p>
            </div>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-4 py-4 my-4 border-y border-muted-gray/10">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[8px] font-black text-text-placeholder uppercase tracking-widest">Reward</p>
              <p className="text-xs font-black text-deep-teal">+{request.rewardPoints || 100} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[8px] font-black text-text-placeholder uppercase tracking-widest">Expected ETA</p>
              <p className="text-xs font-bold text-text-secondary truncate max-w-[100px]">
                {request.expectedDeliveryTime || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Sender / Helper info */}
        {oppositeUser && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-alt/40 border border-muted-gray/10 mb-5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-teal/20 flex items-center justify-center text-[10px] font-black text-primary-teal uppercase">
                {oppositeUser.name?.[0] || 'C'}
              </div>
              <div>
                <p className="font-black text-text-primary leading-tight">{oppositeUser.name}</p>
                <p className="text-[9px] text-text-muted font-semibold">{isSender ? 'Your Runner' : 'Sender'}</p>
              </div>
            </div>
            {request.status !== 'delivered' && (
              <button
                onClick={() => openChatForMission(request)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-muted-gray/20 hover:border-primary-teal text-[10px] font-bold uppercase tracking-wider text-primary-teal hover:bg-accent-cyan/10 transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare size={12} /> Chat
              </button>
            )}
          </div>
        )}

        {/* Action Triggers */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-text-placeholder text-[9px] font-bold uppercase tracking-widest">
            <Eye size={12} /> {request.routeVisibility || 'Public'}
          </div>

          {activeTab === 'active' && (
            <button
              onClick={() => handleAccept(request._id)}
              className="btn-primary h-9 px-4 rounded-lg text-xs uppercase tracking-wider"
            >
              Accept Mission <ChevronRight size={12} />
            </button>
          )}

          {activeTab === 'accepted' && (
            <div className="flex gap-2 w-full justify-end">
              {request.status === 'accepted' && (
                <button
                  onClick={() => handleStatusUpdate(request._id, 'picked_up')}
                  className="btn-primary h-9 px-4 rounded-lg text-xs uppercase tracking-wider"
                >
                  Mark Picked Up
                </button>
              )}
              {request.status === 'picked_up' && (
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsOtpModalOpen(true);
                  }}
                  className="btn-secondary h-9 px-4 rounded-lg text-xs uppercase tracking-wider border-emerald-500/35 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  Verify Delivery
                </button>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-black text-[11px] uppercase tracking-wider">
              <CheckCircle2 size={14} /> Completed
            </div>
          )}

          {activeTab === 'posted' && (
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-teal bg-accent-cyan/10 border border-accent-cyan/35 px-2.5 py-1 rounded-full">
                Status: {request.status}
              </span>
              {request.status === 'pending' && (
                <span className="text-[10px] font-bold text-text-placeholder italic">Waiting for runner...</span>
              )}
              {request.status === 'picked_up' && (
                <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-right">
                  <p className="text-[8px] font-black text-amber-700 uppercase tracking-widest leading-none mb-1">Your OTP for Runner</p>
                  <p className="text-sm font-black text-amber-900 tracking-widest leading-none">{request.otp || '----'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-12 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-teal">Active Campus Guild</span>
              </div>
              <h1 className="text-5xl font-black text-text-primary tracking-tight mb-4">Mission Board</h1>
              <p className="text-xl text-text-secondary font-medium">Browse help requests from campus or post your own to get items delivered instantly.</p>
            </motion.div>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="btn-primary px-10 shadow-xl group cursor-pointer"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> New Mission
          </button>
        </div>

        {/* Tab System */}
        <div className="flex items-center gap-2 md:gap-4 border-b border-muted-gray/20 pb-2 overflow-x-auto">
          {[
            { id: 'active', label: 'Guild Board', count: availableMissions.filter(req => req.sender?._id !== user?._id).length },
            { id: 'accepted', label: 'My Missions', count: myMissions.filter(req => req.status !== 'delivered').length },
            { id: 'posted', label: 'My Requests', count: myPostedRequests.filter(req => req.status !== 'delivered').length },
            { id: 'completed', label: 'Archive', count: 0 } // Computed on filter
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-4 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id
                ? 'bg-white text-primary-teal border-t-2 border-x border-muted-gray/25 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
                }`}
            >
              {tab.label}
              {tab.id !== 'completed' && tab.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary-teal/15 text-primary-teal flex items-center justify-center text-[10px] font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {getDisplayRequests().length > 0 ? (
              getDisplayRequests().map(req => (
                <MissionCard key={req._id} request={req} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center glass-card border-dashed border-2 border-muted-gray/35 max-w-lg mx-auto w-full px-6"
              >
                <Package size={54} className="mx-auto text-text-placeholder opacity-60 mb-6 animate-float" />
                <h3 className="text-2xl font-black text-text-primary mb-3">Workspace empty</h3>
                <p className="text-sm text-text-secondary font-medium mb-6">
                  {activeTab === 'active' && 'No campus requests are currently available. Check back soon!'}
                  {activeTab === 'accepted' && 'You have not committed to any missions yet. Visit the Guild Board!'}
                  {activeTab === 'posted' && 'You haven’t posted any active delivery requests.'}
                  {activeTab === 'completed' && 'No completed historical deliveries found.'}
                </p>
                {activeTab === 'accepted' && (
                  <button
                    onClick={() => setActiveTab('active')}
                    className="btn-secondary text-xs uppercase tracking-widest py-3 px-6 cursor-pointer mx-auto"
                  >
                    View Active Missions
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Request Modal */}
        <NewMissionModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSuccess={fetchAllData}
        />

        {/* Live Chat Panel */}
        <AnimatePresence>
          {isChatOpen && selectedRequest && (
            <LiveChat
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              missionId={selectedRequest._id}
              missionTitle={selectedRequest.itemName}
            />
          )}
        </AnimatePresence>

        {/* OTP Modal */}
        <AnimatePresence>
          {isOtpModalOpen && selectedRequest && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOtpModalOpen(false)}
                className="absolute inset-0 bg-deep-teal/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-sm glass-card p-10 bg-white text-center z-10 border border-white"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent-cyan/20 text-primary-teal flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-black text-text-primary mb-3 leading-none">Verify Delivery</h2>
                <p className="text-xs text-text-secondary font-medium mb-6">Enter the 4-digit OTP provided by the receiver.</p>
                <input
                  type="text"
                  maxLength="4"
                  placeholder="0000"
                  className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 rounded-2xl bg-bg-alt border-2 border-muted-gray/20 focus:border-primary-teal outline-none transition-all mb-6 text-deep-teal"
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value)}
                />
                <button
                  onClick={() => handleStatusUpdate(selectedRequest._id, 'delivered', otpValue)}
                  className="btn-primary w-full py-4 text-sm font-black uppercase tracking-wider cursor-pointer"
                >
                  Verify & Unlock XP
                </button>
                <button
                  onClick={() => {
                    setIsOtpModalOpen(false);
                    setOtpValue('');
                  }}
                  className="w-full mt-3 py-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  Go Back
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default Deliveries;
