import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Package,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Heart,
  CheckCircle2,
  UserCheck,
  Trophy,
  Globe,
  MessageSquare,
  Clock,
  Compass,
  Smile,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-bg-main overflow-hidden font-sans selection:bg-accent-cyan/20">

      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="blur-blob bg-primary-teal w-[600px] h-[600px] -top-32 -left-32 animate-float" />
        <div className="blur-blob bg-accent-cyan w-[500px] h-[500px] top-1/2 -right-32 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Glass Navbar */}
      <nav className="glass-navbar">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-teal to-text-primary flex items-center justify-center text-white font-bold text-xl shadow-md">H</div>
          <span className="font-bold text-2xl tracking-tighter text-text-primary">Hand2Hand</span>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-text-muted font-medium text-sm uppercase tracking-wider">
          <div className="hover:text-primary-teal transition-colors">Features</div>
          <div className="hover:text-primary-teal transition-colors">How it works</div>
          <div className="hover:text-primary-teal transition-colors">Community</div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-text-secondary font-semibold hover:text-primary-teal transition-colors text-sm uppercase tracking-wider">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-32 lg:pt-48 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">

          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="mb-10 leading-[1.05]">
                Connect. Assist. <br />
                <span className="gradient-text">Deliver the Future.</span>
              </h1>

              <p className="text-xl text-text-secondary mb-14 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                A modern peer-to-peer assistance network designed for professional campus life. Build reputation, earn trust, and help your community thrive.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link to="/register" className="btn-primary h-14 px-10 text-lg shadow-2xl">
                  Join Network <ArrowRight size={20} />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-20 flex flex-wrap items-center justify-center lg:justify-start gap-10 opacity-70">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-primary-teal" />
                  <span className="font-semibold text-xs uppercase tracking-widest text-text-muted">ID Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary-teal" />
                  <span className="font-semibold text-xs uppercase tracking-widest text-text-muted">Secure OTP</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck size={20} className="text-primary-teal" />
                  <span className="font-semibold text-xs uppercase tracking-widest text-text-muted">Community Rated</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual Mockup */}
          <div className="flex-1 w-full max-w-2xl relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="glass-card p-10 bg-white/90 border-border-subtle relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-cyan/20 flex items-center justify-center text-primary-teal">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-placeholder">Active Request</p>
                      <p className="font-bold text-text-primary text-base">Science Equipment</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary-teal" />
                    <p className="text-sm font-medium text-text-secondary">Pickup: <span className="text-text-primary font-semibold">Central Library</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-muted-gray" />
                    <p className="text-sm font-medium text-text-secondary">Drop: <span className="text-text-primary font-semibold">Medical Block</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-bg-main/60 rounded-2xl border border-border-subtle">
                  <div className="flex items-center gap-3">
                    <Star size={20} className="text-primary-teal fill-primary-teal" />
                    <span className="font-bold text-sm text-text-primary">4.99 Rep Score</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ⭐ FEATURES SECTION */}
      <section id="features" className="py-32 relative z-10 border-t border-border-subtle bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-20"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-teal bg-accent-cyan/30 px-3.5 py-1.5 rounded-full">Core Capability</span>
            <h2 className="text-4xl font-bold text-text-primary mt-6 mb-4"> Why Choose Hand2Hand? </h2>
            <p className="text-lg text-text-secondary font-medium max-w-2xl mx-auto">Everything you need to deliver small items safely and build real peer-to-peer relationships.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: "Smart Route Matching",
                desc: "Automatically connects students traveling along similar routes for incredibly fast deliveries."
              },
              {
                icon: Shield,
                title: "OTP Verification",
                desc: "Ensure security at the handoff. Receiver shares a secure OTP to complete the transaction."
              },
              {
                icon: UserCheck,
                title: "Verified Students",
                desc: "Strictly limited to members with verified university email addresses for ultimate safety."
              },
              {
                icon: Clock,
                title: "Realtime Delivery Updates",
                desc: "Follow the journey in real-time. Know exactly when your item has been picked up."
              },
              {
                icon: Trophy,
                title: "Reputation & Trust Scores",
                desc: "Earn rating badges, unlock premium features, and build your campus trust profile."
              },
              {
                icon: Zap,
                title: "Fast Campus Assistance",
                desc: "Need lab notebooks, equipment, or snacks? Get it within minutes from active travelers."
              }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="glass-card p-8 bg-white/70 hover:bg-white/95 border-border-subtle flex flex-col gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-primary-teal shadow-inner">
                  <feat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{feat.title}</h3>
                  <p className="text-sm text-text-secondary font-medium leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙ HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-32 relative z-10 bg-bg-main/50">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-24"
          >
            <h2 className="text-4xl font-bold text-text-primary mt-6 mb-4">How it Works</h2>
            <p className="text-lg text-text-secondary font-medium max-w-xl mx-auto">Five simple, secure steps to exchange items and build authority.</p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-teal/20 via-primary-teal/40 to-primary-teal/10 -translate-x-1/2 hidden md:block" />

            <div className="space-y-16">
              {[
                {
                  step: "01",
                  title: "Create Request",
                  desc: "Post details about the item you need delivered, along with pick-up/drop-off locations and urgency level."
                },
                {
                  step: "02",
                  title: "Match With Travelers",
                  desc: "Students who are already walking or traveling along similar campus paths are instantly matched and notified."
                },
                {
                  step: "03",
                  title: "Accept & Deliver",
                  desc: "A verified traveler accepts the mission, collects the item, and starts their journey safely across campus."
                },
                {
                  step: "04",
                  title: "OTP Verification",
                  desc: "Secure end-to-end handoff. The receiver confirms by sharing an automatically generated OTP with the helper."
                },
                {
                  step: "05",
                  title: "Build Reputation",
                  desc: "Earn ratings, level up your profile badge, and earn trust points for every successful mission completed."
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  {...fadeInUp}
                  className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${idx % 2 === 0 ? "" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Step Card */}
                  <div className="flex-1 w-full">
                    <div className="glass-card p-8 bg-white/80 border-border-subtle relative hover:bg-white/95">
                      <span className="absolute top-4 right-6 text-3xl font-black text-primary-teal/10">{item.step}</span>
                      <h3 className="text-lg font-bold text-text-primary mb-3">{item.title}</h3>
                      <p className="text-sm text-text-secondary font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Icon Node */}
                  <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-text-primary text-white border-4 border-bg-main shadow-lg">
                    <span className="text-xs font-bold">{item.step}</span>
                  </div>

                  {/* Empty Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 COMMUNITY IMPACT SECTION */}
      <section id="community" className="py-32 relative z-10 bg-white/40 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left Column: Stats & Description */}
            <div className="flex-1">
              <motion.div {...fadeInUp}>
                <h2 className="text-4xl font-bold text-text-primary mt-6 mb-6">The Power of Community</h2>
                <p className="text-base text-text-secondary font-medium leading-relaxed mb-10">
                  Every shared trip is a step toward reducing carbon footprint and helping friends save time. Our student network is built entirely on trust, helping each other during daily schedules.
                </p>

                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: "Active Students", value: "2,500+" },
                    { label: "Successful Deliveries", value: "10,000+" },
                    { label: "Safe Handoffs", value: "98.9%" },
                    { label: "Community Rating", value: "4.92" }
                  ].map((stat, idx) => (
                    <div key={idx} className="border-l-2 border-primary-teal/30 pl-4">
                      <h4 className="text-2xl font-bold text-text-primary mb-1">{stat.value}</h4>
                      <p className="text-xs font-bold text-text-placeholder uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Visual Callouts */}
            <div className="flex-1 w-full">
              <motion.div
                {...fadeInUp}
                className="space-y-6"
              >
                {[
                  {
                    icon: Heart,
                    title: "Helping Culture",
                    desc: "It feels good to help. Earn trust points and campus-wide recognition by making simple deliveries."
                  },
                  {
                    icon: Globe,
                    title: "Eco-Friendly Logistics",
                    desc: "Leveraging existing walks and travel routes eliminates additional carbon emissions."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="glass-card p-8 bg-white/70 border-border-subtle flex gap-6 hover:bg-white/95">
                    <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-primary-teal shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-text-primary mb-2">{item.title}</h4>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 🗣 TESTIMONIAL SECTION */}
      <section className="py-32 bg-bg-main/30 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-text-primary mt-6 mb-4">Loved by Verified Students</h2>
            <p className="text-lg text-text-secondary font-medium max-w-xl mx-auto">Real campus feedback from students active in the community.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Rivera",
                dept: "Computer Science",
                avatar: "A",
                feedback: "Helped me receive lab materials before class in under 15 minutes. Incredibly reliable network!"
              },
              {
                name: "Sarah Chen",
                dept: "Biochemistry",
                avatar: "S",
                feedback: "I deliver snacks during my walks back to the dorm. It's so easy to build trust and make new friends."
              },
              {
                name: "Mike Ross",
                dept: "Business Admin",
                avatar: "M",
                feedback: "Perfect solution when you need something urgently but are locked in back-to-back study sessions."
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 bg-white/80 border-border-subtle flex flex-col justify-between min-h-[220px]"
              >
                <p className="text-sm text-text-secondary italic font-medium leading-relaxed mb-6">"{t.feedback}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-text-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">{t.avatar}</div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{t.name}</h4>
                    <p className="text-[10px] text-text-placeholder font-bold uppercase tracking-widest">{t.dept}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 FINAL CTA SECTION */}
      <section className="py-32 relative z-10">
        <div className="max-w-5xl mx-auto px-8">
          <motion.div
            {...fadeInUp}
            className="rounded-[3rem] bg-text-primary p-16 lg:p-24 text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-teal/10 blur-[100px] rounded-full" />
            <h2 className="text-white text-5xl mb-10 leading-tight">Start Helping Your <br /> Campus Today</h2>
            <p className="text-white/70 text-xl mb-14 font-medium max-w-2xl mx-auto">Join thousands of students building a more connected, collaborative campus.</p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register" className="inline-flex h-14 items-center px-10 bg-white text-text-primary text-base font-bold rounded-xl hover:bg-bg-main transition-all shadow-lg shadow-white/5">
                Join Network
              </Link>
              <Link to="/login" className="inline-flex h-14 items-center px-10 border border-white/20 text-white text-base font-bold rounded-xl hover:bg-white/10 transition-all">
                Explore Requests
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border-subtle bg-white/60 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-text-primary flex items-center justify-center text-white font-bold text-xl shadow-md">H</div>
            <span className="font-bold text-2xl tracking-tighter text-text-primary">Hand2Hand</span>
          </div>
          <p className="text-text-placeholder font-bold text-xs tracking-widest uppercase">© 2026 Hand2Hand Network. Modern Campus Assistance.</p>
          <div className="flex gap-12">
            {['Privacy', 'Terms', 'Support'].map(link => (
              <a key={link} href="#" className="text-text-placeholder font-bold text-xs uppercase tracking-widest hover:text-primary-teal transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
