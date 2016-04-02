'use strict'

const fs = require('fs')
const tape = require('tape')
const path = require('path')
const tree = require('../lib/tree.js')

tape('Check walk runs on dummy directory', (t) => {
  const result = tree.walk(path.join(__dirname, 'dummy'), (file) => file)
  t.equal(result.length, 8, 'Eight files in dir')

  result.forEach((file) => {
    t.ok(file.indexOf(path.join(__dirname, 'dummy')) > -1, 'File in right directory')
    t.ok(fs.statSync(file).isFile(), 'Found file that exists')
  })

  t.end()
})
