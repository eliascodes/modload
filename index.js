'use strict'

// TODO: support arrays for `dir`, `stopfile` options
// TODO: support regex for `stopfile` option
// TODO: support .jsx files

const path = require('path')
const tree = require('./lib/tree.js')
const utils = require('./lib/utils.js')
const obj = utils.object

const defaults = require('./lib/defaults.js')
const validators = require('./lib/validators.js')

const parser = obj.parser(defaults, validators)

module.exports = {
  asArray: function (options) {
    const opts = parser(options)

    const importer = opts.es6modules ? (file) => require(file).default : require

    return tree
      // walk directory tree for relevant files
      .walk(opts.dir, null, opts.exclude, opts.include, opts.stopfile)
      // filter out non-js files
      .filter((file) => path.extname(file) === '.js')
      // import modules
      .map(importer)
  },

  asObject: function (options) {
    const opts = parser(options)

    const importer = opts.es6modules ? (file) => require(file).default : require

    let fullfiles = tree
      // walk directory tree for relevant files
      .walk(opts.dir, null, opts.exclude, opts.include, opts.stopfile)
      // filter out non-js files
      .filter((file) => path.extname(file) === '.js')

    let parsedObj = fullfiles
      // strip root-directory
      .map((file) => file.slice(opts.dir.length + 1))
      // map to dirname if file matches stopfile
      .map((file) => {
        if (utils.is.a(opts.stopfile, RegExp)) {
          return opts.stopfile.test(file) ? path.dirname(file) : file
        } else {
          return file
        }
      })
      // strip file extension
      .map((file) => path.join(path.dirname(file), path.basename(file, '.js')))
      // build nested object from string
      .map((file, i) => obj.createNested.fromString(file, path.sep, importer(fullfiles[i])))
      // merge objects
      .reduce((acc, curr) => obj.merge(acc, curr), {})

    if (opts.isglobal) {
      global[opts.namespace] = parsedObj
    }

    return parsedObj
  }
}
