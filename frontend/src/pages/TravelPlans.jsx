import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Sparkles,
  GraduationCap,
  HeartPulse,
  Utensils,
  Home,
  LogOut,
  Navigation,
  ArrowRight,
  Star
} from 'lucide-react';
import NewMissionModal from '../components/NewMissionModal';

const CAMPUS_PLACES = [
  { name: 'Building 1 Fashion Block', category: 'Academic', desc: 'Fashion and design hub. Creative zones.', icon: GraduationCap, nearby: ['Business Block', 'Uni Mall', 'Food Buzz'], activeRoutes: 4 },
  { name: 'Business Block', category: 'Academic', desc: 'Management studies and seminar halls.', icon: GraduationCap, nearby: ['Building 1 Fashion Block', 'Robo Park'], activeRoutes: 3 },
  { name: 'Pharmacy Block', category: 'Academic', desc: 'Pharmaceutical labs and classrooms.', icon: GraduationCap, nearby: ['Hospital', 'Robo Park'], activeRoutes: 2 },
  { name: 'Robo Park', category: 'Academic', desc: 'Robotics lab, research centers, tech block.', icon: GraduationCap, nearby: ['Pharmacy Block', 'Business Block'], activeRoutes: 5 },
  { name: 'Uni Auditorium', category: 'Academic', desc: 'Grand hall for campus events and conferences.', icon: GraduationCap, nearby: ['Main Gate', 'Unipolis'], activeRoutes: 3 },
  { name: 'Hospital', category: 'Health', desc: '24/7 medical care and emergency services.', icon: HeartPulse, nearby: ['Pharmacy Block', 'Food Stalls Near Hospital'], activeRoutes: 6 },
  { name: 'Food Stalls Near Hospital', category: 'Food', desc: 'Quick snacks, juices, and tea stalls.', icon: Utensils, nearby: ['Hospital', 'Pharmacy Block'], activeRoutes: 3 },
  { name: 'GH-1', category: 'Hostels', desc: 'Girls Hostel 1, near campus shopping area.', icon: Home, nearby: ['GH-2', 'Uni Mall'], activeRoutes: 2 },
  { name: 'GH-2', category: 'Hostels', desc: 'Girls Hostel 2, quiet Residential zone.', icon: Home, nearby: ['GH-1', 'GH-3'], activeRoutes: 1 },
  { name: 'GH-3', category: 'Hostels', desc: 'Girls Hostel 3, right next to Unipolis.', icon: Home, nearby: ['GH-2', 'GH-4', 'Unipolis'], activeRoutes: 3 },
  { name: 'GH-4', category: 'Hostels', desc: 'Girls Hostel 4, central hostel park area.', icon: Home, nearby: ['GH-3', 'GH-5'], activeRoutes: 2 },
  { name: 'GH-5', category: 'Hostels', desc: 'Girls Hostel 5, close to pharmacy block.', icon: Home, nearby: ['GH-4', 'GH-6'], activeRoutes: 1 },
  { name: 'GH-6', category: 'Hostels', desc: 'Girls Hostel 6, near main gate exit.', icon: Home, nearby: ['GH-5', 'Main Gate'], activeRoutes: 2 },
  { name: 'BH-1', category: 'Hostels', desc: 'Boys Hostel 1, features indoor games arena.', icon: Home, nearby: ['BH-2', 'Food Stalls Near BH-1'], activeRoutes: 2 },
  { name: 'BH-2', category: 'Hostels', desc: 'Boys Hostel 2, vibrant hostel culture.', icon: Home, nearby: ['BH-1', 'BH-3'], activeRoutes: 1 },
  { name: 'BH-3', category: 'Hostels', desc: 'Boys Hostel 3, right behind Uni Mall.', icon: Home, nearby: ['BH-2', 'BH-4', 'Uni Mall'], activeRoutes: 4 },
  { name: 'BH-4', category: 'Hostels', desc: 'Boys Hostel 4, lush green garden layout.', icon: Home, nearby: ['BH-3', 'BH-5'], activeRoutes: 1 },
  { name: 'BH-5', category: 'Hostels', desc: 'Boys Hostel 5, bustling student hub.', icon: Home, nearby: ['BH-4', 'BH-6', 'Unipolis'], activeRoutes: 5 },
  { name: 'BH-6', category: 'Hostels', desc: 'Boys Hostel 6, close to sports grounds.', icon: Home, nearby: ['BH-5', 'BH-7'], activeRoutes: 2 },
  { name: 'BH-7', category: 'Hostels', desc: 'Boys Hostel 7, quiet academic atmosphere.', icon: Home, nearby: ['BH-6', 'BH-8'], activeRoutes: 1 },
  { name: 'BH-8', category: 'Hostels', desc: 'Boys Hostel 8, modern building amenities.', icon: Home, nearby: ['BH-7', 'BH-9'], activeRoutes: 2 },
  { name: 'BH-9', category: 'Hostels', desc: 'Boys Hostel 9, close to apartment stalls.', icon: Home, nearby: ['BH-8', 'BH-10'], activeRoutes: 1 },
  { name: 'BH-10', category: 'Hostels', desc: 'Boys Hostel 10, residential apartments.', icon: Home, nearby: ['BH-9', 'Food Stalls Near Apartment'], activeRoutes: 3 },
  { name: 'Food Buzz', category: 'Food', desc: 'Popular student cafe and dessert bar.', icon: Utensils, nearby: ['Building 1 Fashion Block', 'Uni Mall'], activeRoutes: 5 },
  { name: 'Uni Mall', category: 'Social', desc: 'Multi-story shopping complex and food court.', icon: Sparkles, nearby: ['Food Buzz', 'GH-1', 'BH-3', 'Unipolis'], activeRoutes: 12 },
  { name: 'Unipolis', category: 'Social', desc: 'Huge open plaza for student meetups and live acts.', icon: Sparkles, nearby: ['Uni Mall', 'GH-3', 'BH-5', 'Uni Auditorium'], activeRoutes: 8 },
  { name: 'Food Stalls Near Apartment', category: 'Food', desc: 'Local student cuisine and late night tea.', icon: Utensils, nearby: ['BH-10', 'Main Gate'], activeRoutes: 3 },
  { name: 'Food Stalls Near BH-1', category: 'Food', desc: 'Snack corner, burgers, and hot milk.', icon: Utensils, nearby: ['BH-1', 'BH-2'], activeRoutes: 4 },
  { name: 'Main Gate', category: 'Entry', desc: 'Primary entry and transit point of the campus.', icon: LogOut, nearby: ['GH-6', 'Food Stalls Near Apartment', 'Uni Auditorium'], activeRoutes: 15 }
];

