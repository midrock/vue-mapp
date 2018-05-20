import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { CreateElement, VueConstructor } from 'vue/types/vue';

@Component({
    name: 'vm-tabs'
})
export class VueMappTabs extends Vue {

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

    public addTab(tab: VueMappTab) {
        this.tabs.push(tab);
    }

    public setActiveTab(tab: VueMappTab) {
        if (this.activeTab) {
            this.activeTab.active = false;
        }

        this.activeTab = tab;
        tab.active = true;
        this.$emit('tabClick', tab);
    }

    public removeTab(tab: VueMappTab) {
        const tabIndex = this.tabs.indexOf(tab);

        if (tabIndex >= 0) {
            this.tabs.splice(tabIndex, 1);
        }
    }

    mounted() {
        if (!this.activeTab) {
            const firstTab = this.tabs[0];
            
            this.setActiveTab(firstTab);
        }
    }
}

@Component({
    name: 'vm-tab'
})
export class VueMappTab extends Vue {

    container: VueMappTabs;
    active: boolean = false;
    
    _uid: string;
    $parent: VueMappTabs;

    @Prop({
        type: String,
        required: true
    }) label: string;
    @Prop(String) name: string;
    @Prop([String, Boolean]) init: string | boolean;
    @Prop([String, Boolean]) disabled: string | boolean;
    
    render(h: CreateElement) {
        return h('div', {
            staticClass: 'vm-tab__content',
            style: {
                display: this.active ? null : 'none'
            }
        }, this.$slots.default);
    }

    created() {
        const parent = this.$parent;
        
        if (parent && parent.$options.name === 'vm-tabs') {
            this.container = parent;
            parent.addTab(this);

            if (this.init) {
                parent.setActiveTab(this);
            }
        }
    }

    beforeDestroy() {
        this.container.removeTab(this);
    }
}
