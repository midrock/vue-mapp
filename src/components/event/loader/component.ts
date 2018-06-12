import { Vue, Component, Prop } from 'vue-property-decorator';
import { parseSizeAttr } from 'src/helpers/parse'; 

@Component({
  name: 'vm-loader'
})
export class VueMappLoader extends Vue {

  @Prop(Number) size: number;

  get classes() {
    return [parseSizeAttr(this.size)];
  }
}
