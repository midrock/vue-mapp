import { Vue, Component, Prop } from 'vue-property-decorator';
import InputElement from 'component/input/input-element';

@Component({
    name: 'vm-radio',
    model: {
        prop: 'model',
        event: 'input'
    }
})
export default class VueMappRadio extends InputElement {

    @Prop() model: any;
    @Prop({ 
        required: true 
    }) value: any;

    init: boolean = false
    isFocused: boolean = false

    private get checked(): boolean {
        const fieldValue = this.field && this.field.emitValue;
        const modelValue = /undefined|null/.test(fieldValue) ? this.model : fieldValue;
        
        return this.value === modelValue;
    }

    public get emitValue(): boolean {
        return this.checked ? this.value : null;
    }

    public click() {
        if (this.status === 'disabled') return;
        
        if (this.field) {
            this.field.emitValue = this.value;
        }

        this.$emit('input', this.value);
    }

    mounted() {
        
        if (this.init) {
            this.click();
        }
    }
}
