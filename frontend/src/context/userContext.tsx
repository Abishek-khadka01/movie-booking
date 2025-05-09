import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  username: string;
  profilePicture: string;
  _id: string;
  isLogin: boolean;
  admin: boolean;
}

interface UserStore {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (userData) => {
        set({ user: userData });
        localStorage.setItem('user-storage-timestamp', Date.now().toString());
      },
      clearUser: () => {
        set({ user: null });
        localStorage.removeItem('user-storage-timestamp');
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      // Custom deserialization to handle expiration
      merge: (persistedState: any, currentState) => {
        const storedAt = parseInt(localStorage.getItem('user-storage-timestamp') || '0', 10);
        const isExpired = Date.now() - storedAt > 3600000; // 1 hour

        if (isExpired) {
          localStorage.removeItem('user-storage');
          localStorage.removeItem('user-storage-timestamp');
          return { ...currentState, user: null };
        }

        return { ...currentState, ...persistedState };
      },
    }
  )
);

export default useUserStore;
