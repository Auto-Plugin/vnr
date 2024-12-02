## vnr - Version Number Reviser

适用于 node package.json version 的自动更新版本号的 cli 应用

### 安装

```shell
pnpm i vnr
```

### 使用

在你的 package.json 做如下配置

```json
// package.json
"scripts": {
	"build":"vnr"
},
"vnr": {
    "docker:build": "docker build -t weapp_images -t registry.xxxx.com/xxx/xxx:v$ ."
},
```

vnr 将自动在 `$` 处填写版本，同时更新你的 package.json version字段，并为你生成命令。

在做完上述配置后，执行

```shell
npm run build
```

按步骤完成后，vnr 将为你在package.json的`scripts` 中生成 `docker:build` 命令。

你可以在接下来的步骤中执行命令。
