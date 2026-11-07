const DAY = 24 * 60 * 60 * 1000

const pad = (value: number): string => String(value).padStart(2, '0')



export function weekId(date:Date):string 
{
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNumber = d.getUTCDay() || 7

  d.setUTCDate(d.getUTCDate() + 4 - dayNumber)

  const year = d.getUTCFullYear()
  const week = Math.ceil(((d.getTime() - Date.UTC(year, 0, 1)) / DAY + 1) / 7)

  return `${year}-W${pad(week)}`
}


export function weekStart(id:string):string|null 
{
  const match = /^(\d{4})-W(\d{2})$/.exec(id)
  if (!match) return null

  const year = Number(match[1])
  const week = Number(match[2])
  if (week < 1 || week > 53) return null


  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayNumber = jan4.getUTCDay() || 7
  const monday = new Date(jan4.getTime() + (week - 1) * 7 * DAY - (dayNumber - 1) * DAY)

  return monday.toISOString().slice(0, 10)
}



export function weekRange(start:string):string 
{
  const from = new Date(`${start}T00:00:00Z`)
  const to = new Date(from.getTime() + 6 * DAY)

  const format = (d: Date): string => `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}`

  return `${format(from)} - ${format(to)}`
}



export function defaultWeekName(id:string):string 
{
  const start = weekStart(id)
  const week = Number(id.slice(-2))

  return start ? `Неделя ${week} (${weekRange(start)})` : id
}
