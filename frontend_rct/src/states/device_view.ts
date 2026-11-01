import { create } from 'zustand'
import {createJSONStorage, persist} from "zustand/middleware";



interface DisplayView
{
    isSidebarOpen: boolean
}

export const useDisplayViewStore = create<DisplayView>()(
    persist(
        ():DisplayView => ({
            isSidebarOpen: true,
        }),
        {
            name: 'display-view-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
