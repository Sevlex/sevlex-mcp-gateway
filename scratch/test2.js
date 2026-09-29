const inputBufferArray = [
  '{"a": "\\""}'
];

let inputBuffer = "";

for (const chunk of inputBufferArray) {
  inputBuffer += chunk;
  console.log("Processing:", chunk);

  let i = 0;
  while (i < inputBuffer.length) {
    let startIdx = inputBuffer.indexOf('{', i);
    let startArr = inputBuffer.indexOf('[', i);
    
    if (startIdx === -1) {
      startIdx = startArr;
    } else if (startArr !== -1 && startArr < startIdx) {
      startIdx = startArr;
    }

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
              console.log("Parsed:", message);
            } catch (err) {
              console.log("Invalid JSON:", jsonStr);
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
      console.log("Waiting for more data...");
      inputBuffer = inputBuffer.substring(startIdx);
      break; 
    }
  }
}
