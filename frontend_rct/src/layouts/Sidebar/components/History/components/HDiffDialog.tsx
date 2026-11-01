import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material"
import {FIELD_LABELS, formatDateTime, type FieldChange} from "../scripts/diff.ts"
import {useHistoryStore} from "../scripts/historyStory.ts"
import {useTranslation} from "react-i18next";




type Side = "before"|"after"

const MARK_BG:Record<Side, string> = {
    before:"rgba(244, 67, 54, 0.15)",
    after:"rgba(76, 175, 80, 0.15)",
}

const rowSx = {
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:2
}



function Field({ change, side }: { change: FieldChange; side: Side })
{
    const {t} = useTranslation()

    const isText = change.field === "name" || change.field === "description"

    return (
        <TextField
            label={t(FIELD_LABELS[change.field])}
            value={t(change[side])}
            placeholder="-"
            size="small"
            fullWidth
            multiline={isText}
            maxRows={6}
            slotProps={{
                input:{readOnly: true},
                inputLabel:{shrink: true},
            }}
            sx={{"& .MuiOutlinedInput-root": {bgcolor: MARK_BG[side]}}}
        />
    )
}


export function HDiffDialog()
{
    const {t} = useTranslation()


    const item = useHistoryStore((state) => state.selected)
    const select = useHistoryStore((state) => state.select)
    const remove = useHistoryStore((state) => state.remove)


    function handleDelete()
    {
        if(item && window.confirm("Delete this history record?"))
        {
            void remove(item)
        }
    }

    return (
        <Dialog
            open={item !== null}
            onClose={() => select(null)}
            maxWidth="md"
            fullWidth
        >
            {item && (
                <>
                    <DialogTitle>
                        {item.next.name || "(untitled)"}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {formatDateTime(item.updateTime)}
                        </Typography>
                    </DialogTitle>

                    <DialogContent
                        dividers
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                    }}>
                        <Box sx={rowSx}>
                            <Typography variant="subtitle2">{t("Before")}</Typography>
                            <Typography variant="subtitle2">{t("After")}</Typography>
                        </Box>

                        {item.changes.map((change) => (
                            <Box
                                key={change.field}
                                sx={rowSx}
                            >
                                <Field
                                    change={change}
                                    side="before"
                                />
                                <Field
                                    change={change}
                                    side="after"
                                />
                            </Box>
                        ))}
                    </DialogContent>

                    <DialogActions>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleDelete}
                        >
                            {t("Delete record")}
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => select(null)}
                        >
                            {t("Close")}
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    )
}
