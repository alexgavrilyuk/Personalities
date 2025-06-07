import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white pt-20"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <div className="text-lg">{user.email}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={handleUpdateName}
                      disabled={isSaving}
                      className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setName(user.user_metadata?.name || '');
                      }}
                      className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-lg">{user.user_metadata?.name || 'Not set'}</div>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('Error') 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/50' 
                  : 'bg-green-500/10 text-green-400 border border-green-500/50'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* My Profile */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <p className="text-gray-400 mb-4">View your completed personality assessments and reports</p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View My Profile
            </button>
          </div>

          {/* Account Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            <div className="space-y-3">
              <button className="text-purple-400 hover:text-purple-300 block">
                Change Password
              </button>
              <button
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-300 block"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyAccount;