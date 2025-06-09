// 适配器工厂
// 根据平台配置自动创建和管理适配器实例

// 适配器工厂依赖的全局变量将在运行时可用

/**
 * 特殊平台适配器类
 * 用于处理需要特殊逻辑的平台
 */

// Kimi平台适配器 - 专门处理contenteditable
class KimiAdapter extends BasePlatformAdapter {
  async attemptFillQuestion(question) {
    const inputElement = await this.findInputElement();
    
    if (!inputElement) {
      throw new Error('Kimi input element not found');
    }

    // Kimi特殊处理：确保contenteditable元素正确清空和填充
    inputElement.focus();
    
    // 彻底清空内容
    inputElement.innerHTML = '<p><br></p>';
    await this.domUtils.delay(100);
    
    // 再次确认内容已清空
    inputElement.innerHTML = '<p><br></p>';
    
    // 使用Selection/Range插入文本，模拟真实输入
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(inputElement);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    // 插入文本
    document.execCommand('insertText', false, question);

    // 触发input事件
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));

    // 模拟回车发送
    await this.domUtils.delay(200);
    this.domUtils.simulateKeyPress(inputElement, 'Enter');
    
    this.logger.info('KIMI', 'Question filled and submitted');
  }
}

// DeepSeek平台适配器 - 处理混合输入类型
class DeepSeekAdapter extends BasePlatformAdapter {
  async attemptFillQuestion(question) {
    const inputElement = await this.findInputElement();
    
    if (!inputElement) {
      throw new Error('DeepSeek input element not found');
    }

    inputElement.focus();
    
    // 检查是否已填充相同内容
    let alreadyFilled = false;
    if (inputElement.tagName.toLowerCase() === 'textarea') {
      alreadyFilled = inputElement.value.trim() === question.trim();
      if (!alreadyFilled) {
        inputElement.value = question;
        this.domUtils.triggerInputEvents(inputElement);
      }
    } else {
      alreadyFilled = inputElement.innerText.trim() === question.trim();
      if (!alreadyFilled) {
        inputElement.innerText = question;
        this.domUtils.triggerInputEvents(inputElement);
      }
    }
    
    if (!alreadyFilled) {
      // 直接模拟回车键
      this.domUtils.simulateKeyPress(inputElement, 'Enter');
      
      // 检测内容是否清空（表示发送成功）
      let checkCount = 0;
      const maxCheck = 10;
      
      const checkCleared = async () => {
        await this.domUtils.delay(300);
        
        let cleared = false;
        if (inputElement.tagName.toLowerCase() === 'textarea') {
          cleared = inputElement.value.trim() === '';
        } else {
          cleared = inputElement.innerText.trim() === '';
        }
        
        if (cleared) {
          this.logger.info('DEEPSEEK', 'Question sent successfully (input cleared)');
          return;
        }
        
        checkCount++;
        if (checkCount < maxCheck) {
          await checkCleared();
        } else {
          this.logger.warn('DEEPSEEK', 'Question may not have been sent (input not cleared)');
        }
      };
      
      await checkCleared();
    }
  }
}

// ChatGPT平台适配器 - 处理多种选择器
class ChatGPTAdapter extends BasePlatformAdapter {
  async findInputElement() {
    const selectors = [
      'textarea[data-id="root"]',
      'textarea.ChatPrompt_textarea__K8YXz',
      '#prompt-textarea',
      'textarea[placeholder*="Send a message"]',
      'textarea[placeholder*="发送消息"]',
      'form textarea',
      'div[role="textbox"]',
      'div[contenteditable="true"]'
    ];
    
    return await this.domUtils.waitForAnyElement(selectors, 15000);
  }
  
