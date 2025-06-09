import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const MyAccount: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    const { error } = await updateProfile({ name });
    
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Name updated successfully');
      setIsEditingName(false);
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const accountStats = [
    { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) },
    { label: 'Email Verified', value: user.email_confirmed_at ? 'Yes' : 'No' },
    { label: 'Account Type', value: 'Free' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <section className="bg-charcoal-50 pt-32 pb-16">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-block mb-6">
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
            
            <h1 className="font-serif text-5xl lg:text-6xl text-charcoal-800 mb-4">
              My <em>Account</em>
            </h1>
            <p className="text-xl text-charcoal-600 max-w-2xl">
              Manage your profile information and account settings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-yellow-500 rounded-3xl p-8 mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="font-serif text-4xl text-charcoal-800">
                      {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-charcoal-800 mb-1">
                    {user.user_metadata?.name || 'Welcome'}
                  </h3>
                  <p className="text-sm text-charcoal-700">{user.email}</p>
                </div>
                
                <div className="mt-8 space-y-2">
                  {accountStats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-charcoal-800/10 last:border-0">
                      <span className="text-sm text-charcoal-700">{stat.label}</span>
                      <span className="text-sm font-medium text-charcoal-800">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left px-6 py-3 rounded-2xl text-charcoal-700 hover:bg-charcoal-50 transition-colors flex items-center justify-between group"
                >
                  <span>My Profile</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-6 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </nav>
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Profile Information */}
              <div className="bg-white rounded-3xl border border-charcoal-200 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">Email Address</label>
                    <div className="text-lg text-charcoal-800">{user.email}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal-600 mb-2">Display Name</label>
                    {isEditingName ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-charcoal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                          placeholder="Enter your name"
                        />
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUpdateName}
                            disabled={isSaving}
                            className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
                          >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsEditingName(false);
                              setName(user.user_metadata?.name || '');
                            }}
                            className="btn-secondary py-2 px-4 text-sm"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-lg text-charcoal-800">
                          {user.user_metadata?.name || <span className="text-charcoal-400">Not set</span>}
                        </div>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-charcoal-600 hover:text-charcoal-800 text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-xl text-sm ${
                      message.includes('Error') 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border border-charcoal-200 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 mb-6">Quick Actions</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/profile')}
                    className="bg-charcoal-50 rounded-2xl p-6 text-left hover:bg-charcoal-100 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal-800 mb-1">View Profile</h3>
                        <p className="text-sm text-charcoal-600">See your personality assessments and reports</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="bg-charcoal-50 rounded-2xl p-6 text-left hover:bg-charcoal-100 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal-800 mb-1">New Assessment</h3>
                        <p className="text-sm text-charcoal-600">Take another personality assessment</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white rounded-3xl border border-charcoal-200 p-8">
                <h2 className="font-serif text-2xl text-charcoal-800 mb-6">Security</h2>
                
                <div className="space-y-4">
                  <button className="text-charcoal-600 hover:text-charcoal-800 font-medium transition-colors flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 7H14C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7H5C4.44772 7 4 7.44772 4 8V16C4 16.5523 4.44772 17 5 17H15C15.5523 17 16 16.5523 16 16V8C16 7.44772 15.5523 7 15 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Change Password
                  </button>
                  
                  <button className="text-charcoal-600 hover:text-charcoal-800 font-medium transition-colors flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    View Login History
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default MyAccount;