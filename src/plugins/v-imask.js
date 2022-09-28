import IMask from 'imask/esm/imask'; // imports only factory
// add needed features
import 'imask/esm/masked/number';
// import 'imask/esm/masked/dynamic';

// https://imask.js.org/guide.html

export const IMaskDirective = {
  name: 'imask',

  beforeMount(el, { value: options }) {
    if (!options) return;

    initMask(el, options);
  },

  updated(el, { value: options }) {
    el = findInputElement(el);
    if (options) {
      if (el.maskRef) {
        el.maskRef.updateOptions(options);
        if (el.value !== el.maskRef.value) el.maskRef._onChange();
      }
      else initMask(el, options);
    } else {
      destroyMask(el);
    }
  },

  unmounted(el) {
    destroyMask(el);
  },
};

function fireEvent(el, eventName, data) {
  // el.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }));
  let e = document.createEvent('CustomEvent');
  e.initCustomEvent(eventName, true, true, data);
  el.dispatchEvent(e);
}

function initMask(el, opts) {
  el = findInputElement(el);
  el.maskRef = IMask(el, opts)
    .on('accept', () => {
      console.log('accept inside', el.maskRef);
      fireEvent(el, 'accept', el.maskRef);
    })
    .on('complete', () => fireEvent(el, 'complete', el.maskRef));
}

function findInputElement(el) {
  return (el instanceof HTMLInputElement) ? el : el.querySelector('input') || el;
}

function destroyMask(el) {
  el = findInputElement(el);
  if (el.maskRef) {
    el.maskRef.destroy();
    delete el.maskRef;
  }
}
