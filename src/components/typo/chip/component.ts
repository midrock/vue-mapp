import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'vm-chip'
})
export class VueMappChip extends Vue {

    @Prop([Boolean, String]) static: boolean | string;

    close() {
        this.$emit('close');
    }

    click() {
        this.$emit('click');
    }
}
