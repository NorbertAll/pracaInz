import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../helpers/Context';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Test = () => {
    const [quiz, setQuiz] = useState({});
    const [odp, setOdp] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);

    const { code } = useParams();
    const { setVisi } = useContext(Context);
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!quiz.time || timeLeft === null) return;

        if (timeLeft <= 0) {
            sendAnswers();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    sendAnswers();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz.time, timeLeft]);

    const handleAnswerChange = (questionKey, answerText) => {
        setOdp(prevOdp => ({
            ...prevOdp,
            [questionKey]: [answerText]
        }));
    };
    const handleBack = () => {
        if (window.confirm("Czy na Anulować odpowiedzi i wrócić do listy pytań")) {
            window.location.href = "/exapmplequiz";
        }
    }
    const confirmAndSend = () => {
        if (window.confirm("Czy na pewno chcesz zakończyć test i wysłać odpowiedzi?")) {
            sendAnswers();
        }
    };
    const sendAnswers = () => {
        const filledAnswers = { ...odp };
        for (const key in filledAnswers) {
            if (filledAnswers[key].length === 0) {
                filledAnswers[key] = ["brak odpowiedzi"];
            }
        }

        localStorage.setItem("answers", JSON.stringify(filledAnswers));
        navigate(`/results/${code}`);
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
            {timeLeft !== null && (
                <Typography variant="h6" sx={{ mt: 1, color: timeLeft <= 30 ? 'red' : 'black' }}>
                    ⏳ Pozostały czas: {formatTime(timeLeft)}
                </Typography>
            )}

            {quiz.data && quiz.data.map((questionData, i) => {
                const questionKey = Object.keys(questionData)[0];
                const answers = questionData[questionKey];

                return (
                    <Box key={i} sx={{ mt: 3 }}>
                        <Typography component='h1' variant="h6">
                            {questionKey}
                        </Typography>

                        <RadioGroup>
                            {answers.map((answerText, id) => (
                                <FormControlLabel
                                    key={id}
                                    control={
                                        <Radio
                                            value={answerText}
                                            color="primary"
                                            checked={odp[questionKey]?.[0] === answerText}
                                            onChange={() => handleAnswerChange(questionKey, answerText)}
                                        />
                                    }
                                    label={answerText}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                );
            })}

            <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={confirmAndSend}
                sx={{ mt: 4 }}
            >
                Zatwierdź odpowiedzi
            </Button>

            <Button variant="secondary" className="w-100" onClick={handleBack}>
                Anuluj
            </Button>
        </Container>
    );
};

export default Test;
