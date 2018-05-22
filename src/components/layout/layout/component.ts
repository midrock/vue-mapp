import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { VueMappApp } from 'component/layout/app';
import { throttle } from 'src/helpers/optimize';
import { SCREEN } from '../app/component';
import { VMScreen } from '@/../types/layout';

@Component({
    name: 'vm-layout',
    components: {
        'vm-app': VueMappApp
    }
})
export class VueMappLayout extends Vue {

    winHeight: number = 0;
    winWidth: number = 0;
    contentHeight: number = 0;
    contentWidth: number = 0;
    screen: string = '';
    loading: boolean = true;
    private touches: Touch[] = [];
    private asideActive: boolean = false;

    $refs: {
        header: HTMLElement,
        main: HTMLElement,
        aside: HTMLElement
    }

    @Prop(String) title: string;
    @Prop(String) subtitle: string;
    @Prop(Boolean) hideTitleOnAsideFixed: boolean;
    @Prop([String, Boolean]) subtitleUnderTitle: string | boolean;
    @Prop({ 
        type: String,
        default: 'lg'
    }) 
    asideFixed: VMScreen;

    private get $_asideFixed(): boolean {
        return SCREEN[this.screen] >= SCREEN[this.asideFixed];
    }

    private get $_showTitle(): boolean {
        return !!this.title && !(this.$_asideFixed && this.hideTitleOnAsideFixed);
    }

    private get $_showHeaderBottom(): boolean {
        return !!this.$slots['header-bottom'];
    }

    private get $_subtitleUnderTitle(): boolean {
        const v = this.subtitleUnderTitle;
        return !!v && (typeof v === 'boolean' || v.indexOf(this.screen) >= 0);
    }

    public get smallView(): boolean {
        return /xs|sm/.test(this.screen);
    }

    @Watch('$_showHeaderBottom')
    private onChangeHeaderBottom() {
        this.setContentHeight();
    }

    @Watch('$_asideFixed')
    private onAsideFixedChanged() {
        this.$nextTick(() => {
            this.setContentWidth();
        });
    }

    private setContentHeight(): void {
        this.contentHeight = window.innerHeight - this.$refs.header.clientHeight;
    }

    private setContentWidth(): void {
        const asideWidth = this.$_asideFixed ? this.$refs.aside.clientWidth : 0;
        this.contentWidth = window.innerWidth - asideWidth;
    }

    private onScreenChanged(screen: string) {
        this.screen = screen;
        this.$emit('screen', screen);
    }

    private onWindowResize(): void {
        const winHeight = window.innerHeight;
        const winWidth = window.innerWidth;

        if (this.winHeight !== winHeight) {
            this.winHeight = winHeight;
            this.setContentHeight();
        }

        if (this.winWidth !== winWidth) {
            this.winWidth = winWidth;
            this.setContentWidth();
        }
    }

    private onTouchStart(e: TouchEvent) {
        if (e.changedTouches.length === 1 || this.touches.length === 1) {
            this.touches.push(e.changedTouches[0]);
        }
    }

    private onTouchEnd(e: TouchEvent) {
        if (this.touches.length === 1 && e.touches.length === 0) {

            const startX = this.touches[0].clientX;
            const endX = e.changedTouches[0].clientX;

            if (endX > startX && startX < 24 &&
                !this.asideActive &&
                window.innerWidth >= this.$el.clientWidth) {
                this.asideActive = true;
            } else if (startX - endX > 50 && this.asideActive) {
                this.asideActive = false;
            }
        }
        this.touches.length = 0;
    }

    private onTouchCancel() {
        this.touches.length = 0;
    }

    mounted() {
        window.addEventListener('resize', throttle(this.onWindowResize));
        this.onWindowResize();

        const that = this;
        // @ts-ignore
        document.fonts.onloadingdone = function (fontFaceSetEvent) {

        };

        // @ts-ignore
        document.fonts.ready.then(i => {
            that.loading = false;
        })
    }

    beforeDestroy() {
        window.removeEventListener('resize', throttle(this.onWindowResize));
    }
}
