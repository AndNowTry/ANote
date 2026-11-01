import {Box} from "@mui/material"
import {HForm} from "./components/HForm.tsx"
import {HList} from "./components/HList.tsx"
import {useEffect} from "react"
import {HDiffDialog} from "./components/HDiffDialog.tsx"
import {useHistoryStore} from "./scripts/historyStory.ts"



export function History()
{
    const load = useHistoryStore((state) => state.load)

    useEffect(() => {
        void load()
    }, [load])

    return(
        <>
            <Box sx={{
                display:"flex",
                flexDirection:"column",
            }}>
                <HForm />

                <HList />
            </Box>

            <HDiffDialog />
        </>
    )
}
