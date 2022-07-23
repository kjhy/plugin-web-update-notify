import { resolve } from 'path'
import { copyFileSync } from 'fs'
import { name as pkgName } from '../package.json'
import { INJECT_SCRIPT_FILE_NAME, INJECT_STYLE_FILE_NAME } from './constant'

const scriptFilePath = resolve('node_modules', pkgName, 'dist', `${INJECT_SCRIPT_FILE_NAME}.js`)
const styleFilePath = resolve('node_modules', pkgName, 'dist', `${INJECT_STYLE_FILE_NAME}.css`)

// copy file from @plugin-web-update-notify/core/dist/??.js to dist/js/
copyFileSync(scriptFilePath, `dist/js/${INJECT_SCRIPT_FILE_NAME}.js`)

// copy file from @plugin-web-update-notify/core/dist/??.css to dist/css/
copyFileSync(styleFilePath, `dist/css/${INJECT_STYLE_FILE_NAME}.css`)
