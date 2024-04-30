const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'ru-RU';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export default function Recorder() {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isRecording = false;
  let mediaRecorder;
  // let transcriptElement = document.getElementById('transcript');
  let audioChunks = [];

  recognition.onstart = function() {
    console.log('Голосовое распознавание активировано. Начните говорить.');
  };

  recognition.onresult = function(event) {
    const lastResultIndex = event.results.length - 1;
    const speechResult = event.results[lastResultIndex][0].transcript;
    // transcriptElement.textContent = 'Распознанный текст: ' + speechResult;
    console.log('Результат: ' + speechResult);
    recognition.continuous = true;
    recognition.start();
    if (!isRecording) {
      startRecording();
    }
  };

  recognition.onend = function() {
    if (isRecording) {
      mediaRecorder.stop();
      console.log('Запись остановлена.');
    }
    console.log('Голосовое распознавание остановлено.');
  };

  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        isRecording = true;
        console.log('Запись началась.');

        mediaRecorder.ondataavailable = function(e) {
          audioChunks.push(e.data);
        };

        mediaRecorder.onstop = function() {
          const audioBlob = new Blob(audioChunks, { 'type' : 'audio/wav; codecs=opus' });
          const formData = new FormData();
          formData.append('audioFile', audioBlob, 'recording.wav');
          
          fetch('URL_СЕРВЕРА', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            console.log('Файл успешно отправлен:', data);
          })
          .catch(error => {
            console.error('Ошибка при отправке файла:', error);
          });
        };
      })
      .catch(function(err) {
        console.log('Ошибка при получении аудио потока: ' + err);
      });
  }

  window.onload = function() {
    recognition.start();
  };
};

