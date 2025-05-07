import React, { useEffect, useState } from 'react';
import {
    Typography,
    Container,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const QuizForm = ({ quiz, odp, handleAnswerChange, sendAnswers }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (quiz.time) {
            setTimeLeft(quiz.time * 60);
        }
    }, [quiz]);


    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            handleSend();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleSend = () => {
        const filledAnswers = { ...odp };
        for (const key in filledAnswers) {
            if (filledAnswers[key].length === 0) {
                filledAnswers[key] = ["brak odpowiedzi"];
            }
        }
        sendAnswers(filledAnswers);
        setOpenSnackbar(true);
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
                {quiz.title}
            </Typography>

            {timeLeft !== null && (
                <Typography variant="h6" sx={{ mb: 2 }}>
                    ⏳ Pozostały czas: {formatTime(timeLeft)}
                </Typography>
            )}

            {quiz.data && quiz.data.map((questionData, i) => {
                const questionKey = Object.keys(questionData)[0];
                const answers = questionData[questionKey];

                return (
                    <div key={i}>
                        <Typography component="h1" variant="h6" sx={{ mt: 3 }}>
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
                    </div>
                );
            })}

            <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSend}
                sx={{ mt: 4 }}
            >
                Zatwierdź odpowiedzi
            </Button>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    ✅ Test został pomyślnie wysłany!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default QuizForm;