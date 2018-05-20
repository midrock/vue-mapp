import InputElement from "./input-element";
import { VueMappOption } from './option';

export type VMInputState =
    | 'init'
    | 'disabled'
    | 'readonly'
    ;

export type VMInputCheckState =
    | 'init'
    | 'novalidate'
    | 'valid'
    | 'error'
    | 'process'
    | 'changed'
    ;

export interface VMOptionContainer {
    model: any;
    firstSelectedOption: VueMappOption | null;
    isMultiple: boolean;
    options: VueMappOption[];
    setOption: (option: VueMappOption) => void;
    showPopup: () => void;
    hidePopup: () => void;
    initOption: (option: VueMappOption) => void;
}
