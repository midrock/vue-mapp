import { VMCalcAxisPosition } from "./types";

export function getAxisPositionStyle(params: VMCalcAxisPosition): object {

    const {
        triggerDistance,
        triggerSize,
        windowLength,
        contentSize,
        offset,
        backPositionName,
        frontPositionName,
        distanceProp,
        contentSizeProp,
        space,
        position,
        floatTrigger
    } = params;

    const style: object = {};
    const min = space;
    const max = windowLength - space;
    const maxContent = max - min;

    const endBack = Math.min(triggerDistance + triggerSize - offset, max);
    const startFront = triggerDistance + offset;
    const endFront = startFront + contentSize;
    const startBack = endBack - contentSize;

    const maxContentBack = endBack - min;
    const maxContentFront = max - startFront;

    const backRegExp = new RegExp(backPositionName);
    const frontRegExp = new RegExp(frontPositionName);


    function setSize(max) {

        if (contentSize > max) {
            style[contentSizeProp] = max;
        }
    }

    if (frontRegExp.test(position)) {

        if (floatTrigger) {
            style[distanceProp] = startFront;

            if (contentSize > maxContentFront) {

                if (maxContentBack > maxContentFront) {
                    style[distanceProp] = Math.max(startBack, min);
                    setSize(maxContentBack);
                } else {
                    setSize(maxContentFront);
                }
            }
        } else {

            if (endFront > max) {
                style[distanceProp] = Math.max(startFront - endFront + max, min);
            } else {
                style[distanceProp] = startFront;
            }
        }
    } else if (backRegExp.test(position)) {

        if (floatTrigger) {
            style[distanceProp] = Math.max(startBack, min);

            if (contentSize > maxContentBack) {

                if (maxContentFront > maxContentBack) {
                    style[distanceProp] = Math.max(startFront, min);
                    setSize(maxContentFront);
                } else {
                    setSize(maxContentBack);
                }
            }
        } else {
            style[distanceProp] = startBack < min ? min : startBack;
        }
    } else {
        const startCenter = Math.max(triggerDistance + (triggerSize / 2) - (contentSize / 2), min);
        const endCenter = startCenter + contentSize;

        if (endCenter > max) {
            style[distanceProp] = Math.max(startCenter - endCenter + max, min);
        } else {
            style[distanceProp] = startCenter;
        }
    }

    if (typeof style[contentSizeProp] !== 'number') {
        setSize(maxContent);
    }

    return style;
}
