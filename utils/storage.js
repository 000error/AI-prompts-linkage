// 存储工具
// 提供统一的Chrome存储API封装和配置管理

const Storage = {
  /**
   * 获取存储数据
   * @param {string|Array|Object} keys - 要获取的键
   * @param {string} area - 存储区域 ('sync' | 'local')
   * @returns {Promise<Object>} 存储的数据
   */
  async get(keys, area = 'sync') {
    try {
      const result = await chrome.storage[area].get(keys);
      Logger.debug('STORAGE', `Get from ${area}:`, { keys, result });
      return result;
    } catch (error) {
      Logger.error('STORAGE', `Failed to get from ${area}:`, error);
      throw error;
    }
  },

  /**
   * 设置存储数据
   * @param {Object} items - 要存储的数据
   * @param {string} area - 存储区域 ('sync' | 'local')
   * @returns {Promise<void>}
   */
  async set(items, area = 'sync') {
    try {
      await chrome.storage[area].set(items);
      Logger.debug('STORAGE', `Set to ${area}:`, items);
    } catch (error) {
      Logger.error('STORAGE', `Failed to set to ${area}:`, error);
      throw error;
    }
  },

  /**
   * 删除存储数据
   * @param {string|Array} keys - 要删除的键
   * @param {string} area - 存储区域 ('sync' | 'local')
   * @returns {Promise<void>}
   */
  async remove(keys, area = 'sync') {
    try {
      await chrome.storage[area].remove(keys);
      Logger.debug('STORAGE', `Remove from ${area}:`, keys);
    } catch (error) {
      Logger.error('STORAGE', `Failed to remove from ${area}:`, error);
      throw error;
    }
  },

  /**
   * 清空存储区域
   * @param {string} area - 存储区域 ('sync' | 'local')
   * @returns {Promise<void>}
   */
  async clear(area = 'sync') {
    try {
      await chrome.storage[area].clear();
      Logger.info('STORAGE', `Cleared ${area} storage`);
    } catch (error) {
      Logger.error('STORAGE', `Failed to clear ${area}:`, error);
      throw error;
    }
  },

  /**
   * 监听存储变化
   * @param {Function} callback - 回调函数
   * @param {string} area - 存储区域 ('sync' | 'local' | null for all)
   */
  addListener(callback, area = null) {
    const listener = (changes, areaName) => {
      if (area && areaName !== area) return;
      
      Logger.debug('STORAGE', `Storage changed in ${areaName}:`, changes);
      callback(changes, areaName);
    };
    
    chrome.storage.onChanged.addListener(listener);
    return listener; // 返回监听器以便后续移除
  },

  /**
   * 移除存储监听器
   * @param {Function} listener - 要移除的监听器
   */
  removeListener(listener) {
    chrome.storage.onChanged.removeListener(listener);
  }
};

