import { Component, Prop, Provide, Watch } from 'vue-property-decorator';
import InputElement from 'component/input/input-element';
import { VueMappOption } from 'component/input/option';
import { removeFromArray } from 'src/helpers/modify';

@Component({
  name: 'vm-switch',
  model: {
    prop: 'value',
    event: 'select'
  }
})
export class VueMappSwitch extends InputElement {
  selectedOption: VueMappOption | null = null;
  selectedOptions: VueMappOption[] = [];
  options: VueMappOption[] = [];

  $refs: {
    options: HTMLElement
  }

  @Provide() optionContainer = this;
  @Prop(Boolean) margin: boolean;
  @Prop(Boolean) multiple: boolean;

  get emitValue() {   
    if (this.multiple) {
      return this.selectedOptions.map(option => option.value);
    } else {
      return this.selectedOption ? this.selectedOption.value : null;
    }
  }

  setOption(option: VueMappOption): void {
    if (this.multiple) {
      this.setOptionMultiple(option)
    } else {
      this.setOptionSingle(option)
    }

    this.$emit('select', this.emitValue);

    if (this.form) {
      this.form.change();
    }
  }

  setOptionSingle(option: VueMappOption) {
    const { selectedOption } = this;

    if (option.selected) {
      if (selectedOption && selectedOption !== option) {
        selectedOption.selected = false;
      }
      this.selectedOption = option;
    } else {
      this.selectedOption = null;
    }
  }

  setOptionMultiple(option: VueMappOption) {
    const selectedOptions = this.selectedOptions.slice();

    if (option.selected) {
      selectedOptions.push(option);
    } else {
      removeFromArray(selectedOptions, option);
    }

    this.selectedOptions = selectedOptions;

    if (!this.margin) {
      this.setOptionsClasses(option);
    }
  }

  setOptionsClasses(option) {
    const { options } = this;

    const optionIndex = options.indexOf(option);
    const isLastOption = optionIndex + 1 === options.length;
    const prevOption = optionIndex && options[optionIndex - 1];
    const nextOption = !isLastOption && options[optionIndex + 1];

    let classes = {
      'is--first': false,
      'is--last': false
    };

    if (option.selected) {

      if (isLastOption || nextOption && !nextOption.selected) {
        classes['is--last'] = true;
      } else if (nextOption) {
        nextOption.classes['is--first'] = false;
      }

      if (!prevOption || prevOption && !prevOption.selected) {
        classes['is--first'] = true;
      } else {
        prevOption.classes['is--last'] = false;
      }
    } else {

      if (nextOption && nextOption.selected) {
        nextOption.classes['is--first'] = true;
      }

      if (prevOption && prevOption.selected) {
        prevOption.classes['is--last'] = true;
      }
    }

    option.classes = classes;
  }
}
