import { Box } from '@mui/material'
import { useDisplayViewStore } from "../../states/device_view.ts"




export function Sidebar()
{
    const isSidebarOpen = useDisplayViewStore((state) => state.isSidebarOpen)

    return (
        <>
            {isSidebarOpen && (
                <Box
                    sx={{
                        width: 'clamp(200px, 18vw, 280px)',
                        borderRight: '1px solid darkgray',
                    }}
                />
            )}
        </>
    )
}