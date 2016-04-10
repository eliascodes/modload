'use strict'

const tape = require('tape')
const path = require('path')
const auto = require('../index.js')

const DIR_DUMMY = path.join(__dirname, 'dummy')

tape('Default behaviour', (t) => {
  const results = auto.asArray({dir: DIR_DUMMY})

  const expected = [
    path.join(DIR_DUMMY, 'file.dummy.1.js'),
    path.join(DIR_DUMMY, 'file.dummy.2.js'),
    path.join(DIR_DUMMY, 'dir_dummy_1', 'file.dummy.1.js'),
    path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'file.dummy.1.js'),
    path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'index.js'),
    path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'dir_dummy_4', 'file.dummy.1.js')
  ]

  t.deepEqual(results, expected)
  t.end()
})

tape('Object output', (t) => {
  const results = auto.asObject({dir: DIR_DUMMY})

  const expected = {
    'file.dummy.1': path.join(DIR_DUMMY, 'file.dummy.1.js'),
    'file.dummy.2': path.join(DIR_DUMMY, 'file.dummy.2.js'),
    'dir_dummy_1': {
      'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_1', 'file.dummy.1.js')
    },
    'dir_dummy_2': {
      'dir_dummy_3': {
        'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'file.dummy.1.js'),
        'index': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'index.js'),
        'dir_dummy_4': {
          'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'dir_dummy_4', 'file.dummy.1.js')
        }
      }
    }
  }

  t.deepEqual(results, expected)
  t.end()
})

tape('Stopfile object output', (t) => {
  const results = auto.asObject({
    dir: DIR_DUMMY,
    stopfile: 'index.js'
  })

  const expected = {
    'file.dummy.1': path.join(DIR_DUMMY, 'file.dummy.1.js'),
    'file.dummy.2': path.join(DIR_DUMMY, 'file.dummy.2.js'),
    'dir_dummy_1': {
      'file.dummy.1': path.join(DIR_DUMMY, 'dir_dummy_1', 'file.dummy.1.js')
    },
    'dir_dummy_2': {
      'dir_dummy_3': path.join(DIR_DUMMY, 'dir_dummy_2', 'dir_dummy_3', 'index.js')
    }
  }

  t.deepEqual(results, expected)
  t.end()
})
