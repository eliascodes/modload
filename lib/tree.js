/*
* Directory tree walking functions
*/
'use strict'

const fs = require('fs')
const path = require('path')
const utils = require('./utils.js')

function applyFilter (patterns, array, negate) {
  if (patterns) {
    let pattern

    if (patterns instanceof Array) {
      pattern = utils.regex.combine.apply(null, patterns)
    } else {
      pattern = patterns
    }

    return array.filter((el) => negate ? !pattern.test(el) : pattern.test(el))
  }
  return array
}

function walk (dir, mapper, exclude, include, stopfile) {
  const directories = []
  let files = fs.readdirSync(dir).map((file) => path.join(dir, file))

  files = applyFilter(exclude, files, true)

  files = files.filter((file) => {
    const isDir = fs.statSync(file).isDirectory()
    if (isDir) directories.push(file)
    return !isDir
  })

  files = applyFilter(include, files)

  if (stopfile) {
    for (let ii = 0; ii < files.length; ii++) {
      if (stopfile.test(files[ii])) {
        return mapper ? mapper(files[ii]) : [files[ii]]
      }
    }
  }

  if (mapper) {
    files = files.map(mapper)
  }

    for (let jj = 0; jj < directories.length; jj++) {
      let result = walk(directories[jj], mapper, exclude, include, stopfile)
      files = files.concat(result)
    }

  return files
}

module.exports = {walk: walk}
