import { Component, Prop, Watch } from 'vue-property-decorator';
import { VMDateState, VMDateDayItem } from './types';
import InputElement from 'component/input/input-element';
import { VueMappButton } from 'component/input/button';
import { VueMappIcon } from 'component/typo/icon';
import { VueMappMenu } from 'component/popup/menu';
import { VueMappInput } from 'component/input/input';
import { pad } from 'src/helpers/parse';
import date from '.';

const dict = {
  month: [
    ['январь', 'января', 'янв'],
    ['февраль', 'февраля', 'февр'],
    ['март', 'марта', 'март'],
    ['апрель', 'апреля', 'апр'],
    ['май', 'мая', 'май'],
    ['июнь', 'июня', 'июнь'],
    ['июль', 'июля', 'июль'],
    ['август', 'августа', 'авг'],
    ['сентябрь', 'сентября', 'сент'],
    ['октябрь', 'октября', 'окт'],
    ['ноябрь', 'ноября', 'нояб'],
    ['декабрь', 'декабря', 'дек'],
  ],
  weekday: [
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
    'воскресение',
  ],
};


type CompareLevel = 'day' | 'month' | 'year' | 'time';

function toDate(value: string | number | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function compare(_date1: string | number | Date, _date2: string | number | Date, level: CompareLevel = 'day') {
  if (!_date1 || !_date2) {
    console.warn('vm-date#compare: 2 arguments expected');
    return;
  }

  const date1 = toDate(_date1);
  const date2 = toDate(_date2);

  const runners = {
    year: () => date1.getFullYear() === date2.getFullYear(),
    month: () => {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
    },
    day: () => {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    }
  }

  return Function.prototype.apply.call(runners[level]);
}

@Component({
  name: 'vm-date',
  model: {
    prop: 'value',
    event: 'select',
  },
  components: {
    'vm-button': VueMappButton,
    'vm-icon': VueMappIcon,
    'vm-menu': VueMappMenu,
    'vm-input': VueMappInput,
  },
  filters: {
    decMonth(val: number) {
      return dict.month[val][1];
    },
    weekday(value: Date) {
      if (!value) return '';

      const jsDay = value.getDay();
      const { weekday } = dict;

      return weekday[jsDay ? jsDay - 1 : weekday.length - 1];
    },
    shortWeekdayNameByIndex(idx: number) {
      return dict.weekday[idx][0];
    },
    pad(value: number | string) {
      return pad(value, 2, '0');
    },
  },
})
export default class VueMappDate extends InputElement {
  state: VMDateState = 'time';
  emitValue: string = '';

  inputYear: number = new Date().getFullYear();
  inputMonth: number = 0;
  inputDay: number = 1;
  inputHours: number = 1;
  inputMinutes: number = 1;

  $refs: {
    years: HTMLDivElement;
    menu: VueMappMenu;
  };

  get fieldValue(): string {
    const { emitValue } = this;

    if (emitValue) {
      return new Date(emitValue).toLocaleDateString();
    } else {
      return '';
    }
  }

  @Prop(String)
  placeholder: string;

  @Prop(String)
  emitFormat: string;

  @Prop(String)
  fieldFormat: string;

  @Prop({
    type: Function,
    default: () => true,
  })
  filter: (date: Date) => any;

  @Prop({
    type: String,
    default: 'day',
  })
  type: string;

  @Prop(Boolean)
  closeOnSelect: boolean;

  @Prop(String)
  fixedState: VMDateState;

  @Prop({
    type: [String, Date],
    default: '1900-01-01',
  })
  startDate: string | Date;

  @Prop({
    type: [String, Date],
    default: '2100-01-01',
  })
  endDate: string | Date;

  @Prop({
    type: String,
    default: 'small',
  })
  view: string;

  @Prop({
    type: String,
    default: '-1',
  })
  tabindex: string;

  @Watch('value')
  updateValue(newValue: string) {
    this.emitValue = newValue;
  }

  get inputDate(): Date {
    return new Date(
      this.inputYear,
      this.inputMonth,
      this.inputDay,
      this.inputHours,
      this.inputMinutes
    );
  }

  get emitValueDate(): Date | null {
    return this.emitValue && new Date(this.emitValue) || null;
  }

  apply() {
    let value: string = '';

    const jd = this.inputDate.toLocaleDateString();

    value = jd.slice(6, 10) + '-' + jd.slice(3, 5);

    if (this.type === 'day') {
      value += '-' + jd.slice(0, 2);
    }

    if (this.emitValue !== value) {
      this.emitValue = value;
      this.$emit('select', this.emitValue);

      if (this.form) {
        this.form.changed = true;
      }
    }

    this.$refs.menu.hide();
  }

  get $_endDate(): Date {
    const { endDate } = this;

    if (typeof endDate === 'string') {
      return new Date(endDate);
    } else {
      return endDate;
    }
  }

  get $_startDate(): Date {
    const { startDate } = this;

    if (typeof startDate === 'string') {
      return new Date(startDate);
    } else {
      return startDate;
    }
  }

  private get toolbarTitle(): string {
    const { state } = this;

    if (state === 'month') {
      return String(this.inputYear);
    }

    if (state === 'time') {
      return `${this.inputDay} ${dict.month[this.inputMonth][1]} ${
        this.inputYear
        }`;
    }

    return `${dict.month[this.inputMonth][0]} ${this.inputYear}`;
  }

  $_filterDate(date) {
    const start = this.$_startDate;
    const end = this.$_endDate;
    const isFirstOfStart =
      date.getMonth() === start.getMonth() &&
      date.getDate() === start.getDate();

    if (!isFirstOfStart && (date < start || date > end)) {
      return false;
    }

    return this.filter(date);
  }

  $_showFooter() {
    return true
  }

  changeState(state: VMDateState) {
    let allowed = false;

    switch (this.type) {
      case 'day':
        allowed = /year|month|day/.test(state);
        break;
      case 'month':
        allowed = /year|month/.test(state);
        break;
      case 'year':
        allowed = /year/.test(state);
        break;
    }

    if (this.fixedState || !allowed) {
      if (this.closeOnSelect) {
        this.apply();
      }

      return;
    }

    this.state = state;

    if (state === 'year') {
      const { years } = this.$refs;
      const { inputYear } = this;
      const firstYear = years.firstChild;

      if (firstYear) {
        const scrollYearOrder =
          inputYear - parseInt(firstYear.textContent || '0');
        const scrollYearElement = years.children[scrollYearOrder];

        this.$nextTick(() => {
          // @ts-ignore
          const { offsetTop, offsetHeight } = scrollYearElement;

          years.scrollTop =
            offsetTop - years.clientHeight / 2 - offsetHeight / 2;
        });
      }
    }
  }

  get days(): VMDateDayItem[] {
    const maxDaysInViewport: number = 7 * 6;

    const { inputYear, inputMonth } = this;
    const days: VMDateDayItem[] = [];

    const firstDayOfMonth = new Date(inputYear, inputMonth, 1);
    const lastDayOfMonth = new Date(inputYear, inputMonth + 1, 0);
    const prevMonthDaysCount: number = (firstDayOfMonth.getDay() || 7) - 1;

    if (prevMonthDaysCount > 0) {
      for (let i = prevMonthDaysCount; i > 0; i--) {
        const prevDay = new Date(inputYear, inputMonth, -i);

        days.push({
          key: prevDay.toJSON().slice(0, 10),
          prev: true,
          value: prevDay.getDate(),
          disabled: !this.$_filterDate(prevDay),
          date: prevDay,
        });
      }
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const currentDay = new Date(inputYear, inputMonth, i);

      days.push({
        key: currentDay.toJSON().slice(0, 10),
        value: currentDay.getDate(),
        disabled: !this.$_filterDate(currentDay),
        date: currentDay,
        active: this.emitValue && compare(this.emitValue, currentDay),
        today: compare(new Date(), currentDay),
      });
    }

    const maxNextDays = maxDaysInViewport - days.length;

    for (let i = 1; i <= maxNextDays; i++) {
      const nextDay = new Date(inputYear, inputMonth + 1, i);

      days.push({
        key: nextDay.toJSON().slice(0, 10),
        next: true,
        value: nextDay.getDate(),
        disabled: !this.$_filterDate(nextDay),
        date: new Date(),
      });
    }

    return days;
  }

  get prevStateEnabled(): boolean {
    const { state } = this;
    const start = this.$_startDate;
    const end = this.$_endDate;

    if (state === 'month') {
      return start.getFullYear() !== end.getFullYear();
    }

    if (state === 'day') {
      return (
        start.getFullYear() !== end.getFullYear() ||
        start.getMonth() !== end.getMonth()
      );
    }

    return false;
  }

  get prevArrowEnabled() {
    const { state } = this;
    const startDate = this.$_startDate;

    if (state === 'day') {
      return (
        this.inputYear > startDate.getFullYear() ||
        startDate.getMonth() < this.inputMonth
      );
    }

    if (state === 'month') {
      return startDate.getFullYear() < this.inputYear;
    }

    return true;
  }

  get nextArrowEnabled() {
    const { state } = this;
    const endDate = this.$_endDate;

    if (state === 'day') {
      return (
        this.inputYear < endDate.getFullYear() ||
        endDate.getMonth() > this.inputMonth
      );
    }

    if (state === 'month') {
      return endDate.getFullYear() > this.inputYear;
    }

    return true;
  }

  get months(): object[] {
    const { inputYear } = this;

    const startMonth = this.$_startDate.getMonth();
    const startYear = this.$_startDate.getFullYear();
    const endMonth = this.$_endDate.getMonth();
    const endYear = this.$_endDate.getFullYear();

    return dict.month.map((month, idx) => {
      const monthNum = idx;

      return {
        name: month[2],
        disabled:
          (inputYear === startYear && monthNum < startMonth) ||
          (inputYear === endYear && monthNum > endMonth),
        value: new Date(inputYear, monthNum, 1),
      };
    });
  }

  private nextMonth() {
    if (this.inputMonth < 11) {
      this.inputMonth++;
    } else {
      this.inputMonth = 0;
      this.inputYear++;
    }
  }

  private prevMonth() {
    if (this.inputMonth) {
      this.inputMonth--;
    } else {
      this.inputMonth = 11;
      this.inputYear--;
    }
  }

  private toolbarLeftClick() {
    const { state } = this;

    if (state === 'month') {
      this.inputYear--;
    } else if (state === 'day') {
      this.prevMonth();
    } else if (state === 'time') {
      if (this.inputDay === 1) {
        this.prevMonth();
        this.inputDay = new Date(
          this.inputYear,
          this.inputMonth + 1,
          0
        ).getDate();
      } else {
        this.inputDay--;
      }
    }
  }

  private toolbarRightClick() {
    const { state } = this;

    if (state === 'month') {
      this.inputYear++;
    } else if (state === 'day') {
      this.nextMonth();
    } else if (state === 'time') {
      if (
        this.inputDay ===
        new Date(this.inputYear, this.inputMonth + 1, 0).getDate()
      ) {
        this.nextMonth();
        this.inputDay = 1;
      } else {
        this.inputDay++;
      }
    }
  }

  get years(): number[] {
    const years: number[] = [];
    const startYear = this.$_startDate.getFullYear();
    const endYear = this.$_endDate.getFullYear();

    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }

    return years;
  }

  setYear(year: number) {
    this.inputYear = year;
    this.changeState('month');
  }

  setMonth(monthIdx: number) {
    this.inputMonth = monthIdx;
    this.changeState('day');
  }

  setDay(day: VMDateDayItem) {
    if (day.prev) {
      this.prevMonth();
    } else if (day.next) {
      this.nextMonth();
    }

    this.inputDay = day.value;
    this.changeState('time');
  }

  setDate(_date: string | number) {
    const date = new Date(_date);

    this.inputYear = date.getFullYear();
    this.inputMonth = date.getMonth();
    this.inputDay = date.getDate();
    this.inputMinutes = date.getMinutes();
    this.inputHours = date.getHours();
  }

  prevState() {
    if (!this.prevStateEnabled) return;

    const { state, changeState } = this;

    switch (state) {
      case 'month':
        changeState('year');
        break;
      case 'day':
        changeState('month');
        break;
      case 'time':
        changeState('day');
        break;
    }
  }

  clear() {
    this.now();
    this.emitValue = '';
    this.$emit('select', '');

    if (this.closeOnSelect) {
      this.$refs.menu.hide();
    }
  }

  today() {
    this.now();

    if (this.closeOnSelect) {
      this.apply();
    }
  }

  now() {
    this.setDate(Date.now());
  }

  created() {
    const { value } = this;

    this.state = this.fixedState || this.type;

    if (value) {
      this.emitValue = value;
      this.setDate(value);
    } else {
      this.now();
    }
  }
}
