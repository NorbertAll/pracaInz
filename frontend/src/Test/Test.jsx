import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../helpers/Context';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ConfirmDialog from '../Components/ConfirmDialog'; // ← Upewnij się, że ścieżka jest poprawna

const Test = () => {
    const [quiz, setQuiz] = useState({});
    const [odp, setOdp] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);

    const { code } = useParams();
    const { setVisi } = useContext(Context);
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(""); // "send" lub "cancel"

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
        setDialogType("cancel");
        setDialogOpen(true);
    };

    const confirmAndSend = () => {
        setDialogType("send");
        setDialogOpen(true);
    };

    const handleDialogConfirm = () => {
        setDialogOpen(false);
        if (dialogType === "cancel") {
            window.location.href = "/exapmplequiz"
        } else if (dialogType === "send") {
            sendAnswers();
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
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
                fullWidth
            >
                Zatwierdź odpowiedzi
            </Button>

            <Button
                variant="outlined"
                color="error"
                onClick={handleBack}
                fullWidth
                sx={{ mt: 2 }}
            >
                Anuluj
            </Button>

            <ConfirmDialog
                open={dialogOpen}
                title={dialogType === "send" ? "Zakończyć test?" : "Anulować test?"}
                message={
                    dialogType === "send"
                        ? "Czy na pewno chcesz zakończyć test i wysłać odpowiedzi?"
                        : "Czy na pewno chcesz anulować odpowiedzi i wrócić do listy quizów?"
                }
                onConfirm={handleDialogConfirm}
                onClose={handleDialogClose}
            />
        </Container>
    );
};

export default Test;