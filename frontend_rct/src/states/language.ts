import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'



export type LanguageMode = 'ru'|'en'


interface LanguageState
{
    language:LanguageMode
    setLanguage:(language:LanguageMode) => void
}


export const useLanguageStore = create<LanguageState>()(
    persist(
        (set):LanguageState => ({
            language:'en',
            setLanguage:(language:LanguageMode) => set({ language }),
        }),
        {
            name: 'language-state-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)