// 拷贝公用文件到子项目
import { copyFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// 拷贝的目标路径——相对于脚本目录
const dests = [
  ['../LICENSE', '../packages/core/LICENSE'],
  ['../README.md', '../packages/core/README.md'],
  ['../LICENSE', '../packages/vite/LICENSE'],
  ['../README.md', '../packages/vite/README.md'],
  ['../LICENSE', '../packages/umi/LICENSE'],
  ['../README.md', '../packages/umi/README.md'],
  ['../LICENSE', '../packages/webpack/LICENSE'],
  ['../README.md', '../packages/webpack/README.md'],
]

const _filename = import.meta.url ? fileURLToPath(import.meta.url) : __filename

dests.forEach(([src, dest]) => {
  copyFileSync(resolve(_filename, '..', src), resolve(_filename, '..', dest))
})
