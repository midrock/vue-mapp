import InputElement from "component/input/input-element";
import autosize from "src/helpers/autosize";
import { Component, Watch, Prop } from "vue-property-decorator";
import { VueMappInput } from "component/input/input";

@Component({
  name: "vm-textarea",
  components: {
    "vm-input": VueMappInput
  }
})
export class VueMappTextarea extends InputElement {
  inputValue: string | number = '';
  focused: boolean = false;

  @Prop([String, Number]) rows: string | number;
  @Prop(String) placeholder: string;

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

  @Watch("box")
  updateView() {
    this.$nextTick(() => {
      autosize.update(this.$refs.textarea);
    });
  }

  onFocus($event) {
    if (/readonly|disabled/.test(this.status)) return;
    this.focused = true;
    this.$emit("focus", $event);
  }

  onBlur($event) {
    const { form } = this;

    this.focused = false;

    if ((form && !form.validateOnSubmit) || !this.novalidate) {
      this.validate();
    }

    this.$emit("blur", $event);
  }

  onInput($event) {
    console.log('input')
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
    })
  }

  mounted() {
    autosize(this.$refs.textarea);
  }
}