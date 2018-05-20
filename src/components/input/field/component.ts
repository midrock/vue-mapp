import InputElement from 'component/input/input-element';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
    name: 'vm-field',
    provide() {
        return {
            field: this
        }
    }
})
export default class VueMappField extends InputElement {

    emitValue: any = null;

    @Prop(String) 
    message: string;

    @Watch('emitValue')
    updateValue(newValue, oldValue) {
        if (this.freezed) return;
        this.$emit('input', newValue);
    }

    @Watch('value')
    updateEmitValue(newValue) {
        this.emitValue = newValue;
    }

    created() {
        this.emitValue = this.value;
    }
}