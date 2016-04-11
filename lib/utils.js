/*
* Utility functions for the autoloader
*/
'use strict'

const fs = require('fs')

const all = (a) => a.reduce((acc, curr) => acc && curr)

const any = (a) => a.reduce((acc, curr) => acc || curr)

const isa = (a, type) => typeof a === type || a instanceof type

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

function merge (o1, o2) {
  let m = o1
  for (let attr in o2) {
    let v = o2[attr]
    if (attr in m && isPlainObject(v)) {
      m[attr] = merge(m[attr], v)
    } else {
      m[attr] = v
    }
  }
  return m
}

function parser (defaults, validators, mappers) {
  return function (opts) {
    const merged = merge(defaults, opts)

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
  isa: isa,
  isdir: isdir,
  isarrayof: isarrayof,
  object: {
    merge: merge,
    parser: parser,
    createNested: createNestedObject,
  }
}
