const { WebUpdateNotifyPlugin } = require('@plugin-web-update-notify/webpack')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new WebUpdateNotifyPlugin({
        logVersion: true,
      }),
    ],
  },
})
