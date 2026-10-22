import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  MdSearch,
  MdAdd,
  MdLightMode,
  MdDarkMode,
  MdFileDownload,
  MdContentCopy,
  MdPrint,
  MdKeyboard,
  MdCheck,
  MdOutlineViewSidebar,
  MdVerticalSplit,
  MdVisibility,
  MdEdit,
  MdLogout,
  MdCloudDone
} from 'react-icons/md';
import userStore from '../zustand/user.state';
import store from '../zustand/todo.state';

export default function Navbar({ onOpenSearch, onOpenShortcuts }) {
  const { logout: auth0Logout } = useAuth0();
  const user = userStore((state) => state.user);
  const isGuest = userStore((state) => state.isGuest);
  const theme = userStore((state) => state.theme);
  const toggleTheme = userStore((state) => state.toggleTheme);
  const removeUser = userStore((state) => state.removeUser);

  const selectedTodo = store((state) => state.selectedTodo);
  const addTodo = store((state) => state.addTodo);
  const setSelectedTodo = store((state) => state.setSelectedTodo);
  const viewMode = store((state) => state.viewMode);
  const setViewMode = store((state) => state.setViewMode);
  const storageStatus = store((state) => state.storageStatus);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const exportMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setIsExportOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateNote = async () => {
    if (!user) return;
    const newNote = {
      title: 'Untitled Note',
      todo: '',
      userId: user.sub || user.userId || 'guest_user_demo',
      category: 'General',
      tags: [],
      isPinned: false
    };
    const res = await addTodo(newNote);
    if (res?.data) {
      setSelectedTodo(res.data);
    }
  };

  const handleCopyMarkdown = () => {
    if (!selectedTodo) return;
    const text = `# ${selectedTodo.title || 'Untitled'}\n\n${selectedTodo.todo || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
    setIsExportOpen(false);
  };

  const handleDownloadFile = (extension) => {
    if (!selectedTodo) return;
    const title = (selectedTodo.title || 'untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const content = extension === 'md'
      ? `# ${selectedTodo.title}\n\n${selectedTodo.todo}`
      : `${selectedTodo.title}\n\n${selectedTodo.todo}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setIsExportOpen(false);
  };

  const handleLogout = () => {
    removeUser();
    if (!isGuest) {
      try {
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });
      } catch {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 shadow-lg shadow-indigo-500/25">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
              Slate
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v2.0
            </span>
          </div>
        </div>

        {/* Center: Search & View mode */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-xs sm:text-sm transition shadow-sm group cursor-pointer"
            title="Search notes (Ctrl + K)"
          >
            <MdSearch className="text-lg text-slate-400 group-hover:text-indigo-400 transition" />
            <span className="hidden md:inline">Quick search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* New Note Button */}
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40 transition cursor-pointer"
            title="Create note (Shift + N)"
          >
            <MdAdd className="text-lg" />
            <span className="hidden sm:inline">New Note</span>
          </button>

          {/* View Mode Toggle Switcher */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400">
            <button
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === 'edit'
                  ? 'bg-slate-700 text-white font-medium shadow-sm'
                  : 'hover:text-slate-200'
              }`}
              title="Editor only"
            >
              <MdEdit className="text-sm" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === 'split'
                  ? 'bg-slate-700 text-white font-medium shadow-sm'
                  : 'hover:text-slate-200'
              }`}
              title="Split View: Editor & Live Preview"
            >
              <MdVerticalSplit className="text-sm" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === 'preview'
                  ? 'bg-slate-700 text-white font-medium shadow-sm'
                  : 'hover:text-slate-200'
              }`}
              title="Reading preview mode"
            >
              <MdVisibility className="text-sm" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Right: Actions, Theme, Export & Profile */}
        <div className="flex items-center gap-2">
          {/* Export Menu */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition cursor-pointer"
              title="Export note"
            >
              <MdFileDownload className="text-xl" />
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl py-1.5 z-50 text-slate-200 text-sm animate-fadeIn">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Export Note
                </div>
                <button
                  onClick={() => handleDownloadFile('md')}
                  disabled={!selectedTodo}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800/80 flex items-center gap-2.5 disabled:opacity-50 transition cursor-pointer"
                >
                  <MdFileDownload className="text-indigo-400" />
                  <span>Download Markdown (.md)</span>
                </button>
                <button
                  onClick={() => handleDownloadFile('txt')}
                  disabled={!selectedTodo}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800/80 flex items-center gap-2.5 disabled:opacity-50 transition cursor-pointer"
                >
                  <MdFileDownload className="text-emerald-400" />
                  <span>Download Plain Text (.txt)</span>
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  disabled={!selectedTodo}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800/80 flex items-center gap-2.5 disabled:opacity-50 transition cursor-pointer"
                >
                  {copiedToast ? (
                    <MdCheck className="text-emerald-400" />
                  ) : (
                    <MdContentCopy className="text-amber-400" />
                  )}
                  <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  disabled={!selectedTodo}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800/80 flex items-center gap-2.5 disabled:opacity-50 transition border-t border-slate-800/80 cursor-pointer"
                >
                  <MdPrint className="text-violet-400" />
                  <span>Print Note</span>
                </button>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition cursor-pointer"
            title="Keyboard Shortcuts"
          >
            <MdKeyboard className="text-xl" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <MdLightMode className="text-xl text-amber-300" />
            ) : (
              <MdDarkMode className="text-xl text-indigo-400" />
            )}
          </button>

          {/* User Profile / Menu */}
          <div className="relative ml-1" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-800/80 border border-slate-700/60 transition cursor-pointer"
            >
              <span className="hidden sm:inline text-xs font-medium text-slate-300 max-w-[100px] truncate">
                {user?.name || 'Guest'}
              </span>
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user?.name || 'Avatar'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/40">
                  {user?.name ? user.name[0].toUpperCase() : 'G'}
                </div>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 animate-fadeIn">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-sm">
                      {user?.name ? user.name[0].toUpperCase() : 'G'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate text-white">{user?.name || 'Explorer'}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || 'guest@slate.app'}</p>
                    {isGuest && (
                      <span className="inline-block mt-0.5 text-[10px] font-medium px-2 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Guest Demo Mode
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-2 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center justify-between py-1">
                    <span className="flex items-center gap-1.5">
                      <MdCloudDone className="text-indigo-400" /> Storage Engine
                    </span>
                    <span className="text-slate-300 font-mono text-[11px]">{storageStatus}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-medium text-xs transition cursor-pointer"
                  >
                    <MdLogout className="text-sm" />
                    <span>{isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}