import { mount, Wrapper } from 'vue-test-utils';
import { VueConstructor } from 'vue/types/vue';

export function checkInputElement(constructor: VueConstructor) {

    describe('ds', () => {
        it('проверка передачи события @input', () => {
            const wrapper = mount(constructor);
            wrapper.trigger('click');
            expect(wrapper.emitted().input).toBeTruthy();
        });

        it('передача аттрибута label', () => {

            const wrapper = mount(constructor, {
                propsData: {
                    label: 'first'
                }
            });

            const name = wrapper.name();
            const labelElement = wrapper.find(`.${name}__label`);
            const props = wrapper.props();
            const label = props && props.label;

            expect(labelElement.text()).toBe(label);
        });
    })
    // commonTests(constructor);


}
