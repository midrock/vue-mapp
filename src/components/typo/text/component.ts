import { Vue, Component, Prop } from 'vue-property-decorator';
import { parseSizeAttr } from 'src/helpers/parse';

@Component({
    name: 'vm-text'
})
export default class VueMappText extends Vue {

    @Prop({
        type: [Number, String],
        validator(_value) {
            const value = Number(_value);
            return value >= -3 && value <= 3;
        }
    }) size: string | number;

    private get classes() {

        return [
            parseSizeAttr(this.size), 
        ]
    }
}
