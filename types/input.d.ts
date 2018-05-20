
export {
    VueMappButton
} from '../src/components/input/button';

export const enum VMInputState {
    INIT,
    DISABLED,
    READONLY
}

export const enum VMValidateState {
    INIT,
    NOVALIDATE,
    VALID,
    ERROR,
    PROCESS,
    CHANGED
}