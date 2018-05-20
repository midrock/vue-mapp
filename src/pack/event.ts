import VueMappDialog from 'component/event/dialog';
import VueMappLoader from 'component/event/loader';
import VueMappSnackbar from 'component/event/snackbar';

export default function (Vue) {
    Vue.use(VueMappDialog);
    Vue.use(VueMappLoader);
    Vue.use(VueMappSnackbar);
}
