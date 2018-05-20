import { CreateElement } from 'vue';
import { Vue, Component, Prop, Inject} from 'vue-property-decorator';
import { VNode } from 'vue/types/vnode';
// import 'intersection-observer'; 

let timer;

@Component({
    name: 'vm-tape',
    provide() {
        return {
            vmTape: this
        }
    }
})
export default class VueMappTape extends Vue {
    observer: IntersectionObserver | null = null;

    @Prop()
    items: any[];

    @Prop()
    stackSize: number;

    get itemsCount() {
        return this.items.length - 1;
    }

    get stacksCount() {
        return Math.ceil(this.items.length / this.stackSize);
    }

    render(h: CreateElement) {
        const { stacksCount } = this;
        const stacks: VNode[] = [];

        for (let i = 0; i < stacksCount; i++) {
            const stack = h(VueMappTapeStack, {
                props: {
                    order: i
                },
                scopedSlots: {
                    default: (stack) => {
                        return this.$scopedSlots.default({ item: stack.item })
                    }
                }
            });

            stacks.push(stack);
        }

        return h('div', {
            class: {
                'tape-wrapper': true
            }
        }, stacks);
    }

    onIntersect(entries, observer) {

        entries.forEach((entry, i) => {
            const { target } = entry;

            if (entry.isIntersecting) {

                target.classList.remove('is--hidden');

                // if (timer) {
                //     clearTimeout(timer);
                // }

                // const hide = () => {
                //     target.classList.remove('is--hidden');
                // }

                // timer = setTimeout(hide, 10);
                
            } else {
                entry.target.classList.add('is--hidden');
            }
        })
    }

    mounted() {
        this.observer = new IntersectionObserver(this.onIntersect, {
            root: this.$el.parentElement,
            rootMargin: '0px',
            threshold: 0
        });
    }
}

@Component({
    name: 'vm-tape-stack'
})
export class VueMappTapeStack extends Vue {
    
    @Prop()
    order: number;

    @Inject()
    vmTape: VueMappTape;

    get itemIndexes(): number[] {
        const {
            vmTape: {
                stackSize,
                itemsCount
            },
            order
        } = this;

        const firstElement = order * stackSize;
        let lastElement = firstElement + stackSize - 1;

        if (lastElement > itemsCount) {
            lastElement = itemsCount;
        }

        let indexes: number[] = [];

        for (let i = firstElement; i <= lastElement; i++) {
            indexes.push(i);
        }

        return indexes;
    }

    render(h: CreateElement) {
        const { vmTape: { items }, itemIndexes, $scopedSlots } = this;

        return h('div', {
            staticClass: 'tape-stack'
        }, itemIndexes.map(index => {

            return $scopedSlots.default({
                item: items[index]
            })
        }))
    }

    mounted() {
        const {
            vmTape: {
                observer: intersectionObserver
            }
        } = this;

        if (intersectionObserver) {
            intersectionObserver.observe(this.$el);
        }
    }
}
