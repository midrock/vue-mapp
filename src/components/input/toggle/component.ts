import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import InputElement from 'component/input/input-element';

@Component({
    name: 'vm-toggle'
})
export default class VueMappToggle extends InputElement {

    emitValue: boolean = false;

    @Prop([String, Boolean])
    iconRight: string | boolean;

    @Watch('value')
    updateValue(newValue) {
        this.emitValue = newValue;
    }

    public toggle() {
        if (this.status === 'disabled') return;
        
        if (this.value === undefined) {
            this.emitValue = !this.emitValue;
        }

        this.$emit('input', !this.value);
    }

    created() {
        this.emitValue = !!this.value;
    }
}