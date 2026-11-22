import {Box, Button, Typography} from '@mui/material'
import { useDisplayViewStore } from "../../states/device_view.ts"
import {History} from "./components/History"
import {useTranslation} from "react-i18next"
import {ANGULAR_URL} from "../Main/components/CalendarView/scripts/Links.ts"




export function Sidebar()
{
    const isSidebarOpen = useDisplayViewStore((state) => state.isSidebarOpen)
    const {t} = useTranslation()


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

                    <Box sx={{paddingX: 2}}>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            href={ANGULAR_URL}
                        >
                            {t("Organize notes")}
                        </Button>
                    </Box>

                    <History />
                </Box>
            )}
        </>
    )
}