import type { Options } from './type'
import { CUSTOM_UPDATE_EVENT_NAME, JSON_FILE_NAME, NOTIFY_CLASS_NAME } from './constant'

// bind notify click event, click to refresh page
const anchor = document.querySelector(`.${NOTIFY_CLASS_NAME}`)
anchor?.addEventListener('click', () => {
  window.location.reload()
})

/**
 * It checks whether the system has been updated and if so, it shows a notify.
 * @param {Options} options - Options
 */
function webUpdateCheck_checkAndNotice(options: Options) {
  const checkSystemUpdate = () => {
    window
      .fetch(`./${JSON_FILE_NAME}.json?t=${Date.now()}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to fetch ${JSON_FILE_NAME}.json`)

        return response.json()
      })
      .then((res) => {
        if (window.webUpdateNotifyVersion !== res.version) {
          document.body.dispatchEvent(new CustomEvent(CUSTOM_UPDATE_EVENT_NAME, {
            detail: options,
            bubbles: true,
          }))
          if (!window.hasShowSystemUpdateNotice_plugin && !options.hiddenDefaultNotify) {
            webUpdateCheck_showNotify(options)
            // console.info('system has update！！！')
          }
        }
      })
      .catch((err) => {
        console.error('检查系统更新失败：', err)
      })
  }

  // check system update after page loaded
  checkSystemUpdate()

  // polling check system update
  setInterval(checkSystemUpdate, options.checkInterval || 10 * 60 * 1000)

  // when page visibility change, check system update
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkSystemUpdate()
  })

  // listener script resource loading error
  window.addEventListener('error', (err) => {
    const errTagName = (err?.target as any)?.tagName
    if (errTagName === 'SCRIPT') checkSystemUpdate()
  }, true)
}
window.webUpdateCheck_checkAndNotice = webUpdateCheck_checkAndNotice

/**
 * show update notify
 */
function webUpdateCheck_showNotify(options: Options) {
  window.hasShowSystemUpdateNotice_plugin = true

  const { notifyProps, customNotifyHTML } = options

  const notify = document.createElement('div')
  let notifyInnerHTML = ''

  if (customNotifyHTML) {
    notifyInnerHTML = customNotifyHTML
  } else {
    const title = notifyProps?.title || '📢 &nbsp;系统升级通知'
    const description = notifyProps?.description || '检测到当前系统版本已更新，请刷新页面后使用。'
    const buttonText = notifyProps?.buttonText || '刷新'
    notify.classList.add('vite-plugin-web-update-notice')
    notifyInnerHTML = `
    <div class="vite-plugin-web-update-notice-content" data-cy="notify-content">
      <div class="vite-plugin-web-update-notice-content-title">
        ${title}
      </div>
      <div class="vite-plugin-web-update-notice-content-desc">
        ${description}
      </div>
      <a class="vite-plugin-web-update-notice-refresh-btn">
        ${buttonText}
      </a>
    </div>`
  }

  notify.innerHTML = notifyInnerHTML
  document
    .querySelector(`.${NOTIFY_CLASS_NAME}`)!
    .appendChild(notify)
}

// meaningless export, in order to let tsup bundle these functions
export {
  webUpdateCheck_checkAndNotice,
  webUpdateCheck_showNotify,
}
