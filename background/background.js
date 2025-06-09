// Background script for AI Prompt Distributor
// 使用新架构的后台脚本

// 简化的日志工具
const Logger = {
  info: (category, message, ...args) => console.log(`[${category}] ${message}`, ...args),
  debug: (category, message, ...args) => console.debug(`[${category}] ${message}`, ...args),
  error: (category, message, ...args) => console.error(`[${category}] ${message}`, ...args)
};

// 平台URL映射
const PLATFORM_URLS = {
  chatgpt: 'https://chat.openai.com',
  claude: 'https://claude.ai',
  kimi: 'https://www.kimi.com',
  deepseek: 'https://chat.deepseek.com',
  tongyi: 'https://www.tongyi.com',  // 修改为新域名
  baidu: 'https://yiyan.baidu.com',
  bing: 'https://www.bing.com/chat',
  bard: 'https://gemini.google.com',
  chatglm: 'https://chatglm.cn',
  doubao: 'https://www.doubao.com',
  metaso: 'https://metaso.cn',
  yuanbao: 'https://yuanbao.tencent.com'
};

// 监听来自popup和content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Logger.debug('Background', 'Received message:', message.action);
  
  switch (message.action) {
    case 'distributeQuestion':
      handleDistributeQuestion(message.question, message.platforms)
        .then(results => {
          Logger.info('Background', 'Distribution completed');
          sendResponse({ results });
        })
        .catch(error => {
          Logger.error('Background', 'Distribution error:', error);
          sendResponse({ error: error.message });
        });
      return true; // 保持消息通道开放
      
    case 'openTab':
      Logger.info('Background', 'Opening new tab:', message.url);
      chrome.tabs.create({ url: message.url });
      sendResponse({ success: true });
      return false;
      
    default:
      Logger.debug('Background', 'Unknown message action:', message.action);
  }
});

// 处理问题分发
async function handleDistributeQuestion(question, platforms) {
  Logger.info('Background', `Starting distribution to ${platforms.length} platforms`);
  const results = [];
  
  // 并行处理所有平台（提高效率）
  const promises = platforms.map(async (platform) => {
    try {
      const result = await distributeToPlatform(platform, question);
      return {
        platform: platform.id,
        success: result.success,
        error: result.error
      };
    } catch (error) {
      Logger.error('Background', `Failed to distribute to ${platform.id}:`, error);
      return {
        platform: platform.id,
        success: false,
        error: error.message
      };
    }
  });
  
  const results_array = await Promise.allSettled(promises);
  
  // 处理结果
  results_array.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      results.push({
        platform: platforms[index].id,
        success: false,
        error: result.reason?.message || 'Unknown error'
      });
    }
  });
  
  return results;
}

