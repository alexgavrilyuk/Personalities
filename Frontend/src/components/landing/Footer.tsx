import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-800 text-white">
      <div className="container mx-auto px-6 lg:px-16 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-4">Personalities</h3>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-charcoal-700 hover:bg-yellow-500 hover:text-charcoal-800 transition-all flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-charcoal-700 hover:bg-yellow-500 hover:text-charcoal-800 transition-all flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-charcoal-700 hover:bg-yellow-500 hover:text-charcoal-800 transition-all flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-charcoal-700 hover:bg-yellow-500 hover:text-charcoal-800 transition-all flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-charcoal-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-charcoal-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/support" className="text-charcoal-400 hover:text-white transition-colors">Support</Link></li>
              <li><a href="#" className="text-charcoal-400 hover:text-white transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-charcoal-400 hover:text-white transition-colors">My Account</Link></li>
              <li><a href="#" className="text-charcoal-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-charcoal-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-charcoal-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-charcoal-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* CTA Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-yellow-500 rounded-2xl p-6 text-charcoal-800"
            >
              <h3 className="font-serif text-2xl mb-2 italic">Let's Get Started!</h3>
              <p className="text-charcoal-700 mb-4 text-sm">
                Join thousands discovering their authentic selves.
              </p>
              <p className="text-charcoal-600 text-xs mb-4">
                There's a seat at the table waiting for you.
              </p>
              <button className="btn-primary w-full text-sm">
                Take Assessment
              </button>
              
              {/* Decorative stars */}
              <div className="relative mt-4">
                <div className="absolute -top-2 -right-2">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 1 L16 14 L29 13 L17 15 L29 17 L16 16 L15 29 L14 16 L1 17 L13 15 L1 13 L14 14 Z" 
                      fill="white" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1 L10.5 9 L19 8.5 L11 10 L19 11.5 L10.5 11 L10 19 L9.5 11 L1 11.5 L9 10 L1 8.5 L9.5 9 Z" 
                      fill="#1A1A1A" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-700 pt-8 flex flex-col md:flex-row justify-between items-center text-charcoal-400 text-sm">
          <p>© 2025 Personalities. All rights reserved.</p>
          <p>Powered by connection, clarity, and community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;