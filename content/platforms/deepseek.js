(function() {
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.deepseek = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fillQuestion' && message.platformId === 'deepseek') {
      fillDeepseekQuestion(message.question)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch(err => {
          sendResponse({ success: false, error: err.message });
        });
      return true; // 关键：异步必须 return true
    }
  });

  async function fillDeepseekQuestion(question) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      function tryFill() {
        const textarea = document.querySelector(
          'textarea[data-id="chat-input"], textarea[placeholder], textarea, div[contenteditable="true"]'
        );
        console.log("查找输入框结果：", textarea);
        if (textarea) {
          textarea.focus();
          let alreadyFilled = false;
          if (textarea.tagName.toLowerCase() === 'textarea') {
            alreadyFilled = textarea.value.trim() === question.trim();
            if (!alreadyFilled) {
              textarea.value = question;
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
          } else {
            alreadyFilled = textarea.innerText.trim() === question.trim();
            if (!alreadyFilled) {
              textarea.innerText = question;
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
          // 直接模拟回车键
          textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));

          // 新增：多次检测内容是否清空
          let checkCount = 0;
          const maxCheck = 10; // 检查次数增大为10
          function checkCleared() {
            let cleared = false;
            if (
              (textarea.tagName.toLowerCase() === 'textarea' && textarea.value === '') ||
              (textarea.getAttribute('contenteditable') === 'true' && textarea.innerText.trim() === '')
            ) {
              cleared = true;
            }
            if (cleared) {
              console.log("回车发送成功");
              resolve();
            } else if (checkCount < maxCheck) {
              checkCount++;
              setTimeout(checkCleared, 1000); // 检查间隔增大为1000ms
            } else {
              reject(new Error('回车发送失败，输入框内容未清空'));
            }
          }
          setTimeout(checkCleared, 1000); // 首次检查延迟也改为1000ms
        } else if (attempts < maxAttempts) {
          attempts++;
          console.warn(`DeepSeek未找到输入框，重试${attempts}/${maxAttempts}`);
          setTimeout(tryFill, 800);
        } else {
          reject(new Error('找不到DeepSeek输入框'));
        }
      }
      tryFill();
    });
  }
})();