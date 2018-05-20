import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { throttle } from 'src/helpers/optimize';

@Component({
    name: 'vm-modal'
})
export class VueMappModal extends Vue {

    html: HTMLElement;

    private $_onScroll: (() => {}) = throttle(this.onScroll)

    setScrollListener() {
        return throttle(this.onScroll);
    }

    onScroll(e) {
        console.log(e);
    }

    private clickOnOverlay(e) {
        this.$emit('close');
    }

    private disableBackground() {
        const html = document.getElementsByTagName('html')[0];
        html.style.overflow = 'hidden';
    }

    private enableBackground() {
        const html = document.getElementsByTagName('html')[0];
        html.style.overflow = null;
    }

    mounted() {
        const layout = document.getElementById('vm-layout');
        const target = layout || document.body;

        target.appendChild(this.$el);
        this.disableBackground();
    }

    beforeDestroy() {
        this.enableBackground();
    }

    destroyed() {
        this.$el.remove();
    }
}