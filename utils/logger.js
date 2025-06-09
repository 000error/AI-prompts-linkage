// 统一日志工具
// 提供分级日志记录、错误追踪和调试信息管理

const Logger = {
  // 日志级别
  LEVELS: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  },

  // 当前日志级别（生产环境建议设为INFO或WARN）
  currentLevel: 0, // DEBUG级别，显示所有日志

  // 日志前缀
  PREFIX: '[AI-Prompt-Distributor]',

  /**
   * 设置日志级别
   * @param {number} level - 日志级别
   */
  setLevel(level) {
    this.currentLevel = level;
  },

  /**
   * 格式化日志消息
   * @param {string} level - 日志级别名称
   * @param {string} context - 上下文（如平台名称、模块名称）
   * @param {string} message - 日志消息
   * @returns {string} 格式化后的消息
   */
  formatMessage(level, context, message) {
    const timestamp = new Date().toISOString().substr(11, 12); // HH:mm:ss.SSS
    return `${this.PREFIX}[${timestamp}][${level}][${context}] ${message}`;
  },

  /**
   * 调试日志
   * @param {string} context - 上下文
   * @param {string} message - 消息
   * @param {...any} args - 额外参数
   */
  debug(context, message, ...args) {
    if (this.currentLevel <= this.LEVELS.DEBUG) {
      console.debug(this.formatMessage('DEBUG', context, message), ...args);
    }
  },

  /**
   * 信息日志
   * @param {string} context - 上下文
   * @param {string} message - 消息
   * @param {...any} args - 额外参数
   */
  info(context, message, ...args) {
    if (this.currentLevel <= this.LEVELS.INFO) {
      console.info(this.formatMessage('INFO', context, message), ...args);
    }
  },

  /**
   * 警告日志
   * @param {string} context - 上下文
   * @param {string} message - 消息
   * @param {...any} args - 额外参数
   */
  warn(context, message, ...args) {
    if (this.currentLevel <= this.LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', context, message), ...args);
    }
  },

  /**
   * 错误日志
   * @param {string} context - 上下文
   * @param {string} message - 消息
   * @param {...any} args - 额外参数
   */
  error(context, message, ...args) {
    if (this.currentLevel <= this.LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', context, message), ...args);
    }
  },

  /**
   * 记录平台操作日志
   * @param {string} platformId - 平台ID
   * @param {string} action - 操作类型
   * @param {string} status - 状态
   * @param {any} details - 详细信息
   */
  logPlatformAction(platformId, action, status, details = null) {
    const message = `${action} - ${status}`;
    
    if (status.toLowerCase().includes('success') || status.toLowerCase().includes('完成')) {
      this.info(platformId.toUpperCase(), message, details);
    } else if (status.toLowerCase().includes('warn') || status.toLowerCase().includes('警告')) {
      this.warn(platformId.toUpperCase(), message, details);
    } else if (status.toLowerCase().includes('error') || status.toLowerCase().includes('失败')) {
      this.error(platformId.toUpperCase(), message, details);
    } else {
      this.debug(platformId.toUpperCase(), message, details);
    }
  },

  /**
   * 记录性能指标
   * @param {string} context - 上下文
   * @param {string} operation - 操作名称
   * @param {number} duration - 耗时（毫秒）
   */
  logPerformance(context, operation, duration) {
    const message = `${operation} completed in ${duration}ms`;
    
    if (duration > 5000) {
      this.warn(context, `SLOW: ${message}`);
    } else if (duration > 2000) {
      this.info(context, `${message}`);
    } else {
      this.debug(context, `${message}`);
    }
  },

  /**
   * 记录用户操作
   * @param {string} action - 用户操作
   * @param {any} data - 相关数据
   */
  logUserAction(action, data = null) {
    this.info('USER', `Action: ${action}`, data);
  },

  /**
   * 记录API调用
   * @param {string} api - API名称
   * @param {string} method - 请求方法
   * @param {any} params - 请求参数
   * @param {any} response - 响应结果
   */
  logApiCall(api, method, params, response = null) {
    this.debug('API', `${method} ${api}`, { params, response });
  },

  /**
   * 创建计时器
   * @param {string} context - 上下文
   * @param {string} operation - 操作名称
   * @returns {Function} 结束计时的函数
   */
  startTimer(context, operation) {
    const startTime = Date.now();
    this.debug(context, `Starting: ${operation}`);
    
    return () => {
      const duration = Date.now() - startTime;
      this.logPerformance(context, operation, duration);
      return duration;
    };
  },

  /**
   * 记录错误堆栈
   * @param {string} context - 上下文
   * @param {Error} error - 错误对象
   * @param {any} additionalInfo - 额外信息
   */
  logError(context, error, additionalInfo = null) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      additional: additionalInfo
    };
    
    this.error(context, `Exception caught: ${error.message}`, errorInfo);
  },

  /**
   * 记录分发操作的详细过程
   * @param {string} question - 问题内容
   * @param {Array} platforms - 目标平台列表
   * @param {Array} results - 分发结果
   */
  logDistribution(question, platforms, results) {
    const summary = {
      question: question.substring(0, 100) + (question.length > 100 ? '...' : ''),
      targetPlatforms: platforms.map(p => p.id),
      totalPlatforms: platforms.length,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
      results: results
    };
    
    this.info('DISTRIBUTION', 'Distribution completed', summary);
  },

  /**
   * 获取日志统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    // 这里可以实现日志统计功能
    // 比如记录各级别日志的数量、错误频率等
    return {
      currentLevel: this.currentLevel,
      levelName: Object.keys(this.LEVELS)[this.currentLevel] || 'UNKNOWN'
    };
  }
};

// 为了向后兼容，提供简化的全局函数
const log = {
  debug: (msg, ...args) => Logger.debug('GLOBAL', msg, ...args),
  info: (msg, ...args) => Logger.info('GLOBAL', msg, ...args),
  warn: (msg, ...args) => Logger.warn('GLOBAL', msg, ...args),
  error: (msg, ...args) => Logger.error('GLOBAL', msg, ...args)
};