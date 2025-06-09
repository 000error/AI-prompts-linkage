# AI 提示词分发器 v1.1 - 重构版

## 概述

这是一个Chrome浏览器扩展，用于将提示词同时分发到多个AI平台。本版本进行了全面的架构重构，采用模块化设计，提高了可维护性、可扩展性和代码质量。支持一键将问题分发到多个主流AI大模型对话框，大幅提升AI使用效率。

## 新架构特性

### 🏗️ 模块化架构
- **统一配置管理**: 所有平台配置集中在 `config/platforms.js`
- **基础适配器**: 提供统一的平台适配框架
- **工具库**: 统一的DOM操作、日志记录、存储管理
- **UI管理器**: 统一的用户界面管理

### 🔧 核心组件

#### 配置系统 (`config/`)
- `platforms.js`: 统一的平台配置，包含所有AI平台的URL、选择器、策略等

#### 工具库 (`utils/`)
- `domUtils.js`: DOM操作工具，提供元素查找、输入填充、事件处理等
- `logger.js`: 统一日志系统，支持分级日志和错误追踪
- `storage.js`: 存储管理，包含配置管理和缓存功能

#### 适配器系统 (`adapters/`)
- `BasePlatformAdapter.js`: 基础适配器类，提供通用逻辑
- `AdapterFactory.js`: 适配器工厂，自动创建和管理适配器实例

#### UI系统 (`ui/`)
- `UIManager.js`: 统一的UI管理器，处理浮动界面的创建和交互

### 🚀 改进内容

#### 代码质量
- ✅ 消除了大量重复代码
- ✅ 统一了错误处理机制
- ✅ 改进了日志记录系统
- ✅ 增强了配置管理

#### 可维护性
- ✅ 模块化设计，职责分离
- ✅ 统一的配置文件
- ✅ 标准化的适配器接口
- ✅ 完善的错误处理

#### 可扩展性
- ✅ 新增平台只需在配置文件中添加
- ✅ 支持自定义适配器
- ✅ 灵活的填充策略配置
- ✅ 可配置的重试机制

#### 用户体验
- ✅ 更好的错误提示
- ✅ 实时状态反馈
- ✅ 并行分发提高效率
- ✅ 智能重试机制

## 支持的AI平台

| 平台 | 名称 | 官网 | 状态 |
|------|------|------|------|
| ChatGPT | OpenAI ChatGPT | chat.openai.com / chatgpt.com | ✅ |
| Claude | Anthropic Claude | claude.ai | ✅ |
| Kimi | 月之暗面 Kimi | www.kimi.com | ✅ |
| DeepSeek | DeepSeek Chat | chat.deepseek.com | ✅ |
| 通义千问 | 阿里云通义 | www.tongyi.com | ✅ |
| 文心一言 | 百度文心 | chat.baidu.com | ✅ |
| Bing Chat | 微软Bing | www.bing.com/chat | ✅ |
| Bard | Google Bard | bard.google.com | ✅ |
| ChatGLM | 智谱ChatGLM | chatglm.cn | ✅ |
| 豆包 | 字节豆包 | www.doubao.com | ✅ |
| 秘塔AI | 秘塔搜索 | metaso.cn | ✅ |
| 元宝 | 腾讯元宝 | yuanbao.tencent.com | ✅ |

## 安装和使用

### 安装
1. 下载或克隆此项目
2. 打开Chrome浏览器，进入 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

### 使用方法

#### 方法一：弹出窗口
1. 点击浏览器工具栏中的扩展图标
2. 在弹出窗口中输入提示词
3. 选择目标AI平台
4. 点击"分发"按钮

#### 方法二：浮动UI（推荐）
1. 访问任意支持的AI平台
2. 页面右下角会自动显示浮动UI
3. 输入提示词并选择目标平台
4. 点击分发按钮

## 开发指南

### 添加新平台

1. 在 `config/platforms.js` 中添加平台配置：
```javascript
{
  id: 'newplatform',
  name: '新平台',
  url: 'https://newplatform.com',
  color: '#ff0000',
  icon: '🤖',
  selectors: {
    input: ['textarea', 'div[contenteditable="true"]'],
    submit: ['button[type="submit"]']
  },
  fillStrategy: 'execCommand',
  maxAttempts: 5,
  waitTimeout: 3000
}
```

