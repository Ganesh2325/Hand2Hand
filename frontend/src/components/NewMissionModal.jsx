import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package, ShieldCheck, MapPin, AlertCircle, Clock, Gift, Globe, FileText, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CAMPUS_PLACES = [
  { name: 'Building 1 Fashion Block', category: 'Academic' },
  { name: 'Business Block', category: 'Academic' },
  { name: 'Pharmacy Block', category: 'Academic' },
  { name: 'Robo Park', category: 'Academic' },
  { name: 'Uni Auditorium', category: 'Academic' },
  { name: 'Hospital', category: 'Health' },
  { name: 'Food Stalls Near Hospital', category: 'Food' },
  { name: 'GH-1', category: 'Hostels' },
  { name: 'GH-2', category: 'Hostels' },
  { name: 'GH-3', category: 'Hostels' },
  { name: 'GH-4', category: 'Hostels' },
  { name: 'GH-5', category: 'Hostels' },
  { name: 'GH-6', category: 'Hostels' },
  { name: 'BH-1', category: 'Hostels' },
  { name: 'BH-2', category: 'Hostels' },
  { name: 'BH-3', category: 'Hostels' },
  { name: 'BH-4', category: 'Hostels' },
  { name: 'BH-5', category: 'Hostels' },
  { name: 'BH-6', category: 'Hostels' },
  { name: 'BH-7', category: 'Hostels' },
  { name: 'BH-8', category: 'Hostels' },
  { name: 'BH-9', category: 'Hostels' },
  { name: 'BH-10', category: 'Hostels' },
  { name: 'Food Buzz', category: 'Food' },
  { name: 'Uni Mall', category: 'Social' },
  { name: 'Unipolis', category: 'Social' },
  { name: 'Food Stalls Near Apartment', category: 'Food' },
  { name: 'Food Stalls Near BH-1', category: 'Food' },
  { name: 'Main Gate', category: 'Entry' }
];

const NewMissionModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    pickupLocation: '',
    dropLocation: '',
    parcelType: 'Others',
    urgency: 'Normal',
    rewardPoints: 100,
    description: '',
    expectedDeliveryTime: '',
    routeVisibility: 'Public',
    itemImage: ''
  });

  const [pickupSearch, setPickupSearch] = useState('');
  const [dropSearch, setDropSearch] = useState('');
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUrgencyChange = (urgency) => {
    setFormData((prev) => ({ ...prev, urgency }));
  };

  const handlePointsChange = (rewardPoints) => {
    setFormData((prev) => ({ ...prev, rewardPoints: Number(rewardPoints) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/requests/create', formData);
      toast.success('Mission broadcasted to the campus feed! 🎉');
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        itemName: '',
        pickupLocation: '',
        dropLocation: '',
        parcelType: 'Others',
        urgency: 'Normal',
        rewardPoints: 100,
        description: '',
        expectedDeliveryTime: '',
        routeVisibility: 'Public',
        itemImage: ''
      });
      setPickupSearch('');
      setDropSearch('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post mission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-deep-teal/40 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white/95 rounded-3xl border border-white/60 shadow-2xl p-8 md:p-10 overflow-hidden z-10 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-muted-gray/20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/35 flex items-center justify-center text-primary-teal">
              <Package size={26} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-text-primary tracking-tight leading-none mb-1">Post New Mission</h2>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Broadcast task to campus runners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-bg-alt flex items-center justify-center text-text-muted hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Item name</label>
              <div className="relative">
                <input
                  required
                  name="itemName"
                  type="text"
                  placeholder="e.g. Lab Kit, Laptop Charger"
                  className="input-field"
                  value={formData.itemName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Parcel Type</label>
              <select
                name="parcelType"
                className="input-field appearance-none"
                value={formData.parcelType}
                onChange={handleChange}
              >
                <option>Documents</option>
                <option>Food</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Essentials</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Pickup location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  required
                  type="text"
                  placeholder="Select pickup place..."
                  className="input-field pl-12"
                  value={pickupSearch}
                  onChange={e => {
                    setPickupSearch(e.target.value);
                    setFormData(prev => ({ ...prev, pickupLocation: e.target.value }));
                    setShowPickupList(true);
                  }}
                  onFocus={() => setShowPickupList(true)}
                  onBlur={() => setTimeout(() => setShowPickupList(false), 200)}
                />
              </div>
              {showPickupList && (
                <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto glass-card bg-white border border-muted-gray/20 shadow-xl rounded-xl py-2 custom-scrollbar">
                  {CAMPUS_PLACES.filter(place => 
                    place.name.toLowerCase().includes(pickupSearch.toLowerCase()) || 
                    place.category.toLowerCase().includes(pickupSearch.toLowerCase())
                  ).length > 0 ? (
                    CAMPUS_PLACES.filter(place => 
                      place.name.toLowerCase().includes(pickupSearch.toLowerCase()) || 
                      place.category.toLowerCase().includes(pickupSearch.toLowerCase())
                    ).map(place => (
                      <button
                        key={place.name}
                        type="button"
                        onClick={() => {
                          setPickupSearch(place.name);
                          setFormData(prev => ({ ...prev, pickupLocation: place.name }));
                          setShowPickupList(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[11px] font-bold text-text-primary hover:bg-primary-teal/10 hover:text-primary-teal transition-all flex items-center gap-2"
                      >
                        <span className="text-[9px] uppercase font-black tracking-widest text-text-placeholder px-1.5 py-0.5 rounded bg-bg-alt shrink-0 border border-muted-gray/10">
                          {place.category}
                        </span>
                        {place.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-text-placeholder italic font-medium">No campus places found</div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Drop Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  required
                  type="text"
                  placeholder="Select drop place..."
                  className="input-field pl-12"
                  value={dropSearch}
                  onChange={e => {
                    setDropSearch(e.target.value);
                    setFormData(prev => ({ ...prev, dropLocation: e.target.value }));
                    setShowDropList(true);
                  }}
                  onFocus={() => setShowDropList(true)}
                  onBlur={() => setTimeout(() => setShowDropList(false), 200)}
                />
              </div>
              {showDropList && (
                <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto glass-card bg-white border border-muted-gray/20 shadow-xl rounded-xl py-2 custom-scrollbar">
                  {CAMPUS_PLACES.filter(place => 
                    place.name.toLowerCase().includes(dropSearch.toLowerCase()) || 
                    place.category.toLowerCase().includes(dropSearch.toLowerCase())
                  ).length > 0 ? (
                    CAMPUS_PLACES.filter(place => 
                      place.name.toLowerCase().includes(dropSearch.toLowerCase()) || 
                      place.category.toLowerCase().includes(dropSearch.toLowerCase())
                    ).map(place => (
                      <button
                        key={place.name}
                        type="button"
                        onClick={() => {
                          setDropSearch(place.name);
                          setFormData(prev => ({ ...prev, dropLocation: place.name }));
                          setShowDropList(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[11px] font-bold text-text-primary hover:bg-primary-teal/10 hover:text-primary-teal transition-all flex items-center gap-2"
                      >
                        <span className="text-[9px] uppercase font-black tracking-widest text-text-placeholder px-1.5 py-0.5 rounded bg-bg-alt shrink-0 border border-muted-gray/10">
                          {place.category}
                        </span>
                        {place.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-text-placeholder italic font-medium">No campus places found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Urgency and Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgency Level */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Urgency Level</label>
              <div className="flex gap-3">
                {['Normal', 'Important', 'Emergency'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleUrgencyChange(level)}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${formData.urgency === level
                      ? level === 'Emergency'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10'
                        : 'bg-primary-teal text-white border-primary-teal shadow-md shadow-primary-teal/10'
                      : 'bg-white text-text-secondary border-muted-gray/30 hover:border-muted-gray'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Reward Points */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Reward Points</label>
              <div className="flex gap-3">
                {[100, 250, 500].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => handlePointsChange(pts)}
                    className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${formData.rewardPoints === pts
                      ? 'bg-deep-teal text-white border-deep-teal shadow-md'
                      : 'bg-white text-text-secondary border-muted-gray/30 hover:border-muted-gray'
                      }`}
                  >
                    +{pts} pts
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ETA & Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Expected Delivery Time</label>
              <div className="relative">
                <input
                  name="expectedDeliveryTime"
                  type="text"
                  placeholder="e.g. Within 30 mins, Before 5 PM"
                  className="input-field"
                  value={formData.expectedDeliveryTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Route Visibility</label>
              <select
                name="routeVisibility"
                className="input-field appearance-none"
                value={formData.routeVisibility}
                onChange={handleChange}
              >
                <option>Public</option>
                <option>Campus Only</option>
              </select>
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Delivery Notes</label>
            <textarea
              name="description"
              rows={3}
              placeholder="e.g. Please handle carefully..."
              className="w-full px-4 py-3 rounded-xl border border-muted-gray/30 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none transition-all text-sm font-medium text-text-primary placeholder:text-text-placeholder resize-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn-primary w-full py-6 text-base font-black tracking-widest uppercase mt-4 group"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Broadcast Mission Request{' '}
                <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default NewMissionModal;
