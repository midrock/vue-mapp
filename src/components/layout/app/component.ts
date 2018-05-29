import { Vue, Component, Prop } from 'vue-property-decorator';
import { throttle } from 'src/helpers/optimize';
import { VMScreen } from '@/../types/layout';

export const SCREEN = {
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920
};

@Component({
  name: "vm-app"
})
export class VueMappApp extends Vue {
  devType: string = "";
  devSystem: string = "";
  screen: string = "";
  loading: boolean = true;

  private setScreenParams(): void {
    let screenWidth: number = window.innerWidth;
    let screenMarker: VMScreen = "sm";

    if (screenWidth < SCREEN.sm) {
      screenMarker = "xs";
    } else if (screenWidth >= SCREEN.sm && screenWidth < SCREEN.md) {
      screenMarker = "sm";
    } else if (screenWidth >= SCREEN.md && screenWidth < SCREEN.lg) {
      screenMarker = "md";
    } else if (screenWidth >= SCREEN.lg && screenWidth < SCREEN.xl) {
      screenMarker = "lg";
    } else if (screenWidth >= SCREEN.xl) {
      screenMarker = "xl";
    }

    if (this.screen !== screenMarker) {
      this.screen = screenMarker;
      this.$emit("screen", screenMarker);
    }
  }

  public get smallView(): boolean {
    return /xs|sm/.test(this.screen);
  }

  private setAgentInfo(): void {
    const agent = navigator.userAgent || navigator.vendor;
    let devType, devSystem;

    if (agent.match(/Android/i)) {
      devSystem = "android";
      devType = "mobile";
    } else if (agent.match(/iPhone|iPad|iPod/i)) {
      devSystem = "ios";
      devType = "mobile";
    } else if (agent.match(/BlackBerry/i)) {
      devSystem = "blackberry";
      devType = "mobile";
    } else if (agent.match(/Windows Phone/i)) {
      devSystem = "windowsphone";
      devType = "mobile";
    } else if (agent.match(/webOS/i)) {
      devSystem = "webos";
      devType = "media";
    } else if (agent.match(/Mac/)) {
      devSystem = "mac";
      devType = "desktop";
    } else if (agent.match(/Linux/i)) {
      devSystem = "linux";
      devType = "desktop";
    } else if (agent.match(/Windows/i)) {
      devSystem = "windows";
      devType = "desktop";
    }

    this.devSystem = devSystem;
    this.devType = devType;
  }

  created() {
    this.setAgentInfo();
  }

  mounted() {
    window.addEventListener("resize", throttle(this.setScreenParams));
    this.setScreenParams();
    // @ts-ignore
    document.fonts.onloadingdone = function(fontFaceSetEvent) {};

    // @ts-ignore
    document.fonts.ready.then(() => {
      this.loading = false;
    });
  }

  beforeDestroy() {
    window.removeEventListener("resize", throttle(this.setScreenParams));
  }
}
