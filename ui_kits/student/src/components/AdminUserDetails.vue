<template>
  <div class="modal-mask" @click.self="$emit('close')" @keydown.esc="$emit('close')">
    <section class="modal-box user-details" role="dialog" aria-modal="true" aria-labelledby="user-details-title">
      <header><h2 id="user-details-title">{{ user.username || user.studentId }}的资料</h2>
        <button class="btn btn-ghost btn-sm" autofocus @click="$emit('close')">关闭</button></header>
      <p v-if="loading">加载中…</p>
      <div v-else-if="error" role="alert">{{ error }} <button class="btn btn-secondary btn-sm" @click="load">重试</button></div>
      <template v-else>
        <div class="actions"><span>学工号：{{ user.studentId }} · {{ roleLabel(user.role) }}</span>
          <button class="btn btn-secondary btn-sm" :disabled="busy" @click="download(`/admin/user/export?userIds=${user.id}`, '用户资料.xlsx')">下载资料表格</button></div>
        <h3>个人资料</h3>
        <dl v-if="profile" class="profile-grid"><template v-for="(label, field) in profileFields" :key="field">
          <dt>{{ label }}</dt><dd>{{ display(profile[field]) }}</dd>
        </template></dl><p v-else>尚未填写个人资料</p>
        <h3>简历正文</h3>
        <dl v-if="resume"><template v-for="(label, field) in resumeFields" :key="field">
          <dt>{{ label }}</dt><dd>{{ display(resume[field]) }}</dd>
        </template></dl><p v-else>尚未填写简历正文</p>
        <h3>简历文件</h3>
        <p v-if="!files.length">尚未上传简历文件</p>
        <div v-for="file in files" :key="file.id" class="file-row">
          <span>{{ file.originalName }}</span>
          <button class="btn btn-secondary btn-sm" :disabled="busy" @click="download(`/admin/user/${user.id}/resume/file/${file.id}/download`, file.originalName)">下载</button>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { apiJson, apiDownloadBlob } from '@/lib/api'
import { roleLabel } from '@/lib/roles.mjs'
import { useToast } from '@/composables/useToast'
const props = defineProps({ user: { type: Object, required: true } })
defineEmits(['close'])
const profile = ref(null), resume = ref(null), files = ref([])
const loading = ref(true), error = ref(''), busy = ref(false)
const toast = useToast()
const profileFields = {
  realName:'姓名', gender:'性别', birthDate:'出生日期', politicalStatus:'政治面貌', phone:'手机', email:'邮箱',
  wechat:'微信', hometown:'生源地', grade:'年级', major:'专业', eduLevel:'学历', supervisor:'导师',
  intentionOrder:'去向意向排序', intentionCity:'意向城市', intentionDream:'理想岗位', mindset:'就业心态',
}
const resumeFields = { personalIntro:'个人简况', basicInfo:'基础信息', education:'教育背景', internship:'实习经历', campus:'在校经历', awards:'荣誉奖励', skills:'技能', portfolio:'作品集', remark:'备注' }
const labels = { MALE:'男', FEMALE:'女', OTHER:'其他', MASSES:'群众', LEAGUE_MEMBER:'共青团员', PARTY_MEMBER:'中共党员', UNDERGRADUATE:'本科生', ACADEMIC_MASTER:'学术硕士', PROFESSIONAL_MASTER:'专业硕士', DOCTORAL:'博士', CONFIDENT:'比较有把握', CAUTIOUSLY_OPTIMISTIC:'谨慎乐观', LACK_OF_CONFIDENCE:'信心不足', VERY_ANXIOUS:'非常焦虑', ZEN_WAITING:'佛系等待' }
function display(value) {
  if (value == null || value === '') return '—'
  if (Array.isArray(value)) return value.join('、')
  return labels[value] || String(value)
}
async function load() {
  loading.value = true
  error.value = ''
  try {
    const root = `/admin/user/${props.user.id}`
    const results = await Promise.all([apiJson(`${root}/profile`), apiJson(`${root}/resume`), apiJson(`${root}/resume/file/list`)])
    ;[profile.value, resume.value, files.value] = results
  } catch (cause) {
    error.value = cause?.message || '资料加载失败'
  } finally { loading.value = false }
}
async function download(path, filename) {
  busy.value = true
  try {
    const blob = await apiDownloadBlob(path)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  } catch (cause) { toast.error(cause?.message || '下载失败') }
  finally { busy.value = false }
}
onMounted(load)
</script>

<style scoped>
.user-details { width:min(850px, 94vw); max-width:850px; max-height:88vh; overflow:auto; text-align:left; }
header,.actions,.file-row { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
header h2 { font-size:1.1rem; margin:0; }
h3 { font-size:.95rem; margin:1.4rem 0 .75rem; }
.actions { flex-wrap:wrap; margin-top:1rem; font-size:.85rem; }
dl { margin:0; font-size:.85rem; }
dt { color:var(--ink-3); margin-top:.75rem; }
dd { margin:.2rem 0 .5rem; white-space:pre-wrap; overflow-wrap:anywhere; }
.profile-grid { display:grid; grid-template-columns:100px minmax(0,1fr) 100px minmax(0,1fr); gap:.6rem; }
.profile-grid dt,.profile-grid dd { margin:0; }
.file-row { padding:.65rem 0; border-bottom:1px solid var(--border); font-size:.85rem; }
@media(max-width:600px) { .profile-grid { grid-template-columns:90px minmax(0,1fr); } }
</style>
