import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'vm-card'
})
export default class VueMappCard extends Vue {

    @Prop([String, Boolean]) 
    noshadow: string | boolean;

    @Prop([String, Boolean])
    hoverup: string | boolean;
}