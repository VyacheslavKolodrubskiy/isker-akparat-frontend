export function getRawType(value) {
  // returns original type of value
  // (boolean, number, string, symbol, function, object, array, set, map, error, date, regexp)
  const { toString } = Object.prototype;
  const str = toString.call(value);

  return str.slice(8, -1).toLowerCase();
}

export const isString = (value) => getRawType(value) === 'string';
export const isObject = (value) => getRawType(value) === 'object';
export const isArray = (value) => getRawType(value) === 'array';
export const isNumber = (value) => getRawType(value) === 'number';
export const isFunction = (value) => getRawType(value) === 'function';
export const isFile = (value) => getRawType(value) === 'file';

// An `NaN` primitive is the only value that is not equal to itself.
export const isNaN = (value) => isNumber(value) && value !== +value;

export const isNil = (value) => value == null;
