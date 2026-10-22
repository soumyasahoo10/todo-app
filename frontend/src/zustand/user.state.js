import { create } from "zustand";

const API_BASE = 'http://localhost:3000/api';

const getInitialTheme = () => {
    const saved = localStorage.getItem('slate_theme');
    if (saved) return saved;
    return 'dark';
};

const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('slate_theme', theme);
};

// Apply theme on load
if (typeof window !== 'undefined') {
    applyTheme(getInitialTheme());
}

const userStore = create((set, get) => ({
    user: (() => {
        try {
            const saved = localStorage.getItem('slate_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    })(),
    isGuest: localStorage.getItem('slate_is_guest') === 'true',
    theme: getInitialTheme(),

    setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
    },

    toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        set({ theme: nextTheme });
    },

    setGuestUser: () => {
        const guestUser = {
            sub: 'guest_user_demo',
            userId: 'guest_user_demo',
            name: 'Demo Explorer',
            email: 'guest@slate.app',
            picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            isGuest: true
        };
        localStorage.setItem('slate_user', JSON.stringify(guestUser));
        localStorage.setItem('slate_is_guest', 'true');
        set({ user: guestUser, isGuest: true });

        // Sync with backend in background
        fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guestUser)
        }).catch(() => {});
    },

    addUser: async (newUser) => {
        if (!newUser) return;
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            if (data.success) {
                const userObj = { ...newUser, isGuest: false };
                localStorage.setItem('slate_user', JSON.stringify(userObj));
                localStorage.setItem('slate_is_guest', 'false');
                set({ user: userObj, isGuest: false });
            }
        } catch (err) {
            console.error('Failed to sync user with backend:', err);
            // Still set locally so user isn't locked out
            set({ user: newUser, isGuest: false });
        }
    },

    removeUser: () => {
        localStorage.removeItem('slate_user');
        localStorage.removeItem('slate_is_guest');
        set({ user: null, isGuest: false });
    }
}));

export default userStore;