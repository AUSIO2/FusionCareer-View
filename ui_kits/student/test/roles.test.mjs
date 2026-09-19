import assert from 'node:assert/strict'
import { ADMIN_ROLES, canManageSystem, roleLabel } from '../src/lib/roles.mjs'
assert.equal(ADMIN_ROLES.includes('ADMIN'), true)
assert.equal(ADMIN_ROLES.includes('SUPERADMIN'), true)
assert.equal(ADMIN_ROLES.includes('NORMAL'), false)
assert.equal(canManageSystem('ADMIN'), false)
assert.equal(canManageSystem('SUPERADMIN'), true)
assert.equal(canManageSystem(undefined), false)
assert.equal(roleLabel('SUPERADMIN'), '超级管理员')
console.log('role access: ok')
