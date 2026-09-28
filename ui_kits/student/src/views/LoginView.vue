<template>
  <div class="login-page">
    <section class="login-scene" aria-label="复旦大学新闻学院秋景" />

    <main class="login-panel">
      <header class="panel-header">
        <img class="fudan-seal" src="/brand/fudan-seal.svg" alt="复旦大学校徽" />
        <strong>复旦大学新闻学院</strong>
      </header>

      <section class="login-content">
        <h1>复新生涯</h1>

        <div class="target-picker" role="group" aria-label="选择登录入口">
          <button
            type="button"
            :class="{ active: !isAdminTarget }"
            :aria-pressed="!isAdminTarget"
            :disabled="loggingIn"
            @click="setTarget('user')"
          >
            <i class="ti ti-user" />
            <span>学生入口</span>
          </button>
          <button
            type="button"
            :class="{ active: isAdminTarget }"
            :aria-pressed="isAdminTarget"
            :disabled="loggingIn"
            @click="setTarget('admin')"
          >
            <i class="ti ti-settings" />
            <span>管理入口</span>
          </button>
        </div>

        <div v-if="errorMessage" class="login-alert" role="alert">
          <i class="ti ti-alert-circle" />
          <span>{{ errorMessage }}</span>
        </div>

        <button class="uis-button" type="button" :disabled="loggingIn" @click="loginCurrentTarget">
          <span>{{ loggingIn ? '正在跳转…' : (isAdminTarget ? '登录管理端' : '登录学生端') }}</span>
          <i :class="['ti', loggingIn ? 'ti-loader-2 login-spinner' : 'ti-arrow-up-right']" />
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loggingIn = ref(false)
const isAdminTarget = computed(() => route.query.target === 'admin')
const errorMessage = computed(() => ({
  sso_login_failed: '统一身份认证未完成，请重新尝试。',
  admin_forbidden: '当前账号没有管理权限，请使用学生入口。',
}[route.query.error || route.query.notice] || ''))

function loginCurrentTarget() {
  if (loggingIn.value) return
  loggingIn.value = true
  window.location.assign(`/fudan/login?target=${isAdminTarget.value ? 'admin' : 'user'}`)
}

function setTarget(target) {
  router.replace({ path: '/login', query: target === 'admin' ? { target: 'admin' } : {} })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(420px, .75fr);
  background: #f4f0e8;
  color: #201d1a;
}
.login-scene {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 2rem 2.4rem 3rem;
  color: #fff;
  background: #46332a;
  isolation: isolate;
}
.login-scene::before {
  content: '';
  position: absolute;
  z-index: -2;
  inset: 0;
  background: url('/images/login-journalism-autumn.webp') center 42% / cover no-repeat;
  filter: saturate(.78) sepia(.16) contrast(.92) brightness(.82);
  transform: scale(1.18);
  transform-origin: center top;
}
.login-scene::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(48,24,18,.6) 0%, rgba(57,32,22,.28) 55%, rgba(45,25,18,.08) 100%),
    linear-gradient(0deg, rgba(38,20,15,.72) 0%, rgba(45,25,18,.12) 62%, transparent 100%),
    linear-gradient(140deg, rgba(255,215,156,.13), transparent 55%);
}

.login-panel {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem clamp(2rem, 4vw, 5rem) 1.5rem;
  background: #f7f3eb;
  border-left: 1px solid rgba(65,54,45,.14);
}
.panel-header {
  display: flex;
  align-items: center;
  gap: .85rem;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid #d8d0c5;
}
.fudan-seal { width: 52px; height: 52px; object-fit: contain; }
.panel-header strong { font-size: 1rem; font-weight: 650; }
.login-content {
  width: 100%;
  max-width: 450px;
  margin: auto 0;
  padding: 3rem 0;
}
.login-content h1 {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(2.2rem, 3.5vw, 3.2rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -.02em;
}
.target-picker {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .65rem;
  margin: 2rem 0 1rem;
}
.target-picker button {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: 0 1rem;
  border: 1px solid #d4cbc0;
  border-radius: 5px;
  background: #fbf8f2;
  color: #615951;
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .18s ease, background .18s ease, color .18s ease;
}
.target-picker button:hover:not(:disabled) { border-color: #a89b8e; }
.target-picker button.active {
  border-color: #8c151b;
  background: #fff;
  color: #8c151b;
  box-shadow: inset 0 0 0 1px #8c151b;
}
.target-picker i { font-size: 1.15rem; }
.target-picker button:disabled { cursor: wait; opacity: .7; }
.login-alert {
  display: flex;
  align-items: flex-start;
  gap: .55rem;
  margin-bottom: 1rem;
  padding: .75rem .85rem;
  border-top: 1px solid #b74449;
  border-bottom: 1px solid #b74449;
  color: #8c151b;
  font-size: .78rem;
  line-height: 1.5;
}
.uis-button {
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: .9rem 1.05rem;
  border: 1px solid #7d1117;
  border-radius: 5px;
  background: #8c151b;
  color: #fff;
  font: 600 .92rem/1 var(--font-sans);
  cursor: pointer;
  transition: background .18s ease, transform .18s ease;
}
.uis-button:hover:not(:disabled) { background: #731116; transform: translateY(-1px); }
.uis-button:disabled { cursor: wait; opacity: .72; }
.login-spinner { animation: login-spin .8s linear infinite; }
@keyframes login-spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .login-page { display: block; }
  .login-scene { min-height: 38vh; padding: 1.25rem 1.2rem 1.8rem; }
  .login-panel { min-height: 62vh; padding: 1.4rem 1.25rem 1rem; border-left: 0; }
  .login-content { max-width: none; padding: 2.5rem 0; }
}
@media (prefers-reduced-motion: reduce) {
  .uis-button, .target-picker button, .login-spinner { animation: none; transition: none; }
}
</style>
