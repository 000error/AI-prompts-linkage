// 新架构的内容脚本
// 使用统一的配置和组件系统

// 支持的AI平台配置
const SUPPORTED_PLATFORMS = {
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
    urls: ['https://kimi.moonshot.cn'],
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
    urls: ['https://tongyi.aliyun.com'],
    color: '#ff6b35',
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

// 检测当前页面的AI平台
function detectCurrentPlatform() {
  const currentUrl = window.location.href;
  
  for (const [platformId, platform] of Object.entries(SUPPORTED_PLATFORMS)) {
    if (platform.urls.some(url => currentUrl.includes(url.replace('https://', '')))) {
      return platform;
    }
  }
  
  return null;
}

// 当前检测到的平台
currentPlatform = detectCurrentPlatform();
  
  // 新增：检测开关，只有开启时才注入UI
  if (currentPlatform) {
    chrome.storage.sync.get({ autoShowUI: true }, (data) => {
      if (data.autoShowUI) {
        // 等待页面完全加载
        window.addEventListener('load', () => {
          setTimeout(() => {
            injectFloatingUI(currentPlatform);
          }, 1000); // 延迟1秒，确保页面元素已加载
        });
      }
    });
    
    // 添加消息监听，用于刷新UI显示状态
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'refreshAutoShowUI') {
        chrome.storage.sync.get({ autoShowUI: true }, (data) => {
          console.log('收到刷新UI显示状态请求:', data.autoShowUI);
          // 如果设置为显示但当前没有显示，则显示UI
          const container = document.querySelector('.ai-prompt-distributor-container');
          if (data.autoShowUI && !container) {
            // 检查 currentPlatform 是否已定义
            if (typeof currentPlatform !== 'undefined' && currentPlatform) {
              injectFloatingUI(currentPlatform);
            } else {
              console.warn("尝试注入UI时 currentPlatform 未定义");
            }
          } 
          // 如果设置为不显示但当前正在显示，则移除UI
          else if (!data.autoShowUI && container) {
            container.remove();
          }
          // 在异步回调完成后调用 sendResponse
          sendResponse({ status: 'UI refreshed based on settings from global listener' }); 
        });
        // 确保返回true以保持消息通道开放（异步响应）
        return true; // 保持异步
      }
      // 如果不是 refreshAutoShowUI，则返回 false 或不处理，让后续的监听器处理
      // return false; // 移除或注释掉这行，允许事件冒泡到 bindUIEvents 中的监听器
    });
  }

  // 注入浮动UI
  function injectFloatingUI(platform) {
    // 创建UI容器
    const container = document.createElement('div');
    container.className = 'ai-prompt-distributor-container';
    container.innerHTML = createUIHTML(platform);
    document.body.appendChild(container);

    // 添加样式
    const styleElement = document.createElement('style');
    styleElement.textContent = getUIStyles();
    document.head.appendChild(styleElement);

    // 绑定事件
    bindUIEvents(platform);
    
    // 尝试从当前页面获取已有内容
    tryGetExistingContent(platform);
    
    // 显示UI
    setTimeout(() => {
      document.querySelector('.floating-container').classList.add('visible');
    }, 300);
  }

  // 创建UI的HTML
  function createUIHTML(platform) {
    return `
      <div class="floating-container">
        <div class="header">
          <div class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <!-- 使用简单的圆形代替复杂的路径 -->
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>AI提示词分发器</span>
          </div>
          <button class="close-btn">×</button>
        </div>
        
        <div class="content">
          <div class="detected-platform">
            <svg class="platform-icon" id="current-platform-icon" viewBox="0 0 24 24" fill="${platform.color}">
              ${platform.icon}
            </svg>
            <span class="platform-name">${platform.name}</span>
            <span class="verified-badge">✓ 已适配</span>
          </div>

          <textarea class="prompt-textarea" id="prompt-input" placeholder="输入您想同时发送到多个AI平台的问题..."></textarea>

          <div class="action-buttons">
            <button class="btn btn-primary" id="distribute-btn">立即分发</button>
          </div>
          
          <!-- 将状态消息移到这里，紧跟在按钮下方 -->
          <div class="status-message" id="status-message"></div>

          <div class="targets-container">
            <span class="targets-title">选择要分发的目标平台：</span>
            <div class="targets-grid" id="targets-grid">
              ${renderTargetOptions(platform)}
            </div>
          </div>

          <!-- 移除这里的状态消息 -->

        </div>

        <div class="footer" id="footer-message">
          <div class="footer-content">
            <span id="footer-text">一键将你的问题分发给多个AI </span>
            <div class="footer-actions">
              <button class="footer-btn" id="donate-btn" title="打赏作者">❤️ 打赏</button>
              <button class="footer-btn" id="contact-btn" title="联系作者">👤 联系</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染目标平台选项
  function renderTargetOptions(currentPlatform) {
    let optionsHTML = '';
    
    supportedPlatforms.forEach(platform => {
      const isCurrentPlatform = platform.id === currentPlatform.id;
      
      optionsHTML += `
        <div class="target-option">
          <input type="checkbox" id="target-${platform.id}" ${isCurrentPlatform ? 'checked disabled' : ''}>
          <label for="target-${platform.id}">
            <svg class="target-icon" viewBox="0 0 24 24" fill="${platform.color}">
              ${platform.icon}
            </svg>
            <span class="target-name">${platform.name}</span>
          </label>
        </div>
      `;
    });
    
    return optionsHTML;
  }

  // 获取UI样式
  function getUIStyles() {
    return `
      :root {
        --primary-color: #6e48aa;
        --secondary-color: #9d50bb;
        --accent-color: #4776e6;
        --text-dark: #2c3e50;
        --text-light: #ecf0f1;
        --success-color: #2ecc71;
        --error-color: #e74c3c; /* 新增错误颜色变量 */
        --info-color: #3498db;  /* 新增信息颜色变量 */
        --warning-color: #f39c12; /* 新增警告颜色变量 */
      }

      .floating-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 380px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        font-family: 'Segoe UI', system-ui, sans-serif;
        z-index: 9999;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        border: 1px solid #e0e0e0;
      }

      .floating-container.visible {
        transform: translateY(0);
        opacity: 1;
      }

      .header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 16px 20px;
        border-radius: 12px 12px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        font-size: 16px;
      }

      .logo-icon {
        width: 24px;
        height: 24px;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.8;
        transition: opacity 0.2s;
      }

      .close-btn:hover {
        opacity: 1;
      }

      .content {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
      }

      .detected-platform {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .platform-icon {
        width: 20px;
        height: 20px;
      }

      .platform-name {
        font-weight: 600;
        color: var(--text-dark);
      }

      .verified-badge {
        color: var(--success-color);
        font-size: 12px;
        margin-left: auto;
      }

      .prompt-textarea {
        width: 100%;
        min-height: 120px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        resize: vertical;
        font-family: inherit;
        /* 移除这里的 margin-bottom，按钮会自带间距 */
        /* margin-bottom: 15px; */
        transition: border 0.2s;
        box-sizing: border-box; /* 确保 padding 不会撑大元素 */
      }

      .prompt-textarea:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px rgba(71, 118, 230, 0.2);
      }

      .targets-container {
        /* 移除这里的 margin-bottom，按钮会自带间距 */
        /* margin-bottom: 20px; */
      }

      .targets-title {
        font-size: 14px;
        color: var(--text-dark);
        margin-bottom: 10px;
        display: block;
        font-weight: 600;
      }

      .targets-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;
      }

      .target-option {
        position: relative;
      }

      .target-option input {
        position: absolute;
        opacity: 0;
      }

      /* 确保所有文本元素在深色背景下仍然可见 */
      .target-option label {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        background: #f5f7fa !important; /* 强制使用浅色背景 */
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        color: var(--text-dark) !important; /* 强制使用深色文本 */
      }

      .target-option input:checked + label {
        background: rgba(110, 72, 170, 0.1) !important;
        border-color: var(--primary-color);
        color: var(--text-dark) !important; /* 确保选中状态下文本仍然可见 */
      }

      /* 确保平台选择区域标题文本可见 */
      .targets-title {
        font-size: 14px;
        color: var(--text-dark) !important;
        margin-bottom: 10px;
        display: block;
        font-weight: 600;
      }

      .target-icon {
        width: 24px;
        height: 24px;
        margin-bottom: 5px;
      }

      .target-name {
        font-size: 12px;
        text-align: center;
        color: var(--text-dark) !important; /* 强制使用深色文本 */
        background-color: transparent !important; /* 确保背景透明 */
      }

      .action-buttons {
        /* display: flex; */ /* 不再需要 flex 布局 */
        /* gap: 10px; */
        margin-top: 10px; /* 在按钮和输入框之间添加一些间距 */
        margin-bottom: 10px; /* 减小按钮和下面元素的间距 */
      }
      
      /* 新增：状态消息样式 */
      .status-message {
        padding: 10px 15px;
        margin-top: 15px; /* 与上方按钮的间距 */
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        display: none; /* 默认隐藏 */
        transition: all 0.3s ease;
        border: 1px solid transparent; /* 添加边框占位 */
      }

      .status-message.info {
        background-color: rgba(52, 152, 219, 0.1); /* 使用 info 颜色变量的浅色背景 */
        color: var(--info-color); /* 使用 info 颜色变量 */
        border-color: rgba(52, 152, 219, 0.3); /* 边框颜色 */
      }

      .status-message.success {
        background-color: rgba(46, 204, 113, 0.1); /* 使用 success 颜色变量的浅色背景 */
        color: var(--success-color); /* 使用 success 颜色变量 */
        border-color: rgba(46, 204, 113, 0.3); /* 边框颜色 */
      }

      .status-message.error {
        background-color: rgba(231, 76, 60, 0.1); /* 使用 error 颜色变量的浅色背景 */
        color: var(--error-color); /* 使用 error 颜色变量 */
        border-color: rgba(231, 76, 60, 0.3); /* 边框颜色 */
      }
      
      .status-message.warning { /* 如果需要警告状态 */
        background-color: rgba(243, 156, 18, 0.1); /* 使用 warning 颜色变量的浅色背景 */
        color: var(--warning-color); /* 使用 warning 颜色变量 */
        border-color: rgba(243, 156, 18, 0.3); /* 边框颜色 */
      }
      /* 状态消息样式结束 */

      .btn {
        /* flex: 1; */ /* 不再需要 flex: 1 */
        padding: 12px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%; /* 让按钮宽度与输入框一致 */
        box-sizing: border-box; /* 确保 padding 不会撑大元素 */
        text-align: center !important; /* 强制文本居中 */
        display: flex !important; /* 使用flex布局 */
        justify-content: center !important; /* 水平居中 */
        align-items: center !important; /* 垂直居中 */
        height: auto !important; /* 自动高度 */
        line-height: normal !important; /* 重置行高 */
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white !important; /* 强制文本颜色为白色 */
        font-size: 14px !important; /* 固定字体大小 */
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(110, 72, 170, 0.3);
      }

      .btn-secondary {
        background: #f5f7fa;
        color: var(--text-dark);
      }

      .btn-secondary:hover {
        background: #e9ecef;
      }

      .footer {
        padding: 8px 15px; /* 减小上下内边距 */
        background: linear-gradient(135deg, rgba(110, 72, 170, 0.03), rgba(157, 80, 187, 0.03)); /* 降低背景色透明度 */
        font-size: 12px; /* 减小字体大小 */
        color: #666; /* 使用更浅的文字颜色 */
        border-top: 1px solid rgba(110, 72, 170, 0.05); /* 减小边框明显程度 */
        border-radius: 0 0 12px 12px;
      }
      
      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .footer-actions {
        display: flex;
        gap: 6px; /* 减小按钮间距 */
      }
      
      .footer-btn {
        background: rgba(255, 255, 255, 0.7); /* 半透明背景 */
        border: 1px solid rgba(110, 72, 170, 0.1); /* 减小边框明显程度 */
        cursor: pointer;
        font-size: 12px; /* 减小字体大小 */
        padding: 3px 8px; /* 减小内边距 */
        border-radius: 4px; /* 减小圆角 */
        transition: all 0.2s;
        color: #666; /* 使用更浅的文字颜色 */
        box-shadow: 0 1px 2px rgba(0,0,0,0.03); /* 减小阴影 */
      }
      
      .footer-btn:hover {
        background-color: rgba(110, 72, 170, 0.1); /* 更淡的悬停背景色 */
        color: var(--primary-color);
        transform: translateY(-1px); /* 减小悬停时的上移距离 */
        box-shadow: 0 2px 4px rgba(110, 72, 170, 0.1); /* 减小悬停时的阴影 */
      }
      
      /* 二维码弹窗样式 */
      .qrcode-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
      }
      
      .qrcode-modal.visible {
        opacity: 1;
        visibility: visible;
      }
      
      .qrcode-container {
        background-color: white;
        padding: 25px;
        border-radius: 12px;
        text-align: center;
        max-width: 320px;
        width: 100%; /* 添加宽度100% */
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex; /* 添加flex布局 */
        flex-direction: column; /* 垂直排列 */
        align-items: center; /* 水平居中 */
      }
      
      .qrcode-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--primary-color);
        width: 100%; /* 标题宽度100% */
        text-align: center; /* 文字居中 */
      }
      
      .qrcode-img {
        width: 220px;
        height: 220px;
        margin: 0 auto 20px; /* 上下间距20px，左右自动（居中） */
        border: 1px solid rgba(110, 72, 170, 0.1);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        object-fit: contain; /* 确保图片适应容器 */
        display: block; /* 块级显示 */
      }
      
      .qrcode-close {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
        box-shadow: 0 4px 8px rgba(110, 72, 170, 0.3);
        margin: 0 auto; /* 按钮居中 */
        display: block; /* 块级显示 */
      }
      
      .qrcode-close:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(110, 72, 170, 0.4);
      }
    `;
  }

  // 绑定UI事件
  function bindUIEvents(platform) {
    // 关闭按钮
    document.querySelector('.close-btn').addEventListener('click', () => {
      document.querySelector('.floating-container').classList.remove('visible');
    });
    
    // 分发按钮
    document.getElementById('distribute-btn').addEventListener('click', () => {
      distributePrompt(platform);
    });
    
    // 添加打赏和联系按钮事件
    const donateBtn = document.getElementById('donate-btn');
    const contactBtn = document.getElementById('contact-btn');
    
    if (donateBtn) {
      donateBtn.addEventListener('click', () => {
        // 使用扩展程序内的图片路径
        showQRCodeModal('打赏作者', chrome.runtime.getURL('images/donate.png'));
      });
    }
    
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        // 使用扩展程序内的图片路径
        showQRCodeModal('联系作者', chrome.runtime.getURL('images/contact.png'));
      });
    }
    
    // 添加消息监听器
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'fillAndSendQuestion') {
        try {
          // 查找输入框
          const inputElement = document.querySelector(platform.selector);
          if (!inputElement) {
            sendResponse({ success: false, error: '未找到输入框' });
            return true;
          }
          
          // 填充问题
          if (inputElement.tagName.toLowerCase() === 'textarea' || inputElement.tagName.toLowerCase() === 'input') {
            inputElement.value = message.question;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
          } else if (inputElement.getAttribute('contenteditable') === 'true') {
            inputElement.textContent = message.question;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          // 查找发送按钮
          const sendButton = document.querySelector('button[type="submit"], button.send-button, button.submit-button');
          if (sendButton) {
            sendButton.click();
            sendResponse({ success: true });
          } else {
            // 模拟回车键
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true
            });
            inputElement.dispatchEvent(enterEvent);
            sendResponse({ success: true });
          }
        } catch (err) {
          console.error('填充问题时出错:', err);
          sendResponse({ success: false, error: err.message });
        }
        return true; // 保持异步
      }
      
      if (message.action === 'refreshAutoShowUI') {
        chrome.storage.sync.get({ autoShowUI: true }, (data) => {
          // 如果设置为显示但当前没有显示，则显示UI
          const container = document.querySelector('.ai-prompt-distributor-container');
          if (data.autoShowUI && !container) {
            injectFloatingUI(currentPlatform);
          } 
          else if (!data.autoShowUI && container) {
            container.remove();
          }
          // 在异步回调完成后调用 sendResponse
          sendResponse({ status: 'UI refreshed based on settings' }); 
        });
        return true; // 保持异步，因为 sendResponse 在回调中调用
      }
      
      // 对于其他未处理的消息，可以返回 false 或不返回
      return false; 
    });
  }

  // 分发提示词到选中的平台
  function distributePrompt(currentPlatform) {
    // 分发前清除所有平台的分发状态标识
    clearAllPlatformStatus();
    
    const promptText = document.getElementById('prompt-input').value.trim();
    
    if (!promptText) {
      showStatus('请输入要分发的问题', 'error');
      return;
    }
    
    // 获取选中的目标平台
    const selectedPlatforms = [];
    supportedPlatforms.forEach(platform => {
      const checkbox = document.getElementById(`target-${platform.id}`);
      if (checkbox && checkbox.checked) {
        selectedPlatforms.push({
          id: platform.id,
          url: platform.url
        });
      }
    });
  
    if (selectedPlatforms.length === 0) {
      showStatus('请至少选择一个目标平台', 'error');
      return;
    }
    
    // 确保状态元素存在
    const statusElement = document.getElementById('status-message');
    if (!statusElement) {
      console.error("DistributePrompt: Status element not found!");
      return; 
    }

    // 使用 requestAnimationFrame 来确保在下一次浏览器绘制前更新状态
    requestAnimationFrame(() => {
      showStatus('正在分发...', 'info', null); // 显示“正在分发...”并不设置自动消失
      
      // 在 requestAnimationFrame 回调内，添加一个极短的 setTimeout
      // 确保 "正在分发..." 状态至少有机会在下一帧渲染出来
      // 然后再开始后台处理流程
      setTimeout(() => {
        chrome.runtime.sendMessage({
          action: 'distributeQuestion',
          question: promptText,
          platforms: selectedPlatforms
        }, response => {
          // 这个回调会在 background.js 处理完并调用 sendResponse 后执行
          if (chrome.runtime.lastError) {
            console.error("发送消息错误:", chrome.runtime.lastError);
            // 即使出错，也要更新状态
            showStatus(`分发失败: ${chrome.runtime.lastError.message}`, 'error', 5000);
            return;
          }
          
          // 收到后台响应后，更新状态为“分发结束”或错误信息
          if (response && response.results) {
            updatePlatformStatus(response.results);
            showStatus('分发结束', 'success', 3000); // 显示“分发结束”并设置3秒后消失
          } else if (response && response.error) {
            showStatus(`分发失败: ${response.error}`, 'error', 5000);
          } else {
            // 可能 background.js 没有正确返回 response
            showStatus('分发失败，请检查后台日志', 'error', 5000); 
          }
        });
      }, 50); // 尝试 50ms 延迟。这个值可以调整，甚至 0ms 也可能有效，因为它会将 sendMessage 推迟到下一个事件循环。
    });
  }

  // 保存为模板
  function saveAsTemplate() {
    const promptText = document.getElementById('prompt-input').value.trim();
    
    if (!promptText) {
      showStatus('请输入要保存的问题', 'error');
      return;
    }
    
    chrome.storage.sync.get('templates', data => {
      const templates = data.templates || [];
      templates.push({
        id: Date.now(),
        text: promptText,
        date: new Date().toISOString()
      });
      
      chrome.storage.sync.set({ templates }, () => {
        showStatus('模板已保存', 'success');
      });
    });
  }

  // 显示状态消息
  function showStatus(message, type, duration = 5000) {
    console.log("显示状态:", message, type);
    const statusElement = document.getElementById('status-message');
    if (!statusElement) {
      console.error("状态元素不存在");
      return;
    }
    
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.style.display = 'block'; // 确保状态消息可见

    // 强制浏览器重绘，确保样式立即生效
    void statusElement.offsetHeight; // 读取 offsetHeight 会触发重绘

    // 清除之前的定时器
    if (statusElement.timeoutId) {
      clearTimeout(statusElement.timeoutId);
      statusElement.timeoutId = null;
    }
    
    // 如果指定了持续时间，则设置定时器
    if (duration !== null) {
      statusElement.timeoutId = setTimeout(() => {
        statusElement.className = 'status-message';
        statusElement.style.display = 'none'; // 隐藏状态消息
      }, duration);
    }
  }

  // 更新每个平台的分发状态
  function updatePlatformStatus(results) {
    results.forEach(r => {
      const iconLabel = document.querySelector(`#target-${r.platform} + label .target-name`);
      if (iconLabel) {
        // 移除旧的状态标识
        const oldStatus = iconLabel.querySelector('.distribute-status');
        if (oldStatus) oldStatus.remove();
        // 新建状态标识
        const statusSpan = document.createElement('span');
        statusSpan.className = 'distribute-status';
        statusSpan.style.marginLeft = '6px';
        statusSpan.style.fontSize = '14px';
        statusSpan.textContent = r.success ? '✅' : '❌';
        iconLabel.appendChild(statusSpan);
      }
    });
  }

  // 新增：清除所有平台的分发状态标识
  function clearAllPlatformStatus() {
      const statusSpans = document.querySelectorAll('.distribute-status');
      statusSpans.forEach(span => span.remove());
  }
  
  // 显示二维码弹窗
  function showQRCodeModal(title, imgUrl) {
    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'qrcode-modal';
    modal.innerHTML = `
      <div class="qrcode-container">
        <div class="qrcode-title">${title}</div>
        <img class="qrcode-img" src="${imgUrl}" alt="${title}">
        <button class="qrcode-close">关闭</button>
      </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 显示弹窗
    setTimeout(() => modal.classList.add('visible'), 10);
    
    // 绑定关闭事件
    modal.querySelector('.qrcode-close').addEventListener('click', () => {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    });
    
    // 点击空白处关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
      }
    });
  }

  // 根据平台ID查找发送按钮
  function findSendButton(platformId) {
    // 不同平台的发送按钮选择器
    const sendButtonSelectors = {
      'kimi': 'button[data-testid="chat-send-button"], button.send-button',
      'deepseek': 'button[data-testid="send-button"], button.send-button, button[aria-label="发送"]',
      'tongyi': 'button.submit-button, button[type="submit"], button.send-button',
      'chatglm': 'button.send-button, button[type="submit"]',
      'doubao': 'button[data-testid="chat_input_send_button"]',
      'yuanbao': 'button.send-button, button[type="submit"]',
      'baidu': 'button.submit-button, button[type="submit"], button.send-button',
      'metaso': 'button.send-button, button[type="submit"]'
    };
    
    // 通用选择器，如果特定平台选择器找不到
    const genericSelectors = [
      'button[type="submit"]',
      'button.send-button',
      'button.submit-button',
      'button[aria-label="发送"]',
      'button:has(svg)',
      'button.primary'
    ];
    
    // 先尝试特定平台的选择器
    if (sendButtonSelectors[platformId]) {
      const button = document.querySelector(sendButtonSelectors[platformId]);
      if (button) return button;
    }
    
    // 如果找不到，尝试通用选择器
    for (const selector of genericSelectors) {
      try {
        const buttons = document.querySelectorAll(selector);
        for (const button of buttons) {
          // 检查按钮是否可见且在输入框附近
          if (button.offsetParent !== null && 
              (button.textContent.includes('发送') || 
               button.getAttribute('aria-label')?.includes('发送') ||
               button.innerHTML.includes('svg'))) {
            return button;
          }
        }
      } catch (e) {
        console.warn(`选择器 ${selector} 查询失败:`, e);
      }
    }
    
    console.warn(`[${platformId}] 未找到发送按钮`);
    return null;
  }

})(); // IIFE结束

function tryGetExistingContent(platform) {
  const inputElement = document.querySelector(platform.selector);
  if (inputElement && inputElement.value) {
    const promptInput = document.getElementById('prompt-input');
    if (promptInput) {
      promptInput.value = inputElement.value;
      const footerMessage = document.getElementById('footer-message');
      if (footerMessage) {
        footerMessage.textContent = '当前页面已自动填充，修改内容将同步更新';
      }
    }
  }
}