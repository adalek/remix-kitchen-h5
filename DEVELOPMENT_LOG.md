# Remix Kitchen 开发日志

## 项目概述

Remix Kitchen 是一个手机端 H5 宣传小游戏原型，主题是“把音乐像做菜一样 remix”。用户选择曲目后，系统把音乐风格转译成食物食材；用户可以备菜、下锅、调味，最后生成一张 remix 菜谱评价卡。

项目重点不是实现真实 AI 音乐生成，而是用交互流程表达 AI 音乐 remix 的概念。

## 技术栈

- React
- Vite
- TypeScript
- Tone.js
- CSS
- GitHub Pages

## 已完成功能

### 1. 首页

- 展示 `Remix Kitchen / 音乐厨房`
- 展示副标题：`把音乐做成你喜欢的味道`
- 提供 `开始做菜` 按钮
- 使用暖色厨房风格背景，缺少图片素材时也可正常运行

### 2. 选择曲目

- 提供 3 首测试曲目：
  - Midnight Walk
  - Sunny Day
  - Ocean Drive
- 每首曲目展示封面占位、歌名、作者、时长、BPM、Key
- 文案调整为：`选一首你心爱的歌，AI 厨师会把它拆成食材。`
- 增加 `回首页` 按钮

### 3. 菜谱分析

- 展示 AI 分析结果：
  - Energy
  - Brightness
  - Chill
  - Night
- 将音乐元素翻译成真实食物食材，而不是乐器
- 使用 emoji 作为缺省视觉素材

### 4. 备菜准备

- 支持按分类替换食材：
  - Base / 底料
  - Bass / 主料
  - Chords / 配菜
  - Atmosphere / 调料
  - Vocal / 点缀
- Vocal 支持不添加

### 5. 制作阶段

- 实现俯视角锅台界面
- 中央为平底锅，锅把手已调整到正下方
- 左侧为已选食材
- 右侧为调味料
- 上方为火候控制
- 下方按钮为中文：`重置`、`出锅`
- 移除了 `Play` 按钮，因为点击食材下锅后会自动播放
- 最少加入 2 种食材即可出锅
- 点击食材加入锅中并播放对应 loop
- 已加入的食材再次点击会取消选择、从锅中移除，并关闭对应 loop

### 6. 音频系统

- 创建 `src/audio/audioEngine.ts`
- 使用 Tone.js 管理音频
- 使用 `Tone.Player`
- 使用 `Tone.Transport`
- loop 使用 `.sync().start(0)` 同步播放
- 缺少音频文件时只输出 console warning，不阻塞 UI
- 修复了 GitHub Pages 子路径下音频资源路径问题
- 增加 `Tone.loaded()` 等待，避免首次点击时音频尚未解码导致无声

### 7. 火候与调料音频效果

火候会实时影响当前播放效果：

- 小火：更柔、更小声，低通滤波更明显，混响更多
- 中火：默认状态
- 大火：音量稍高，增加失真和冲击感

调料会实时影响效果：

- 辣椒：增加失真
- 蜂蜜：增加 chorus，声音更亮
- 冰块：增加混响和延迟
- 月亮酱：增加夜晚感，降低高频
- 雨滴：增加 delay 和空间感

### 8. 出锅评价

- 点击出锅后生成 remix 名字
- 展示时长、最终风味数值、使用食材、使用调味料
- 展示 AI 厨师评价
- 出锅评价页会继续播放当前音乐
- 按钮包括：
  - 分享菜谱
  - 再做一次

## 素材接入

已将测试音频素材复制并重命名到：

- `public/audio/loops/drums/`
- `public/audio/loops/bass/`
- `public/audio/loops/chords/`
- `public/audio/loops/atmosphere/`
- `public/audio/loops/vocal/`

目前所有音频路径通过 `songManifest.ts` 配置，方便后续替换。

## 部署

项目已上传 GitHub：

<https://github.com/adalek/remix-kitchen-h5>

GitHub Pages 地址：

<https://adalek.github.io/remix-kitchen-h5/>

已配置 GitHub Actions，推送到 `master` 后会自动构建并部署到 GitHub Pages。

## 本地开发

启动 dev server：

```powershell
$env:Path='C:\Users\Xuwen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:Path
C:\Users\Xuwen\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd run dev -- --port 5173
```

访问：

<http://127.0.0.1:5173/>

关闭 dev server：

- 如果能看到终端，按 `Ctrl + C`
- 如果看不到终端，可以结束占用 `5173` 端口的 `node` 进程
- 也可以直接让 Codex 帮忙关闭

## 当前注意事项

- 项目是交互原型，不是真实 AI 音乐生成系统
- 音频素材目前为测试 loop，类型匹配不严格
- 调味料目前影响全局音频效果和最终风味数值，还没有单独触发调味料音效
- UI 素材仍以 emoji 和 CSS 占位为主

## 后续可优化方向

- 增加拖拽食材入锅
- 增加更明确的入锅动画
- 为调味料增加单独音效
- 增加分享菜谱截图或海报生成功能
- 替换正式视觉素材
- 统一修复旧文件中的中文编码显示问题
- 增加移动端真实设备测试
