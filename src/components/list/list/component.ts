import { Vue, Component, Prop, Provide, Inject } from 'vue-property-decorator';
import { VueMappIcon } from 'component/typo/icon';
import { VNode } from 'vue/types';

@Component({
    name: 'vm-list'
})
export class VueMappList extends Vue {

    @Provide()
    container: VueMappList = this;

    @Prop([String, Boolean])
    nav: string | boolean;

    @Prop([String, Boolean])
    icon: string | boolean;

    @Prop([String, Boolean])
    nowrap: string | boolean;

    @Prop([String, Boolean])
    expanded: string | boolean;

    @Prop(Boolean)
    disabled: boolean;
}

@Component({
    name: 'vm-list-item'
})
export class VueMappListItem extends Vue {

    closed: boolean = true;
    haveSublist: boolean = false;

    @Inject()
    container: VueMappList;

    @Prop([String, Boolean])
    disabled: string | boolean;

    @Prop([String, Boolean])
    active: string | boolean;

    @Prop({
        type: String,
        default: '-1',
      })
    tabindex: string;

    render(h) {
        const { closed } = this;
        const defaultSlot = this.$slots.default || [];
        const listItems: VNode[] = [];
        const childs: VNode[] = [];
        let link: any;
        let haveSublist = false;

        defaultSlot.forEach((child, idx) => {
            const options = child.componentOptions;
            const tag = options && options.tag;

            switch(tag) {
                case 'vm-list-item':
                    listItems.push(child); break;
                case 'router-link':
                    link = child; break;
                default:
                    childs.push(child);
            }
        });

        let entry;

        const entryParams = {
            class: {
                'vm-list__item-head': true
            },
            attrs: {
                tabindex: this.tabindex
            },
            on: {
                click: this.click,
                keyup: this.keyup,
            }
        };

        if (link) {
            link.data = { ...link.data, ...entryParams };
            entry = link;
        } else if (listItems.length || this.$slots.expand) {
            haveSublist = true;

            entry = [
                h('div', entryParams, [
                    childs,
                    h(VueMappIcon, {
                        staticClass: 'vm-list__item-expander'
                    }, 'keyboard_arrow_up')
                ]),
                h('div', {
                    staticClass: 'vm-list__expand'
                }, [
                    listItems,
                    this.$slots.expand
                ])
            ];
        } else {
            entry = h('div', entryParams, childs);
        }

        this.haveSublist = haveSublist;

        return h('div', {
            staticClass: 'vm-list__item',
            attrs: {
                disabled: this.disabled
            },
            class: {
                'is--closed': haveSublist && closed,
                'is--opened': haveSublist && !closed,
                'is--active': this.active
            }
        }, [
            entry
        ]);
    }

    public keyup(e) {
        if (e.keyCode === 13) {
            this.click(e);
            // Останавливаем всплытие события
            e.stopPropagation()
            // Останавливаем стандартный обработчик keyup для этого элемента
            e.preventDefault()
        }
    }

    public click(e) {
        if (this.disabled) return;

        if (this.haveSublist) {
            this.closed = !this.closed;
        }

        this.$emit('click', e);
    }

    created() {
        this.closed = !this.container.expanded;
    }
}
