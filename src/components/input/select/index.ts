import { VueMappSelect } from './component';
import VueMappOption from 'component/input/option';
import './css/index.css';

export default function (Vue) {
    Vue.component('vm-select', VueMappSelect);
    Vue.use(VueMappOption);
}

export {
    VueMappSelect
}
