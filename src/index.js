const remSize = parseInt(getComputedStyle(document.documentElement).fontSize);
const gamePanel = document.getElementById("gamePanel");
const playPanel = document.getElementById("playPanel");
const infoPanel = document.getElementById("infoPanel");
const countPanel = document.getElementById("countPanel");
const scorePanel = document.getElementById("scorePanel");
const aaOuter = document.getElementById("aaOuter");
const startButton = document.getElementById("startButton");
const romaNode = document.getElementById("roma");
const gradeOption = document.getElementById("gradeOption");
const aa = document.getElementById("aa");
const tmpCanvas = document.createElement("canvas");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const gameTime = 60;
let playing;
let countdowning;
let typeTimer;
// https://dova-s.jp/bgm/play14822.html
const bgm = new Audio("mp3/bgm.mp3");
bgm.volume = 0.3;
bgm.loop = true;
let typeIndex = 0;
let errorCount = 0;
let normalCount = 0;
let solveCount = 0;
let englishVoices = [];
let guide = true;
let keyboardAudio, correctAudio, incorrectAudio, endAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const layout109 = {
  "default": [
    "q w e r t y u i o p",
    "a s d f g h j k l ;",
    "z x c v b n m , .",
  ],
  "shift": [
    "Q W E R T Y U I O P",
    "A S D F G H J K L +",
    "Z X C V B N M < >",
  ],
};
const simpleKeyboard = new SimpleKeyboard.default({
  layout: layout109,
  onKeyPress: (input) => {
    typeEventKey(input);
  },
});
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
  if (localStorage.getItem("bgm") != 1) {
    document.getElementById("bgmOn").classList.add("d-none");
    document.getElementById("bgmOff").classList.remove("d-none");
  }
}

function toggleBGM() {
  if (localStorage.getItem("bgm") == 1) {
    document.getElementById("bgmOn").classList.add("d-none");
    document.getElementById("bgmOff").classList.remove("d-none");
    localStorage.setItem("bgm", 0);
    bgm.pause();
  } else {
    document.getElementById("bgmOn").classList.remove("d-none");
    document.getElementById("bgmOff").classList.add("d-none");
    localStorage.setItem("bgm", 1);
    bgm.play();
  }
}

function toggleKeyboard() {
  const virtualKeyboardOn = document.getElementById("virtualKeyboardOn");
  const virtualKeyboardOff = document.getElementById("virtualKeyboardOff");
  if (virtualKeyboardOn.classList.contains("d-none")) {
    virtualKeyboardOn.classList.remove("d-none");
    virtualKeyboardOff.classList.add("d-none");
    document.getElementById("keyboard").classList.remove("d-none");
    resizeFontSize(aa);
  } else {
    virtualKeyboardOn.classList.add("d-none");
    virtualKeyboardOff.classList.remove("d-none");
    document.getElementById("keyboard").classList.add("d-none");
    document.getElementById("guideSwitch").checked = false;
    guide = false;
    resizeFontSize(aa);
  }
}

function toggleGuide() {
  if (this.checked) {
    guide = true;
  } else {
    guide = false;
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio("mp3/keyboard.mp3"),
    loadAudio("mp3/correct.mp3"),
    loadAudio("mp3/cat.mp3"),
    loadAudio("mp3/end.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    keyboardAudio = audioBuffers[0];
    correctAudio = audioBuffers[1];
    incorrectAudio = audioBuffers[2];
    endAudio = audioBuffers[3];
  });
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", () => {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  const jokeVoices = [
    // "com.apple.eloquence.en-US.Flo",
    "com.apple.speech.synthesis.voice.Bahh",
    "com.apple.speech.synthesis.voice.Albert",
    // "com.apple.speech.synthesis.voice.Fred",
    "com.apple.speech.synthesis.voice.Hysterical",
    "com.apple.speech.synthesis.voice.Organ",
    "com.apple.speech.synthesis.voice.Cellos",
    "com.apple.speech.synthesis.voice.Zarvox",
    // "com.apple.eloquence.en-US.Rocko",
    // "com.apple.eloquence.en-US.Shelley",
    // "com.apple.speech.synthesis.voice.Princess",
    // "com.apple.eloquence.en-US.Grandma",
    // "com.apple.eloquence.en-US.Eddy",
    "com.apple.speech.synthesis.voice.Bells",
    // "com.apple.eloquence.en-US.Grandpa",
    "com.apple.speech.synthesis.voice.Trinoids",
    // "com.apple.speech.synthesis.voice.Kathy",
    // "com.apple.eloquence.en-US.Reed",
    "com.apple.speech.synthesis.voice.Boing",
    "com.apple.speech.synthesis.voice.Whisper",
    "com.apple.speech.synthesis.voice.Deranged",
    "com.apple.speech.synthesis.voice.GoodNews",
    "com.apple.speech.synthesis.voice.BadNews",
    "com.apple.speech.synthesis.voice.Bubbles",
    // "com.apple.voice.compact.en-US.Samantha",
    // "com.apple.eloquence.en-US.Sandy",
    // "com.apple.speech.synthesis.voice.Junior",
    // "com.apple.speech.synthesis.voice.Ralph",
  ];
  allVoicesObtained.then((voices) => {
    englishVoices = voices
      .filter((voice) => voice.lang == "en-US")
      .filter((voice) => !jokeVoices.includes(voice.voiceURI));
  });
}
loadVoices();

