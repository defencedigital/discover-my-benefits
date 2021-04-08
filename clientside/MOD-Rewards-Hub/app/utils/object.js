const memoize = require('fast-memoize');
const transform = require('lodash').transform;
const isEqual = require('lodash').isEqual;
const isObject = require('lodash').isObject;
/* eslint-disable */

const parseDotNotation = (str, val, obj)  => {
  let currentObj = obj;
  let keys = str.split('.');
  let i;
  let l = Math.max(1, keys.length - 1);
  let key;

  for (i = 0; i < l; ++i) {
    key = keys[i];
    currentObj[key] = currentObj[key] || {};
    currentObj = currentObj[key];
  }

  currentObj[keys[i]] = val;
  delete obj[str];
};

const expandFN = (obj) => {
  for (let key in obj) {
    if (key.indexOf('.') !== -1) {
      parseDotNotation(key, obj[key], obj);
    }
  }
  return obj;
};

const expand = memoize(expandFN);

const isJSONFN = (jsonString) => {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) { }

  return false;
};

const isJSON = memoize(isJSONFN);

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
    }
  });
}

module.exports = {
  expand,
  isJSON,
  difference,
};
