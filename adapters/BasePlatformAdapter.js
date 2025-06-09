// 基础平台适配器
// 提供统一的平台适配框架和通用逻辑

class BasePlatformAdapter {
  /**
   * 构造函数
   * @param {Object} platformConfig - 平台配置
   */
  constructor(platformConfig) {
    this.config = platformConfig;
    this.logger = Logger;
    this.domUtils = DOMUtils;
    
    // 设置平台脚本加载标记
    this.setScriptLoadedFlag();
    
    // 设置消息监听器
    this.setupMessageListener();
    
    this.logger.info(this.config.id.toUpperCase(), 'Platform adapter initialized');
  }

  /**
   * 设置脚本加载标记
   */
  setScriptLoadedFlag() {
    window._platformScriptInjected = window._platformScriptInjected || {};
    window._platformScriptInjected[this.config.id] = true;
  }

  /**
   * 设置消息监听器
   */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.logger.debug(this.config.id.toUpperCase(), 'Received message:', message);
      
      if (message.action === 'fillQuestion' && message.platformId === this.config.id) {
        this.handleFillQuestion(message.question)
          .then(() => {
            this.logger.info(this.config.id.toUpperCase(), 'Question filled successfully');
            sendResponse({ success: true });
          })
          .catch(error => {
            this.logger.error(this.config.id.toUpperCase(), 'Failed to fill question:', error);
            sendResponse({ success: false, error: error.message });
          });
        
        return true; // 保持消息通道开放以进行异步响应
      }
    });
  }

  /**
   * 处理填充问题请求
   * @param {string} question - 要填充的问题
   * @returns {Promise<void>}
   */
  async handleFillQuestion(question) {
    const timer = this.logger.startTimer(this.config.id.toUpperCase(), 'Fill Question');
    
    try {
      await this.fillQuestion(question);
      timer();
    } catch (error) {
      timer();
      throw error;
    }
  }

  /**
   * 填充问题到平台（主要方法）
   * @param {string} question - 要填充的问题
   * @returns {Promise<void>}
   */
  async fillQuestion(question) {
    return this.domUtils.retryWithDelay(
      () => this.attemptFillQuestion(question),
      this.config.maxAttempts || 15,
      this.config.waitTimeout || 1000
    );
  }

  /**
   * 尝试填充问题（单次尝试）
   * @param {string} question - 要填充的问题
   * @returns {Promise<void>}
   */
  async attemptFillQuestion(question) {
    // 等待输入元素出现
    const inputElement = await this.findInputElement();
    
    if (!inputElement) {
      throw new Error('Input element not found');
    }

    // 检查是否已经填充了相同内容
    if (this.isAlreadyFilled(inputElement, question)) {
      this.logger.debug(this.config.id.toUpperCase(), 'Question already filled, skipping');
      return;
    }

    // 填充内容
    const fillSuccess = await this.fillInputElement(inputElement, question);
    if (!fillSuccess) {
      throw new Error('Failed to fill input element');
    }

    // 提交（如果配置了自动提交）
    if (this.shouldAutoSubmit()) {
      await this.submitQuestion(inputElement);
    }

    // 验证填充结果
    await this.verifyFillResult(inputElement, question);
  }

  /**
   * 查找输入元素
   * @returns {Promise<Element>} 输入元素
   */
  async findInputElement() {
    const selectors = this.config.selectors.input.split(', ');
    
    try {
      return await this.domUtils.waitForAnyElement(
        selectors,
        this.config.waitTimeout || 15000
      );
    } catch (error) {
      this.logger.warn(this.config.id.toUpperCase(), 'Failed to find input with configured selectors, trying fallback');
      
      // 尝试通用选择器作为后备
      const fallbackSelectors = [
        'textarea',
        'input[type="text"]',
        'div[contenteditable="true"]',
        '[role="textbox"]'
      ];
      
      return await this.domUtils.waitForAnyElement(fallbackSelectors, 5000);
    }
  }

  /**
   * 检查是否已经填充了相同内容
   * @param {Element} element - 输入元素
   * @param {string} question - 问题内容
   * @returns {boolean} 是否已填充
   */
  isAlreadyFilled(element, question) {
    const currentText = this.domUtils.getElementText(element).trim();
    return currentText === question.trim();
  }

  /**
   * 填充输入元素
   * @param {Element} element - 输入元素
   * @param {string} question - 问题内容
   * @returns {Promise<boolean>} 是否成功
   */
  async fillInputElement(element, question) {
    // 根据配置的策略选择填充方法
    const strategy = this.determineFillStrategy(element);
    
    this.logger.debug(this.config.id.toUpperCase(), `Using fill strategy: ${strategy}`);
    
    // 清空现有内容
    await this.clearElement(element, strategy);
    
    // 填充新内容
    const success = this.domUtils.fillInput(element, question, strategy);
    
    if (success) {
      // 等待一小段时间确保内容已填充
      await this.domUtils.delay(200);
    }
    
    return success;
  }

  /**
   * 确定填充策略
   * @param {Element} element - 输入元素
   * @returns {string} 填充策略
   */
  determineFillStrategy(element) {
    // 如果配置中指定了策略，优先使用
    if (this.config.fillStrategy && this.config.fillStrategy !== 'mixed') {
      return this.config.fillStrategy;
    }
    
    // 自动检测策略
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'textarea' || tagName === 'input') {
      return 'value';
    } else if (element.contentEditable === 'true') {
      return 'contenteditable';
    } else {
      return 'innerText';
    }
  }

  /**
   * 清空元素内容
   * @param {Element} element - 目标元素
   * @param {string} strategy - 填充策略
   * @returns {Promise<void>}
   */
  async clearElement(element, strategy) {
    element.focus();
    
    switch (strategy) {
      case 'value':
        element.value = '';
        break;
      case 'contenteditable':
        element.innerHTML = '<p><br></p>';
        break;
      case 'innerText':
        element.innerText = '';
        break;
      case 'innerHTML':
        element.innerHTML = '';
        break;
    }
    
    // 触发清空事件
    this.domUtils.triggerInputEvents(element);
    await this.domUtils.delay(100);
  }

  /**
   * 是否应该自动提交
   * @returns {boolean}
   */
  shouldAutoSubmit() {
    // 可以从配置或用户设置中读取
    return false; // 默认不自动提交，避免意外发送
  }

  /**
   * 提交问题
   * @param {Element} inputElement - 输入元素
   * @returns {Promise<void>}
   */
  async submitQuestion(inputElement) {
    try {
      // 尝试按回车键提交
      this.domUtils.simulateKeyPress(inputElement, 'Enter');
      
      // 等待一段时间
      await this.domUtils.delay(500);
      
      // 如果有提交按钮，也尝试点击
      if (this.config.selectors.submit) {
        try {
          const submitButton = document.querySelector(this.config.selectors.submit);
          if (submitButton && this.domUtils.isElementVisible(submitButton)) {
            this.domUtils.simulateClick(submitButton);
          }
        } catch (error) {
          this.logger.debug(this.config.id.toUpperCase(), 'Submit button not found or not clickable');
        }
      }
      
      this.logger.info(this.config.id.toUpperCase(), 'Question submitted');
    } catch (error) {
      this.logger.warn(this.config.id.toUpperCase(), 'Failed to submit question:', error);
      // 提交失败不应该阻止整个流程
    }
  }

  /**
   * 验证填充结果
   * @param {Element} element - 输入元素
   * @param {string} expectedText - 期望的文本
   * @returns {Promise<void>}
   */
  async verifyFillResult(element, expectedText) {
    await this.domUtils.delay(200); // 等待内容更新
    
    const actualText = this.domUtils.getElementText(element).trim();
    
    if (actualText !== expectedText.trim()) {
      this.logger.warn(this.config.id.toUpperCase(), 'Fill verification failed', {
        expected: expectedText,
        actual: actualText
      });
      // 注意：这里不抛出错误，因为有些平台可能有特殊的文本处理
    } else {
      this.logger.debug(this.config.id.toUpperCase(), 'Fill verification passed');
    }
  }

  /**
   * 获取平台特定的错误信息
   * @param {Error} error - 原始错误
   * @returns {string} 用户友好的错误信息
   */
  getErrorMessage(error) {
    const errorMap = {
      'Input element not found': `无法找到${this.config.name}的输入框，请确保页面已完全加载`,
      'Failed to fill input element': `无法在${this.config.name}中填充内容，请检查页面状态`,
      'Element not found': `${this.config.name}页面元素未找到，请刷新页面后重试`
    };
    
    return errorMap[error.message] || `${this.config.name}操作失败: ${error.message}`;
  }

  /**
   * 清理资源
   */
  destroy() {
    // 子类可以重写此方法来清理特定资源
    this.logger.info(this.config.id.toUpperCase(), 'Platform adapter destroyed');
  }
}