import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



export type ThemeMode = 'system'|'light'|'dark'


interface ThemeState
{
    theme:ThemeMode
    setTheme:(theme:ThemeMode) => void
}


export const useThemeStore = create<ThemeState>()(
    persist(
        (set):ThemeState => ({
            theme:'system',
            setTheme:(theme:ThemeMode) => set({ theme }),
        }),
        {
            name: 'theme-state-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)