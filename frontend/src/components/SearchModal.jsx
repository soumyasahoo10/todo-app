import React, { useState, useEffect, useRef } from 'react';
import { MdSearch, MdClose, MdPushPin, MdOutlineCategory } from 'react-icons/md';
import store from '../zustand/todo.state';

export default function SearchModal({ isOpen, onClose }) {
  const todos = store((state) => state.todos);
  const setSelectedTodo = store((state) => state.setSelectedTodo);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = todos.filter((n) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.todo?.toLowerCase().includes(q) ||
      n.category?.toLowerCase().includes(q) ||
      (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        setSelectedTodo(filtered[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-900/90">
          <MdSearch className="text-2xl text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes by title, content, or #tag..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-lg text-slate-100 placeholder-slate-400 outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-lg font-medium">No notes match "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try another search term or create a new note.</p>
            </div>
          ) : (
            filtered.map((note, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={note._id}
                  onClick={() => {
                    setSelectedTodo(note);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      {note.isPinned && <MdPushPin className="text-amber-400 text-sm shrink-0" />}
                      <span className="font-semibold text-sm truncate text-slate-100">
                        {note.title || 'Untitled Note'}
                      </span>
                      {note.category && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-semibold">
                          {note.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                      {note.todo
                        ? note.todo.replace(/[#*`_~]/g, '').slice(0, 100)
                        : 'Empty note...'}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {note.updatedAt
                      ? new Date(note.updatedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">↵</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">esc</kbd> close</span>
          </div>
          <span>{filtered.length} {filtered.length === 1 ? 'note' : 'notes'}</span>
        </div>
      </div>
    </div>
  );
}
