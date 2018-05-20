import VueMappSnackbar from './component';
import { VMSnackbarOptions } from './types';
import './css/index.css';

let activeSnackbar: VueMappSnackbar | null = null;
let nextSnackbar: VueMappSnackbar | null = null;

export function snackbar(options: VMSnackbarOptions = {}) {

    const snackbar = new VueMappSnackbar({
        propsData: {
            text: options.text,
            center: options.center,
            actionText: options.actionText,
            duration: options.duration
        }
    });

    if (options.action instanceof Function) {
        snackbar.$once('action', options.action);
    }

    snackbar.$once('hidden', () => {
        snackbar.$destroy();

        if (nextSnackbar) {
            activeSnackbar = nextSnackbar;
            activeSnackbar.show();
            nextSnackbar = null;
        } else {
            activeSnackbar = null;
        }
    });

    if (activeSnackbar) {
        nextSnackbar = snackbar;
        activeSnackbar.hide();
    } else {
        activeSnackbar = snackbar;
        snackbar.show();
    }

    return snackbar;
}


export default function (Vue) {
    Vue.component('vm-snackbar', VueMappSnackbar);
}

export {
    VueMappSnackbar
}
