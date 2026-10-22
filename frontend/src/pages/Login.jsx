import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import userStore from '../zustand/user.state';
import { MdArrowBack, MdAutoAwesome } from 'react-icons/md';

export default function Login() {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const setGuestUser = userStore((state) => state.setGuestUser);

  const handleGuest = () => {
    setGuestUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
          <MdAutoAwesome className="text-2xl text-white" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-white">Sign In to Slate</h2>
        <p className="text-xs text-slate-400 mt-1.5 mb-6">
          Access your notes, tasks, and markdown thought canvas.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => loginWithRedirect()}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            Continue with Auth0 (Google / Email)
          </button>

          <button
            onClick={handleGuest}
            className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm transition cursor-pointer"
          >
            Continue as Guest Demo
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <MdArrowBack />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
