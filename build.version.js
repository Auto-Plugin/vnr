import { select, Separator } from '@inquirer/prompts'
import { createRequire } from 'module'
import fs from 'fs'
import { execa } from 'execa'
import { packageDirectory } from 'pkg-dir'
const packageJson = createRequire(import.meta.url)(`${await packageDirectory()}/package.json`)

const patch = packageJson.version.replace(/(\d+)$/, (_, $1) => Number($1) + 1)
const minor = packageJson.version.replace(/(\d+)\.\d+$/, (_, $1) => `${Number($1) + 1}.0`)
const major = packageJson.version.replace(/^(\d+)\.\d+\.\d+$/, (_, $1) => `${Number($1) + 1}.0.0`)
const currentVersion = packageJson.version

const answer = await select({
  message: '选择一个更新类型:',
  choices: [
    {
      name: `patch:(${patch})`,
      value: patch,
      description: '补丁版本号:进行了一些不会破坏现有功能的更改'
    },
    {
      name: `minor:(${minor})`,
      value: minor,
      description: '次版本号:添加了新功能，但不会破坏现有功能'
    },
    {
      name: `major:(${major})`,
      value: major,
      description: '主版本号:进行了破坏性更改、删除或不向后兼容的更改、添加了具有里程碑意义的新功能'
    },
    {
      name: `current:(${currentVersion})`,
      value: currentVersion,
      description: '保持当前版本号'
    },
    {
      name: 'exit',
      value: 'exit',
      description: '退出'
    },
    new Separator()
  ]
})
if (answer === 'exit') process.exit(0)
packageJson.version = answer
for (const key in packageJson['vnr']) {
  packageJson.scripts[key] = packageJson['vnr'][key].replace(/\$/g, answer)
}
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
// 选择package.json中的scripts字段中的脚本继续执行
const skipScripts = ['build', 'start', 'test', 'lint', 'format', 'vnr']
const scripts = Object.keys(packageJson.scripts)
const script = await select({
  message: '选择一个脚本:',
  choices: scripts
    .filter((script) => !packageJson.scripts[script].split(" ").some((item) => skipScripts.includes(item)))
    .map((script) => ({
      name: script,
      value: script,
      description: packageJson.scripts[script]
    }))
    .concat({
      name: 'exit',
      value: 'exit',
      description: '不执行任何脚本，退出'
    })
})
if (script === 'exit') process.exit(0)
execa('npm', ['run', script], { stdio: 'inherit' })
