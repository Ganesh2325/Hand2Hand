import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck, UserCheck, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Authenticated.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 selection:bg-accent-cyan/20 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="blur-blob bg-primary-teal w-[400px] h-[400px] -top-20 -left-20" />
        <div className="blur-blob bg-accent-cyan w-[400px] h-[400px] -bottom-20 -right-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary-teal transition-all font-bold uppercase text-[11px] tracking-widest mb-8">
          <ArrowLeft size={16} /> Return to Home
        </Link>

        <div className="glass-card p-8 bg-white border-border-subtle shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl mb-1.5 text-text-primary">Login to your Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider">Password</label>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="btn-primary w-full h-11 text-sm font-bold mt-2 shadow-xl shadow-primary-teal/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (
                <>Sign In</>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-text-secondary font-medium">
            New to Hand2Hand? {' '}
            <Link to="/register" className="text-primary-teal font-bold hover:underline underline-offset-4 decoration-2">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
