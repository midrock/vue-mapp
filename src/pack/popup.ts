import VueMappMenu from 'component/popup/menu';
import VueMappModal from 'component/popup/modal';
import VueMappOutside from 'component/popup/outside';
import VueMappPopup from 'component/popup/popup';

export default function (Vue) {
    Vue.use(VueMappMenu);
    Vue.use(VueMappModal);
    Vue.use(VueMappOutside);
    Vue.use(VueMappPopup);
}
