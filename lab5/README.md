## **一、实验目标**

- 掌握如何构建 HarmonyOS应用。
- 掌握应用程序包结构、资源文件的使用。
- 掌握ArkTS的核心功能和语法等基础知识，为后续的应用开发奠定基础。

------

## 二、实验步骤

### 2.1 实验前准备

- 在 [华为开发者官网](https://developer.huawei.com/consumer/cn/download/) 下载最新版 **DevEco Studio**。

  - > <span style="color:#008b8d">**DevEco Studio** 是华为推出的 **HarmonyOS 官方集成开发环境 (IDE)**，基于 IntelliJ IDEA 构建，提供了 **项目创建、调试、模拟器运行、真机调试、签名管理** 等功能。它支持 HarmonyOS 全场景设备的应用开发（手机、平板、穿戴设备等），并内置了 **Previewer** 方便开发者快速预览界面效果。</span>

- 安装完成后首次启动需要配置 SDK 路径，保持默认即可。



### 2.2 工程创建

- 使用 **DevEco Studio** 创建 **ArkTS 工程**。

  - > <span style="color:#008b8d">**ArkTS**是 **HarmonyOS 的声明式开发语言**。**声明式 UI**是一种描述界面结构和状态的编程方式。在这种模式下，开发者只需要 **声明界面在某种状态下应该长什么样**，框架会根据数据的变化自动更新界面。相比之下，传统的 **命令式 UI** 要求开发者手动编写界面更新逻辑，比如“点击按钮后，把某个文本框的内容改成 XX”。</span>

  - 选择 **Application**的**Empty Ability** 模板，SDK 选择 **5.1.1(19)**，其他保持默认，点击 Finish，自动生成项目目录结构。


- **了解工程目录**
  - **AppScope/app.json5**：应用全局配置。
  - **entry/src/main/ets/pages**：存放页面文件（Index.ets、Second.ets）。
  - **entry/src/main/resources**：存放图片、字符串等资源。
  - **module.json5**：模块配置文件。
  - **oh-package.json5**：依赖配置文件。


### 2.3 构建第一个页面

- 定位并改造页面布局
  - 打开 `entry/src/main/ets/pages/Index.ets`。
  - 将默认相对布局替换为 **Row/Column 声明式线性布局**（代码下文统一提供）。

- **编写首页 UI 与逻辑（含跳转按钮）**

```ts
// Index.ets
import { BusinessError } from '@kit.BasicServicesKit';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World';

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)

        // 添加按钮，以响应用户 onClick 事件
        Button() {
          Text('Next')
            .fontSize(30)
            .fontWeight(FontWeight.Bold)
        }
        .type(ButtonType.Capsule)
        .margin({ top: 20 })
        .backgroundColor('#0D9FFB')
        .width('40%')
        .height('5%')
        // 跳转按钮绑定 onClick 事件，单击时跳转到第二页
        .onClick(() => {
          console.info(`Succeeded in clicking the 'Next' button.`);
          // 获取 UIContext 与 Router
          let uiContext: UIContext = this.getUIContext();
          let router = uiContext.getRouter();
          // 跳转到第二页
          router.pushUrl({ url: 'pages/Second' }).then(() => {
            console.info('Succeeded in jumping to the second page.')
          }).catch((err: BusinessError) => {
            console.error(`Failed to jump to the second page. Code is ${err.code}, message is ${err.message}`)
          })
        })
      }
      .width('100%')
    }
    .height('100%')
  }
}
```



### 2.5 构建第二个页面 & 路由配置

- **新建 Second 页面文件**
  - 在 `entry/src/main/ets/pages` 目录新增`Second.ets`。

- **配置页面路由**
  - 打开 `entry/src/main/resources/base/profile/main_pages.json`，在 `"src"` 数组中**加入** `pages/Second`。

```json
{
  "src": [
    "pages/Index",
    "pages/Second"
  ]
}
```

> <span style="color:#008b8d">这是 **页面导航的索引**。未登记的页面将无法通过 `router.pushUrl()` 找到并跳转，常见问题是点击无效。</span>

- **编写 Second.ets**

```ts
// Second.ets
import { BusinessError } from '@kit.BasicServicesKit';

@Entry
@Component
struct Second {
  @State message: string = 'Hi there';

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)

        Button() {
          Text('Back')
            .fontSize(30)
            .fontWeight(FontWeight.Bold)
        }
        .type(ButtonType.Capsule)
        .margin({ top: 20 })
        .backgroundColor('#0D9FFB')
        .width('40%')
        .height('5%')
        // 返回按钮绑定 onClick 事件，单击按钮时返回到第一页
        .onClick(() => {
          console.info(`Succeeded in clicking the 'Back' button.`);
          // 获取 UIContext 与 Router
          let uiContext: UIContext = this.getUIContext();
          let router = uiContext.getRouter();
          try {
            router.back()
            console.info('Succeeded in returning to the first page.')
          } catch (err) {
            let code = (err as BusinessError).code;
            let message = (err as BusinessError).message;
            console.error(`Failed to return to the first page. Code is ${code}, message is ${message}`)
          }
        })
      }
      .width('100%')
    }
    .height('100%')
  }
}
```

## 三、程序运行结果

- 首页（Index.ets）显示Hello World与 `Next` 按钮
- **跳转效果**：点击 `Next` 跳转到第二页
- 第二页（Second.ets）显示Hi there与 `Back` 按钮
- **返回效果**：点击 `Back` 返回首页


## 四、问题总结与体会

### 4.1 问题总结

- **问题1**：在 Previewer 中尝试 Apply Changes 时出现 `ErrorCode: 00402015`。
  - **原因**：Previewer 仅支持 UI 预览，不支持热更新。
  - **解决**：使用模拟器或真机运行。
- **问题2**：路由配置不正确导致跳转失败。
  - **原因**：`main_pages.json` 未正确写入 `"pages/Second"`。
  - **解决**：检查并添加路由。

### 4.2 体会

这次实验让我对 DevEco Studio 和声明式 UI 有了一个很浅显的认识。通过操作我发现，声明式 UI 的方式让页面编写变得直观，不再需要逐步控制界面更新，感觉很有意思。能明显感受到程序员正在逐渐从繁琐的基础实现中解放出来，有更多精力可以放在功能逻辑与交互设计上，应用开发也在向着更加模块化和高效的方向发展，这让我对未来的开发体验充满期待。

