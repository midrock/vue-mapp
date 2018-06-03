import { Vue, Component, Prop } from 'vue-property-decorator';
import { CreateElement } from 'vue/types/vue';
import { VueMappIcon } from 'component/typo/icon';
import { VueMappLoader } from 'component/event/loader';

@Component({
    name: 'vm-button',
    components: {
        'vm-icon': VueMappIcon,
        'vm-loader': VueMappLoader
    }
})
export default class VueMappButton extends Vue {

    @Prop(String) icon: string;
    @Prop(Boolean) loading: boolean;
    @Prop([String, Boolean]) primary: string | boolean;
    @Prop([String, Boolean]) raised: string | boolean;
    @Prop([String, Boolean]) disabled: string | boolean;
    @Prop([String, Boolean]) fullWidth: string | boolean;
    @Prop({
        type: String,
        default: 'button'
    })
    type: string;


    click($event: Event): void {
        
        if (!this.disabled) {
            this.$emit('click', $event);
        }
    }
}
