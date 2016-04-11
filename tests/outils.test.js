'use strict'

const tape = require('tape')
const path = require('path')
const utils = require('../lib/utils.js')

tape('Empty filepath gives empty object', (t) => {
  t.equal(Object.keys(utils.object.createNested.fromString('')).length, 0)
  t.end()
})

tape('Filepath with depth 1', (t) => {
  const expected = {
    index: 1
  }
  t.deepEqual(utils.object.createNested.fromString('index', path.sep, 1), expected)
  t.end()
})

tape('Filepath with depth 2', (t) => {
  const expected = {
    foo: {
      index: 1
    }
  }
  t.deepEqual(utils.object.createNested.fromString('foo/index', path.sep, 1), expected)
  t.end()
})

tape('Filepath with depth 3', (t) => {
  const expected = {
    foo: {
      bar: {
        index: 1
      }
    }
  }
  t.deepEqual(utils.object.createNested.fromString('foo/bar/index', path.sep, 1), expected)
  t.end()
})

tape('Object merge', (t) => {
  let a = {x: 1, y: {z: 2, q: {r: 1}}}
  let b = {x: 2, y: {q: {r: 2, s: 1}}}

  let exp = {x: 2, y: {z: 2, q: {r: 2, s: 1}}}
  let actual = utils.object.merge(a, b)

  t.deepEqual(actual, exp, 'Merges')
  t.end()
})
