export const ADMIN_ROLES = ['ADMIN', 'SUPERADMIN']
export const ROLE_LABELS = { NORMAL: '普通用户', ADMIN: '管理员', SUPERADMIN: '超级管理员' }
export const canManageSystem = role => role === 'SUPERADMIN'
export const roleLabel = role => ROLE_LABELS[role] || '未知角色'
