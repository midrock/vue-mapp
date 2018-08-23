import { throttle } from './optimize';

let lockListener: any = () => { };

function preventDefault(e, el) {
  const maxScroll = el.scrollHeight - el.clientHeight;

  if (e.deltaY >= 0 && e.wheelDeltaY <= 0 && el.scrollTop < maxScroll) {
    // scrolling bottom
  } else if (e.deltaY <= 0 && e.wheelDeltaY >= 0 && el.scrollTop > 0) {
    // scrolling top
  } else {
    e = e || window.event;

    if (e.preventDefault) {
      e.preventDefault();
    }

    e.returnValue = false;
  }
}

function funcForScrollKeys(e) {
  const keys = /37|38|39|40/;

  if (keys.test(String(e.keyCode))) {
    lockListener(e);
    return false;
  }
}

export function disableScroll(el) {

  if (!el) {
    console.error('The element for an exception of blocking has to be transferred');
  }

  lockListener = (e) => {
    preventDefault(e, el);
  };

  if (window.addEventListener) {
    // older FF
    window.addEventListener('DOMMouseScroll', lockListener, false);
  }
  // modern standard
  window.onwheel = lockListener;
  // older browsers, IE
  window.onmousewheel = lockListener;
  document.onmousewheel = lockListener;
  // mobile
  window.ontouchmove = lockListener;
  document.onkeydown = funcForScrollKeys;
}

export function enableScroll() {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', lockListener, false);
  }

  window.onmousewheel = null;
  document.onmousewheel = null;
  window.onwheel = null;
  // @ts-ignore
  window.ontouchmove = null;
  document.onkeydown = null;
  lockListener = null;
}

// function preventDefault(e) {
//   e = e || window.event;

//   if (e.preventDefault) {
//     e.preventDefault();
//   }

//   e.returnValue = false;
// }

// function preventDefaultForScrollKeys(e) {
//   const keys = /37|38|39|40/;

//   if (keys.test(String(e.keyCode))) {
//     preventDefault(e);
//     return false;
//   }
// }

// export function disableScroll(): void {

//   if (window.addEventListener) {
//     // older FF
//     window.addEventListener('DOMMouseScroll', preventDefault, false);
//   }
//   // modern standard
//   window.onwheel = preventDefault;
//   // older browsers, IE
//   window.onmousewheel = document.onmousewheel = preventDefault;
//   // mobile
//   window.ontouchmove = preventDefault;
//   document.onkeydown = preventDefaultForScrollKeys;
// }

// export function enableScroll(): void {

//   if (window.removeEventListener) {
//     window.removeEventListener('DOMMouseScroll', preventDefault, false);
//   }

//   window.onmousewheel = document.onmousewheel = null;
//   window.onwheel = null;
//   // @ts-ignore
//   window.ontouchmove = null;
//   document.onkeydown = null;
// }

export function move(
  onMouseMove: (e: Event) => void,
  onMouseUp: (e: Event) => void
): void {
  const mouseMove = throttle(onMouseMove);

  function mouseUp(e) {
    onMouseUp(e);
    window.removeEventListener('mouseup', mouseUp);
    window.removeEventListener('mousemove', mouseMove);
  }

  window.addEventListener('mouseup', mouseUp);
  window.addEventListener('mousemove', mouseMove);
}
