import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Todo from '../model/todo.model.js';
import User from '../model/user.model.js';
import { isDbConnected } from '../DBconfig/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'local_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default seed data
const DEFAULT_SEED = {
    users: [
        {
            userId: 'guest_user_demo',
            name: 'Demo Explorer',
            email: 'guest@slate.app',
            picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            theme: 'dark'
        }
    ],
    todos: [
        {
            _id: 'sample_note_1',
            title: 'Welcome to Slate 📝',
            todo: '# Welcome to Slate v2.0\n\nThe lightning-fast note-taking and task application built for deep focus.\n\n### ✨ Key Features\n- **Instant Auto-Save**: Never worry about losing a single keystroke.\n- **Markdown Support**: Headers, code blocks, lists, and quotes.\n- **Pin & Organize**: Pin your most critical notes to the top.\n- **Interactive Checklists**: Keep track of projects effortlessly.\n- **Keyboard Shortcuts**: Press `Shift + N` for a new note, `Ctrl + K` to search.\n\n> "Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra',
            userId: 'guest_user_demo',
            category: 'Ideas',
            tags: ['welcome', 'slate', 'guide'],
            isPinned: true,
            isFavorite: true,
            isArchived: false,
            color: 'indigo',
            checklist: [
                { id: 'chk_1', text: 'Explore the Slate interface', completed: true },
                { id: 'chk_2', text: 'Create your first custom note (Shift + N)', completed: false },
                { id: 'chk_3', text: 'Try switching to Split Preview mode', completed: false }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: 'sample_note_2',
            title: 'Project Roadmap 🚀',
            todo: '## Q4 Milestone Goals\n\n1. Complete full-stack MERN architecture refactor\n2. Introduce live markdown editor with split preview\n3. Polish micro-animations and dark mode UI\n4. Add export to Markdown (.md) and PDF\n\n```javascript\n// Quick code snippet\nconst productivityScore = (tasksCompleted, focusHours) => {\n  return (tasksCompleted * 10) + (focusHours * 25);\n};\n```',
            userId: 'guest_user_demo',
            category: 'Work',
            tags: ['dev', 'roadmap'],
            isPinned: false,
            isFavorite: true,
            isArchived: false,
            color: 'emerald',
            checklist: [
                { id: 'chk_4', text: 'Define API schema', completed: true },
                { id: 'chk_5', text: 'Write integration tests', completed: false }
            ],
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 1800000).toISOString()
        }
    ]
};

// Helper to read local json
const readLocalDb = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SEED, null, 2), 'utf-8');
            return DEFAULT_SEED;
        }
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Error reading local db file:', err.message);
        return DEFAULT_SEED;
    }
};

// Helper to write local json
const writeLocalDb = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing local db file:', err.message);
    }
};

