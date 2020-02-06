import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { VMCalcAxisPosition } from "src/helpers/types";
import { getCssValue } from "src/helpers/parse";
import { findElementByClass } from "src/helpers/find";
import { disableScroll, enableScroll } from "src/helpers/dom";
import { getAxisPositionStyle } from "src/helpers/calc";

@Component({
  name: "vm-popup"
})
export default class VueMappPopup extends Vue {
  trigger: HTMLElement;
  contentStyles: object = {};
  openedContentRect: ClientRect | null = null;

  $refs: {
    content: HTMLDivElement;
  };

  @Prop(String) rootClass: string;
  @Prop([String, Array, Object]) contentClass: string | any[] | object;
  @Prop(Boolean) floatTrigger: string | boolean;
  @Prop(Boolean) fillTrigger: boolean;
  @Prop(Boolean) showArrow: boolean;
  @Prop(Boolean) closeOnClick: boolean;
  @Prop(Boolean) nooverlay: boolean;
  @Prop([String, Number])
  size: string | number;
  @Prop([String, Number])
  width: string | number;
  @Prop([String, Number])
  height: string | number;

  @Prop({
    type: Number,
    default: 16
  })
  borderSpace: number;

  @Prop({
    type: [String, Number],
    default: 0
  })
  offsetX: string | number;

  @Prop({
    type: [String, Number],
    default: 0
  })
  offsetY: string | number;

  @Prop({
    type: String,
    default: "bottom left"
  })
  position: string;

  @Watch("position")
  onPositionChanged() {
    this.setPosition();
  }

  @Watch("floatTrigger")
  onTriggerChanged() {
    this.setPosition();
  }

  saveOpenedContentRect() {
    const { fillTrigger, trigger, $refs } = this;
    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = $refs.content.getBoundingClientRect();

    if (fillTrigger && contentRect.width <= triggerRect.width) {
      $refs.content.style.width = triggerRect.width + "px";
    }

    this.openedContentRect = $refs.content.getBoundingClientRect();
  }

  setPosition(): void {
    const style: {
      [key: string]: number;
    } = {};

    const triggerRect: ClientRect = this.trigger.getBoundingClientRect();
    const contentRect: ClientRect = this.$refs.content.getBoundingClientRect();

    const {
      borderSpace,
      floatTrigger,
      fillTrigger,
      position,
      openedContentRect
    } = this;

    // set X position
    const styleX = getAxisPositionStyle({
      triggerDistance: triggerRect.left,
      triggerSize: triggerRect.width,
      windowLength: window.innerWidth,
      contentSize: (() => {
        if (fillTrigger && contentRect.width <= triggerRect.width) {
          style.width = triggerRect.width;
          return triggerRect.width;
        } else if (openedContentRect) {
          return openedContentRect.width;
        } else {
          return 0;
        }
      })(),
      offset: (() => {
        const isFloat = floatTrigger && /^(left|right)(\s|$)/.test(position);
        const offset = Number(this.offsetX || 0);
        return isFloat ? offset + triggerRect.width : offset;
      })(),
      backPositionName: "left",
      frontPositionName: "right",
      distanceProp: "left",
      contentSizeProp: "width",
      space: borderSpace,
      position,
      floatTrigger: !!floatTrigger
    });

    // set Y position
    const styleY = getAxisPositionStyle({
      triggerDistance: triggerRect.top,
      triggerSize: triggerRect.height,
      windowLength: window.innerHeight,
      contentSize: (() => {
        if (fillTrigger && contentRect.height <= triggerRect.height) {
          style.height = triggerRect.height;
          return triggerRect.height;
        }
        if (openedContentRect) {
          return openedContentRect.height;
        } else {
          return 0;
        }
      })(),
      offset: (() => {
        const isFloat = floatTrigger && /^(top|bottom)(\s|$)/.test(position);
        const offset = Number(this.offsetY || 0);
        return isFloat ? offset + triggerRect.height : offset;
      })(),
      backPositionName: "top",
      frontPositionName: "bottom",
      distanceProp: "top",
      contentSizeProp: "height",
      space: borderSpace,
      position,
      floatTrigger: !!floatTrigger
    });

    this.contentStyles = getCssValue({
      ...styleX,
      ...styleY
    });
  }

  private clickOnOverlay(e): void {
    this.$emit("outside", e);
  }

  private clickOnContent(): void {
    if (this.closeOnClick) {
      this.hide();
    }
  }

  private checkPopup(e) {
    const findedElement = findElementByClass({
      element: e.toElement || e.target,
      searchClass: ["vm-popup__content", this.rootClass],
      exitElement: document.body
    });

    if (!findedElement) {
      this.hide();
    }
  }

  private onKeyPress(e: KeyboardEvent) {
    if (e.keyCode === 27) {
      this.hide();
    }
  }

  hide() {
    this.$emit("outside");
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.setPosition);
    document.removeEventListener("scroll", this.checkPopup, true);
    document.removeEventListener("keydown", this.onKeyPress, true);
    document.removeEventListener("click", this.checkPopup);
  }

  mounted() {
    const parentElement = this.$el.parentElement;

    if (parentElement) {
      this.trigger = parentElement;
    } else {
      throw new Error("trigger expected");
    }

    this.$nextTick(() => {
      if (!this.$refs.content) return;

      this.saveOpenedContentRect();
      this.setPosition();

      window.addEventListener("resize", this.setPosition);
      document.addEventListener("scroll", this.checkPopup, true);
      document.addEventListener("keydown", this.onKeyPress, true);
    });

    if (this.nooverlay) {
      document.addEventListener("click", this.checkPopup);
    } else {
      // disableScroll();
    }
  }
}
