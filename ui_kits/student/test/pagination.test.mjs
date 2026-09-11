import assert from 'node:assert/strict'
import { compactPages } from '../src/lib/pagination.mjs'

assert.deepEqual(compactPages(1, 4), [1, 2, 3, 4])
assert.deepEqual(compactPages(1, 47), [1, 2, 3, 4, 5, 'end-ellipsis', 47])
assert.deepEqual(compactPages(20, 47), [1, 'start-ellipsis', 19, 20, 21, 'end-ellipsis', 47])
assert.deepEqual(compactPages(47, 47), [1, 'start-ellipsis', 43, 44, 45, 46, 47])

console.log('pagination smoke: ok')
