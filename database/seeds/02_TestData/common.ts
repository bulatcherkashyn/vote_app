export function generateDate(objectNumber: number, year: number): Date {
  const dayOfYear = Math.pow(objectNumber, 3) % 365
  const month = Math.floor(dayOfYear / 31)
  let day = dayOfYear % 30

  // fallback for February
  if (month === 1 && day > 28) {
    day = 28
  }

  return new Date(year, month, day)
}

export class Counter {
  constructor(private tick: number = 100) {}

  public nextTick = (): number => {
    this.tick += 1
    return this.tick
  }
}