// 配置管理器
const ConfigManager = {
  // 默认配置
  DEFAULT_CONFIG: {
    autoShowUI: true,
    selectedPlatforms: [],
    lastQuestion: '',
    uiPosition: { x: 30, y: 30 },
    logLevel: 1, // INFO级别
    theme: 'light',
    language: 'zh-CN',
    autoSubmit: false,
    submitDelay: 1000,
    maxRetries: 3,
    retryDelay: 1000
  },

  /**
   * 获取配置
   * @param {string} key - 配置键，如果为空则获取所有配置
   * @returns {Promise<any>} 配置值
   */
  async getConfig(key = null) {
    try {
      if (key) {
        const result = await Storage.get({ [key]: this.DEFAULT_CONFIG[key] });
        return result[key];
      } else {
        const result = await Storage.get(this.DEFAULT_CONFIG);
        return result;
      }
    } catch (error) {
      Logger.error('CONFIG', `Failed to get config for key: ${key}`, error);
      return key ? this.DEFAULT_CONFIG[key] : this.DEFAULT_CONFIG;
    }
  },

  /**
   * 设置配置
   * @param {string|Object} key - 配置键或配置对象
   * @param {any} value - 配置值（当key为字符串时使用）
   * @returns {Promise<void>}
   */
  async setConfig(key, value = undefined) {
    try {
      const config = typeof key === 'object' ? key : { [key]: value };
      await Storage.set(config);
      Logger.info('CONFIG', 'Configuration updated:', config);
    } catch (error) {
      Logger.error('CONFIG', 'Failed to set config:', error);
      throw error;
    }
  },

  /**
   * 重置配置为默认值
   * @param {string} key - 要重置的配置键，如果为空则重置所有配置
   * @returns {Promise<void>}
   */
  async resetConfig(key = null) {
    try {
      if (key) {
        await this.setConfig(key, this.DEFAULT_CONFIG[key]);
        Logger.info('CONFIG', `Reset config key: ${key}`);
      } else {
        await Storage.set(this.DEFAULT_CONFIG);
        Logger.info('CONFIG', 'Reset all configuration to default');
      }
    } catch (error) {
      Logger.error('CONFIG', 'Failed to reset config:', error);
      throw error;
    }
  },

  /**
   * 监听配置变化
   * @param {Function} callback - 回调函数
   * @returns {Function} 监听器函数
   */
  onConfigChange(callback) {
    return Storage.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        const configChanges = {};
        for (const [key, change] of Object.entries(changes)) {
          if (key in this.DEFAULT_CONFIG) {
            configChanges[key] = change;
          }
        }
        
        if (Object.keys(configChanges).length > 0) {
          callback(configChanges);
        }
      }
    });
  },

  /**
   * 获取用户偏好设置
   * @returns {Promise<Object>} 用户偏好
   */
  async getUserPreferences() {
    const config = await this.getConfig();
    return {
      autoShowUI: config.autoShowUI,
      theme: config.theme,
      language: config.language,
      autoSubmit: config.autoSubmit,
      submitDelay: config.submitDelay
    };
  },

  /**
   * 保存用户偏好设置
   * @param {Object} preferences - 偏好设置
   * @returns {Promise<void>}
   */
  async saveUserPreferences(preferences) {
    await this.setConfig(preferences);
    Logger.info('CONFIG', 'User preferences saved:', preferences);
  }
};

// 缓存管理器
const CacheManager = {
  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   * @param {number} ttl - 生存时间（毫秒），0表示永不过期
   * @returns {Promise<void>}
   */
  async setCache(key, value, ttl = 0) {
    const cacheItem = {
      value,
      timestamp: Date.now(),
      ttl
    };
    
    await Storage.set({ [`cache_${key}`]: cacheItem }, 'local');
    Logger.debug('CACHE', `Set cache: ${key}`, { ttl });
  },

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {Promise<any>} 缓存值，如果不存在或已过期则返回null
   */
  async getCache(key) {
    try {
      const result = await Storage.get(`cache_${key}`, 'local');
      const cacheItem = result[`cache_${key}`];
      
      if (!cacheItem) {
        return null;
      }
      
      // 检查是否过期
      if (cacheItem.ttl > 0 && Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        await this.removeCache(key);
        Logger.debug('CACHE', `Cache expired: ${key}`);
        return null;
      }
      
      Logger.debug('CACHE', `Get cache: ${key}`);
      return cacheItem.value;
    } catch (error) {
      Logger.error('CACHE', `Failed to get cache: ${key}`, error);
      return null;
    }
  },

  /**
   * 删除缓存
   * @param {string} key - 缓存键
   * @returns {Promise<void>}
   */
  async removeCache(key) {
    await Storage.remove(`cache_${key}`, 'local');
    Logger.debug('CACHE', `Remove cache: ${key}`);
  },

  /**
   * 清空所有缓存
   * @returns {Promise<void>}
   */
  async clearCache() {
    try {
      const allData = await Storage.get(null, 'local');
      const cacheKeys = Object.keys(allData).filter(key => key.startsWith('cache_'));
      
      if (cacheKeys.length > 0) {
        await Storage.remove(cacheKeys, 'local');
        Logger.info('CACHE', `Cleared ${cacheKeys.length} cache items`);
      }
    } catch (error) {
      Logger.error('CACHE', 'Failed to clear cache:', error);
    }
  }
};