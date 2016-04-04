'use strict'

const fs = require('fs')

function all (a) {
  return a.reduce((acc, curr) => acc && curr)
}

module.exports = {
  dir: (dir) => fs.statSync(dir).isDirectory(),
  include: (patterns) => all(patterns.map((patt) => patt instanceof RegExp || patt === null)),
  exclude: (patterns) => all(patterns.map((patt) => patt instanceof RegExp || patt === null)),
  isglobal: (flag) => typeof flag === 'boolean',
  namespace: (s) => typeof s === 'string',
  output: (s) => ['array', 'object'].indexOf(s) > -1,
  stopfile: (s) => typeof s === 'string' || s === null
}
