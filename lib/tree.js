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

// 1. start in root
// 2. get contents of dir
// 3. for each member of dir
// // 3.1 if matches exclude pattern, continue
// // 3.2 if include pattern given, and doesn't match, continue
// // 3.3 check if a dir or file
// // 3.4 if a file, apply mapping function and return result
// // 3.5 if a directory, go into it and go to step 2.
