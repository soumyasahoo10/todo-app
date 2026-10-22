import React from 'react';

export default function Scroll({ contact = {} }) {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
      {contact.profilepic ? (
        <img
          src={contact.profilepic}
          alt={contact.name || "profile"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm text-slate-400">👤</span>
      )}
    </div>
  );
}