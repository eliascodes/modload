/*
* Utility functions for the autoloader
*/
'use strict'

const fs = require('fs')

const all = (a) => a.reduce((prev, curr) => !!prev && !!curr)

const any = (a) => a.reduce((prev, curr) => !!prev || !!curr)

const isa = (a, type) => {
  if (typeof a === type) return true
  try {
    return a instanceof type
  } catch (e) {
    return false
  }
}

const isarrayof = (a, type) => all(a.map((x) => isa(x, type)))

const isdir = (f) => fs.statSync(f).isDirectory()

const isPlainObject = (o) => {
  if (Object.prototype.toString.call(o) !== '[object Object]') {
    return false
  } else {
    const prototype = Object.getPrototypeOf(o)
    return prototype === null || prototype === Object.prototype
  }
}

/**
* Methods relating to construction of nested objects
*/
const createNestedObject = {
  /**
  * Constructs nested object reflecting array
  * @returns {object} The nested object
  * @param {array} arr - array from which to construct object
  * @param {any} val - value to assign to the deepest level object key
  */
  fromArray: function (arr, val) {
    if (!arr || arr.length === 0) return {}

    let o = {}
    let v = val || null

    if (arr.length > 1) {
      v = this.fromArray(arr.slice(1), v)
    }

    o[arr[0]] = v
    return o
  },

  /**
  * Constructs nested object reflecting string
  * @returns {object} The nested object
  * @param {string} str - string from which to construct object
  * @param {string} sep - separator with which to split the string
  * @param {any} val - value to assign to the deepest level object key
  */
  fromString: function (str, sep, val) {
    if (!str || str.length === 0) return {}
    const parts = str.split(sep).filter((s) => s)
    return this.fromArray(parts, val)
  }
}


/**
* Merges objects recursively. Conflicts are resolved by privileging the second argument.
* @returns {object} Recursively merged object
* @param {object} o1 - First object to merge: taken as the base
* @param {object} o2 - Second object to merge: overwrites the base
*/
function mergeObjects (o1, o2) {
  let m = o1
  for (let attr in o2) {
    let v = o2[attr]
    if (attr in m && isPlainObject(v) && isPlainObject(m[attr])) {
      m[attr] = mergeObjects(m[attr], v)
    } else {
      m[attr] = v
    }
  }
  return m
}

/**
* Creates function to validate and transform objects.
* Useful for parsing of options objects
* @returns {object} Parsed, validated and transformed object
* @param {object} defaults - of default values used if absent from object being parsed
* @param {object} validators - of methods used to validate values of object being parsed
* @param {object} mappers - of methods used to transform values after successful validation
*/
function parser (defaults, validators, mappers) {
  return function (opts) {
    const merged = mergeObjects(defaults, opts)

    Object.keys(merged).forEach((key) => {
      if (! validators[key](merged[key])) {
        throw new Error('Error validating ' + key)
      }

      if (mappers) merged[key] = mappers[key](merged[key])
    })

    return merged
  }
}

module.exports = {
  all: all,
  any: any,
  is: {
    a: isa,
    dir: isdir,
    arrayof: isarrayof,
    plainObject: isPlainObject
  },
  object: {
    merge: mergeObjects,
    parser: parser,
    createNested: createNestedObject,
  }
}
