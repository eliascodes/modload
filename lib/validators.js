'use strict'

const fs = require('fs')

function all (a) {
  return a.reduce((acc, curr) => acc && curr)
}

function patternValidator (p) {
  return p === null || all(p.map((patt) => patt instanceof RegExp))
}

function isa (a, type) {
  return typeof a === type
}

module.exports = {
  dir: (dir) => fs.statSync(dir).isDirectory(),
  include: patternValidator,
  exclude: patternValidator,
  namespace: (s) => isa(s, 'string') || s === null,
  output: (s) => ['array', 'object'].indexOf(s) > -1,
  stopfile: (s) => isa(s, 'string') || s === null,
  es6modules: (flag) => typeof flag === 'boolean',
}
