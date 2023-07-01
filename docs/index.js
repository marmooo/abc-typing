const remSize=parseInt(getComputedStyle(document.documentElement).fontSize),gamePanel=document.getElementById("gamePanel"),playPanel=document.getElementById("playPanel"),infoPanel=document.getElementById("infoPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),aaOuter=document.getElementById("aaOuter"),startButton=document.getElementById("startButton"),romaNode=document.getElementById("roma"),gradeOption=document.getElementById("gradeOption"),aa=document.getElementById("aa"),tmpCanvas=document.createElement("canvas"),alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ",gameTime=60;let playing,countdowning,typeTimer;const bgm=new Audio("mp3/bgm.mp3");bgm.volume=.3,bgm.loop=!0;let typeIndex=0,errorCount=0,normalCount=0,solveCount=0,guide=!0;const layout109={default:["q w e r t y u i o p","a s d f g h j k l ;","z x c v b n m , ."],shift:["Q W E R T Y U I O P","A S D F G H J K L +","Z X C V B N M < >"]},simpleKeyboard=new SimpleKeyboard.default({layout:layout109,onKeyPress:a=>{typeEventKey(a)}}),audioContext=new AudioContext,audioBufferCache={};loadAudio("end","mp3/end.mp3"),loadAudio("keyboard","mp3/keyboard.mp3"),loadAudio("correct","mp3/correct.mp3"),loadAudio("incorrect","mp3/cat.mp3");let englishVoices=[];loadVoices(),loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark"),localStorage.getItem("bgm")!=1&&(document.getElementById("bgmOn").classList.add("d-none"),document.getElementById("bgmOff").classList.remove("d-none"))}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}function toggleBGM(){localStorage.getItem("bgm")==1?(document.getElementById("bgmOn").classList.add("d-none"),document.getElementById("bgmOff").classList.remove("d-none"),localStorage.setItem("bgm",0),bgm.pause()):(document.getElementById("bgmOn").classList.remove("d-none"),document.getElementById("bgmOff").classList.add("d-none"),localStorage.setItem("bgm",1),bgm.play())}function toggleKeyboard(){const a=document.getElementById("virtualKeyboardOn"),b=document.getElementById("virtualKeyboardOff");a.classList.contains("d-none")?(a.classList.remove("d-none"),b.classList.add("d-none"),document.getElementById("keyboard").classList.remove("d-none"),resizeFontSize(aa)):(a.classList.add("d-none"),b.classList.remove("d-none"),document.getElementById("keyboard").classList.add("d-none"),document.getElementById("guideSwitch").checked=!1,guide=!1,resizeFontSize(aa))}function toggleGuide(a){a.target.checked?guide=!0:guide=!1}async function playAudio(b,c){const d=await loadAudio(b,audioBufferCache[b]),a=audioContext.createBufferSource();if(a.buffer=d,c){const b=audioContext.createGain();b.gain.value=c,b.connect(audioContext.destination),a.connect(b),a.start()}else a.connect(audioContext.destination),a.start()}async function loadAudio(a,c){if(audioBufferCache[a])return audioBufferCache[a];const d=await fetch(c),e=await d.arrayBuffer(),b=await audioContext.decodeAudioData(e);return audioBufferCache[a]=b,b}function unlockAudio(){audioContext.resume()}function loadVoices(){const a=new Promise(b=>{let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}}),b=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"];a.then(a=>{englishVoices=a.filter(a=>a.lang=="en-US").filter(a=>!b.includes(a.voiceURI))})}function loopVoice(b,c){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);a.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],a.lang="en-US";for(let b=0;b<c;b++)speechSynthesis.speak(a)}function typeNormal(a){a.style.visibility="visible",playAudio("keyboard"),a.classList.add("typed"),typeIndex+=1,normalCount+=1}function underlineSpace(a){a.textContent==" "&&a.style.removeProperty("text-decoration");const b=a.nextElementSibling;b&&b.textContent==" "&&(b.style.textDecoration="underline")}function nextProblem(){playAudio("correct"),typeIndex=0,solveCount+=1,typable()}function removeGuide(b){const c=b.previousSiblingElement;if(c){let a=c.textContent;gradeOption.selectedIndex==0?a=a.toUpperCase():a=a.toLowerCase();const b=simpleKeyboard.getButtonElement(a);b.classList.remove("guide")}let a=b.textContent;gradeOption.selectedIndex==1?a=a.toUpperCase():a=a.toLowerCase(),a==" "&&(a="{space}");const d=simpleKeyboard.getButtonElement(a);d&&d.classList.remove("guide")}function showGuide(a){if(guide){let b=a.textContent;gradeOption.selectedIndex==1?b=b.toUpperCase():b=b.toLowerCase();const c=simpleKeyboard.getButtonElement(b);c&&c.classList.add("guide")}}function typeEvent(a){switch(a.code){case"Space":a.preventDefault();default:return typeEventKey(a.key)}}function typeEventKey(b){switch(b){case"Escape":replay();return;case" ":if(!playing){replay();return}}const a=romaNode.childNodes[typeIndex];/^[^0-9]$/.test(b)&&(b.toLowerCase()==a.textContent.toLowerCase()?(typeNormal(a),removeGuide(a),underlineSpace(a)):(playAudio("incorrect",.3),errorCount+=1),typeIndex==romaNode.childNodes.length?nextProblem():showGuide(romaNode.childNodes[typeIndex]))}function resizeFontSize(a){function n(b,c){const a=tmpCanvas.getContext("2d");a.font=c;const d=a.measureText(b);return d.width}function i(g,c,d,e){const b=g.split("\n"),f=c+"px "+d;let a=0;for(let c=0;c<b.length;c++){const d=n(b[c],f);a<d&&(a=d)}return[a,c*b.length*e]}function m(a){const b=parseFloat(a.paddingLeft)+parseFloat(a.paddingRight),c=parseFloat(a.paddingTop)+parseFloat(a.paddingBottom);return[b,c]}const b=getComputedStyle(a),l=b.fontFamily,c=parseFloat(b.fontSize),o=parseFloat(b.lineHeight)/c,j=aaOuter.offsetHeight,k=infoPanel.clientWidth,h=[k,j],f=i(a.textContent,c,l,o),g=m(b),d=c*(h[0]-g[0])/f[0]*.9,e=c*(h[1]-g[1])/f[1]*.9;e<d?e<remSize?a.style.fontSize=remSize+"px":a.style.fontSize=e+"px":d<remSize?a.style.fontSize=remSize+"px":a.style.fontSize=d+"px"}function typable(){let a;if(gradeOption.selectedIndex>=2?a=alphabet[solveCount]:a=alphabet[solveCount],solveCount>=26)speechSynthesis.cancel(),clearInterval(typeTimer),bgm.pause(),playAudio("end"),scoring();else{aa.textContent=a+" "+a.toLowerCase();const b=a;for(loopVoice(b.toLowerCase(),10);romaNode.firstChild;)romaNode.removeChild(romaNode.firstChild);for(let a=0;a<b.length;a++){const c=document.createElement("span");c.textContent=b[a],romaNode.appendChild(c)}resizeFontSize(aa),showGuide(romaNode.childNodes[0])}}function countdown(){if(countdowning)return;countdowning=!0,typeIndex=normalCount=errorCount=solveCount=0,document.getElementById("guideSwitch").disabled=!0,document.getElementById("virtualKeyboard").disabled=!0,gamePanel.classList.add("d-none"),countPanel.classList.remove("d-none"),counter.textContent=3;const a=setInterval(()=>{const b=document.getElementById("counter"),c=["skyblue","greenyellow","violet","tomato"];if(parseInt(b.textContent)>1){const a=parseInt(b.textContent)-1;b.style.backgroundColor=c[a],b.textContent=a}else countdowning=!1,playing=!0,clearInterval(a),document.getElementById("guideSwitch").disabled=!1,document.getElementById("virtualKeyboard").disabled=!1,gamePanel.classList.remove("d-none"),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),aaOuter.classList.remove("d-none"),scorePanel.classList.add("d-none"),resizeFontSize(aa),typable(),startTypeTimer(),localStorage.getItem("bgm")==1&&bgm.play(),startButton.disabled=!1},1e3)}function replay(){clearInterval(typeTimer),removeGuide(romaNode.childNodes[typeIndex]),initTime(),countdown(),countPanel.classList.remove("d-none"),scorePanel.classList.add("d-none")}function startTypeTimer(){const a=document.getElementById("time");typeTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(typeTimer),bgm.pause(),playAudio("end"),scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}gradeOption.addEventListener("change",()=>{initTime(),clearInterval(typeTimer)});function scoring(){playing=!1,infoPanel.classList.remove("d-none"),playPanel.classList.add("d-none"),aaOuter.classList.add("d-none"),countPanel.classList.add("d-none"),scorePanel.classList.remove("d-none");let a=parseInt(document.getElementById("time").textContent);a<gameTime&&(a=gameTime-a);const b=(normalCount/a).toFixed(2);document.getElementById("totalType").textContent=normalCount+errorCount,document.getElementById("typeSpeed").textContent=b,document.getElementById("errorType").textContent=errorCount}function changeGrade(){const a=gradeOption.selectedIndex;a==0?simpleKeyboard.setOptions({layoutName:"default"}):simpleKeyboard.setOptions({layoutName:"shift"})}resizeFontSize(aa),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("toggleBGM").onclick=toggleBGM,document.getElementById("virtualKeyboard").onclick=toggleKeyboard,window.addEventListener("resize",()=>{resizeFontSize(aa)}),document.getElementById("gradeOption").onchange=changeGrade,document.getElementById("guideSwitch").onchange=toggleGuide,startButton.addEventListener("click",replay),document.addEventListener("keydown",typeEvent),document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})