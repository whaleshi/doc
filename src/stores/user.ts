import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    commonUser: any;
    setCommonUser: (user: any) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            commonUser: {}, // 登陆后存储info
            setCommonUser: (user) => set({ commonUser: user }),
            logout: () => set({ commonUser: {} }),
        }),
        {
            name: "user-storage",
        }
    )
);
