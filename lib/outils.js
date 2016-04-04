/*
* Construct object recursively from file path
*/
'use strict'

const path = require('path')

function fromFilePath (fpath, value) {
  if (!fpath || fpath.length === 0) return {}
  let fobj = path.parse(fpath)
  let fparts = fobj.dir.split(path.sep).filter((part) => part).concat(fobj.name)
  return fromFileParts(fparts, value)
}

function fromFileParts (fparts, value) {
  if (!fparts || fparts.length === 0) return {}

  let o = {}
  let v = value || null

  if (fparts.length > 1) {
    v = fromFileParts(fparts.slice(1), v)
  }

  o[fparts[0]] = v
  return o
}

function merge (o1, o2) {
  let m = o1
  for (let attr in o2) {
    let v = o2[attr]
    if (attr in m && v !== null && typeof v === 'object') {
      m[attr] = merge(m[attr], v)
    } else {
      m[attr] = v
    }
  }
  return m
}

function parser (defaults, validators) {
  return function (opts) {
    let merged = merge(defaults, opts)

    Object.keys(merged).forEach((key) => {
      if (! validators[key](merged[key])) {
        throw new Error('Error validating ' + key)
      }
    })

    return merged
  }
}

module.exports = {
  fromFilePath: fromFilePath,
  fromFileParts: fromFileParts,
  merge: merge,
  parser: parser
}
