import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueMappModal } from 'component/popup/modal';
import { VueMappButton } from 'component/input/button';
import { VueMappTitle } from 'component/typo/title';
import { parseSizeAttr } from 'src/helpers/parse';
import { VMDialogAction } from './types';

@Component({
    name: 'vm-dialog',
    components: {
        'vm-modal': VueMappModal,
        'vm-button': VueMappButton,
        'vm-title': VueMappTitle
    }
})
export class VueMappDialog extends Vue {

    @Prop(String)
    title: string;

    @Prop({
        type: [String, Number],
        validator(value) {
            return /[1-3]/.test(value);
        }
    })
    size: string | number;

    @Prop(String)
    content: string;

    @Prop({
        type: Array,
        default: () => []
    })
    actions: VMDialogAction[];

    get classes(): string[] {
        return [parseSizeAttr(this.size)];
    }

    actionClick(action?: Function) {

        if (action instanceof Function) {
            action();
        } else {
            this.$emit('action');
        }
    }
}

