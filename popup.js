document.addEventListener('DOMContentLoaded', function() {
  // 读取当前开关状态
  chrome.storage.sync.get({ autoShowUI: true }, (data) => {
    document.getElementById('auto-show-ui-switch-popup').checked = data.autoShowUI;
  });

  // 绑定切换事件
  document.getElementById('auto-show-ui-switch-popup').addEventListener('change', (e) => {
    chrome.storage.sync.set({ autoShowUI: e.target.checked });
  });
});

// 确保平台URL配置正确
const PLATFORM_URLS = {
  chatgpt: 'https://chat.openai.com',
  claude: 'https://claude.ai', 
  kimi: 'https://www.kimi.com',  // 确保使用新域名
  deepseek: 'https://chat.deepseek.com',
  tongyi: 'https://www.tongyi.com',  // 确保使用新域名
  baidu: 'https://yiyan.baidu.com',
  bing: 'https://www.bing.com/chat',
  bard: 'https://gemini.google.com',
  chatglm: 'https://chatglm.cn',
  doubao: 'https://www.doubao.com',
  metaso: 'https://metaso.cn',
  yuanbao: 'https://yuanbao.tencent.com'
};