import { throttle } from '../helpers';

function onScroll(e) {

    const {
        binding: {
            value
        },
        el: {
            scrollHeight,
            scrollTop,
            clientHeight,
            dataset
        }
    } = this;

    const scrollFromBelow = scrollHeight - scrollTop - clientHeight;
    const distance = value.distance || 100;

    if (scrollFromBelow <= distance && !dataset.fetching) {

        let runner;

        function unlock() {
            delete dataset.fetching;
        }
        
        if (value instanceof Function) {
            runner = value;
        } else if (value.loader instanceof Function) {
            runner = value.loader;
        }

        if (runner) {
            dataset.fetching = true;
            runner(unlock);
        }
    }
}

const elPropName = '@@VueMappInfinite';

export default {
    bind(el, binding, vnode) {
        el[elPropName] = throttle(onScroll.bind({ el, binding }));
        el.addEventListener('scroll', el[elPropName]);
    },
    unbind(el) {
        if (el && el[elPropName]) {
            el.removeEventListener('scroll', el[elPropName]);
        }
    }
};