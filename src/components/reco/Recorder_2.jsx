import React, { useEffect} from 'react';
import { MediaRecorder } from 'extendable-media-recorder';
import { Recorder_2_func } from './Recorder_2_func';

await Recorder_2_func();

function Recorder_2() {
    useEffect(() => {
        async function initRecorder () {
            

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                let recorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });
                console.log('Запись началась.');
                recorder.start();

                recorder.ondataavailable = async (event) => {
                    const formData = new FormData();
                    formData.append("file", event.data, "audio.wav");
                    let data = null;
                    try {
                        const response = await fetch('http://localhost:8000/api/v1/site/recognize', {
                            method: 'POST',
                            body: formData,
                            headers: {'Access-Control-Allow-Origin': '*'},
                        });
                        data = await response.json();
                        console.log('Успешно отправлено:', data);
                        } catch (error) {
                        console.error('Ошибка при отправке:', error);
                        };

                    stream.getTracks().forEach(track => track.stop());

                    if (data?.command === "MainPage") {
                        window.location.href = '/';
                    } else if (data?.command === "Help") {
                        window.location.href = '/contacts';
                    } else if (data?.command === "Restart") {
                        window.location.reload();
                    } else if (data?.command === "Back") {
                        window.history.back();
                    } else if (data?.command === "other") {
                        await initRecorder();
                    }
                };

                setTimeout(() => {
                    recorder.stop();
                    console.log('Запись остановлена');
                }, 5000);
                recorder.removeEventListener('dataavailable', initRecorder);
            } catch (error) {
                console.error('Ошибка при получении аудио потока:', error);
            };
        };

        initRecorder();
    }, []);

    return (
        <div>
            
        </div>
    );
};

export default Recorder_2;
