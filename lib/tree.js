/*
* Directory tree walking functions
*/
'use strict'

const fs = require('fs')
const path = require('path')

function walk (dir, mapper, exclude, include, stopfile) {
  const directories = []
  let files = fs.readdirSync(dir).map((file) => path.join(dir, file))

  if (exclude) {
    files = files.filter((file) => {
      return ! exclude.reduce((acc, curr) => {
        return acc || curr.test(file)
      }, false)
    })
  }

  files = files.filter((file) => {
    const isDir = fs.statSync(file).isDirectory()
    if (isDir) directories.push(file)
    return !isDir
  })

  if (include) {
    files = files.filter((file) => {
      return include.reduce((acc, curr) => {
        return acc || curr.test(file)
      }, false)
    })
  }

  if (stopfile) {
    for (let ii = 0; ii < files.length; ii++) {
      if (files[ii].indexOf(stopfile) > -1) {
        return mapper ? mapper(files[ii]) : files[ii]
      }
    }
  }

  if (mapper) {
    files = files.map(mapper)
  }

  if (directories.length > 0) {
    for (let jj = 0; jj < directories.length; jj++) {
      let result = walk(directories[jj], mapper, exclude, include, stopfile)
      files = files.concat(result)
    }
  }

  return files
}

module.exports = {walk: walk}
