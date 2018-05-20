import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { findElementByClass } from 'src/helpers/find';
import { getCssValue } from 'src/helpers/parse';
import { VueMappPopup } from 'component/popup/popup';

let openedHoverMenu: VueMappMenu | null = null;

@Component({
    name: 'vm-menu',
    inheritAttrs: false,
    components: {
        'vm-popup': VueMappPopup
    }
})
export default class VueMappMenu extends Vue {

    hoverActive: boolean = false;
    opened: boolean = false;
   
    @Prop([String, Boolean])
    manual: string | boolean;

    $refs: {
        popup: VueMappPopup,
        trigger: HTMLDivElement
    }

    @Prop([String, Boolean])
    showOnHover: string | boolean;

    @Prop([String, Boolean])
    closeOnClick: boolean | string;

    show() {

        if (openedHoverMenu && openedHoverMenu !== this) {
            openedHoverMenu.hide();
        }

        if (this.showOnHover) {
            openedHoverMenu = this;
        }

        this.opened = true;
    }

    hide() {
        this.hoverActive = false;

        document.removeEventListener('click', this.onGlobalClick, true);

        if (openedHoverMenu === this) {
            openedHoverMenu = null;
        }

        

        this.opened = false;
        this.$emit('hide');

    }

    private clickOnOverlay(e): void {
        if (!this.manual) {
            this.hide();
        }

        this.$emit('overlay', e);
    }

    private clickOnTrigger(): void {
        if (this.manual) return;

        if (this.opened && this.hoverActive) {
            this.hoverActive = false;
            document.addEventListener('click', this.onGlobalClick, true);
        } else {
            if (this.opened && !this.hoverActive) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    private onOutClick(e) {

        if (!this.manual && !this.hoverActive) {
            // if (this.checkMenuElement(e)) return;
            this.hide();
        }
    }

    private mouseoverTrigger(): void {
        if (this.showOnHover && !this.opened) {
            this.hoverActive = true;
            this.clickOnTrigger();
        }
    }

    private mouseoutTrigger(): void {

    }

    private mouseoutContent(): void {
        
        if (this.hoverActive) {
            this.hoverActive = false;
            this.hide();
        }
    }

    private onGlobalClick(e: Event) {
        if (this.checkMenuElement(e)) return;
        this.hide();
    }

    private checkMenuElement(e: Event): boolean {
        
        return !!findElementByClass({
            element: e.target,
            searchClass: ['vm-popup', 'vm-menu'],
            exitElement: this.$el.parentNode
        });
    }

    mounted() {

        if (!this.$refs.trigger) {
            throw new Error('trigger expected');
        }
    }
}
