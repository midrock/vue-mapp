import InputElement from 'component/input/input-element';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator';
import { VMOptionContainer } from '../types';
import { removeFromArray } from 'src/helpers/modify';

@Component({
  name: 'vm-option',
  inheritAttrs: false
})
export class VueMappOption extends InputElement {

  hidden: boolean = false;
  selected: boolean = false;
  classes: string[] = [];

  @Prop(Boolean) init: boolean;

  @Inject('optionContainer')
  container: VMOptionContainer;

  get text(): string {
    const { $el } = this;

    // @ts-ignore
    return this.label || ($el && $el.innerText) || '';
  }

  click() {
    const { container } = this;

    if (!this.freezed) {
      this.selected = !this.selected;
      container.setOption(this);
    }
  }

  created() {
    const { container } = this;

    if (!container) {
      throw new Error('vm-option can not be used outside of the container');
    }

    const { model, isMultiple } = this.container;
    const noModelValue = /null|undefined/.test(model);

    if (noModelValue) {

      if (this.init) {
        this.selected = true;
        this.container.setOption(this);
      }
    } else {

      if (isMultiple) {
        this.selected = model.indexOf(this.value) >= 0;
      } else {
        this.selected = this.value === model;
      }
    }

    this.container.options.push(this);
  }

  beforeDestroy() {
    removeFromArray(this.container.options, this);
  }
}
