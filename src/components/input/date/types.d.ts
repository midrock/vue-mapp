export type VMDateState = 'year' | 'month' | 'day' | 'time';

export type VMDateType = 'year' | 'month' | 'date' | 'datetime';

export interface VMDateConfig {
  date?: VMDateState;
}

// const states: VMDateState[] = [
//     VMDateState.YEAR,
//     VMDateState.MONTH,
//     VMDateState.DAY,
//     VMDateState.TIME
// ];

export interface VMDateDayItem {
  prev?: boolean;
  next?: boolean;
  value: number;
  disabled?: boolean;
  active?: boolean;
  today?: boolean;
  date: Date;
  key: string;
}
