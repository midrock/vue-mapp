import VueMappTabs from './component';
import { VueMappTab } from 'component/layout/tab';
import './css/index.css';

export default function (Vue) {
    Vue.component('vm-tab', VueMappTab);
    Vue.component('vm-tabs', VueMappTabs);
}

export {
    VueMappTabs 
};