// 分发到单个平台
async function distributeToPlatform(platform, question) {
  try {
    const platformUrl = PLATFORM_URLS[platform.id];
    Logger.info('Background', `Distributing to ${platform.id}, URL: ${platformUrl}`);
    
    // 查找现有标签页
    const existingTab = await findExistingTab(platformUrl);
    
    let targetTab;
    
    if (existingTab) {
      Logger.info('Background', `Found existing tab for ${platform.id}: ${existingTab.url}`);
      
      // 设置目标标签页
      targetTab = existingTab;
      
      // 检查Content Script是否已注入
      try {
        await chrome.tabs.sendMessage(existingTab.id, { action: 'ping' });
        Logger.info('Background', `Content script is active in tab ${existingTab.id}`);
      } catch (error) {
        Logger.warn('Background', `Content script not active in tab ${existingTab.id}, injecting...`);
        await injectContentScripts(existingTab.id, platform.id);
      }
    } else {
      Logger.debug('Background', `Creating new tab for ${platform.id}`);
      // 创建新标签页
      targetTab = await chrome.tabs.create({
        url: platformUrl,
        active: false
      });
    }
    
    // 等待标签页加载完成
    await waitForTabLoad(targetTab.id);
    
    // 等待Content Script完全准备好
    await waitForContentScriptReady(targetTab.id, platform.id);
    
    // Content Script准备好后，额外等待确保DOM完全稳定
    Logger.debug('Background', `Content script ready, waiting additional 1s for DOM stabilization`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 重试机制：尝试发送消息
    const maxRetries = 5; // 增加重试次数
    let lastError;
    
    Logger.info('Background', `Starting message sending to ${platform.id} in tab ${targetTab.id}`);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        Logger.info('Background', `Sending fillQuestion message to ${platform.id}, attempt ${attempt}/${maxRetries}`);
        Logger.debug('Background', `Message content: ${question.substring(0, 50)}...`);
        
        const response = await chrome.tabs.sendMessage(targetTab.id, {
          action: 'fillQuestion',
          question: question,
          platformId: platform.id // 确保传递platformId
        });
        
        Logger.debug('Background', `Response from ${platform.id}:`, response);
        
        if (response && response.success !== false) {
          Logger.info('Background', `Successfully distributed to ${platform.id}`);
          return { success: true };
        } else {
          throw new Error(response?.error || 'Failed to fill question');
        }
      } catch (error) {
        lastError = error;
        Logger.warn('Background', `Attempt ${attempt}/${maxRetries} failed for ${platform.id}:`, error.message);
        
        if (attempt < maxRetries) {
          // 渐进式等待时间：第一次1秒，第二次2秒，第三次3秒等
          const waitTime = 1000 * attempt;
          Logger.debug('Background', `Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          
          // 在重试前再次检查Content Script状态
          try {
            const pingResponse = await chrome.tabs.sendMessage(targetTab.id, { action: 'ping' });
            Logger.debug('Background', `Pre-retry ping for ${platform.id}:`, pingResponse);
          } catch (pingError) {
            Logger.warn('Background', `Pre-retry ping failed for ${platform.id}:`, pingError.message);
          }
        }
      }
    }
    
    throw lastError || new Error('All retry attempts failed');
    
  } catch (error) {
    Logger.error('Background', `Error distributing to ${platform.id}:`, error);
    return { success: false, error: error.message };
  }
}

// 查找现有标签页
async function findExistingTab(url) {
  try {
    const tabs = await chrome.tabs.query({});
    
    // 提取域名进行匹配
    const targetDomain = new URL(url).hostname;
    Logger.info('Background', `Looking for existing tab with domain: ${targetDomain}`);
    
    for (const tab of tabs) {
      if (tab.url) {
        try {
          const tabDomain = new URL(tab.url).hostname;
          Logger.debug('Background', `Checking tab: ${tab.url} (domain: ${tabDomain})`);
          if (tabDomain === targetDomain) {
            Logger.info('Background', `Found existing tab: ${tab.url} (ID: ${tab.id})`);
            return tab;
          }
        } catch (e) {
          // 忽略无效URL
        }
      }
    }
    
    Logger.info('Background', `No existing tab found for domain: ${targetDomain}`);
    return null;
  } catch (error) {
    Logger.error('Background', 'Error finding existing tab:', error);
    return null;
  }
}

// 注入内容脚本
async function injectContentScripts(tabId, platformId) {
  // 根据平台ID确定要注入的脚本
  let scriptPath;
  
  switch (platformId) {
    case 'chatgpt':
      scriptPath = 'content/platforms/chatgpt.js';
      break;
    case 'claude':
      scriptPath = 'content/platforms/claude.js';
      break;
    case 'bard':
      scriptPath = 'content/platforms/bard.js';
      break;
    case 'bing':
      scriptPath = 'content/platforms/bing.js';
      break;
    case 'kimi':
      scriptPath = 'content/platforms/kimi.js';
      break;
    case 'deepseek':
      scriptPath = 'content/platforms/deepseek.js';
      break;
    default:
      return; // 不支持的平台
  }
  
  try {
    // 检查脚本是否已注入
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        if (!window._platformScriptInjected) {
          window._platformScriptInjected = {};
        }
        return window._platformScriptInjected;
      }
    });
    
    // 注入平台特定脚本
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [scriptPath]
    });
    
    console.log(`已向标签页 ${tabId} 注入脚本: ${scriptPath}`);
  } catch (error) {
    console.error(`注入脚本失败:`, error);
    // 继续执行，因为脚本可能已经通过manifest注入
  }
}

// 创建标签页并重试
async function createTabWithRetry(url, maxRetries = 5) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`尝试创建标签页: ${url}`);
      return await chrome.tabs.create({ url, active: false });
    } catch (error) {
      retries++;
      console.warn(`创建标签页失败，重试 ${retries}/${maxRetries}:`, error);
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 500 * retries));
    }
  }
}

// 等待标签页加载完成
function waitForTabLoad(tabId, maxWait = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let checkCount = 0;
    
    Logger.debug('Background', `Starting to wait for tab ${tabId} to load (max wait: ${maxWait}ms)`);
    
    function checkTab() {
      checkCount++;
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          Logger.error('Background', `Error getting tab ${tabId}:`, chrome.runtime.lastError.message);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        const elapsed = Date.now() - startTime;
        Logger.debug('Background', `Tab ${tabId} status: ${tab.status}, elapsed: ${elapsed}ms, check: ${checkCount}`);
        
        if (tab.status === 'complete') {
          // 额外等待确保内容脚本加载
          Logger.debug('Background', `Tab ${tabId} status complete, waiting additional 2s for content script`);
          setTimeout(() => {
            Logger.info('Background', `Tab ${tabId} loaded successfully after ${elapsed + 2000}ms`);
            resolve(tab);
          }, 2000);
        } else if (elapsed > maxWait) {
          Logger.error('Background', `Tab ${tabId} load timeout after ${maxWait}ms, final status: ${tab.status}`);
          reject(new Error(`Tab ${tabId} load timeout after ${maxWait}ms`));
        } else {
          setTimeout(checkTab, 500);
        }
      });
    }
    
    checkTab();
  });
}

// 等待Content Script完全准备好
function waitForContentScriptReady(tabId, platformId, maxWait = 20000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let attemptCount = 0;
    
    async function checkContentScript() {
      attemptCount++;
      Logger.debug('Background', `Checking content script readiness for ${platformId}, attempt ${attemptCount}`);
      
      try {
        // 发送ping消息检查Content Script是否响应
        const response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
        Logger.debug('Background', `Ping response for ${platformId}:`, response);
        
        if (response && response.status === 'ready') {
          Logger.info('Background', `Content script ready for ${platformId} in tab ${tabId} after ${attemptCount} attempts`);
          resolve();
          return;
        }
      } catch (error) {
        Logger.debug('Background', `Ping failed for ${platformId}, attempt ${attemptCount}:`, error.message);
      }
      
      const elapsed = Date.now() - startTime;
      if (elapsed > maxWait) {
        Logger.warn('Background', `Content script not ready for ${platformId} after ${maxWait}ms and ${attemptCount} attempts, proceeding anyway`);
        resolve(); // 不要reject，继续尝试发送消息
      } else {
        setTimeout(checkContentScript, 1000); // 增加检查间隔
      }
    }
    
    checkContentScript();
  });
}

// 插件安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  Logger.info('Background', 'Extension installed/updated:', details.reason);
  
  // 设置默认配置
  chrome.storage.sync.get(['autoShowUI'], (result) => {
    if (result.autoShowUI === undefined) {
      chrome.storage.sync.set({ autoShowUI: true });
      Logger.info('Background', 'Set default autoShowUI to true');
    }
  });
});

// 标签页更新监听器（用于检测平台页面加载）
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 检查是否是支持的AI平台
    const supportedDomains = Object.values(PLATFORM_URLS).map(url => {
      try {
        return new URL(url).hostname;
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    
    try {
      const tabDomain = new URL(tab.url).hostname;
      if (supportedDomains.includes(tabDomain)) {
        Logger.debug('Background', `Detected supported platform: ${tabDomain}`);
        // 这里可以添加额外的逻辑，比如通知content script
      }
    } catch (e) {
      // 忽略无效URL
    }
  }
});

Logger.info('Background', 'Background script initialized');