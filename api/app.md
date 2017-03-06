# 本文介绍:应用整体控制

> `app` 模块是为了控制整个应用的生命周期设计的,它就是应用的基础核心
 
进程: [主进程](../tutorial/quick-start.md#main-process)    

最后一个窗口被关闭时退出应用的示例:
```javascript
const {app} = require('electron')
app.on('window-all-closed', () => {
  app.quit()
})
```

## 事件列表

`app` 对象会触发以下事件：

### 事件：'will-finish-launching'
> 触发:**应用程序完成基本启动时**

Windows 和 Linux 中， `will-finish-launching` 事件等同 `ready` 事件
macOS 中，事件等同 `NSApplication` 中的 `applicationWillFinishLaunching` 提示
通常在这里为 `open-file` 和 `open-url` 设置监听器,用于启动崩溃报告和自动更新之类。
但大多数的情况下只需在 `ready` 事件完成所有业务。

### 事件：'ready'
> 触发:**Electron 完成初始化**

* `launchInfo` Object  _macOS_

macOs 中， 如果是从通知中心中启动，那么 `launchInfo` 中的 `userInfo`包含着用来打开应用程序的 `NSUserNotification` 信息。
 `app.isReady()` 方法可检查此事件是否已触发。

### 事件：'window-all-closed'
> 触发:**所有的窗口都被关闭时**
 
如果您没有监听此事件，当所有窗口都已关闭时，默认退出应用程序。
但如果你监听此事件，将由你来控制应用程序是否退出。
如果用户按下了 `Cmd + Q`，或者开发者调用了 `app.quit()` ，
Electron 将会先尝试关闭所有的窗口再触发 `will-quit` 事件，在这种情况下 `window-all-closed`不会被触发。

### 事件：'before-quit'
> 触发:**应用程序开始关闭窗口并退出之前**

* `event` Event

调用 `event.preventDefault()` 可阻止应用程序默认的终止。

 **注意：** 如果退出是由 `autoUpdater.quitAndInstall()`启动的, 所有窗口全部 `close`事件之后才会触发 `before-quit` 。

### 事件：'will-quit'
> 触发:**应用程序已经被关闭窗口且应用即将退出时**
 
* `event` Event

调用 `event.preventDefault()` 可阻止应用程序默认的终止。

 `window-all-closed` 事件的描述中详诉了 `will-quit`与 `window-all-closed`的区别。

### 事件：'quit'
> 触发:**应用程序退出时**
 
* `event` Event
* `exitCode` Integer

### 事件：'open-file' _macOS_
> 触发:**用户想要在应用中打开一个文件**
 
* `event` Event
* `path` String


 `open-file` 事件常常在应用已经打开并且系统想要再次使用应用打开文件时,
或者在一个文件被拖入 dock 且应用还没有运行的时候被触发。
 
请确认在应用启动的时候(甚至在 `ready` 事件被触发前)就对 `open-file` 事件进行监听，以处理这种情况。

如果你想处理这个事件，你应该调用 `event.preventDefault()` 。

在 Windows系统中, 你需要通过解析 process.argv 来获取文件路径。

### 事件：'open-url' _macOS_
> 触发:**用户想要在应用中打开一个url**
 
* `event` Event
* `url` String

应用程序的 `Info.plist`文件必须在 `CFBundleURLTypes` 键中定义 `url` 方案，并将 `NSPrincipalClass` 设为 `AtomApplication`。
如果你想处理这个事件，你应该调用 `event.preventDefault()` 。

### 事件：'activate' _macOS_
> 触发:**应用被激活时**
  
* `event` Event
* `hasVisibleWindows` Boolean

 各种操作都可以触发此事件，例如首次启动应用，重启应用，或单击应用程序的停靠栏或任务栏图标。

### 事件: 'continue-activity' _macOS_
> 触发:**来自不同设备的活动通过 [Handoff][handoff] 想要恢复时**

* `event` Event
* `type` String - 标识当前状态的字符串。 映射到[`NSUserActivity.activityType`] [activity-type]。
* `userInfo` Object - 包含由另一个设备上的活动所存储的应用程序特定的状态。

恢复的前提是具有支持相应的活动类型并且开发团队ID一致。
所支持活动类型已在应用的 `Info.plist`中的 `NSUserActivityTypes`明确定义。
可调用 `event.preventDefault()` 处理这个事件。

### 事件：'browser-window-blur'
> 触发:**[BrowserWindow](browser-window.md) 失去焦点时**

* `event` Event
* `window` BrowserWindow

### 事件：'browser-window-focus'
> 触发:**[BrowserWindow](browser-window.md) 获得焦点时**

* `event` Event
* `window` BrowserWindow

### 事件：'browser-window-created'
> 触发:**当[BrowserWindow](browser-window.md) 被创建时**

* `event` Event
* `window` BrowserWindow

### 事件: 'web-contents-created'
> 触发:**在新的 [webContents](web-contents.md) 创建后**

* `event` Event
* `webContents` WebContents

### 事件：'certificate-error'
> 触发:**对 `url` 验证 `certificate` 证书失败时**

* `event` Event
* `webContents` [WebContents](web-contents.md)
* `url` String - URL 地址
* `error` String - 错误码
* `certificate` Object [Certificate](structures/certificate.md)
  * `data` Buffer - PEM 编码数据
  * `issuerName` String - 发行者的公有名称
* `callback` Function
  * `isTrusted` Boolean - 是否信任这个证书

如果需要信任这个证书，你需要阻止默认行为 `event.preventDefault()` 并且调用 `callback(true)`。

```javascript
const {app} = require('electron')
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (url === 'https://github.com') {
    // Verification logic.
    event.preventDefault()
    callback(true)
  } else {
    callback(false)
  }
})
```

### 事件：'select-client-certificate'
> 触发:**请求客户端证书时**

* `event` Event
* `webContents` [WebContents](web-contents.md)
* `url` String - URL 地址
* `certificateList` [Object]
  * `data` Buffer - PEM 编码数据
  * `issuerName` String - 发行者的公有名称
* `callback` Function
  * `certificate` [Certificate](structures/certificate.md) (可选)

`url` 指的是请求客户端证书的网页地址，使用 `callback` 时从传入的证书列表中筛选出证书。

可调用 `event.preventDefault()` 来防止应用自动使用第一个证书进行验证。如下所示：
```javascript
app.on('select-certificate', function (event, host, url, list, callback) {
  event.preventDefault()
  callback(list[0])
})
```

### 事件: 'login'
> 触发:**`webContents`想要做基本的验证时**

* `event` Event
* `webContents` [WebContents](web-contents.md)
* `request` Object
  * `method` String
  * `url` URL
  * `referrer` URL
* `authInfo` Object
  * `isProxy` Boolean
  * `scheme` String
  * `host` String
  * `port` Integer
  * `realm` String
* `callback` Function
  * `username` String
  * `password` String
 
默认情况下，Electron 会取消所有的验证行为，如果需要重写这个行为，你需要用 `event.preventDefault()` 来阻止默认行为，并且
用 `callback(username, password)` 来进行验证。

```javascript
const {app} = require('electron')
app.on('login', (event, webContents, request, authInfo, callback) => {
  event.preventDefault()
  callback('username', 'secret')
})
```

### 事件：'gpu-process-crashed'
> 触发:**`GPU进程崩溃或被杀死时**

* `event` Event
* `killed` Boolean

### 事件: 'accessibility-support-changed' _macOS_ _Windows_
> 触发:**`Chrome 的辅助功能状态改变时如屏幕阅读被启用或被禁用**

* `event` Event
* `accessibilitySupportEnabled` Boolean - 当启用Chrome的辅助功能时候为`true`, 其他情况为 `false`.

[点此查看](https://www.chromium.org/developers/design-documents/accessibility) 更多详情.


## 方法列表
 `app`  对象拥有以下的方法：
**请注意** 有的方法只能用于特定的操作系统，已标注。

### `app.quit()`
> 用途:**`关闭所有已打开的窗口并退出程序**

 关窗前,触发 `before-quit` 事件。
 关窗后,触发 `will-quit` 事件。
 再用 `quit`进行终止应用程序。
 
这个方法保证了所有的 `beforeunload` 和 `unload` 事件处理器被正确执行。
假如窗口的 `beforeunload` 事件处理器返回 `false`，那么整个应用可能会取消退出。

### `app.exit(exitCode)`
> 用途:**`带着 `exitCode` 忽略 `before-quit` 和 `will-quit` 事件强行退出应用**

* `exitCode` String 默认值为0

 所有的窗口会被立刻关闭且不会询问用户。
 
 `exitCode` 默认为0
 
### `app.relaunch([options])`
> 用途:**退出当前实例，重启应用**

* `options` Object (可选)
  * `args` String[] (可选)
  * `execPath` String (可选)

默认情况下，新实例将使用与当前实例相同的工作目录和命令行参数。
当指定 `args`时， `args`将作为命令行参数传递。
当指定 `execPath`时， `execPath`将被执行以重新启动，而不是当前的应用程序。
请注意，此方法在执行时并不退出应用程序，您必须在 `app.relaunch`后调用 `app.quit`或 `app.exit`使应用程序重新启动。
当 `app.relaunch`被多次调用时，多个实例将在当前实例退出后启动。
立即重新启动当前实例并向新实例添加新的命令行参数的示例：

```javascript
const {app} = require('electron')

app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
app.exit(0)
```

### `app.isReady()`
> 用途:**判断是否已完成初始化**

返回 `Boolean` - `true`即已经完成初始化，否则为false。


### `app.focus()`
> 用途:**聚焦首选窗口**

* Linux或Windows中, 使应用的第一个窗口获取焦点.
* macOS中, 让该应用成为活动应用程序。

### `app.hide()` _macOS_
> 用途:**隐藏所有应用程序窗口，而不将其最小化**

### `app.show()` _macOS_
> 用途:**重新显示隐藏的窗口，且无需对焦**

### `app.getAppPath()`
> 用途:**返回当前应用所在的文件路径**

返回 `String` - 当前应用程序目录

### `app.getPath(name)`
> 用途:**根据字符串查找指定路径**

* `name` String

返回与 `name` 参数相关的特殊文件夹或文件路径。当失败时抛出 `Error` 。
你可以通过名称请求以下的路径：
* `home` 用户的 home 文件夹(主目录)
* `appData` 当前用户的应用数据文件夹，默认对应：
  * `%APPDATA%` Windows 中
  * `$XDG_CONFIG_HOME` or `~/.config` Linux 中
  * `~/Library/Application Support` macOS 中
* `userData` 储存你应用程序设置文件的文件夹，默认是 `appData` 文件夹附加应用的名称
* `temp` 临时文件夹
* `exe` 当前的可执行文件
* `module`  `libchromiumcontent` 库
* `desktop` 当前用户的桌面文件夹
* `documents` 用户文档目录的路径
* `downloads` 用户下载目录的路径.
* `music` 用户音乐目录的路径.
* `pictures` 用户图片目录的路径.
* `videos` 用户视频目录的路径.
* `pepperFlashSystemPlugin`  Pepper Flash插件所在目录

### `app.getFileIcon(path[, options], callback)`
> 用途:**获取路径文件的关联图标**

* `path` String
* `options` Object (可选)
  * `size` String
    * `small` - 16x16
    * `normal` - 32x32
    * `large` - _Linux_里的最大值是48x48 ,  _Windows_里的最大值是32x32, _macOS_中无效.
* `callback` Function
  * `error` Error
  * `icon` [NativeImage](native-image.md)

在Windows中，有2种图标：
与某些文件扩展名（例如 `.mp3`, `.png`,等）相关联的图标
文件本身的图标，如 `.exe`, `.dll`, `.ico`.
在Linux和macOS上，图标取决于与文件MIME类型相关联的应用程序。

### `app.setPath(name, path)`
> 用途:**重写 `name` 的路径为 `path`**

* `name` String
* `path` String

 `path` 可以是目录或者文件，这个和 `name` 的类型有关。
如果 `path` 目录不存在，则该方法将创建 `path`,创建错误则会抛出 `Error`。
`name` 参数只能使用 `app.getPath` 中定义的 `name`。
默认情况下，网页的 cookie 和缓存都会储存在 `userData` 目录
如果你想要改变这个位置，你需要在 `app` 模块中的 `ready` 事件被触发之前重写 `userData` 的路径。

### `app.getVersion()`
> 用途:**返回应用程序的版本**

返回 `String` - 如果 `package.json` 文件中没有写版本号，将会返回当前包或者可执行文件的版本。

### `app.getName()`
> 用途:**返回应用程序的名称**

返回 `String` 
返回的是 `package.json` 文件中的应用名称
由于 npm 的命名规则， `name` 字段是一个简短的小写名称。
你应该定义一个 `productName` 字段，用于表示应用程序完整名称。
Electron 会优先使用这个字段作为应用名。

### `app.setName(name)`
> 用途:**重写当前应用的名称**

* `name` String - 新应用名称

### `app.getLocale()`
> 用途:**返回应用程序的语言**

返回 `String` - 当前应用程序语言环境。可能的返回值记录在这里[locales.md]。

 **两点注意：**
当分发您的打包应用程序时，您必须指定`locales`文件夹。
在Windows上，必须在`ready`事件发出后调用它。

### `app.addRecentDocument(path)`  _macOS_ _Windows_
> 用途:**将 `path`添加到最近的文档列表中**

* `path` String

这个列表由操作系统进行管理。在 Windows 中从任务栏访问列表，在 macOS 中通过 dock 菜单进行访问。

### `app.clearRecentDocuments()` _macOS_ _Windows_
> 用途:**清除最近访问的文档列表**

### `app.setAsDefaultProtocolClient(protocol[, path, args])` _macOS_ _Windows_
> 用途:**自定义协议格式并设置为默认处理程序**

* `protocol` String - 不包含 `://`的协议名称, .例如处理链接为 `electron://` ,填上 `electron` .
* `path` String (optional) _Windows_ - 默认为 `process.execPath`
* `args` String[] (optional) _Windows_ -  默认为空数组

返回 `Boolean` - 调用是否成功.

此方法将当前可执行文件设置为协议（也称为URI方案）的默认处理程序。它允许您将应用程序更深入地集成到操作系统中。
一旦注册，所有与 `your-protocol：//`的链接将与当前可执行文件一起打开。整个链接（包括协议）将作为参数传递到应用程序。
在Windows系统中，，您可以提供可选参数 `path`，可执行文件的路径和 `args`(在启动时传递给可执行文件的参数数组).

 **注意：**在macOS上，您只能注册已添加到应用程序的info.plist中的协议，这些协议不能在运行时修改。但是，您可以在构建时使用
 简单的文本编辑器或脚本更改文件。
 有关详细信息，请参阅 [Apple's documentation][CFBundleURLTypes] 
该API在内部使用Windows注册表和lssetdefaulthandlerforurlscheme。

### `app.removeAsDefaultProtocolClient(protocol[, path, args])` _macOS_ _Windows_
> 用途:**移除协议与默认程序之间的关联**

* `protocol` String - 不包含 `://`的协议名称
* `path` String (optional) _Windows_ - 默认为 `process.execPath`
* `args` String[] (optional) _Windows_ - 默认为空数组

返回 `Boolean`
此方法检查当前可执行文件是否为协议（也称为URI方案）的默认处理程序。如果是，它会删除应用程序作为默认处理程序。

### `app.isDefaultProtocolClient(protocol[, path, args])` _macOS_ _Windows_
> 用途:**判断当前应用是否为指定协议的默认程序**

* `protocol` String - 不包含 `://`的协议名称
* `path` String (optional) _Windows_ - 默认值  `process.execPath`
* `args` String[] (optional) _Windows_ - 默认为空数组

返回 `Boolean`
此方法检查当前可执行文件是否是协议（也称为URI方案）的默认处理程序。如果是这样，它将返回true。否则，它将返回false。
**注意：**在macOS上，您可以使用此方法检查应用程序是否已注册为协议的默认协议处理程序。
同时可以通过查看 `~/Library/Preferences/com.apple.LaunchServices.plist` 来验证这一点。 
有关详细信息，请参阅 [苹果说明文档][LSCopyDefaultHandlerForURLScheme] 。         
该API在内部使用Windows注册表和lssetdefaulthandlerforurlscheme。

### `app.setUserTasks(tasks)` _Windows_
> 用途:**将 `tasks` 添加到 Windows 中 JumpList(跳转列表) 功能的 [Tasks][tasks] 分类中**

* `tasks` [Task](structures/task.md) - 一个由 Task 对象构成的数组
 `tasks` 中的 `Task` 对象格式如下：
`Task` Object
* `program` String - 执行程序的路径，通常你应该说明当前程序的路径为 `process.execPath` 字段。
* `arguments` String - 当 `program` 执行时的命令行参数。
* `title` String - JumpList 中显示的标题。
* `description` String - 对这个任务的描述。
* `iconPath` String - JumpList 中显示的图标的绝对路径，可以是一个任意包含一个图标的资源文件。通常来说，你可以通过指明 `process.execPath` 来显示程序中的图标。
* `iconIndex` Integer - 图标文件中的采用的图标位置。如果一个图标文件包括了多个图标，就需要设置这个值以确定使用的是哪一个图标。
如果这个图标文件中只包含一个图标，那么这个值为 0。
返回 `Boolean` - 执行是否成功.

**提示:** 如果希望更多的定制任务栏跳转列表，请使用 `app.setJumpList(categories)` 。

### `app.getJumpListSettings()` _Windows_
> 用途:**获得跳转列表**

返回 `Object`:
* `minItems` Integer - 将在跳转列表中显示项目的最小数量 (有关此值的更详细描述，请参阅
  [MSDN docs][JumpListBeginListMSDN]).
* `removedItems` [JumpListItem[]](structures/jump-list-item.md) -  `JumpListItem` 对象数组，对应着用户在跳转列表中明确删除的项目。
这些项目不能在 **下一个**调用 `app.setJumpList()` 时重新添加到跳转列表中,

Windows不会显示任何包含已删除项目的自定义类别.

### `app.setJumpList(categories)` _Windows_

* `categories` [JumpListCategory[]](structures/jump-list-category.md) 或者 `null` - `JumpListCategory` 对象的数组.

设置或删除应用程序的自定义跳转列表，并返回以下字符串之一：

* `ok` - 没有出现错误。
* `error` - 发生一个或多个错误，启用运行日志记录找出可能的原因。
* `invalidSeparatorError` -尝试向跳转列表中的自定义跳转列表添加分隔符。 分隔符只允许在标准的 `Tasks` 类别中。
* `fileTypeRegistrationError` - 尝试向自定义跳转列表添加一个文件链接，但是该应用未注册处理该应用类型。
* `customCategoryAccessDeniedError` - 由于用户隐私或策略组设置，自定义类别无法添加到跳转列表。

如果 `categories` 值为 `null` ，之前设定的自定义跳转列表(如果存在)将被替换为标准的应用跳转列表(由windows生成)

`JumpListCategory` 对象需要包含以下属性：

* `type` String - 以下其中一个：
  * `tasks` - 此类别中的项目将被放置到标准的`Tasks`类别中。只能有一个这样的类别，
    将总是显示在跳转列表的底部。
  * `frequent` - 显示应用常用文件列表，类别的名称及其项目由Windows设置。
  * `recent` - 显示应用最近打开的文件的列表，类别的名称及其项目由Windows设置。 
    可以使用`app.addRecentDocument(path)`间接添加到项目到此类别。
  * `custom` - 显示任务或文件链接，`name`必须由应用程序设置。
* `name` String - 当`type` 为 `custom` 时此值为必填项,否则应省略。
* `items` Array - `JumpListItem` 对象数组，如果 `type` 值为 `tasks` 或
  `custom` 时必填，否则应省略。

**注意:** 如果`JumpListCategory`对象没有设置`type`和`name`属性，
那么`type`默认为`tasks`。 如果设置`name`属性，省略`type`属性，
则`type`默认为`custom`。

**注意:** 用户可以从自定义类别中移除项目，**下次**调用`app.setJumpList(categories)`方法之前，
Windows不允许删除的项目添加回自定义类别。 尝试提前将删除的项目重新添加
到自定义类别中，将导致整个自定义类别被隐藏。 删除的项目可以使用 `app.getJumpListSettings()`获取。

`JumpListItem` 对象需要包含以下属性:

* `type` String - 以下其中一个值:
  * `task` - 带有特殊参数的方式启动一个应用；
  * `separator` - 可以用于标准的 `Tasks`类别中的独立项目；
  * `file` - 一个链接将使用创建跳转列表的应用程序打开一个文件,对应的应用程序必须
   注册为这个文件类型的处理程序(不必是默认的处理程序)
* `path` String - 要打开的文件的路径， 只有当 `type` 值为 `file`时设置
* `program` String - 要执行程序的路径, 通常需要指定`process.execPath` 打开当前的应用程序.
 只有当 `type` 值为 `task`时设置
* `args` String -  `program` 运行时的命令参数， 只有当 `type` 值为 `task`时设置
* `title` String - 跳转列表中项目的展示文本.
  只有当 `type` 值为 `task`时设置
* `description` String - 任务说明(显示在工具提示中).
  只有当 `type` 值为 `task`时设置
* `iconPath` String - 要显示在跳转列表中的图标的绝对路径，可以是包含图标的
任意资源文件(例如`.ico`，`.exe`，`.dll`)。 你通常可以指定`process.execPath`来显示程序图标。
* `iconIndex` Integer - 资源文件中图标的索引。 如果资源文件包含多个图标，
则此值可用于指定此任务图标的(从0开始)索引，如果资源文件只包含一个图标，则此属性应设置为0

以下是一个创建一个自定义跳转列表的简单例子：

```javascript
const {app} = require('electron')

app.setJumpList([
  {
    type: 'custom',
    name: 'Recent Projects',
    items: [
      { type: 'file', path: 'C:\\Projects\\project1.proj' },
      { type: 'file', path: 'C:\\Projects\\project2.proj' }
    ]
  },
  { // has a name so `type` is assumed to be `custom`
    name: 'Tools',
    items: [
      {
        type: 'task',
        title: 'Tool A',
        program: process.execPath,
        args: '--run-tool-a',
        icon: process.execPath,
        iconIndex: 0,
        description: 'Runs Tool A'
      },
      {
        type: 'task',
        title: 'Tool B',
        program: process.execPath,
        args: '--run-tool-b',
        icon: process.execPath,
        iconIndex: 0,
        description: 'Runs Tool B'
      }
    ]
  },
  { type: 'frequent' },
  { // has no name and no type so `type` is assumed to be `tasks`
    items: [
      {
        type: 'task',
        title: 'New Project',
        program: process.execPath,
        args: '--new-project',
        description: 'Create a new project.'
      },
      { type: 'separator' },
      {
        type: 'task',
        title: 'Recover Project',
        program: process.execPath,
        args: '--recover-project',
        description: 'Recover Project'
      }
    ]
  }
])
```

### `app.makeSingleInstance(callback)`

* `callback` Function

这个方法可以让你的应用在同一时刻最多只会有一个实例，否则你的应用可以被运行多次并产生多个实例。你可以利用这个接口保证只有一个实例正
常运行，其余的实例全部会被终止并退出。

如果多个实例同时运行，那么第一个被运行的实例中 `callback` 会以 `callback(argv, workingDirectory)` 的形式被调用。其余的实例
会被终止。
`argv` 是一个包含了这个实例的命令行参数列表的数组，`workingDirectory` 是这个实例目前的运行目录。通常来说，我们会用通过将应用在
主屏幕上激活，并且取消最小化，来提醒用户这个应用已经被打开了。

在 `app` 的 `ready` 事件后，`callback` 才有可能被调用。

如果当前实例为第一个实例，那么在这个方法将会返回 `false` 来保证它继续运行。否则将会返回 `true` 来让它立刻退出。

在 macOS 中，如果用户通过 Finder,  `open-file` 或者 `open-url` 打开应用，系统会强制确保只有一个实例在运行。但是如果用户是通过
命令行打开，这个系统机制会被忽略，所以你仍然需要靠这个方法来保证应用为单实例运行的。

下面是一个简单的例子。我们可以通过这个例子了解如何确保应用为单实例运行状态。

```javascript
const {app} = require('electron')
let myWindow = null

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (myWindow) {
    if (myWindow.isMinimized()) myWindow.restore()
    myWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

// Create myWindow, load the rest of the app, etc...
app.on('ready', () => {
})
```

### `app.releaseSingleInstance()`
释放所有由 `makeSingleInstance` 创建的限制. 
这将允许应用程序的多个实例依次运行.

### `app.setUserActivity(type, userInfo[, webpageURL])` _macOS_
* `type` String - 唯一标识活动. 映射到
  [`NSUserActivity.activityType`][activity-type].
* `userInfo` Object - 应用程序特定状态，供其他设备使用
* `webpageURL` String - 如果在恢复设备上未安装合适的应用程序，则会在浏览器中加载网页。 
该格式必须是`http`或`https`。
创建`NSUserActivity` 并将其设置为当前activity,该 Activity
有资格进行 [Handoff][handoff] 到另一个设备.

### `app.getCurrentActivityType()` _macOS_
 `String` - 正在运行的 activity 的类型.

### `app.setAppUserModelId(id)` _Windows_
* `id` String
改变当前应用的 [Application User Model ID][app-user-model-id] 为 `id`.

### `app.importCertificate(options, callback)` _LINUX_
* `options` Object
  * `certificate` String - pkcs12 文件的路径.
  * `password` String - 证书的密码.
* `callback` Function
  * `result` Integer - 导入结果.

将pkcs12格式的证书导入证书库. 导入操作的回调函数，带有的`result`参数,
`0` 表示成功，其他值表示失败，参照 [net_error_list](https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h).

### `app.disableHardwareAcceleration()`
为当前应用程序禁用硬件加速
该方法只能在应用ready之前调用

### `app.setBadgeCount(count)` _Linux_ _macOS_
* `count` Integer
返回 `Boolean` - 执行是否成功.
设置当前app的badge上的值. `0` 将会隐藏该badge
macOS系统中，这会展示在dock图标上，在Linux系统中，仅仅在 Unity launcher上有效。
**注意:** Unity launcher工作依赖于 `.desktop`文件,
详细信息请参阅 [Desktop Environment Integration][unity-requiremnt].

### `app.getBadgeCount()` _Linux_ _macOS_
返回 `Integer` - 当前展示在badge上的值.

### `app.isUnityRunning()` _Linux_
返回 `Boolean` - 当前工作环境是否为 Unity launcher.

### `app.getLoginItemSettings()` _macOS_ _Windows_

返回 `Object`:

* `openAtLogin` Boolean -  `true` 如果程序设置的在登录时启动.
* `openAsHidden` Boolean - `true` 如果程序设置在登录时隐藏启动.
  该设定仅支持macOS.
* `wasOpenedAtLogin` Boolean - `true` 如果程序在登录时已自动启动. 该设定仅支持macOS.
* `wasOpenedAsHidden` Boolean - `true` 如果该程序在登录时已经隐藏启动.
这表示该程序不应在启动时打开任何窗口.该设定仅支持macOS.
* `restoreState` Boolean - `true` 如果该程序作为登录启动项并且需要回复之前的会话状态，
这表示程序应该还原上次关闭时打开的窗口。该设定仅支持macOS.

**注意:** 该 API 不影响
[MAS builds][mas-builds].

### `app.setLoginItemSettings(settings)` _macOS_ _Windows_
* `settings` Object
  * `openAtLogin` Boolean - `true` 在登录时启动程序, `false` 移除程序作为登录启动项. 默认为 `false`.
  * `openAsHidden` Boolean - `true` 登录时隐藏启动程序.默认为
    `false`. 用户可以从系统首选项编辑此设置。因此程序启动后可以通过
    `app.getLoginItemStatus().wasOpenedAsHidden` 检查当前值. 该设置仅适用于macOS
设定应用的登录选项。
**注意:** 该 API 不影响
[MAS builds][mas-builds].

### `app.isAccessibilitySupportEnabled()` _macOS_ _Windows_
 `Boolean` - 如果开启了Chrome的辅助功能，则返回`true`,
其他情况返回 `false`. 如果使用了辅助技术，将会返回 `true` , 比如检测到使用屏幕阅读功能。详细信息请参阅
https://www.chromium.org/developers/design-documents/accessibility 

### `app.setAboutPanelOptions(options)` _macOS_

* `options` Object
  * `applicationName` String (optional) - 应用名.
  * `applicationVersion` String (optional) - 应用版本.
  * `copyright` String (optional) - Copyright 信息.
  * `credits` String (optional) - 信誉信息.
  * `version` String (optional) - 开发版本号.

设置关于面板的选项，这将覆盖应用程序 `.plist` 文件中定义的值。
详细信息，请参阅 [Apple docs][about-panel-options] .

### `app.commandLine.appendSwitch(switch[, value])`
通过可选的参数 `value` 给 Chromium 中添加一个命令行开关。

**注意** 这个方法不会影响 `process.argv`，我们通常用这个方法控制一些底层 Chromium 行为。

### `app.commandLine.appendArgument(value)`
给 Chromium 中直接添加一个命令行参数，这个参数 `value` 的引号和格式必须正确。
**注意** 这个方法不会影响 `process.argv`。

### `app.dock.bounce([type])` _macOS_
* `type` String - 可选参数，可以是 `critical` 或 `informational`。默认为 `informational`。
当传入的是 `critical` 时，dock 中的应用将会开始弹跳，直到这个应用被激活或者这个请求被取消。
当传入的是 `informational` 时，dock 中的图标只会弹跳一秒钟。但是，这个请求仍然会激活，直到应用被激活或者请求被取消。
这个方法返回的返回值表示这个请求的 ID。

### `app.dock.cancelBounce(id)` _macOS_
* `id` Integer
取消这个 `id` 对应的请求。

### `app.dock.downloadFinished(filePath)` _macOS_
* `filePath` String
如果filePath位于Downloads文件夹中，则弹出下载队列。

### `app.dock.setBadge(text)` _macOS_
* `text` String
设置应用在 dock 中显示的字符串。

### `app.dock.getBadge()` _macOS_
返回应用在 dock 中显示的字符串。

### `app.dock.hide()` _macOS_
隐藏应用在 dock 中的图标。

### `app.dock.show()` _macOS_
显示应用在 dock 中的图标。

### `app.dock.isVisible()` _macOS_
返回 `Boolean` - dock 图标是否可见.
`app.dock.show()` 是异步方法，因此此方法可能无法在调用之后立即返回true.

### `app.dock.setMenu(menu)` _macOS_
* `menu` [Menu](menu.md)
设置应用的 [dock 菜单][dock-menu],macOS中有效

### `app.dock.setIcon(image)` _macOS_
* `image` [NativeImage](native-image.md)
设置应用在 dock 中显示的图标。


[dock-menu]:https://developer.apple.com/library/mac/documentation/Carbon/Conceptual/customizing_docktile/concepts/dockconcepts.html#//apple_ref/doc/uid/TP30000986-CH2-TPXREF103
[tasks]:http://msdn.microsoft.com/en-us/library/windows/desktop/dd378460(v=vs.85).aspx#tasks
[app-user-model-id]: https://msdn.microsoft.com/en-us/library/windows/desktop/dd378459(v=vs.85).aspx
[CFBundleURLTypes]: https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/TP40009249-102207-TPXREF115
[LSCopyDefaultHandlerForURLScheme]: https://developer.apple.com/library/mac/documentation/Carbon/Reference/LaunchServicesReference/#//apple_ref/c/func/LSCopyDefaultHandlerForURLScheme
[handoff]: https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Handoff/HandoffFundamentals/HandoffFundamentals.html
[activity-type]: https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSUserActivity_Class/index.html#//apple_ref/occ/instp/NSUserActivity/activityType
[unity-requiremnt]: ../tutorial/desktop-environment-integration.md#unity-launcher-shortcuts-linux
[mas-builds]: ../tutorial/mac-app-store-submission-guide.md
[JumpListBeginListMSDN]: https://msdn.microsoft.com/en-us/library/windows/desktop/dd378398(v=vs.85).aspx
[about-panel-options]: https://developer.apple.com/reference/appkit/nsapplication/1428479-orderfrontstandardaboutpanelwith?language=objc
