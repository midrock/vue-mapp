import { Vue, Component } from 'vue-property-decorator';
import { disableScroll, enableScroll } from "src/helpers/dom";

@Component({
    name: 'vm-modal'
})
export class VueMappModal extends Vue {

    private clickOnOverlay(e) {
        this.$emit('close');
    }

    mounted() {
        disableScroll(this.$el);
    }

    beforeDestroy() {
        enableScroll();
    }
}
