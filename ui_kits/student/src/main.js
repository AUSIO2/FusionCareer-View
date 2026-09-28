import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import { consumeUrlToken } from '@/lib/api'
import { useToast } from '@/composables/useToast'

consumeUrlToken()

const app = createApp(App)
app.use(router)

router.isReady().then(() => {
  const readRoute = router.currentRoute.value
  const readToken = readRoute.query.token
  const readNotice = readRoute.query.notice
  const readError = readRoute.query.error
  // LoginView keeps callback errors visible with the corresponding recovery action.
  const isLoginPage = readRoute.path === '/login'
  if (!isLoginPage && readNotice === 'admin_forbidden') {
    useToast().error('当前账号没有管理员权限')
  } else if (!isLoginPage && readError === 'sso_login_failed') {
    useToast().error('统一身份认证失败，请重新登录')
  }
  if (readToken || (!isLoginPage && (readNotice || readError))) {
    const updateQuery = { ...readRoute.query }
    delete updateQuery.token
    if (!isLoginPage) {
      delete updateQuery.notice
      delete updateQuery.error
    }
    router.replace({ path:readRoute.path, query:updateQuery })
  }
})

app.mount('#app')
