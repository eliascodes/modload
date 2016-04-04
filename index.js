'use strict'

// TODO: support arrays for `dir`, `include`, `exclude`, `stopfile` options
// TODO: support regex for `stopfile` option
const path = require('path')
const tree = require('./lib/tree.js')
const obj = require('./lib/outils.js')

const defaults = require('./lib/defaults.js')
const validators = require('./lib/validators.js')

const parser = obj.parser(defaults, validators)

module.exports = function (options) {
  const opts = parser(options)

  let files = tree.walk(opts.dir, null, opts.exclude, opts.include, opts.stopfile)

  files = files.filter((file) => file.indexOf('.js') > -1)

  let modules = files.map(require)

  if (opts.output === 'array') return modules

  let parsedObj = files
    .map((file) => file.slice(opts.dir.length + 1))
    .map((file) => {
      const fobj = path.parse(file)
      return (fobj.base === opts.stopfile) ? fobj.dir : file
    })
    .map((file, idx) => obj.fromFilePath(file, modules[idx]))
    .reduce((acc, curr) => obj.merge(acc, curr), {})

  if (opts.isglobal) {
    global[opts.namespace] = parsedObj
  } else {
    return parsedObj
  }
}
