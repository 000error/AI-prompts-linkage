// ChatGPT平台适配器
(function() {
  console.log("ChatGPT平台适配器已加载");
  
  // 设置标记，表示脚本已加载
  window._platformScriptInjected = window._platformScriptInjected || {};
  window._platformScriptInjected.chatgpt = true;
  
  // 监听来自后台脚本的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("ChatGPT收到消息:", message);
    
    if (message.action === 'ping') {
      // 检查DOM是否真正准备好
      const inputDiv = document.querySelector('#prompt-textarea, [data-id="root"] textarea, textarea[placeholder*="Message"]');
      const isReady = inputDiv && inputDiv.offsetParent !== null && !inputDiv.disabled;
      console.log('[ChatGPT] ping检查 - 输入框存在:', !!inputDiv, '可见:', inputDiv ? inputDiv.offsetParent !== null : false);
      sendResponse({ 
        status: isReady ? 'ready' : 'not_ready',
        inputFound: !!inputDiv,
        inputVisible: inputDiv ? inputDiv.offsetParent !== null : false
      });
      return;
    }
    
    if (message.action === 'fillQuestion' && message.platformId === 'chatgpt') {
      fillChatGPTQuestion(message.question)
        .then(() => {
          console.log("ChatGPT填充问题成功");
          sendResponse({ success: true });
        })
        .catch(error => {
          console.error("ChatGPT填充问题失败:", error);
          sendResponse({ success: false, error: error.message });
        });
      
      // 返回true表示将异步发送响应
      return true;
    }
  });
  
  // 填充问题到ChatGPT对话框
  async function fillChatGPTQuestion(question) {
    return new Promise((resolve, reject) => {
      try {
        // 等待页面加载完成
        const maxAttempts = 15;
        let attempts = 0;
        
        const checkAndFill = () => {
          console.log(`ChatGPT尝试填充，第${attempts + 1}次尝试`);
          
          // 查找输入框 - 支持多种可能的选择器
          const textareaSelectors = [
            'textarea[data-id="root"]', 
            'textarea.ChatPrompt_textarea__K8YXz', 
            '#prompt-textarea',
            'textarea[placeholder*="Send a message"]',
            'textarea[placeholder*="发送消息"]',
            'form textarea',
            'div[role="textbox"]',
            'div[contenteditable="true"]'
          ];
          
          let textarea = null;
          for (const selector of textareaSelectors) {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
              textarea = element;
              console.log(`找到ChatGPT输入框，使用选择器: ${selector}`);
              break;
            }
          }
          
          if (textarea) {
            // 确保输入框已聚焦
            textarea.focus();
            
            // 如果是contenteditable元素
            if (textarea.getAttribute('contenteditable') === 'true') {
              textarea.innerHTML = question;
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
              textarea.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
              // 如果是textarea或input元素
              textarea.value = question;
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
              textarea.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // 查找发送按钮
            const sendButtonSelectors = [
              'button[data-testid="send-button"]', 
              'button.ChatPrompt_sendButton__QF4Nt',
              'button[aria-label="Send message"]',
              'button[aria-label="发送消息"]',
              'form button[type="submit"]',
              'button.send-button'
            ];
            
            let sendButton = null;
            for (const selector of sendButtonSelectors) {
              const button = document.querySelector(selector);
              if (button && isElementVisible(button) && !button.disabled) {
                sendButton = button;
                console.log(`找到发送按钮，使用选择器: ${selector}`);
                break;
              }
            }
            
            // 如果找不到发送按钮，尝试查找包含纸飞机图标的按钮
            if (!sendButton) {
              const buttons = document.querySelectorAll('button');
              for (const button of buttons) {
                if (isElementVisible(button) && !button.disabled && 
                    (button.innerHTML.includes('svg') || 
                     button.innerHTML.toLowerCase().includes('send'))) {
                  sendButton = button;
                  console.log('找到发送按钮，通过内容识别');
                  break;
                }
              }
            }
            
            if (sendButton && !sendButton.disabled) {
              console.log("找到发送按钮，点击发送");
              // 点击发送按钮
              sendButton.click();
              resolve();
            } else {
              console.log("找不到发送按钮或按钮被禁用，尝试使用回车键发送");
              
              // 尝试使用回车键发送
              const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
              });
              
              textarea.dispatchEvent(enterEvent);
              
              // 检查是否发送成功
              setTimeout(() => {
                if (textarea.value === '' || 
                    (textarea.getAttribute('contenteditable') === 'true' && textarea.innerHTML === '')) {
                  console.log("使用回车键发送成功");
                  resolve();
                } else {
                  console.error("无法发送ChatGPT消息");
                  reject(new Error('无法发送ChatGPT消息，请手动发送'));
                }
              }, 1000);
            }
          } else if (attempts < maxAttempts) {
            // 如果没有找到输入框，等待一段时间后重试
            attempts++;
            console.log(`未找到ChatGPT输入框，重试 ${attempts}/${maxAttempts}`);
            setTimeout(checkAndFill, 1000);
          } else {
            // 记录页面结构，帮助调试
            console.error("找不到ChatGPT输入框，页面URL:", window.location.href);
            console.error("页面标题:", document.title);
            
            // 尝试记录页面上所有可能的输入元素
            const allTextareas = document.querySelectorAll('textarea');
            const allContentEditables = document.querySelectorAll('[contenteditable="true"]');
            const allTextboxes = document.querySelectorAll('[role="textbox"]');
            
            console.error("页面上的textarea元素数量:", allTextareas.length);
            console.error("页面上的contenteditable元素数量:", allContentEditables.length);
            console.error("页面上的textbox元素数量:", allTextboxes.length);
            
            reject(new Error('找不到ChatGPT输入框'));
          }
        };
        
        // 检查元素是否可见
        function isElementVisible(element) {
          if (!element) return false;
          
          const style = window.getComputedStyle(element);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 style.opacity !== '0' &&
                 element.offsetWidth > 0 &&
                 element.offsetHeight > 0;
        }
        
        checkAndFill();
      } catch (error) {
        console.error("填充ChatGPT问题时出错:", error);
        reject(error);
      }
    });
  }
  
  console.log("ChatGPT平台适配器初始化完成");
})();