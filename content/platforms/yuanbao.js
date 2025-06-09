(function() {
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.yuanbao = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ping') {
      // 检查DOM是否真正准备好
      const inputDiv = document.querySelector('div.ql-editor[contenteditable="true"]');
      const isReady = inputDiv && inputDiv.offsetParent !== null && !inputDiv.disabled;
      console.log('[Yuanbao] ping检查 - 输入框存在:', !!inputDiv, '可见:', inputDiv ? inputDiv.offsetParent !== null : false);
      sendResponse({ 
        status: isReady ? 'ready' : 'not_ready',
        inputFound: !!inputDiv,
        inputVisible: inputDiv ? inputDiv.offsetParent !== null : false
      });
      return;
    }
    
    if (message.action === 'fillQuestion' && message.platformId === 'yuanbao') {
      console.log('[Yuanbao] Received fillQuestion request:', message.question); // 新增日志
      fillYuanbaoQuestion(message.question)
        .then(() => {
          console.log('[Yuanbao] fillYuanbaoQuestion resolved successfully.'); // 新增日志
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error('[Yuanbao] fillYuanbaoQuestion rejected:', error); // 新增日志
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开启以进行异步响应
    }
  });

  async function fillYuanbaoQuestion(question) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      const retryDelay = 500; // 新增：定义重试延迟

      function tryFill() {
        console.log(`[Yuanbao] Attempt ${attempts + 1}/${maxAttempts}: Finding input field...`); // 新增日志
        // --- 使用元宝特定的选择器 ---
        const inputSelector = 'div.ql-editor[contenteditable="true"]';
        const input = document.querySelector(inputSelector);
        console.log(`[Yuanbao] Input found (${inputSelector}): ${!!input}`); // 新增日志

        if (input) {
          console.log('[Yuanbao] Input field found. Proceeding to fill.'); // 新增日志
          input.focus();

          // --- 处理 contenteditable div ---
          // 1. 清空内容：直接设置 innerText 或 innerHTML 可能不够，有时需要清空内部的 <p>
          const pElement = input.querySelector('p');
          if (pElement) {
            pElement.innerHTML = ''; // 清空 <p> 标签内部
          } else {
            input.innerHTML = ''; // 如果没有 <p>，尝试清空整个 div
          }
          input.dispatchEvent(new Event('input', { bubbles: true })); // 触发 input 事件

          // 2. 填充内容：通常设置 innerText 即可，但有时需要放入 <p> 标签
          if (pElement) {
             pElement.innerText = question;
          } else {
             // 如果没有 <p>，创建一个并插入 (或者直接设置 input.innerText)
             // 为了简单起见，先尝试直接设置 innerText
             input.innerText = question;
          }
          input.dispatchEvent(new Event('input', { bubbles: true })); // 再次触发 input 事件
          console.log('[Yuanbao] Input content set.'); // 新增日志

          // --- 模拟回车发送 ---
          // 元宝可能需要点击发送按钮，而不是模拟回车
          // 查找可能的发送按钮
          const sendButton = document.querySelector('button[data-track-id="chat_send_button"]'); // 这是一个猜测的选择器，需要验证
          if (sendButton) {
             console.log('[Yuanbao] Found send button. Clicking...'); // 新增日志
             sendButton.click();
             resolve();
          } else {
             console.warn('[Yuanbao] Send button not found. Attempting Enter key simulation.'); // 新增日志
             // 如果找不到按钮，尝试模拟回车 (作为备选方案)
             setTimeout(() => {
               try {
                 const commonEventProps = { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true, shiftKey: false, keyCode: 13, which: 13 };
                 input.dispatchEvent(new KeyboardEvent('keydown', { ...commonEventProps, charCode: 0 }));
                 // 对于 contenteditable，keypress 可能不是必须的
                 // input.dispatchEvent(new KeyboardEvent('keypress', { ...commonEventProps, charCode: 13 }));
                 input.dispatchEvent(new KeyboardEvent('keyup', { ...commonEventProps, charCode: 0 }));
                 console.log('[Yuanbao] Enter key simulation finished.'); // 新增日志
               } catch (e) {
                 console.error('[Yuanbao] Error dispatching keyboard event:', e); // 新增日志
               }
               resolve(); // 无论模拟是否真的触发发送，都先 resolve
             }, 200); // 增加一点延迟
          }
        } else if (attempts < maxAttempts - 1) { // 修改：确保在最后一次尝试前重试
          attempts++;
          console.log(`[Yuanbao] Input not found. Retrying in ${retryDelay}ms...`); // 新增日志
          setTimeout(tryFill, retryDelay); // 使用定义的延迟
        } else {
          console.error('[Yuanbao] Input field not found after multiple attempts.'); // 新增日志
          reject(new Error('找不到元宝输入框'));
        }
      }
      tryFill();
    });
  }
})();