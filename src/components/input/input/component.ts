import InputElement from 'component/input/input-element';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { VueMappButton } from 'component/input/button';
import { Template, Test, InputParams, Messages } from './types';
import { VMInputCheckState } from '../types';
import { chooseDefinedValue } from 'src/helpers/parse';

const defaultMessages: Messages = {
    inputRequired: 'Поле должно быть заполнено',
    inputCheckTimeout: 'Превышено время ожидания проверки',
    inputMaskCheck: (ctx) => `Ожидается формат ${ctx.mask}`,
    inputMinLength: (ctx) => 'Минимальная длина ' + ctx.minlength,
    inputMin: (ctx) => 'Минимальное значение ' + ctx.min,
    inputMax: (ctx) => 'Максимальное значение ' + ctx.max
}

@Component({
    name: 'vm-input',
    components: {
        'vm-button': VueMappButton
    }
})
export class VueMappInput extends InputElement {

    inputValue: string | number = '';
    message: string = '';
    VMInputCheckState: VMInputCheckState | null = null;
    focused: boolean = false;
    timer: NodeJS.Timer;

    $refs: {
        input: HTMLInputElement,
        wrapper: HTMLDivElement,
        container: HTMLDivElement,
        label: HTMLDivElement,
        svgboxpath: SVGPathElement
    }

    private noanimate: boolean = false;
   
    @Prop([String, Number]) length: number | string;
    @Prop([String, Number]) maxlength: number | string;
    @Prop([String, Number]) minlength: number | string;    
    @Prop([String, Number]) min: string | number;
    @Prop([String, Number]) max: string | number;
    @Prop([String, Number]) value: string | number;
    @Prop(String) name: string;
    @Prop(String) label: string;
    @Prop(String) description: string;
    @Prop(String) placeholder: string;
    @Prop(String) mask: string;
    @Prop(Boolean) required: boolean;
    @Prop(Boolean) emitMaskedValue: boolean;
    @Prop(Boolean) nowrap: boolean;
    @Prop(Boolean) validateOnInput: boolean;
    @Prop(Boolean) novalidate: boolean;
    @Prop(Boolean) expanded: boolean;
    @Prop(Boolean) loading: boolean;
    @Prop([String, Boolean]) showClearButton: boolean | string;
    @Prop(Function) test: Test;

    @Prop({ 
        type: String,
        default: 'false'
    }) 
    spellcheck: string;

    @Prop({
        type: String,
        default: 'off'
    })
    autocomplete: string;
    
    @Prop({
        type: [String, Number],
        default: 100
    }) 
    debounce: number | string = 100;

    @Prop({
        type: String,
        validator: (value) => (/text|password|number/).test(value)
    })
    type: 'text' | 'password' | 'number';

    @Prop([String, Object])
    template: string | Template;

    @Watch('value')
    updateFromPropValue(value) {

        if (value !== this.emitValue) {
            this.updateValue(value);
        }
    }

    @Watch('$_mask')
    updateMask() { 
        this.updateValue();
    }

    @Watch('$_expanded') 
    updateBoxSvg() {
        this.$nextTick(this.drawBoxSvg);
    }

    @Watch('freezed')
    updateMessage() {
        if (this.freezed) {
            this.message = '';
            this.VMInputCheckState = null;
        }
    }



    /*
     * GETTERS
     */ 



    private get $_template(): Template {

        // add template from config
        // if (typeof this.template === 'string' && 
        //     this.$mapp &&
        //     this.$mapp.inputTemplates instanceof Object) {

        //     return this.$mapp.inputTemplates[this.template];
        // } else if (typeof this.template === 'object') {
        //     return this.template;
        // } 
        return {};
    }

    private get $_tests(): Test[] {
        const tests = this.test ? [this.test] : [];

        if (typeof this.$_template.test === 'object') {
            tests.push(this.$_template.test);
        }

        return tests;
    }
    
    private get $_type(): string {
        const type = this.type || this.$_template.type;
        return type === 'password' ? 'password' : 'text';
    }

    private get $_label(): string {
        return this.label || this.$_template.label || '';
    }

    private get $_name(): string {
        return this.name || this.$_template.name || '';
    }

    private get $_min(): number {
        return Number(this.min || this.$_template.min);
    }

    private get $_max(): number {
        return Number(this.max || this.$_template.max);
    }

