import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSuccess: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSkip, onSuccess }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginInstead, setShowLoginInstead] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 3, text: 'Good', color: 'bg-blue-500' };
    return { strength: 4, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  if (showLoginInstead) {
    return (
      <AnimatePresence>
        {isOpen && (
          <LoginModal
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={onSuccess}
            onSignupInstead={() => setShowLoginInstead(false)}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Create Your Account</h2>
            <p className="text-gray-400 mb-6">
              Save your progress and access your results anytime
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="At least 8 characters"
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength * 25}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{passwordStrength.text}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              <button
                onClick={onSkip}
                className="w-full bg-gray-800 text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Skip for Now
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Note: Without an account, your progress and results will not be saved
              </p>

              <div className="text-center">
                <button
                  onClick={() => setShowLoginInstead(true)}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Login Modal Component (in the same file for now)
const LoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSignupInstead: () => void;
}> = ({ isOpen, onClose, onSuccess, onSignupInstead }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Welcome Back</h2>
        <p className="text-gray-400 mb-6">
          Sign in to continue your assessment or view your results
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              placeholder="Your password"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-purple-400 hover:text-purple-300 text-sm mb-4 block">
            Forgot your password?
          </button>
          
          <button
            onClick={onSignupInstead}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignupModal;