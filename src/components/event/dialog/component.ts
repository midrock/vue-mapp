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
        }

        this.$emit('action');
    }

    focusFirstInput() {
        const first = this.$el.querySelector('input:not(:disabled), button:not(:disabled)')

        if (first) {
            // @ts-ignore
            first.focus()
        }
    }

    focusLastInput() {
        const inputs = this.$el.querySelectorAll('input:not(:disabled), button:not(:disabled)')
        

        if (inputs.length > 0) {
            const last = inputs[inputs.length - 1]

            if (last) {
                // @ts-ignore
                last.focus()
            }
        }
    }

    onKeyPress(e) {

        if (e.key === 'Escape') {
            this.$emit('action');
        }

        if (e.key !== 'Tab') return

        const inputs = this.$el.querySelectorAll('input:not(:disabled), button:not(:disabled)')

        if (inputs.length > 0) {
            const last = inputs[inputs.length - 1]
            const first = inputs[0]

            if (last === e.target) {
                e.preventDefault()
                this.focusFirstInput()
            } else if (e.shiftKey && first === e.target) {
                e.preventDefault()
                this.focusLastInput()
            }
        }
    }

    mounted() {
        window.addEventListener('keydown', this.onKeyPress, false)

        this.$nextTick(() => {
            this.focusFirstInput()
        })
    }

    beforeDestroy() {
        window.removeEventListener('keydown', this.onKeyPress, false)
    }
}

