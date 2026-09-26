import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Box, createTheme, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material"
import { Main } from "./Main"
import { BrowserRouter } from "react-router-dom"
import {useMemo} from "react"
import { useThemeStore } from "../states/theme.ts"




function App()
{
    const stateThemeMode = useThemeStore((state) => state.theme)
    const isSystemDark = useMediaQuery('(prefers-color-scheme: dark)')

    const finalTheme =
        stateThemeMode === 'system' ?
            isSystemDark ? 'dark' : 'light' : stateThemeMode

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: finalTheme,
                },
            }),
        [finalTheme],
    )

    return (
    <>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Box sx={{
                    display: 'flex',
                    minHeight: '100vh'
                }}>
                    <Sidebar />
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Header />
                        <Main />
                    </Box>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    </>
    )
}

export default App
