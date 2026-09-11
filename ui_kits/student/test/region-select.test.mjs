import assert from 'node:assert/strict'
import { filterOptions } from '../src/lib/filterOptions.mjs'

assert.deepEqual(filterOptions(['上海', '山东', '北京'], ' 山 '), ['山东'])
assert.deepEqual(filterOptions(['全部城市', '杭州'], ''), ['全部城市', '杭州'])

console.log('region select smoke: ok')
