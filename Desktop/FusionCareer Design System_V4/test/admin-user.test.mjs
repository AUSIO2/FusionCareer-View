import assert from 'node:assert/strict'
import test from 'node:test'
import {
  adminRoleClass,
  adminRoleLabel,
  canChangeAdminUserRole,
  canViewAdminUserDetail,
  formatAdminFileSize,
  formatAdminProfileValue,
  formatAdminUserValue,
  normalizeAdminUserDetail,
  normalizeAdminUserPage,
} from '../src/lib/adminUser.mjs'

test('labels all supported administrator roles', () => {
  assert.equal(adminRoleLabel('SUPER_ADMIN'), '超级管理员')
  assert.equal(adminRoleLabel('ADMIN'), '管理员')
  assert.equal(adminRoleLabel('NORMAL'), '普通用户')
  assert.equal(adminRoleClass('SUPER_ADMIN'), 'badge-gold')
  assert.equal(canViewAdminUserDetail('NORMAL'), true)
  assert.equal(canViewAdminUserDetail('ADMIN'), false)
  assert.equal(canViewAdminUserDetail('SUPER_ADMIN'), false)
  assert.equal(canChangeAdminUserRole('NORMAL'), true)
  assert.equal(canChangeAdminUserRole('ADMIN'), true)
  assert.equal(canChangeAdminUserRole('SUPER_ADMIN'), false)
})

test('normalizes user pages with safe pagination defaults', () => {
  assert.deepEqual(normalizeAdminUserPage({ list: [{ id: 1 }], total: 1 }), {
    list: [{ id: 1 }], total: 1, totalPages: 1,
  })
  assert.deepEqual(normalizeAdminUserPage(null), { list: [], total: 0, totalPages: 1 })
})

test('combines user, profile, resume, and file records', () => {
  assert.deepEqual(normalizeAdminUserDetail(
    { id: 8, username: 'student', studentId: '223001' },
    { major: '新闻学' },
    { education: '复旦大学' },
    [{ id: 4, originalName: '简历.pdf' }],
  ), {
    user: { id: 8, username: 'student', studentId: '223001' },
    profile: { realName: 'student', studentId: '223001', major: '新闻学' },
    resume: { education: '复旦大学' },
    files: [{ id: 4, originalName: '简历.pdf' }],
  })
})

test('formats profile values and resume file sizes', () => {
  assert.equal(formatAdminProfileValue('gender', 'FEMALE'), '女')
  assert.equal(formatAdminProfileValue('eduLevel', 'ACADEMIC_MASTER'), '学术硕士研究生')
  assert.equal(formatAdminUserValue('["上海","北京"]'), '上海、北京')
  assert.equal(formatAdminUserValue(''), '—')
  assert.equal(formatAdminFileSize(1536), '2 KB')
  assert.equal(formatAdminFileSize(2 * 1024 * 1024), '2.0 MB')
})
