// 统一平台配置文件
// 所有AI平台的配置信息集中管理

const PLATFORMS = {
  kimi: {
    id: 'kimi',
    name: 'Kimi',
    urls: ['www.kimi.com'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    id: 'tongyi',
    name: '通义',
    urls: ['www.tongyi.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatglm: {
    id: 'chatglm',
    name: '智谱',
    urls: ['chatglm.cn'],
    color: '#1976d2',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  doubao: {
    id: 'doubao',
    name: '豆包',
    urls: ['www.doubao.com/chat', 'doubao.com/chat'],
    color: '#4caf50',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-testid="chat_input_input"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'textarea',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  yuanbao: {
    id: 'yuanbao',
    name: '元宝',
    urls: ['yuanbao.tencent.com'],
    color: '#00bcd4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  baidu: {
    id: 'baidu',
    name: '百度',
    urls: ['chat.baidu.com'],
    color: '#2196f3',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  metaso: {
    id: 'metaso',
    name: '秘塔',
    urls: ['metaso.cn'],
    color: '#9c27b0',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    urls: ['chat.openai.com', 'chatgpt.com'],
    color: '#10a37f',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="root"], textarea.ChatPrompt_textarea__K8YXz, #prompt-textarea, textarea[placeholder*="Send a message"], textarea[placeholder*="发送消息"], form textarea, div[role="textbox"], div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  claude: {
    id: 'claude',
    name: 'Claude',
    urls: ['claude.ai'],
    color: '#d97706',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: '.claude-textarea, textarea[placeholder*="Message Claude"], textarea[placeholder*="发送消息"], textarea[placeholder*="Send a message"], div[contenteditable="true"], div[role="textbox"], .ProseMirror, #prompt-textarea, textarea.Message_textarea__Pzef0, textarea.message-input',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bing: {
    id: 'bing',
    name: 'Bing',
    urls: ['www.bing.com/chat'],
    color: '#0078d4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bard: {
    id: 'bard',
    name: 'Bard',
    urls: ['bard.google.com'],
    color: '#4285f4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatglm: {
    id: 'chatglm',
    name: '智谱',
    urls: ['chatglm.cn'],
    color: '#1976d2',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  doubao: {
    id: 'doubao',
    name: '豆包',
    urls: ['www.doubao.com/chat', 'doubao.com/chat'],
    color: '#4caf50',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-testid="chat_input_input"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'textarea',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  yuanbao: {
    id: 'yuanbao',
    name: '元宝',
    urls: ['yuanbao.tencent.com'],
    color: '#00bcd4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  baidu: {
    id: 'baidu',
    name: '百度',
    urls: ['chat.baidu.com'],
    color: '#2196f3',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  metaso: {
    id: 'metaso',
    name: '秘塔',
    urls: ['metaso.cn'],
    color: '#9c27b0',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    urls: ['chat.openai.com', 'chatgpt.com'],
    color: '#10a37f',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="root"], textarea.ChatPrompt_textarea__K8YXz, #prompt-textarea, textarea[placeholder*="Send a message"], textarea[placeholder*="发送消息"], form textarea, div[role="textbox"], div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  claude: {
    id: 'claude',
    name: 'Claude',
    urls: ['claude.ai'],
    color: '#d97706',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: '.claude-textarea, textarea[placeholder*="Message Claude"], textarea[placeholder*="发送消息"], textarea[placeholder*="Send a message"], div[contenteditable="true"], div[role="textbox"], .ProseMirror, #prompt-textarea, textarea.Message_textarea__Pzef0, textarea.message-input',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bing: {
    id: 'bing',
    name: 'Bing',
    urls: ['www.bing.com/chat'],
    color: '#0078d4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bard: {
    id: 'bard',
    name: 'Bard',
    urls: ['bard.google.com'],
    color: '#4285f4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatglm: {
    id: 'chatglm',
    name: '智谱',
    urls: ['chatglm.cn'],
    color: '#1976d2',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  doubao: {
    id: 'doubao',
    name: '豆包',
    urls: ['www.doubao.com/chat', 'doubao.com/chat'],
    color: '#4caf50',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-testid="chat_input_input"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'textarea',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  yuanbao: {
    id: 'yuanbao',
    name: '元宝',
    urls: ['yuanbao.tencent.com'],
    color: '#00bcd4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  baidu: {
    id: 'baidu',
    name: '百度',
    urls: ['chat.baidu.com'],
    color: '#2196f3',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  metaso: {
    id: 'metaso',
    name: '秘塔',
    urls: ['metaso.cn'],
    color: '#9c27b0',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    urls: ['chat.openai.com', 'chatgpt.com'],
    color: '#10a37f',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="root"], textarea.ChatPrompt_textarea__K8YXz, #prompt-textarea, textarea[placeholder*="Send a message"], textarea[placeholder*="发送消息"], form textarea, div[role="textbox"], div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  claude: {
    id: 'claude',
    name: 'Claude',
    urls: ['claude.ai'],
    color: '#d97706',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: '.claude-textarea, textarea[placeholder*="Message Claude"], textarea[placeholder*="发送消息"], textarea[placeholder*="Send a message"], div[contenteditable="true"], div[role="textbox"], .ProseMirror, #prompt-textarea, textarea.Message_textarea__Pzef0, textarea.message-input',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bing: {
    id: 'bing',
    name: 'Bing',
    urls: ['www.bing.com/chat'],
    color: '#0078d4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bard: {
    id: 'bard',
    name: 'Bard',
    urls: ['bard.google.com'],
    color: '#4285f4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatglm: {
    id: 'chatglm',
    name: '智谱',
    urls: ['chatglm.cn'],
    color: '#1976d2',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  doubao: {
    id: 'doubao',
    name: '豆包',
    urls: ['www.doubao.com/chat', 'doubao.com/chat'],
    color: '#4caf50',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-testid="chat_input_input"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'textarea',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  yuanbao: {
    id: 'yuanbao',
    name: '元宝',
    urls: ['yuanbao.tencent.com'],
    color: '#00bcd4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  baidu: {
    id: 'baidu',
    name: '百度',
    urls: ['chat.baidu.com'],
    color: '#2196f3',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  metaso: {
    id: 'metaso',
    name: '秘塔',
    urls: ['metaso.cn'],
    color: '#9c27b0',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    urls: ['chat.openai.com', 'chatgpt.com'],
    color: '#10a37f',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="root"], textarea.ChatPrompt_textarea__K8YXz, #prompt-textarea, textarea[placeholder*="Send a message"], textarea[placeholder*="发送消息"], form textarea, div[role="textbox"], div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  claude: {
    id: 'claude',
    name: 'Claude',
    urls: ['claude.ai'],
    color: '#d97706',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: '.claude-textarea, textarea[placeholder*="Message Claude"], textarea[placeholder*="发送消息"], textarea[placeholder*="Send a message"], div[contenteditable="true"], div[role="textbox"], .ProseMirror, #prompt-textarea, textarea.Message_textarea__Pzef0, textarea.message-input',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bing: {
    id: 'bing',
    name: 'Bing',
    urls: ['www.bing.com/chat'],
    color: '#0078d4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  },
  
  bard: {
    id: 'bard',
    name: 'Bard',
    urls: ['bard.google.com'],
    color: '#4285f4',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  tongyi: {
    name: '通义千问',
    url: 'https://www.tongyi.com',  // 使用新域名
    id: 'tongyi',
    name: '通义',
    urls: ['tongyi.aliyun.com'],
    color: '#ff9800',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'textarea, input, [contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'mixed',
    maxAttempts: 15,
    waitTimeout: 1000
  }
};

// 获取所有平台列表
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

// 根据ID获取平台配置
function getPlatformById(id) {
  return PLATFORMS[id] || null;
}

// 根据URL检测平台
function detectPlatformByUrl(url) {
  for (const platform of Object.values(PLATFORMS)) {
    for (const platformUrl of platform.urls) {
      if (url.includes(platformUrl)) {
        return platform;
      }
    }
  }
  return null;
}

// 生成manifest.json的匹配规则
function generateManifestMatches() {
  const matches = new Set();
  
  Object.values(PLATFORMS).forEach(platform => {
    platform.urls.forEach(url => {
      matches.add(`https://${url}/*`);
    });
  });
  
  return Array.from(matches);
}

// 生成host_permissions
function generateHostPermissions() {
  return generateManifestMatches();
}

// 确保平台配置使用新域名
const platforms = {
  kimi: {
    name: 'Kimi',
    url: 'https://www.kimi.com',  // 使用新域名
    id: 'kimi',
    name: 'Kimi',
    urls: ['kimi.moonshot.cn'],
    color: '#6e48aa',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {
      input: 'div.chat-input-editor[contenteditable="true"]',
      submit: 'button[type="submit"]'
    },
    fillStrategy: 'contenteditable',
    maxAttempts: 30,
    waitTimeout: 1000
  },
  
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    urls: ['chat.deepseek.com'],
    color: '#009688',
    icon: '<circle cx="12" cy="12" r="10"/>',
    selectors: {