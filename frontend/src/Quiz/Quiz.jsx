import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../helpers/Context';
import Container from '@mui/material/Container';
import StudentInfoForm from './StudentInfoForm';
import QuizForm from './QuizForm';

const Quiz = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        indeks: "",
    });
    const [timeLeft, setTimeLeft] = useState(null);
    const [topic, setTopic] = useState("")
    const [quiz, setQuiz] = useState({});
    const [odp, setOdp] = useState({});
    const { code } = useParams();
    const { setVisi } = useContext(Context);
    const [requiredscoretopass, setRequiredscoretopass] = useState(0)
    const [numberofquestions, setNumberofquestions] = useState(0)
    useEffect(() => {
        setVisi({ status: false });
        axios.get(`http://localhost:8000/api/quiz/${code}/`)
            .then(res => {
                setQuiz(res.data);
                const initialAnswers = {};
                res.data.data.forEach((question) => {
                    const questionKey = Object.keys(question)[0];
                    initialAnswers[questionKey] = [];
                });
                setOdp(initialAnswers);
                setTopic(res.data.topic)
                setRequiredscoretopass(res.data.required_score_to_pass)
                setNumberofquestions(res.data.number_of_questions)
                if (res.data.time) {
                    setTimeLeft(res.data.time * 60);
                }
            });
    }, [code]);

    const handleAnswerChange = (questionKey, answerText) => {
        setOdp(prev => ({
            ...prev,
            [questionKey]: [answerText]
        }));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const anuluj = () => {
        window.location.href = '/';
    }
    const sendAnswers = (finalAnswers = odp) => {


        const payload = {
            ...formData,
            quiz_id: quiz.id,
            answers: finalAnswers
        };

        axios.post(`http://localhost:8000/api/check/${code}/`, payload)
            .then(res => {


            })
            .catch(err => console.error(err));
    };

    return (
        <Container component="main" maxWidth="xs">
            {step === 1 ? (
                <StudentInfoForm
                    number_of_questions={numberofquestions}
                    required_score_to_pass={requiredscoretopass}
                    topic={topic}
                    time={timeLeft}
                    formData={formData}
                    handleChange={handleChange}
                    anuluj={anuluj}
                    onNext={() => setStep(2)}
                />
            ) : (
                <QuizForm
                    quiz={quiz}
                    odp={odp}
                    handleAnswerChange={handleAnswerChange}
                    sendAnswers={sendAnswers}
                    time={quiz.time}
                />
            )}
        </Container>
    );
};

export default Quiz;
