import { VueConstructor } from 'vue/types/vue';
import scrollend from "./scrollend";

export default function(Vue) {
    Vue.directive('v-scrollend', scrollend);
}
