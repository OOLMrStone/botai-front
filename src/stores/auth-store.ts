import { create } from 'zustand';

import { fetchCurrentUser, logoutUser, type User } from '@/lib/api/auth';

// 'unknown' - ещё не спрашивали бэкенд, 'anonymous' - сессии нет.
export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

interface AuthState {
  user: User | null;
  status: AuthStatus;

  // Спросить бэкенд «кто я» (GET /api/auth/me) и обновить стор.
  refresh: () => Promise<User | null>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

// Истина о сессии живёт на бэкенде (кука SESSION), стор - лишь кэш в памяти.
// Сознательно без persist: после перезагрузки страницы состояние восстанавливает
// refresh(), а не localStorage - иначе можно показать «вошедшего» без сессии.
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  status: 'unknown',

  refresh: async () => {
    const user = await fetchCurrentUser();
    set({ user, status: user ? 'authenticated' : 'anonymous' });
    return user;
  },

  setUser: (user) => set({ user, status: 'authenticated' }),

  logout: async () => {
    await logoutUser();
    set({ user: null, status: 'anonymous' });
  },
}));
