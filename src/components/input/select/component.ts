import InputElement from 'component/input/input-element';
import { VueConstructor } from 'vue/types/vue';
import { Component, Prop, Watch, Provide } from 'vue-property-decorator';
import { VueMappInput } from 'component/input/input';
import { VueMappMenu } from 'component/popup/menu';
import { VueMappButton } from 'component/input/button';
import { VueMappCheckbox } from 'component/input/checkbox';
import { VueMappOption } from 'component/input/option';
import { VueMappChip } from 'component/typo/chip';
import { VueMappDivider } from 'component/layout/divider';
import { VueMappLoader } from 'component/event/loader';
import { VueMappPopup } from 'src/components/popup/popup';
import { removeFromArray } from 'src/helpers/modify';

@Component({
  name: 'vm-select',
  model: {
    prop: 'value',
    event: 'select'
  },
  inheritAttrs: false,
  components: {
    'vm-input': VueMappInput,
    'vm-button': VueMappButton,
    'vm-menu': VueMappMenu,
    'vm-checkbox': VueMappCheckbox,
    'vm-chip': VueMappChip,
    'vm-divider': VueMappDivider,
    'vm-loader': VueMappLoader
  }
})
export class VueMappSelect extends InputElement {
  opened: boolean = false;
  selectedOption: VueMappOption | null = null;
  selectedOptions: VueMappOption[] = [];
  options: VueMappOption[] = [];
  fieldValue: string = '';
  popupFilterValue: string = '';
  noFilteredOptions: boolean = false;

  $refs: {
    menu: VueMappMenu,
    menuInput: VueMappInput,
    popup: VueMappPopup,
    options: HTMLElement
  }

  @Provide() optionContainer = this;
  @Prop(Boolean) filter: string;
  @Prop(String) placeholder: string;
  @Prop(Boolean) multiple: boolean;
  @Prop(Boolean) hideArrow: boolean;
  @Prop(Boolean) multiline: boolean;
  @Prop({
    type: Boolean,
    default: true,
  }) showClearButton: boolean;

  @Watch('value')
  updateFromModel(modelValue) {
    if (modelValue === this.emitValue) return;

    if (modelValue instanceof Array) {
      const { options } = this;

      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        option.selected = modelValue.indexOf(option.value) >= 0;
      }
    }
  }

  @Watch('multiple')
  transformValue(multiple) {
    const { selectedOption } = this;

    if (multiple) {
      if (selectedOption) {
        this.setOption(selectedOption);
        this.selectedOption = null;
      }
      this.fieldValue = '';
    } else {
      this.selectedOptions.forEach((option, idx) => {
        if (idx === 0) {
          this.setOption(option);
        } else {
          option.selected = false;
        }
      });
      this.selectedOptions = [];
    }
  }

  get emitValue() {
    if (this.multiple) {
      return this.selectedOptions.map(option => option.value);
    } else {
      return this.selectedOption ? this.selectedOption.value : null;
    }
  }

  private get isAsync(): boolean {
    return /async/.test(this.filter);
  }

  get modelIsArray() {
    return this.multiple || this.value instanceof Array;
  }

  get optionComponent(): VueConstructor | null {
    return this.modelIsArray ? VueMappCheckbox : null;
  }

  get filterInField(): boolean {
    return /field/.test(this.filter);
  }

  get isEmpty(): boolean {
    const { emitValue } = this;

    if (this.modelIsArray) {
      return emitValue && emitValue.length === 0;
    } else {
      return emitValue === null;
    }
  }

  private setOptionsVisibility(text: string): void {
    const searchRegex = new RegExp(text, 'i');
    const { options } = this;

    let finded = false;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const matched = searchRegex.test(option.text);

      option.hidden = !matched;
      finded = matched;
    }

    this.popupFilterValue = text;
    this.noFilteredOptions = !finded;
  }

  private clearPopupFilter(): void {
    this.$refs.menuInput.clear();
    this.popupFilterValue = '';

    this.options.forEach(option => {
      option.hidden = false;
    });
  }

  private onFilterInput(inputValue: string): void {

    if (this.filterInField) {

      if (!inputValue && this.fieldValue) {
        this.clear();
      } else {
        this.fieldValue = inputValue;
      }
    } else {
      this.popupFilterValue = inputValue;
    }

    if (this.isAsync) {
      this.setOptionsVisibility(inputValue);
    }

    this.$emit('input', inputValue);
  }

  setOption(option: VueMappOption): void {

    if (this.multiple) {
      this.setOptionMultiple(option);
    } else {
      this.setOptionSingle(option);
      this.hide();
    }

    this.$emit('select', this.emitValue);

    this.form && this.form.change();
  }

  private setOptionSingle(option: VueMappOption) {
    const { selectedOption } = this;

    if (selectedOption && selectedOption !== option) {
      selectedOption.selected = false;
    }

    this.selectedOption = option;
    this.fieldValue = option.text;
  }

  private setOptionMultiple(option: VueMappOption) {
    const selectedOptions = this.selectedOptions.slice();

    if (option.selected) {
      selectedOptions.push(option);
    } else {
      removeFromArray(selectedOptions, option);
    }

    selectedOptions.sort(((a, b) => a.text.length - b.text.length));
    this.selectedOptions = selectedOptions;
  }

  removeOption(option: VueMappOption) {
    option.selected = false;
    this.setOption(option);
  }

  clear(): void {
    this.selectedOption = null;
    this.fieldValue = '';
    this.popupFilterValue = '';
    this.noFilteredOptions = false;

    this.selectedOptions.forEach(option => {
      option.selected = false;
      option.hidden = false;

      if (option.init) {
        this.setOption(option);
      }
    });

    this.selectedOptions = [];
    this.$emit('select', '');
  }

  hide() {
    const { selectedOption } = this;

    if (!this.multiple) {

      if (selectedOption) {
        this.fieldValue = selectedOption.text;
      } else {
        this.fieldValue = '';
      }
    }

    this.opened = false;
    this.$emit('close');
  }

  show() {
    this.opened = true;
    this.$emit('focus');
    this.$refs.popup.saveOpenedContentRect();
    this.$refs.popup.setPosition();
  }

  get fieldClickable() {
    return !this.multiple && !this.filterInField;
  }


  private onFieldInput(e) {
    this.onFilterInput(e);
  }

  private onFieldFocus() {
    this.show();
  }

  private onFieldBlur() {
    this.opened ? null : this.hide()
  }

  private onFieldClick() {
    if (this.fieldClickable) {
      this.show();
    }
  }


  // private onMenuExpanded(): void {
  //     this.scrollToActiveItem();
  //     window.addEventListener('keydown', this.onKeyPress);
  // }

  // private scrollToActiveItem(): void {
  //     const { multiple, firstOption } = this;

  //     if (multiple || !firstOption) return;

  //     this.$nextTick(() => {
  //         const optionTop = firstOption.$el.offsetTop;
  //         const optionHeight = firstOption.$el.clientHeight;
  //         const container = this.$refs.items.parentElement
  //         const { offsetHeight, scrollHeight } = container;
  //         const topMax = offsetHeight - optionHeight;
  //         const scrollMax = scrollHeight - offsetHeight;
  //         const scrollTop = Math.min(optionTop - offsetHeight + optionHeight * 2, scrollMax);

  //         container.scrollTop = scrollTop;
  //     })
  // }
}
