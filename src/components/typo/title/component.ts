import { Vue, Component, Prop } from 'vue-property-decorator';
import { parseSizeAttr } from 'src/helpers/parse';

@Component({
    name: 'vm-title'
})
export default class VueMappTitle extends Vue {

    level: number = 1;

    @Prop({
        type: [Number, String],
        validator(_value) {
            const value = Number(_value);
            return value >= 0 && value <= 4;
        }
    }) size: string | number;

    @Prop(Boolean) lighter: boolean;
    @Prop(Boolean) bold: boolean;
    @Prop(Boolean) medium: boolean;
    @Prop(Boolean) italic: boolean;
    @Prop(Boolean) underline: boolean;
    @Prop(Boolean) thin: boolean;

    classes() {
        
        return [
            parseSizeAttr(this.size),
            {
                'is-lighter': this.lighter,
                'is-bold': this.bold,
                'is-medium': this.medium,
                'is-thin': this.thin,
                'is-underline': this.underline,
                'is-italic': this.italic
            }
        ]
    }
}