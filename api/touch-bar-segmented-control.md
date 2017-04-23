## 类: TouchBarSegmentedControl

> 选中按钮时创建一个分段控件(按钮组)

进程: [主进程](../tutorial/quick-start.md#主进程)            

### `new TouchBarSegmentedControl(options)` _实验功能_
> 用途:**当用户选中按钮时创建一个新的分段控件并调用 `change`**

* `options` Object
  * `segmentStyle` String  -可选的分段样式:
   * `automatic` - 默认值. 按显示控件的窗口类型与窗口内的位置进行自动选择分段控件的合适外观.
    * `rounded` - 使用圆形样式显示控件
    * `round-rect` - 使用圆弧形显示控件
    * `textured-rounded` - 使用纹理圆形样式显示控件
    * `textured-square` -  使用纹理方形样式显示控件
    * `capsule` - 使用胶囊形样式显示控件
    * `small-square` - 使用小方形样式显示控件
    * `separated` - 使用段之间紧密相连又不相互接触的样式显示控件
  * `segments` [SegmentedControlSegment[]](structures/segmented-control-segment.md) -要放置在此控件中的段数组
  * `selectedIndex` Integer - 当前所选段的索引，将通过用户交互自动更新
  * `change` Function - 当用户选择一个新段时调用
    * `selectedIndex` - 用户选择的段的索引

### 实例属性

 `TouchBarSegmentedControl`有以下实例属性:

#### `touchBarSegmentedControl.segmentStyle`
> 属性: ** 控件当前段的样式( `String`)**


#### `touchBarSegmentedControl.segments`
> 属性: ** 此控件中的段组成的数组( `SegmentedControlSegment[]`)**

注意,当仅更新数组中的深层次属性时,触摸条不会即时更新.

#### `touchBarSegmentedControl.selectedIndex`
> 属性: ** 当前选定的段( `Integer`)**

