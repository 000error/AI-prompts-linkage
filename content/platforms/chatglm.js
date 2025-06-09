(function() {
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.chatglm = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fillQuestion' && message.platformId === 'chatglm') {
      fillChatglmQuestion(message.question)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });

  async function fillChatglmQuestion(question) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      const retryDelay = 500;

      function tryFill() {
        console.log(`[ChatGLM] Attempt ${attempts + 1}/${maxAttempts}: Finding input field...`);
        const inputSelector = 'textarea.scroll-display-none';
        const input = document.querySelector(inputSelector);
        console.log(`[ChatGLM] Input found (${inputSelector}): ${!!input}`);

        // --- 移除查找发送按钮的逻辑 ---
        // const sendButtonSelector = ...
        // const sendButton = ...
        // console.log(`[ChatGLM] Send button found ...`);
        // --- 修改结束 ---

        if (input) {
          console.log('[ChatGLM] Input field found. Proceeding to fill.');
          input.focus();
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.value = question;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('[ChatGLM] Input value set to:', input.value);

          setTimeout(() => {
            // --- 改回模拟回车键发送 ---
            console.log('[ChatGLM] Attempting to simulate Enter key press on:', input);
            try {
                // 确保没有按下 Shift 键，因为 Shift+Enter 通常是换行
                const commonEventProps = {
                    key: 'Enter',
                    code: 'Enter',
                    bubbles: true,
                    cancelable: true, // 允许事件被取消
                    shiftKey: false,
                    keyCode: 13,
                    which: 13
                };

                console.log('[ChatGLM] Dispatching keydown...');
                input.dispatchEvent(new KeyboardEvent('keydown', { ...commonEventProps, charCode: 0 }));
                console.log('[ChatGLM] Dispatching keypress...'); // 添加 keypress 事件
                input.dispatchEvent(new KeyboardEvent('keypress', { ...commonEventProps, charCode: 13 }));
                console.log('[ChatGLM] Dispatching keyup...');
                input.dispatchEvent(new KeyboardEvent('keyup', { ...commonEventProps, charCode: 0 }));
                console.log('[ChatGLM] Enter key simulation finished.');
            } catch (e) {
                console.error('[ChatGLM] Error dispatching keyboard event:', e);
            }
            resolve(); // 无论模拟是否真的触发发送，都先 resolve
            // --- 修改结束 ---
          }, 300); // 保持一点延迟
        } else if (attempts < maxAttempts -1) {
          attempts++;
          console.log(`[ChatGLM] Input not found. Retrying in ${retryDelay}ms...`);
          setTimeout(tryFill, retryDelay);
        } else {
          console.error('[ChatGLM] Input field not found after multiple attempts.');
          reject(new Error('找不到智谱输入框'));
        }
      }
      tryFill();
    });
  }
})();