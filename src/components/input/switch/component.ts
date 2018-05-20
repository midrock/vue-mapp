import { Vue, Component, Prop, Provide } from 'vue-property-decorator';
import InputElement from 'component/input/input-element';
import { VueMappOption } from 'component/input/option';

@Component({
    name: 'vm-switch',
    model: {
        prop: 'value',
        event: 'select'
    }
})
export class VueMappSwitch extends InputElement {
    selectedOption: VueMappOption | null = null;
    selectedOptions: VueMappOption[] = [];
    options: VueMappOption[] = [];

    $refs: {
        options: HTMLElement
    }

    @Provide() optionContainer = this;
    @Prop(String) message: string;
    @Prop([String, Boolean]) required: string | boolean;
    @Prop([String, Boolean]) tight: string | boolean;
    @Prop([String, Boolean]) multiple: string | boolean;

    setOption(option: VueMappOption): void {
        const { selectedOption, form, multiple } = this;

        let emitValue: any = null;

        if (multiple) {
            const selectedOptions = this.selectedOptions.slice();
            
            if (option.selected) {
                selectedOptions.push(option);
            } else {
                const optionIndex = selectedOptions.indexOf(option);

                selectedOptions.splice(optionIndex, 1);
            }

            emitValue = selectedOptions.map(option => option.value);
            this.selectedOptions = selectedOptions;
            
        } else {

            if (selectedOption) {
                selectedOption.selected = false;
            }
            
            emitValue = option.value;

            this.selectedOption = option;
        }

        if (multiple && this.tight) {
            this.setOptionClasses(option);
        }

        if (form) {
            form.changed = true;
        }

        this.$emit('select', emitValue);
    }

    setOptionClasses(option) {
        const { options } = this;

        const optionIndex = options.indexOf(option);
        const isLastOption = optionIndex + 1 === options.length;
        const prevOption = optionIndex && options[optionIndex - 1];
        const nextOption = !isLastOption && options[optionIndex + 1];

        let classes = {
            'is--first': false,
            'is--last': false
        };

        if (option.selected) {

            if (isLastOption || nextOption && !nextOption.selected) {
                classes['is--last'] = true;
            } else if (nextOption) {
                nextOption.classes['is--first'] = false;
            }

            if (!prevOption || prevOption && !prevOption.selected) {
                classes['is--first'] = true;
            } else {
                prevOption.classes['is--last'] = false;
            }
        } else {

            if (nextOption && nextOption.selected) {
                nextOption.classes['is--first'] = true;
            }

            if (prevOption && prevOption.selected) {
                prevOption.classes['is--last'] = true;
            }
        }

        option.classes = classes;
    }
}
