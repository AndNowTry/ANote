import {Monitor, Moon, Sun} from "@boxicons/react"
import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material"
import { useState } from "react"
import * as React from "react";
import {type ThemeMode, useThemeStore} from "../../../states/theme.ts"



type Option = {
    icon: React.ReactNode
    label: string
}


function ThemeSwitch() {
    const [isMenuOpen, setMenuState] = useState<null | HTMLElement>(null)


    const stateThemeMode = useThemeStore((state) => state.theme)
    const setStateThemeMode = useThemeStore((state) => state.setTheme)

    const menuOptions:Record<ThemeMode,Option> = {
        light: {
            icon: <Sun />,
            label: 'Light',
        },
        dark: {
            icon: <Moon />,
            label: 'Dark',
        },
        system: {
            icon: <Monitor />,
            label: 'System',
        },
    }

    function changeTheme(theme:ThemeMode)
    {
        setStateThemeMode(theme)
        setMenuState(null)
    }

    return (
        <>
            <IconButton
                size="large"
                onClick={(event: React.MouseEvent<HTMLElement>) => setMenuState(event.currentTarget)}
            >
                { menuOptions[stateThemeMode].icon }
            </IconButton>

            <Menu
                anchorEl={isMenuOpen}
                open={Boolean(isMenuOpen)}
                onClose={() => setMenuState(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {Object.entries(menuOptions).map(([theme, option]) => (
                    <MenuItem key={theme} onClick={() => changeTheme(theme as ThemeMode)}>
                        <ListItemIcon>
                            {option.icon}
                        </ListItemIcon>

                        <ListItemText>
                            {option.label}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default ThemeSwitch