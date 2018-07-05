import { Vue, Component, Prop } from 'vue-property-decorator';
import { CreateElement } from 'vue/types/vue';
import { VueMappIcon } from 'component/typo/icon';
import { VueMappLoader } from 'component/event/loader';

@Component({
  name: 'vm-button',
  components: {
    'vm-icon': VueMappIcon,
    'vm-loader': VueMappLoader,
  },
})
export default class VueMappButton extends Vue {
  @Prop(String) icon: string;
  @Prop(Boolean) loading: boolean;
  @Prop(Boolean) shadow: boolean;
  @Prop(Boolean) primary: boolean;
  @Prop(Boolean) raised: boolean;
  @Prop(Boolean) disabled: boolean;
  @Prop(Boolean) readonly: boolean;
  @Prop(Boolean) fullWidth: boolean;
  @Prop({
    type: String,
    default: 'button',
  })
  type: string;

  click($event: Event): void {
    if (!this.disabled && !this.readonly) {
      this.$emit('click', $event);
    }
  }
}
