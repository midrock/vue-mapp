import { mount, shallow, Wrapper } from 'vue-test-utils';
import VueMappCheckbox from './component';
import VueMappField from '../field/component';
import { Vue } from 'vue-property-decorator';
import { checkInputElement } from '../input-element.test';

describe('Checkbox', () => {

    checkInputElement(VueMappCheckbox);

    it('работа с массивом через v-model', () => {
        const modelValue: string[] = [];

        const firstCheckbox = mount(VueMappCheckbox, {
            propsData: {
                model: modelValue,
                value: 'first'
            }
        });

        const secondCheckbox = mount(VueMappCheckbox, {
            propsData: {
                model: modelValue,
                value: 'second'
            }
        });

        firstCheckbox.trigger('click');
        expect(modelValue.indexOf('first')).toBe(0);
        expect(modelValue.length).toBe(1);

        secondCheckbox.trigger('click');
        expect(modelValue.indexOf('second')).toBe(1);
        expect(modelValue.length).toBe(2);
        
        firstCheckbox.trigger('click');
        secondCheckbox.trigger('click');
        expect(modelValue.length).toBe(0);
    });

    it('работа с массивом через vm-field', () => {
        const modelValue: string[] = [];

        function createCheckbox(value: string) {

            return {
                render: h => h(VueMappCheckbox, {
                    props: {
                        value
                    }
                }, value)
            }
        }

        const field = mount(VueMappField, {
            propsData: {
                value: modelValue
            },
            slots: {
                default: [
                    createCheckbox('first'), 
                    createCheckbox('second')
                ]
            }
        });

        const firstCheckbox = field.findAll('.vm-checkbox').at(0);
        const secondCheckbox = field.findAll('.vm-checkbox').at(1);

        firstCheckbox.trigger('click');
        expect(modelValue.indexOf('first')).toBe(0);
        expect(modelValue.length).toBe(1);

        secondCheckbox.trigger('click');
        expect(modelValue.indexOf('second')).toBe(1);
        expect(modelValue.length).toBe(2);

        firstCheckbox.trigger('click');
        secondCheckbox.trigger('click');
        expect(modelValue.length).toBe(0);
    });
})
