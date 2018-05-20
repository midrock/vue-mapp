import InputElement from 'component/input/input-element';
import { VueConstructor } from 'vue/types/vue';
import { Vue, Component, Prop, Watch, Provide, Inject } from 'vue-property-decorator';
import { VueMappInput } from 'component/input/input';
import { VueMappIcon } from 'component/typo/icon';
import { VueMappMenu } from 'component/popup/menu';
import { VueMappButton } from 'component/input/button';
import { VueMappCheckbox } from 'component/input/checkbox';
import { VueMappOption } from 'component/input/option';
import { VueMappChip } from 'component/typo/chip';
import { VueMappDivider } from 'component/layout/divider';
import { VueMappLoader } from 'component/event/loader';
import { findElementByClass } from 'src/helpers/find';
import { nullLiteralTypeAnnotation } from 'babel-types';

@Component({
    name: 'vm-select',
    model: {
        prop: 'value',
        event: 'select'
    },
    inheritAttrs: false,
    components: {
        'vm-input': VueMappInput,
        'vm-button': VueMappButton,
        'vm-menu': VueMappMenu,
        'vm-checkbox': VueMappCheckbox,
        'vm-chip': VueMappChip,
        'vm-divider': VueMappDivider,
        'vm-loader': VueMappLoader
    }
})
export class VueMappSelect extends InputElement {
    opened: boolean = false;
    emitValue: any | any[] = null;
    selectedOption: VueMappOption | null = null;
    selectedOptions: VueMappOption[] = [];
    options: VueMappOption[] = [];
    fieldValue: string = '';
    popupFilterValue: string = '';
    noFilteredOptions: boolean = false;

    $refs: {
        menu: VueMappMenu,
        menuInput: VueMappInput,
        options: HTMLElement
    }

    @Provide() optionContainer = this;
    @Prop([String, Boolean]) multiple: string | boolean;
    @Prop([String, Boolean]) hideArrow: string | boolean;
    @Prop([String, Boolean]) filter: string;
    @Prop([String, Boolean]) multiline: string | boolean;
    @Prop([String, Boolean]) showClearButton: string | boolean;

    @Watch('value')
    updateFromModel(modelValue) {
        if (modelValue === this.emitValue) return;

        if (modelValue instanceof Array) {
            const { options } = this;

            for (let i = 0; i < options.length; i++) {
                const option = options[i];

                option.selected = modelValue.indexOf(option.value) >= 0;
            }
        }
    }

    private get isAsync(): boolean {
        return /async/.test(this.filter);
    }

    get isMultiple() {
        return this.multiple || this.value instanceof Array;
    }

    get optionComponent(): VueConstructor | null {
        return this.isMultiple ? VueMappCheckbox : null;
    }

    get filterInField(): boolean {
        return /field/.test(this.filter);
    }

    get isEmpty(): boolean {
        const { emitValue } = this;

        if (this.isMultiple) {
            return emitValue.length === 0;
        } else {
            return emitValue === null;
        }
    }

    private setOptionsVisibility(text: string): void {
        const searchRegex = new RegExp(text, 'i');
        const { options } = this;

        let finded = false;

        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const matched = searchRegex.test(option.text);

            option.hidden = !matched;
            finded = matched;
        }

        this.popupFilterValue = text;
        this.noFilteredOptions = !finded;
    }

    private clearPopupFilter(): void {
        this.$refs.menuInput.clear();
        this.popupFilterValue = '';

        this.options.forEach(option => {
            option.hidden = false;
        });
    }

    private onFilterInput(inputValue: string): void {

        if (this.filterInField) {

            if (!inputValue && this.fieldValue) {
                this.clear();
            } else {
                this.fieldValue = inputValue;
            }
        } else {
            this.popupFilterValue = inputValue;
        }

        if (!this.isAsync) {
            this.setOptionsVisibility(inputValue);
        }

        this.$emit('input', inputValue);
    }

    private onFieldFocus() {
        this.show();
    }

    setOption(option: VueMappOption): void {
        const { selectedOption, form } = this;

        let emitValue: any = null;

        if (this.isMultiple) {
            const options = this.selectedOptions.slice();
            
            if (option.selected) {
                options.push(option);
            } else {
                const idx = options.indexOf(option);

                options.splice(idx, 1);
            }

            options.sort(((a, b) => a.text.length - b.text.length));
            emitValue = options.map(option => option.value);
            this.selectedOptions = options;
        } else {

            if (selectedOption) {
                selectedOption.selected = false;
            }
            
            emitValue = option.value;
            this.fieldValue = option.text;
            this.selectedOption = option;
        }

        if (form) {
            form.changed = true;
        }

        this.$emit('select', emitValue);

        if (!this.isMultiple) {
            this.hide();
        }
    }

    clear(): void {
        this.selectedOption = null;
        this.fieldValue = '';
        this.emitValue = null;
        this.popupFilterValue = '';
        this.noFilteredOptions = false;

        this.selectedOptions.forEach(option => {
            option.selected = false;
            option.hidden = false;

            if (option.init) {
                this.setOption(option);
            }
        });
        
        this.selectedOptions = [];
        this.$emit('select', '');
    }

    hide() {
        const { selectedOption } = this;

        if (!this.multiple) {

            if (selectedOption) {
                this.fieldValue = selectedOption.text;
            } else {
                this.fieldValue = '';
            }
        }

        this.opened = false;
        this.$emit('close');
    }

    show() {
        this.opened = true;
        this.$emit('focus');
    }

    // private onMenuExpanded(): void {
    //     this.scrollToActiveItem();
    //     window.addEventListener('keydown', this.onKeyPress);
    // }

    // private scrollToActiveItem(): void {
    //     const { multiple, firstOption } = this;

    //     if (multiple || !firstOption) return;

    //     this.$nextTick(() => {
    //         const optionTop = firstOption.$el.offsetTop;
    //         const optionHeight = firstOption.$el.clientHeight;
    //         const container = this.$refs.items.parentElement
    //         const { offsetHeight, scrollHeight } = container;
    //         const topMax = offsetHeight - optionHeight;
    //         const scrollMax = scrollHeight - offsetHeight;
    //         const scrollTop = Math.min(optionTop - offsetHeight + optionHeight * 2, scrollMax);

    //         container.scrollTop = scrollTop;
    //     })
    // }

    created() {
        
        if (this.multiple && !this.value) {
            this.emitValue = [];
        }

        console.log('created', this.value);
    }
}
