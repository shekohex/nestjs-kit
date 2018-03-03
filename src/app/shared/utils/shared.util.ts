export const isUndefined = (obj): obj is undefined =>
    typeof obj === 'undefined';
export const isObject = (fn): fn is object => typeof fn === 'object';
export const isString = (fn): fn is string => typeof fn === 'string';
export const isNil = (obj): boolean => isUndefined(obj) || obj === null;
export const isEmpty = (array): boolean => !(array && array.length > 0);