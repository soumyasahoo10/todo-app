import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  MdAutoAwesome,
  MdFlashOn,
  MdCode,
  MdCheckCircleOutline,
  MdKeyboard,
  MdArrowForward,
  MdDarkMode,
  MdLightMode,
  MdOutlineFolderZip,
  MdFormatQuote
} from 'react-icons/md';
import userStore from '../zustand/user.state';

export default function LandingPage() {
  const { loginWithRedirect } = useAuth0();
  const setGuestUser = userStore((state) => state.setGuestUser);
  const theme = userStore((state) => state.theme);
  const toggleTheme = userStore((state) => state.toggleTheme);

  const handleStartGuest = () => {
    setGuestUser();
  };

  const handleAuth0Login = () => {
    try {
      loginWithRedirect();
    } catch (err) {
      console.warn('Auth0 redirect issue, falling back to guest demo:', err);
      setGuestUser();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background Glow & Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-violet-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
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
          <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
            Slate
          </span>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <MdLightMode className="text-xl text-amber-300" /> : <MdDarkMode className="text-xl text-indigo-400" />}
          </button>

          <button
            onClick={handleStartGuest}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium text-slate-200 transition cursor-pointer"
          >
            Explore Demo
          </button>

          <button
            onClick={handleAuth0Login}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-20 text-center relative z-10">
        {/* Release Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md shadow-sm">
          <MdAutoAwesome className="text-indigo-400 text-sm animate-pulse" />
          <span>Slate 2.0 is live — Markdown, Split Views & Instant Save</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Thoughts at the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200">
            Speed of Light.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The ultra-responsive, distraction-free thought canvas. Designed for builders, thinkers, and writers who value speed, clean markdown, and instant auto-save.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartGuest}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            <span>Start Writing (No Signup Required)</span>
            <MdArrowForward className="text-lg" />
          </button>

          <button
            onClick={handleAuth0Login}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-base backdrop-blur-xl transition cursor-pointer"
          >
            <span>Sign In with Auth0</span>
          </button>
        </div>

        {/* Floating App Preview Mockup */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/10 blur-2xl rounded-3xl" />
          <div className="relative rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden p-2 sm:p-4 text-left">
            {/* Mock Window Controls */}
            <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">slate-workspace / Project Roadmap 🚀</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Auto-saved</span>
              </div>
            </div>

            {/* Mock Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 min-h-[280px]">
              {/* Mock Sidebar List */}
              <div className="hidden md:block md:col-span-4 border-r border-slate-800/60 pr-4 space-y-2">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Project Roadmap 🚀</span>
                    <span className="text-[10px] text-amber-400 font-bold">📌 Pinned</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-1">1. Complete MERN refactor...</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-400">
                  <span className="text-xs font-semibold text-slate-200">Welcome to Slate 📝</span>
                  <p className="text-[11px] text-slate-500 truncate mt-1">The lightning-fast note-taking app...</p>
                </div>
              </div>

              {/* Mock Editor & Markdown */}
              <div className="col-span-12 md:col-span-8 flex flex-col justify-between pl-2">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">Project Roadmap 🚀</h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-300 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px]">✓</span>
                      <span className="line-through text-slate-500">Upgrade MERN backend with resilient storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px]">✓</span>
                      <span className="line-through text-slate-500">Live markdown preview & split screen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded border border-slate-600" />
                      <span className="text-slate-200">Deploy high-performance workspace</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>3 tasks (2 completed)</span>
                  <span>Press Shift + N for new note</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/80 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold font-heading text-white">
            Built for Extreme Focus and Productivity
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Every pixel and keystroke tuned for speed, reliability, and sheer writing pleasure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              <MdFlashOn />
            </div>
            <h3 className="font-bold text-base text-white font-heading">Zero-Lag Auto-Save</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Smart debouncing prevents network thrashing while guaranteeing every single edit is preserved without manual saving.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              <MdCode />
            </div>
            <h3 className="font-bold text-base text-white font-heading">Markdown & Split View</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Format with headings, code blocks, blockquotes, and interactive clickable checklists that celebrate with confetti.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              <MdKeyboard />
            </div>
            <h3 className="font-bold text-base text-white font-heading">Keyboard-First Flow</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Instant command palette via <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Cmd+K</kbd> and rapid note creation with <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Shift+N</kbd>.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
              <MdCheckCircleOutline />
            </div>
            <h3 className="font-bold text-base text-white font-heading">Resilient Architecture</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Hybrid engine connects seamlessly to MongoDB Atlas with robust fallback storage for 100% uninterrupted uptime.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/20 backdrop-blur-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Ready to experience a modern note-taking canvas?
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-md mx-auto">
            No friction. No setup delays. Jump straight into the workspace right now.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleStartGuest}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition cursor-pointer"
            >
              Launch Slate Workspace Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-slate-400">Slate v2.0</span>
          <span>— Full-stack MERN thought canvas</span>
        </div>
        <div>
          <span>Crafted for high velocity thought capture.</span>
        </div>
      </footer>
    </div>
  );
}
