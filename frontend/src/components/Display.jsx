import React, { useEffect, useState, useRef } from 'react';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdCheckBox,
  MdCode,
  MdFormatQuote,
  MdHorizontalRule,
  MdPushPin,
  MdOutlinePushPin,
  MdStar,
  MdStarBorder,
  MdCheckCircle,
  MdSync,
  MdAccessTime,
  MdAutoAwesome
} from 'react-icons/md';
import confetti from 'canvas-confetti';
import store from '../zustand/todo.state';

const CATEGORIES = ['General', 'Work', 'Personal', 'Ideas'];

export default function Display() {
  const selectedTodo = store((state) => state.selectedTodo);
  const updateTodo = store((state) => state.updateTodo);
  const togglePin = store((state) => state.togglePin);
  const toggleFavorite = store((state) => state.toggleFavorite);
  const viewMode = store((state) => state.viewMode);
  const isSaving = store((state) => state.isSaving);
  const lastSaved = store((state) => state.lastSaved);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');

  // Refs to avoid debounce race condition on note switch
  const activeNoteIdRef = useRef(null);
  const isDirtyRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync state when selectedTodo changes
  useEffect(() => {
    // If there's an ongoing debounce timer for the previous note, flush it or clear it
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (selectedTodo) {
      activeNoteIdRef.current = selectedTodo._id;
      setTitle(selectedTodo.title || '');
      setBody(selectedTodo.todo || '');
      setCategory(selectedTodo.category || 'General');
      isDirtyRef.current = false;
    } else {
      activeNoteIdRef.current = null;
      setTitle('');
      setBody('');
      setCategory('General');
      isDirtyRef.current = false;
    }
  }, [selectedTodo?._id]);

  // Debounced auto-save handler
  const scheduleSave = (nextTitle, nextBody, nextCat) => {
    if (!activeNoteIdRef.current) return;
    isDirtyRef.current = true;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (activeNoteIdRef.current) {
        updateTodo(activeNoteIdRef.current, {
          title: nextTitle,
          todo: nextBody,
          category: nextCat
        });
        isDirtyRef.current = false;
      }
    }, 400);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    scheduleSave(val, body, category);
  };

  const handleBodyChange = (e) => {
    const val = e.target.value;
    setBody(val);
    scheduleSave(title, val, category);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    scheduleSave(title, body, val);
  };

  // Helper to insert markdown text at current cursor position
  const insertFormatting = (prefix, suffix = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end) || placeholder;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const nextBody = body.substring(0, start) + replacement + body.substring(end);

    setBody(nextBody);
    scheduleSave(title, nextBody, category);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  // Toggle checklist item in markdown text
  const handleToggleChecklist = (index) => {
    let checkCount = 0;
    const lines = body.split('\n');
    let completedCount = 0;
    let totalCheckboxes = 0;

    const updatedLines = lines.map((line) => {
      const match = line.match(/^(\s*)-\s\[([ xX])\]\s(.*)$/);
      if (match) {
        if (checkCount === index) {
          const isDone = match[2].toLowerCase() === 'x';
          const nextState = isDone ? ' ' : 'x';
          line = `${match[1]}- [${nextState}] ${match[3]}`;
          if (!isDone) completedCount++;
        } else if (match[2].toLowerCase() === 'x') {
          completedCount++;
        }
        totalCheckboxes++;
        checkCount++;
      }
      return line;
    });

    const nextBody = updatedLines.join('\n');
    setBody(nextBody);
    scheduleSave(title, nextBody, category);

    // Trigger confetti if all checkboxes checked!
    if (totalCheckboxes > 0 && completedCount === totalCheckboxes) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  // Word count & stats
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const charCount = body.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Render markdown parser
  const renderMarkdown = (content) => {
    if (!content) {
      return (
        <div className="py-12 text-slate-500 italic text-sm">
          No content written yet. Switch to Editor or start typing...
        </div>
      );
    }

    const lines = content.split('\n');
    let checkboxIndex = 0;

    return lines.map((line, idx) => {
      // Checkbox list item: - [ ] or - [x]
      const checkMatch = line.match(/^(\s*)-\s\[([ xX])\]\s(.*)$/);
      if (checkMatch) {
        const currentIndex = checkboxIndex++;
        const isChecked = checkMatch[2].toLowerCase() === 'x';
        return (
          <div
            key={idx}
            className="flex items-start gap-2.5 my-1.5 cursor-pointer group"
            onClick={() => handleToggleChecklist(currentIndex)}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleToggleChecklist(currentIndex)}
              className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500 cursor-pointer"
            />
            <span
              className={`text-sm leading-relaxed transition ${
                isChecked ? 'line-through text-slate-500' : 'text-slate-200'
              }`}
            >
              {checkMatch[3]}
            </span>
          </div>
        );
      }

      // H1
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-2xl font-bold text-white mt-4 mb-2 pb-1 border-b border-slate-800 font-heading">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // H2
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-bold text-slate-100 mt-3.5 mb-1.5 font-heading">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // H3
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-semibold text-slate-200 mt-3 mb-1 font-heading">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-indigo-500 pl-3 py-1 my-2 text-slate-300 italic bg-slate-800/40 rounded-r-lg">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      // Horizontal Rule
      if (line.trim() === '---' || line.trim() === '***') {
        return <hr key={idx} className="my-4 border-slate-800" />;
      }
      // Code block lines (simplified)
      if (line.startsWith('```')) {
        return (
          <div key={idx} className="text-xs text-indigo-400 font-mono opacity-60">
            {line}
          </div>
        );
      }
      // Bullet list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-slate-300 leading-relaxed my-0.5">
            {line.substring(2)}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-3" />;
      }

      // Standard paragraph
      return (
        <p key={idx} className="text-sm leading-relaxed text-slate-300 my-1">
          {line}
        </p>
      );
    });
  };

  if (!selectedTodo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-4.1rem)] p-8 text-center bg-slate-950/40">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-xl">
          <MdAutoAwesome className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-200 font-heading">No Note Selected</h3>
        <p className="text-sm text-slate-400 max-w-sm mt-1">
          Choose a note from the sidebar or press <kbd className="px-1.5 py-0.5 text-xs rounded bg-slate-800 border border-slate-700 text-slate-300">Shift + N</kbd> to start a fresh canvas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4.1rem)] overflow-hidden bg-slate-950/50">
      {/* Editor Header: Title, Category & Actions */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
        {/* Title Input & Category Dropdown */}
        <div className="flex-1 flex items-center gap-3 min-w-[280px]">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note title..."
            className="w-full text-xl sm:text-2xl font-bold bg-transparent text-slate-100 placeholder-slate-500 outline-none font-heading tracking-tight"
          />
        </div>

        {/* Note Controls (Category, Pin, Favorite, Auto-save status) */}
        <div className="flex items-center gap-2">
          {/* Category Selector */}
          <select
            value={category}
            onChange={handleCategoryChange}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 outline-none cursor-pointer focus:border-indigo-500 font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Pin Button */}
          <button
            onClick={() => togglePin(selectedTodo._id)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              selectedTodo.isPinned
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-amber-400'
            }`}
            title={selectedTodo.isPinned ? 'Unpin' : 'Pin to top'}
          >
            {selectedTodo.isPinned ? <MdPushPin className="text-lg" /> : <MdOutlinePushPin className="text-lg" />}
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(selectedTodo._id)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              selectedTodo.isFavorite
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-rose-400'
            }`}
            title={selectedTodo.isFavorite ? 'Favorited' : 'Add to Favorites'}
          >
            {selectedTodo.isFavorite ? <MdStar className="text-lg" /> : <MdStarBorder className="text-lg" />}
          </button>

          {/* Auto-Save Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 pl-2 font-mono">
            {isSaving ? (
              <span className="flex items-center gap-1 text-amber-400 animate-pulse">
                <MdSync className="animate-spin text-sm" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400/90" title={`Last saved: ${lastSaved || 'Just now'}`}>
                <MdCheckCircle className="text-sm" /> Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Formatting Toolbar (shown in edit or split mode) */}
      {(viewMode === 'edit' || viewMode === 'split') && (
        <div className="px-6 py-2 border-b border-slate-800/60 bg-slate-900/20 flex items-center gap-1 overflow-x-auto no-scrollbar text-slate-400 text-sm">
          <button
            onClick={() => insertFormatting('**', '**', 'bold text')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Bold (Ctrl+B)"
          >
            <MdFormatBold className="text-lg" />
          </button>
          <button
            onClick={() => insertFormatting('*', '*', 'italic text')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Italic (Ctrl+I)"
          >
            <MdFormatItalic className="text-lg" />
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          <button
            onClick={() => insertFormatting('# ', '', 'Heading 1')}
            className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 hover:text-slate-200 transition font-heading"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => insertFormatting('## ', '', 'Heading 2')}
            className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 hover:text-slate-200 transition font-heading"
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => insertFormatting('### ', '', 'Heading 3')}
            className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 hover:text-slate-200 transition font-heading"
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          <button
            onClick={() => insertFormatting('- [ ] ', '', 'Task item')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Checklist / Todo"
          >
            <MdCheckBox className="text-lg text-indigo-400" />
          </button>
          <button
            onClick={() => insertFormatting('- ', '', 'List item')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Bullet list"
          >
            <MdFormatListBulleted className="text-lg" />
          </button>
          <button
            onClick={() => insertFormatting('1. ', '', 'Numbered item')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Numbered list"
          >
            <MdFormatListNumbered className="text-lg" />
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          <button
            onClick={() => insertFormatting('```\n', '\n```', 'code here')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition font-mono"
            title="Code Block"
          >
            <MdCode className="text-lg" />
          </button>
          <button
            onClick={() => insertFormatting('> ', '', 'Quote here')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Blockquote"
          >
            <MdFormatQuote className="text-lg" />
          </button>
          <button
            onClick={() => insertFormatting('\n---\n', '')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Divider"
          >
            <MdHorizontalRule className="text-lg" />
          </button>
        </div>
      )}

      {/* Main Content Area (Edit / Split / Preview) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div
            className={`h-full flex flex-col p-6 overflow-hidden ${
              viewMode === 'split' ? 'w-1/2 border-r border-slate-800/80' : 'w-full max-w-4xl mx-auto'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={body}
              onChange={handleBodyChange}
              placeholder="Start drafting thoughts, tasks, code snippets, or markdown..."
              className="w-full flex-1 resize-none bg-transparent text-slate-200 placeholder-slate-600 outline-none text-base leading-relaxed font-sans selection:bg-indigo-500/30 selection:text-indigo-200 custom-scroll"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`h-full flex flex-col p-6 overflow-y-auto custom-scroll ${
              viewMode === 'split' ? 'w-1/2 bg-slate-900/20' : 'w-full max-w-4xl mx-auto'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Markdown Preview</span>
              <span className="text-[10px] text-indigo-400 font-mono">Interactive Checklist Enabled</span>
            </div>
            <div className="prose prose-invert max-w-none text-slate-200">
              {renderMarkdown(body)}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <footer className="px-6 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>{charCount} characters</span>
          <span className="flex items-center gap-1">
            <MdAccessTime className="text-xs" /> {readTimeMinutes} min read
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[11px] text-slate-400">Auto-saves on keystroke</span>
        </div>
      </footer>
    </div>
  );
}
