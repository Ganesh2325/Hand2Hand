import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, IdCard, GraduationCap, Loader2, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Access keys must match.');
    }
    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Account created. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error('Identity creation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 selection:bg-accent-cyan/20 relative overflow-hidden">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="blur-blob bg-primary-teal w-[400px] h-[400px] -top-20 -right-20" />
        <div className="blur-blob bg-muted-gray w-[400px] h-[400px] -bottom-20 -left-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[520px]"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary-teal transition-all font-bold uppercase text-[11px] tracking-widest mb-8">
          <ArrowLeft size={16} /> Return to Home
        </Link>

        <div className="glass-card p-10 bg-white border-border-subtle shadow-2xl relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-2xl mb-1.5 text-text-primary">Create Account</h2>
            <p className="text-sm text-text-secondary font-medium">Join the professional campus assistance network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <input
                    name="name" type="text" required placeholder="User Name"
                    className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                    value={formData.name} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider ml-1">Student ID</label>
                <div className="relative group">
                  <input
                    name="studentId" type="text" required placeholder="Reg No."
                    className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                    value={formData.studentId} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider ml-1">College Email</label>
              <div className="relative group">
                <input
                  name="email" type="email" required placeholder="example@lpu.in"
                  className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                  value={formData.email} onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider ml-1">Department</label>
              <div className="relative group">
                <input
                  name="department" type="text" required placeholder="e.g. Computer Science"
                  className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                  value={formData.department} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <input
                    name="password" type="password" required placeholder="Password"
                    className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#5B767B] uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative group">
                  <input
                    name="confirmPassword" type="password" required placeholder="Confirm Password"
                    className="input-field h-11 text-sm rounded-xl bg-white/80 border-[#D7E6E8] text-[#0B2E33]"
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="btn-primary w-full h-11 text-sm font-bold mt-4 shadow-xl shadow-primary-teal/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (
                <>Create account</>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-text-secondary font-medium">
            Already verified? {' '}
            <Link to="/login" className="text-primary-teal font-bold hover:underline underline-offset-4 decoration-2">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
