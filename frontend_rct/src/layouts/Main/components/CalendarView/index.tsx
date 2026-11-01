import {Calendar, type CalendarEvent, type CalendarInstanceApi, ContextMenu} from "@svar-ui/react-calendar"
import {useCallback, useEffect, useMemo, useState} from "react"
import './styles/calendar.css'
import {EventBlock} from "./components/EventBlock.tsx"
import {EditorModal} from "./components/EditorModal.tsx"
import {extraCalendarCss, eventCss} from "./scripts/NoteStyles.ts"
import { Locale } from "@svar-ui/react-core"
import {useTranslation} from "react-i18next"
import {useTheme} from "@mui/material"
import {LoadingState} from "./components/LoadingState.tsx"
import {noteProvider} from "./scripts/NoteProvider.ts"



export function CalendarView()
{
    const [api, setApi] = useState<CalendarInstanceApi|undefined>()
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const { i18n } = useTranslation()
    const theme = useTheme()

    const words = useMemo(
        () => i18n.getResourceBundle(i18n.language, "translation"),
        [i18n.resolvedLanguage, i18n.language]
    )


    useEffect(() => {
        let cancelled = false

        setApi(undefined)
        setLoading(true)

        async function loadNotes()
        {
            setApi(undefined)
            setLoading(true)

            try
            {
                const data = await noteProvider.getData()

                if(!cancelled) setEvents(data)
            }
            catch(error)
            {
                console.error("Load notes error:", error)
            }
            finally
            {
                if(!cancelled)
                {
                    setLoading(false)
                }
            }
        }

        loadNotes()

        return () => {
            cancelled = true
        }
    }, [i18n.language, theme.palette.mode])

    const init = useCallback((instance:CalendarInstanceApi) => {
        instance.setNext(noteProvider)
        setApi(instance)
    }, [])

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
                            init={init}
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