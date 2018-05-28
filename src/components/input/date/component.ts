import { Component, Prop, Watch } from 'vue-property-decorator';
import { VMDateState, VMDateDayItem } from './types';
import InputElement from 'component/input/input-element';
import { VueMappButton } from 'component/input/button';
import { VueMappIcon } from 'component/typo/icon';
import { VueMappMenu } from 'component/popup/menu';
import { VueMappInput } from 'component/input/input';
import { pad } from 'src/helpers/parse';

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
        ['декабрь', 'декабря', 'дек']
    ],
    weekday: [
        'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресение'
    ]
};

@Component({
    name: 'vm-date',
    model: {
        prop: 'value',
        event: 'select'
    },
    components: {
        'vm-button': VueMappButton,
        'vm-icon': VueMappIcon,
        'vm-menu': VueMappMenu,
        'vm-input': VueMappInput
    },
    filters: {
        decMonth(val: number) {
            return dict.month[val][1]
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
        }
    }
})
export default class VueMappDate extends InputElement {
    state: VMDateState = 'time';
    emitValue: string = '';

    inputYear: number = (new Date()).getFullYear();
    inputMonth: number = 0;
    inputDay: number = 1;
    inputHours: number = 1;
    inputMinutes: number = 1;

    $refs: {
        years: HTMLDivElement,
        menu: VueMappMenu
    }

    get fieldValue(): string {
        const { emitValue } = this;

        if (emitValue) {
            return (new Date(emitValue)).toLocaleDateString();
        } else {
            return '';
        }
    }

    @Prop(String) placeholder: string;

    @Prop({
        type: String,
        default: 'day'
    })
    type: string;

    @Prop([String, Boolean])
    closeOnSelect: string | boolean;

    @Prop([String])
    fixedState: VMDateState;

    @Prop({
        type: String,
        default: '1900-01-01'
    })
    startDate: string;

    @Prop({
        type: [String, Number],
        default: '2100-01-01'
    })
    endDate: string;

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

    apply() {
        const { inputYear, inputMonth, inputDay, inputHours, inputMinutes } = this;
        
        let value: string = '';

        const jsonDate = this.inputDate.toJSON();
    
        if (this.type === 'month') {
            value = jsonDate.slice(0, 8);
        } else if (this.type === 'day') {
            value = jsonDate.slice(0, 10);
        }

        this.emitValue = value;
        this.$emit('select', this.emitValue);
        this.$refs.menu.hide();
    }

    get $_startDate(): Date {
        return new Date();
    }

    get $_endDate(): Date {
        return new Date();
    }

    private get toolbarTitle(): string {
        const { state } = this;

        if (state === 'month') {
            return String(this.inputYear);
        }

        if (state === 'time') {
            return `${this.inputDay} ${dict.month[this.inputMonth][1]} ${this.inputYear}`
        }

        return `${ dict.month[this.inputMonth][0] } ${this.inputYear}`;
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
                const scrollYearOrder = inputYear - parseInt(firstYear.textContent || '0');
                const scrollYearElement = years.children[scrollYearOrder];

                this.$nextTick(() => {
                    // @ts-ignore
                    const { offsetTop, offsetHeight } = scrollYearElement;
                    
                    years.scrollTop = offsetTop - years.clientHeight / 2 - offsetHeight / 2;
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
        const startFromWeekday: number = (firstDayOfMonth.getDay() || 7) - 1;
        const prevMonthLastDay = (new Date(inputYear, inputMonth, 0)).getDate();

        for (let i = prevMonthLastDay - startFromWeekday + 1; i <= prevMonthLastDay; i++) {
            days.push({
                prev: true,
                value: i
            });
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push({
                value: i
            });
        }
        
        const maxNextDays = maxDaysInViewport - days.length;

        for (let i = 1; i <= maxNextDays; i++) {
            days.push({
                next: true,
                value: i
            });
        }

        return days;
    }

    get months(): object[] {

        return dict.month.map(month => {

            return {
                name: month[2],
                disabled: false
            }
        })
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
                this.inputDay = (new Date(this.inputYear, this.inputMonth + 1, 0)).getDate();
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
            
            if (this.inputDay === (new Date(this.inputYear, this.inputMonth + 1, 0)).getDate()) {
                this.nextMonth();
                this.inputDay = 1;;
            } else {
                this.inputDay++;
            }
        }
    }

    get years(): number[] {
        const years: number[] = [];
        const startYear = (new Date(this.startDate)).getFullYear();
        const endYear = (new Date(this.endDate)).getFullYear();
    
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

    setDate(unixDate: number) {
        const date = new Date(unixDate);

        this.inputYear = date.getFullYear();
        this.inputMonth = date.getMonth();
        this.inputDay = date.getDate();
        this.inputMinutes = date.getMinutes();
        this.inputHours = date.getHours();
    }

    prevState() {
        const { state, changeState } = this;

        switch(state) {
            case 'month':
                changeState('year'); break;
            case 'day':
                changeState('month'); break;
            case 'time':
                changeState('day'); break;            
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
        } else {
            this.now();
        }        
    } 
}
