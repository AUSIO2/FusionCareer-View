export const ADMIN_ROLE_OPTIONS = [
  { value: 'NORMAL', label: '普通用户' },
  { value: 'ADMIN', label: '管理员' },
  { value: 'SUPER_ADMIN', label: '超级管理员' },
]

const ROLE_LABELS = Object.fromEntries(ADMIN_ROLE_OPTIONS.map(readRole => [
  readRole.value, readRole.label,
]))

const ROLE_CLASSES = {
  NORMAL: 'badge-gray',
  ADMIN: 'badge-red',
  SUPER_ADMIN: 'badge-gold',
}

const PROFILE_VALUE_LABELS = {
  gender: { MALE: '男', FEMALE: '女', OTHER: '其他' },
  politicalStatus: {
    MASSES: '群众', LEAGUE_MEMBER: '共青团员', PARTY_MEMBER: '中共党员', OTHER: '其他',
  },
  eduLevel: {
    UNDERGRADUATE: '本科生', ACADEMIC_MASTER: '学术硕士研究生',
    PROFESSIONAL_MASTER: '专业硕士研究生', DOCTORAL: '博士研究生',
  },
  mindset: {
    CONFIDENT: '比较有把握', CAUTIOUSLY_OPTIMISTIC: '谨慎乐观',
    LACK_OF_CONFIDENCE: '信心不足', VERY_ANXIOUS: '非常焦虑', ZEN_WAITING: '佛系等待',
  },
}

export const USER_PROFILE_FIELDS = [
  { key: 'realName', label: '姓名' },
  { key: 'studentId', label: '学工号' },
  { key: 'gender', label: '性别' },
  { key: 'birthDate', label: '出生日期' },
  { key: 'politicalStatus', label: '政治面貌' },
  { key: 'grade', label: '届次' },
  { key: 'major', label: '专业' },
  { key: 'eduLevel', label: '学历' },
  { key: 'supervisor', label: '导师' },
  { key: 'email', label: '邮箱' },
  { key: 'phone', label: '手机号' },
  { key: 'wechat', label: '微信号' },
  { key: 'hometown', label: '生源地' },
  { key: 'intentionOrder', label: '就业意向' },
  { key: 'intentionCity', label: '意向城市' },
  { key: 'intentionDream', label: '理想方向' },
  { key: 'mindset', label: '当前心态' },
]

export const USER_RESUME_FIELDS = [
  { key: 'personalIntro', label: '个人简况' },
  { key: 'basicInfo', label: '基础信息' },
  { key: 'education', label: '教育背景' },
  { key: 'internship', label: '实习经历' },
  { key: 'campus', label: '在校经历' },
  { key: 'awards', label: '荣誉奖励' },
  { key: 'skills', label: '掌握技能' },
  { key: 'portfolio', label: '作品集' },
  { key: 'remark', label: '备注' },
]

export function adminRoleLabel(readRole) {
  return ROLE_LABELS[readRole] || readRole || '未知角色'
}

export function adminRoleClass(readRole) {
  return ROLE_CLASSES[readRole] || ROLE_CLASSES.NORMAL
}

export function canViewAdminUserDetail(readRole) {
  return readRole === 'NORMAL'
}

export function normalizeAdminUserPage(readPage) {
  const readList = Array.isArray(readPage?.list) ? readPage.list : []
  const readTotal = Number(readPage?.total ?? readList.length)
  return {
    list: readList,
    total: Number.isFinite(readTotal) ? Math.max(0, readTotal) : readList.length,
    totalPages: Math.max(1, Number(readPage?.totalPages || 1)),
  }
}

export function normalizeAdminUserDetail(readUser, readProfile, readResume, readFiles) {
  const createProfile = { ...(readProfile || {}) }
  if (!createProfile.realName) createProfile.realName = readUser?.realName || readUser?.username || ''
  if (!createProfile.studentId) createProfile.studentId = readUser?.studentId || ''
  return {
    user: readUser || {},
    profile: createProfile,
    resume: readResume || {},
    files: Array.isArray(readFiles) ? readFiles : [],
  }
}

export function formatAdminUserValue(readValue) {
  if (readValue == null || readValue === '') return '—'
  if (Array.isArray(readValue)) return readValue.length ? readValue.join('、') : '—'
  if (typeof readValue === 'string' && readValue.startsWith('[')) {
    try {
      const readList = JSON.parse(readValue)
      if (Array.isArray(readList)) return readList.length ? readList.join('、') : '—'
    } catch { /* use the original text */ }
  }
  return String(readValue)
}

export function formatAdminProfileValue(readKey, readValue) {
  const readLabel = PROFILE_VALUE_LABELS[readKey]?.[readValue]
  return readLabel || formatAdminUserValue(readValue)
}

export function formatAdminFileSize(readBytes) {
  const readSize = Number(readBytes || 0)
  if (!Number.isFinite(readSize) || readSize <= 0) return '大小未知'
  if (readSize < 1024 * 1024) return `${Math.max(1, Math.round(readSize / 1024))} KB`
  return `${(readSize / 1024 / 1024).toFixed(1)} MB`
}
