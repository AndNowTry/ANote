import {Box, List, ListItemButton, ListItemText, Typography} from "@mui/material"
import {FIELD_LABELS, formatDateTime} from "../scripts/diff.ts"
import {useHistoryStore} from "../scripts/historyStory.ts"
import {useTranslation} from "react-i18next"




export function HList()
{
    const {t} = useTranslation()


    const items = useHistoryStore((state) => state.items)
    const loading = useHistoryStore((state) => state.loading)
    const select = useHistoryStore((state) => state.select)

    return (
        <>
            <Box sx={{
                padding:2,
                display:"flex",
                flexDirection:"column",
                gap:2,
            }}>
                {items.length === 0 && !loading && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {t("No changes found")}
                    </Typography>
                )}

                <List
                    dense
                    disablePadding
                    sx={{
                        maxHeight: "calc(100vh - 380px)",
                        overflowY: "auto"
                }}>
                    {items.map((item) => (
                        <ListItemButton
                            key={item.id}
                            onClick={() => select(item)}
                        >
                            <ListItemText
                                primary={item.next.name || "(untitled)"}
                                secondary={
                                    `${formatDateTime(item.updateTime)} | ` +
                                    item.changes.map((change) => t(FIELD_LABELS[change.field])).join(", ")
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </>
    )
}
