import React, { useState, useRef } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";
import "./Reco.css";
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

let isCodecRegistered = false; // Глобальная переменная для отслеживания состояния регистрации кодека

const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);

    // useEffect(() => {
    //     // Регистрация кодека при монтировании компонента
    //     if (!isCodecRegistered) {
    //         const registerCodec = async () => {
    //             await register(await connect());
    //             isCodecRegistered = true; // Обновление состояния регистрации кодека
    //         };

    //         registerCodec();
    //     }
    // }, []);

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current.stop();
        } else {
            if (!isCodecRegistered) {
                await register(await connect());
                isCodecRegistered = true;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });
            console.log('Успешно отправлено:');

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = async (event) => {
                const formData = new FormData();
                formData.append("file", event.data, "audio.wav");
                let data = null;
                
                try {
                    const response = await fetch('http://localhost:8000/api/v1/site/recognize',  {
                        method: 'POST',
                        body: formData,
                        headers: {'Access-Control-Allow-Origin': '*'},
                        // mode: 'no-cors',
                    });
                    // .then(response => response.json())
                    // .then(data => console.log(data));
                    data = await response.json();
                    console.log('Успешно отправлено:', data);
                } catch (error) {
                    console.error('Ошибка при отправке:', error);
                }
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop());

                if (data.command === "MainPage") {
                    window.location.href = '/';
                } 

                if (data.command === "Help") {
                    window.location.href = '/contacts';
                } 

                if (data.command === "Yuri") {
                    window.location.href = '/projects';
                } 

                if (data.command === "Restart") {
                    window.location.reload();
                } 

                if (data.command === "Back") {
                    window.history.back();
                } 

            };
            mediaRecorder.start();
            setIsRecording(true);
        }
    };

    return (
        <div className="container">
            <button className="btn" onClick={toggleRecording}>
                <FaMicrophoneAlt className="record-btn" />
                {isRecording ? "Остановить запись" : "Начать запись"}
            </button>
        </div>
    );
};

export default Recorder;
