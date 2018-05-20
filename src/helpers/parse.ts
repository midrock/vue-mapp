export function parseSizeAttr(_value: string | number): string {
    const value = Number(_value);
    const suffix = value > 0 ? "large" : "small";

    return value ? `is--${suffix}-${Math.abs(value)}` : '';
}


export function chooseDefinedValue(...data) {

    for (let idx in data) {
        const value = data[idx];

        if (value !== undefined) {
            return value;
        }
    }

    return undefined;
}

export function getCssValue(css: object) {
    const style = {};

    for (let key in css) {
        const keyValue = css[key];

        if (typeof keyValue === 'number') {
            style[key] = keyValue !== 0 ? keyValue + 'px' : keyValue;
        } else {
            style[key] = keyValue;
        }
    }

    return style;
}

export function pad(str: string | number, len: number, padString: string) {
    len = len >> 0;
    padString = String(padString || ' ');
    str = String(str);

    if (str.length > len) {
        return str;
    }

    len = len - str.length;

    if (len > padString.length) {
        // @ts-ignore
        padString += padString.repeat(len / padString.length);
    }

    return padString.slice(0, len) + str;
}