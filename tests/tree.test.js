'use strict'

const fs = require('fs')
const tape = require('tape')
const path = require('path')
const tree = require('../lib/tree.js')

tape('Check walk runs on dummy directory', (t) => {
  const result = tree.walk(path.join(__dirname, 'dummy'))
  t.equal(result.length, 11, '11 files in dir')

  result.forEach((file) => {
    t.ok(file.indexOf(path.join(__dirname, 'dummy')) > -1, 'File in right directory')
    t.ok(fs.statSync(file).isFile(), 'Found file that exists')
  })

  t.end()
})

tape('Check walk runs on dummy directory with excludes', (t) => {
  const exclude = [/dir_dummy_1/]

  const result = tree.walk(path.join(__dirname, 'dummy'), null, exclude)
  t.equal(result.length, 8, '8 files in dir')

  result.forEach((file) => {
    t.ok(file.indexOf(path.join(__dirname, 'dummy')) > -1, 'File in right directory')
    t.ok(fs.statSync(file).isFile(), 'Found file that exists')
  })

  t.end()
})

tape('Check walk runs on dummy directory with includes', (t) => {
  const include = [/dir_dummy_1/]

  const result = tree.walk(path.join(__dirname, 'dummy'), null, null, include)
  t.equal(result.length, 3, '3 files in dir')

  result.forEach((file) => {
    t.ok(file.indexOf(path.join(__dirname, 'dummy')) > -1, 'File in right directory')
    t.ok(fs.statSync(file).isFile(), 'Found file that exists')
  })

  t.end()
})

tape('Check walk runs on dummy directory with excludes and includes', (t) => {
  const exclude = [/dir_dummy_2/]
  const include = [/file\.dummy\.2/]

  const result = tree.walk(path.join(__dirname, 'dummy'), null, exclude, include)
  t.equal(result.length, 2, '2 files in dir')

  result.forEach((file) => {
    t.ok(file.indexOf(path.join(__dirname, 'dummy')) > -1, 'File in right directory')
    t.ok(fs.statSync(file).isFile(), 'Found file that exists')
  })

  t.end()
})

tape('Check walk runs on dummy directory with stopfile', (t) => {
  const stopfile = 'index.js'

  const result = tree.walk(path.join(__dirname, 'dummy'), null, null, null, stopfile)
  t.equal(result.length, 9, '9 files')

  result.forEach((file) => {
    t.ok(file.indexOf(path.join(__dirname, 'dummy')) > -1, 'File in right directory')
    t.ok(fs.statSync(file).isFile(), 'Found file that exists')
  })

  t.end()
})