    private get classes(): (string | object)[] {
        const { form } = this;
        
        const _size = (() => {
            const { size } = this;

            if (size !== undefined) {
                return this.size;
            } else if (form) {
                return form.size;
            } else {
                return null;
            }
        })();

        return  [
           _size ? `is--large-${_size}` : '', 
            {
                'is--focused': this.focused,
                'is--expanded': this.$_expanded,
                'is--dirty': !!this.inputValue,
                'is--box': this.$_box,
                'is--label': this.label
            }
        ]
    }

    private get $_length(): number {
        if (this.$_mask) {
            return this.$_mask.length;
        } else {
            return Number(this.length) || this.$_template.length || Number.POSITIVE_INFINITY;
        }
    }
    
    private get $_description(): string {
        return this.message || 
               this.description || 
               this.$_template.description || 
               '';
    }

    private get $_required(): boolean {
        return !this.freezed && this.required;
    }

    private get $_mask(): string {
        return this.mask || this.$_template.mask || '';
    }

    private get $_maxlength(): number {
        if (isFinite(this.$_length)) {
            return this.$_length;
        } else {
            return Number(this.maxlength) || this.$_template.maxlength || Number.POSITIVE_INFINITY;
        }
    }

    private get $_minlength(): number {
        if (isFinite(this.$_length)) {
            return this.$_length;
        } else {
            return Number(this.minlength) || this.$_template.minlength || 0;
        }
    }

    private get $_box(): boolean {
        const { form, box } = this;

        if (box !== null) {
            return !!box;
        } else {
            return !!(form && form.box);
        }
    }

    private get $_expanded(): boolean {
        const {
            expanded,
            placeholder,
            inputValue,
            $slots: {
                left
            }
        } = this;

        return !!(expanded || placeholder || inputValue === 0 || inputValue || left);
    }

    get unmaskedValue(): string {
        const mask = this.$_mask;
        const value = String(this.inputValue);
        
        let unmaskedValue = '';

        for (let i = 0; i < mask.length; i++) {
            const isValue = (/[#ANX\?]/).test(mask.charAt(i));
            unmaskedValue += isValue ? value.charAt(i) : '';
        }

        return unmaskedValue;
    }

    get params(): InputParams {
        return {
            required: this.$_required,
            emitValue: this.emitValue,
            inputValue: this.inputValue,
            length: this.$_length,
            type: this.type,
            minlength: this.$_minlength,
            maxlength: this.$_maxlength,
            min: this.$_min,
            max: this.$_max,
            mask: this.$_mask
        }
    }

    get emitValue(): string | number {
        if (this.$_mask) {
            return this.emitMaskedValue ? this.inputValue : this.unmaskedValue;
        }
        return this.inputValue;
    }








    onFocus($event) {
        if (/readonly|disabled/.test(this.status)) return;
        this.focused = true;
        this.$emit('focus', $event);
    }

    onBlur($event) {
        const { form } = this;

        this.focused = false;

        if ((form && !form.validateOnSubmit) || !this.novalidate) {
            this.validate();
        }
        
        this.$emit('blur', $event);
    }

    onInput($event) {
        
        if (this.$refs.input.value !== this.inputValue) {
            this.VMInputCheckState = 'changed';
            this.$emit('change');
            this.updateValue();
        }
    }

    updateValue(forceValue?: string | number) {
        let inputValue: string | number = chooseDefinedValue(forceValue, this.$refs.input.value);

        if (inputValue !== undefined) {
            if (this.type === 'number') {

                if (typeof inputValue === 'string') {
                    inputValue = parseInt(inputValue) || '';
                }
                
            } else if (this.$_mask && 
                       String(inputValue).length > String(this.inputValue).length ||
                       this.$_mask.length !== String(inputValue).length ) {
                
                inputValue = this.processMask(inputValue);
            }
        } else if (!this.expanded) {
            this.noanimate = false;
        }

        this.$refs.input.value = chooseDefinedValue(inputValue);
        this.inputValue = inputValue;

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.$emit('input', this.emitValue);

            if (this.validateOnInput) {
                this.validate();
            }
        }, Number(this.debounce));
    }
    
    public clear() {
        this.updateValue('');
    }

