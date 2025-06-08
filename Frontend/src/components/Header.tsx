import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' },
    ...(user ? [
      { name: 'My Profile', path: '/profile' },
      { name: 'Account', path: '/account' }
    ] : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-dark-900 rounded-xl flex items-center justify-center">
              <span className="text-lime-400 font-bold text-xl">P</span>
            </div>
            <span className="text-dark-900 font-bold text-xl">PersonalityTest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'text-dark-900'
                    : 'text-gray-600 hover:text-dark-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-dark-900 text-sm font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 bg-dark-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-dark-800 transition-colors"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-dark-900 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-lime-50 text-dark-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-dark-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="px-3 py-2 text-sm text-gray-600">
                  Signed in as {user.email}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mx-3 my-2 bg-dark-900 text-white px-4 py-2 rounded-full text-center font-semibold"
                >
                  Log In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;