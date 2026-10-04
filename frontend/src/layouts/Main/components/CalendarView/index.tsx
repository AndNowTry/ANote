import {Calendar, type CalendarInstanceApi, ContextMenu} from "@svar-ui/react-calendar"
import {useEffect, useMemo, useState} from "react"
import './styles/calendar.css'
import {EventBlock} from "./components/EventBlock.tsx"
import {EditorModal} from "./components/EditorModal.tsx"
import {extraCalendarCss, eventCss} from "./scripts/NoteStyles.ts"
import { Locale } from "@svar-ui/react-core"
import {useTranslation} from "react-i18next"
import {useTheme} from "@mui/material"
import {LoadingState} from "./components/LoadingState.tsx"





const testEvents = [
    {
        id: 1,
        start: new Date(2026, 4, 5, 9, 0),
        end: new Date(2026, 4, 5, 10, 0),
        text: "Standup",
    },
]


export function CalendarView()
{
    const [api, setApi] = useState<CalendarInstanceApi|undefined>()
    const [events, setEvents] = useState(testEvents)
    // @ts-ignore
    const [loading, setLoading] = useState(false)
    const { i18n } = useTranslation()
    const theme = useTheme()

    const words = useMemo(
        () => i18n.getResourceBundle(i18n.language, "translation"),
        [i18n.resolvedLanguage, i18n.language]
    )

    useEffect(() => {
        if(api)
        { // @ts-ignore
            setEvents(api.getEvents())
        }
    }, [i18n.language, theme])

    return (
    <>
        <Locale key={i18n.language} words={words}>
            <ContextMenu api={api}>
                <style>{extraCalendarCss}</style>

                { loading
                    ?
                    <LoadingState />
                    :
                    <Calendar
                        init={setApi}
                        events={events}
                        date={new Date()}
                        view={"week"}
                        views={["day", "week"]}
                        eventCss={eventCss}
                        eventContent={EventBlock}
                    />
                }
            </ContextMenu>

            {api && <EditorModal api={api} />}
        </Locale>
    </>
    )
}