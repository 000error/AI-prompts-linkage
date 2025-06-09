// UI管理器
// 统一管理浮动UI的创建、样式和交互逻辑

class UIManager {
  constructor() {
    this.logger = Logger;
    this.config = ConfigManager;
    this.domUtils = DOMUtils;
    this.currentPlatform = null;
    this.uiContainer = null;
    this.isVisible = false;
    
    // 绑定方法上下文
    this.handleDistribute = this.handleDistribute.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
  }

  /**
   * 初始化UI管理器
   */
  async init() {
    try {
      // 检测当前平台
      this.currentPlatform = detectPlatformByUrl(window.location.href);
      
      if (!this.currentPlatform) {
        this.logger.debug('UI', 'No supported platform detected, UI will not be injected');
        return false;
      }

      // 检查是否应该显示UI
      const shouldShow = await this.shouldShowUI();
      if (!shouldShow) {
        this.logger.debug('UI', 'UI display is disabled in settings');
        return false;
      }

      // 等待页面加载完成
      await this.domUtils.waitForPageLoad();
      
      // 延迟注入UI，确保页面元素已加载
      setTimeout(() => {
        this.injectUI();
      }, 1000);
      
      // 设置消息监听器
      this.setupMessageListener();
      
      return true;
    } catch (error) {
      this.logger.error('UI', 'Failed to initialize UI manager:', error);
      return false;
    }
  }

  /**
   * 检查是否应该显示UI
   * @returns {Promise<boolean>}
   */
  async shouldShowUI() {
    const autoShowUI = await this.config.getConfig('autoShowUI');
    return autoShowUI;
  }

