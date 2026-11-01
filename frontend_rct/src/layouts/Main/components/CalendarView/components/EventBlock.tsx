import {Box} from "@mui/material"
import {type CalendarEvent, type EventContentMode} from "@svar-ui/react-calendar"



// @ts-ignore
export function EventBlock({ event, mode }: { event: CalendarEvent; mode: EventContentMode })
{
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
            }}
        >
            <strong>{event.text}</strong>
            {event?.description && <span>{event.description}</span>}
        </Box>
    )
}