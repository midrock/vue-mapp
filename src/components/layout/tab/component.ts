import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueMappTabs } from 'component/layout/tabs';

@Component({
  name: 'vm-tab',
  inject: {
    tabs: {
      default: () => null
    }
  }
})
export default class VueMappTab extends Vue {

  _uid: string;
  active: boolean = false;
  tabs: VueMappTabs;

  @Prop(String) name: string;
  @Prop(String) headClass: string;
  @Prop([String, Boolean]) init: string | boolean;
  @Prop([String, Boolean]) disabled: string | boolean;
  @Prop({
    type: String,
    required: true
  }) label: string;

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
