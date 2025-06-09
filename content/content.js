// 新架构的内容脚本
// 使用统一的配置和组件系统

// 临时的平台检测函数（在模块加载前使用）
function detectPlatformByUrl(url) {
  const platforms = {
    chatgpt: {
      id: 'chatgpt',
      name: 'ChatGPT',
      urls: ['https://chat.openai.com', 'https://chatgpt.com'],
      color: '#10a37f',
      icon: '<path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>',
      selectors: {
        input: 'div[contenteditable="true"]'
      }
    },
    claude: {
      id: 'claude',
      name: 'Claude',
      urls: ['https://claude.ai'],
      color: '#cc785c',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"]'
      }
    },
    kimi: {
      id: 'kimi',
      name: 'Kimi',
      urls: ['https://kimi.moonshot.cn', 'https://www.kimi.com'],
      color: '#6366f1',
      icon: '<circle cx="12" cy="12" r="10"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    deepseek: {
      id: 'deepseek',
      name: 'DeepSeek',
      urls: ['https://chat.deepseek.com'],
      color: '#1976d2',
      icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    tongyi: {
      id: 'tongyi',
      name: '通义千问',
      urls: ['https://tongyi.aliyun.com', 'https://www.tongyi.com'],
      color: '#ff6a00',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    baidu: {
      id: 'baidu',
      name: '文心一言',
      urls: ['https://yiyan.baidu.com'],
      color: '#3385ff',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    bing: {
      id: 'bing',
      name: 'Bing Chat',
      urls: ['https://www.bing.com/chat', 'https://copilot.microsoft.com'],
      color: '#0078d4',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    bard: {
      id: 'bard',
      name: 'Bard',
      urls: ['https://bard.google.com', 'https://gemini.google.com'],
      color: '#4285f4',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    chatglm: {
      id: 'chatglm',
      name: 'ChatGLM',
      urls: ['https://chatglm.cn'],
      color: '#00d4aa',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    doubao: {
      id: 'doubao',
      name: '豆包',
      urls: ['https://www.doubao.com'],
      color: '#ff4757',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    metaso: {
      id: 'metaso',
      name: '秘塔AI',
      urls: ['https://metaso.cn'],
      color: '#7c3aed',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    },
    yuanbao: {
      id: 'yuanbao',
      name: '元宝',
      urls: ['https://yuanbao.tencent.com'],
      color: '#00c896',
      icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      selectors: {
        input: 'div[contenteditable="true"], textarea'
      }
    }
  };

  for (const [platformId, platform] of Object.entries(platforms)) {
    if (platform.urls.some(platformUrl => url.includes(platformUrl.replace('https://', '')))) {
      return platform;
    }
  }
  
  return null;
}

// 全局变量
let currentPlatform = null;
let uiManager = null;
let platformAdapter = null;
let isInitialized = false;

// Logger 将从 utils/logger.js 全局可用

// ConfigManager 和 DOMUtils 将从全局可用

// 临时的DOM工具（如果全局DOMUtils不可用）
const TempDOMUtils = {
  async waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },
  
  async fillInput(element, text) {
    if (!element) return false;
    
    try {
      // 清空现有内容
      if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.value = '';
        element.focus();
        element.value = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (element.contentEditable === 'true') {
        element.focus();
        element.innerText = '';
        document.execCommand('insertText', false, text);
      }
      
      // 触发回车键
      setTimeout(() => {
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        element.dispatchEvent(enterEvent);
      }, 100);
      
      return true;
    } catch (error) {
      Logger.error('DOMUtils', 'Failed to fill input:', error);
      return false;
    }
  },
  
  getElementText(element) {
    if (!element) return '';
    return element.value || element.innerText || element.textContent || '';
  }
};

// 简化的平台适配器
class SimplePlatformAdapter {
  constructor(platform) {
    this.platform = platform;
    this.logger = Logger;
    this.domUtils = typeof DOMUtils !== 'undefined' ? DOMUtils : TempDOMUtils;
  }
  
  async fillQuestion(question) {
    try {
      this.logger.info('Adapter', `Filling question for ${this.platform.name}`);
      
      const selectors = this.platform.selectors.input.split(', ');
      
      for (const selector of selectors) {
        try {
          const element = await TempDOMUtils.waitForElement(selector, 3000);
          if (element) {
            const success = await TempDOMUtils.fillInput(element, question);
            if (success) {
              this.logger.info('Adapter', 'Question filled successfully');
              return { success: true };
            }
          }
        } catch (error) {
          this.logger.debug('Adapter', `Selector ${selector} failed:`, error.message);
        }
      }
      
      throw new Error('No suitable input element found');
    } catch (error) {
      this.logger.error('Adapter', 'Failed to fill question:', error);
      return { success: false, error: error.message };
    }
  }
}

// 简化的UI管理器
class SimpleUIManager {
  constructor() {
    this.logger = Logger;
    this.config = ConfigManager;
    this.domUtils = typeof DOMUtils !== 'undefined' ? DOMUtils : TempDOMUtils;
    this.currentPlatform = null;
    this.uiContainer = null;
    this.isVisible = false;
  }
  
  async init() {
    try {
      this.currentPlatform = detectPlatformByUrl(window.location.href);
      
      if (!this.currentPlatform) {
        this.logger.debug('UI', 'No supported platform detected');
        return false;
      }
      
      const shouldShow = await this.shouldShowUI();
      if (!shouldShow) {
        this.logger.debug('UI', 'UI display is disabled');
        return false;
      }
      
      setTimeout(() => {
        this.injectUI();
      }, 1000);
      
      this.setupMessageListener();
      return true;
    } catch (error) {
      this.logger.error('UI', 'Failed to initialize UI manager:', error);
      return false;
    }
  }
  
  async shouldShowUI() {
    return await this.config.getConfig('autoShowUI');
  }
  
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'refreshAutoShowUI') {
        this.handleRefreshUI();
        sendResponse({ status: 'UI refreshed' });
        return true;
      }
    });
  }
  
  async handleRefreshUI() {
    const shouldShow = await this.shouldShowUI();
    
    if (shouldShow && !this.uiContainer) {
      this.injectUI();
    } else if (!shouldShow && this.uiContainer) {
      this.removeUI();
    }
  }
  
  injectUI() {
    if (this.uiContainer) return;
    
    try {
      this.uiContainer = document.createElement('div');
      this.uiContainer.className = 'ai-prompt-distributor-container';
      this.uiContainer.innerHTML = this.createUIHTML();
      
      document.body.appendChild(this.uiContainer);
      this.injectStyles();
      this.bindEvents();
      
      setTimeout(() => {
        this.showUI();
      }, 300);
      
      this.logger.info('UI', 'UI injected successfully');
    } catch (error) {
      this.logger.error('UI', 'Failed to inject UI:', error);
    }
  }
  
  createUIHTML() {
    const platforms = [
      { id: 'kimi', name: 'Kimi', color: '#6e48aa' },
      { id: 'deepseek', name: 'DeepSeek', color: '#009688' },
      { id: 'tongyi', name: '通义', color: '#ff9800' },
      { id: 'chatglm', name: '智谱', color: '#1976d2' },
      { id: 'doubao', name: '豆包', color: '#4caf50' },
      { id: 'yuanbao', name: '元宝', color: '#00bcd4' },
      { id: 'baidu', name: '百度', color: '#2196f3' },
      { id: 'metaso', name: '秘塔', color: '#9c27b0' }
    ];
    
    const targetOptions = platforms.map(platform => {
      const isCurrentPlatform = platform.id === this.currentPlatform.id;
      // 完全移除禁用逻辑
      
      return `
        <div class="target-option">
          <input type="checkbox" id="target-${platform.id}" 
                 name="targetPlatform" value="${platform.id}">
          <label for="target-${platform.id}">
            <span class="target-icon" style="background-color: ${platform.color}"></span>
            <span class="target-name">${platform.name}</span>
            ${isCurrentPlatform ? '<span class="current-badge">当前</span>' : ''}
          </label>
        </div>
      `;
    }).join('');
    
    return `
      <div class="floating-container">
        <div class="header">
          <div class="logo">
            <span>AI提示词分发器</span>
          </div>
          <button class="close-btn" id="close-btn">×</button>
        </div>
        
        <div class="content">
          <div class="detected-platform">
            <span class="platform-icon" style="background-color: ${this.currentPlatform.color}"></span>
            <span class="platform-name">${this.currentPlatform.name}</span>
            <span class="verified-badge">✓ 已适配</span>
          </div>

          <textarea class="prompt-textarea" id="prompt-input" 
                    placeholder="输入您想同时发送到多个AI平台的问题..."></textarea>

          <div class="action-buttons">
            <button class="btn btn-primary" id="distribute-btn">立即分发</button>
          </div>
          
          <div class="status-message" id="status-message"></div>

          <div class="targets-container">
            <span class="targets-title">选择要分发的目标平台：</span>
            <div class="targets-grid" id="targets-grid">
              ${targetOptions}
            </div>
          </div>

          <div class="switch-setting">
            <label class="switch-label">
              <input type="checkbox" id="auto-show-ui-switch" class="switch-input">
              <span class="switch-slider"></span>
              <span class="switch-text">检测到目标网页时自动弹出插件</span>
            </label>
          </div>
        </div>
        
        <div class="footer" id="footer-message">
          <div class="footer-content">
            <span id="footer-text">从这里快速分发提示词到多个平台</span>
            <div class="footer-actions">
              <button class="footer-btn" id="donate-btn" title="打赏作者">❤️</button>
              <button class="footer-btn" id="contact-btn" title="联系作者">👤</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  injectStyles() {
    if (document.getElementById('ai-prompt-distributor-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'ai-prompt-distributor-styles';
    styleElement.textContent = `
      :root {
        --primary-color: #6e48aa;
        --secondary-color: #9d50bb;
        --accent-color: #4776e6;
        --text-dark: #2c3e50;
        --text-light: #ecf0f1;
        --success-color: #2ecc71;
        --error-color: #e74c3c;
      }
      
      .ai-prompt-distributor-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        top: auto;
        left: auto;
        z-index: 999999;
        font-family: 'Segoe UI', system-ui, sans-serif;
        font-size: 14px;
        color: var(--text-dark);
      }
      
      .floating-container {
        width: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        max-height: 600px; /* 接近浏览器限制 */
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
      }
      
      .floating-container.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 12px 15px; /* 稍微减小内边距 */
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 12px 12px 0 0;
        flex-shrink: 0; /* 防止头部被压缩 */
      }
      
      .logo {
        display: flex;
        align-items: center;
        justify-content: center; /* 居中 */
        gap: 8px;
        font-weight: 600;
        font-size: 15px;
        width: 100%; /* 让内容居中填满父容器 */
      }
      
      .logo-icon {
        width: 20px; /* 减小图标大小 */
        height: 20px;
      }
      
      .close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
      }
      
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .content {
        padding: 15px; /* 稍微减小内边距 */
        overflow-y: auto; /* 内容超出时允许滚动 */
        flex-grow: 1; /* 占据剩余空间 */
        min-height: 150px; /* 添加一个最小高度，防止内容过少时塌陷 */
      }
      
      .detected-platform {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(110, 72, 170, 0.1);
        border-radius: 8px;
        margin-bottom: 16px;
      }
      
      .platform-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
      
      .platform-name {
        font-weight: 600;
        color: #6e48aa;
      }
      
      .verified-badge {
        background: #2ecc71;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin-left: auto;
      }
      
      .prompt-textarea {
        width: 100%;
        box-sizing: border-box; /* 让 padding 和 border 不增加宽度 */
        min-height: 100px; /* 减小最小高度 */
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        resize: vertical;
        font-family: inherit;
        font-size: 14px;
        margin-bottom: 15px; /* 增加底部间距 */
      }
      
      .prompt-textarea:focus {
        outline: none;
        border-color: #6e48aa;
      }
      
      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s ease;
      }
      
      .btn-primary {
        background-color: var(--primary-color);
        color: white;
      }
      
      .btn-primary:hover {
        background-color: var(--secondary-color);
      }
      
      .btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
      
      .action-buttons {
        display: flex;
        justify-content: center; /* 居中按钮 */
        gap: 10px;
        margin-top: 10px;
        margin-bottom: 15px;
      }
      
      .status-message {
        margin-top: 15px;
        font-size: 13px;
        min-height: 18px; /* 占位，防止布局跳动 */
        text-align: center;
      }
      
      .status-message.success {
        color: var(--success-color);
      }
      
      .status-message.error {
        color: var(--error-color);
      }
      
      .targets-title {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-dark);
        margin-bottom: 10px;
      }
      
      .targets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* 自动填充列 */
        gap: 10px;
        margin-bottom: 16px;
      }
      
      .target-option input[type="checkbox"] {
        display: none;
      }
      
      .target-option label {
        display: flex;
        flex-direction: column; /* 图标和文字垂直排列 */
        align-items: center;
        padding: 10px 5px;
        border: 1px solid #eee;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
        background-color: #f8f9fa;
      }
      
      .target-option:not(.disabled) label:hover {
        border-color: #6e48aa;
        background: rgba(110, 72, 170, 0.05);
      }
      
      .target-option input[type="checkbox"]:checked + label {
        border-color: var(--primary-color, #6e48aa);
        background-color: #e8dff5; /* 选中时的背景色 */
        box-shadow: 0 0 5px rgba(110, 72, 170, 0.3);
      }
      
      .target-option.disabled label {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f8f9fa;
      }
      
      .target-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-bottom: 5px; /* 图标和文字间距 */
      }
      
      .target-name {
        font-size: 12px;
        color: var(--text-dark);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 80px; /* 防止文字过长 */
      }
      
      .current-badge {
        background: #4776e6;
        color: white;
        padding: 1px 6px;
        border-radius: 8px;
        font-size: 10px;
      }
      
      .switch-setting {
        margin: 18px 0 0 0;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      
      .switch-label {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--text-dark);
        font-weight: 500;
        cursor: pointer;
        gap: 10px;
      }
      
      .switch-input {
        display: none;
      }
      
      .switch-slider {
        width: 38px;
        height: 22px;
        background: #e0e0e0;
        border-radius: 22px;
        position: relative;
        transition: background 0.2s;
        margin-right: 8px;
        flex-shrink: 0;
      }
      
      .switch-slider::before {
        content: "";
        position: absolute;
        left: 3px;
        top: 3px;
        width: 16px;
        height: 16px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.2s;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      }
      
      .switch-input:checked + .switch-slider {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      }
      
      .switch-input:checked + .switch-slider::before {
        transform: translateX(16px);
      }
      
      .switch-text {
        user-select: none;
        color: var(--text-dark);
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.02em;
      }
      
      .footer {
        padding: 8px 15px;
        background-color: #f1f1f1;
        font-size: 12px;
        color: #666;
        text-align: center;
        flex-shrink: 0;
        border-top: 1px solid #e0e0e0;
        border-radius: 0 0 12px 12px;
      }
      
      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .footer-actions {
        display: flex;
        gap: 8px;
      }
      
      .footer-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        padding: 2px 5px;
        border-radius: 4px;
        transition: all 0.2s;
      }
      
      .footer-btn:hover {
        background-color: rgba(0,0,0,0.05);
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  bindEvents() {
    const closeBtn = this.uiContainer.querySelector('#close-btn');
    const distributeBtn = this.uiContainer.querySelector('#distribute-btn');
    const autoShowSwitch = this.uiContainer.querySelector('#auto-show-ui-switch');
    const donateBtn = this.uiContainer.querySelector('#donate-btn');
    const contactBtn = this.uiContainer.querySelector('#contact-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideUI());
    }
    
    if (distributeBtn) {
      distributeBtn.addEventListener('click', () => this.handleDistribute());
    }
    
    if (autoShowSwitch) {
      this.loadAutoShowSetting(autoShowSwitch);
      autoShowSwitch.addEventListener('change', (e) => this.handleAutoShowToggle(e));
    }
    
    if (donateBtn) {
      donateBtn.addEventListener('click', () => {
        // 打开本地打赏图片
        const donateImageUrl = chrome.runtime.getURL('images/donate.png');
        chrome.runtime.sendMessage({ action: 'openTab', url: donateImageUrl });
      });
    }
    
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        // 打开本地联系图片
        const contactImageUrl = chrome.runtime.getURL('images/contact.png');
        chrome.runtime.sendMessage({ action: 'openTab', url: contactImageUrl });
      });
    }
  }
  
  async loadAutoShowSetting(switchElement) {
    const autoShowUI = await this.config.getConfig('autoShowUI');
    switchElement.checked = autoShowUI;
  }
  
  async handleAutoShowToggle(event) {
    const isEnabled = event.target.checked;
    await this.config.setConfig('autoShowUI', isEnabled);
  }
  
  async handleDistribute() {
    const promptInput = this.uiContainer.querySelector('#prompt-input');
    const distributeBtn = this.uiContainer.querySelector('#distribute-btn');
    const selectedCheckboxes = this.uiContainer.querySelectorAll('#targets-grid input[type="checkbox"]:checked');
    
    const question = promptInput.value.trim();
    
    if (!question) {
      this.showStatus('请输入要分发的问题！', 'error');
      return;
    }
    
    if (selectedCheckboxes.length === 0) {
      this.showStatus('请至少选择一个目标平台！', 'error');
      return;
    }
    
    const selectedPlatforms = Array.from(selectedCheckboxes).map(checkbox => ({
      id: checkbox.value,
      url: this.getPlatformUrl(checkbox.value)
    }));
    
    distributeBtn.disabled = true;
    this.showStatus('正在分发...', 'info');
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'distributeQuestion',
        question: question,
        platforms: selectedPlatforms
      });
      
      if (response && response.results) {
        const successes = response.results.filter(r => r.success).length;
        const failures = response.results.length - successes;
        
        let message = `分发完成: ${successes} 个成功`;
        if (failures > 0) {
          message += `, ${failures} 个失败`;
          this.showStatus(message, 'error');
        } else {
          this.showStatus(message, 'success');
        }
      } else {
        throw new Error('未收到有效响应');
      }
    } catch (error) {
      this.logger.error('UI', 'Distribution failed:', error);
      this.showStatus(`分发失败: ${error.message}`, 'error');
    } finally {
      distributeBtn.disabled = false;
    }
  }
  
  getPlatformUrl(platformId) {
    const urls = {
      chatgpt: 'https://chat.openai.com',
      claude: 'https://claude.ai',
      kimi: 'https://kimi.moonshot.cn',
      deepseek: 'https://chat.deepseek.com',
      tongyi: 'https://tongyi.aliyun.com',
      baidu: 'https://yiyan.baidu.com'
    };
    return urls[platformId] || '';
  }
  
  showStatus(message, type = 'info') {
    const statusElement = this.uiContainer.querySelector('#status-message');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `status-message ${type}`;
      
      if (type === 'success') {
        setTimeout(() => {
          if (statusElement.textContent === message) {
            statusElement.textContent = '';
            statusElement.className = 'status-message';
          }
        }, 5000);
      }
    }
  }
  
  showUI() {
    if (this.uiContainer) {
      const container = this.uiContainer.querySelector('.floating-container');
      if (container) {
        container.classList.add('visible');
        this.isVisible = true;
      }
    }
  }
  
  hideUI() {
    if (this.uiContainer) {
      const container = this.uiContainer.querySelector('.floating-container');
      if (container) {
        container.classList.remove('visible');
        this.isVisible = false;
        
        setTimeout(() => {
          this.removeUI();
        }, 300);
      }
    }
  }
  
  removeUI() {
    if (this.uiContainer) {
      this.uiContainer.remove();
      this.uiContainer = null;
      this.isVisible = false;
    }
  }
  
  destroy() {
    this.removeUI();
    this.logger.info('UI', 'UI Manager destroyed');
  }
}

