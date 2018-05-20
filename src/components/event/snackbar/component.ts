import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueMappButton } from 'component/input/button';

@Component({
    name: 'vm-snackbar',
    components: {
        'vm-button': VueMappButton
    }
})
export default class VueMappSnackbar extends Vue {
    timer: NodeJS.Timer | null = null;
    active: boolean = false;

    @Prop(Boolean) center: boolean;
    @Prop(String) text: string;
    @Prop(String) actionText: string;

    @Prop({
        type: [String, Number],
        default: 2400
    })
    duration: string | number;

    show() {
        if (!this.$el) {
            const div = document.createElement('div');

            document.body.appendChild(div);
            this.$mount(div);
        }

        this.active = true;
    }

    hide() {
        this.$emit('action', event);

        this.active = false;

        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    afterLeave() {
        this.$emit('hidden');
    }

    afterEnter() {
        const { duration } = this;

        this.$emit('shown');

        if (duration > 0) {
            this.timer = setTimeout(() => {
                this.hide();
            }, Number(this.duration));
        }
    }

    beforeDestroy() {
        this.$el.remove();
    }
}
