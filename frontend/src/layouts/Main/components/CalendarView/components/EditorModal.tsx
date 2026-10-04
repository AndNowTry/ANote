import {type CalendarInstanceApi, Editor, getEditorItems, registerEditorItem} from "@svar-ui/react-calendar"
import {RichSelect} from "@svar-ui/react-core"
import {PALETTE} from "../scripts/NoteStyles.ts"
import {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {t} from "i18next"



type EditorItem = ReturnType<typeof getEditorItems>[number] & {
    options?: { id: string; label: string }[]
}



function ColorSelect(props:any)
{
    return (
        <RichSelect {...props}>
            {(option: { id: string; label: string }) => (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span
                        style={{
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            background: PALETTE.find((c) => c.id === option.id)?.bg ?? "transparent",
                            flexShrink: 0,
                        }}
                    />
                    {t(option.label)}
                </span>
            )}
        </RichSelect>
    )
}

registerEditorItem("color-select", ColorSelect)

export function EditorModal({ api }: { api: CalendarInstanceApi })
{
    const { t, i18n } = useTranslation()

    const editorOptions = useMemo<EditorItem[]>(
        () => [
            ...getEditorItems(),
            {
                comp: "textarea",
                key: "description",
                label: t("Description")
            },
            {
                comp: "color-select",
                key: "color",
                label: t("Color"),
                options: PALETTE.map(({ id, label }) => ({ id, label })),
            },
        ],
        [t, i18n.language]
    )

    return (
        <>
            <Editor
                api={api}
                items={editorOptions}
                placement="modal"
            />
        </>
    )
}