    private processMask(value) {
        const mask = this.mask;

        if (!mask) return value;

        let text = '',
            cOffset = 0;

        for (let i = 0; i < mask.length; i++) {
            let m = mask.charAt(i);

            if (!(/[#ANX\?]/).test(m)) value = value.replace(m, '');
        }

        for (let i = 0, x = 1; x && i < mask.length; ++i) {

            let c = value.charAt(i - cOffset),
                m = mask.charAt(i);

            switch (m) {
                case '#': (/\d/).test(c) ? text += c : x = 0;
                    break;
                case 'A': (/[a-zA-Zа-яА-Я]/i).test(c) ? text += c : x = 0;
                    break;
                case 'N': (/[a-zA-Zа-яА-Я0-9]/i).test(c) ? text += c : x = 0;
                    break;
                case '?': cOffset++;
                    break;
                case 'X': text += c;
                    break;
                default:
                    text += m;
                    if (c && c !== m) value = ' ' + value;
                    break;
            }
        }
        return text;
    }

    validate(): Promise<string> {
        this.message = '';

        return new Promise((resolve) => {
            this.VMInputCheckState = 'process';
            
            const basicResult = this.validateBasic();

            const final = (error: string = '') => {

                if (error) {
                    this.VMInputCheckState = 'error';

                    const message = defaultMessages[error];

                    this.message = message instanceof Function ? 
                                   message(this.params) : message;
                } else {
                    this.VMInputCheckState = 'valid';
                    this.message = '';
                }

                resolve(this.message || this.VMInputCheckState);
            }

            if (this.novalidate) {
                final();
            } else if (typeof basicResult === 'string') {
                final(basicResult);
            } else if (this.$_tests.length) {
                this.validateTests().then(final);
            } else {
                final();
            }
        });
    }

    private validateBasic(): boolean | string {
        const params = this.params;

        const tests = [
            {
                check: (ctx) => !ctx.required || (ctx.required && !!ctx.emitValue),
                message: 'inputRequired'
            },
            {
                check: (ctx) => {
                    const { mask, emitValue } = ctx;
                    return !mask || (!!mask && mask.length === String(emitValue).length);
                },
                message: 'inputMaskCheck'
            },
            {
                check: (ctx) => {
                    const { mask, type, minlength, emitValue } = ctx;

                    return !!mask || 
                           type === 'number' || 
                           !minlength ||
                           String(emitValue).length >= minlength;
                },
                message: 'inputMinLength'
            },
            {
                check: (ctx) => {
                    const { type, min, emitValue } = ctx;
                    return  type !== 'number' || !min || emitValue >= min;
                },
                message: 'inputMin'
            },
            {
                check: (ctx) => {
                    const { type, max, emitValue } = ctx;
                    return type !== 'number' || !max || emitValue <= max;
                },
                message: 'inputMax'
            }
        ];

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const testPassed = test.check(params);

            if (!testPassed) {
                return test.message;
            }
        }

        return true;
    }

    private drawBoxSvg() {

        const {
            container,
            label,
            input,
            svgboxpath
        } = this.$refs;


        if (!this.$_box || !container) return;

        const expanded = this.$_expanded && this.label;

        const {
            borderRadius,
            borderTopLeftRadius
        } = getComputedStyle(container);

        const radius: number = parseFloat(borderRadius || borderTopLeftRadius || '0');
        const cornerWidth = radius + 1.2;
        const height = container.offsetHeight;
        const width = container.offsetWidth;
        const labelWidth = label ? label.offsetWidth + 12 : 0;
        const leadingStrokeLength = Math.abs(10 - cornerWidth);

        const pathMiddle = 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius
            + 'v' + (height - (2 * cornerWidth))
            + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius
            + 'h' + (-width + (2 * cornerWidth))
            + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius
            + 'v' + (-height + (2 * cornerWidth))
            + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius;

        const startX = cornerWidth + leadingStrokeLength;
        const topWidth = width - (2 * cornerWidth) - leadingStrokeLength;

        let path = 'M' + (expanded ? startX + labelWidth : startX) + ',' + 1
                + 'h' + (expanded ? topWidth - labelWidth : topWidth)
                + pathMiddle
                + 'h' + leadingStrokeLength;
        
       svgboxpath.setAttribute('d', path);
    }

    private validateTests(): Promise<string | void> {
        const { $_tests } = this;
        let currentTestIndex = 0;

        return new Promise(resolve => {

            const final = (result) => {

                if (typeof result === 'string') {
                    resolve(result);
                } else if (currentTestIndex < $_tests.length) {
                    runTest($_tests[++currentTestIndex]);
                } else {
                    resolve();
                }
            }

            const runTest = (test) => {
                const result = test(this.params, (msg) => { this.message = msg });
                result instanceof Promise ? result.then(final) : final(result);
                currentTestIndex++;
            }

            runTest($_tests[0]);
        });
    }

    

    created() {
        if (this.value || this.expanded) {
            this.noanimate = true;
        }
    }

    mounted() {
        if (typeof this.value !== 'undefined') {
            this.updateValue(this.value);
        }

        if (this.$_box) {
            this.$nextTick(this.drawBoxSvg);
        }

        document.addEventListener
    }
}
