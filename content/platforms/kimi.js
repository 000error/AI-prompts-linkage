(function() {
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.kimi = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Kimi内容脚本收到消息：", message);
    
    if (message.action === 'ping') {
      sendResponse({ status: 'ready' });
      return;
    }
    
    if (message.action === 'fillQuestion') {
      fillKimiQuestion(message.question)
        .then(() => {
          console.log("Kimi问题填充成功");
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error("Kimi填充失败：", error);
          sendResponse({ success: false, error: error.message });
        });
      return true;
    }
  });

  async function fillKimiQuestion(question) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      function tryFill() {
        const inputDiv = document.querySelector(
          'div.chat-input-editor[contenteditable="true"]'
        );
        console.log("查找输入框结果：", inputDiv);
        if (inputDiv) {
          inputDiv.focus();
          // 彻底清空内容
          inputDiv.innerHTML = '<p><br></p>';
          setTimeout(() => {
            // 再次确认内容已清空
            inputDiv.innerHTML = '<p><br></p>';
            // 使用 Selection/Range 插入文本，模拟真实输入
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(inputDiv);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            // 插入文本
            document.execCommand('insertText', false, question);

            // 触发 input 事件
            inputDiv.dispatchEvent(new Event('input', { bubbles: true }));

            // 模拟回车发送
            setTimeout(() => {
              inputDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
              inputDiv.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));

              setTimeout(() => {
                if (
                  inputDiv.innerText.trim() === '' ||
                  inputDiv.innerHTML === '<p><br></p>'
                ) {
                  console.log("回车发送成功");
                  resolve();
                } else {
                  reject(new Error('回车发送失败，输入框内容未清空'));
                }
              }, 800);
            }, 100); // 给输入框内容插入和事件触发一点缓冲时间
          }, 100); // 清空内容后等待 DOM 更新
        } else if (attempts < maxAttempts) {
          attempts++;
          console.warn(`Kimi未找到输入框，重试${attempts}/${maxAttempts}`);
          setTimeout(tryFill, 800);
        } else {
          reject(new Error('找不到Kimi输入框'));
        }
      }
      tryFill();
    });
  }
})();