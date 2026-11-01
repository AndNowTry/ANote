import {Box, Typography} from '@mui/material'
import { useDisplayViewStore } from "../../states/device_view.ts"
import {History} from "./components/History"




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
                >
                    <Box sx={{
                        padding: 2,
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Typography variant="h4">
                            Anote
                        </Typography>
                    </Box>

                    <History />
                </Box>
            )}
        </>
    )
}