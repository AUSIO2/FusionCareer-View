import assert from 'node:assert/strict'
import { apiId } from '../src/lib/id.mjs'

assert.equal(apiId('2030957150604038146'), '2030957150604038146')

console.log('64-bit id smoke: ok')
