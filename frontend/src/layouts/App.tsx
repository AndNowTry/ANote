import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Box } from "@mui/material"
import { Main } from "./Main"



function App()
{
  return (
    <>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <Main />
            </Box>
        </Box>
    </>
  )
}

export default App
