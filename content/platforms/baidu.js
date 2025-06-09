(function() {
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.baidu = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ping') {
      // 检查DOM是否真正准备好
      const inputDiv = document.querySelector('#chat-input-box');
      const isReady = inputDiv && inputDiv.offsetParent !== null && !inputDiv.disabled;
      console.log('[Baidu] ping检查 - 输入框存在:', !!inputDiv, '可见:', inputDiv ? inputDiv.offsetParent !== null : false);
      sendResponse({ 
        status: isReady ? 'ready' : 'not_ready',
        inputFound: !!inputDiv,
        inputVisible: inputDiv ? inputDiv.offsetParent !== null : false
      });
      return;
    }
    
    if (message.action === 'fillQuestion' && message.platformId === 'baidu') {
      fillBaiduQuestion(message.question)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });

  async function fillBaiduQuestion(question) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      function tryFill() {
        // --- 使用更精确的 selector (ID) ---
        const input = document.querySelector('#chat-input-box');
        // --- 修改结束 ---
        if (input) {
          input.focus();
          // --- 现有逻辑已能处理 contenteditable ---
          if ('value' in input) {
            input.value = '';
            input.value = question;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          } else { // 处理 contenteditable div
            input.innerText = '';
            input.innerText = question;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          // --- 修改结束 ---
          setTimeout(() => {
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
            resolve();
          }, 100);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryFill, 800);
        } else {
          reject(new Error('找不到百度输入框'));
        }
      }
      tryFill();
    });
  }
})();