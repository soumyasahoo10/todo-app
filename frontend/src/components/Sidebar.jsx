import React, { useState } from 'react';
import {
  MdPushPin,
  MdOutlinePushPin,
  MdStar,
  MdStarBorder,
  MdDeleteOutline,
  MdSearch,
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdFolderOpen,
  MdInventory2,
  MdOutlineContentCopy
} from 'react-icons/md';
import store from '../zustand/todo.state';
import userStore from '../zustand/user.state';

const CATEGORIES = ['All', 'Ideas', 'Work', 'Personal', 'General'];

export default function Sidebar() {
  const todos = store((state) => state.todos);
  const selectedTodo = store((state) => state.selectedTodo);
  const setSelectedTodo = store((state) => state.setSelectedTodo);
  const deleteTodo = store((state) => state.deleteTodo);
  const togglePin = store((state) => state.togglePin);
  const toggleFavorite = store((state) => state.toggleFavorite);
  const toggleArchive = store((state) => state.toggleArchive);
  const duplicateNote = store((state) => state.duplicateNote);
  const addTodo = store((state) => state.addTodo);

  const filterTab = store((state) => state.filterTab);
  const setFilterTab = store((state) => state.setFilterTab);
  const selectedCategory = store((state) => state.selectedCategory);
  const setSelectedCategory = store((state) => state.setSelectedCategory);

  const user = userStore((state) => state.user);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  // Quick note creation
  const handleQuickAdd = async () => {
    if (!user) return;
    const newNote = {
      title: 'Untitled Note',
      todo: '',
      userId: user.sub || user.userId || 'guest_user_demo',
      category: selectedCategory === 'All' ? 'General' : selectedCategory,
      tags: [],
      isPinned: false
    };
    const res = await addTodo(newNote);
    if (res?.data) {
      setSelectedTodo(res.data);
    }
  };

  // Filter notes
  const filteredNotes = todos.filter((n) => {
    // Tab filter
    if (filterTab === 'pinned' && !n.isPinned) return false;
    if (filterTab === 'favorites' && !n.isFavorite) return false;
    if (filterTab === 'archived' && !n.isArchived) return false;
    if (filterTab !== 'archived' && n.isArchived) return false; // don't show archived in general view

    // Category filter
    if (selectedCategory !== 'All' && n.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // Search filter
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const matchTitle = n.title?.toLowerCase().includes(q);
      const matchContent = n.todo?.toLowerCase().includes(q);
      const matchTags = n.tags && n.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }

    return true;
  });

  return (
    <aside
      className={`h-[calc(100vh-4.1rem)] flex flex-col border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 ease-in-out select-none relative ${
        isCollapsed ? 'w-16 min-w-16' : 'w-72 sm:w-80 min-w-72'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-6 z-20 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center shadow-md transition cursor-pointer"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <MdChevronRight className="text-lg" /> : <MdChevronLeft className="text-lg" />}
      </button>

      {/* When Collapsed: Minimal Icon View */}
      {isCollapsed ? (
        <div className="flex flex-col items-center py-4 gap-4 h-full">
          <button
            onClick={handleQuickAdd}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md transition cursor-pointer"
            title="Create Note"
          >
            <MdAdd className="text-xl" />
          </button>

          <div className="w-8 h-[1px] bg-slate-800" />

          {/* Quick filter tabs */}
          <button
            onClick={() => {
              setFilterTab('all');
              setIsCollapsed(false);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition cursor-pointer ${
              filterTab === 'all' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="All Notes"
          >
            <MdFolderOpen className="text-xl" />
          </button>

          <button
            onClick={() => {
              setFilterTab('pinned');
              setIsCollapsed(false);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition cursor-pointer ${
              filterTab === 'pinned' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Pinned Notes"
          >
            <MdPushPin className="text-xl" />
          </button>

          <button
            onClick={() => {
              setFilterTab('favorites');
              setIsCollapsed(false);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition cursor-pointer ${
              filterTab === 'favorites' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Favorite Notes"
          >
            <MdStar className="text-xl" />
          </button>
        </div>
      ) : (
        /* Full Expanded Sidebar */
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header & Search */}
          <div className="p-3 border-b border-slate-800/70 space-y-2.5">
            {/* Quick search inside sidebar */}
            <div className="relative flex items-center">
              <MdSearch className="absolute left-3 text-slate-400 text-lg pointer-events-none" />
              <input
                type="text"
                placeholder="Filter notes..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 transition"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs (All, Pinned, Favorites, Archived) */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] font-medium text-slate-400">
              <button
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1 text-center rounded-lg transition cursor-pointer ${
                  filterTab === 'all' ? 'bg-indigo-600 text-white shadow-sm font-semibold' : 'hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab('pinned')}
                className={`flex-1 py-1 text-center rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  filterTab === 'pinned' ? 'bg-amber-600 text-white shadow-sm font-semibold' : 'hover:text-slate-200'
                }`}
              >
                <MdPushPin className="text-xs" />
                <span>Pinned</span>
              </button>
              <button
                onClick={() => setFilterTab('favorites')}
                className={`flex-1 py-1 text-center rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  filterTab === 'favorites' ? 'bg-rose-600 text-white shadow-sm font-semibold' : 'hover:text-slate-200'
                }`}
              >
                <MdStar className="text-xs" />
                <span>Favs</span>
              </button>
              <button
                onClick={() => setFilterTab('archived')}
                className={`flex-1 py-1 text-center rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  filterTab === 'archived' ? 'bg-slate-700 text-white shadow-sm font-semibold' : 'hover:text-slate-200'
                }`}
                title="Archived Notes"
              >
                <MdInventory2 className="text-xs" />
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap transition cursor-pointer font-medium ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scroll">
            {filteredNotes.length === 0 ? (
              <div className="py-16 text-center text-slate-500 px-4">
                <MdFolderOpen className="text-3xl mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No notes found</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {localSearch ? 'Try a different search term' : 'Click "+ Add" to create a note'}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = selectedTodo?._id === note._id;
                const formattedDate = note.updatedAt
                  ? new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                  : '';

                return (
                  <div
                    key={note._id}
                    onClick={() => setSelectedTodo(note)}
                    className={`group relative p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600/15 border border-indigo-500/50 text-white shadow-sm'
                        : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 text-slate-300'
                    }`}
                  >
                    {/* Header: Title and Pin/Fav */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {note.isPinned && (
                          <MdPushPin className="text-amber-400 text-xs shrink-0" title="Pinned" />
                        )}
                        <h4 className="font-semibold text-xs sm:text-sm truncate text-slate-100">
                          {note.title || 'Untitled Note'}
                        </h4>
                      </div>

                      {/* Date or category */}
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {formattedDate}
                      </span>
                    </div>

                    {/* Body snippet */}
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {note.todo
                        ? note.todo.replace(/[#*`_~>-]/g, '').trim().slice(0, 80)
                        : 'Empty note...'}
                    </p>

                    {/* Bottom Metadata & Hover Actions */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/30">
                      <div className="flex items-center gap-1">
                        {note.category && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-medium">
                            {note.category}
                          </span>
                        )}
                      </div>

                      {/* Action buttons (Pin, Fav, Duplicate, Delete) */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(note._id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 transition cursor-pointer"
                          title={note.isPinned ? 'Unpin' : 'Pin note'}
                        >
                          {note.isPinned ? <MdPushPin className="text-amber-400" /> : <MdOutlinePushPin />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(note._id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition cursor-pointer"
                          title={note.isFavorite ? 'Remove Favorite' : 'Favorite note'}
                        >
                          {note.isFavorite ? <MdStar className="text-rose-400" /> : <MdStarBorder />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateNote(note._id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 transition cursor-pointer"
                          title="Duplicate note"
                        >
                          <MdOutlineContentCopy />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTodo(note._id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition cursor-pointer"
                          title="Delete note"
                        >
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Stats & Quick Add */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
            <span>
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
            </span>
            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-700/60 transition text-xs font-medium cursor-pointer"
            >
              <MdAdd />
              <span>Add</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}