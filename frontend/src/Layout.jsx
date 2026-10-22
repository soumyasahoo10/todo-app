import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Display from './components/Display';
import SearchModal from './components/SearchModal';
import ShortcutsModal from './components/ShortcutsModal';
import LandingPage from './pages/Landing';
import store from './zustand/todo.state';
import userStore from './zustand/user.state';

export default function Layout() {
  const fetchTodo = store((state) => state.fetchTodo);
  const addTodo = store((state) => state.addTodo);
  const setSelectedTodo = store((state) => state.setSelectedTodo);
  const fetchHealth = store((state) => state.fetchHealth);
  
  const localUser = userStore((state) => state.user);
  const isGuest = userStore((state) => state.isGuest);
  const addUser = userStore((state) => state.addUser);

  const { user: auth0User, isAuthenticated, isLoading: auth0Loading } = useAuth0();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Active user is either Auth0 authenticated user or Guest user from local state
  const activeUser = auth0User || localUser;

  // Sync Auth0 user to Zustand store and backend
  useEffect(() => {
    if (auth0User && isAuthenticated && !auth0Loading) {
      const payload = {
        sub: auth0User.sub,
        userId: auth0User.sub,
        name: auth0User.name || auth0User.nickname || 'User',
        email: auth0User.email || '',
        picture: auth0User.picture || '',
      };
      addUser(payload);
    }
  }, [auth0User, isAuthenticated, auth0Loading, addUser]);

  // Fetch health and notes for current user
  useEffect(() => {
    fetchHealth();
    if (activeUser) {
      const userId = activeUser.sub || activeUser.userId || 'guest_user_demo';
      fetchTodo(userId);
    }
  }, [activeUser?.sub, activeUser?.userId]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Don't trigger if user is actively typing in an input or textarea (except for search trigger)
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

      // Search command palette: Ctrl + K or Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // New note: Shift + N (when not inside textarea)
      if (e.shiftKey && e.key.toLowerCase() === 'n' && !isInputFocused) {
        e.preventDefault();
        if (!activeUser) return;
        const newNote = {
          title: 'Untitled Note',
          todo: '',
          userId: activeUser.sub || activeUser.userId || 'guest_user_demo',
          category: 'General',
          tags: [],
          isPinned: false
        };
        const res = await addTodo(newNote);
        if (res?.data) {
          setSelectedTodo(res.data);
        }
        return;
      }

      // Open shortcuts dialog: '?' when not typing
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Escape to close open modals
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeUser, addTodo, setSelectedTodo]);

  // If Auth0 is loading and there is no active local/guest user, show clean loader
  if (auth0Loading && !activeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400 font-heading">Initializing Slate...</p>
        </div>
      </div>
    );
  }

  // If no user, show the landing page
  if (!activeUser) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Workspace: Sidebar & Editor */}
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Display />
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}