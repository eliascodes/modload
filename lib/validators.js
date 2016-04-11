'use strict'

const utils = require('./utils.js')

const patternValidator = (p) => p === null || utils.isa(RegExp) || utils.isarrayof(p, RegExp)

const nullOr = (type) => {
  return (s) => s === null || utils.isa(type)
}

module.exports = {
  dir: utils.isdir,
  include: patternValidator,
  exclude: patternValidator,
  namespace: nullOr('string'),
  stopfile: nullOr('string'),
  es6modules: nullOr('boolean'),
}