2. 如需特殊逻辑，在 `adapters/AdapterFactory.js` 中添加自定义适配器

3. 更新 `manifest.json` 中的 `host_permissions`

### 自定义适配器

```javascript
class CustomPlatformAdapter extends BasePlatformAdapter {
  async fillQuestion(question) {
    // 自定义填充逻辑
    return await super.fillQuestion(question);
  }
  
  async findInputElement() {
    // 自定义元素查找逻辑
    return await super.findInputElement();
  }
}
```

## 技术栈

- **JavaScript ES6+**: 现代JavaScript语法和特性
- **Chrome Extension Manifest V3**: 最新的浏览器扩展规范
- **模块化设计**: 清晰的代码组织和职责分离
- **异步编程**: Promise/async-await 模式
- **适配器模式**: 统一的平台适配接口
- **工厂模式**: 动态创建和管理适配器实例
- **观察者模式**: 事件驱动的UI交互
- **CSS3**: 现代样式和动画效果

## 文件结构

```
AI_prompts_linkage_v1.1/
├── config/
│   └── platforms.js          # 统一平台配置
├── utils/
│   ├── domUtils.js           # DOM操作工具
│   ├── logger.js             # 日志系统
│   └── storage.js            # 存储管理
├── adapters/
│   ├── BasePlatformAdapter.js # 基础适配器
│   └── AdapterFactory.js     # 适配器工厂
├── ui/
│   └── UIManager.js          # UI管理器
├── content/
│   ├── content.js            # 主要内容脚本
│   ├── content.css           # 样式文件
│   ├── content_old.js        # 旧版内容脚本（备份）
│   └── platforms/            # 旧版平台脚本（保留兼容）
│       ├── baidu.js          # 百度文心一言
│       ├── bard.js           # Google Bard
│       ├── bing.js           # 微软Bing
│       ├── chatglm.js        # 智谱ChatGLM
│       ├── chatgpt.js        # OpenAI ChatGPT
│       ├── claude.js         # Anthropic Claude
│       ├── deepseek.js       # DeepSeek Chat
│       ├── doubao.js         # 字节豆包
│       ├── kimi.js           # 月之暗面Kimi
│       ├── metaso.js         # 秘塔AI
│       ├── tongyi.js         # 阿里通义
│       └── yuanbao.js        # 腾讯元宝
├── background/
│   └── background.js         # 后台脚本
├── popup/
│   ├── popup.html            # 弹出窗口HTML
│   ├── popup.css             # 弹出窗口样式
│   └── popup.js              # 弹出窗口脚本
├── options/
│   └── options.html          # 选项页面
├── images/
│   ├── contact.png           # 联系图标
│   └── donate.png            # 捐赠图标
├── manifest.json             # 扩展清单
├── popup.js                  # 根目录弹窗脚本（备份）
├── samples.html              # 示例页面
└── plaintext.txt             # 说明文档
```

## 更新日志

### v1.1 (重构版)
- 🔄 完全重构代码架构，采用模块化设计
- 📦 统一配置管理，所有平台配置集中在 `config/platforms.js`
- 🛠️ 基础适配器系统，提供统一的平台适配框架
- 🔧 改进错误处理和重试机制
- 🚀 提升性能和稳定性，支持并行分发
- 📝 完善日志系统，支持分级日志和错误追踪
- 🎨 优化用户界面，统一弹窗和浮动UI样式
- 🔌 支持12个主流AI平台，覆盖国内外主要服务
- ⚡ 智能填充策略，适配不同平台的输入方式
- 🔄 向后兼容，保留旧版平台脚本

### v1.0
- 🎉 初始版本
- 🤖 支持多个AI平台
- 💬 基础分发功能


## 已知bugs
  - 1.网络代理模式下部分网站会分发失败
  - 2.从其他目标网页进行分发信息的时候，元宝AI在第一次分发信息的时候会失败，后续分发信息正常

  
## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 微信公众号：坏雷达研究所


---

**注意**: 使用本扩展时请遵守各AI平台的使用条款和服务协议。
