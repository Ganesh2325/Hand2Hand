import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Package,
  Trophy,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  Settings,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Travel', icon: MapPin, path: '/travel' },
    { name: 'Missions', icon: Package, path: '/requests' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-bg-main selection:bg-accent-cyan/20">

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col p-6 border-r border-border-subtle bg-white z-50">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-text-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">H</div>
          <span className="font-bold text-xl tracking-tight text-text-primary">Hand2Hand</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all duration-200 ${location.pathname === item.path
                  ? 'bg-primary-teal text-white shadow-md translate-x-1'
                  : 'text-text-muted hover:bg-bg-alt hover:text-text-primary'
                }`}
            >
              <item.icon size={16} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 mt-6 border-t border-border-subtle space-y-4">
          <div className="p-3 rounded-xl bg-bg-alt border border-border-subtle flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-text-primary shadow-sm flex items-center justify-center text-white font-bold text-sm uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-text-primary truncate">{user?.name?.split(' ')[0]}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-rose-600 font-bold text-[11px] uppercase tracking-widest hover:bg-rose-50 transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-[100]">
        <button
          onClick={toggleSidebar}
          className="w-11 h-11 rounded-xl bg-text-primary shadow-lg flex items-center justify-center text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-6 py-8 lg:px-12 lg:py-10">
        <div className="max-w-6xl mx-auto pb-16">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-[80] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[90] p-8 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-lg bg-text-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">H</div>
                <span className="font-bold text-xl tracking-tight text-text-primary">Hand2Hand</span>
              </div>

              <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider transition-all ${location.pathname === item.path
                        ? 'bg-primary-teal text-white shadow-md translate-x-1'
                        : 'text-text-muted'
                      }`}
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="pt-6 mt-6 border-t border-border-subtle">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-rose-600 font-bold text-[11px] uppercase tracking-widest"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
