import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate('/');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const accountBenefits = [
    { icon: '💾', text: 'Save your progress and continue later' },
    { icon: '📊', text: 'Access your results anytime' },
    { icon: '📈', text: 'Track your personality development over time' },
    { icon: '🔓', text: 'Unlock future assessment types' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center lg:text-left mb-8">
                <Link to="/" className="inline-block mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 text-charcoal-600 hover:text-charcoal-800 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm">Back to Home</span>
                  </motion.div>
                </Link>
                
                <h1 className="font-serif text-4xl lg:text-5xl text-charcoal-800 mb-4">
                  {isSignUp ? (
                    <>Create Your <em>Account</em></>
                  ) : (
                    <>Welcome <em>Back</em></>
                  )}
                </h1>
                <p className="text-lg text-charcoal-600">
                  {isSignUp ? (
                    'Join thousands discovering their true selves'
                  ) : (
                    'Continue your journey of self-discovery'
                  )}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-charcoal-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-charcoal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-charcoal-700 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-charcoal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    
                    {isSignUp && password && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-charcoal-600">Password strength:</span>
                          <span className={`font-medium ${
                            passwordStrength.score === 1 ? 'text-red-600' :
                            passwordStrength.score === 2 ? 'text-yellow-600' :
                            passwordStrength.score === 3 ? 'text-blue-600' :
                            'text-green-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-charcoal-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.score * 25}%` }}
                            transition={{ duration: 0.3 }}
                            className={`h-full ${
                              passwordStrength.score === 1 ? 'bg-red-500' :
                              passwordStrength.score === 2 ? 'bg-yellow-500' :
                              passwordStrength.score === 3 ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {isSignUp && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-charcoal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Log In')}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-charcoal-600 hover:text-charcoal-800 text-sm transition-colors"
                  >
                    {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/" className="text-charcoal-500 hover:text-charcoal-700 text-sm transition-colors">
                    Continue without account →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right side - Benefits/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              {isSignUp ? (
                <div className="bg-yellow-500 rounded-3xl p-10">
                  <h3 className="font-serif text-2xl text-charcoal-800 mb-8 italic">
                    Why Create an Account?
                  </h3>
                  <div className="space-y-4">
                    {accountBenefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <span className="text-2xl">{benefit.icon}</span>
                        <p className="text-charcoal-700 flex-1">{benefit.text}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Decorative element */}
                  <div className="mt-10 flex justify-center">
                    <svg viewBox="0 0 200 200" className="w-32 h-32" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#1A1A1A" strokeWidth="2" fill="none">
                        <circle cx="100" cy="100" r="80" strokeDasharray="5,5" opacity="0.3" />
                        <circle cx="100" cy="100" r="60" />
                        <circle cx="100" cy="100" r="40" strokeDasharray="3,3" opacity="0.5" />
                        <circle cx="100" cy="100" r="20" fill="#1A1A1A" />
                      </g>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-charcoal-50 rounded-3xl p-10 relative">
                  <h3 className="font-serif text-2xl text-charcoal-800 mb-4 italic">
                    Continue Your Journey
                  </h3>
                  <p className="text-charcoal-600 mb-8">
                    Pick up where you left off and dive deeper into understanding yourself.
                  </p>
                  
                  {/* Illustration */}
                  <div className="relative">
                    <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#1A1A1A" strokeWidth="2" fill="none">
                        {/* Journey path */}
                        <path d="M50 250 Q100 200 150 150 T250 50" strokeDasharray="5,5" opacity="0.3" />
                        
                        {/* Milestone circles */}
                        <circle cx="50" cy="250" r="10" fill="#F5D659" />
                        <circle cx="100" cy="200" r="8" fill="#1A1A1A" />
                        <circle cx="150" cy="150" r="12" fill="#F5D659" />
                        <circle cx="200" cy="100" r="8" fill="#1A1A1A" />
                        <circle cx="250" cy="50" r="15" strokeWidth="3" />
                        
                        {/* Person icon at current position */}
                        <g transform="translate(150, 150)">
                          <circle cx="0" cy="-10" r="6" fill="#1A1A1A" />
                          <path d="M0 -4 L0 10" />
                          <path d="M0 0 L-8 8 M0 0 L8 8" />
                          <path d="M0 10 L-6 20 M0 10 L6 20" />
                        </g>
                        
                        {/* Stars */}
                        <path d="M80 80 L82 88 L90 86 L84 92 L90 98 L82 96 L80 104 L78 96 L70 98 L76 92 L70 86 L78 88 Z" fill="#F5D659" opacity="0.5" />
                        <path d="M220 180 L221 184 L225 183 L222 186 L225 189 L221 188 L220 192 L219 188 L215 189 L218 186 L215 183 L219 184 Z" fill="#1A1A1A" />
                      </g>
                    </svg>
                  </div>
                  
                  {/* Stats */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="font-serif text-3xl text-charcoal-800">93%</div>
                      <div className="text-sm text-charcoal-600">accuracy rate</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="font-serif text-3xl text-charcoal-800">1M+</div>
                      <div className="text-sm text-charcoal-600">insights delivered</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Login;