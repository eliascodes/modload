'use strict'

// TODO: support arrays for `dir`, `stopfile` options
// TODO: support regex for `stopfile` option

const path = require('path')
const tree = require('./lib/tree.js')
const obj = require('./lib/outils.js')

const defaults = require('./lib/defaults.js')
const validators = require('./lib/validators.js')

const parser = obj.parser(defaults, validators)

module.exports = {
  asArray: function (options) {
    const opts = parser(options)
    let importer

    if (opts.es6modules) {
      importer = (file) => require(file).default
    } else {
      importer = require
    }

    return tree
      .walk(opts.dir, null, opts.exclude, opts.include, opts.stopfile)
      .filter((file) => file.indexOf('.js') > -1)
      .map(importer)
  },

  asObject: function (options) {
    const opts = parser(options)
    let importer

    if (opts.es6modules) {
      importer = (file) => require(file).default
    } else {
      importer = require
    }

    let fullfiles = tree
      .walk(opts.dir, null, opts.exclude, opts.include, opts.stopfile)
      .filter((file) => file.indexOf('.js') > -1)

    let parsedObj = fullfiles
      .map((file) => file.slice(opts.dir.length + 1))
      .map((file) => {
        const fobj = path.parse(file)
        return fobj.base === opts.stopfile ? fobj.dir : file
      })
      .map((file, i) => obj.fromFilePath(file, importer(fullfiles[i])))
      .reduce((acc, curr) => obj.merge(acc, curr), {})

    if (opts.isglobal) {
      global[opts.namespace] = parsedObj
    } else {
      return parsedObj
    }
  }
}
