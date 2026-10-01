
type ConfirmationDialogProps = {
    title:string
    text:string
    resolve: (event: Partial<CalendarEvent> | null) => void;
};

export function NoteDialog({ current_api, mode, id, event, resolve }: NoteDialogProps)
{
    const [text, setText] = useState(event.text ?? "");
    const [description, setDescription] = useState(event.description ?? "");
    const [start, setStart] = useState<Dayjs>(event.start ? dayjs(event.start) : dayjs());
    const [end, setEnd] = useState<Dayjs>(event.end ? dayjs(event.end) : dayjs().add(1, "hour"));
    const [color, setColor] = useState(event.color ?? "#1976d2");

    function buildEvent(): Partial<CalendarEvent> {
        return { text, description, start: start.toDate(), end: end.toDate(), color };
    }

    function save(): void {
        resolve(buildEvent());
    }

    function remove(): void {
        if (mode === "delete") {
            resolve(buildEvent()); // не null = подтвердили удаление
            return;
        }
        current_api?.exec("delete-event", { id }); // откроет отдельное подтверждение через intercept
        resolve(null); // текущий edit-диалог просто закрываем
    }

    function cancel(): void {
        resolve(null);
    }

    return (
        <Dialog open onClose={cancel}>
            <DialogTitle>{mode === "add" ? "Новое событие" : "Редактирование"}</DialogTitle>

            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3} sx={{ maxWidth: 600 }}>
                        <TextField label="Заголовок" value={text} onChange={(e) => setText(e.target.value)} fullWidth />
                        <TextField
                            label="Описание"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            minRows={4}
                            fullWidth
                        />
                        <DateTimePicker label="Начало" value={start} onChange={(v) => v && setStart(v)} ampm={false} />
                        <DateTimePicker label="Окончание" value={end} onChange={(v) => v && setEnd(v)} ampm={false} />
                        <MuiColorInput label="Цвет" format="hex" value={color} onChange={setColor} />
                    </Stack>
                </LocalizationProvider>
            </DialogContent>

            <DialogActions>
                {mode === "edit" && <Button onClick={remove} color="error">Удалить</Button>}
                <Button onClick={cancel}>Отмена</Button>
                <Button onClick={save} variant="contained">Сохранить</Button>
            </DialogActions>
        </Dialog>
    )
}