export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 === null || obj2 === null) {
    return false;
  }

  if (typeof obj1 === 'undefined' || typeof obj2 === 'undefined') {
    return false;
  }

  if (obj1 instanceof Array && obj2 instanceof Array) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (const key in obj1) {
      if (!deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }

  if (typeof obj1 === 'object' && typeof obj2 === 'object' && !(obj1 instanceof Array) && !(obj2 instanceof Array)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const key in obj1) {
      if (typeof obj1[key] !== 'object' && typeof obj2[key] !== 'object') {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }

      if (typeof obj1[key] === 'function' && typeof obj2[key] === 'function') {
        if (obj1[key].toString() !== obj2[key].toString()) {
          return false;
        }
      }

      if (!deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}
