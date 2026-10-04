import {Box, CircularProgress} from "@mui/material"
import {t} from "i18next"



export function LoadingState()
{
    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            }}>
                <CircularProgress
                    size="3rem"
                    aria-label="Loading…"
                />

                <strong>
                    {t("Loading data into the calendar")}
                </strong>
            </Box>
        </>
    )
}