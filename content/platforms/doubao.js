(function() {
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.doubao = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fillQuestion' && message.platformId === 'doubao') {
      console.log('[Doubao] Received fillQuestion request:', message.question); // 日志：收到请求
      fillDoubaoQuestion(message.question)
        .then(() => {
          console.log('[Doubao] fillDoubaoQuestion resolved successfully.'); // 日志：Promise 成功解决
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error('[Doubao] fillDoubaoQuestion rejected:', error); // 日志：Promise 被拒绝
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开启以进行异步响应
    }
  });

  async function fillDoubaoQuestion(question) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      const retryDelay = 500;

      function tryFill() {
        console.log(`[Doubao] Attempt ${attempts + 1}/${maxAttempts}: Finding input field...`); // 日志：尝试查找输入框
        // --- 使用确认过的选择器 ---
        const inputSelector = 'textarea[data-testid="chat_input_input"]';
        const input = document.querySelector(inputSelector);
        console.log(`[Doubao] Input found (${inputSelector}): ${!!input}`); // 日志：是否找到输入框

        if (input) {
          console.log('[Doubao] Input field found. Proceeding to fill.'); // 日志：找到输入框，准备填充
          input.focus();
          // --- 强制清空并设置值 ---
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.value = question;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('[Doubao] Input value set to:', input.value); // 日志：确认设置的值

          // --- 豆包通常需要模拟回车发送 ---
          setTimeout(() => {
            console.log('[Doubao] Attempting to simulate Enter key press.'); // 日志：尝试模拟回车
            try {
                const commonEventProps = { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true, shiftKey: false, keyCode: 13, which: 13 };
                input.dispatchEvent(new KeyboardEvent('keydown', { ...commonEventProps, charCode: 0 }));
                input.dispatchEvent(new KeyboardEvent('keypress', { ...commonEventProps, charCode: 13 }));
                input.dispatchEvent(new KeyboardEvent('keyup', { ...commonEventProps, charCode: 0 }));
                console.log('[Doubao] Enter key simulation finished.'); // 日志：模拟回车结束
            } catch (e) {
                console.error('[Doubao] Error dispatching keyboard event:', e); // 日志：模拟事件出错
            }
            resolve(); // 无论模拟是否真的触发发送，都先 resolve
          }, 200);
        } else if (attempts < maxAttempts - 1) {
          attempts++;
          console.log(`[Doubao] Input not found. Retrying in ${retryDelay}ms...`); // 日志：未找到，重试
          setTimeout(tryFill, retryDelay);
        } else {
          console.error('[Doubao] Input field not found after multiple attempts.'); // 日志：多次尝试后仍未找到
          reject(new Error('找不到豆包输入框')); // 明确拒绝 Promise
        }
      }
      tryFill();
    });
  }
})();