import {Translate} from "@boxicons/react"
import {Badge, IconButton, Menu, MenuItem} from "@mui/material"
import {useEffect, useState} from "react"
import i18n from "i18next"
import {type LanguageMode, useLanguageStore} from "../../../states/language.ts"
import * as React from "react"



function LanguageSwitch() {
    const [isMenuOpen, setMenuState] = useState<null | HTMLElement>(null)

    const stateLanguageMode = useLanguageStore((state) => state.language)
    const setStateLanguageMode = useLanguageStore((state) => state.setLanguage)

    useEffect(() => {
        i18n.changeLanguage(stateLanguageMode);
    }, [stateLanguageMode])

    const menuOptions:Record<LanguageMode,string> = {
        ru:"Русский",
        en:"English",
    }

    function changeLanguage(language:LanguageMode)
    {
        setStateLanguageMode(language)
        setMenuState(null)
    }

    return (
        <>
            <IconButton
                size="large"
                onClick={(event: React.MouseEvent<HTMLElement>) => setMenuState(event.currentTarget)}
            >
                <Badge
                    badgeContent={stateLanguageMode}
                    color="primary"
                >
                    <Translate />
                </Badge>
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
                {Object.entries(menuOptions).map(([language, label]) => (
                    <MenuItem
                        key={language}
                        onClick={() => changeLanguage(language as LanguageMode)}
                    >
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default LanguageSwitch