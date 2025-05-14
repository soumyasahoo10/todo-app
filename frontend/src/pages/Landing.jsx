import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';


export default function LandingPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-black font-mono px-4">
        <div className='flex items-center'>
            <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/96ed444f12f2297ccd4006841bd1831940e6f23d36396492d16831d2cdf15c29?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&"
            className="aspect-[1.14] w-[41px]"
            alt="Logo"
            />
            <div className="my-auto uppercase font-extrabold text-3xl text-zinc-950">
                Slate
            </div>
        </div>
        <p className="text-xl">
            The fastest note-taking web app.
        </p>
        <p className="mt-2 text-sm text-gray-600">
            No animations. Old school. Made for productivity.
        </p>
        
        <div className="mt-8 flex gap-4">
            <button
            onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
            className="px-6 py-2 border border-black text-black bg-white hover:bg-gray-200"
            >
            Sign Up
            </button>
            <button
            onClick={() => loginWithRedirect()}
            className="px-6 py-2 border border-black text-black bg-white hover:bg-gray-200"
            >
            Log In
            </button>
        </div>
    </div>
  );
}
