export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export interface Employee {
  id: string;
  name: string;
  surname: string;
  experience: number;
  workDays: DayOfWeek[];
  issuedBooks?: string[];
}

export interface CreateEmployeeRequest {
  name: string;
  surname: string;
  experience: number;
  workDays: DayOfWeek[];
}
