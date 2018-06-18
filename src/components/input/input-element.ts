import { Vue, Component, Prop } from 'vue-property-decorator';
import { VMInputState, VMInputCheckState } from './types';
import VueMappForm from 'component/input/form/component';
import VueMappField from 'component/input/field/component';
import { nullLiteral } from 'babel-types';

@Component({
    inject: {
        form: {
            default: () => null
        },
        field: {
            default: () => null
        }
    }
})
export default class InputElement extends Vue {

    injectStatus: VMInputState = 'init';
    validateStatus: VMInputCheckState = 'init';
    form?: VueMappForm;
    field?: VueMappField;
    emitValue?: any;

    @Prop() value: any;
    @Prop() model: any;
    @Prop(String) label: string;
    @Prop(String) name: string;
    @Prop(String) size: string;
    @Prop(Boolean) required: boolean;
    @Prop(Boolean) disabled: boolean;
    @Prop(Boolean) readonly: boolean;
    @Prop(Boolean) novalidate: boolean;
    @Prop({
        type: Boolean,
        default: null
    })
    box: boolean;
    
    get status(): VMInputState {
        const { form, field, injectStatus } = this;
        const status = (field && field.status) || 
                       (form && form.status) || 
                       injectStatus;

        if (status === 'disabled' || this.disabled) {
            return 'disabled';
        }

        if (status === 'readonly' || this.readonly) {
            return 'readonly';
        }

        return 'init';
    }

    get freezed(): boolean {
        return /disabled|readonly/.test(this.status);
    }

    async validate() {
        return Promise.resolve('novalidate');
    }

    clear(e?): void {}

    created() {
        const { form } = this;

        if (form) {
            form.inputComponents.push(this);
        }
    }

    destroyed() {
        const { form } = this;

        if (form) {
            const { inputComponents } = form;
            const index = inputComponents.indexOf(this);

            if (index >= 0) {
                inputComponents.splice(index, 1);
            }
        }
    }
}
