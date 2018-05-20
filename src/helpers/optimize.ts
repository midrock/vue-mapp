
export function throttle(func: (...args) => void) {
    let requestId;

    const later = (context, args) => () => {
        requestId = null;
        func.apply(context, args);
    }

    const throttled: any = function (...args) {
        if ((requestId == null) || (requestId === undefined)) {
            // @ts-ignore
            requestId = requestAnimationFrame(later(this, args));
        }
        const j = {
            ...{ sdsd: 'sdsd'}
        }
    }

    throttled.cancel = () => {
        cancelAnimationFrame(requestId);
    }

    return throttled;
}
