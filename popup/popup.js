// Popup script for AI Prompt Distributor
// 使用新架构的弹出窗口脚本

// 简化的日志工具
const Logger = {
  info: (category, message, ...args) => console.log(`[${category}] ${message}`, ...args),
  debug: (category, message, ...args) => console.debug(`[${category}] ${message}`, ...args),
  error: (category, message, ...args) => console.error(`[${category}] ${message}`, ...args)
};

// 从统一配置中获取平台列表
let platforms = [];

// 获取平台配置的函数
function initializePlatforms() {
  try {
    // 尝试从config/platforms.js获取平台配置
    if (typeof getAllPlatforms === 'function') {
      platforms = getAllPlatforms();
      console.log('成功加载统一平台配置，平台数量:', platforms.length);
    } else {
      throw new Error('getAllPlatforms函数未定义');
    }
  } catch (error) {
    console.warn('无法加载统一平台配置，使用默认配置:', error);
    // 使用与content.js一致的平台列表作为后备
    platforms = [
      { id: 'kimi', name: 'Kimi', color: '#6e48aa', icon: '🌙' },
      { id: 'deepseek', name: 'DeepSeek', color: '#009688', icon: '🔍' },
      { id: 'tongyi', name: '通义', color: '#ff9800', icon: '🤖' },
      { id: 'chatglm', name: '智谱', color: '#1976d2', icon: '🚀' },
      { id: 'doubao', name: '豆包', color: '#4caf50', icon: '🎒' },
      { id: 'yuanbao', name: '元宝', color: '#00bcd4', icon: '💰' },
      { id: 'baidu', name: '百度', color: '#2196f3', icon: '🎯' },
      { id: 'metaso', name: '秘塔', color: '#9c27b0', icon: '🗼' }
    ];
  }
  return platforms;
}

// 兼容旧代码的别名
const supportedPlatforms = platforms;

document.addEventListener('DOMContentLoaded', () => {
  // 初始化平台配置
  initializePlatforms();
  
  const platformList = document.getElementById('platformList');
  const promptInput = document.getElementById('promptInput');
  const distributeBtn = document.getElementById('distributeBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusMessage = document.getElementById('statusMessage');

  // 渲染平台选项
  renderPlatforms(platformList);

  // 绑定按钮事件
  if (distributeBtn) {
    distributeBtn.addEventListener('click', handleDistribute);
  }
  
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', handleSelectAll);
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', handleClear);
  }

  // 自动显示UI开关设置（如果存在的话）
  const autoShowSwitch = document.getElementById('auto-show-ui-switch-popup');
  if (autoShowSwitch) {
    chrome.storage.sync.get({ autoShowUI: true }, (data) => {
      autoShowSwitch.checked = data.autoShowUI;
    });

    autoShowSwitch.addEventListener('change', (e) => {
      chrome.storage.sync.set({ autoShowUI: e.target.checked }, () => {
        // 新增：通知所有tab的content script刷新UI
        chrome.tabs.query({}, function(tabs) {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: 'refreshAutoShowUI' });
          });
        });
      });
    });
  }
  
  // 添加打赏和联系按钮事件 - 移到DOMContentLoaded内部
  const donateBtn = document.getElementById('donate-btn');
  const contactBtn = document.getElementById('contact-btn');
  
  if (donateBtn) {
    donateBtn.addEventListener('click', () => {
      // 打开本地打赏图片
      const donateImageUrl = chrome.runtime.getURL('images/donate.png');
      chrome.tabs.create({ url: donateImageUrl });
    });
  }
  
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      // 打开本地联系图片
      const contactImageUrl = chrome.runtime.getURL('images/contact.png');
      chrome.tabs.create({ url: contactImageUrl });
    });
  }

  // (可选) 绑定设置按钮事件
  // if (settingsBtn) {
  //   settingsBtn.addEventListener('click', () => {
  //     chrome.runtime.openOptionsPage(); // 打开选项页
  //   });
  // }

  // (可选) 从存储中加载上次输入的内容
  // chrome.storage.local.get(['lastPopupQuestion'], (result) => {
  //   if (result.lastPopupQuestion) {
  //     promptInput.value = result.lastPopupQuestion;
  //   }
  // });
}); // 这里只保留一个结束括号

