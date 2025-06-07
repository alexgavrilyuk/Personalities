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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white flex items-center justify-center px-4 pt-16"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              
              {isSignUp && password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score === 1 ? 'text-red-400' :
                      passwordStrength.score === 2 ? 'text-yellow-400' :
                      passwordStrength.score === 3 ? 'text-blue-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.score * 25}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-400 hover:text-gray-300 text-sm">
              Continue without account →
            </Link>
          </div>

          {isSignUp && (
            <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Why create an account?</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Save your progress and continue later</li>
                <li>• Access your results anytime</li>
                <li>• Track your personality development over time</li>
                <li>• Unlock future assessment types</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;