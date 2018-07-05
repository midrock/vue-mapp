import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueMappTabs } from 'component/layout/tabs';

@Component({
  name: 'vm-tab',
  inject: {
    tabs: {
      default: () => null,
    },
  },
})
export default class VueMappTab extends Vue {
  _uid: string;
  active: boolean = false;
  tabs: VueMappTabs;

  @Prop(String) name: string;
  @Prop(String) headClass: string;
  @Prop(String) icon: string;
  @Prop(Boolean) init: boolean;
  @Prop(Boolean) disabled: boolean;
  @Prop(Boolean) closable: boolean;

  @Prop({
    type: String,
    required: true,
  })
  label: string;

  get isIcon(): boolean {
    return !!(
      this.closable ||
      this.icon ||
      this.$slots.left ||
      this.$slots.right
    );
  }

  created() {
    const { tabs } = this;

    if (tabs) {
      tabs.addTab(this);

      if (this.init) {
        tabs.setActiveTab(this);
      }
    }
  }

  beforeDestroy() {
    if (this.tabs) {
      this.tabs.removeTab(this);
    }
  }
}
