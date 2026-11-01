import {Box, useTheme} from '@mui/material'
import '@svar-ui/react-calendar/all.css'
import {Willow, WillowDark} from "@svar-ui/react-calendar"
import {CalendarView} from "./components/CalendarView"




export function Main()
{
    const isDarkThemeMode = useTheme().palette.mode === 'dark'

    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    padding: 3,
                    minHeight: 0,
                }}
            >
                {isDarkThemeMode ? (
                    <WillowDark>
                        <CalendarView />
                    </WillowDark>
                ) : (
                    <Willow>
                        <CalendarView />
                    </Willow>
                )}
            </Box>
        </>
    )
}