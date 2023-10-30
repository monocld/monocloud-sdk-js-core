/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-param-reassign */

export interface UnflattenOptions {
  delimiter?: string;
  object?: boolean;
  overwrite?: boolean;
  transformKey?: (key: string) => string;
}

export interface FlattenOptions {
  delimiter?: string;
  maxDepth?: number;
  safe?: boolean;
  transformKey?: (key: string) => string;
}

function isBuffer(obj: any) {
  return (
    obj &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  );
}

function keyIdentity(key: any) {
  return key;
}

export function flatten<T, R>(target: T, opts: FlattenOptions): R {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const maxDepth = opts?.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};

  function step(object: any, prev?: any, currentDepth?: number) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach((key: string) => {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject = type === '[object Object]' || type === '[object Array]';

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key);

      if (
        !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth! < maxDepth!)
      ) {
        return step(value, newKey, currentDepth! + 1);
      }

      (output as any)[newKey] = value;
    });
  }

  step(target);

  return output as any;
}

export function unflatten<T, R>(target: T, opts?: UnflattenOptions): R {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const overwrite = opts.overwrite || false;
  const transformKey = opts.transformKey || keyIdentity;
  const result = {};

  const isbuffer = isBuffer(target);
  if (
    isbuffer ||
    Object.prototype.toString.call(target) !== '[object Object]'
  ) {
    return target as any;
  }

  // safely ensure that the key is
  // an integer.
  function getkey(key: string) {
    const parsedKey = Number(key);

    return Number.isNaN(parsedKey) || key.indexOf('.') !== -1 || opts?.object
      ? key
      : parsedKey;
  }

  function addKeys(keyPrefix: any, recipient: any, target: any) {
    return Object.keys(target).reduce((result, key) => {
      result[keyPrefix + delimiter + key] = target[key];

      return result;
    }, recipient);
  }

  function isEmpty(val: any) {
    const type = Object.prototype.toString.call(val);
    const isArray = type === '[object Array]';
    const isObject = type === '[object Object]';

    if (!val) {
      return true;
    } else if (isArray) {
      return !val.length;
    } else if (isObject) {
      return !Object.keys(val).length;
    }

    return false;
  }

  (target as any) = Object.keys(target as any).reduce((result, key) => {
    const type = Object.prototype.toString.call((target as any)[key]);
    const isObject = type === '[object Object]' || type === '[object Array]';
    if (!isObject || isEmpty((target as any)[key])) {
      (result as any)[key] = (target as any)[key];
      return result;
    } else {
      return addKeys(key, result, flatten((target as any)[key], opts!));
    }
  }, {});

  Object.keys(target as any).forEach((key: string) => {
    const split = key.split(delimiter).map(transformKey);
    let key1 = getkey(split.shift());
    let key2 = getkey(split[0]);
    let recipient = result;

    while (key2 !== undefined) {
      if (key1 === '__proto__') {
        return;
      }

      const type = Object.prototype.toString.call((recipient as any)[key1]);
      const isobject = type === '[object Object]' || type === '[object Array]';

      // do not write over falsey, non-undefined values if overwrite is false
      if (
        !overwrite &&
        !isobject &&
        typeof (recipient as any)[key1] !== 'undefined'
      ) {
        return;
      }

      if (
        (overwrite && !isobject) ||
        (!overwrite && (recipient as any)[key1] == null)
      ) {
        (recipient as any)[key1] =
          typeof key2 === 'number' && !opts?.object ? [] : {};
      }

      recipient = (recipient as any)[key1];
      if (split.length > 0) {
        key1 = getkey(split.shift());
        key2 = getkey(split[0]);
      }
    }

    // unflatten again for 'messy objects'
    (recipient as any)[key1] = unflatten((target as any)[key], opts);
  });

  return result as any;
}
