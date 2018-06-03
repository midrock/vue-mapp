import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { VueMappTab } from 'component/layout/tab';

@Component({
    name: 'vm-tabs',
    provide() {
        return {
            tabs: this
        }
    }
})
export default class VueMappTabs extends Vue {

    tabs: VueMappTab[] = [];
    activeTab: VueMappTab | null = null;

    @Prop([String, Boolean]) showDivider: string | boolean;
    @Prop(String) active: string;
    @Prop({
        type: String,
        validator: function(value) {
            return (/center|right|justify/).test(value);
        }
    }) align: string;

    @Watch('active')
    setTabByName(name: string) {
        if (!name) return;

        const { tabs } = this;

        for (let idx in tabs) {
            const tab = tabs[idx];

            if (tab.name === name) {
                this.setActiveTab(tab);
            }
        }
    }

    private tabClick(tab: VueMappTab) {
        this.setActiveTab(tab);
        tab.$emit('click');
    }

    public addTab(tab: VueMappTab) {
        this.tabs.push(tab);
    }

    public setActiveTab(tab: VueMappTab) {
        if (this.activeTab) {
            this.activeTab.active = false;
        }

        this.activeTab = tab;
        tab.active = true;
    }

    public removeTab(tab: VueMappTab) {
        const tabIndex = this.tabs.indexOf(tab);

        if (tabIndex >= 0) {
            this.tabs.splice(tabIndex, 1);
        }
    }

    mounted() {
        const { tabs } = this;

        if (!this.activeTab && tabs.length) {            
            this.setActiveTab(tabs[0]);
        }
    }
}
