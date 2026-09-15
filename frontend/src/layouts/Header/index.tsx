import { AppBar, Toolbar, IconButton } from '@mui/material'
import { MedicalFlask, Sun, Translate } from "@boxicons/react"



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
            <Toolbar sx={{ display: 'flex', justifyContent: 'end' }}>
                <IconButton size="large">
                    <Translate />
                </IconButton>

                <IconButton size="large">
                    <Sun />
                </IconButton>

                <IconButton size="large">
                    <MedicalFlask />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}