// 初始化内容脚本
async function initContentScript() {
  if (isInitialized) return;
  
  try {
    Logger.info('Content', 'Initializing content script');
    
    // 检测当前平台
    currentPlatform = detectPlatformByUrl(window.location.href);
    
    if (!currentPlatform) {
      Logger.debug('Content', 'No supported platform detected');
      return;
    }
    
    Logger.info('Content', `Detected platform: ${currentPlatform.name}`);
    
    // 创建平台适配器
    platformAdapter = new SimplePlatformAdapter(currentPlatform);
    
    // 初始化UI管理器
    uiManager = new SimpleUIManager();
    const uiInitialized = await uiManager.init();
    
    if (uiInitialized) {
      Logger.info('Content', 'UI Manager initialized successfully');
    }
    
    // 设置消息监听器
    setupMessageListeners();
    
    isInitialized = true;
    Logger.info('Content', 'Content script initialization completed');
  } catch (error) {
    Logger.error('Content', 'Failed to initialize content script:', error);
  }
}

// 设置消息监听器
function setupMessageListeners() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case 'ping':
        // 检查Content Script是否完全准备好
        const isReady = platformAdapter && uiManager;
        sendResponse({ status: isReady ? 'ready' : 'not_ready' });
        break;
        
      case 'refreshAutoShowUI':
        handleRefreshAutoShowUI();
        sendResponse({ status: 'UI refreshed' });
        break;
        
      case 'fillQuestion':
        if (platformAdapter) {
          platformAdapter.fillQuestion(message.question)
            .then(result => sendResponse(result))
            .catch(error => {
              Logger.error('Content', 'Failed to fill question:', error);
              sendResponse({ success: false, error: error.message });
            });
          return true; // 保持消息通道开放
        } else {
          sendResponse({ success: false, error: 'No platform adapter available' });
        }
        break;
        
      default:
        Logger.debug('Content', 'Unknown message action:', message.action);
    }
  });
}

// 处理自动显示UI的刷新
async function handleRefreshAutoShowUI() {
  try {
    if (uiManager) {
      await uiManager.handleRefreshUI();
    }
  } catch (error) {
    Logger.error('Content', 'Failed to refresh UI:', error);
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  if (uiManager) {
    uiManager.destroy();
  }
  Logger.info('Content', 'Content script cleaned up');
});