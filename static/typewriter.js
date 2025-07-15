// 타이핑 효과 함수 (\n을 <br>로 변환)
function typeWriter(text, element, speed=40, callback) {
  let i = 0;
  element.innerHTML = '';
  function typing() {
    if (i < text.length) {
      if (text[i] === '\n') {
        element.innerHTML += '<br>';
      } else {
        element.innerHTML += text[i];
      }
      i++;
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }
  typing();
}

let records = [];
let meditationStart, meditationElapsed = 0;

function clearUI() {
  document.getElementById('typewriter').innerHTML = '';
  document.getElementById('main-content').innerHTML = '';
}

function showTypewriterAndMain(typewriterText, mainHtml, afterMain) {
  clearUI();
  const tw = document.getElementById('typewriter');
  typeWriter(typewriterText, tw, 40, () => {
    document.getElementById('main-content').innerHTML = mainHtml;
    if (afterMain) afterMain();
  });
}

function startMeditationApp() {
  showTypewriterAndMain(
    '안녕하세요. 선명상 프로그램에 오신 것을 환영합니다.\n먼저 편안한 자세로 앉아주세요.',
    '',
    () => setTimeout(() => {
      showTypewriterAndMain(
        '깊게 숨을 들이마시고, 천천히 내쉬면서 현재 순간에 집중해보세요.\n떠오르는 생각들을 판단하지 않고, 그저 흘러가도록 두세요.',
        '',
        () => setTimeout(() => {
          showTypewriterAndMain(
            '자, 그럼 5분 명상을 시작하겠습니다.',
            `<div class="timer" id="timer">00:00</div>
             <button id="endBtn" class="main-btn">명상 종료</button>`,
            () => {
              meditationStart = Date.now();
              let timerInt = setInterval(() => {
                meditationElapsed = Math.floor((Date.now() - meditationStart) / 1000);
                let m = String(Math.floor(meditationElapsed/60)).padStart(2,'0');
                let s = String(meditationElapsed%60).padStart(2,'0');
                document.getElementById('timer').textContent = m+':'+s;
              }, 1000);
              document.getElementById('endBtn').onclick = () => {
                clearInterval(timerInt);
                records.push(`[명상 경과 시간] ${Math.floor(meditationElapsed/60)}분 ${meditationElapsed%60}초`);
                showReflection1();
              };
            }
          );
        }, 2000)
      );
    }, 2000)
  );
}

function showReflection1() {
  showTypewriterAndMain(
    '마음이 차분해졌다면, 이제 자신을 성찰하는 시간을 갖도록 하겠습니다.',
    `<div class="reflection-guide">나의 오늘 하루를 반성하며, 좋고 나쁜 일들 그리고 감정을 기록해보세요.</div>
     <textarea id="reflection1" rows="6" class="main-textarea"></textarea>
     <div class="input-btns">
       <button id="submit1" class="main-btn">제출하기</button>
       <button id="voice1" class="voice-btn-red">음성 인식</button>
     </div>`,
    () => {
      document.getElementById('submit1').onclick = () => {
        let val = document.getElementById('reflection1').value.trim();
        if(val.length < 10) { alert('조금 더 자세히 작성해 주세요.'); return; }
        records.push(`[하루 반성] ${val}`);
        showReflection2();
      };
      document.getElementById('voice1').onclick = () => startVoiceInput('reflection1');
    }
  );
}

function showReflection2() {
  showTypewriterAndMain(
    '하루를 반성한 뒤, 나의 마음은 어떤가요?\n그리고 그 감정을 바라보고 있는 \'나\'는 어떤 존재인가요?',
    `<div class="reflection-guide">나의 마음과 '나'에 대해 자유롭게 적어보세요.</div>
     <textarea id="reflection2" rows="6" class="main-textarea"></textarea>
     <div class="input-btns">
       <button id="submit2" class="main-btn">제출하기</button>
       <button id="voice2" class="voice-btn-red">음성 인식</button>
     </div>`,
    () => {
      document.getElementById('submit2').onclick = () => {
        let val = document.getElementById('reflection2').value.trim();
        if(val.length < 10) { alert('조금 더 자세히 작성해 주세요.'); return; }
        records.push(`[마음 성찰] ${val}`);
        showSurvey();
      };
      document.getElementById('voice2').onclick = () => startVoiceInput('reflection2');
    }
  );
}

function showSurvey() {
  showTypewriterAndMain(
    '선명상 기록지',
    `<div class="survey-form">
      <div>
        <label>1. 선명상 장소: 
          <div class="input-with-mic">
            <input id="place" class="main-input">
            <button type="button" class="voice-btn-circle" onclick="startVoiceInput('place')" title="음성 인식">
              <span class="mic-svg"></span>
            </button>
          </div>
        </label>
      </div>
      <div class="focus-group">
        <span class="input-label">2. 집중도:</span>
        <div id="focusBtns" class="focus-btns">
          <button type="button" class="focus-btn" data-value="수">수</button>
          <button type="button" class="focus-btn" data-value="우">우</button>
          <button type="button" class="focus-btn" data-value="미">미</button>
          <button type="button" class="focus-btn" data-value="양">양</button>
          <button type="button" class="focus-btn" data-value="가">가</button>
        </div>
      </div>
      <div>
        <label>3. 선명상 소감:<br>
          <div class="input-with-mic">
            <textarea id="impression" rows="3" class="main-textarea"></textarea>
            <button type="button" class="voice-btn-circle" onclick="startVoiceInput('impression')" title="음성 인식">
              <span class="mic-svg"></span>
            </button>
          </div>
        </label>
      </div>
      <div>
        <label>4. 의문 사항:<br>
          <div class="input-with-mic">
            <textarea id="doubt" rows="3" class="main-textarea"></textarea>
            <button type="button" class="voice-btn-circle" onclick="startVoiceInput('doubt')" title="음성 인식">
              <span class="mic-svg"></span>
            </button>
          </div>
        </label>
      </div>
      <button id="surveySubmit" class="main-btn">제출</button>
    </div>`,
    () => {
      let selectedFocus = '';
      document.querySelectorAll('.focus-btn').forEach(btn => {
        btn.onclick = function() {
          document.querySelectorAll('.focus-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedFocus = btn.getAttribute('data-value');
        };
      });
      document.getElementById('surveySubmit').onclick = () => {
        let place = document.getElementById('place').value.trim();
        let impression = document.getElementById('impression').value.trim();
        let doubt = document.getElementById('doubt').value.trim();
        let survey = `[선명상 기록지]\n1. 선명상 장소: ${place}\n2. 집중도: ${selectedFocus}\n3. 선명상 소감: ${impression}\n4. 의문 사항: ${doubt}`;
        records.push(survey);
        showFinal();
      };
    }
  );
}

function showFinal() {
  showTypewriterAndMain(
    '오늘의 수행을 마칩니다.\n꾸준한 성찰과 내면의 성장이 있기를 바랍니다.',
    '',
    () => setTimeout(() => {
      showTypewriterAndMain(
        '프로그램 종료 전 오늘의 기록을 저장합니다.\n잠시만 기다려주세요.',
        `<button class="main-btn" onclick="downloadRecords()">기록 저장하기</button>`,
        null
      );
    }, 2000)
  );
}

function downloadRecords() {
  let now = new Date();
  let ts = now.toLocaleString();
  let content = `[기록 저장 시각] ${ts}\n\n` + records.join('\n\n');
  let blob = new Blob([content], {type: 'text/plain'});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'meditation_' + now.toISOString().slice(0,19).replace(/[:T]/g,'-') + '.txt';
  a.click();
}

function startVoiceInput(targetId) {
  if (!('webkitSpeechRecognition' in window)) {
    alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.onresult = function(event) {
    const el = document.getElementById(targetId);
    if (el) {
      el.focus();
      el.value += event.results[0][0].transcript;
    }
  };
  // 버튼을 누르면 입력창에 먼저 focus를 줌
  const el = document.getElementById(targetId);
  if (el) el.focus();
  recognition.start();
} 