  /**
   * 设置消息监听器
   */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'refreshAutoShowUI') {
        this.handleRefreshUI();
        sendResponse({ status: 'UI refreshed' });
        return true;
      }
    });
  }

  /**
   * 处理UI刷新请求
   */
  async handleRefreshUI() {
    const shouldShow = await this.shouldShowUI();
    
    if (shouldShow && !this.uiContainer) {
      this.injectUI();
    } else if (!shouldShow && this.uiContainer) {
      this.removeUI();
    }
  }

  /**
   * 注入浮动UI
   */
  injectUI() {
    try {
      // 检查是否已经注入
      if (this.uiContainer) {
        this.logger.debug('UI', 'UI already injected');
        return;
      }

      // 创建UI容器
      this.uiContainer = document.createElement('div');
      this.uiContainer.className = 'ai-prompt-distributor-container';
      this.uiContainer.innerHTML = this.createUIHTML();
      
      // 添加到页面
      document.body.appendChild(this.uiContainer);

      // 添加样式
      this.injectStyles();

      // 绑定事件
      this.bindEvents();
      
      // 尝试获取现有内容
      this.tryGetExistingContent();
      
      // 显示UI
      setTimeout(() => {
        this.showUI();
      }, 300);
      
      this.logger.info('UI', 'Floating UI injected successfully');
    } catch (error) {
      this.logger.error('UI', 'Failed to inject UI:', error);
    }
  }

  /**
   * 创建UI的HTML结构
   * @returns {string} HTML字符串
   */
  createUIHTML() {
    return `
      <div class="floating-container">
        <div class="header">
          <div class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>AI提示词分发器</span>
          </div>
          <button class="close-btn" id="close-btn">×</button>
        </div>
        
        <div class="content">
          <div class="detected-platform">
            <svg class="platform-icon" viewBox="0 0 24 24" fill="${this.currentPlatform.color}">
              ${this.currentPlatform.icon}
            </svg>
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
              ${this.renderTargetOptions()}
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

        <div class="footer">
          <div class="footer-content">
            <span class="footer-text">AI提示词分发器 v1.1</span>
            <div class="footer-actions">
              <button class="footer-btn" id="donate-btn">打赏</button>
              <button class="footer-btn" id="contact-btn">联系</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染目标平台选项
   * @returns {string} HTML字符串
   */
  renderTargetOptions() {
    const platforms = getAllPlatforms();
    let optionsHTML = '';
    
    platforms.forEach(platform => {
      const isCurrentPlatform = platform.id === this.currentPlatform.id;
      // 完全移除禁用逻辑
      
      optionsHTML += `
        <div class="target-option">
          <input type="checkbox" id="target-${platform.id}" 
                 name="targetPlatform" value="${platform.id}">
          <label for="target-${platform.id}">
            <svg class="target-icon" viewBox="0 0 24 24" fill="${platform.color}">
              ${platform.icon}
            </svg>
            <span class="target-name">${platform.name}</span>
            ${isCurrentPlatform ? '<span class="current-badge">当前</span>' : ''}
          </label>
        </div>
      `;
    });
    
    return optionsHTML;
  }

  /**
   * 注入样式
   */
  injectStyles() {
    if (document.getElementById('ai-prompt-distributor-styles')) {
      return; // 样式已存在
    }

    const styleElement = document.createElement('style');
    styleElement.id = 'ai-prompt-distributor-styles';
    styleElement.textContent = this.getUIStyles();
    document.head.appendChild(styleElement);
  }

  /**
   * 获取UI样式
   * @returns {string} CSS样式
   */
  getUIStyles() {
    return `
      :root {
        --primary-color: #6e48aa;
        --secondary-color: #9d50bb;
        --accent-color: #4776e6;
        --text-dark: #2c3e50;
        --text-light: #ecf0f1;
        --success-color: #2ecc71;
        --error-color: #e74c3c;
        --border-radius: 12px;
        --shadow: 0 10px 25px rgba(0,0,0,0.15);
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
        line-height: 1.5;
        color: var(--text-dark);
      }

      .floating-container {
        width: 380px;
        max-height: 90vh;
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .floating-container.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 16px;
      }

      .logo-icon {
        width: 24px;
        height: 24px;
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
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .content {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
        max-height: calc(90vh - 120px);
      }

      .detected-platform {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: linear-gradient(135deg, rgba(110, 72, 170, 0.1), rgba(157, 80, 187, 0.1));
        border-radius: 8px;
        margin-bottom: 16px;
        border: 1px solid rgba(110, 72, 170, 0.2);
      }

      .platform-icon {
        width: 20px;
        height: 20px;
      }

      .platform-name {
        font-weight: 600;
        color: var(--primary-color);
      }

      .verified-badge {
        background: var(--success-color);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        margin-left: auto;
      }

      .prompt-textarea {
        width: 100%;
        min-height: 100px;
        max-height: 200px;
        padding: 12px;
        border: 2px solid #e1e8ed;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        resize: vertical;
        transition: border-color 0.2s;
        margin-bottom: 16px;
        box-sizing: border-box;
      }

      .prompt-textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(110, 72, 170, 0.1);
      }

      .action-buttons {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
        flex: 1;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(110, 72, 170, 0.3);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .status-message {
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
        margin-bottom: 16px;
        min-height: 20px;
        display: flex;
        align-items: center;
        transition: all 0.3s;
      }

      .status-message.success {
        background: rgba(46, 204, 113, 0.1);
        color: var(--success-color);
        border: 1px solid rgba(46, 204, 113, 0.2);
      }

      .status-message.error {
        background: rgba(231, 76, 60, 0.1);
        color: var(--error-color);
        border: 1px solid rgba(231, 76, 60, 0.2);
      }

      .targets-container {
        margin-bottom: 16px;
      }

      .targets-title {
        display: block;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-dark);
      }

      .targets-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .target-option {
        position: relative;
      }

      .target-option input[type="checkbox"] {
        display: none;
      }

      .target-option label {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border: 2px solid #e1e8ed;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
      }

      .target-option:not(.disabled) label:hover {
        border-color: var(--primary-color);
        background: rgba(110, 72, 170, 0.05);
      }

      .target-option input[type="checkbox"]:checked + label {
        border-color: var(--primary-color);
        background: rgba(110, 72, 170, 0.1);
      }

      .target-option.disabled label {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f8f9fa;
      }

      .target-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .target-name {
        font-size: 13px;
        font-weight: 500;
        flex: 1;
      }

      .current-badge {
        background: var(--accent-color);
        color: white;
        padding: 1px 6px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 500;
      }

      .switch-setting {
        margin-bottom: 16px;
      }

      .switch-label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }

      .switch-input {
        display: none;
      }

      .switch-slider {
        position: relative;
        width: 44px;
        height: 24px;
        background: #ccc;
        border-radius: 12px;
        transition: background-color 0.2s;
      }

      .switch-slider::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        top: 2px;
        left: 2px;
        transition: transform 0.2s;
      }

      .switch-input:checked + .switch-slider {
        background: var(--primary-color);
      }

      .switch-input:checked + .switch-slider::before {
        transform: translateX(20px);
      }

      .switch-text {
        font-size: 13px;
        color: var(--text-dark);
      }

      .footer {
        padding: 12px 20px;
        background: rgba(110, 72, 170, 0.05);
        border-top: 1px solid rgba(110, 72, 170, 0.1);
        flex-shrink: 0;
      }

      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .footer-text {
        font-size: 12px;
        color: #666;
      }

      .footer-actions {
        display: flex;
        gap: 8px;
      }

      .footer-btn {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(110, 72, 170, 0.2);
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        color: #666;
      }

      .footer-btn:hover {
        background: rgba(110, 72, 170, 0.1);
        color: var(--primary-color);
      }

      /* 响应式调整 */
      @media (max-width: 480px) {
        .ai-prompt-distributor-container {
          top: 10px;
          right: 10px;
          left: 10px;
        }
        
        .floating-container {
          width: auto;
        }
      }
    `;
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 关闭按钮
    const closeBtn = this.uiContainer.querySelector('#close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', this.handleClose);
    }

    // 分发按钮
    const distributeBtn = this.uiContainer.querySelector('#distribute-btn');
    if (distributeBtn) {
      distributeBtn.addEventListener('click', this.handleDistribute);
    }

    // 自动显示开关
    const autoShowSwitch = this.uiContainer.querySelector('#auto-show-ui-switch');
    if (autoShowSwitch) {
      this.loadAutoShowSetting(autoShowSwitch);
      autoShowSwitch.addEventListener('change', this.handleAutoShowToggle.bind(this));
    }

    // 打赏和联系按钮
    const donateBtn = this.uiContainer.querySelector('#donate-btn');
    const contactBtn = this.uiContainer.querySelector('#contact-btn');
    
    if (donateBtn) {
      donateBtn.addEventListener('click', () => {
        this.logger.logUserAction('donate_clicked');
        // 打开本地打赏图片
        const donateImageUrl = chrome.runtime.getURL('images/donate.png');
        chrome.runtime.sendMessage({ action: 'openTab', url: donateImageUrl });
      });
    }
    
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        this.logger.logUserAction('contact_clicked');
        // 打开本地联系图片
        const contactImageUrl = chrome.runtime.getURL('images/contact.png');
        chrome.runtime.sendMessage({ action: 'openTab', url: contactImageUrl });
      });
    }
  }

  /**
   * 加载自动显示设置
   */
  async loadAutoShowSetting(switchElement) {
    const autoShowUI = await this.config.getConfig('autoShowUI');
    switchElement.checked = autoShowUI;
  }

  /**
   * 处理自动显示开关切换
   */
  async handleAutoShowToggle(event) {
    const isEnabled = event.target.checked;
    await this.config.setConfig('autoShowUI', isEnabled);
    
    this.logger.logUserAction('auto_show_toggled', { enabled: isEnabled });
    
    // 通知其他标签页刷新UI状态
    try {
      const tabs = await chrome.tabs.query({});
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: 'refreshAutoShowUI' }).catch(() => {
          // 忽略无法发送消息的标签页
        });
      });
    } catch (error) {
      this.logger.debug('UI', 'Failed to notify other tabs:', error);
    }
  }

  /**
   * 处理分发按钮点击
   */
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
    
    // 获取选中的平台
    const selectedPlatforms = Array.from(selectedCheckboxes).map(checkbox => {
      const platformId = checkbox.value;
      const platform = getAllPlatforms().find(p => p.id === platformId);
      return {
        id: platform.id,
        url: platform.urls[0] // 使用第一个URL
      };
    });
    
    this.logger.logUserAction('distribute_started', {
      question: question.substring(0, 100),
      platforms: selectedPlatforms.map(p => p.id)
    });
    
    // 禁用按钮并显示状态
    distributeBtn.disabled = true;
    this.showStatus('正在分发...', 'info');
    
    try {
      // 发送分发请求到background script
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
        
        this.logger.logUserAction('distribute_completed', {
          successes,
          failures,
          results: response.results
        });
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

  /**
   * 显示状态消息
   */
  showStatus(message, type = 'info') {
    const statusElement = this.uiContainer.querySelector('#status-message');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `status-message ${type}`;
      
      // 自动清除成功消息
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

  /**
   * 处理关闭按钮
   */
  handleClose() {
    this.hideUI();
    this.logger.logUserAction('ui_closed');
  }

  /**
   * 显示UI
   */
  showUI() {
    if (this.uiContainer) {
      const container = this.uiContainer.querySelector('.floating-container');
      if (container) {
        container.classList.add('visible');
        this.isVisible = true;
      }
    }
  }

  /**
   * 隐藏UI
   */
  hideUI() {
    if (this.uiContainer) {
      const container = this.uiContainer.querySelector('.floating-container');
      if (container) {
        container.classList.remove('visible');
        this.isVisible = false;
        
        // 延迟移除DOM元素
        setTimeout(() => {
          this.removeUI();
        }, 300);
      }
    }
  }

  /**
   * 移除UI
   */
  removeUI() {
    if (this.uiContainer) {
      this.uiContainer.remove();
      this.uiContainer = null;
      this.isVisible = false;
      
      // 移除样式（如果没有其他实例在使用）
      const styleElement = document.getElementById('ai-prompt-distributor-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }
  }

  /**
   * 尝试获取页面现有内容
   */
  tryGetExistingContent() {
    try {
      // 尝试从当前平台的输入框获取内容
      const selectors = this.currentPlatform.selectors.input.split(', ');
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const existingText = this.domUtils.getElementText(element).trim();
          if (existingText) {
            const promptInput = this.uiContainer.querySelector('#prompt-input');
            if (promptInput) {
              promptInput.value = existingText;
              this.logger.debug('UI', 'Loaded existing content from page');
            }
            break;
          }
        }
      }
    } catch (error) {
      this.logger.debug('UI', 'Failed to get existing content:', error);
    }
  }

  /**
   * 切换UI可见性
   */
  handleToggleVisibility() {
    if (this.isVisible) {
      this.hideUI();
    } else {
      this.showUI();
    }
  }

  /**
   * 销毁UI管理器
   */
  destroy() {
    this.removeUI();
    this.logger.info('UI', 'UI Manager destroyed');
  }
}