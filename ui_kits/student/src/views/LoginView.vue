<template>
  <div class="login-page">
    <section class="login-scene" aria-label="校园风景插画">
      <div class="scene-topline">
        <span>FUDAN JOURNALISM SCHOOL</span>
        <span>CAREER DESK · 复旦大学新闻学院</span>
      </div>
      <div class="scene-copy">
        <span class="scene-index">01 / CAREER &amp; FUTURE</span>
        <h1>复新生涯</h1>
        <p>连接校园与职业世界，记录每一次出发。</p>
        <div class="scene-categories" aria-label="平台内容">
          <span>实习机会</span><span>校园招聘</span><span>职业发展</span>
        </div>
      </div>
    </section>

    <main class="login-panel">
      <header class="panel-header">
        <img class="fudan-seal" src="/brand/fudan-seal.svg" alt="复旦大学校徽" />
        <div>
          <strong>复旦大学新闻学院</strong>
          <span>就业与职业发展平台</span>
        </div>
      </header>

      <section class="login-content">
        <div class="login-kicker">{{ isAdminTarget ? 'ADMINISTRATION' : 'STUDENT ACCESS' }}</div>
        <h2>{{ isAdminTarget ? '管理端登录' : '欢迎回来' }}</h2>
        <p class="login-intro">
          {{ isAdminTarget
            ? '管理岗位、问卷和学生投递。身份与权限将由系统自动核验。'
            : '使用复旦统一身份认证进入复新生涯。' }}
        </p>

        <div v-if="errorMessage" class="login-alert" role="alert">
          <i class="ti ti-alert-circle" />
          <span>{{ errorMessage }}</span>
        </div>

        <button class="uis-button" type="button" :disabled="loggingIn" @click="loginCurrentTarget">
          <span>{{ loggingIn ? '正在前往统一身份认证…' : '使用复旦 UIS 登录' }}</span>
          <i :class="['ti', loggingIn ? 'ti-loader-2 login-spinner' : 'ti-arrow-up-right']" />
        </button>

        <div class="auth-note">
          <i class="ti ti-shield-check" />
          <span>认证在复旦大学统一身份认证平台完成，本平台不会获取你的密码。</span>
        </div>

        <button class="target-switch" type="button" :disabled="loggingIn" @click="switchTarget">
          <span>{{ isAdminTarget ? '返回学生入口' : '管理人员入口' }}</span>
          <i class="ti ti-arrow-right" />
        </button>
      </section>

      <footer class="panel-footer">
        <span>© {{ currentYear }} 复旦大学新闻学院</span>
        <span>FusionCareer</span>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loggingIn = ref(false)
const currentYear = new Date().getFullYear()
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

function switchTarget() {
  router.replace({ path: '/login', query: isAdminTarget.value ? {} : { target: 'admin' } })
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
.scene-topline {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: .9rem;
  border-bottom: 1px solid rgba(255,255,255,.5);
  font-size: .66rem;
  font-weight: 600;
  letter-spacing: .15em;
}
.scene-copy { max-width: 650px; }
.scene-index {
  display: block;
  margin-bottom: .9rem;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .16em;
}
.scene-copy h1 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(3.6rem, 7vw, 7.4rem);
  font-weight: 900;
  line-height: .95;
  letter-spacing: -.055em;
  text-shadow: 0 2px 24px rgba(22,10,8,.25);
}
.scene-copy p {
  margin: 1rem 0 1.6rem;
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.35rem);
  letter-spacing: .06em;
}
.scene-categories {
  display: flex;
  gap: 0;
  width: fit-content;
  border-top: 1px solid rgba(255,255,255,.55);
  border-bottom: 1px solid rgba(255,255,255,.55);
}
.scene-categories span {
  padding: .65rem 1.25rem;
  font-size: .75rem;
  letter-spacing: .08em;
}
.scene-categories span + span { border-left: 1px solid rgba(255,255,255,.4); }

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
.panel-header strong { display: block; font-family: var(--font-serif); font-size: .95rem; }
.panel-header span { display: block; margin-top: .18rem; color: #776f67; font-size: .72rem; letter-spacing: .04em; }
.login-content {
  width: 100%;
  max-width: 450px;
  margin: auto 0;
  padding: 3rem 0;
}
.login-kicker {
  margin-bottom: 1rem;
  color: #8c151b;
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .18em;
}
.login-content h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.035em;
}
.login-intro {
  min-height: 3em;
  margin: 1rem 0 2rem;
  color: #665f58;
  font-size: .9rem;
  line-height: 1.75;
}
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
.auth-note {
  display: flex;
  align-items: flex-start;
  gap: .5rem;
  margin-top: .85rem;
  color: #817970;
  font-size: .71rem;
  line-height: 1.55;
}
.auth-note i { margin-top: .1rem; color: #8c151b; }
.target-switch {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.4rem;
  padding: .8rem 0;
  border: 0;
  border-top: 1px solid #d8d0c5;
  border-bottom: 1px solid #d8d0c5;
  background: transparent;
  color: #554e48;
  font: 500 .78rem/1 var(--font-sans);
  cursor: pointer;
}
.target-switch:hover { color: #8c151b; }
.target-switch i { transition: transform .18s ease; }
.target-switch:hover i { transform: translateX(3px); }
.panel-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #d8d0c5;
  color: #8a8178;
  font-size: .66rem;
  letter-spacing: .04em;
}

@media (max-width: 900px) {
  .login-page { display: block; }
  .login-scene { min-height: 38vh; padding: 1.25rem 1.2rem 1.8rem; }
  .scene-topline span:last-child { display: none; }
  .scene-copy h1 { font-size: clamp(3rem, 14vw, 5rem); }
  .scene-copy p { margin-bottom: .8rem; font-size: .9rem; }
  .scene-categories { display: none; }
  .login-panel { min-height: 62vh; padding: 1.4rem 1.25rem 1rem; border-left: 0; }
  .login-content { max-width: none; padding: 2.5rem 0; }
}
@media (prefers-reduced-motion: reduce) {
  .uis-button, .target-switch i, .login-spinner { animation: none; transition: none; }
}
</style>
