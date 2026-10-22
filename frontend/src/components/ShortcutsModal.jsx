import React from 'react';
import { MdClose, MdKeyboard } from 'react-icons/md';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Shift + N', desc: 'Create new note' },
    { key: 'Ctrl + K / ⌘ + K', desc: 'Open quick search & command palette' },
    { key: 'Ctrl + S / ⌘ + S', desc: 'Save note immediately' },
    { key: 'Ctrl + P / ⌘ + P', desc: 'Toggle Split / Preview mode' },
    { key: 'Ctrl + B / ⌘ + B', desc: 'Bold formatted text' },
    { key: 'Ctrl + I / ⌘ + I', desc: 'Italic formatted text' },
    { key: 'Ctrl + Shift + X', desc: 'Insert checklist item' },
    { key: 'Esc', desc: 'Close dialogs or clear search' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <MdKeyboard className="text-xl" />
            </div>
            <h3 className="font-bold text-lg font-heading">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="mt-4 space-y-3 font-sans">
          {shortcuts.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm py-1">
              <span className="text-slate-300">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs text-indigo-300 font-semibold shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Designed for high-speed, distraction-free productivity.
          </p>
        </div>
      </div>
    </div>
  );
}
