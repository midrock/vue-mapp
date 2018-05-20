import { VueMappList, VueMappListItem } from './component';
import './css/index.css';

export default function (Vue) {
    Vue.component('vm-list', VueMappList);
    Vue.component('vm-list-item', VueMappListItem);
}

export {
    VueMappList,
    VueMappListItem
}
