import { Vue, Component } from 'vue-property-decorator';

@Component({
    name: 'vm-tag'
})
export class VueMappTag extends Vue {

    get isAction() {
        return !!this.$listeners.click
    }
}