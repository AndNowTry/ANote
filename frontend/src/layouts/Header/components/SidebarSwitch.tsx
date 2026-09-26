import {DockLeftAlt, Square} from "@boxicons/react"
import {IconButton} from "@mui/material"
import {useDisplayViewStore} from "../../../states/device_view.ts";




function SidebarSwitch()
{
    const isSidebarOpen = useDisplayViewStore((state) => state.isSidebarOpen)

    return (
        <>
            <IconButton
                size="large"
                onClick={() => useDisplayViewStore.setState({ isSidebarOpen: !isSidebarOpen })}
            >
                {isSidebarOpen ? <DockLeftAlt /> : <Square />}
            </IconButton>
        </>
    )
}

export default SidebarSwitch