const TravelPlans = () => {
  const [plans, setPlans] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Academic');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/travel');
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching travel plans', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-10 max-w-7xl mx-auto">
        
        {/* Header Hero - High Visibility Text */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gradient-to-r from-deep-teal to-primary-teal p-8 md:p-12 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 mb-4">
              <Sparkles size={12} className="text-accent-cyan animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan">Campus Route Network v2.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight text-white">
              Smart Campus Route Explorer
            </h1>
            <p className="text-sm md:text-base text-white/90 font-medium">
              Seamless college navigation. Broadcast your walking path or explore categorized student hotspots, hostels, and cafes across campus.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-8 py-5 h-auto text-sm tracking-wider uppercase font-black bg-white text-deep-teal border-none hover:bg-accent-cyan hover:text-deep-teal transition-all shadow-lg shrink-0 flex items-center gap-2 self-start lg:self-auto"
          >
            <Plus size={18} /> Post Delivery Request
          </button>
        </div>

        {/* Dashboard Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Active Routes Feed */}
          <div className="lg:col-span-2 space-y-10">
            
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-text-primary tracking-tight">
                  🌐 Active Campus Routes Board ({plans.length})
                </h3>
                <span className="px-3 py-1 rounded-full bg-deep-teal/10 text-deep-teal border border-deep-teal/20 text-[10px] font-bold uppercase tracking-widest">
                  Live Broadcasts
                </span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 4].map(i => (
                    <div key={i} className="glass-card h-48 animate-pulse bg-slate-100/50" />
                  ))}
                </div>
              ) : plans.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {plans.map((plan, i) => (
                    <motion.div
                      key={plan._id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-6 border border-white bg-white/95 hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary-teal/5 rounded-bl-[2rem] group-hover:scale-110 transition-transform" />
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-deep-teal flex items-center justify-center text-white font-black text-sm">
                          {plan.traveler?.name[0] || 'C'}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-text-primary leading-tight">{plan.traveler?.name}</h4>
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star size={10} fill="currentColor" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{plan.traveler?.trustScore || 100} Trust</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-teal ring-4 ring-primary-teal/10 shrink-0" />
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider shrink-0 w-8">From:</span>
                          <span className="text-xs font-black text-text-primary truncate">{plan.startLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan ring-4 ring-accent-cyan/10 shrink-0" />
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider shrink-0 w-8">To:</span>
                          <span className="text-xs font-black text-text-primary truncate">{plan.destination}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] font-bold text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-primary-teal" />
                          <span>{new Date(plan.dateTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-bg-alt px-2.5 py-1 rounded-md">
                          <Navigation size={12} className="text-deep-teal" />
                          <span>{plan.capacity}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-16 text-center border-dashed border-2 bg-white/60">
                  <Navigation className="mx-auto text-text-placeholder mb-6" size={48} />
                  <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">No Route Plans Active</h3>
                  <p className="text-sm text-text-secondary font-medium max-w-sm mx-auto">
                    There are no active travel routes posted right now. Be the first to let the campus know where you are walking today!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Campus Explorer */}
          <div className="space-y-10">
            
            <section className="space-y-6">
              <h3 className="text-2xl font-black text-text-primary tracking-tight">
                📍 Campus Explorer
              </h3>

              <div className="glass-card p-6 border border-white bg-white/95 space-y-6">
                
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
                  {[
                    { key: 'Academic', icon: GraduationCap, label: 'Academic' },
                    { key: 'Health', icon: HeartPulse, label: 'Health' },
                    { key: 'Food', icon: Utensils, label: 'Food' },
                    { key: 'Hostels', icon: Home, label: 'Hostels' },
                    { key: 'Social', icon: Sparkles, label: 'Social' }
                  ].map(cat => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                          isActive 
                            ? 'bg-deep-teal border-deep-teal text-white shadow-md' 
                            : 'bg-white border-muted-gray/20 text-text-secondary hover:border-muted-gray'
                        }`}
                      >
                        <Icon size={12} />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Locations Explorer List */}
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                  {CAMPUS_PLACES.filter(place => place.category === activeCategory).map((place, idx) => {
                    const Icon = place.icon;
                    return (
                      <div 
                        key={idx} 
                        className="p-4 rounded-2xl bg-bg-alt/50 border border-muted-gray/10 hover:border-primary-teal/20 hover:bg-white hover:shadow-sm transition-all duration-300 space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary-teal border border-muted-gray/15">
                              <Icon size={16} />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-text-primary leading-tight group-hover:text-primary-teal transition-colors">
                                {place.name}
                              </h4>
                              <span className="text-[9px] font-bold text-text-placeholder uppercase">
                                {place.category}
                              </span>
                            </div>
                          </div>
                          
                          <span className="px-2 py-0.5 rounded bg-primary-teal/10 text-primary-teal text-[8px] font-black uppercase border border-primary-teal/20">
                            {place.activeRoutes} Routes
                          </span>
                        </div>

                        <p className="text-[11px] text-text-secondary font-medium leading-relaxed">
                          {place.desc}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-dashed border-muted-gray/15">
                          <span className="text-[8px] font-black text-text-placeholder uppercase tracking-wider">Nearby:</span>
                          {place.nearby.map((n, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-bold text-text-muted bg-white px-2 py-0.5 rounded border border-muted-gray/10"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
            
          </div>
        </div>

        {/* Route creation modal */}
        <NewMissionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchPlans} 
        />
      </div>
    </MainLayout>
  );
};

export default TravelPlans;
