import { VueMappDialog } from './component';
import { VMDialogParams } from './types';
import { PluginFunction, PluginObject } from 'vue/types';
import './css/index.css';

function dialog(params: VMDialogParams) {

    const div = document.createElement('div');
    const dialog = new VueMappDialog({
        propsData: {
            ...params
        }
    });

    dialog.$once('action', () => {
        dialog.$el.remove();
        dialog.$destroy();

        const focusedElement = document.querySelector('[data-focused]')

        if (focusedElement) {
            // @ts-ignore
            focusedElement.focus()
            // @ts-ignore
            delete focusedElement.dataset.focused
        }
    });

    
    // @ts-ignore
    if (params.event && params.event.target) {
        // @ts-ignore
        params.event.target.dataset.focused = true
    }

    document.body.appendChild(div);
    dialog.$mount(div);
}

export {
    VueMappDialog,
    dialog
}

export default function(Vue) {
    Vue.component('vm-dialog', VueMappDialog);   
}