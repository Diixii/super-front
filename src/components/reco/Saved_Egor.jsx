import React, { useState, useEffect, useRef } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";
import "./Reco.css";
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

let isCodecRegistered = false;

const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const [audioLevel, setAudioLevel] = useState(0);

    // Функция для начала записи
    const startRecording = async () => {
        if (!isCodecRegistered) {
            await register(await connect());
            isCodecRegistered = true;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        setIsRecording(true);
    };

    // Функция для остановки записи
    const stopRecording = () => {
        mediaRecorderRef.current && mediaRecorderRef.current.stop();
    };

    useEffect(() => {
        if (!isCodecRegistered) {
            const registerCodec = async () => {
                await register(await connect());
                isCodecRegistered = true;
            };

            registerCodec();
        }

        // Инициализация AudioContext и обработчика уровня звука
        const initAudioContext = async () => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(2048, 1, 1);

            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                let sum = 0.0;

                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                const db = 20 * Math.log10(rms);
                setAudioLevel(db);
            };
        };

        initAudioContext();

        return () => {
            audioContextRef.current && audioContextRef.current.close();
        };
    }, []);

    useEffect(() => {
        // Запуск или остановка записи в зависимости от уровня звука
        if (audioLevel > 50 && !isRecording) {
            startRecording();
        } else if (audioLevel <= 50 && isRecording) {
            stopRecording();
        }
    }, [audioLevel, isRecording, startRecording]); // Добавление startRecording в массив зависимостей

    // Функция для обработки доступных данных
    const handleDataAvailable = async (event) => {
        // Отправка данных на сервер и другие действия
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

    return (
        <div className="container">
            <FaMicrophoneAlt className={`record-btn ${isRecording ? "recording" : ""}`} />
        </div>
    );
};

export default Recorder;
