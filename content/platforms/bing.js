// Bing Chat平台适配器
(function() {
  // 监听来自后台脚本的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fillQuestion' && message.platformId === 'bing') {
      fillBingQuestion(message.question)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      
      // 返回true表示将异步发送响应
      return true;
    }
  });
  
  // 填充问题到Bing Chat对话框
  async function fillBingQuestion(question) {
    return new Promise((resolve, reject) => {
      try {
        // 等待页面加载完成
        const maxAttempts = 10;
        let attempts = 0;
        
        const checkAndFill = () => {
          // 查找输入框 (Bing Chat的选择器可能需要根据实际情况调整)
          const textarea = document.querySelector('textarea#searchbox');
          
          if (textarea) {
            // 填充问题
            textarea.value = question;
            
            // 触发输入事件，让Bing Chat知道输入框已更新
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            // 查找发送按钮
            const sendButton = document.querySelector('button#send-button');
            
            if (sendButton && !sendButton.disabled) {
              // 点击发送按钮
              sendButton.click();
              resolve();
            } else {
              reject(new Error('找不到Bing Chat发送按钮或按钮被禁用'));
            }
          } else if (attempts < maxAttempts) {
            // 如果没有找到输入框，等待一段时间后重试
            attempts++;
            setTimeout(checkAndFill, 1000);
          } else {
            reject(new Error('找不到Bing Chat输入框'));
          }
        };
        
        checkAndFill();
      } catch (error) {
        reject(error);
      }
    });
  }
})();