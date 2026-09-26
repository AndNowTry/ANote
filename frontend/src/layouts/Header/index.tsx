import {AppBar, Box, Toolbar} from '@mui/material'
import LanguageSwitch from "./components/LanguageSwitch.tsx"
import ThemeSwitch from "./components/ThemeSwitch.tsx";
import SidebarSwitch from "./components/SidebarSwitch.tsx";



export function Header()
{
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    px: 1.2,
                    gap: 0.6,
                }}
            >
                <SidebarSwitch />

                <Box sx={{ ml: 'auto' }}>
                    <LanguageSwitch />

                    <ThemeSwitch />
                </Box>
            </Toolbar>
        </AppBar>
    )
}