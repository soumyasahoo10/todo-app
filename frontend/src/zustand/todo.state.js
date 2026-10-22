import { create } from 'zustand';

const API_BASE = 'http://localhost:3000/api';

const noteStore = create((set, get) => ({
    todos: [],
    selectedTodo: null,
    searchQuery: '',
    selectedCategory: 'all',
    filterTab: 'all', // 'all' | 'pinned' | 'favorites' | 'archived'
    viewMode: 'split', // 'edit' | 'split' | 'preview'
    isSaving: false,
    lastSaved: null,
    stats: null,
    storageStatus: 'Connected',

    // Select active note
    setSelectedTodo: (todo) => set({ selectedTodo: todo }),

    // Set search query
    setSearchQuery: (query) => set({ searchQuery: query }),

    // Set category
    setSelectedCategory: (category) => set({ selectedCategory: category }),

    // Set filter tab
    setFilterTab: (tab) => set({ filterTab: tab }),

    // Set view mode
    setViewMode: (mode) => set({ viewMode: mode }),

    // Check health
    fetchHealth: async () => {
        try {
            const res = await fetch(`${API_BASE}/health`);
            const data = await res.json();
            if (data.success) {
                set({ storageStatus: data.storage || 'Connected' });
            }
        } catch {
            set({ storageStatus: 'Offline Mode' });
        }
    },

    // Fetch user stats
    fetchStats: async (userId) => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/stats?id=${encodeURIComponent(userId)}`);
            const data = await res.json();
            if (data.success) {
                set({ stats: data.data });
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    },

    // Fetch all notes for user
    fetchTodo: async (userId) => {
        if (!userId) return;
        try {
            const response = await fetch(`${API_BASE}/user?id=${encodeURIComponent(userId)}`);
            const data = await response.json();
            
            if (data.success && Array.isArray(data.data)) {
                set((state) => {
                    const notes = data.data;
                    // If no note is selected or current selected is not in notes, pick first note
                    let nextSelected = state.selectedTodo;
                    if (!nextSelected && notes.length > 0) {
                        nextSelected = notes[0];
                    } else if (nextSelected) {
                        const exists = notes.find(n => n._id === nextSelected._id);
                        if (exists) nextSelected = exists;
                    }
                    return { todos: notes, selectedTodo: nextSelected };
                });
                return data.message;
            }
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    },

    // Add note
    addTodo: async (body) => {
        // Optimistic temporary item
        const tempId = 'temp_' + Date.now();
        const optimisticNote = {
            _id: tempId,
            title: body.title || 'Untitled Note',
            todo: body.todo || '',
            userId: body.userId,
            category: body.category || 'General',
            tags: body.tags || [],
            isPinned: Boolean(body.isPinned),
            isFavorite: false,
            isArchived: false,
            color: 'default',
            checklist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        set((state) => ({
            todos: [optimisticNote, ...state.todos],
            selectedTodo: optimisticNote
        }));

        try {
            const response = await fetch(`${API_BASE}/`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data.success && data.data) {
                const saved = data.data;
                set((state) => ({
                    todos: state.todos.map(t => t._id === tempId ? saved : t),
                    selectedTodo: state.selectedTodo?._id === tempId ? saved : state.selectedTodo
                }));
                return data;
            }
        } catch (err) {
            console.error('Error adding note to server:', err);
        }
        return { success: true, data: optimisticNote };
    },

    // Update note with debounce indicator
    updateTodo: async (id, updatedFields) => {
        set({ isSaving: true });

        // Optimistically update local Zustand state immediately
        set((state) => {
            const updatedTodos = state.todos.map((item) => {
                if (item._id === id) {
                    return { ...item, ...updatedFields, updatedAt: new Date().toISOString() };
                }
                return item;
            });

            const updatedSelected = state.selectedTodo?._id === id
                ? { ...state.selectedTodo, ...updatedFields, updatedAt: new Date().toISOString() }
                : state.selectedTodo;

            return {
                todos: updatedTodos,
                selectedTodo: updatedSelected
            };
        });

        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFields)
            });

            const data = await response.json();

            if (data.success && data.data) {
                const serverData = data.data;
                set((state) => ({
                    todos: state.todos.map(t => t._id === id ? { ...t, ...serverData } : t),
                    selectedTodo: state.selectedTodo?._id === id ? { ...state.selectedTodo, ...serverData } : state.selectedTodo,
                    isSaving: false,
                    lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
            } else {
                set({ isSaving: false });
            }
        } catch (err) {
            console.error('Error updating note:', err);
            set({ isSaving: false });
        }
    },

    // Delete note
    deleteTodo: async (id) => {
        set((state) => {
            const filtered = state.todos.filter((e) => e._id !== id);
            let nextSelected = state.selectedTodo?._id === id
                ? (filtered.length > 0 ? filtered[0] : null)
                : state.selectedTodo;

            return {
                todos: filtered,
                selectedTodo: nextSelected
            };
        });

        try {
            await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    },

    // Toggle Pin
    togglePin: async (id) => {
        const state = get();
        const currentNote = state.todos.find(n => n._id === id);
        if (!currentNote) return;

        const nextPin = !currentNote.isPinned;
        
        // Optimistic update
        set((prev) => {
            const updatedList = prev.todos.map(n => n._id === id ? { ...n, isPinned: nextPin } : n);
            // Re-sort: pinned first
            updatedList.sort((a, b) => {
                if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
                return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
            });
            return {
                todos: updatedList,
                selectedTodo: prev.selectedTodo?._id === id ? { ...prev.selectedTodo, isPinned: nextPin } : prev.selectedTodo
            };
        });

        try {
            await fetch(`${API_BASE}/${id}/pin`, { method: 'PATCH' });
        } catch (err) {
            console.error('Error pinning note:', err);
        }
    },

    // Toggle Favorite
    toggleFavorite: async (id) => {
        const state = get();
        const currentNote = state.todos.find(n => n._id === id);
        if (!currentNote) return;

        const nextFav = !currentNote.isFavorite;

        set((prev) => ({
            todos: prev.todos.map(n => n._id === id ? { ...n, isFavorite: nextFav } : n),
            selectedTodo: prev.selectedTodo?._id === id ? { ...prev.selectedTodo, isFavorite: nextFav } : prev.selectedTodo
        }));

        try {
            await fetch(`${API_BASE}/${id}/favorite`, { method: 'PATCH' });
        } catch (err) {
            console.error('Error favoriting note:', err);
        }
    },

    // Toggle Archive
    toggleArchive: async (id) => {
        const state = get();
        const currentNote = state.todos.find(n => n._id === id);
        if (!currentNote) return;

        const nextArchived = !currentNote.isArchived;

        set((prev) => ({
            todos: prev.todos.map(n => n._id === id ? { ...n, isArchived: nextArchived } : n),
            selectedTodo: prev.selectedTodo?._id === id ? { ...prev.selectedTodo, isArchived: nextArchived } : prev.selectedTodo
        }));

        try {
            await fetch(`${API_BASE}/${id}/archive`, { method: 'PATCH' });
        } catch (err) {
            console.error('Error archiving note:', err);
        }
    },

    // Duplicate note
    duplicateNote: async (id) => {
        const state = get();
        const note = state.todos.find(n => n._id === id);
        if (!note) return;

        const copyPayload = {
            title: `${note.title} (Copy)`,
            todo: note.todo,
            userId: note.userId,
            category: note.category,
            tags: [...(note.tags || [])],
            color: note.color,
            checklist: (note.checklist || []).map(c => ({ ...c, id: 'chk_' + Math.random().toString(36).substring(2, 7) }))
        };

        await state.addTodo(copyPayload);
    }
}));

export default noteStore;