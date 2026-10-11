const fs = require('fs');

function test() {
  const inputs = [
    '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}\n',
    '{\n  "jsonrpc": "2.0",\n  "method": "tools/call",\n  "params": {\n    "name": "dangerous_tool"\n  }\n}\n',
    'garbagetext{"a": 1}moregarbage[1,2,3]',
    '{"incomplete": ',
    '"value"}',
  ];
  
  let inputBuffer = "";
  const parsedMessages = [];

  function handleAiMessage(message, rawMessage) {
    parsedMessages.push(message);
  }

  for (const chunk of inputs) {
    inputBuffer += chunk;

    let i = 0;
    while (i < inputBuffer.length) {
      let startIdx = inputBuffer.indexOf('{', i);
      let startArr = inputBuffer.indexOf('[', i);
      
      if (startIdx === -1) startIdx = startArr;
      else if (startArr !== -1 && startArr < startIdx) startIdx = startArr;

      if (startIdx === -1) {
        inputBuffer = "";
        break;
      }

      let inString = false;
      let escape = false;
      let braces = 0;
      let foundEnd = false;

      for (let j = startIdx; j < inputBuffer.length; j++) {
        const char = inputBuffer[j];
        if (escape) {
          escape = false;
          continue;
        }
        if (char === '\\') {
          escape = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          continue;
        }

        if (!inString) {
          if (char === '{' || char === '[') {
            braces++;
          } else if (char === '}' || char === ']') {
            braces--;
            if (braces === 0) {
              const jsonStr = inputBuffer.substring(startIdx, j + 1);
              try {
                const message = JSON.parse(jsonStr);
                handleAiMessage(message, jsonStr);
              } catch (err) {
              }
              inputBuffer = inputBuffer.substring(j + 1);
              i = 0;
              foundEnd = true;
              break; 
            }
          }
        }
      }

      if (!foundEnd) {
        inputBuffer = inputBuffer.substring(startIdx);
        break; 
      }
    }
  }
  
  console.log(JSON.stringify(parsedMessages, null, 2));
}

test();
