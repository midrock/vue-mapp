import { VueMappTextarea } from './component';
import './css/index.css';
import autosize from 'autosize';

export default function (Vue) {
    Vue.component('vm-textarea', VueMappTextarea);
}

export {
    VueMappTextarea
}
