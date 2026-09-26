import { Box } from '@mui/material'
import '@svar-ui/react-calendar/all.css'
import { Calendar, WillowDark } from "@svar-ui/react-calendar"



const date = new Date(2026, 4, 5)
const events = [
    {
        id: 1,
        start: new Date(2026, 4, 5, 9, 0),
        end: new Date(2026, 4, 5, 10, 0),
        text: "Standup",
    },
]



export function Main()
{
    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    padding: 3
                }}
            >
                <WillowDark>
                    <Calendar
                        events={events}
                        date={date}
                        readonly={true}
                        views={["day", "week"]}
                    />
                </WillowDark>
            </Box>
        </>
    )
}