# plugin-web-update-notify

检测网页更新并通知用户刷新插件，支持 webpack、vite 和 umijs。

<p align="center">
  <img width="180" src="https://raw.githubusercontent.com/GreatAuk/plugin-web-update-notification/master/images/vue_example.webp">
  <img width="180" src="https://raw.githubusercontent.com/GreatAuk/plugin-web-update-notification/master/images/react_example.webp">
  <img width="180" src="https://raw.githubusercontent.com/GreatAuk/plugin-web-update-notification/master/images/svelte_example.webp">
  <img width="180" src="https://raw.githubusercontent.com/GreatAuk/plugin-web-update-notification/master/images/react_umi_example.webp">
</p>

> 以 git commit hash ( 如果不是一个 git 仓库，使用打包时的时间戳) 为版本号，打包时将版本号写入 json 文件。客户端轮询服务器上的版本号（窗口的 visibilitychange 事件做辅助）, 和本地作比较，如果不相同则通知用户刷新页面。

**什么时候会检测更新？**

1. 首次加载页面
2. 轮询 （default: 10 * 60 * 1000 ms）
3. script 脚本资源加载失败 (404 ?)
4. visibilitychange event get visible



## Why

部分用户（老板）没有关闭网页的习惯，如果前端页面有更新的话，用户页面可能会出现报错（文件404）或白屏的情况。



## 安装

```bash
# vite
pnpm add @plugin-web-update-notify/vite -D

# umijs
pnpm add @plugin-web-update-notify/umijs -D

# webpack plugin
pnpm add @plugin-web-update-notify/webpack -D
```



## 快速上手

[vite](#vite) | [umi](#umijs) | [webpack](#webpack)


### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { webUpdateNotice } from '@plugin-web-update-notify/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    webUpdateNotice({
      logVersion: true,
    }),
  ]
})
```

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    webUpdateNotice({
      // 自定义通知栏文本
      notifyProps: {
        title: 'system update',
        description: 'System update, please refresh the page',
        buttonText: 'refresh',
      },
    }),
  ]
})
```

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    webUpdateNotice({
      // 自定义 notify UI
      customNotifyHTML: `
        <div style="background-color: #fff;padding: 24px;border-radius: 4px;position: fixed;top: 24px;right: 24px;border: 1px solid;">
          System update, please refresh the page
        </div>
      `,
    }),
  ]
})
```

```ts
// 取消默认的通知栏，监听更新事件自定义行为
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    webUpdateNotice({
      hiddenDefaultNotify: true
    }),
  ]
})

// 在其他文件中监听自定义更新事件
document.body.addEventListener('webupdatenotify', (options) => {
  console.log(options)
  alert('System update!')
})
```


### Umijs

```ts
// .umirc.ts
import { defineConfig } from 'umi'
import type { Options as WebUpdateNotifyOptions } from '@plugin-web-update-notify/umijs'

export default {
  plugins: ['@plugin-web-update-notify/umijs'],
  webUpdateNotify: {
    logVersion: true,
    checkInterval: 0.5 * 60 * 1000,
    notifyProps: {
      title: 'system update',
      description: 'System update, please refresh the page',
      buttonText: 'refresh',
    },
  } as WebUpdateNotifyOptions
}
```


### webpack

```js
// vue.config.js(vue-cli project)
const { WebUpdateNotifyPlugin } = require('@plugin-web-update-notify/webpack')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // ...other config
  configureWebpack: {
    plugins: [
      new WebUpdateNotifyPlugin({
        logVersion: true,
      }),
    ],
  },
})
```



## Options

```ts
function webUpdateNotice(options?: Options): Plugin

interface Options {
  /** 轮询间隔（ms）, 默认 10*60*1000 */
  checkInterval?: number
  /** 是否在浏览器控制台输出 commit-hash */
  logVersion?: boolean
  customNotifyHTML?: string
  notifyProps?: NotifyProps
    /** index.html file path, by default, we will look up path.resolve(webpackOutputPath, './index.html') */
  indexHtmlFilePath?: string // only webpack plugin support
}

interface NotifyProps {
  title?: string
  description?: string
  buttonText?: string
}
```



## 感谢

本插件基于 [plugin-web-update-notification](https://github.com/GreatAuk/plugin-web-update-notification) 定制化修改，感谢原作者的贡献！
