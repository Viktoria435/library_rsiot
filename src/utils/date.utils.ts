export class DateUtils {
  private static readonly DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const;

  private static readonly DAY_MAP = Object.fromEntries(
    DateUtils.DAY_NAMES.map((day, index) => [index, day]),
  );

  public static getDayName(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dayOfWeek = dateObj.getDay();
    return this.DAY_MAP[dayOfWeek];
  }

  public static isWorkingDay(date: Date | string, workDays: string[]): boolean {
    const dayName = this.getDayName(date);
    return workDays.includes(dayName);
  }
}
