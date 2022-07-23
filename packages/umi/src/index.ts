import { resolve } from 'path'
import { copyFileSync, readFileSync, writeFileSync } from 'fs'
import type { IApi } from 'umi'
import type { Options } from '@plugin-web-update-notify/core'
import {
  INJECT_SCRIPT_FILE_NAME,
  INJECT_STYLE_FILE_NAME,
  JSON_FILE_NAME,
  NOTIFY_CLASS_NAME,
  generateJSONFileContent,
  getVersion,
} from '@plugin-web-update-notify/core'
import { name as pkgName } from '../package.json'
export type { Options } from '@plugin-web-update-notify/core'

const logVersionTpl = (version: string) => {
  return `
(function() {
  console.log('version: %c${version}', 'color: #1890ff');
})();`
}

export function generateScriptContent(options: Options, version: string) {
  const filePath = resolve('node_modules', pkgName, 'dist', `${INJECT_SCRIPT_FILE_NAME}.js`)
  return `${readFileSync(filePath, 'utf8').toString()}
  window.webUpdateNotifyVersion = "${version}";
  webUpdateCheck_checkAndNotice(${JSON.stringify(options)});`
}

export default (api: IApi) => {
  api.describe({
    key: 'webUpdateNotify',
    config: {
      schema(Joi) {
        return Joi.object({
          checkInterval: Joi.number(),
          logVersion: Joi.boolean(),
          customNotifyHTML: Joi.string(),
          notifyProps: {
            title: Joi.string(),
            description: Joi.string(),
            buttonText: Joi.string(),
          },
          hiddenDefaultNotify: Joi.boolean(),
        })
      },
    },
    enableBy() {
      return api.env === 'production' && api?.userConfig.webUpdateNotify
    },
  })
  const webUpdateNotifyOptions = (api.userConfig?.webUpdateNotify || {}) as Options
  const { logVersion, customNotifyHTML, hiddenDefaultNotify } = webUpdateNotifyOptions

  const version = getVersion()

  // 插件只在生产环境时生效
  if (!version || api.env !== 'production') return

  api.addHTMLLinks(() => {
    if (customNotifyHTML || hiddenDefaultNotify) return []

    return [
      {
        rel: 'stylesheet',
        href: `css/${INJECT_STYLE_FILE_NAME}.css?t=${Date.now()}`,
      },
    ]
  })

  api.addHTMLScripts(() => {
    const scriptList = []
    if (logVersion) {
      scriptList.push({ content: logVersionTpl(version) })
    }
    return scriptList
  })

  api.onBuildComplete(() => {
    // copy file from @plugin-web-update-notify/core/dist/??.css to dist/js/
    const cssFilePath = resolve('node_modules', pkgName, 'dist', `${INJECT_STYLE_FILE_NAME}.css`)
    copyFileSync(cssFilePath, `dist/css/${INJECT_STYLE_FILE_NAME}.css`)

    // write js file to dist/js/
    writeFileSync(`dist/js/${INJECT_SCRIPT_FILE_NAME}.js`, generateScriptContent(webUpdateNotifyOptions, version))

    // write version json file to dist/static/
    writeFileSync(`dist/static/${JSON_FILE_NAME}.json`, generateJSONFileContent(version))
  })

  api.modifyHTML(($) => {
    if (!hiddenDefaultNotify) $('body').append(`<div class="${NOTIFY_CLASS_NAME}"></div></body>`)
    $('body').append(`<script type="module" crossorigin async src="js/${INJECT_SCRIPT_FILE_NAME}.js?t=${Date.now()}"></script>`)
    return $
  })
}
