import InputElement from 'component/input/input-element';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
    name: 'vm-checkbox',
    model: {
        prop: 'model',
        event: 'input'
    }
})
export default class VueMappCheckbox extends InputElement {
    emitValue: boolean = false;

    $refs: {
        input: HTMLInputElement
    }

    @Prop(Boolean) iconRight: boolean;
    @Prop([Boolean, Array]) model: boolean | any[];
    @Prop({
        type: String,
        default: '-1',
    })
    tabindex: string;

    @Watch('model')
    updateValue(newValue) {
        this.emitValue = newValue;
    }

    private get modelValue(): boolean | any[] {
        const fieldValue = this.field && this.field.emitValue;
        return /undefined|null/.test(fieldValue) ? this.model : fieldValue;
    }

    get checked(): boolean {
        const { modelValue } = this;

        if (modelValue instanceof Array) {
            return modelValue.indexOf(this.value) >= 0;
        } else {
            return !!this.emitValue;
        }
    }

    click($event?) {
        const { modelValue } = this;

        if (modelValue instanceof Array) {

            if (this.checked) {
                const idx = modelValue.indexOf(this.value);
                modelValue.splice(idx, 1);
            } else {
                modelValue.push(this.value);
            }
        } else {
            this.emitValue = !this.emitValue;
            this.$emit('input', this.emitValue, $event);
        }

        this.form && this.form.change();
        this.$emit('click');
    }

    created() {
        if (typeof this.modelValue === 'boolean') {
            this.emitValue = this.modelValue;
        }
    }
}
