import InputElement from 'component/input/input-element';
import autosize from 'src/helpers/autosize';
import { Component, Watch, Prop } from 'vue-property-decorator';
import { VueMappInput } from 'component/input/input';

@Component({
  name: 'vm-textarea',
  components: {
    'vm-input': VueMappInput,
  },
})
export class VueMappTextarea extends InputElement {
  inputValue: string | number = '';
  focused: boolean = false;

  @Prop([String, Number])
  rows: string | number;
  @Prop(String)
  placeholder: string;
  @Prop({
    type: String,
    default: '-1',
  })
  tabindex: string;

  $refs: {
    textarea: HTMLInputElement;
    wrapper: HTMLDivElement;
    container: HTMLDivElement;
    label: HTMLDivElement;
    svgboxpath: SVGPathElement;
    input: any;
  };

  private get $_box(): boolean {
    const { form, box } = this;

    if (box !== null) {
      return !!box;
    } else {
      return !!(form && form.box);
    }
  }

  @Watch('box')
  updateView() {
    this.$nextTick(this.updateAutosize);
  }

  @Watch('value')
  updateFromPropValue(value) {
    if (value !== this.inputValue) {
      this.inputValue = value;
      this.$nextTick(() => {
        this.updateAutosize();
        this.drawBox();
      })
    }
  }

  onFocus($event) {
    if (/readonly|disabled/.test(this.status)) return;
    this.focused = true;
    this.$emit('focus', $event);
  }

  onBlur($event) {
    const { form } = this;

    this.focused = false;

    if ((form && !form.validateOnSubmit) || !this.novalidate) {
      this.validate();
    }

    this.$emit('blur', $event);
  }

  onInput($event) {
    if (this.$refs.textarea.value !== this.inputValue) {
      // this.VMInputCheckState = 'changed';
      this.$emit('input', $event.target.value);
      this.inputValue = $event.target.value;
    }
    this.drawBox();
  }

  drawBox() {
    this.$nextTick(() => {
      this.$refs.input.drawBoxSvg();
    });
  }

  updateAutosize() {
    autosize.update(this.$refs.textarea);
  }

  mounted() {
    this.inputValue = this.value;
    this.$nextTick(() => {
      autosize(this.$refs.textarea);
      this.updateAutosize();
    });
  }
}
