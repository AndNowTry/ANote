import {useEffect, useState} from "react"
import {Box, InputAdornment, MenuItem, OutlinedInput, Select, type SelectChangeEvent, TextField} from "@mui/material"
import {Search, SliderVerticalAlt, Timer} from "@boxicons/react"
import {type HistorySort, useHistoryStore} from "../scripts/historyStory.ts"
import {useTranslation} from "react-i18next"




export function HForm()
{
    const {t} = useTranslation()


    const search = useHistoryStore((state) => state.search)
    const dateFrom = useHistoryStore((state) => state.dateFrom)
    const dateTo = useHistoryStore((state) => state.dateTo)
    const sort = useHistoryStore((state) => state.sort)
    const setFilters = useHistoryStore((state) => state.setFilters)


    const [searchText, setSearchText] = useState(search)


    useEffect(function () {
        const timer = setTimeout(function () {
            setFilters({search: searchText})
        }, 300)

        return function () {
            clearTimeout(timer)
        }
    }, [searchText, setFilters])

    return (
        <>
            <Box sx={{
                padding:2,
                display:"flex",
                flexDirection:"column",
                gap:2,
            }}>
                <TextField
                    placeholder={t("Search title")}
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size="sm"/>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <TextField
                    type="date"
                    label={t("From")}
                    size="small"
                    fullWidth
                    value={dateFrom}
                    onChange={(event) => setFilters({dateFrom: event.target.value})}
                    slotProps={{
                        inputLabel: {shrink: true},
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Timer size="sm"/>
                                </InputAdornment>
                            ),
                        },
                    }}

                />

                <TextField
                    type="date"
                    label={t("To")}
                    size="small"
                    fullWidth
                    value={dateTo}
                    onChange={(event) => setFilters({dateTo: event.target.value})}
                    slotProps={{
                        inputLabel: {shrink: true},
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Timer size="sm"/>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Select
                    value={sort}
                    onChange={(event: SelectChangeEvent) => setFilters({sort: event.target.value as HistorySort})}
                    input={
                        <OutlinedInput
                            placeholder={t("Sort by")}
                            size="small"
                            fullWidth
                            startAdornment={
                                <InputAdornment position="start">
                                    <SliderVerticalAlt size="sm"/>
                                </InputAdornment>
                            }
                        />
                    }
                >
                    <MenuItem value="time_desc">{t("Time (newest)")}</MenuItem>
                    <MenuItem value="time_asc">{t("Time (oldest)")}</MenuItem>
                    <MenuItem value="name_asc">{t("Name (A-Z)")}</MenuItem>
                    <MenuItem value="name_desc">{t("Name (Z-A)")}</MenuItem>
                </Select>
            </Box>
        </>
    )
}