export const storageService = {
    // Check if mongo is ready
    useMongo() {
        return isDbConnected();
    },

    async getNotesByUser(userId, filters = {}) {
        if (this.useMongo()) {
            try {
                const query = { userId };
                if (filters.category && filters.category !== 'all') {
                    query.category = filters.category;
                }
                if (filters.isArchived !== undefined) {
                    query.isArchived = filters.isArchived;
                }
                if (filters.isFavorite !== undefined) {
                    query.isFavorite = filters.isFavorite;
                }
                if (filters.search) {
                    const regex = new RegExp(filters.search, 'i');
                    query.$or = [{ title: regex }, { todo: regex }, { tags: regex }];
                }

                // Sort: pinned first, then most recently updated
                return await Todo.find(query).sort({ isPinned: -1, updatedAt: -1 });
            } catch (err) {
                console.warn('Mongo query failed, falling back to local:', err.message);
            }
        }

        // Local fallback
        const db = readLocalDb();
        let userNotes = db.todos.filter(t => t.userId === userId || userId === 'all' || !userId);
        
        // If user is new and has 0 notes, copy default seed notes for this user
        if (userNotes.length === 0 && userId && userId !== 'all') {
            const seeded = DEFAULT_SEED.todos.map(t => ({
                ...t,
                _id: 'seed_' + Math.random().toString(36).substring(2, 9),
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));
            db.todos.push(...seeded);
            writeLocalDb(db);
            userNotes = seeded;
        }

        if (filters.category && filters.category !== 'all') {
            userNotes = userNotes.filter(n => n.category?.toLowerCase() === filters.category.toLowerCase());
        }
        if (filters.isArchived !== undefined) {
            userNotes = userNotes.filter(n => Boolean(n.isArchived) === Boolean(filters.isArchived));
        }
        if (filters.isFavorite !== undefined) {
            userNotes = userNotes.filter(n => Boolean(n.isFavorite) === Boolean(filters.isFavorite));
        }
        if (filters.search) {
            const s = filters.search.toLowerCase();
            userNotes = userNotes.filter(n => 
                (n.title && n.title.toLowerCase().includes(s)) ||
                (n.todo && n.todo.toLowerCase().includes(s)) ||
                (n.tags && n.tags.some(t => t.toLowerCase().includes(s)))
            );
        }

        // Sort: pinned first, then updated
        return userNotes.sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        });
    },

    async getNoteById(id) {
        if (this.useMongo()) {
            try {
                if (mongoose.Types.ObjectId.isValid(id)) {
                    return await Todo.findById(id);
                }
            } catch (err) {
                console.warn('Mongo findById error:', err.message);
            }
        }
        const db = readLocalDb();
        return db.todos.find(t => String(t._id) === String(id)) || null;
    },

    async createNote(data) {
        if (this.useMongo()) {
            try {
                const todo = new Todo(data);
                return await todo.save();
            } catch (err) {
                console.warn('Mongo save error, falling back to local:', err.message);
            }
        }

        const db = readLocalDb();
        const newNote = {
            _id: 'loc_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            title: data.title || 'Untitled Note',
            todo: data.todo || '',
            userId: data.userId || 'guest_user_demo',
            category: data.category || 'General',
            tags: data.tags || [],
            isPinned: Boolean(data.isPinned),
            isFavorite: Boolean(data.isFavorite),
            isArchived: Boolean(data.isArchived),
            color: data.color || 'default',
            checklist: data.checklist || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.todos.unshift(newNote);
        writeLocalDb(db);
        return newNote;
    },

    async updateNote(id, data) {
        if (this.useMongo()) {
            try {
                if (mongoose.Types.ObjectId.isValid(id)) {
                    const updated = await Todo.findByIdAndUpdate(
                        id,
                        { ...data, updatedAt: new Date() },
                        { new: true, runValidators: true }
                    );
                    if (updated) return updated;
                }
            } catch (err) {
                console.warn('Mongo update error:', err.message);
            }
        }

        const db = readLocalDb();
        const index = db.todos.findIndex(t => String(t._id) === String(id));
        if (index === -1) return null;

        const updated = {
            ...db.todos[index],
            ...data,
            _id: db.todos[index]._id, // preserve id
            userId: db.todos[index].userId, // preserve ownership
            updatedAt: new Date().toISOString()
        };
        db.todos[index] = updated;
        writeLocalDb(db);
        return updated;
    },

    async deleteNote(id) {
        if (this.useMongo()) {
            try {
                if (mongoose.Types.ObjectId.isValid(id)) {
                    await Todo.findByIdAndDelete(id);
                    return true;
                }
            } catch (err) {
                console.warn('Mongo delete error:', err.message);
            }
        }

        const db = readLocalDb();
        const initialLen = db.todos.length;
        db.todos = db.todos.filter(t => String(t._id) !== String(id));
        writeLocalDb(db);
        return db.todos.length < initialLen;
    },

    async upsertUser(userData) {
        const { sub, name, email, picture, theme } = userData;
        const userId = sub || userData.userId;

        if (this.useMongo()) {
            try {
                const user = await User.findOneAndUpdate(
                    { userId },
                    { userId, name, email, picture, theme, lastLogin: new Date() },
                    { new: true, upsert: true }
                );
                return user;
            } catch (err) {
                console.warn('Mongo user upsert error:', err.message);
            }
        }

        const db = readLocalDb();
        const existingIdx = db.users.findIndex(u => u.userId === userId);
        const record = {
            userId,
            name: name || 'User',
            email: email || '',
            picture: picture || '',
            theme: theme || 'dark',
            lastLogin: new Date().toISOString()
        };

        if (existingIdx >= 0) {
            db.users[existingIdx] = { ...db.users[existingIdx], ...record };
        } else {
            db.users.push(record);
        }
        writeLocalDb(db);
        return record;
    },

    async getStats(userId) {
        const notes = await this.getNotesByUser(userId);
        const totalNotes = notes.length;
        const totalWords = notes.reduce((acc, curr) => {
            const count = (curr.todo || '').trim().split(/\s+/).filter(Boolean).length;
            return acc + count;
        }, 0);
        const pinnedCount = notes.filter(n => n.isPinned).length;
        const categories = {};
        notes.forEach(n => {
            const cat = n.category || 'General';
            categories[cat] = (categories[cat] || 0) + 1;
        });

        return {
            totalNotes,
            totalWords,
            pinnedCount,
            categories,
            storageMode: this.useMongo() ? 'MongoDB' : 'Local Storage Engine'
        };
    }
};

export default storageService;
