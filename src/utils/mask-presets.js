// import { MAX_PRICE, MAX_QUANTITY, MAX_QUANTITY_INTEGER } from '@/config/constants';
import { isArray, isString } from '@/utils/type-checks';

// const baseFloatMaskConfig = {
//   mask: Number,
//   thousandsSeparator: ' ',
//   mapToRadix: ['.', ','],
//   signed: false,
//   unmask: true,
//   radix: '.',
//   min: 0,
// };

const baseIntMaskConfig = {
  mask: Number,
  unmask: true,
  signed: false,
  scale: 0,
  min: 0,
  thousandsSeparator: ' ',
};

export const MASK_PRESETS = {
  integer: {
    ...baseIntMaskConfig,
  },
  bin: {
    mask: '000000000000',
    unmask: true,
  },
  barcode: {
    mask: '00000000[00000]',
    unmask: true,
  },
  phone: {
    mask: '+{7} (000) 000 00 00',
    unmask: true,
    lazy: false,
  },
};

export function getMaskConfig(mask) {
  if (!mask) return null;

  let res;

  if (isString(mask)) { // mask="price"
    res = { ...MASK_PRESETS[mask] };
  } else if (isArray(mask)) { // :mask="['price', { max: 50 }]"
    res = {
      ...MASK_PRESETS[mask[0]], // пресет
      ...mask[1], // конфиг из второго элемента массива
    };
  } else { // mask="{ mask: '0000' }"
    res = { ...mask };
  }

  return res;
}
