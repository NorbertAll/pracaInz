import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../helpers/Context';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';


const Test = () => {

    const [quiz, setQuiz] = useState({});
    const [odp, setOdp] = useState({});

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
                    initialAnswers[questionKey] = []; // zachowujemy jako tablica
                });
                setOdp(initialAnswers);
            });
    }, [code]);

    const handleAnswerChange = (questionKey, answerText) => {
        setOdp(prevOdp => ({
            ...prevOdp,
            [questionKey]: [answerText] // tylko jedna odpowiedź jako element w tablicy
        }));
    };

    const sendAnswers = () => {
        const allAnswered = Object.values(odp).every(ans => ans.length > 0);
        if (!allAnswered) {
            alert("Odpowiedz na wszystkie pytania przed wysłaniem.");
            return;
        }


        localStorage.setItem("answers", JSON.stringify(odp));
        navigate(`/results/${code}`)


    };

    return (
        <Container component="main" maxWidth="xs">
            <h1>{quiz.title}</h1>
            {quiz.data && quiz.data.map((questionData, i) => {
                const questionKey = Object.keys(questionData)[0];
                const answers = questionData[questionKey];

                return (
                    <div key={i}>
                        <Typography component='h1' variant="h6" sx={{ mt: 3 }}>
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
                onClick={sendAnswers}
                sx={{ mt: 4 }}
            >
                Zatwierdź odpowiedzi
            </Button>
        </Container>
    );
};

export default Test;