import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'vm-icon'
})
export class VueMappIcon extends Vue {

    @Prop([String, Number])
    size: string | number;
}