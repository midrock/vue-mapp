import VueMappEventPack from './pack/event';
import VueMappInputPack from './pack/input';
import VueMappPopupPack from './pack/popup';
import VueMappTypoPack from './pack/typo';
import VueMappListPack from './pack/list';
import VueMappLayoutPack from './pack/layout';

export default function (Vue) {
    Vue.use(VueMappEventPack);
    Vue.use(VueMappInputPack);
    Vue.use(VueMappPopupPack);
    Vue.use(VueMappTypoPack);
    Vue.use(VueMappListPack);
    Vue.use(VueMappLayoutPack);
}
