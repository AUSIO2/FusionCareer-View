import { ref } from 'vue'

const toasts = ref([])
let createToastId = 0

export function useToast() {
  function showToast(readMessage, readType = 'default', readDuration = 2800) {
    if (toasts.value.some(readToast => readToast.msg === readMessage && readToast.type === readType)) return
    const createId = ++createToastId
    toasts.value.push({ id:createId, msg:readMessage, type:readType })
    setTimeout(() => {
      toasts.value = toasts.value.filter(readToast => readToast.id !== createId)
    }, readDuration)
  }
  return {
    toasts,
    show: showToast,
    success: readMessage => showToast(readMessage, 'success'),
    error: readMessage => showToast(readMessage, 'error'),
  }
}
