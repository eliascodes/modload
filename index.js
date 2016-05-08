/**
* Autoloader module
* Elias Malik
* 2016
*/
'use strict'

// TODO: support arrays for `dir` option
// TODO: support .jsx files

const path = require('path')
const tree = require('./lib/tree.js')
const nutil = require('util')
const utils = require('./lib/utils.js')
const obj = utils.object

/*
* Defaults, validators and transforms for options object
*/
const option = {
  defaults: {
    include: null,
    exclude: null,
    isglobal: false,
    namespace: 'app',
    stopfile: null,
    es6modules: false,
    modules: null
  },

  validators: {
    include: (x) => nutil.isNull(x) || nutil.isRegExp(x) || utils.all(x, nutil.isRegExp),
    exclude: (x) => nutil.isNull(x) || nutil.isRegExp(x) || utils.all(x, nutil.isRegExp),
    isglobal: nutil.isBoolean,
    namespace: nutil.isString,
    stopfile: (x) => nutil.isNull(x) || nutil.isRegExp(x) || utils.all(x, nutil.isRegExp),
    es6modules: nutil.isBoolean,
    modules: (x) => nutil.isNull(x) || utils.all(x, nutil.isString),
  },

  mappers: {
    include: (x) => x ? utils.regex.combine(x) : x,
    exclude: (x) => x ? utils.regex.combine(x) : x,
    stopfile: (x) => x ? utils.regex.combine(x) : x,
    modules: (x) => x ? x : []
  }
}

const parser = obj.parser(option.defaults, option.validators, option.mappers)

module.exports = {
  asArray: function (options) {
    const opts = parser(options)

    const importer = opts.es6modules ? (file) => require(file).default : require

    const mods = opts.modules.map(require)

    return mods.concat(tree
      // walk directory tree for relevant files
      .walk(opts.dir, null, opts.exclude, opts.include, opts.stopfile)
      // filter out non-js files
      .filter((file) => path.extname(file) === '.js')
      // import modules
      .map(importer))
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
      .map((file) => opts.stopfile && opts.stopfile.test(file) ? path.dirname(file) : file)
      // strip file extension
      .map((file) => path.join(path.dirname(file), path.basename(file, '.js')))
      // build nested object from string
      .map((file, i) => obj.createNested.fromString(file, path.sep, importer(fullfiles[i])))
      // merge objects
      .reduce((acc, curr) => obj.merge(acc, curr), {})

    const mods = opts.modules.map(require).reduce((acc, curr, ii) => {
      acc[opts.modules[ii]] = curr
      return acc
    }, {})

    parsedObj = Object.assign(parsedObj, mods)

    if (opts.isglobal)
      global[opts.namespace] = parsedObj

    return parsedObj
  }
}
