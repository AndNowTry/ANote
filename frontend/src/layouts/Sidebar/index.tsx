import {Box, Divider, List, ListItemButton} from '@mui/material'
import {useState} from "react";



export function Sidebar()
{
    type Option = {
        title: string,
        value: string,
    }


    const [currentOption, setCurrentOption] = useState<string>('')
    const MenuOptions:Option[] = [
        {
            title: "Routine",
            value: "routine",
        },
        {
            title: "History",
            value: "history",
        },
    ]


    return (
        <Box
            component="nav"
            sx={{
                width: 'clamp(200px, 18vw, 280px)',
                borderRight: '1px solid',
                borderColor: 'divider',
                p: 2,
            }}
        >
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                {MenuOptions.map((option) => (
                    <ListItemButton
                        key={option.value}
                        selected={currentOption === option.value}
                        onClick={() => setCurrentOption(option.value)}
                        sx={{
                            borderRadius: 3,
                            transition: 'all 0.2s ease',

                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',

                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            },

                            '&:hover': {
                                bgcolor:
                                    currentOption === option.value
                                        ? 'primary.dark'
                                        : 'action.hover',
                                transform: 'translateX(4px)',
                            },
                        }}
                    >
                        {option.title}
                    </ListItemButton>
                ))}

                <Divider variant="middle" component="li" />


            </List>
        </Box>
    )
}