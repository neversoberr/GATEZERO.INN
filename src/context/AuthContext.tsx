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
  signup: (input: { name: string; email: string; phone: string; city?: string }) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isEventSaved: (eventId: string) => boolean;
  toggleSaveEvent: (eventId: string) => Promise<boolean>;
  isOrganizerFollowed: (organizerId: string) => boolean;
  toggleFollowOrganizer: (organizerId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persist(user: User | null) {
  try {
    if (user) localStorage.setItem('gz_user', JSON.stringify(user));
    else localStorage.removeItem('gz_user');
  } catch {
    // ignore storage errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(INITIAL_USERS[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('gz_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
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
    persist(targetUser);
    toast.info(
      `SWITCHED TO ${newRole.toUpperCase()} ROLE`,
      `Active identity: ${targetUser.name} (${targetUser.email})`
    );
  };

  const loginWithCredentials = async (emailOrPhone: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        persist(data.user);
        setIsLoginModalOpen(false);
        toast.success('ACCESS GRANTED', `Logged in as ${data.user.name}`);
        return true;
      }
    } catch {
      // fall through to local demo login
    }

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
    persist(activeUser);
    setIsLoginModalOpen(false);
    toast.success('ACCESS GRANTED', `Logged in as ${activeUser.name}`);
    return true;
  };

  const signup = async (input: { name: string; email: string; phone: string; city?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        persist(data.user);
        setIsLoginModalOpen(false);
        toast.success(
          data.created ? 'IDENTITY CREATED' : 'WELCOME BACK',
          `Signed in as ${data.user.name}`
        );
        return true;
      }
      toast.error('SIGNUP FAILED', data.error || 'Could not create identity');
      return false;
    } catch (err: any) {
      toast.error('SIGNUP FAILED', err.message);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const updatedUser = { ...user, ...updates, id: user.id, email: user.email };
    setUser(updatedUser);
    persist(updatedUser);
    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch {
      // local persist still succeeded
    }
    toast.success('CREDENTIALS UPDATED', 'Profile preferences synchronized.');
    return true;
  };

  const logout = () => {
    setUser(null);
    persist(null);
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
    persist(updatedUser);

    try {
      await fetch('/api/user/save-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, eventId })
      });
    } catch {
      // ignore
    }

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
    persist(updatedUser);

    try {
      await fetch('/api/user/follow-organizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, organizerId })
      });
    } catch {
      // ignore
    }

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
        signup,
        updateProfile,
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