function loopVoice(text, n) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = "en-US";
  for (let i = 0; i < n; i++) {
    speechSynthesis.speak(msg);
  }
}

function typeNormal(currNode) {
  currNode.style.visibility = "visible";
  playAudio(keyboardAudio);
  currNode.style.color = "silver";
  typeIndex += 1;
  normalCount += 1;
}

function underlineSpace(currNode) {
  if (currNode.textContent == " ") {
    currNode.style.removeProperty("text-decoration");
  }
  const nextNode = currNode.nextElementSibling;
  if (nextNode && nextNode.textContent == " ") {
    nextNode.style.textDecoration = "underline";
  }
}

function nextProblem() {
  playAudio(correctAudio);
  typeIndex = 0;
  solveCount += 1;
  typable();
}

function removeGuide(currNode) {
  const prevNode = currNode.previousSiblingElement;
  if (prevNode) {
    let key = prevNode.textContent;
    if (gradeOption.selectedIndex == 0) {
      key = key.toUpperCase();
    } else {
      key = key.toLowerCase();
    }
    const button = simpleKeyboard.getButtonElement(key);
    button.classList.remove("bg-info");
  }
  let key = currNode.textContent;
  if (gradeOption.selectedIndex == 1) {
    key = key.toUpperCase();
  } else {
    key = key.toLowerCase();
  }
  if (key == " ") key = "{space}";
  const button = simpleKeyboard.getButtonElement(key);
  if (button) {
    button.classList.remove("bg-info");
  }
}

function showGuide(currNode) {
  if (guide) {
    let key = currNode.textContent;
    if (gradeOption.selectedIndex == 1) {
      key = key.toUpperCase();
    } else {
      key = key.toLowerCase();
    }
    const button = simpleKeyboard.getButtonElement(key);
    if (button) {
      button.classList.add("bg-info");
    }
  }
}

function typeEvent(event) {
  switch (event.code) {
    case "Space":
      event.preventDefault();
      // falls through
    default:
      return typeEventKey(event.key);
  }
}

function typeEventKey(key) {
  switch (key) {
    case "Escape":
      replay();
      return;
    case " ":
      if (!playing) {
        replay();
        return;
      }
  }
  const currNode = romaNode.childNodes[typeIndex];
  if (/^[^0-9]$/.test(key)) {
    if (key.toLowerCase() == currNode.textContent.toLowerCase()) {
      typeNormal(currNode);
      removeGuide(currNode);
      underlineSpace(currNode);
    } else {
      // const state = checkTypeStyle(currNode, currNode.textContent, event.key, romaNode);
      // if (!state) {
      //   playAudio(incorrectAudio, 0.3);
      //   errorCount += 1;
      // }
      playAudio(incorrectAudio, 0.3);
      errorCount += 1;
    }
    if (typeIndex == romaNode.childNodes.length) {
      nextProblem();
    } else {
      showGuide(romaNode.childNodes[typeIndex]);
    }
  }
}

function resizeFontSize(node) {
  // https://stackoverflow.com/questions/118241/
  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    // const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = tmpCanvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  function getTextRect(text, fontSize, font, lineHeight) {
    const lines = text.split("\n");
    const fontConfig = fontSize + "px " + font;
    let maxWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      const width = getTextWidth(lines[i], fontConfig);
      if (maxWidth < width) {
        maxWidth = width;
      }
    }
    return [maxWidth, fontSize * lines.length * lineHeight];
  }
  function getPaddingRect(style) {
    const width = parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight);
    const height = parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom);
    return [width, height];
  }
  const style = getComputedStyle(node);
  const font = style.fontFamily;
  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight) / fontSize;
  const nodeHeight = aaOuter.offsetHeight;
  const nodeWidth = infoPanel.clientWidth;
  const nodeRect = [nodeWidth, nodeHeight];
  const textRect = getTextRect(node.textContent, fontSize, font, lineHeight);
  const paddingRect = getPaddingRect(style);

  // https://stackoverflow.com/questions/46653569/
  // Safariで正確な算出ができないので誤差ぶんだけ縮小化 (10%)
  const rowFontSize = fontSize * (nodeRect[0] - paddingRect[0]) / textRect[0] *
    0.90;
  const colFontSize = fontSize * (nodeRect[1] - paddingRect[1]) / textRect[1] *
    0.90;
  if (colFontSize < rowFontSize) {
    if (colFontSize < remSize) {
      node.style.fontSize = remSize + "px";
    } else {
      node.style.fontSize = colFontSize + "px";
    }
  } else {
    if (rowFontSize < remSize) {
      node.style.fontSize = remSize + "px";
    } else {
      node.style.fontSize = rowFontSize + "px";
    }
  }
}

