import InputElement, { } from 'component/input/input-element';
import { Component, Prop } from 'vue-property-decorator';
import { VMInputState } from '../types';
import { VueMappSubmitData } from './types';

@Component({
  name: 'vm-form',
  provide() {
    return {
      form: this
    }
  }
})
export default class VueMappForm extends InputElement {
  changed: boolean = false;
  inputComponents: InputElement[] = [];

  @Prop({
    type: Boolean,
    default: true,
  }) freezeOnSubmit: boolean;

  @Prop([Boolean, String])
  submitOnEnter: string | boolean;

  @Prop([Boolean, String])
  validateOnSubmit: string | boolean;

  private onEnterSubmit() {
    if (this.submitOnEnter) {
      this.submit();
    }
  }

  public submit(event?): void {
    if (this.freezed) return;

    const data = {};

    let promises: Promise<any>[] = [];

    this.inputComponents.forEach((cmp: InputElement) => {

      if (cmp.emitValue !== undefined) {
        data[cmp.name] = cmp.emitValue;
      }

      if (cmp.validateStatus !== undefined && !cmp.novalidate) {
        promises.push(cmp.validate());
      }

    });

    Promise.all(promises).then(result => {

      const allValid: boolean = result.every(status => {
        return /valid|novalidate/.test(status)
      });

      if (allValid) {
        const submitData: VueMappSubmitData<object> = {
          data: JSON.parse(JSON.stringify(data)),
          event: event || null,
          form: this
        };

        if (this.freezeOnSubmit) {
          this.injectStatus = 'readonly';
        }

        this.$emit('submit', submitData);
        this.changed = false;
      }
    });
  }

  public clear() {
    this.inputComponents.forEach(cmp => {
      if (cmp.clear instanceof Function) {
        cmp.clear();
      }
    })
  }

  change() {

    this.$emit('change');
  }

  public enable() {
    this.injectStatus = 'init';
  }
}
