/*
* Directory tree walking functions
*/
'use strict'

const fs = require('fs')
const path = require('path')
const utils = require('./utils.js')

/**
* Recursively walk a directory and return array of files
* @returns {array} of files found in the directory
* @param {string} dir - Root directory to traverse
* @param {function} mapper - (Optional) Transforms each filepath
* @param {RegExp} exclude - (Optional) Pattern for files to exclude from results
* @param {RegExp} include - (Optional) Pattern for files to include in results
* @param {RegExp} stopfile - (Optional) Pattern for file at which to terminate recursion
*/
function walk (dir, mapper, exclude, include, stopfile) {
  let files = fs.readdirSync(dir).map((file) => path.join(dir, file))

  if (exclude)
    files = files.filter((file) => !exclude.test(file))

  let directories = files.filter(utils.is.dir)
  files = files.filter(utils.is.file)

  if (include)
    files = files.filter((file) => include.test(file))

  if (stopfile) {
    for (let ii = 0; ii < files.length; ii++) {
      if (stopfile.test(files[ii]))
        return mapper ? mapper(files[ii]) : [files[ii]]
    }
  }

  if (mapper)
    files = files.map(mapper)

  for (let jj = 0; jj < directories.length; jj++) {
    let result = walk(directories[jj], mapper, exclude, include, stopfile)
    files = files.concat(result)
  }

  return files
}

module.exports = {walk: walk}
