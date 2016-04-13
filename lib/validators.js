'use strict'

const utils = require('./utils.js')

const patternValidator = (p) => p === null || utils.is.a(RegExp) || utils.is.arrayof(p, RegExp)

const nullOr = (type) => {
  return (s) => s === null || utils.is.a(s, type)
}

module.exports = {
  dir: utils.is.dir,
  include: patternValidator,
  exclude: patternValidator,
  namespace: nullOr('string'),
  stopfile: nullOr('string'),
  es6modules: nullOr('boolean'),
}
