import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { checkEventElement } from 'src/helpers/find';

@Component({
    name: 'vm-outside',
    model: {
        prop: 'active',
        event: 'close'
    }
})
export default class VueMappOutside extends Vue {

    @Prop(Boolean) active: boolean;
    @Prop(String) contentClass: string;
    @Prop([String, Boolean]) nooverlay: string | boolean;
    
    @Prop({
        type: [Number, String],
        default: 256
    }) size: string | number;

    @Prop({
        type: String,
        default: 'right'
    }) place: string;

    @Watch('active')
    waitClick(value) {
        value ? this.show() : this.hide();
    }

    public show() {
        window.addEventListener('keydown', this.onKeyPress);

        if (this.nooverlay) {
            window.addEventListener('click', this.closeOnFocusLost, true);
        }
       
        this.$emit('opened');
    }

    public hide() {
        window.removeEventListener('click', this.closeOnFocusLost, true);
        window.removeEventListener('keydown', this.onKeyPress);
        this.$emit('close');
    }

    private onKeyPress(e: KeyboardEvent) {
        if (e.keyCode === 27) {
            this.hide();
        }
    }

    private closeOnFocusLost(e) {
        const focusLost = !checkEventElement(e, /vm\-outside/);
        
        if (focusLost) {
            this.hide();
        }
    }

    private clickOnOverlay(e): void {
        this.$emit('overlay', e);
        this.hide();
    }

    mounted() {
        document.body.appendChild(this.$el);
    }

    beforeDestroy() {
        this.$el.remove();
    }
}