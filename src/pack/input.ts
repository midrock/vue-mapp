import VueMappButton from 'component/input/button';
import VueMappCheckbox from 'component/input/checkbox';
import VueMappForm from 'component/input/form';
import VueMappSelect from 'component/input/select';
import VueMappOption from 'component/input/option';
import VueMappInput from 'component/input/input';
import VueMappDate from 'component/input/date';
import VueMappField from 'component/input/field';
import VueMappRadio from 'component/input/radio';
import VueMappSwitch from 'component/input/switch';
import VueMappToggle from 'component/input/toggle';

export default function(Vue) {
    Vue.use(VueMappButton);
    Vue.use(VueMappCheckbox);
    Vue.use(VueMappForm);
    Vue.use(VueMappSelect);
    Vue.use(VueMappOption);
    Vue.use(VueMappInput);
    Vue.use(VueMappDate);
    Vue.use(VueMappField);
    Vue.use(VueMappRadio);
    Vue.use(VueMappSwitch);
    Vue.use(VueMappToggle);
}