function typable() {
  let problem;
  if (gradeOption.selectedIndex >= 2) {
    problem = alphabet[solveCount];
  } else {
    problem = alphabet[solveCount];
  }
  if (solveCount >= 26) {
    speechSynthesis.cancel();
    clearInterval(typeTimer);
    bgm.pause();
    playAudio(endAudio);
    scoring();
  } else {
    aa.textContent = problem + " " + problem.toLowerCase();
    const roma = problem;
    loopVoice(roma.toLowerCase(), 10);
    while (romaNode.firstChild) {
      romaNode.removeChild(romaNode.firstChild);
    }
    for (let i = 0; i < roma.length; i++) {
      const span = document.createElement("span");
      span.textContent = roma[i];
      romaNode.appendChild(span);
    }
    resizeFontSize(aa);
    showGuide(romaNode.childNodes[0]);
  }
}

function countdown() {
  if (countdowning) return;
  countdowning = true;
  typeIndex =
    normalCount =
    errorCount =
    solveCount =
      0;
  document.getElementById("guideSwitch").disabled = true;
  document.getElementById("virtualKeyboard").disabled = true;
  gamePanel.classList.add("d-none");
  countPanel.classList.remove("d-none");
  counter.textContent = 3;
  const timer = setInterval(() => {
    const counter = document.getElementById("counter");
    const colors = ["skyblue", "greenyellow", "violet", "tomato"];
    if (parseInt(counter.textContent) > 1) {
      const t = parseInt(counter.textContent) - 1;
      counter.style.backgroundColor = colors[t];
      counter.textContent = t;
    } else {
      countdowning = false;
      playing = true;
      clearInterval(timer);
      document.getElementById("guideSwitch").disabled = false;
      document.getElementById("virtualKeyboard").disabled = false;
      gamePanel.classList.remove("d-none");
      countPanel.classList.add("d-none");
      infoPanel.classList.remove("d-none");
      playPanel.classList.remove("d-none");
      aaOuter.classList.remove("d-none");
      scorePanel.classList.add("d-none");
      resizeFontSize(aa);
      typable();
      startTypeTimer();
      if (localStorage.getItem("bgm") == 1) {
        bgm.play();
      }
      startButton.disabled = false;
    }
  }, 1000);
}

function replay() {
  clearInterval(typeTimer);
  removeGuide(romaNode.childNodes[typeIndex]);
  initTime();
  countdown();
  countPanel.classList.remove("d-none");
  scorePanel.classList.add("d-none");
}

function startTypeTimer() {
  const timeNode = document.getElementById("time");
  typeTimer = setInterval(() => {
    const t = parseInt(timeNode.textContent);
    if (t > 0) {
      timeNode.textContent = t - 1;
    } else {
      clearInterval(typeTimer);
      bgm.pause();
      playAudio(endAudio);
      scoring();
    }
  }, 1000);
}

function initTime() {
  document.getElementById("time").textContent = gameTime;
}

gradeOption.addEventListener("change", () => {
  initTime();
  clearInterval(typeTimer);
});

function scoring() {
  playing = false;
  infoPanel.classList.remove("d-none");
  playPanel.classList.add("d-none");
  aaOuter.classList.add("d-none");
  countPanel.classList.add("d-none");
  scorePanel.classList.remove("d-none");
  let time = parseInt(document.getElementById("time").textContent);
  if (time < gameTime) {
    time = gameTime - time;
  }
  const typeSpeed = (normalCount / time).toFixed(2);
  document.getElementById("totalType").textContent = normalCount + errorCount;
  document.getElementById("typeSpeed").textContent = typeSpeed;
  document.getElementById("errorType").textContent = errorCount;
}

function changeGrade() {
  const grade = gradeOption.selectedIndex;
  if (grade == 0) {
    simpleKeyboard.setOptions({ layoutName: "default" });
  } else {
    simpleKeyboard.setOptions({ layoutName: "shift" });
  }
}

resizeFontSize(aa);

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("toggleBGM").onclick = toggleBGM;
document.getElementById("virtualKeyboard").onclick = toggleKeyboard;
window.addEventListener("resize", () => {
  resizeFontSize(aa);
});
document.getElementById("gradeOption").onchange = changeGrade;
document.getElementById("guideSwitch").onchange = toggleGuide;
startButton.addEventListener("click", replay);
document.addEventListener("keydown", typeEvent);
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
