(function() {
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.tongyi = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fillQuestion' && message.platformId === 'tongyi') {
      fillTongyiQuestion(message.question)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });

  async function fillTongyiQuestion(question) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      function tryFill() {
        // --- 使用更精确的 selector (选择包含特定 class 的 textarea) ---
        const input = document.querySelector('textarea.ant-input');
        // --- 修改结束 ---
        if (input) {
          input.focus();
          if ('value' in input) {
            input.value = '';
            input.value = question;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            input.innerText = '';
            input.innerText = question;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          setTimeout(() => {
            // 模拟回车发送
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
            resolve();
          }, 100);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryFill, 800);
        } else {
          reject(new Error('找不到通义输入框'));
        }
      }
      tryFill();
    });
  }
})();