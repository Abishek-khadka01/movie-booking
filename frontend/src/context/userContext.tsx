import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 1. Define the User type
interface User {
  username: string;
  profilePicture: string;
  _id: string;
}

// 2. Define the Store type
interface UserStore {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

// 3. Create the store
const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage), 
    } 
  )
);

export default useUserStore;