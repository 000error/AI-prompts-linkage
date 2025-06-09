// Claude平台适配器
(function() {
  console.log("Claude平台适配器已加载");
  
  // 设置标记，表示脚本已加载
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.claude = true;
  
  // 监听来自后台脚本的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Claude收到消息:", message);
    
    if (message.action === 'ping') {
      // 检查DOM是否真正准备好
      const inputDiv = document.querySelector('div[contenteditable="true"][data-testid="basic-text-input"], div[contenteditable="true"]');
      const isReady = inputDiv && inputDiv.offsetParent !== null && !inputDiv.disabled;
      console.log('[Claude] ping检查 - 输入框存在:', !!inputDiv, '可见:', inputDiv ? inputDiv.offsetParent !== null : false);
      sendResponse({ 
        status: isReady ? 'ready' : 'not_ready',
        inputFound: !!inputDiv,
        inputVisible: inputDiv ? inputDiv.offsetParent !== null : false
      });
      return;
    }
    
    if (message.action === 'fillQuestion' && message.platformId === 'claude') {
      fillClaudeQuestion(message.question)
        .then(() => {
          console.log("Claude填充问题成功");
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error("Claude填充问题失败:", error);
          sendResponse({ success: false, error: error.message });
        });
      
      // 返回true表示将异步发送响应
      return true;
    }
  });
  
  // 填充问题到Claude对话框
  async function fillClaudeQuestion(question) {
    return new Promise((resolve, reject) => {
      try {
        // 等待页面加载完成
        const maxAttempts = 15;
        let attempts = 0;
        
        const checkAndFill = () => {
          // 尝试多种可能的选择器
          // Claude的输入框选择器可能会变化，所以我们尝试多种可能的选择器
          const inputSelectors = [
            '.claude-textarea', 
            'textarea[placeholder*="Message Claude"]',
            'textarea[placeholder*="发送消息"]',
            'textarea[placeholder*="Send a message"]',
            'div[contenteditable="true"]',
            'div[role="textbox"]',
            '.ProseMirror',
            '#prompt-textarea',
            'textarea.Message_textarea__Pzef0',
            'textarea.message-input'
          ];
          
          // 尝试所有可能的选择器
          let inputElement = null;
          for (const selector of inputSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              inputElement = element;
              console.log(`找到Claude输入框，使用选择器: ${selector}`);
              break;
            }
          }
          
          if (inputElement) {
            // 如果是contenteditable元素
            if (inputElement.getAttribute('contenteditable') === 'true') {
              inputElement.innerHTML = question;
              inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
              // 如果是textarea或input元素
              inputElement.value = question;
              inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
            
            // 查找发送按钮
            const sendButtonSelectors = [
              'button[aria-label="Send message"]',
              'button[aria-label="发送消息"]',
              'button.send-button',
              'button.Message_sendButton__QYYpv',
              'button[type="submit"]',
              'button.primary',
              'button.submit',
              'button svg[data-icon="paper-plane"]',
              'button.Message_sendButton__QYYpv'
            ];
            
            let sendButton = null;
            for (const selector of sendButtonSelectors) {
              const button = document.querySelector(selector);
              if (button && !button.disabled) {
                sendButton = button;
                console.log(`找到Claude发送按钮，使用选择器: ${selector}`);
                break;
              }
            }
            
            // 如果找不到发送按钮，尝试查找包含纸飞机图标的按钮
            if (!sendButton) {
              const buttons = document.querySelectorAll('button');
              for (const button of buttons) {
                if (button.innerHTML.includes('svg') && 
                    (button.innerHTML.toLowerCase().includes('send') || 
                     button.innerHTML.toLowerCase().includes('paper-plane'))) {
                  sendButton = button;
                  console.log('找到Claude发送按钮，通过SVG图标识别');
                  break;
                }
              }
            }
            
            if (sendButton) {
              console.log("点击Claude发送按钮");
              sendButton.click();
              resolve();
            } else {
              console.error("找不到Claude发送按钮或按钮被禁用");
              
              // 尝试模拟回车键发送
              console.log("尝试使用回车键发送消息");
              const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
              });
              
              inputElement.dispatchEvent(enterEvent);
              
              // 延迟一下再检查是否发送成功
              setTimeout(() => {
                // 如果输入框已清空，说明发送成功
                if ((inputElement.value === '' && !inputElement.getAttribute('contenteditable')) || 
                    (inputElement.getAttribute('contenteditable') === 'true' && inputElement.innerHTML === '')) {
                  console.log("使用回车键发送成功");
                  resolve();
                } else {
                  reject(new Error('找不到Claude发送按钮，且回车键发送失败'));
                }
              }, 500);
            }
          } else if (attempts < maxAttempts) {
            // 如果没有找到输入框，等待一段时间后重试
            attempts++;
            console.log(`未找到Claude输入框，重试 ${attempts}/${maxAttempts}`);
            setTimeout(checkAndFill, 1000);
          } else {
            // 记录页面结构，帮助调试
            console.error("找不到Claude输入框，页面结构:", document.body.innerHTML);
            reject(new Error('找不到Claude输入框'));
          }
        };
        
        checkAndFill();
      } catch (error) {
        console.error("填充Claude问题时出错:", error);
        reject(error);
      }
    });
  }
  
  console.log("Claude平台适配器初始化完成");
})();