// DOM操作工具函数库
// 提供统一的DOM操作、事件处理和输入填充功能

const DOMUtils = {
  /**
   * 等待元素出现
   * @param {string} selector - CSS选择器
   * @param {number} timeout - 超时时间(毫秒)
   * @param {Element} parent - 父元素，默认为document
   * @returns {Promise<Element>} 找到的元素
   */
  waitForElement(selector, timeout = 15000, parent = document) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkElement = () => {
        const element = parent.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Element not found: ${selector} (timeout: ${timeout}ms)`));
          return;
        }
        
        setTimeout(checkElement, 100);
      };
      
      checkElement();
    });
  },

  /**
   * 尝试多个选择器找到元素
   * @param {string[]} selectors - 选择器数组
   * @param {number} timeout - 超时时间
   * @param {Element} parent - 父元素
   * @returns {Promise<Element>} 找到的元素
   */
  waitForAnyElement(selectors, timeout = 15000, parent = document) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkElements = () => {
        for (const selector of selectors) {
          const element = parent.querySelector(selector);
          if (element) {
            resolve(element);
            return;
          }
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`No elements found from selectors: ${selectors.join(', ')} (timeout: ${timeout}ms)`));
          return;
        }
        
        setTimeout(checkElements, 100);
      };
      
      checkElements();
    });
  },

  /**
   * 填充输入框内容
   * @param {Element} element - 输入元素
   * @param {string} text - 要填充的文本
   * @param {string} strategy - 填充策略: 'value', 'innerText', 'innerHTML', 'contenteditable'
   */
  fillInput(element, text, strategy = 'auto') {
    if (!element || !text) return false;
    
    // 自动检测策略
    if (strategy === 'auto') {
      if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
        strategy = 'value';
      } else if (element.contentEditable === 'true') {
        strategy = 'contenteditable';
      } else {
        strategy = 'innerText';
      }
    }
    
    // 聚焦元素
    element.focus();
    
    try {
      switch (strategy) {
        case 'value':
          element.value = text;
          this.triggerInputEvents(element);
          break;
          
        case 'innerText':
          element.innerText = text;
          this.triggerInputEvents(element);
          break;
          
        case 'innerHTML':
          element.innerHTML = text;
          this.triggerInputEvents(element);
          break;
          
        case 'contenteditable':
          // 清空内容
          element.innerHTML = '<p><br></p>';
          
          // 使用Selection API插入文本
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(element);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          
          // 插入文本
          document.execCommand('insertText', false, text);
          this.triggerInputEvents(element);
          break;
          
        default:
          throw new Error(`Unknown fill strategy: ${strategy}`);
      }
      
      return true;
    } catch (error) {
      console.error('Fill input failed:', error);
      return false;
    }
  },

  /**
   * 触发输入相关事件
   * @param {Element} element - 目标元素
   */
  triggerInputEvents(element) {
    const events = ['input', 'change', 'keyup', 'blur'];
    events.forEach(eventType => {
      element.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
  },

  /**
   * 模拟按键
   * @param {Element} element - 目标元素
   * @param {string} key - 按键名称
   * @param {Object} options - 按键选项
   */
  simulateKeyPress(element, key, options = {}) {
    const defaultOptions = {
      bubbles: true,
      cancelable: true,
      key: key,
      code: key,
      ...options
    };
    
    element.dispatchEvent(new KeyboardEvent('keydown', defaultOptions));
    element.dispatchEvent(new KeyboardEvent('keypress', defaultOptions));
    element.dispatchEvent(new KeyboardEvent('keyup', defaultOptions));
  },

  /**
   * 模拟点击
   * @param {Element} element - 目标元素
   */
  simulateClick(element) {
    if (!element) return false;
    
    try {
      element.click();
      return true;
    } catch (error) {
      // 如果直接点击失败，尝试触发事件
      try {
        element.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        }));
        return true;
      } catch (e) {
        console.error('Click simulation failed:', e);
        return false;
      }
    }
  },

  /**
   * 等待页面加载完成
   * @param {number} timeout - 超时时间
   * @returns {Promise<void>}
   */
  waitForPageLoad(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (document.readyState === 'complete') {
        resolve();
        return;
      }
      
      const timer = setTimeout(() => {
        reject(new Error('Page load timeout'));
      }, timeout);
      
      const onLoad = () => {
        clearTimeout(timer);
        resolve();
      };
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onLoad, { once: true });
      } else {
        window.addEventListener('load', onLoad, { once: true });
      }
    });
  },

  /**
   * 延迟执行
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 重试执行函数
   * @param {Function} fn - 要执行的函数
   * @param {number} maxAttempts - 最大重试次数
   * @param {number} delay - 重试间隔
   * @returns {Promise<any>} 函数执行结果
   */
  async retryWithDelay(fn, maxAttempts = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error.message);
        
        if (attempt < maxAttempts) {
          await this.delay(delay);
        }
      }
    }
    
    throw lastError;
  },

  /**
   * 检查元素是否可见
   * @param {Element} element - 目标元素
   * @returns {boolean} 是否可见
   */
  isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  },

  /**
   * 获取元素的文本内容
   * @param {Element} element - 目标元素
   * @returns {string} 文本内容
   */
  getElementText(element) {
    if (!element) return '';
    
    if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
      return element.value || '';
    }
    
    return element.innerText || element.textContent || '';
  }
};