  async attemptFillQuestion(question) {
    const inputElement = await this.findInputElement();
    
    if (!inputElement) {
      throw new Error('ChatGPT input element not found');
    }

    // 检查是否已填充
    const currentText = this.domUtils.getElementText(inputElement).trim();
    if (currentText === question.trim()) {
      this.logger.debug('CHATGPT', 'Question already filled');
      return;
    }

    // 填充内容
    const success = this.domUtils.fillInput(inputElement, question, 'auto');
    if (!success) {
      throw new Error('Failed to fill ChatGPT input');
    }

    // 等待内容更新
    await this.domUtils.delay(500);
    
    // 查找并点击发送按钮
    const sendButton = document.querySelector('button[data-testid="send-button"], button[aria-label="Send message"], button[type="submit"]');
    if (sendButton && this.domUtils.isElementVisible(sendButton) && !sendButton.disabled) {
      this.domUtils.simulateClick(sendButton);
      this.logger.info('CHATGPT', 'Question sent via send button');
    } else {
      // 如果没有发送按钮或按钮不可用，尝试回车
      this.domUtils.simulateKeyPress(inputElement, 'Enter');
      this.logger.info('CHATGPT', 'Question sent via Enter key');
    }
  }
}

// Claude平台适配器
class ClaudeAdapter extends BasePlatformAdapter {
  async findInputElement() {
    const selectors = [
      '.claude-textarea',
      'textarea[placeholder*="Message Claude"]',
      'textarea[placeholder*="发送消息"]',
      'textarea[placeholder*="Send a message"]',
      'div[contenteditable="true"]',
      'div[role="textbox"]',
      '.ProseMirror',
      '#prompt-textarea',
      'textarea.Message_textarea__Pzef0',
      'textarea.message-input'
    ];
    
    return await this.domUtils.waitForAnyElement(selectors, 15000);
  }
}

/**
 * 适配器工厂类
 */
class AdapterFactory {
  static adapters = new Map();
  
  /**
   * 注册特殊适配器
   */
  static registerAdapters() {
    this.adapters.set('kimi', KimiAdapter);
    this.adapters.set('deepseek', DeepSeekAdapter);
    this.adapters.set('chatgpt', ChatGPTAdapter);
    this.adapters.set('claude', ClaudeAdapter);
    // 其他平台使用基础适配器
  }
  
  /**
   * 创建平台适配器
   * @param {string} platformId - 平台ID
   * @returns {BasePlatformAdapter} 适配器实例
   */
  static createAdapter(platformId) {
    const platformConfig = PLATFORMS[platformId];
    if (!platformConfig) {
      throw new Error(`Unknown platform: ${platformId}`);
    }
    
    // 获取适配器类
    const AdapterClass = this.adapters.get(platformId) || BasePlatformAdapter;
    
    // 创建实例
    const adapter = new AdapterClass(platformConfig);
    
    Logger.info('FACTORY', `Created adapter for platform: ${platformId}`, {
      adapterType: AdapterClass.name,
      platformName: platformConfig.name
    });
    
    return adapter;
  }
  
  /**
   * 根据当前URL自动创建适配器
   * @param {string} url - 当前页面URL
   * @returns {BasePlatformAdapter|null} 适配器实例或null
   */
  static createAdapterForUrl(url = window.location.href) {
    const platform = detectPlatformByUrl(url);
    
    if (!platform) {
      Logger.debug('FACTORY', 'No matching platform found for URL:', url);
      return null;
    }
    
    return this.createAdapter(platform.id);
  }
  
  /**
   * 获取所有支持的平台ID
   * @returns {string[]} 平台ID列表
   */
  static getSupportedPlatforms() {
    return Object.keys(PLATFORMS);
  }
  
  /**
   * 检查平台是否支持
   * @param {string} platformId - 平台ID
   * @returns {boolean} 是否支持
   */
  static isPlatformSupported(platformId) {
    return platformId in PLATFORMS;
  }
  
  /**
   * 获取平台配置
   * @param {string} platformId - 平台ID
   * @returns {Object|null} 平台配置
   */
  static getPlatformConfig(platformId) {
    return PLATFORMS[platformId] || null;
  }
}

// 初始化时注册适配器
AdapterFactory.registerAdapters();

// 便捷函数
function createPlatformAdapter(platformId) {
  return AdapterFactory.createAdapter(platformId);
}

function createAdapterForCurrentPage() {
  return AdapterFactory.createAdapterForUrl();
}