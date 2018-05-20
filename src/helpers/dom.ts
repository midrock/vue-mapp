
function preventDefault(e) {
    e = e || window.event;
    
    if (e.preventDefault) {
        e.preventDefault();
    }
        
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    const keys = /37|38|39|40/;

    if (keys.test(String(e.keyCode))) {
        preventDefault(e);
        return false;
    }
}

export function disableScroll(): void {

    if (window.addEventListener) {
        // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    }   
    // modern standard
    window.onwheel = preventDefault;
    // older browsers, IE
    window.onmousewheel = document.onmousewheel = preventDefault;
    // mobile
    window.ontouchmove = preventDefault; 
    document.onkeydown = preventDefaultForScrollKeys;
}

export function enableScroll(): void {
   
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }

    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    // @ts-ignore
    window.ontouchmove = null;
    document.onkeydown = null;
}
