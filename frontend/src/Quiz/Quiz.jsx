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
    const [quiz, setQuiz] = useState({});
    const [odp, setOdp] = useState({});
    const { code } = useParams();
    const { setVisi } = useContext(Context);

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

    const sendAnswers = () => {
        const allAnswered = Object.values(odp).every(ans => ans.length > 0);
        if (!allAnswered) {
            alert("Odpowiedz na wszystkie pytania przed wysłaniem.");
            return;
        }

        const payload = {
            ...formData,
            quiz_id: quiz.id,
            answers: odp
        };

        axios.post(`http://localhost:8000/api/check/${code}/`, payload)
            .then(res => {
                alert("Test wysłano");
                // Możesz przejść dalej, np. navigate("/result") itp.
            })
            .catch(err => console.error(err));
    };

    return (
        <Container component="main" maxWidth="xs">
            {step === 1 ? (
                <StudentInfoForm
                    formData={formData}
                    handleChange={handleChange}
                    onNext={() => setStep(2)}
                />
            ) : (
                <QuizForm
                    quiz={quiz}
                    odp={odp}
                    handleAnswerChange={handleAnswerChange}
                    sendAnswers={sendAnswers}

                />
            )}
        </Container>
    );
};

export default Quiz;
