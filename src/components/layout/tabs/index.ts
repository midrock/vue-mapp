import { VueMappTab, VueMappTabs } from './component';
import './css/index.css';

export default function (Vue) {
    Vue.component('vm-tabs', VueMappTabs);
    Vue.component('vm-tab', VueMappTab);
}

export { 
    VueMappTab, 
    VueMappTabs 
};