// 渲染平台列表
function renderPlatforms(container) {
  if (!container) return;
  
  let platformsHTML = '';
  
  platforms.forEach(platform => {
    platformsHTML += `
      <div class="platform-item">
        <input type="checkbox" id="platform-${platform.id}" name="platform" value="${platform.id}">
        <label for="platform-${platform.id}" class="platform-label" style="border-color: ${platform.color}">
          <span class="platform-icon" style="background-color: ${platform.color || '#6e48aa'}">${platform.icon || '🤖'}</span>
          <span class="platform-name">${platform.name}</span>
        </label>
      </div>
    `;
  });
  
  container.innerHTML = platformsHTML;
}

// 全选功能
function handleSelectAll() {
  const checkboxes = document.querySelectorAll('input[name="platform"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
  });
}

// 清空选择功能
function handleClear() {
  const checkboxes = document.querySelectorAll('input[name="platform"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  const promptInput = document.getElementById('promptInput');
  if (promptInput) {
    promptInput.value = '';
  }
}

// 处理分发按钮点击事件
async function handleDistribute() {
  const promptText = document.getElementById('promptInput').value.trim();
  const selectedCheckboxes = document.querySelectorAll('input[name="platform"]:checked');
  const statusMessage = document.getElementById('statusMessage');
  const distributeBtn = document.getElementById('distributeBtn');

  if (!promptText) {
    showStatus('请输入要分发的问题！', true);
    return;
  }

  if (selectedCheckboxes.length === 0) {
    showStatus('请至少选择一个目标平台！', true);
    return;
  }

  // 获取选中的目标平台信息
  const selectedPlatforms = [];
  selectedCheckboxes.forEach(checkbox => {
    const platformId = checkbox.value;
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      // 发送给 background.js 的信息，和 content.js 保持一致
      selectedPlatforms.push({
        id: platform.id,
        url: platform.url // background.js 会处理 URL 格式
      });
    }
  });

  Logger.info('Popup', `Starting distribution to ${selectedPlatforms.length} platforms`);

  // (可选) 保存当前输入内容
  // chrome.storage.local.set({ lastPopupQuestion: promptText });

  showStatus('正在分发...', false);
  distributeBtn.disabled = true; // 禁用按钮防止重复点击

  console.log('发送分发请求 (来自 Popup):', { question: promptText, platforms: selectedPlatforms });

  try {
    // 发送消息给 background.js
    const response = await chrome.runtime.sendMessage({
      action: 'distributeQuestion',
      question: promptText,
      platforms: selectedPlatforms
    });

    if (response.error) {
      throw new Error(response.error);
    }

    console.log('收到分发响应 (来自 Popup):', response);
    // 可以根据 response.results 显示更详细的状态
    const results = response.results || [];
    const successes = results.filter(r => r.success).length;
    const failures = results.length - successes;
    
    Logger.info('Popup', `Distribution completed: ${successes}/${selectedPlatforms.length} successful`);
    
    if (failures === 0) {
      showStatus(`✅ 成功分发到 ${successes} 个平台`, false); // 全部成功
    } else if (successes > 0) {
      showStatus(`⚠️ 部分成功：${successes}/${selectedPlatforms.length} 个平台`, true); // 部分失败算作错误状态
    } else {
      showStatus('❌ 分发失败', true);
    }
    
  } catch (error) {
    Logger.error('Popup', 'Distribution error:', error);
    if (chrome.runtime.lastError) {
      showStatus(`❌ 分发失败: ${chrome.runtime.lastError.message}`, true);
    } else {
      showStatus(`❌ 分发失败: ${error.message}`, true);
    }
  } finally {
    distributeBtn.disabled = false; // 恢复按钮
  }
}

// 显示状态消息
function showStatus(message, isError = false) {
  const statusElement = document.getElementById('statusMessage');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = 'status-message'; // Reset class
    if (isError) {
      statusElement.classList.add('error');
    } else {
       statusElement.classList.add('success'); // Use success class for non-error messages too
    }
    // Optional: Clear message after a delay
    setTimeout(() => {
      if (statusElement.textContent === message) { // Avoid clearing newer messages
         statusElement.textContent = '';
         statusElement.className = 'status-message';
      }
    }, 5000);
  }
}