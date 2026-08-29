'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { INITIAL_USERS } from '@/lib/data/initial-data';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: (redirect?: string) => void;
  closeLoginModal: () => void;
  switchRole: (role: UserRole) => void;
  loginWithCredentials: (emailOrPhone: string, code?: string) => Promise<boolean>;
  logout: () => void;
  isEventSaved: (eventId: string) => boolean;
  toggleSaveEvent: (eventId: string) => Promise<boolean>;
  isOrganizerFollowed: (organizerId: string) => boolean;
  toggleFollowOrganizer: (organizerId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(INITIAL_USERS[0]); // Default to Alex Chen (customer)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const toast = useToast();

  // Load user from localStorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('gz_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    const targetUser = INITIAL_USERS.find(u => u.role === newRole) || {
      id: `user_${newRole}_demo`,
      name: `Demo ${newRole.toUpperCase()}`,
      email: `${newRole}@gatezero.in`,
      phone: '+91 98000 00000',
      role: newRole,
      city: 'Mumbai',
      savedEventIds: [],
      followedOrganizerIds: [],
      createdAt: new Date().toISOString()
    };

    setUser(targetUser);
    try {
      localStorage.setItem('gz_user', JSON.stringify(targetUser));
    } catch (e) {}

    toast.info(
      `SWITCHED TO ${newRole.toUpperCase()} ROLE`,
      `Active identity: ${targetUser.name} (${targetUser.email})`
    );
  };

  const loginWithCredentials = async (emailOrPhone: string): Promise<boolean> => {
    // Check if matching initial user
    const found = INITIAL_USERS.find(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone.includes(emailOrPhone)
    );

    const activeUser: User = found || {
      id: `user_${Date.now()}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0].toUpperCase() : 'Pass Holder',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@user.gatezero.in`,
      phone: emailOrPhone.includes('@') ? '+91 98200 00000' : emailOrPhone,
      role: 'customer',
      city: 'Mumbai',
      savedEventIds: [],
      followedOrganizerIds: [],
      createdAt: new Date().toISOString()
    };

    setUser(activeUser);
    try {
      localStorage.setItem('gz_user', JSON.stringify(activeUser));
    } catch (e) {}

    setIsLoginModalOpen(false);
    toast.success('ACCESS GRANTED', `Logged in as ${activeUser.name}`);
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('gz_user');
    } catch (e) {}
    toast.info('SESSION TERMINATED', 'You have been logged out of Gate Zero.');
  };

  const isEventSaved = (eventId: string) => {
    if (!user) return false;
    return user.savedEventIds?.includes(eventId) || false;
  };

  const toggleSaveEvent = async (eventId: string): Promise<boolean> => {
    if (!user) {
      setIsLoginModalOpen(true);
      return false;
    }

    const isSaved = isEventSaved(eventId);
    const updatedSaved = isSaved
      ? user.savedEventIds.filter(id => id !== eventId)
      : [...(user.savedEventIds || []), eventId];

    const updatedUser = { ...user, savedEventIds: updatedSaved };
    setUser(updatedUser);
    try {
      localStorage.setItem('gz_user', JSON.stringify(updatedUser));
    } catch (e) {}

    try {
      await fetch('/api/user/save-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, eventId })
      });
    } catch (e) {}

    if (isSaved) {
      toast.info('REMOVED FROM SAVED', 'Event coordinates unpinned.');
    } else {
      toast.success('SAVED TO GATE PASS', 'Event pinned to your access list.');
    }

    return !isSaved;
  };

  const isOrganizerFollowed = (organizerId: string) => {
    if (!user) return false;
    return user.followedOrganizerIds?.includes(organizerId) || false;
  };

  const toggleFollowOrganizer = async (organizerId: string): Promise<boolean> => {
    if (!user) {
      setIsLoginModalOpen(true);
      return false;
    }

    const isFollowed = isOrganizerFollowed(organizerId);
    const updatedFollowed = isFollowed
      ? user.followedOrganizerIds.filter(id => id !== organizerId)
      : [...(user.followedOrganizerIds || []), organizerId];

    const updatedUser = { ...user, followedOrganizerIds: updatedFollowed };
    setUser(updatedUser);
    try {
      localStorage.setItem('gz_user', JSON.stringify(updatedUser));
    } catch (e) {}

    try {
      await fetch('/api/user/follow-organizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, organizerId })
      });
    } catch (e) {}

    if (isFollowed) {
      toast.info('UNFOLLOWED', 'Removed from organizer updates.');
    } else {
      toast.success('FOLLOWING ORGANIZER', 'You will receive priority access notifications.');
    }

    return !isFollowed;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        isAuthenticated: !!user,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        switchRole,
        loginWithCredentials,
        logout,
        isEventSaved,
        toggleSaveEvent,
        isOrganizerFollowed,
        toggleFollowOrganizer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
