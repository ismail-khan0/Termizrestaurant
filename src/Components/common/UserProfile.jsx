import React from 'react';
import { useApp } from '../../contexts/AppContext';

const UserProfile = () => {
  const { state } = useApp();
  const { user } = state;

  // Safe handling for null/undefined user
  if (!user) {
    return (
      <div className="flex items-center gap-3 p-2">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">?</span>
        </div>
        <div>
          <p className="text-sm text-gray-300">Not Signed In</p>
        </div>
      </div>
    );
  }

  // Safe access with fallbacks
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 p-2">
      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
        <span className="text-black font-semibold">{userInitials}</span>
      </div>
      <div>
        <p className="font-semibold text-white">{userName}</p>
        {userEmail && (
          <p className="text-xs text-gray-400">{userEmail}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;