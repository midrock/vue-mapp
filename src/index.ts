import VueMappEventPack from './pack/event';
import VueMappInputPack from './pack/input';
import VueMappLayoutPack from './pack/layout';
import VueMappPopupPack from './pack/popup';
import VueMappTypoPack from './pack/typo';
import VueMappListPack from './pack/list';

export default function (Vue) {
    Vue.use(VueMappEventPack);
    Vue.use(VueMappInputPack);
    Vue.use(VueMappLayoutPack);
    Vue.use(VueMappPopupPack);
    Vue.use(VueMappTypoPack);
    Vue.use(VueMappListPack);
}
