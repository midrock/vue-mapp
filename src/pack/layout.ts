import VueMappApp from 'component/layout/app';
import VueMappCard from 'component/layout/card';
import VueMappDivider from 'component/layout/divider';
import VueMappLayout from 'component/layout/layout';
import VueMappTabs from 'component/layout/tabs';

export default function (Vue) {
    Vue.use(VueMappApp);
    Vue.use(VueMappCard);
    Vue.use(VueMappDivider);
    Vue.use(VueMappLayout);
    Vue.use(VueMappTabs);
}
