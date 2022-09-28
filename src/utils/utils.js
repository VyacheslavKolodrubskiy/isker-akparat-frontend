import { isArray, isNaN, isNil, isNumber, isObject, isString } from '@/utils/type-checks';
import {
  APPLICATION_STATUSES,
  GROUP_STATUSES,
  ORDER_STATUSES,
  PRINT_STATUSES,
  PRODUCT_STATUSES,
} from '@/config/types';

export function fastClone(val) {
  return JSON.parse(JSON.stringify(val));
}

export function toNumber(val) {
  return val * 1;
}

export function keys(val) {
  return Object.keys(val);
}

export function values(val) {
  return Object.values(val);
}

export function isEmpty(val) {
  if (!val) return true; // null, undefined, empty string, false, 0: returns true
  if (isArray(val)) return !val.length;
  if (isObject(val)) return !keys(val).length;
}

export function removeEmpty(obj, removeEmptyStrings = false) {
  if (!obj) return {};

  return Object.entries(obj)
    .filter(([_, v]) => v != null && (removeEmptyStrings ? v !== '' : true))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

export function removeEmptyObjInArray(arr) {
  if (!Array.isArray(arr)) return {};

  return arr
    .map(item => removeEmpty(item, true))
    .filter(el => Object.keys(el).length);
}

export function numOr0(number, throwError = false) {
  if (isNil(number)) return 0;
  if (isNumber(number)) return number;

  if (isString(number)) {
    let tmpNumber = toNumber(number);

    if (isNaN(tmpNumber)) {
      if (throwError) throw new Error('Wrong number formatting');

      number = number.replace(/\s/g, '');
      number = number.replace(',', '.');
      number = toNumber(number);
      tmpNumber = isNaN(number) ? 0 : number;
    }

    if (throwError) throw new Error('Wrong number formatting');

    return tmpNumber;
  }

  // throw
  return 0;
}

export function getTextWithHighlights(text, searchText) {
  const regex = new RegExp(searchText, 'gi');
  return text.replace(regex, '<mark class="bg-gray-400 p-0">$&</mark>');
}

export function extendForSelect(obj = {}, label = 'title', value = 'id') {
  return { ...obj, label: obj[label], value: obj[value] };
}

function getStatusVariant(types, statusId) {
  const status = types.find(status => status.id === statusId);
  if (!status) return 'gray';

  return status.variant;
}

export function getOrderStatusVariant(statusId) {
  return getStatusVariant(ORDER_STATUSES, statusId);
}

export function getGroupStatusVariant(statusId) {
  return getStatusVariant(GROUP_STATUSES, statusId);
}

export function getProductStatusVariant(statusId) {
  return getStatusVariant(PRODUCT_STATUSES, statusId);
}

export function getApplicationStatusVariant(statusId) {
  return getStatusVariant(APPLICATION_STATUSES, statusId);
}

export function getPrintStatusVariant(statusId) {
  return getStatusVariant(PRINT_STATUSES, statusId);
}
