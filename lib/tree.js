/*
* Directory tree walking functions
*/
'use strict'

const fs = require('fs')
const path = require('path')

function walk (dir, mapper, exclude, include) {
  let files = fs.readdirSync(dir).map((file) => path.join(dir, file))

  if (exclude && exclude.test) {
    files = files.filter((file) => {
      return ! exclude.test(file)
    })
  }

  if (include && include.test) {
    files = files.filter((file) => {
      return include.test(file)
    })
  }

  let dirStack = []
  let fileStack = []

  for (let ii = 0; ii < files.length; ii++) {
    if (fs.statSync(files[ii]).isDirectory()) {
      dirStack.push(files[ii])
    } else {
      fileStack.push(mapper(files[ii]))
    }
  }

  if (dirStack.length > 0) {
    for (let jj = 0; jj < dirStack.length; jj++) {
      const result = walk(dirStack[jj], mapper, exclude, include)
      fileStack = fileStack.concat(result)
    }
  }

  return fileStack


}

module.exports = {walk: walk}
