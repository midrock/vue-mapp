
export type Test = (ctx: InputParams, setMessage?: (string) => void) => (boolean | Promise<string>);

export interface Template {
    length?: number;
    type?: string;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
    description?: string;
    mask?: string;
    test?: Test;
    label?: string;
    name?: string;
}

export interface InputParams extends Template {
    required: boolean;
    emitValue: string | number;
    inputValue: string | number;
}

export type Messages = { [key: string]: ((ctx: InputParams) => string) | string };